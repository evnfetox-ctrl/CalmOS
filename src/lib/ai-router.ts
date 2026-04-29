
/**
 * @fileOverview Unified AI Router for managing OpenRouter and Groq APIs with automatic fallback.
 */

interface RouterOptions {
  prompt: string;
  system?: string;
  temperature?: number;
}

const PROVIDERS = {
  openrouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    key: process.env.OPENROUTER_API_KEY,
    model: 'google/gemini-2.0-flash-001', // High reliability default
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
  },
};

async function callProvider(providerName: 'openrouter' | 'groq', options: RouterOptions) {
  const provider = PROVIDERS[providerName];
  if (!provider.key) {
    throw new Error(`API key for ${providerName} is missing.`);
  }

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.key}`,
      ...(providerName === 'openrouter' && {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'CalmOS',
      }),
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [
        ...(options.system ? [{ role: 'system', content: options.system }] : []),
        { role: 'user', content: options.prompt },
      ],
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`AI Provider ${providerName} failed: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function aiRouterRequest(options: RouterOptions): Promise<string> {
  const primary = (process.env.AI_PROVIDER as 'openrouter' | 'groq') || 'openrouter';
  const secondary = primary === 'openrouter' ? 'groq' : 'openrouter';

  try {
    // Attempt Primary
    return await callProvider(primary, options);
  } catch (error) {
    console.error(`Primary AI provider (${primary}) failed. Attempting fallback to ${secondary}...`, error);
    try {
      // Attempt Fallback
      return await callProvider(secondary, options);
    } catch (fallbackError) {
      console.error(`Fallback AI provider (${secondary}) also failed.`, fallbackError);
      throw new Error("All AI providers failed. Please check your API keys and connection.");
    }
  }
}
