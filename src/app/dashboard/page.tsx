'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Loader, BookOpen } from "lucide-react";
import { QuizCard } from '@/components/quiz/QuizCard';
import { getQuizzesForUserAction } from '@/app/actions';
import type { Quiz } from '@/lib/types';


export default function UserDashboardPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');

        if (role !== 'user' || !userId) {
            router.replace('/login?error=unauthorized_user');
            return;
        } 
        
        setIsAuth(true);

        const fetchQuizzes = async () => {
            const userQuizzes = await getQuizzesForUserAction(userId);
            setQuizzes(userQuizzes);
            setLoading(false);
        };

        fetchQuizzes();

    }, [router]);

    if (loading || !isAuth) {
        return (
          <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Card>
                <CardContent className="p-8 flex flex-col items-center gap-4">
                     <Loader className="w-8 h-8 animate-spin text-primary" />
                     <p className="text-muted-foreground">Loading dashboard...</p>
                </CardContent>
            </Card>
          </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold font-headline tracking-tight">User Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome! Choose a quiz to start.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
                ))}
                {quizzes.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-border bg-card">
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-4 text-lg text-muted-foreground">No quizzes available yet.</p>
                    <p className="mt-1 text-sm text-muted-foreground">Check back later or contact an administrator.</p>
                </div>
                )}
            </div>
        </div>
    );
}
