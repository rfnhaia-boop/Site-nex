import { cookies } from 'next/headers';
import { streamText } from 'ai';
import { geminiModel } from '@/lib/agent/gemini';
import { groqModel } from '@/lib/agent/groq';
import { buildSystemPrompt } from '@/lib/agent/systemPrompt';
import { extractAndSaveLead } from '@/lib/agent/leadIntelligence';
import { extractAnalysisFields, triggerNexOsAnalysis } from '@/lib/agent/nexOsAnalysis';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { auth } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SESSION_COOKIE = 'nex_session';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES_PER_REQUEST = 60;

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
  });

  const encoder = new TextEncoder();

  const ATTEMPT_TIMEOUT_MS = 5000;

  // Tenta um modelo e transmite os pedaços direto pro cliente conforme chegam.
  // Só é seguro tentar de novo depois se voltar vazio (nada foi enviado ainda).
  // Tem timeout porque, quando o modelo trava (stream nunca fecha, sem erro nem
  // chunk nenhum), esperar o SDK resolver sozinho pode nunca acontecer -- sem
  // isso uma falha "muda" prendia a resposta por 20s+ antes de desistir.
  async function attempt(model, controller, providerOptions) {
    let text = '';
    try {
      const result = streamText({ model, system: systemPrompt, messages, providerOptions });
      const streamDone = (async () => {
        for await (const chunk of result.textStream) {
          text += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      })();
      await Promise.race([
        streamDone,
        new Promise((resolve) => setTimeout(resolve, ATTEMPT_TIMEOUT_MS)),
      ]);
    } catch (err) {
      console.error('[chat] falha ao chamar modelo:', err?.message || err);
    }
    return text;
  }

  // Groq é a resposta principal (bem mais rápido). Às vezes volta vazio do nada
  // (falha passageira do modelo, não da nossa infra) -- tenta até 3 vezes antes
  // de cair pro Gemini, que hoje é reserva menos confiável (cota diária curta).
  const GROQ_ATTEMPTS = 3;

  const stream = new ReadableStream({
    async start(controller) {
      let finalText = '';
      for (let i = 0; i < GROQ_ATTEMPTS && !finalText.trim(); i++) {
        finalText = await attempt(groqModel, controller);
      }

      if (!finalText.trim() && process.env.GEMINI_API_KEY) {
        // thinkingBudget: 0 desliga o "raciocínio" interno do Gemini 2.5 -- pra um
        // chat de atendimento isso só soma segundos de espera escondidos, sem
        // melhorar a resposta visível.
        finalText = await attempt(geminiModel, controller, {
          google: { thinkingConfig: { thinkingBudget: 0 } },
        });
      }

      controller.close();

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
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
