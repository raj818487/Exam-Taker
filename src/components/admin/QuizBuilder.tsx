'use client';

import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { shuffleQuestionsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Trash2, PlusCircle, Sparkles } from 'lucide-react';
import { useState, useTransition } from 'react';
import { QuestionType } from '@/lib/types';

const optionSchema = z.object({
  text: z.string().min(1, 'Option text cannot be empty.'),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  text: z.string().min(1, 'Question text cannot be empty.'),
  questionType: z.enum(['multiple-choice', 'true-false', 'text']),
  options: z.array(optionSchema),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required.'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'A quiz must have at least one question.'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

export function QuizBuilder() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [shuffleInput, setShuffleInput] = useState('');

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [{ text: '', questionType: 'multiple-choice', options: [{ text: '', isCorrect: false }] }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'questions',
  });

  const handleShuffle = () => {
    const questionsToShuffle = shuffleInput.split('\n').filter(q => q.trim() !== '');
    if (questionsToShuffle.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Questions to Shuffle',
        description: 'Please enter at least one question per line in the text area.',
      });
      return;
    }

    startTransition(async () => {
      const result = await shuffleQuestionsAction(questionsToShuffle);
      if (result.shuffled) {
        const newQuestions = result.shuffled.map(text => ({
          text,
          questionType: 'multiple-choice' as QuestionType,
          options: [{ text: 'Option 1', isCorrect: false }, { text: 'Option 2', isCorrect: true }],
        }));
        replace(newQuestions);
        toast({
          title: 'Success!',
          description: 'Questions have been intelligently shuffled and populated.',
        });
        setShuffleInput('');
      } else {
        toast({
          variant: 'destructive',
          title: 'Shuffle Failed',
          description: result.error,
        });
      }
    });
  };

  function onSubmit(data: QuizFormValues) {
    console.log(data);
    toast({
      title: 'Quiz Saved (Simulation)',
      description: <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4"><code className="text-white">{JSON.stringify(data, null, 2)}</code></pre>,
    });
  }

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Enter the title and description for your new quiz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl><Input placeholder="e.g., World Capitals" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="A fun quiz about capital cities..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
             <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add, remove, and edit the questions for your quiz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                  <FormField
                      control={form.control}
                      name={`questions.${index}.text`}
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Question {index + 1}</FormLabel>
                              <FormControl><Input placeholder="What is the capital of Japan?" {...field} /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                   <FormField
                    control={form.control}
                    name={`questions.${index}.questionType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a question type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="text">Text Input</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <OptionsArray name={`questions.${index}.options`} questionIndex={index}/>
                </div>
            ))}
             <Button type="button" variant="outline" onClick={() => append({ text: '', questionType: 'multiple-choice', options: [{ text: '', isCorrect: false }] })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Question
            </Button>
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={isPending}>Save Quiz</Button>
        </form>

        <Card className="lg:sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent w-5 h-5"/> AI Tools</CardTitle>
            <CardDescription>Quickly populate questions using AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Bulk Add & Shuffle</FormLabel>
              <Textarea 
                placeholder="Paste one question per line..." 
                value={shuffleInput}
                onChange={(e) => setShuffleInput(e.target.value)}
                rows={5}
                />
              <p className="text-sm text-muted-foreground">The AI will intelligently shuffle the order of your pasted questions.</p>
            </FormItem>
            <Button type="button" className="w-full" onClick={handleShuffle} disabled={isPending}>
              {isPending ? 'Shuffling...' : 'Shuffle with AI'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}


function OptionsArray({name, questionIndex}: {name: `questions.${number}.options`, questionIndex: number}) {
    const { control, getValues } = useFormContext<QuizFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const questionType = getValues(`questions.${questionIndex}.questionType`);

    if(questionType === 'text') return null;

    if (questionType === 'true-false' && fields.length === 0) {
        append([{text: 'True', isCorrect: false}, {text: 'False', isCorrect: false}]);
    }

    return (
        <div className="space-y-2 pl-4 border-l">
            <h4 className="font-medium text-sm">Options</h4>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                    <FormField
                        control={control}
                        name={`${name}.${index}.isCorrect`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name={`${name}.${index}.text`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl><Input placeholder={`Option ${index+1}`} {...field} disabled={questionType === 'true-false'} /></FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={questionType === 'true-false'}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            ))}
             {questionType === 'multiple-choice' && (
                <Button type="button" size="sm" variant="ghost" className="mt-2" onClick={() => append({ text: '', isCorrect: false })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Option
                </Button>
            )}
        </div>
    )
}
