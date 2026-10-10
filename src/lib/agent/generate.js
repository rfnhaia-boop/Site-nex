import { generateText } from 'ai';
import { BACKGROUND_CHAIN } from './groq';
import { geminiModel } from './gemini';

// generateText com rodízio de modelos (Groq → Gemini). Cada modelo é tentado uma vez; quando um
// falha (429/erro/vazio) passa pro próximo. Devolve '' se todos falharem.
export async function generateTextResilient({ system, prompt }) {
  const chain = [...BACKGROUND_CHAIN.map((model) => ({ model })), { model: geminiModel, providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } } }];
  for (const { model, providerOptions } of chain) {
    try {
      const { text } = await generateText({ model, system, prompt, providerOptions, abortSignal: AbortSignal.timeout(15000), maxRetries: 0 });
      if (text && text.trim()) return text;
    } catch (error) {
      console.error('[generate] modelo falhou:', error?.message || error);
    }
  }
  return '';
}
