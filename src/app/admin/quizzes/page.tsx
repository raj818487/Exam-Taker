import { getQuizzes } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, MoreHorizontal, FileText } from "lucide-react";

export default function AllQuizzesPage() {
    const quizzes = getQuizzes();
    return (
        <div className="space-y-8">
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
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
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
        </div>
    );
}
