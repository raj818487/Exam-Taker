import { getAllQuizzes } from "@/lib/data";
import { QuizListClient } from "@/components/admin/QuizListClient";
import { getUsers } from "@/app/actions";

export default async function AllQuizzesPage() {
    const quizzes = getAllQuizzes();
    const users = await getUsers();
    
    return (
        <div className="space-y-8">
            <QuizListClient quizzes={quizzes} users={users} />
        </div>
    );
}
