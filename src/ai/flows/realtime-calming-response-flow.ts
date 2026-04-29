
'use server';
/**
 * @fileOverview A Genkit flow providing a real-time AI calming response using the unified AI router.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { aiRouterRequest } from '@/lib/ai-router';

const RealtimeCalmingResponseInputSchema = z.object({
  trigger: z.string().describe('The reason or trigger for the user\'s anger.'),
});
export type RealtimeCalmingResponseInput = z.infer<typeof RealtimeCalmingResponseInputSchema>;

const RealtimeCalmingResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated calming response.'),
});
export type RealtimeCalmingResponseOutput = z.infer<typeof RealtimeCalmingResponseOutputSchema>;

const realtimeCalmingResponseFlow = ai.defineFlow(
  {
    name: 'realtimeCalmingResponseFlow',
    inputSchema: RealtimeCalmingResponseInputSchema,
    outputSchema: RealtimeCalmingResponseOutputSchema,
  },
  async (input) => {
    const response = await aiRouterRequest({
      system: "You are a calm, emotionally intelligent counselor. Acknowledge the emotion, normalize it, and give 1 simple calming action. Tone: warm and human. Max 3 lines.",
      prompt: `User feels angry due to: ${input.trigger}`,
    });
    return { response };
  }
);

export async function realtimeCalmingResponse(input: RealtimeCalmingResponseInput): Promise<RealtimeCalmingResponseOutput> {
  return realtimeCalmingResponseFlow(input);
}
