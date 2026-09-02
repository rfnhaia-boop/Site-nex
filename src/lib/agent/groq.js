import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Resposta principal do Havi -- rápido (LPU da Groq). llama-3.3-70b-versatile foi
// descontinuado pela Groq; testado gpt-oss-120b (~2.5-13s, inconsistente) e
// gpt-oss-20b (~0.4-0.8s na maioria) -- ficou com o 20b pela velocidade. O
// Gemini como fallback cobre os raros casos em que ele volta vazio.
export const groqModel = groq('openai/gpt-oss-20b');
