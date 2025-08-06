'use server';

/**
 * @fileOverview A flow for shuffling question order in a quiz using AI.
 *
 * - intelligentQuestionShuffle - A function that shuffles the order of questions in a quiz.
 * - IntelligentQuestionShuffleInput - The input type for the intelligentQuestionShuffle function.
 * - IntelligentQuestionShuffleOutput - The return type for the intelligentQuestionShuffle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentQuestionShuffleInputSchema = z.object({
  questions: z
    .array(
      z.string().describe('A question in the quiz.')
    )
    .describe('The questions to shuffle.'),
});
export type IntelligentQuestionShuffleInput = z.infer<
  typeof IntelligentQuestionShuffleInputSchema
>;

const IntelligentQuestionShuffleOutputSchema = z.object({
  shuffledQuestions: z
    .array(z.string())
    .describe('The questions shuffled by the AI.'),
});
export type IntelligentQuestionShuffleOutput = z.infer<
  typeof IntelligentQuestionShuffleOutputSchema
>;

export async function intelligentQuestionShuffle(
  input: IntelligentQuestionShuffleInput
): Promise<IntelligentQuestionShuffleOutput> {
  return intelligentQuestionShuffleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentQuestionShufflePrompt',
  input: {schema: IntelligentQuestionShuffleInputSchema},
  output: {schema: IntelligentQuestionShuffleOutputSchema},
  prompt: `You are an expert quiz creator. Your job is to shuffle the order of the questions, taking into account question topics and difficulty, so that the quiz is more engaging.

Questions: {{{questions}}}`,
});

const intelligentQuestionShuffleFlow = ai.defineFlow(
  {
    name: 'intelligentQuestionShuffleFlow',
    inputSchema: IntelligentQuestionShuffleInputSchema,
    outputSchema: IntelligentQuestionShuffleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
