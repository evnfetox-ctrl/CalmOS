# AI Routing & Fallback System

CalmOS utilizes a custom, unified AI router located in `src/lib/ai-router.ts`. This system ensures high availability for the AI features by providing an automatic failover mechanism.

## How it Works

1. **Primary Provider**: The system reads the `AI_PROVIDER` variable from the `.env` file (either `openrouter` or `groq`).
2. **First Attempt**: It attempts to fulfill the prompt using the primary provider.
3. **Automatic Fallback**: If the primary provider fails (e.g., rate limits, API downtime, or invalid keys), the router catches the error, logs a warning, and immediately attempts the request using the secondary provider.
4. **Resilience**: This ensures that users aren't left without support during emotional moments due to API instability.

## Providers

- **OpenRouter**: Uses `google/gemini-2.0-flash-001` for high-quality, reliable responses.
- **Groq**: Uses `llama-3.3-70b-versatile` for extremely fast low-latency fallback.

## Implementation Detail

The router is used by the Genkit flows located in `src/ai/flows/`. Instead of calling a model directly via Genkit's `ai.generate`, the flows use the `aiRouterRequest` utility to handle the provider logic and fallback.
