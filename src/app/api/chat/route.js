import { cookies } from 'next/headers';
import { streamText } from 'ai';
import { geminiModel } from '@/lib/agent/gemini';
import { groqModel } from '@/lib/agent/groq';
import { buildSystemPrompt } from '@/lib/agent/systemPrompt';
import { extractAndSaveLead } from '@/lib/agent/leadIntelligence';
import { extractAnalysisFields, triggerNexOsAnalysis } from '@/lib/agent/nexOsAnalysis';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const SESSION_COOKIE = 'nex_session';
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES_PER_REQUEST = 60;

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY não configurada no .env.local.' }),
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
  const { messages, currentPage, currentSection, authenticated } = body ?? {};

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

  const lead = await prisma.lead.findUnique({ where: { sessionId } });
  const effectiveSection = currentSection ?? session.currentSection;

  const systemPrompt = buildSystemPrompt({
    currentPage: currentPage ?? session.currentPage,
    currentSection: effectiveSection,
    leadContext: lead,
    authenticated: Boolean(authenticated),
  });

  const encoder = new TextEncoder();

  // O Gemini free tier tem cota diária curta e, quando estoura, a chamada não
  // lança erro -- ela só volta com stream vazio. Por isso não dá pra confiar em
  // try/catch sozinho: tentamos o Gemini primeiro (streaming de verdade pro
  // cliente) e, se ele terminar sem produzir nenhum texto, caímos pro Groq sem o
  // visitante perceber (nada foi enviado ainda nesse caso).
  const stream = new ReadableStream({
    async start(controller) {
      let finalText = '';

      try {
        const primary = streamText({ model: geminiModel, system: systemPrompt, messages });
        for await (const chunk of primary.textStream) {
          finalText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch {
        finalText = '';
      }

      if (!finalText.trim() && process.env.GROQ_API_KEY) {
        try {
          const fallback = streamText({ model: groqModel, system: systemPrompt, messages });
          for await (const chunk of fallback.textStream) {
            finalText += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } catch {
          // Nenhum dos dois respondeu -- fecha vazio, o cliente mostra o erro amigável.
        }
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
