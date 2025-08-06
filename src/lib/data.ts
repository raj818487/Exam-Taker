import type { Quiz } from './types';

export const quizzes: Quiz[] = [
  {
    id: '1',
    title: 'General Knowledge Challenge',
    description: 'A fun quiz to test your general knowledge across various domains.',
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        questionType: 'multiple-choice',
        options: [
          { id: 'q1o1', text: 'Berlin' },
          { id: 'q1o2', text: 'Madrid' },
          { id: 'q1o3', text: 'Paris' },
          { id: 'q1o4', text: 'Rome' },
        ],
        correctAnswers: ['q1o3'],
      },
      {
        id: 'q2',
        text: 'The Great Wall of China is visible from the Moon.',
        questionType: 'true-false',
        options: [
          { id: 'q2o1', text: 'True' },
          { id: 'q2o2', text: 'False' },
        ],
        correctAnswers: ['q2o2'],
      },
      {
        id: 'q3',
        text: 'What is the largest planet in our solar system?',
        questionType: 'text',
        options: [],
        correctAnswers: ['jupiter'],
      },
      {
        id: 'q4',
        text: 'Which of the following are primary colors?',
        questionType: 'multiple-choice',
        options: [
          { id: 'q4o1', text: 'Red' },
          { id: 'q4o2', text: 'Green' },
          { id: 'q4o3', text: 'Blue' },
          { id: 'q4o4', text: 'Yellow' },
        ],
        correctAnswers: ['q4o1', 'q4o3', 'q4o4'],
      },
    ],
  },
  {
    id: '2',
    title: 'Science & Nature',
    description: 'Explore the wonders of the natural world and the laws of science.',
    timeLimit: 15,
    questions: [
      {
        id: 'q5',
        text: 'What is H2O more commonly known as?',
        questionType: 'text',
        options: [],
        correctAnswers: ['water'],
      },
      {
        id: 'q6',
        text: 'Which is the largest mammal?',
        questionType: 'multiple-choice',
        options: [
          { id: 'q6o1', text: 'Elephant' },
          { id: 'q6o2', text: 'Blue Whale' },
          { id: 'q6o3', text: 'Giraffe' },
          { id: 'q6o4', text: 'Great White Shark' },
        ],
        correctAnswers: ['q6o2'],
      },
    ],
  },
];

export const getQuizById = (id: string): Quiz | undefined => {
  return quizzes.find((quiz) => quiz.id === id);
};
