import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Quiz } from '@/lib/types';
import { Clock, HelpCircle, ListChecks } from 'lucide-react';
import Image from 'next/image';

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
       <div className="relative h-48 w-full">
         <Image 
            src={`https://placehold.co/600x400/29abe2/ffffff.png`} 
            alt={quiz.title}
            layout="fill"
            objectFit="cover"
            data-ai-hint="quiz education"
          />
       </div>
      <CardHeader>
        <CardTitle className="font-headline tracking-tight">{quiz.title}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-primary" />
            <span>{quiz.questions.length} Questions</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{quiz.timeLimit} Minutes</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/quizzes/${quiz.id}`}>Start Quiz</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
