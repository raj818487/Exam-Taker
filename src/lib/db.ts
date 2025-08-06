
import Database from 'better-sqlite3';

const db = new Database('quiz.db');
db.pragma('journal_mode = WAL');

// --- Schema Definition ---
const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
);`;

const createQuizzesTable = `
CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  timeLimit INTEGER NOT NULL,
  quizType TEXT NOT NULL CHECK(quizType IN ('public', 'private')) DEFAULT 'public'
);`;

const createQuestionsTable = `
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  questionType TEXT NOT NULL CHECK(questionType IN ('multiple-choice', 'true-false', 'text')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);`;

const createOptionsTable = `
CREATE TABLE IF NOT EXISTS options (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  isCorrect BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);`;

const createQuizAssignmentsTable = `
CREATE TABLE IF NOT EXISTS quiz_assignments (
    user_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, quiz_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);`;


db.exec(createUsersTable);
db.exec(createQuizzesTable);
db.exec(createQuestionsTable);
db.exec(createOptionsTable);
db.exec(createQuizAssignmentsTable);


// --- Initial Data Seeding ---
function seedData() {
  db.exec('DELETE FROM quiz_assignments');
  db.exec('DELETE FROM options');
  db.exec('DELETE FROM questions');
  db.exec('DELETE FROM quizzes');
  db.exec('DELETE FROM users');
  
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log('Seeding initial users...');
    const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
    const initialUsers = [
        { name: 'Admin User', email: 'admin@example.com', password: 'password', role: 'admin' },
        { name: 'Regular User', email: 'user@example.com', password: 'password', role: 'user' },
    ];
    const insertManyUsers = db.transaction((users) => {
        for (const user of users) insertUser.run(user.name, user.email, user.password, user.role);
    });
    insertManyUsers(initialUsers);
  }

  const quizCount = db.prepare('SELECT COUNT(*) as count FROM quizzes').get() as { count: number };
   if (quizCount.count === 0) {
    console.log('Seeding initial quizzes...');
    const insertQuiz = db.prepare('INSERT INTO quizzes (title, description, timeLimit, quizType) VALUES (?, ?, ?, ?)');
    const insertQuestion = db.prepare('INSERT INTO questions (quiz_id, text, questionType) VALUES (?, ?, ?)');
    const insertOption = db.prepare('INSERT INTO options (question_id, text, isCorrect) VALUES (?, ?, ?)');
    const insertAssignment = db.prepare('INSERT INTO quiz_assignments (user_id, quiz_id) VALUES (?, ?)');

    const seedTransaction = db.transaction(() => {
        // Quiz 1 (Public)
        const quiz1Info = insertQuiz.run('General Knowledge Challenge', 'A fun quiz to test your general knowledge across various domains.', 10, 'public');
        const quiz1Id = quiz1Info.lastInsertRowid;

        const q1Info = insertQuestion.run(quiz1Id, 'What is the capital of France?', 'multiple-choice');
        insertOption.run(q1Info.lastInsertRowid, 'Berlin', 0);
        insertOption.run(q1Info.lastInsertRowid, 'Madrid', 0);
        insertOption.run(q1Info.lastInsertRowid, 'Paris', 1);
        insertOption.run(q1Info.lastInsertRowid, 'Rome', 0);
        
        const q2Info = insertQuestion.run(quiz1Id, 'The Great Wall of China is visible from the Moon.', 'true-false');
        insertOption.run(q2Info.lastInsertRowid, 'True', 0);
        insertOption.run(q2Info.lastInsertRowid, 'False', 1);
        
        const q3Info = insertQuestion.run(quiz1Id, 'What is the largest planet in our solar system?', 'text');
        insertOption.run(q3Info.lastInsertRowid, 'jupiter', 1);


        // Quiz 2 (Public)
        const quiz2Info = insertQuiz.run('Science & Nature', 'Explore the wonders of the natural world and the laws of science.', 15, 'public');
        const quiz2Id = quiz2Info.lastInsertRowid;

        const q4Info = insertQuestion.run(quiz2Id, 'What is H2O more commonly known as?', 'text');
        insertOption.run(q4Info.lastInsertRowid, 'water', 1);

        const q5Info = insertQuestion.run(quiz2Id, 'Which is the largest mammal?', 'multiple-choice');
        insertOption.run(q5Info.lastInsertRowid, 'Elephant', 0);
        insertOption.run(q5Info.lastInsertRowid, 'Blue Whale', 1);
        insertOption.run(q5Info.lastInsertRowid, 'Giraffe', 0);
        insertOption.run(q5Info.lastInsertRowid, 'Great White Shark', 0);

        // Quiz 3 (Private)
        const quiz3Info = insertQuiz.run('Advanced Mathematics', 'A challenging quiz for math enthusiasts.', 30, 'private');
        const quiz3Id = quiz3Info.lastInsertRowid;

        const q6Info = insertQuestion.run(quiz3Id, 'What is the value of Pi to two decimal places?', 'text');
        insertOption.run(q6Info.lastInsertRowid, '3.14', 1);

        const regularUser = db.prepare('SELECT id FROM users WHERE email = ?').get('user@example.com') as {id: number};
        if(regularUser) {
            insertAssignment.run(regularUser.id, quiz3Id);
        }

    });

    seedTransaction();
  }
}

// Since this is an in-memory database, we need to re-seed it on every app reload
// in development. In a production environment, you would use a persistent database.
// This check ensures that seeding only happens on the server.
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    seedData();
}

export { db };
