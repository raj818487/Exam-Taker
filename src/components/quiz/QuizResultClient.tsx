'use client';

import type { Quiz, AnswerMap, Question } from '@/lib/types';
import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, XCircle, Printer, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizResultClientProps {
  quiz: Quiz;
  userAnswers: AnswerMap;
}

export function QuizResultClient({ quiz, userAnswers }: QuizResultClientProps) {
  const scoreData = useMemo(() => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const userAns = userAnswers[q.id] || [];
      if (q.questionType === 'text') {
        if (userAns.length > 0 && q.correctAnswers.includes(userAns[0].toLowerCase().trim())) {
          correctCount++;
        }
      } else {
        const sortedUserAns = [...userAns].sort();
        const sortedCorrectAns = [...q.correctAnswers].sort();
        if (JSON.stringify(sortedUserAns) === JSON.stringify(sortedCorrectAns)) {
          correctCount++;
        }
      }
    });
    const total = quiz.questions.length;
    const percentage = total > 0 ? (correctCount / total) * 100 : 0;
    return { correctCount, total, percentage };
  }, [quiz, userAnswers]);

  const getOptionText = (question: Question, optionId: string) => {
    return question.options.find(o => o.id === optionId)?.text || 'N/A';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
      <div className="printable-area">
        <Card>
          <CardHeader className="text-center items-center">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-4">
               <span className="text-3xl font-bold text-accent-foreground">{Math.round(scoreData.percentage)}%</span>
            </div>
            <CardTitle className="text-3xl font-bold font-headline">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg">
              You scored {scoreData.correctCount} out of {scoreData.total}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4 text-center">Review Your Answers</h3>
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((question, index) => {
                const userAnswer = userAnswers[question.id] || [];
                const isCorrect = JSON.stringify([...userAnswer].sort()) === JSON.stringify([...question.correctAnswers].sort()) || (question.questionType === 'text' && userAnswer.length > 0 && question.correctAnswers.includes(userAnswer[0].toLowerCase().trim()));
                
                return (
                  <AccordionItem value={`item-${index}`} key={question.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-destructive" />}
                        <span className="text-left flex-1">{index + 1}. {question.text}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 space-y-3">
                      <div>
                        <p className="font-semibold text-sm">Your Answer:</p>
                        <p className={cn("p-2 rounded-md", isCorrect ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50')}>
                           {userAnswer.length > 0 ? userAnswer.map(ans => question.questionType === 'text' ? ans : getOptionText(question, ans)).join(', ') : 'No answer provided'}
                        </p>
                      </div>
                      {!isCorrect && (
                         <div>
                          <p className="font-semibold text-sm">Correct Answer:</p>
                           <p className="p-2 rounded-md bg-green-100 dark:bg-green-900/50">
                             {question.correctAnswers.map(ans => question.questionType === 'text' ? ans : getOptionText(question, ans)).join(', ')}
                           </p>
                         </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center p-6 no-print">
            <Button asChild variant="outline">
              <Link href="/">
                <Repeat className="mr-2 h-4 w-4" />
                Take Another Quiz
              </Link>
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
