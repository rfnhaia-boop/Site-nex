import { generateText } from 'ai';
import { geminiModel } from './gemini';

const EXTRACTION_PROMPT = `Você lê uma conversa entre um visitante e o Havi (agente da NEX), dentro da skill "Análise de IA no negócio". Extraia em JSON estrito os dados de contato já confirmados pelo visitante — nunca invente ou deduza além do que foi escrito.

Campos:
- companyName: nome da empresa (string, "" se não mencionado)
- contactName: nome do visitante (string, "" se não mencionado)
- contactPhone: WhatsApp/telefone (string, "" se não mencionado)
- contactEmail: e-mail (string, "" se não mencionado)
- segment: setor/segmento da empresa (string, "" se não mencionado)
- knownSiteUrl: site da empresa, se mencionado (string, "" se não)
- knownInstagramUrl: instagram da empresa, se mencionado (string, "" se não)
- ready: true SOMENTE se companyName, contactName e (contactPhone OU contactEmail) estiverem todos preenchidos; caso contrário false

Responda APENAS com o objeto JSON, sem markdown, sem texto antes ou depois.`;

// Evita disparar a mesma análise duas vezes na mesma sessão (processo único, best-effort).
const triggeredSessions = new Set();

export async function extractAnalysisFields(messages) {
  try {
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Visitante' : 'Havi'}: ${m.content}`)
      .join('\n');

    const { text } = await generateText({
      model: geminiModel,
      system: EXTRACTION_PROMPT,
      prompt: conversationText,
      providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('[nexOsAnalysis] falha ao extrair campos:', error);
    return null;
  }
}

// Dispara a análise real no NEX OS (nex-core) em background — nunca bloqueia a resposta do chat.
// Best-effort: se o NEX OS estiver fora do ar, só loga o erro, não derruba a conversa.
export function triggerNexOsAnalysis(sessionId, fields) {
  if (triggeredSessions.has(sessionId)) return;
  triggeredSessions.add(sessionId);

  const baseUrl = process.env.NEX_CORE_BASE_URL;
  const apiKey = process.env.NEX_CORE_PUBLIC_ANALYSIS_API_KEY;
  if (!baseUrl || !apiKey) {
    console.error('[nexOsAnalysis] NEX_CORE_BASE_URL/NEX_CORE_PUBLIC_ANALYSIS_API_KEY não configurados.');
    return;
  }

  fetch(`${baseUrl}/api/public/site-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-nex-public-key': apiKey },
    body: JSON.stringify({
      companyName: fields.companyName,
      contactName: fields.contactName,
      contactPhone: fields.contactPhone || undefined,
      contactEmail: fields.contactEmail || undefined,
      segment: fields.segment || undefined,
      knownSiteUrl: fields.knownSiteUrl || undefined,
      knownInstagramUrl: fields.knownInstagramUrl || undefined,
    }),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        console.error('[nexOsAnalysis] NEX OS retornou erro:', data?.error || res.status);
        return;
      }
      console.log(`[nexOsAnalysis] análise real gerada — leadId=${data.leadId} score=${data.score}`);
    })
    .catch((error) => {
      console.error('[nexOsAnalysis] falha ao chamar NEX OS:', error);
    });
}
