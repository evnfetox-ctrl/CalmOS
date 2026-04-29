'use server';
/**
 * @fileOverview A Genkit flow for an AI emotional counselor chat.
 *
 * - aiChatCounselor - A function that handles the AI chat counselor interaction.
 * - AIChatCounselorInput - The input type for the aiChatCounselor function.
 * - AIChatCounselorOutput - The return type for the aiChatCounselor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatCounselorInputSchema = z
  .string()
  .describe('The user\u0027s message to the AI counselor.');
export type AIChatCounselorInput = z.infer<typeof AIChatCounselorInputSchema>;

const AIChatCounselorOutputSchema = z
  .string()
  .describe('The AI counselor\u0027s empathetic response.');
export type AIChatCounselorOutput = z.infer<typeof AIChatCounselorOutputSchema>;

const aiChatCounselorPrompt = ai.definePrompt({
  name: 'aiChatCounselorPrompt',
  input: {schema: AIChatCounselorInputSchema},
  output: {schema: AIChatCounselorOutputSchema},
  prompt: `You are a supportive emotional counselor.
User says: {{{input}}}
Respond:
- Reflect emotion
- Validate feeling
- Ask 1 gentle question
Keep response short (2\u002D3 lines).`,
});

const aiChatCounselorFlow = ai.defineFlow(
  {
    name: 'aiChatCounselorFlow',
    inputSchema: AIChatCounselorInputSchema,
    outputSchema: AIChatCounselorOutputSchema,
  },
  async input => {
    const {output} = await aiChatCounselorPrompt(input);
    return output!;
  }
);

export async function aiChatCounselor(
  input: AIChatCounselorInput
): Promise<AIChatCounselorOutput> {
  return aiChatCounselorFlow(input);
}
