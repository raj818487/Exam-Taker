import { QuizBuilder } from "@/components/admin/QuizBuilder";

export default function NewQuizPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Create a New Quiz</h1>
        <p className="text-muted-foreground mt-1">
          Build your quiz from scratch or use our AI tools to help you out.
        </p>
      </header>
      <QuizBuilder />
    </div>
  );
}
