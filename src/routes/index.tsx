import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Brain, CalendarDays, MessageSquareText, BarChart3, Layers, Timer, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Landing,
});

const FEATURES = [
  { icon: CalendarDays, title: "AI Study Planner", desc: "Personalized day-by-day schedules built around your exam date and available hours." },
  { icon: MessageSquareText, title: "AI Study Assistant", desc: "Ask anything — get simple explanations, examples, and quick quizzes." },
  { icon: Brain, title: "Quiz Generator", desc: "Instant MCQs at your chosen difficulty with weak-area detection." },
  { icon: Layers, title: "Smart Flashcards", desc: "Auto-generated flashcards from your notes for spaced revision." },
  { icon: Timer, title: "Pomodoro Focus", desc: "Stay in the zone with focused study sessions and rest cycles." },
  { icon: BarChart3, title: "Performance Analytics", desc: "See your strongest subjects and where to improve next." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl gradient-bg flex items-center justify-center glow-primary">
              <Sparkles className="size-5 text-primary-foreground" />
            </div>
            <div className="font-display font-semibold text-lg">StudyAI</div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-primary-foreground glow-primary hover:opacity-90 transition"
            >
              Open app
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary mb-6">
            <Zap className="size-3" /> Your personal AI study coach
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
            Study smarter with <span className="gradient-text">StudyAI</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Personalized study plans, AI-powered explanations, quizzes, flashcards, and progress
            analytics — everything you need to ace your exams.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth"
              className="rounded-xl gradient-bg px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Start studying free <ArrowRight className="size-4" />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold hover:bg-surface-2 transition"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-glass p-6 hover:border-primary/40 transition">
              <div className="size-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
                <f.icon className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Built with StudyAI — Your Personal AI Study Coach
      </footer>
    </div>
  );
}
