import { QuizResultClient } from '@/components/quiz/QuizResultClient';
import { getQuizById } from '@/lib/data';
import { notFound } from 'next/navigation';
import type { AnswerMap } from '@/lib/types';

export default function ResultsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const quiz = getQuizById(params.id);

  if (!quiz) {
    notFound();
  }

  const answersParam = searchParams.answers;
  let userAnswers: AnswerMap = {};

  try {
    if (typeof answersParam === 'string') {
      userAnswers = JSON.parse(decodeURIComponent(answersParam));
    }
  } catch (e) {
    console.error('Failed to parse answers from URL', e);
  }

  return <QuizResultClient quiz={quiz} userAnswers={userAnswers} />;
}
