export type QuestionType = 'multiple-choice' | 'true-false' | 'text';
export type QuizType = 'public' | 'private';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  options: Option[];
  correctAnswers: string[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  quizType: QuizType;
  questions: Question[];
  assignedUserIds?: string[];
}

export type AnswerMap = Record<string, string[]>;

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}
