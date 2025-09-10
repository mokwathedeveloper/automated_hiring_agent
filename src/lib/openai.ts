import OpenAI from 'openai';

interface DeepSeekConfig {
  apiKey: string;
  provider: 'deepseek';
  model: string;
  baseURL: string;
}

// Only use DeepSeek API - no OpenAI integration
function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = process.env.DEEPSEEK_API_KEY_1;
  const baseURL = process.env.DEEPSEEK_BASE_URL;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY_1 is required but not configured in environment variables.');
  }

  if (!baseURL) {
    throw new Error('DEEPSEEK_BASE_URL is required but not configured in environment variables.');
  }

  return {
    apiKey,
    provider: 'deepseek',
    model: 'deepseek-chat',
    baseURL,
  };
}

export function getOpenAIClient(): { client: OpenAI; model: string } {
  const config = getDeepSeekConfig();

  return {
    client: new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    }),
    model: config.model,
  };
}

export function markApiKeyAsInvalid(): void {
  // Since we only have one DeepSeek API key, log the error and throw
  console.error('DeepSeek API key is invalid or exhausted. Please check your DEEPSEEK_API_KEY_1 configuration.');
  throw new Error('DeepSeek API authentication failed. Please verify your API key.');
}

// Export a default client for initial use, but encourage using getOpenAIClient
// This default export might not be used directly anymore in route.ts
