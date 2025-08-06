'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import type { Quiz } from '@/lib/types';
import { deleteQuiz } from '@/app/actions';

interface QuizListClientProps {
    quizzes: Quiz[];
}

export function QuizListClient({ quizzes: initialQuizzes }: QuizListClientProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [quizzes, setQuizzes] = useState(initialQuizzes);
    const [isPending, startTransition] = useTransition();
    const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

    const handleEdit = (quizId: string) => {
        router.push(`/admin/quizzes/edit/${quizId}`);
    };

    const handleDeleteConfirm = (quiz: Quiz) => {
        setQuizToDelete(quiz);
    };

    const handleDelete = () => {
        if (!quizToDelete) return;
        
        startTransition(async () => {
            const result = await deleteQuiz(quizToDelete.id);
            if (result.success) {
                setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
                toast({ title: 'Success', description: 'Quiz has been deleted.' });
            } else {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
            }
            setQuizToDelete(null);
        });
    };
    
    return (
        <>
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">All Quizzes</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your existing quizzes here.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/quizzes/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Quiz
                    </Link>
                </Button>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Existing Quizzes</CardTitle>
                    <CardDescription>
                        A list of all quizzes created on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Questions</TableHead>
                                <TableHead className="hidden md:table-cell">Time Limit</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quizzes.length > 0 ? (
                                quizzes.map((quiz) => (
                                    <TableRow key={quiz.id}>
                                        <TableCell className="font-medium">{quiz.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">{quiz.questions.length}</TableCell>
                                        <TableCell className="hidden md:table-cell">{quiz.timeLimit} mins</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(quiz.id)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteConfirm(quiz)} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No quizzes found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                 {quizzes.length > 0 && (
                    <CardFooter>
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>1-{quizzes.length}</strong> of <strong>{quizzes.length}</strong> quizzes.
                        </div>
                    </CardFooter>
                 )}
            </Card>

            {quizToDelete && (
                <AlertDialog open={!!quizToDelete} onOpenChange={() => setQuizToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the quiz
                             <span className="font-semibold">"{quizToDelete.title}"</span>.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                            {isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}