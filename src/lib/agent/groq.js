import { createGroq } from '@ai-sdk/groq';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fallback do Havi quando o Gemini falha ou estoura a cota gratuita -- rápido e gratuito.
export const groqModel = groq('llama-3.3-70b-versatile');
