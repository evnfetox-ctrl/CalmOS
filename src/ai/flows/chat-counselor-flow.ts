
'use server';
/**
 * @fileOverview A Genkit flow for an AI emotional counselor chat using the unified AI router.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { aiRouterRequest } from '@/lib/ai-router';

const AIChatCounselorInputSchema = z
  .string()
  .describe('The user\'s message to the AI counselor.');
export type AIChatCounselorInput = z.infer<typeof AIChatCounselorInputSchema>;

const AIChatCounselorOutputSchema = z
  .string()
  .describe('The AI counselor\'s empathetic response.');
export type AIChatCounselorOutput = z.infer<typeof AIChatCounselorOutputSchema>;

const aiChatCounselorFlow = ai.defineFlow(
  {
    name: 'aiChatCounselorFlow',
    inputSchema: AIChatCounselorInputSchema,
    outputSchema: AIChatCounselorOutputSchema,
  },
  async (input) => {
    const response = await aiRouterRequest({
      system: "You are a supportive emotional counselor. Reflect emotion, validate feelings, and ask 1 gentle question. Keep response short (2-3 lines).",
      prompt: input,
    });
    return response;
  }
);

export async function aiChatCounselor(
  input: AIChatCounselorInput
): Promise<AIChatCounselorOutput> {
  return aiChatCounselorFlow(input);
}
