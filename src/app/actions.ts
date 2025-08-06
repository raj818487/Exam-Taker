'use server';

import {
  intelligentQuestionShuffle,
  IntelligentQuestionShuffleInput,
} from '@/ai/flows/intelligent-question-shuffle';
import { revalidatePath } from 'next/cache';
import { users } from '@/lib/users';
import type { User } from '@/lib/types';

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
  // In a real app, this would fetch from a database.
  return Promise.resolve(users);
}

export async function upsertUser(userData: Omit<User, 'id'> & { id?: string }): Promise<{ user?: User; error?: string }> {
  if (!userData.email || !userData.name) {
    return { error: 'Name and email are required.' };
  }

  if (userData.id) {
    // Update existing user
    const index = users.findIndex(u => u.id === userData.id);
    if (index === -1) {
      return { error: 'User not found.' };
    }
    const existingUser = users[index];
    // Don't update password if it's not provided
    const newPassword = userData.password ? userData.password : existingUser.password;
    
    users[index] = { ...existingUser, ...userData, password: newPassword };
    revalidatePath('/admin/users');
    return { user: users[index] };

  } else {
    // Create new user
     if (!userData.password) {
      return { error: 'Password is required for new users.' };
    }
    const existing = users.find(u => u.email === userData.email);
    if (existing) {
        return { error: 'A user with this email already exists.' };
    }
    const newUser: User = {
      ...userData,
      id: (Math.random() * 10000).toFixed(0).toString(), // Simulate new ID
      password: userData.password,
    };
    users.push(newUser);
    revalidatePath('/admin/users');
    return { user: newUser };
  }
}

export async function deleteUser(userId: string): Promise<{ success?: boolean; error?: string }> {
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) {
    return { error: 'User not found.' };
  }
  
  users.splice(index, 1);
  revalidatePath('/admin/users');
  return { success: true };
}