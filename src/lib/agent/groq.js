import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';

// Os modelos gpt-oss "pensam" antes de responder e esse raciocínio conta no limite de tokens por
// minuto da Groq (≈265 de ~330 tokens por resposta). Pra um chat de atendimento, raciocínio baixo
// responde igual e gasta ~75% menos. A versão do SDK não expõe a opção, então entra pelo fetch.
const withLowReasoning = async (url, init) => {
  try {
    if (init?.body && typeof init.body === 'string') {
      const body = JSON.parse(init.body);
      if (typeof body.model === 'string' && body.model.startsWith('openai/gpt-oss')) {
        body.reasoning_effort = 'low';
        init = { ...init, body: JSON.stringify(body) };
      }
    }
  } catch {
    /* corpo inesperado: segue sem alterar */
  }
  return fetch(url, init);
};

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
  fetch: withLowReasoning,
});

// Plano gratuito da Groq: 8.000 tokens POR MINUTO por modelo (cada modelo tem o seu limite).
// O chat reveza entre modelos: quando um estoura (429, volta vazio na hora), o próximo assume.
// Medido em 09/10/2026: fast ~0,5-0,9s, qwen ~0,5s, big ~0,6-1s.
export const groqModels = {
  fast: groq('openai/gpt-oss-20b'),
  qwen: groq('qwen/qwen3.8-27b'),
  big: groq('openai/gpt-oss-120b'),
};

// Provedores gratuitos extras (opcionais): cada um tem o seu próprio limite, então somam capacidade.
// Só entram na fila se a chave estiver no .env. Todos falam o protocolo da OpenAI.
const extras = [];
const addExtra = (envKey, baseURL, model) => {
  const apiKey = process.env[envKey];
  if (!apiKey) return;
  extras.push(createOpenAI({ apiKey, baseURL, compatibility: 'compatible' }).chat(model));
};
addExtra('CEREBRAS_API_KEY', 'https://api.cerebras.ai/v1', process.env.CEREBRAS_MODEL || 'llama-3.3-70b');
addExtra('MISTRAL_API_KEY', 'https://api.mistral.ai/v1', process.env.MISTRAL_MODEL || 'mistral-small-latest');
addExtra('OPENROUTER_API_KEY', 'https://openrouter.ai/api/v1', process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free');

export const CHAT_CHAIN = [groqModels.fast, groqModels.qwen, ...extras, groqModels.big];
export const BACKGROUND_CHAIN = [groqModels.big, ...extras, groqModels.qwen, groqModels.fast];

// compatibilidade com imports antigos
export const groqModel = groqModels.fast;
