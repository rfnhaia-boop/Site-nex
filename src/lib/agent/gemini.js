import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Rápido e barato o suficiente pra conversa com streaming; troca fácil se precisar de outro modelo.
export const geminiModel = google('gemini-2.5-flash');
