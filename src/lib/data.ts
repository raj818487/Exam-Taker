import type { Quiz, Question, Option, QuizType } from './types';
import { db } from './db';

type QuizRow = {
  id: number;
  title: string;
  description: string;
  timeLimit: number;
  quizType: QuizType;
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

type AssignmentRow = {
    user_id: number;
}

function mapRowsToQuiz(quizRow: QuizRow, questionRows: (QuestionRow & { options: OptionRow[] })[], assignmentRows: AssignmentRow[]): Quiz {
    return {
        id: quizRow.id.toString(),
        title: quizRow.title,
        description: quizRow.description,
        timeLimit: quizRow.timeLimit,
        quizType: quizRow.quizType,
        assignedUserIds: assignmentRows.map(a => a.user_id.toString()),
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

export function getPublicQuizzes(): Quiz[] {
    const quizStmt = db.prepare("SELECT * FROM quizzes WHERE quizType = 'public'");
    const quizRows = quizStmt.all() as QuizRow[];
    
    const questionStmt = db.prepare('SELECT * FROM questions WHERE quiz_id = ?');
    const optionStmt = db.prepare('SELECT * FROM options WHERE question_id = ?');

    return quizRows.map(quizRow => {
        const questionRows = questionStmt.all(quizRow.id) as QuestionRow[];
        const questionsWithOptions = questionRows.map(q => {
            const optionRows = optionStmt.all(q.id) as OptionRow[];
            return {...q, options: optionRows};
        });
        return mapRowsToQuiz(quizRow, questionsWithOptions, []);
    });
};


export function getQuizzesForUser(userId: string): Quiz[] {
    const publicQuizStmt = db.prepare("SELECT * FROM quizzes WHERE quizType = 'public'");
    const assignedQuizStmt = db.prepare(`
        SELECT q.* FROM quizzes q
        JOIN quiz_assignments qa ON q.id = qa.quiz_id
        WHERE qa.user_id = ? AND q.quizType = 'private'
    `);

    const publicQuizRows = publicQuizStmt.all() as QuizRow[];
    const assignedQuizRows = assignedQuizStmt.all(parseInt(userId, 10)) as QuizRow[];
    
    const quizRows = [...publicQuizRows, ...assignedQuizRows];
     // Remove duplicates
    const uniqueQuizRows = Array.from(new Set(quizRows.map(q => q.id))).map(id => quizRows.find(q => q.id === id)!);


    const questionStmt = db.prepare('SELECT * FROM questions WHERE quiz_id = ?');
    const optionStmt = db.prepare('SELECT * FROM options WHERE question_id = ?');

    return uniqueQuizRows.map(quizRow => {
        const questionRows = questionStmt.all(quizRow.id) as QuestionRow[];
        const questionsWithOptions = questionRows.map(q => {
            const optionRows = optionStmt.all(q.id) as OptionRow[];
            return {...q, options: optionRows};
        });
        return mapRowsToQuiz(quizRow, questionsWithOptions, []);
    });
}

export function getAllQuizzes(): Quiz[] {
    const quizStmt = db.prepare('SELECT * FROM quizzes');
    const quizRows = quizStmt.all() as QuizRow[];
    
    const questionStmt = db.prepare('SELECT * FROM questions WHERE quiz_id = ?');
    const optionStmt = db.prepare('SELECT * FROM options WHERE question_id = ?');
    const assignmentStmt = db.prepare('SELECT user_id FROM quiz_assignments WHERE quiz_id = ?');

    return quizRows.map(quizRow => {
        const questionRows = questionStmt.all(quizRow.id) as QuestionRow[];
        const questionsWithOptions = questionRows.map(q => {
            const optionRows = optionStmt.all(q.id) as OptionRow[];
            return {...q, options: optionRows};
        });
        const assignmentRows = assignmentStmt.all(quizRow.id) as AssignmentRow[];
        return mapRowsToQuiz(quizRow, questionsWithOptions, assignmentRows);
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

  const assignmentStmt = db.prepare('SELECT user_id FROM quiz_assignments WHERE quiz_id = ?');
  const assignmentRows = assignmentStmt.all(quizRow.id) as AssignmentRow[];
  
  return mapRowsToQuiz(quizRow, questionsWithOptions, assignmentRows);
};
