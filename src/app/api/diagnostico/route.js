import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';
const SESSION_COOKIE = 'nex_session';

export async function POST(request) {
  const { allowed } = checkRateLimit(`diagnostico:${getClientIp(request)}`, 10);
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

  const { empresa, nome, whatsapp, momento, gargalo, sintomas, resultado_desejado } = body;

  if (!empresa?.trim() || !nome?.trim() || !whatsapp?.trim()) {
    return new Response(JSON.stringify({ error: 'Empresa, nome e WhatsApp são obrigatórios.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    const session = await prisma.chatSession.create({
      data: { currentPage: 'links', currentSection: 'diagnostico', qualification: 'problem_aware' },
    });
    sessionId = session.id;
  } else {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { qualification: 'problem_aware' }
    });
  }

  const resumo = `${empresa} — ${momento || 'momento não informado'}. Gargalo principal: ${gargalo || 'não informado'}. Quer alcançar: ${resultado_desejado || 'não informado'}.`;

  const leadData = {
    empresa: empresa.trim(),
    contato: `${nome.trim()} — ${whatsapp.trim()}`,
    contexto: momento || '',
    problemaDeclarado: gargalo || '',
    gargalos: Array.isArray(sintomas) ? sintomas.join(', ') : '',
    objetivo: resultado_desejado || '',
    proximaAcao: 'Visitante concluiu o Diagnóstico NEX e foi direcionado ao WhatsApp.',
    resumo,
  };

  const lead = await prisma.lead.upsert({
    where: { sessionId },
    create: { sessionId, ...leadData },
    update: leadData,
  });

  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (sessionId !== cookieStore.get(SESSION_COOKIE)?.value) {
    headers.set('Set-Cookie', `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
  }

  return new Response(JSON.stringify({ leadId: lead.id, sessionId }), {
    status: 200,
    headers,
  });
}
