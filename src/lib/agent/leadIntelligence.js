import { generateText } from 'ai';
import { geminiModel } from './gemini';
import { prisma } from '../prisma';

const LEAD_FIELDS = [
  'empresa',
  'contato',
  'contexto',
  'problemaDeclarado',
  'causaProvavel',
  'ferramentasAtuais',
  'gargalos',
  'objetivo',
  'urgencia',
  'oportunidadeNex',
  'proximaAcao',
  'resumo',
];

const EXTRACTION_PROMPT = `Você lê uma conversa entre um visitante e o Havi (agente da NEX) e extrai o que já foi dito sobre o visitante, em JSON estrito.

Campos (string vazia "" para o que não foi mencionado — nunca invente ou deduza além do que está escrito):
- empresa: nome da empresa do visitante
- contato: nome e/ou contato (WhatsApp, e-mail) mencionados
- contexto: setor, tamanho, momento da empresa
- problemaDeclarado: o problema que o visitante disse ter, com as palavras dele
- causaProvavel: a causa real, só se a conversa já diferenciou sintoma de causa
- ferramentasAtuais: ferramentas/sistemas que o visitante já usa
- gargalos: onde está o atrito (vendas, operação, atendimento, marketing, tecnologia...)
- objetivo: o que o visitante quer alcançar
- urgencia: se mencionou prazo ou urgência
- oportunidadeNex: qual eixo da NEX (Estratégia/Design/Tecnologia/Automação) parece mais relevante pelo que já foi dito
- proximaAcao: o que faz sentido acontecer a seguir (ex: "levar briefing pro time", "agendar conversa")
- resumo: 1-2 frases resumindo a conversa até aqui

Responda APENAS com o objeto JSON, sem markdown, sem texto antes ou depois.`;

// Roda depois de cada resposta do Havi com contexto suficiente (>=2 turnos do visitante).
// Best-effort: nunca deve derrubar a conversa principal se falhar.
export async function extractAndSaveLead({ sessionId, messages }) {
  try {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Visitante' : 'Havi'}: ${m.content}`)
      .join('\n');

    const { text } = await generateText({
      model: geminiModel,
      system: EXTRACTION_PROMPT,
      prompt: conversationText,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return;

    const parsed = JSON.parse(jsonMatch[0]);
    const data = {};
    for (const field of LEAD_FIELDS) {
      if (typeof parsed[field] === 'string' && parsed[field].trim()) {
        data[field] = parsed[field].trim();
      }
    }
    if (Object.keys(data).length === 0) return;

    await prisma.lead.upsert({
      where: { sessionId },
      create: { sessionId, ...data },
      update: data,
    });
  } catch (error) {
    console.error('[leadIntelligence] falha ao extrair/salvar Lead:', error);
  }
}
