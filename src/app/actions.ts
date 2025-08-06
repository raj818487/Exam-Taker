'use server';

import {
  intelligentQuestionShuffle,
  IntelligentQuestionShuffleInput,
} from '@/ai/flows/intelligent-question-shuffle';
import { revalidatePath } from 'next/cache';
import type { User, Quiz, Question } from '@/lib/types';
import { db } from '@/lib/db';

export async function shuffleQuestionsAction(questions: string[]): Promise<{
  shuffled?: string[];
  error?: string;
}> {
  if (!questions || questions.length === 0) {
    return { error: 'No questions provided to shuffle.' };
  }

  try {
    const input: IntelligentQuestionShuffleInput = { questions };
    const result = await intelligentQuestionShuffle(input);
    revalidatePath('/admin/quizzes/new');
    return { shuffled: result.shuffledQuestions };
  } catch (error) {
    console.error('AI shuffle error:', error);
    return { error: 'An unexpected error occurred while shuffling questions.' };
  }
}

// --- User Management Actions ---

export async function getUsers(): Promise<User[]> {
  const stmt = db.prepare('SELECT id, name, email, role FROM users');
  const users = stmt.all() as Omit<User, 'id'>[];
  return users.map(u => ({...u, id: u.id.toString()}));
}

export async function authenticateUser(email: string, password_provided: string): Promise<User | null> {
    const stmt = db.prepare('SELECT id, name, email, role, password FROM users WHERE email = ?');
    const user = stmt.get(email) as User | undefined;

    if (!user || user.password !== password_provided) {
        return null;
    }
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    return {...userWithoutPassword, id: user.id.toString()};
}


export async function upsertUser(userData: Omit<User, 'id'> & { id?: string }): Promise<{ user?: User; error?: string }> {
  if (!userData.email || !userData.name) {
    return { error: 'Name and email are required.' };
  }

  try {
    if (userData.id) {
      // Update existing user
      const id = parseInt(userData.id, 10);
      const existingUserStmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const existingUser = existingUserStmt.get(id) as User | undefined;

      if (!existingUser) {
        return { error: 'User not found.' };
      }
      
      if (userData.password) {
        const stmt = db.prepare('UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?');
        stmt.run(userData.name, userData.email, userData.role, userData.password, id);
      } else {
        const stmt = db.prepare('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?');
        stmt.run(userData.name, userData.email, userData.role, id);
      }
      
      const updatedUserStmt = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?');
      const updatedUser = updatedUserStmt.get(id) as User;

      revalidatePath('/admin/users');
      return { user: {...updatedUser, id: updatedUser.id.toString() }};

    } else {
      // Create new user
      if (!userData.password) {
        return { error: 'Password is required for new users.' };
      }
      const stmt = db.prepare('INSERT INTO users (name, email, role, password) VALUES (?, ?, ?, ?)');
      const info = stmt.run(userData.name, userData.email, userData.role, userData.password);
      
      const newUserStmt = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?');
      const newUser = newUserStmt.get(info.lastInsertRowid) as User;
      
      revalidatePath('/admin/users');
      return { user: {...newUser, id: newUser.id.toString()} };
    }
  } catch(e: any) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { error: 'A user with this email already exists.' };
    }
    console.error(e);
    return { error: 'An unexpected database error occurred.' };
  }
}

export async function deleteUser(userId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const id = parseInt(userId, 10);
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const info = stmt.run(id);
    
    if (info.changes === 0) {
      return { error: 'User not found.' };
    }

    revalidatePath('/admin/users');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected database error occurred.' };
  }
}


// --- Quiz Management Actions ---
type QuizData = Omit<Quiz, 'id' | 'questions'> & { id?: string, questions: (Omit<Question, 'id' | 'options' | 'correctAnswers'> & { options: Omit<Question['options'][0], 'id'>[], isCorrect?: boolean[] | boolean })[] };

export async function upsertQuiz(quizData: any): Promise<{ quiz?: Quiz; error?: string }> {
  const insertQuizStmt = db.prepare('INSERT INTO quizzes (title, description, timeLimit) VALUES (?, ?, ?)');
  const updateQuizStmt = db.prepare('UPDATE quizzes SET title = ?, description = ?, timeLimit = ? WHERE id = ?');
  const insertQuestionStmt = db.prepare('INSERT INTO questions (quiz_id, text, questionType) VALUES (?, ?, ?)');
  const insertOptionStmt = db.prepare('INSERT INTO options (question_id, text, isCorrect) VALUES (?, ?, ?)');
  const deleteQuestionsStmt = db.prepare('DELETE FROM questions WHERE quiz_id = ?');

  try {
    const result = db.transaction(() => {
      let quizId: number | bigint;
      if (quizData.id) {
        // Update
        quizId = parseInt(quizData.id, 10);
        updateQuizStmt.run(quizData.title, quizData.description, quizData.timeLimit || 10, quizId);
        // Delete old questions to replace them
        deleteQuestionsStmt.run(quizId);
      } else {
        // Create
        const info = insertQuizStmt.run(quizData.title, quizData.description, quizData.timeLimit || 10);
        quizId = info.lastInsertRowid;
      }

      for (const q of quizData.questions) {
        const questionInfo = insertQuestionStmt.run(quizId, q.text, q.questionType);
        const questionId = questionInfo.lastInsertRowid;

        if (q.options) {
          for (const o of q.options) {
            insertOptionStmt.run(questionId, o.text, o.isCorrect ? 1 : 0);
          }
        }
      }
      return { id: quizId.toString() };
    })();

    revalidatePath('/admin/quizzes');
    revalidatePath(`/admin/quizzes/${result.id}/edit`);
    revalidatePath('/');
    revalidatePath('/dashboard');

    return { quiz: { ...quizData, id: result.id } };

  } catch (e) {
    console.error(e);
    return { error: 'An unexpected database error occurred while saving the quiz.' };
  }
}

export async function deleteQuiz(quizId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const id = parseInt(quizId, 10);
    const stmt = db.prepare('DELETE FROM quizzes WHERE id = ?');
    const info = stmt.run(id);
    
    if (info.changes === 0) {
      return { error: 'Quiz not found.' };
    }

    revalidatePath('/admin/quizzes');
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected database error occurred.' };
  }
}