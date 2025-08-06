import { getQuizzes } from "@/lib/data";
import { QuizListClient } from "@/components/admin/QuizListClient";

export default function AllQuizzesPage() {
    const quizzes = getQuizzes();
    
    return (
        <div className="space-y-8">
            <QuizListClient quizzes={quizzes} />
        </div>
    );
}
