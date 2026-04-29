'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized emotional insights.
 *
 * - generatePersonalizedInsights - A function that analyzes emotional logs and provides insights.
 * - PersonalizedInsightsInput - The input type for the generatePersonalizedInsights function.
 * - PersonalizedInsightsOutput - The return type for the generatePersonalizedInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedInsightsInputSchema = z.object({
  jsonData: z
    .string()
    .describe('JSON string of emotional log data from IndexedDB. Expected format: [{id: string, timestamp: number, trigger: string, reacted: boolean}].'),
});
export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

const PersonalizedInsightsOutputSchema = z.object({
  insights: z.array(z.string()).min(2).max(2).describe('Two short insights derived from the emotional data.'),
  suggestion: z.string().describe('One simple improvement suggestion based on the analysis.'),
});
export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

export async function generatePersonalizedInsights(
  input: PersonalizedInsightsInput
): Promise<PersonalizedInsightsOutput> {
  return personalizedInsightsFlow(input);
}

const personalizedInsightsPrompt = ai.definePrompt({
  name: 'personalizedInsightsPrompt',
  input: { schema: PersonalizedInsightsInputSchema },
  output: { schema: PersonalizedInsightsOutputSchema },
  prompt: `Analyze this emotional dataset:
{{{jsonData}}}
Give:
- 2 short insights
- 1 simple improvement suggestion
Keep tone supportive and simple.`,
});

const personalizedInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedInsightsFlow',
    inputSchema: PersonalizedInsightsInputSchema,
    outputSchema: PersonalizedInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await personalizedInsightsPrompt(input);
    return output!;
  }
);
