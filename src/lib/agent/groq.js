import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Plano gratuito da Groq: 8.000 tokens POR MINUTO por modelo (cada modelo tem o seu limite).
// Um pedido do Havi usa ~3.500 tokens (prompt + resposta), então um modelo só aguenta ~2
// mensagens por minuto. Por isso o chat reveza entre modelos: quando um estoura (429, volta
// vazio na hora), o próximo assume. Ordem = rapidez/qualidade medidas em 09/10/2026.
export const groqModels = {
  fast: groq('openai/gpt-oss-20b'), // ~0,5-0,9s
  qwen: groq('qwen/qwen3.8-27b'), // ~0,5s
  big: groq('openai/gpt-oss-120b'), // ~0,6-1s
};

// Ordem do chat ao vivo e das tarefas em segundo plano (extração de lead): o plano de fundo
// começa pelo modelo grande para não gastar o limite do que atende o visitante.
export const CHAT_CHAIN = [groqModels.fast, groqModels.qwen, groqModels.big];
export const BACKGROUND_CHAIN = [groqModels.big, groqModels.qwen, groqModels.fast];

// compatibilidade com imports antigos
export const groqModel = groqModels.fast;
