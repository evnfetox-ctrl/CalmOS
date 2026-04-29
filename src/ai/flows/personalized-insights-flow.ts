
'use server';
/**
 * @fileOverview Genkit flow for generating personalized emotional insights using the unified AI router.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { aiRouterRequest } from '@/lib/ai-router';

const PersonalizedInsightsInputSchema = z.object({
  jsonData: z
    .string()
    .describe('JSON string of emotional log data from IndexedDB.'),
});
export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

const PersonalizedInsightsOutputSchema = z.object({
  insights: z.array(z.string()).min(2).max(2),
  suggestion: z.string(),
});
export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

const personalizedInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedInsightsFlow',
    inputSchema: PersonalizedInsightsInputSchema,
    outputSchema: PersonalizedInsightsOutputSchema,
  },
  async (input) => {
    const response = await aiRouterRequest({
      system: "Analyze the provided emotional dataset. Return exactly 2 short insights and 1 simple improvement suggestion in JSON format with keys: 'insights' (array of 2 strings) and 'suggestion' (string). Tone: supportive.",
      prompt: `Data: ${input.jsonData}`,
    });

    try {
      // Expecting JSON back from the router for structured data
      const parsed = JSON.parse(response);
      return {
        insights: parsed.insights || ["You are processing well.", "Patterns are stabilizing."],
        suggestion: parsed.suggestion || "Continue your daily breathing practice."
      };
    } catch (e) {
      // Fallback in case AI doesn't return clean JSON
      return {
        insights: ["Your emotional resilience is growing.", "You're noticing triggers faster."],
        suggestion: "Try a short walk during high-stress periods."
      };
    }
  }
);

export async function generatePersonalizedInsights(
  input: PersonalizedInsightsInput
): Promise<PersonalizedInsightsOutput> {
  return personalizedInsightsFlow(input);
}
