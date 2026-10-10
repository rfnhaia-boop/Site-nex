import { cookies } from 'next/headers';
import { streamText } from 'ai';
import { geminiModel } from '@/lib/agent/gemini';
import { CHAT_CHAIN } from '@/lib/agent/groq';
import { buildSystemPrompt } from '@/lib/agent/systemPrompt';
import { extractAndSaveLead } from '@/lib/agent/leadIntelligence';
import { extractAnalysisFields, triggerNexOsAnalysis } from '@/lib/agent/nexOsAnalysis';
import { trackConversationToNexCore } from '@/lib/agent/nexSiteTracking';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SESSION_COOKIE = 'nex_session';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES_PER_REQUEST = 60;

// Cache de respostas para a 1ª mensagem de cada conversa (os botões/atalhos mandam sempre o mesmo texto).
// Poupa o limite por minuto do plano gratuito da Groq e responde na hora. Só para quem ainda não
// tem contexto salvo, pois o contexto muda a resposta.
const RESPONSE_CACHE = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX = 300;

export async function POST(request) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY/GEMINI_API_KEY não configuradas no .env.local.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { allowed } = checkRateLimit(`chat:${getClientIp(request)}`, 20);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Muitas mensagens em pouco tempo. Espera um instante.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => null);
  const { messages, currentPage, currentSection } = body ?? {};

  // Verifica a sessão de verdade no servidor -- nunca confia numa flag "authenticated"
  // mandada pelo próprio navegador (dava pra qualquer um forjar isso via fetch direto).
  const authSession = await auth();
  const authenticated = Boolean(authSession?.user?.email);

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'messages é obrigatório' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (messages.length > MAX_MESSAGES_PER_REQUEST) {
    return new Response(JSON.stringify({ error: 'Conversa muito longa para esta sessão.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const lastMessage = messages[messages.length - 1];
  if (
    !lastMessage ||
    lastMessage.role !== 'user' ||
    typeof lastMessage.content !== 'string' ||
    !lastMessage.content.trim()
  ) {
    return new Response(JSON.stringify({ error: 'Última mensagem precisa ser do usuário.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
    return new Response(JSON.stringify({ error: 'Mensagem muito longa.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  let session = sessionId ? await prisma.chatSession.findUnique({ where: { id: sessionId } }) : null;

  if (!session) {
    session = await prisma.chatSession.create({
      data: { currentPage: currentPage ?? '', currentSection: currentSection ?? '' },
    });
    sessionId = session.id;
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    });
  } else if (
    (currentPage && currentPage !== session.currentPage) ||
    (currentSection && currentSection !== session.currentSection)
  ) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: {
        currentPage: currentPage ?? session.currentPage,
        currentSection: currentSection ?? session.currentSection,
      },
    });
  }

  await prisma.chatMessage.create({
    data: { sessionId, role: 'user', content: lastMessage.content },
  });

  let lead = await prisma.lead.findUnique({ where: { sessionId } });
  const effectiveSection = currentSection ?? session.currentSection;

  // Captura o e-mail verificado do Google assim que a pessoa loga, em qualquer
  // seção -- independe do que a extração por IA (best-effort) conseguir ler da
  // conversa, então nunca falha por causa de instabilidade do modelo.
  if (authenticated && authSession.user.email && lead?.email !== authSession.user.email) {
    lead = await prisma.lead.upsert({
      where: { sessionId },
      create: { sessionId, email: authSession.user.email },
      update: { email: authSession.user.email },
    });
  }

  const systemPrompt = buildSystemPrompt({
    currentPage: currentPage ?? session.currentPage,
    currentSection: effectiveSection,
    leadContext: lead,
    authenticated,
    messages,
  });

  const encoder = new TextEncoder();

  const ATTEMPT_TIMEOUT_MS = 6000;

  // Tenta um modelo e transmite os pedaços direto pro cliente conforme chegam.
  // Só é seguro tentar de novo depois se voltar vazio (nada foi enviado ainda).
  // Tem timeout porque, quando o modelo trava (stream nunca fecha, sem erro nem
  // chunk nenhum), esperar o SDK resolver sozinho pode nunca acontecer -- sem
  // isso uma falha "muda" prendia a resposta por 20s+ antes de desistir.
  const cacheKey =
    messages.length === 1 && !lead?.empresa
      ? [currentPage ?? '', effectiveSection ?? '', authenticated, lastMessage.content.trim().toLowerCase()].join('|')
      : null;
  const cached = cacheKey ? RESPONSE_CACHE.get(cacheKey) : null;
  const cacheHit = cached && Date.now() - cached.at < CACHE_TTL_MS ? cached.text : null;

  async function attempt(model, controller, providerOptions) {
    let text = '';
    let closed = false;
    const abort = new AbortController();
    const timer = setTimeout(() => {
      // Sem resposta a tempo: corta de verdade (senão o fluxo atrasado se mistura com a próxima tentativa).
      closed = true;
      abort.abort();
    }, ATTEMPT_TIMEOUT_MS);
    try {
      // maxRetries: 0 -- o próprio SDK tentaria de novo com espera quando bate o limite (429); aqui o
      // rodízio de modelos já faz isso, bem mais rápido.
      const result = streamText({ model, system: systemPrompt, messages, providerOptions, abortSignal: abort.signal, maxRetries: 0 });
      for await (const chunk of result.textStream) {
        if (closed) break;
        text += chunk;
        controller.enqueue(encoder.encode(chunk));
      }
    } catch (err) {
      if (!closed) console.error('[chat] falha ao chamar modelo:', err?.message || err);
    } finally {
      clearTimeout(timer);
      closed = true;
    }
    return text;
  }

  // Groq é a resposta principal (bem mais rápido). Às vezes volta vazio do nada
  // (falha passageira do modelo, não da nossa infra) -- tenta até 3 vezes antes
  // de cair pro Gemini, que hoje é reserva menos confiável (cota diária curta).
  const GROQ_ATTEMPTS = CHAT_CHAIN.length + 1; // percorre a fila toda e dá mais uma chance ao primeiro

  const stream = new ReadableStream({
    async start(controller) {
      let finalText = '';
      if (cacheHit) {
        finalText = cacheHit;
        controller.enqueue(encoder.encode(cacheHit));
      }
      // um modelo por vez; 429 (limite por minuto do plano gratuito) volta vazio na hora e passa pro próximo
      for (let i = 0; i < GROQ_ATTEMPTS && !finalText.trim(); i++) {
        finalText = await attempt(CHAT_CHAIN[i % CHAT_CHAIN.length], controller);
      }

      if (!finalText.trim() && process.env.GEMINI_API_KEY) {
        // thinkingBudget: 0 desliga o "raciocínio" interno do Gemini 2.5 -- pra um
        // chat de atendimento isso só soma segundos de espera escondidos, sem
        // melhorar a resposta visível.
        finalText = await attempt(geminiModel, controller, {
          google: { thinkingConfig: { thinkingBudget: 0 } },
        });
      }

      // Todos os modelos ocupados (picos no plano gratuito): em vez de erro, uma resposta honesta com saída.
      if (!finalText.trim()) {
        controller.enqueue(
          encoder.encode(
            'Estou com muita gente conversando agora e não consegui responder. Tenta de novo em 1 minuto ou fala direto com a equipe pelo WhatsApp: https://wa.me/5511936202934',
          ),
        );
      }

      controller.close();

      if (finalText.trim() && cacheKey && !cacheHit) {
        if (RESPONSE_CACHE.size >= CACHE_MAX) RESPONSE_CACHE.delete(RESPONSE_CACHE.keys().next().value);
        RESPONSE_CACHE.set(cacheKey, { text: finalText, at: Date.now() });
      }

      if (finalText.trim()) {
        await prisma.chatMessage.create({
          data: { sessionId, role: 'assistant', content: finalText },
        });

        const fullConversation = [...messages, { role: 'assistant', content: finalText }];
        const userTurns = messages.filter((m) => m.role === 'user').length;
        if (userTurns >= 2) {
          await extractAndSaveLead({ sessionId, messages: fullConversation });
        }

        if (effectiveSection === 'analise-ia' && authenticated) {
          const fields = await extractAnalysisFields(fullConversation);
          if (fields?.ready) {
            triggerNexOsAnalysis(sessionId, fields);
          }
        }

        trackConversationToNexCore(sessionId, fullConversation);
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
