import { QuizBuilder } from "@/components/admin/QuizBuilder";
import { getQuizById } from "@/lib/data";
import { notFound } from "next/navigation";
import { getUsers } from "@/app/actions";

export default async function EditQuizPage({ params }: { params: { id: string } }) {
    const quiz = getQuizById(params.id);
    const users = await getUsers();

    if(!quiz) {
        return notFound();
    }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Edit Quiz</h1>
        <p className="text-muted-foreground mt-1">
          Modify the details of your quiz.
        </p>
      </header>
      <QuizBuilder quiz={quiz} users={users} />
    </div>
  );
}
