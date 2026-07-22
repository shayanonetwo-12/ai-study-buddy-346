# 🎓 AI Study Buddy

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

### 🚀 Your AI-Powered Personal Learning Companion

Plan smarter • Learn faster • Stay focused • Achieve more

**🌐 Live Demo:** https://ai-study-buddy-346.vercel.app/

[Live Demo](https://ai-study-buddy-346.vercel.app/) •
[Report Bug](https://github.com/shayanonetwo-12/ai-study-buddy-346/issues) •
[Request Feature](https://github.com/shayanonetwo-12/ai-study-buddy-346/issues)

</div>

---

# 📖 Table of Contents

- [About](#-about)
- [Why AI Study Buddy?](#-why-ai-study-buddy)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Deployment](#-deployment)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

# 📚 About

AI Study Buddy is a modern AI-powered study assistant designed to help students organize their learning, improve productivity, and prepare effectively for exams.

Instead of switching between multiple apps for planning, note-taking, quizzes, revision, and productivity tracking, AI Study Buddy brings everything together into one intelligent platform.

Whether you're preparing for university exams, professional certifications, or daily coursework, AI Study Buddy adapts to your study routine and helps you learn more efficiently.

---

# 🎯 Why AI Study Buddy?

Studying often involves juggling multiple tools:

- Calendar apps
- Flashcard apps
- Note-taking apps
- Quiz platforms
- Timers
- AI chat assistants

AI Study Buddy combines all of these into one seamless experience, helping students focus on learning rather than managing different tools.

---

# ✨ Features

## 🤖 AI Study Assistant

Interact with an intelligent AI tutor capable of:

- Explaining difficult concepts
- Answering academic questions
- Breaking down complex topics
- Providing study tips
- Helping with revision

---

## 📅 AI Study Planner

Generate personalized study schedules based on:

- Subjects
- Available study hours
- Exam dates
- Learning priorities
- Daily goals

The planner automatically creates a balanced schedule to maximize productivity.

---

## 📝 AI Quiz Generator

Generate quizzes instantly for any subject.

Features include:

- Multiple Choice Questions
- Adjustable difficulty
- Instant scoring
- Weak area identification
- Performance feedback

---

## 🧠 Smart Flashcards

Automatically create revision flashcards.

Supports:

- Active Recall
- Spaced Repetition
- Quick Review Sessions
- Long-term memory retention

---

## ⏱ Pomodoro Focus Timer

Improve concentration using structured focus sessions.

Includes:

- Focus Timer
- Short Breaks
- Long Breaks
- Productivity Tracking

---

## 📊 Progress Analytics

Track your academic progress with interactive dashboards.

Monitor:

- Study hours
- Completed sessions
- Quiz scores
- Learning streaks
- Subject performance

---

## 👤 Authentication

Secure authentication powered by Supabase.

Supports:

- User registration
- Login
- Session management
- Protected routes

---

## 🎨 Modern User Interface

Designed with a clean and responsive interface.

Features:

- Responsive layout
- Smooth animations
- Accessible components
- Mobile-friendly experience
- Fast navigation

---

# 🏗 Architecture

```
                      User
                        │
                        ▼
                React Frontend
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
  Study Planner    AI Assistant     Quiz Generator
        │               │                │
        └───────────────┼────────────────┘
                        ▼
                 Supabase Backend
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
 Authentication     Database      User Data
```

---

# 💻 Tech Stack

## Frontend

- React 19
- TypeScript
- TanStack Start
- TanStack Router
- TanStack React Query
- Vite

---

## UI

- Tailwind CSS v4
- Radix UI
- Lucide React Icons

---

## Backend

- Supabase

---

## Validation

- React Hook Form
- Zod

---

## Utilities

- date-fns
- clsx
- class-variance-authority

---

# 📂 Project Structure

```
src
│
├── components
│   ├── ui
│   ├── markdown.tsx
│   └── app-shell.tsx
│
├── hooks
│
├── integrations
│
├── lib
│
├── routes
│   ├── index.tsx
│   ├── auth.tsx
│   └── __root.tsx
│
├── router.tsx
├── server.ts
├── start.ts
└── styles.css
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/shayanonetwo-12/ai-study-buddy-346.git
```

Move into the project.

```bash
cd ai-study-buddy-346
```

Install dependencies.

```bash
npm install
```

or

```bash
bun install
```

---

# ⚙ Environment Variables

Create a `.env` file in the root directory.

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# ▶ Running the Project

Development mode

```bash
npm run dev
```

Build production version

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# 🌐 Deployment

The application is deployed on **Vercel**.

### Live Application

https://ai-study-buddy-346.vercel.app/

Deploy your own copy:

1. Fork this repository
2. Import into Vercel
3. Add Supabase environment variables
4. Deploy

---

# 📖 Usage Guide

### 1. Create an Account

Register using your email.

---

### 2. Log In

Access your personalized dashboard.

---

### 3. Create a Study Plan

Enter:

- Subjects
- Available hours
- Target exam dates

Receive a personalized AI-generated study schedule.

---

### 4. Ask the AI

Use the AI assistant to:

- Explain concepts
- Solve problems
- Answer questions
- Improve understanding

---

### 5. Generate Quizzes

Choose any topic.

The AI instantly creates quizzes for revision.

---

### 6. Review Flashcards

Study generated flashcards using spaced repetition techniques.

---

### 7. Track Progress

Monitor:

- Daily study sessions
- Quiz performance
- Productivity
- Learning consistency

---

# 📸 Screenshots

Add screenshots here.

```
screenshots/

landing-page.png

dashboard.png

planner.png

quiz-generator.png

flashcards.png

analytics.png
```

---

# 🔒 Security

Authentication and user management are handled securely using Supabase.

Sensitive configuration values are stored using environment variables.

---

# ⚡ Performance Optimizations

- React Query caching
- Code splitting
- Lazy loading
- Optimized routing
- Fast Vite bundling
- Efficient state management

---

# 🎯 Roadmap

Future improvements include:

- AI Note Summarizer
- PDF Upload & Analysis
- Voice AI Tutor
- OCR Notes Scanner
- AI Homework Solver
- AI Mind Maps
- Calendar Integration
- Mobile App
- Offline Support
- Gamification
- Daily Streaks
- Leaderboards
- Collaborative Study Groups
- Multi-language Support

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository

2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push your branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 🙌 Acknowledgements

Special thanks to the open-source community and the developers behind:

- React
- TanStack
- Supabase
- Tailwind CSS
- Radix UI
- Lucide Icons
- Vite

---

# 👨‍💻 Author

**Shayan Shahid**

GitHub

https://github.com/shayanonetwo-12

---

<div align="center">

### ⭐ If you found this project useful, please consider giving it a star!

It helps others discover the project and motivates future development.

Made with ❤️ using React, TypeScript, Supabase, and AI.

</div>
