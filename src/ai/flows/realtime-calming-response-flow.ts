'use server';
/**
 * @fileOverview A Genkit flow that provides a real-time AI-generated calming response to a user's anger.
 *
 * - realtimeCalmingResponse - A function that handles the calming response process.
 * - RealtimeCalmingResponseInput - The input type for the realtimeCalmingResponse function.
 * - RealtimeCalmingResponseOutput - The return type for the realtimeCalmingResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RealtimeCalmingResponseInputSchema = z.object({
  trigger: z.string().describe('The reason or trigger for the user\'s anger.'),
});
export type RealtimeCalmingResponseInput = z.infer<typeof RealtimeCalmingResponseInputSchema>;

const RealtimeCalmingResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated calming response.'),
});
export type RealtimeCalmingResponseOutput = z.infer<typeof RealtimeCalmingResponseOutputSchema>;

export async function realtimeCalmingResponse(input: RealtimeCalmingResponseInput): Promise<RealtimeCalmingResponseOutput> {
  return realtimeCalmingResponseFlow(input);
}

const calmCounselorPrompt = ai.definePrompt({
  name: 'calmCounselorPrompt',
  input: { schema: RealtimeCalmingResponseInputSchema },
  output: { schema: RealtimeCalmingResponseOutputSchema },
  prompt: `You are a calm, emotionally intelligent counselor.
User feels angry due to: {{{trigger}}}.
Respond in 2–3 short lines:
- Acknowledge emotion
- Normalize it
- Give 1 simple calming action
Tone must be warm and human.`,
});

const realtimeCalmingResponseFlow = ai.defineFlow(
  {
    name: 'realtimeCalmingResponseFlow',
    inputSchema: RealtimeCalmingResponseInputSchema,
    outputSchema: RealtimeCalmingResponseOutputSchema,
  },
  async (input) => {
    const { output } = await calmCounselorPrompt(input);
    return { response: output?.response || 'I am here to help. Take a deep breath.' };
  }
);
