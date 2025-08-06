# QuizMaster Pro

QuizMaster Pro is a full-stack web application designed for creating, managing, and taking quizzes. It features distinct roles for administrators and users, a robust quiz creation system with AI-powered tools, and a clean, modern user interface.

## Features

### User Roles & Authentication
- **Dual Role System:** The application supports two user roles: `Admin` and `User`.
- **Registration:** New users can create an account through a simple registration form.
- **Login:** Registered users can log in to access their dashboards and take quizzes.
- **Role-Based Routing:** After logging in, users are automatically redirected to their respective dashboards (`/admin/dashboard` for admins, `/dashboard` for users).

### Admin Dashboard
Admins have full control over the platform's content and users.

- **Central Dashboard:** A summary view of platform statistics, including total quizzes and user submissions.
- **User Management:**
    - Create, view, update, and delete users.
    - Assign roles (`admin` or `user`) to control access levels.
- **Quiz Management:**
    - **Create & Edit Quizzes:** A powerful quiz builder to create quizzes with various question types (Multiple Choice, True/False, Text Input).
    - **Public vs. Private Quizzes:**
        - **Public:** Quizzes are accessible to anyone, including non-logged-in visitors.
        - **Private:** Quizzes are accessible only to specific users assigned by the admin.
    - **AI-Powered Question Shuffling:** Admins can bulk-add questions and use an AI tool to intelligently reorder them for a more engaging quiz experience.
    - **Delete Quizzes:** Remove quizzes from the platform.

### User Experience
- **Public Homepage:** A landing page that displays all `public` quizzes for guests and logged-in users to take.
- **User Dashboard:** A personalized space for logged-in users to find all quizzes available to them (both public and assigned private quizzes).
- **Interactive Quiz Interface:**
    - Timed quizzes to challenge users.
    - Support for multiple-choice, true/false, and text-based questions.
    - Clean navigation to move between questions.
- **Instant Results:** Users can view their score and review their answers immediately after completing a quiz.

## Technology Stack
- **Frontend:**
    - **Next.js:** React framework with App Router for server-side rendering and optimized performance.
    - **React & TypeScript:** For building interactive and type-safe user interfaces.
    - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
    - **ShadCN UI:** A collection of beautifully designed, accessible, and reusable components.
- **Backend & AI:**
    - **Genkit (by Firebase):** Powers the AI features, such as the intelligent question shuffler.
    - **Server Actions:** Next.js server actions are used for form submissions and data mutations without needing separate API endpoints.
- **Database:**
    - **better-sqlite3:** A lightweight, file-based SQL database for local development and data persistence.
