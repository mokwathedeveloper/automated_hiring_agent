import OpenAI from 'openai';

const OPENAI_API_KEYS = [
  process.env.OPENAI_API_KEY_1,
  process.env.OPENAI_API_KEY_2,
  process.env.DEEPSEEK_API_KEY_1, // User provided key
].filter(Boolean) as string[]; // Filter out undefined/null and assert type

const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

let currentApiKeyIndex = 0;

export function getOpenAIClient(): OpenAI {
  if (OPENAI_API_KEYS.length === 0) {
    throw new Error('No OpenAI or DeepSeek API keys configured.');
  }

  const apiKey = OPENAI_API_KEYS[currentApiKeyIndex];
  let baseURL = undefined; // Default for OpenAI

  // Check if the current key is a DeepSeek key (simple check for now)
  // A more robust solution might involve mapping keys to providers
  if (apiKey === process.env.DEEPSEEK_API_KEY_1) {
    baseURL = DEEPSEEK_BASE_URL;
  }

  return new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
  });
}

export function markApiKeyAsInvalid(): void {
  if (OPENAI_API_KEYS.length === 0) {
    console.warn('No API keys to mark as invalid.');
    return;
  }

  console.warn(`API Key at index ${currentApiKeyIndex} marked as invalid. Switching to next key.`);
  currentApiKeyIndex = (currentApiKeyIndex + 1) % OPENAI_API_KEYS.length;

  if (currentApiKeyIndex === 0) {
    console.error('All configured API keys have been exhausted or are invalid. Please check your API keys.');
  }
}

// Export a default client for initial use, but encourage using getOpenAIClient
const openai = getOpenAIClient();
export default openai;
