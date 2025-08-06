import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QuizCard } from '@/components/quiz/QuizCard';
import { getPublicQuizzes } from '@/lib/data';
import { BookOpen } from 'lucide-react';

export default function Home() {
  const quizzes = getPublicQuizzes();
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary tracking-tight">
          Welcome to QuizMaster Pro
        </h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          Choose from a variety of quizzes to test your knowledge. Good luck!
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
        {quizzes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-border bg-card">
            <BookOpen className="w-12 h-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">No quizzes available yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">An administrator needs to add some quizzes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
