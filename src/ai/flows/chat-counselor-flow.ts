'use server';
/**
 * @fileOverview A Genkit flow for an AI emotional counselor chat with personalized user context.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { aiRouterRequest } from '@/lib/ai-router';

const AIChatCounselorInputSchema = z.object({
  message: z.string().describe('The user\'s message to the AI counselor.'),
  profileContext: z.string().optional().describe('Context about the user from their profile.'),
});
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
    const systemPrompt = `You are a supportive emotional wellness counselor. Your tone should be empathetic, validating, and helpful.
    
    CRITICAL INSTRUCTIONS:
    - Keep responses concise (2-4 sentences max).
    - Always validate the user's feelings before offering advice.
    - Ask exactly ONE gentle follow-up question.
    - Tailor your language to the user's age and preferences if provided.
    
    User Profile Context:
    ${input.profileContext || 'No profile data provided yet.'}
    
    Roleplay as the counselor now.`;

    const response = await aiRouterRequest({
      system: systemPrompt,
      prompt: input.message,
    });
    return response;
  }
);

export async function aiChatCounselor(
  input: AIChatCounselorInput
): Promise<AIChatCounselorOutput> {
  return aiChatCounselorFlow(input);
}
