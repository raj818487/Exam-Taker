import { QuizClient } from '@/components/quiz/QuizClient';
import { getQuizById } from '@/lib/data';
import { notFound } from 'next/navigation';

export default async function QuizPage({ params }: { params: { id: string } }) {
  const quiz = await getQuizById(params.id);

  if (!quiz) {
    notFound();
  }

  return <QuizClient quiz={quiz} />;
}
