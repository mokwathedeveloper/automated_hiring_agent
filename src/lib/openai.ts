import OpenAI from 'openai';

interface ApiKeyConfig {
  apiKey: string;
  provider: 'openai' | 'deepseek';
  model: string;
  baseURL?: string;
}

const API_KEY_CONFIGS: ApiKeyConfig[] = [
  process.env.OPENAI_API_KEY_1 ? { apiKey: process.env.OPENAI_API_KEY_1, provider: 'openai', model: 'gpt-3.5-turbo' } : null,
  process.env.OPENAI_API_KEY_2 ? { apiKey: process.env.OPENAI_API_KEY_2, provider: 'openai', model: 'gpt-3.5-turbo' } : null,
  process.env.DEEPSEEK_API_KEY_1 ? { apiKey: process.env.DEEPSEEK_API_KEY_1, provider: 'deepseek', model: 'deepseek-chat', baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1' } : null,
].filter(Boolean) as ApiKeyConfig[];

let currentApiKeyIndex = 0;

export function getOpenAIClient(): { client: OpenAI; model: string } {
  if (API_KEY_CONFIGS.length === 0) {
    throw new Error('No OpenAI or DeepSeek API keys configured.');
  }

  const config = API_KEY_CONFIGS[currentApiKeyIndex];

  return {
    client: new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    }),
    model: config.model,
  };
}

export function markApiKeyAsInvalid(): void {
  if (API_KEY_CONFIGS.length === 0) {
    console.warn('No API keys to mark as invalid.');
    return;
  }

  console.warn(`API Key for ${API_KEY_CONFIGS[currentApiKeyIndex].provider} (model: ${API_KEY_CONFIGS[currentApiKeyIndex].model}) marked as invalid. Switching to next key.`);
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEY_CONFIGS.length;

  if (currentApiKeyIndex === 0) {
    console.error('All configured API keys have been exhausted or are invalid. Please check your API keys.');
  }
}

// Export a default client for initial use, but encourage using getOpenAIClient
// This default export might not be used directly anymore in route.ts
