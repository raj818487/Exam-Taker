'use client';

import type { Quiz, Question, Option, AnswerMap } from '@/lib/types';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface QuizClientProps {
  quiz: Quiz;
}

export function QuizClient({ quiz }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60);

  const currentQuestion = useMemo(() => quiz.questions[currentQuestionIndex], [quiz.questions, currentQuestionIndex]);
  const progress = useMemo(() => ((currentQuestionIndex + 1) / quiz.questions.length) * 100, [currentQuestionIndex, quiz.questions.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (questionId: string, optionId: string, isMultiChoice: boolean) => {
    setAnswers((prev) => {
      const existingAnswers = prev[questionId] || [];
      if (isMultiChoice) {
        if (existingAnswers.includes(optionId)) {
          return { ...prev, [questionId]: existingAnswers.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...existingAnswers, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleTextChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: [value] }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    router.push(`/quizzes/${quiz.id}/results?answers=${encodeURIComponent(JSON.stringify(answers))}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestionOptions = (question: Question) => {
    const selectedAnswers = answers[question.id] || [];
    switch (question.questionType) {
      case 'multiple-choice':
        const isMulti = question.correctAnswers.length > 1;
        return (
          <div className="space-y-4">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-3 rounded-md border p-4 transition-all hover:bg-accent/50">
                {isMulti ? (
                  <Checkbox
                    id={option.id}
                    checked={selectedAnswers.includes(option.id)}
                    onCheckedChange={() => handleSelectOption(question.id, option.id, true)}
                  />
                ) : (
                  <RadioGroup
                    value={selectedAnswers[0]}
                    onValueChange={(value) => handleSelectOption(question.id, value, false)}
                    className="contents"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                  </RadioGroup>
                )}
                <Label htmlFor={option.id} className="text-base cursor-pointer flex-1">{option.text}</Label>
              </div>
            ))}
            {isMulti && <p className="text-sm text-muted-foreground">Select all that apply.</p>}
          </div>
        );
      case 'true-false':
        return (
          <RadioGroup
            className="space-y-4"
            value={selectedAnswers[0]}
            onValueChange={(value) => handleSelectOption(question.id, value, false)}
          >
            {question.options.map((option) => (
               <div key={option.id} className="flex items-center space-x-3 rounded-md border p-4 transition-all hover:bg-accent/50">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="text-base cursor-pointer flex-1">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'text':
        return <Input 
                  type="text" 
                  placeholder="Type your answer here..."
                  value={selectedAnswers[0] || ''} 
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  className="text-base"
                />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Card className="overflow-hidden">
        <CardHeader className="bg-card">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold font-headline text-primary">{quiz.title}</h1>
            <div className={`flex items-center gap-2 font-semibold ${timeLeft < 60 ? 'text-destructive' : 'text-foreground'}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <CardTitle className="mb-2 text-xl">{currentQuestion.text}</CardTitle>
          <CardDescription className="mb-6">
            {currentQuestion.questionType === 'multiple-choice' && currentQuestion.correctAnswers.length > 1
                ? 'Select all correct options.'
                : 'Select one option.'
            }
          </CardDescription>
          {renderQuestionOptions(currentQuestion)}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-card">
          <Button variant="outline" onClick={goToPrevious} disabled={currentQuestionIndex === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Submit Quiz</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you ready to submit?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You cannot change your answers after submitting. Are you sure you want to finish the quiz?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review Answers</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Submit Now</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button onClick={goToNext}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
