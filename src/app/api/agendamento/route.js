import { getAvailableSlots, createBookingEvent } from '@/lib/googleCalendar';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export async function GET(request) {
  const { allowed } = checkRateLimit(`agendamento-get:${getClientIp(request)}`, 30);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Muitas requisições em pouco tempo.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const slots = await getAvailableSlots();
    return new Response(JSON.stringify({ slots }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[agendamento] falha ao buscar horários:', error);
    return new Response(JSON.stringify({ error: 'Não consegui consultar a agenda agora.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const { allowed } = checkRateLimit(`agendamento-post:${getClientIp(request)}`, 10);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Muitas tentativas em pouco tempo. Espera um instante.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: 'Corpo inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { nome, contato, startIso, resumo, sessionId } = body;

  if (!nome?.trim() || !contato?.trim() || !startIso) {
    return new Response(JSON.stringify({ error: 'Nome, contato e horário são obrigatórios.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let booking;
  try {
    booking = await createBookingEvent({ nome: nome.trim(), contato: contato.trim(), resumo, startIso });
  } catch (error) {
    const status = error.code === 'SLOT_TAKEN' ? 409 : 500;
    console.error('[agendamento] falha ao criar evento:', error);
    return new Response(JSON.stringify({ error: error.message || 'Não consegui agendar agora.' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Reflete o agendamento na camada de Lead Intelligence — mesma regra de arquitetura do Ravi e do Diagnóstico.
  try {
    const proximaAcao = `Reunião agendada para ${new Date(booking.start).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    })}.`;

    const existingLead = sessionId ? await prisma.lead.findUnique({ where: { sessionId } }) : null;

    if (existingLead) {
      await prisma.lead.update({ where: { sessionId }, data: { contato: contato.trim(), proximaAcao } });
    } else {
      const session = await prisma.chatSession.create({
        data: { currentPage: 'links', currentSection: 'agendamento', qualification: 'project_ready' },
      });
      await prisma.lead.create({
        data: {
          sessionId: session.id,
          empresa: '',
          contato: contato.trim(),
          resumo: resumo || '',
          proximaAcao,
        },
      });
    }
  } catch (error) {
    // Best-effort: o evento real já foi criado, não falhar a resposta por causa do registro interno.
    console.error('[agendamento] falha ao atualizar Lead:', error);
  }

  return new Response(JSON.stringify(booking), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
