import { ILLMProvider } from './llmProvider.interface.js';
import { GeminiLLMProvider } from './geminiProvider.js';
import { MockResilientLLMProvider } from './mockProvider.js';
import { env } from '../../config/env.js';

export class LLMFactory {
  private static instance: ILLMProvider | null = null;

  public static getProvider(): ILLMProvider {
    if (this.instance) return this.instance;

    const hasGeminiKey = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim().length > 0);

    if (env.LLM_PROVIDER === 'gemini' && hasGeminiKey) {
      console.log('🤖 [LLM Factory] Initializing Google Gemini 1.5/2.0 API Provider');
      this.instance = new GeminiLLMProvider(env.GEMINI_API_KEY!);
    } else {
      console.log('🤖 [LLM Factory] Initializing Resilient Local Legal Engine (Offline / Fallback Mode)');
      this.instance = new MockResilientLLMProvider();
    }

    return this.instance;
  }
}
