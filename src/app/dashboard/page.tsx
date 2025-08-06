'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User, CheckSquare, BarChart, Loader } from "lucide-react";

export default function UserDashboardPage() {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role !== 'user') {
            router.replace('/login?error=unauthorized_user');
        } else {
            setIsAuth(true);
        }
        setLoading(false);
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
                <p className="text-muted-foreground mt-1">Welcome! Here's a summary of your quiz activity.</p>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Keep up the great work!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">82%</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Profile</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">User</div>
                        <p className="text-xs text-muted-foreground">Your profile details here.</p>
                    </CardContent>
                </Card>
            </div>
             <Card className="mt-8">
                 <CardHeader>
                     <CardTitle>Recent Quiz Results</CardTitle>
                     <CardDescription>A list of your most recent quiz attempts.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">Your recent quiz results will appear here.</p>
                 </CardContent>
             </Card>
        </div>
    );
}
