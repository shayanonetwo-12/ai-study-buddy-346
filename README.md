# 🎓 AI Study Buddy

An AI-powered learning platform that helps students study smarter by generating personalized study plans, answering academic questions, creating quizzes, and tracking learning progress.

---

## 📚 About the Project

### What is AI Study Buddy?

AI Study Buddy is a modern web application that acts as a personal AI learning assistant. It combines study planning, AI-powered tutoring, quizzes, flashcards, and productivity tools into one platform, making learning more organized and efficient.

### ❓ The Problem It Solves

Students often rely on multiple applications for planning, revision, note-taking, quizzes, and study assistance. Switching between these tools is time-consuming and reduces productivity.

AI Study Buddy solves this by bringing everything together in one intelligent platform where students can:

- Create personalized study schedules
- Ask AI academic questions
- Generate quizzes instantly
- Revise using flashcards
- Stay focused with productivity tools
- Track their learning progress

### 👥 Target Users

- University students
- College students
- High school students
- Self-learners
- Competitive exam candidates
- Anyone looking for an AI-powered study companion

---

# 🌐 Live Demo

## 🚀 Try the application here

### https://ai-study-buddy-346.vercel.app/

---

# ✨ Features

## 🤖 AI Study Assistant

- AI-powered academic chatbot
- Explains difficult concepts
- Answers study-related questions
- Provides examples and learning guidance
- Assists with revision

---

## 📅 AI Study Planner

Generate personalized study schedules based on:

- Subjects
- Study hours
- Exam dates
- Daily goals
- Learning priorities

---

## 📝 AI Quiz Generator

Create quizzes instantly.

Supports:

- Multiple Choice Questions
- Different difficulty levels
- Instant scoring
- Performance feedback
- Revision recommendations

---

## 🧠 Flashcards

- AI-generated flashcards
- Active Recall learning
- Spaced Repetition
- Quick revision sessions

---

## ⏱ Pomodoro Focus Timer

Increase productivity using:

- Focus sessions
- Short breaks
- Long breaks
- Study session tracking

---

## 📊 Progress Dashboard

Track:

- Study hours
- Quiz scores
- Completed sessions
- Productivity
- Learning progress

---

## 🔐 Authentication

- Secure login
- User registration
- Session management
- Protected routes using Supabase Authentication

---

## 📱 Responsive Design

- Desktop support
- Tablet support
- Mobile-friendly interface

---

# 🤖 AI Feature

## AI Study Assistant

The core AI feature is an intelligent study assistant that helps students understand concepts, answer academic questions, and provide personalized learning support.

### Capabilities

- Explains topics in simple language
- Answers educational questions
- Generates study guidance
- Helps with revision
- Encourages conceptual understanding instead of memorization

### Example System Prompt

```
You are AI Study Buddy, an intelligent educational assistant.

Your goal is to help students learn—not simply provide answers.

Guidelines:

• Explain concepts clearly and accurately.
• Adapt explanations to the student's level.
• Break complex topics into simple steps.
• Encourage critical thinking.
• Provide examples whenever possible.
• If solving a problem, explain every step.
• Avoid giving misleading or fabricated information.
• Be supportive, patient, and encouraging.
```

---

# 🛠️ Technologies Used

## Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack React Query
- Vite

### UI

- Tailwind CSS v4
- Radix UI
- Lucide React Icons

### Backend

- Supabase
  - Authentication
  - Database
  - Backend Services

### Form Validation

- React Hook Form
- Zod

### Utilities

- date-fns
- clsx
- class-variance-authority

### Deployment

- Vercel

---

# 🧠 AI Models & Services

- OpenAI-compatible Large Language Model (LLM) for conversational study assistance
- Supabase for backend infrastructure and authentication
- Vercel for deployment and hosting

> **Note:** Replace the AI model name above with the exact model you configured (e.g., GPT-4.1, GPT-4o, Gemini 2.5 Flash, Claude 4 Sonnet, etc.).

---

# 📸 Screenshots

## Landing Page

> Add screenshot here

```
screenshots/landing-page.png
```

---

## Dashboard

> Add screenshot here

```
screenshots/dashboard.png
```

---

## AI Study Assistant

> Add screenshot here

```
screenshots/ai-chat.png
```

---

## Quiz Generator

> Add screenshot here

```
screenshots/quiz-generator.png
```

---

## Study Planner

> Add screenshot here

```
screenshots/study-planner.png
```

---

# 🚀 Running the Project

## 1. Clone the repository

```bash
git clone https://github.com/shayanonetwo-12/ai-study-buddy-346.git
```

## 2. Navigate into the project

```bash
cd ai-study-buddy-346
```

## 3. Install dependencies

```bash
npm install
```

or

```bash
bun install
```

## 4. Configure environment variables

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If your AI provider requires an API key, add it as well:

```env
OPENAI_API_KEY=your_api_key
```

*(Replace `OPENAI_API_KEY` with the correct variable name if you're using another provider.)*

## 5. Start the development server

```bash
npm run dev
```

## 6. Build for production

```bash
npm run build
```

## 7. Preview the production build

```bash
npm run preview
```

Open your browser and visit:

```
http://localhost:3000
```

or the URL shown in your terminal.
