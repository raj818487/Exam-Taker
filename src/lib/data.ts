import type { Quiz, Question, Option } from './types';
import { db } from './db';

type QuizRow = {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
};

type QuestionRow = {
  id: number;
  text: string;
  questionType: 'multiple-choice' | 'true-false' | 'text';
};

type OptionRow = {
  id: number;
  text: string;
  isCorrect: 0 | 1;
};

function mapRowsToQuiz(quizRow: QuizRow, questionRows: (QuestionRow & { options: OptionRow[] })[]): Quiz {
    return {
        id: quizRow.id.toString(),
        title: quizRow.title,
        description: quizRow.description,
        timeLimit: quizRow.timeLimit,
        questions: questionRows.map(q => {
            const correctAnswers = q.options
                .filter(o => o.isCorrect)
                .map(o => q.questionType === 'text' ? o.text.toLowerCase() : o.id.toString());

            return {
                id: q.id.toString(),
                text: q.text,
                questionType: q.questionType,
                options: q.options.map(o => ({
                    id: o.id.toString(),
                    text: o.text,
                })),
                correctAnswers: correctAnswers,
            };
        })
    };
}

export function getQuizzes(): Quiz[] {
    const quizStmt = db.prepare('SELECT * FROM quizzes');
    const quizRows = quizStmt.all() as QuizRow[];
    
    const questionStmt = db.prepare('SELECT * FROM questions WHERE quiz_id = ?');
    const optionStmt = db.prepare('SELECT * FROM options WHERE question_id = ?');

    return quizRows.map(quizRow => {
        const questionRows = questionStmt.all(quizRow.id) as QuestionRow[];
        const questionsWithOptions = questionRows.map(q => {
            const optionRows = optionStmt.all(q.id) as OptionRow[];
            return {...q, options: optionRows};
        });
        return mapRowsToQuiz(quizRow, questionsWithOptions);
    });
};

export function getQuizById(id: string): Quiz | undefined {
  const quizId = parseInt(id, 10);
  if (isNaN(quizId)) return undefined;

  const quizStmt = db.prepare('SELECT * FROM quizzes WHERE id = ?');
  const quizRow = quizStmt.get(quizId) as QuizRow | undefined;
  
  if (!quizRow) return undefined;

  const questionStmt = db.prepare('SELECT * FROM questions WHERE quiz_id = ?');
  const questionRows = questionStmt.all(quizRow.id) as QuestionRow[];

  const optionStmt = db.prepare('SELECT * FROM options WHERE question_id = ?');
  const questionsWithOptions = questionRows.map(q => {
    const optionRows = optionStmt.all(q.id) as OptionRow[];
    return {...q, options: optionRows};
  });
  
  return mapRowsToQuiz(quizRow, questionsWithOptions);
};
