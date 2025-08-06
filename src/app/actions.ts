'use server';

import {
  intelligentQuestionShuffle,
  IntelligentQuestionShuffleInput,
} from '@/ai/flows/intelligent-question-shuffle';
import { revalidatePath } from 'next/cache';

export async function shuffleQuestionsAction(questions: string[]): Promise<{
  shuffled?: string[];
  error?: string;
}> {
  if (!questions || questions.length === 0) {
    return { error: 'No questions provided to shuffle.' };
  }

  try {
    const input: IntelligentQuestionShuffleInput = { questions };
    const result = await intelligentQuestionShuffle(input);
    revalidatePath('/admin/quizzes/new');
    return { shuffled: result.shuffledQuestions };
  } catch (error) {
    console.error('AI shuffle error:', error);
    return { error: 'An unexpected error occurred while shuffling questions.' };
  }
}
