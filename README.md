<div align="center">

# 🎓 AI Study Buddy

### Your all-in-one AI-powered learning companion

**Plan Smarter • Learn Faster • Stay Focused • Ace Your Exams**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Try%20Now-success?style=for-the-badge)](https://ai-study-buddy-346.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/shayanonetwo-12/ai-study-buddy-346)

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=flat-square&logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## 📖 Table of Contents

- [About the App](#-about-the-app)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [The AI Feature](#-the-ai-feature)
- [Tech Stack & Services](#️-tech-stack--services)
- [Screenshots](#-screenshots)
- [How to Run the Project](#-how-to-run-the-project)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📚 About the App

**AI Study Buddy** is a web app that brings everything a student needs to study effectively into a single, focused platform.

### 🎯 The Problem

Students today juggle a scattered toolkit just to prepare for exams — one app for scheduling, another for making quizzes, a notes app, a separate chatbot for questions, flashcard tools, and a timer app for focus sessions. Constantly switching between tools breaks concentration and makes it hard to stay consistent with a study plan.

### 💡 The Solution

AI Study Buddy solves this by combining **planning, tutoring, quizzing, revision, and focus tracking** into one intelligent, connected workflow. Instead of hopping between five different apps, a student can:

- ✅ Organize their study schedule
- ✅ Learn difficult concepts with an AI tutor
- ✅ Generate quizzes instantly for revision
- ✅ Review material with AI-generated flashcards
- ✅ Stay focused using built-in productivity sessions
- ✅ Track their progress over time

### 👥 Who It's For

| Audience | Why it helps |
|---|---|
| 🎓 University students | Manage coursework and exam prep in one place |
| 🏫 College students | Stay organized across multiple subjects |
| 📚 High school students | Get concepts explained in simple terms |
| 🧑‍💻 Self-learners | Structure independent study without a curriculum |
| 📖 Competitive exam aspirants | Drill concepts fast with quizzes and flashcards |

---

## 🌐 Live Demo

### 👉 **[https://ai-study-buddy-346.vercel.app/](https://ai-study-buddy-346.vercel.app/)**

The app is fully deployed and live — no installation needed to try it out.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Study Assistant** | Ask academic questions and get clear, tutor-style AI explanations |
| 📅 **AI Study Planner** | Automatically generate a personalized study schedule |
| 📝 **Quiz Generator** | Instantly create quizzes on any topic for revision |
| 🧠 **Flashcards** | AI-generated flashcards designed for active recall |
| ⏱️ **Pomodoro Timer** | Built-in focus sessions to stay productive |
| 📊 **Analytics Dashboard** | Track learning progress and performance over time |
| 🔐 **Authentication** | Secure sign-up/login powered by Supabase |
| 📱 **Responsive UI** | Fully usable on desktop, tablet, and mobile |

---

## 🤖 The AI Feature

### AI Study Assistant

The centerpiece of the app is the **AI Study Assistant** — a conversational tutor built into the platform. Rather than just spitting out answers, it's designed to actually help students *learn*:

- ✅ Explains concepts step-by-step
- ✅ Breaks difficult topics down into simple language
- ✅ Answers educational/subject questions on demand
- ✅ Uses examples to reinforce understanding
- ✅ Encourages critical thinking instead of rote answers
- ✅ Supports revision by re-explaining or simplifying past topics

### 🧠 System Prompt Behind the Assistant

```text
You are AI Study Buddy, an intelligent educational assistant.

Your objective is to help students learn concepts rather than
simply giving them answers.

Instructions:
• Explain concepts step-by-step.
• Adapt explanations to the student's knowledge level.
• Encourage critical thinking.
• Use examples whenever possible.
• Be friendly, patient, and supportive.
• Avoid misinformation.
• If uncertain, clearly state your limitations.
```

This prompt shapes every response from the assistant — prioritizing *teaching* over shortcutting the learning process, which is the core problem the app is trying to solve.

---

## 🛠️ Tech Stack & Services

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI library |
| TypeScript | Type-safe application code |
| TanStack Start / TanStack Router | Routing & app framework |
| Tailwind CSS v4 | Styling |
| Radix UI | Accessible UI primitives |
| React Hook Form + Zod | Form handling & validation |
| Lucide React | Icons |
| React Query | Data fetching & caching |
| date-fns, clsx | Utilities |

### Backend & Infrastructure

| Service | Purpose |
|---|---|
| **Supabase** | Authentication, database (PostgreSQL), and backend logic |
| **AI Language Model (LLM API)** | Powers the AI Study Assistant, quiz generation, and flashcard creation |
| **Vercel** | Hosting & continuous deployment |

### Tooling

- Vite — build tool & dev server
- Bun / npm — package management
- ESLint + Prettier — code quality & formatting

---

## 📸 Screenshots

> Screenshots showing the app in action. *(Replace the placeholder image links below with your own captured screenshots — e.g. upload them to a `docs/screenshots/` folder in the repo and update the paths.)*

| Landing Page | Dashboard |
|---|---|
| ![Landing Page](docs/screenshots/landing-page.png) | ![Dashboard](docs/screenshots/dashboard.png) |

| AI Study Assistant | Study Planner |
|---|---|
| ![AI Assistant](docs/screenshots/ai-assistant.png) | ![Study Planner](docs/screenshots/study-planner.png) |

| Quiz Generator | Analytics |
|---|---|
| ![Quiz Generator](docs/screenshots/quiz-generator.png) | ![Analytics](docs/screenshots/analytics.png) |

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/shayanonetwo-12/ai-study-buddy-346.git
cd ai-study-buddy-346
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_ai_api_key
```

### 4. Run the app locally

```bash
npm run dev
```

The app will start on a local development server (typically `http://localhost:5173`).

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🎯 Roadmap

- [ ] 📄 PDF upload & summarization
- [ ] 🎤 Voice-based AI tutor
- [ ] 🧠 Mind maps
- [ ] 📱 Native mobile app
- [ ] 📆 Calendar sync
- [ ] 🏆 Study streaks & gamification
- [ ] 👥 Collaborative study rooms
- [ ] 🌙 Enhanced dark mode

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

Then open a Pull Request 🚀

---

## 📄 License

Licensed under the **MIT License**.

---

## 👨‍💻 Author

**Shayan Shahid**

🌐 Live Demo: [ai-study-buddy-346.vercel.app](https://ai-study-buddy-346.vercel.app/)
💻 GitHub: [@shayanonetwo-12](https://github.com/shayanonetwo-12)

<div align="center">

⭐ **If you find this project useful, consider giving it a star — it helps others discover it!**

Made with ❤️ using React, TypeScript, Supabase & AI

</div>
