import OpenAI from 'openai';

interface DeepSeekConfig {
  apiKey: string;
  provider: 'deepseek';
  model: string;
  baseURL: string;
}

/**
 * DeepSeek API Configuration
 *
 * This function validates and returns the DeepSeek API configuration.
 * Replaces the previous OpenAI integration for cost efficiency and performance.
 *
 * Required Environment Variables:
 * - DEEPSEEK_API_KEY_1: Your DeepSeek API key from https://platform.deepseek.com/api_keys
 * - DEEPSEEK_BASE_URL: DeepSeek API base URL (https://api.deepseek.com/v1)
 */
function getDeepSeekConfig(): DeepSeekConfig {
  const apiKey = process.env.DEEPSEEK_API_KEY_1;
  const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

  console.log('🔧 DeepSeek Configuration Check:');
  console.log('- API Key present:', !!apiKey);
  console.log('- API Key length:', apiKey?.length || 0);
  console.log('- Base URL:', baseURL);

  if (!apiKey) {
    console.error('❌ DEEPSEEK_API_KEY_1 is missing from environment variables');
    throw new Error('DEEPSEEK_API_KEY_1 is required but not configured in environment variables.');
  }

  if (apiKey.length < 20) {
    console.error('❌ DEEPSEEK_API_KEY_1 appears to be invalid (too short)');
    throw new Error('DEEPSEEK_API_KEY_1 appears to be invalid. Please check your API key.');
  }

  return {
    apiKey,
    provider: 'deepseek',
    model: 'deepseek-chat', // DeepSeek's chat model optimized for conversations
    baseURL,
  };
}

/**
 * Get DeepSeek Client
 *
 * Creates and returns a configured DeepSeek client using the OpenAI SDK.
 * The OpenAI SDK is compatible with DeepSeek's API endpoints.
 *
 * @returns {object} Object containing the configured client and model name
 */
export function getOpenAIClient(): { client: OpenAI; model: string } {
  const config = getDeepSeekConfig();

  return {
    client: new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL, // Points to DeepSeek API instead of OpenAI
    }),
    model: config.model, // 'deepseek-chat'
  };
}

export function markApiKeyAsInvalid(): void {
  // Since we only have one DeepSeek API key, log the error and throw
  console.error('DeepSeek API key is invalid or exhausted. Please check your DEEPSEEK_API_KEY_1 configuration.');
  throw new Error('DeepSeek API authentication failed. Please verify your API key.');
}

// Export a default client for initial use, but encourage using getOpenAIClient
// This default export might not be used directly anymore in route.ts
