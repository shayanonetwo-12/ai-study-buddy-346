import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { generateQuiz, submitQuiz, type QuizQuestion } from "@/lib/quiz.functions";
import { Brain, Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/quiz")({
  ssr: false,
  component: Quiz,
});

function Quiz() {
  const gen = useServerFn(generateQuiz);
  const submit = useServerFn(submitQuiz);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<{ score: number; total: number; weak: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const start = async () => {
    if (!subject.trim() || !topic.trim()) {
      toast.error("Enter subject and topic");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { questions } = await gen({ data: { subject, topic, difficulty } });
      setQuestions(questions);
      setAnswers(new Array(questions.length).fill(-1));
      setCurrent(0);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    setLoading(true);
    try {
      const r = await submit({ data: { subject, topic, difficulty, questions, answers } });
      setResult(r);
      toast.success(`Score: ${r.score}/${r.total} — +${20 + r.score * 5} XP`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestions([]);
    setResult(null);
    setAnswers([]);
    setCurrent(0);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
          <Brain className="size-4" /> AI Quiz Generator
        </div>
        <h1 className="text-3xl font-display font-bold">Test your knowledge</h1>

        {questions.length === 0 && !result && (
          <div className="card-glass p-6 mt-6 space-y-3">
            <input
              placeholder="Subject (e.g. Chemistry)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm"
            />
            <input
              placeholder="Topic / Chapter (e.g. Chemical Bonding)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm"
            />
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize ${
                    difficulty === d ? "border-primary bg-primary/15" : "border-border bg-surface"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={start}
              disabled={loading}
              className="w-full rounded-lg gradient-bg py-2.5 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Generate quiz
            </button>
          </div>
        )}

        {questions.length > 0 && !result && (
          <div className="card-glass p-6 mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {current + 1} of {questions.length}</span>
              <span className="capitalize">{difficulty}</span>
            </div>
            <div className="mt-2 h-1.5 bg-surface-2 rounded-full">
              <div className="h-full gradient-bg rounded-full" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <h2 className="mt-5 text-lg font-semibold">{questions[current].question}</h2>
            <div className="mt-4 space-y-2">
              {questions[current].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const next = [...answers];
                    next[current] = i;
                    setAnswers(next);
                  }}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition ${
                    answers[current] === i
                      ? "border-primary bg-primary/15"
                      : "border-border bg-surface hover:bg-surface-2"
                  }`}
                >
                  <span className="text-xs text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-between">
              <button
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>
              {current < questions.length - 1 ? (
                <button
                  onClick={() => setCurrent(current + 1)}
                  disabled={answers[current] === -1}
                  className="rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={answers.includes(-1) || loading}
                  className="rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-40"
                >
                  {loading ? "Grading..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="card-glass p-8 mt-6 text-center">
            <div className="text-5xl font-display font-bold gradient-text">
              {result.score}/{result.total}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You scored {Math.round((result.score / result.total) * 100)}%
            </p>
            {result.weak.length > 0 && (
              <div className="mt-4 text-left">
                <div className="text-sm font-semibold">Weak areas:</div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {result.weak.map((w) => (
                    <li key={w}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-6 space-y-2 text-left">
              {questions.map((q, i) => (
                <details key={i} className="rounded-lg bg-surface p-3 text-sm">
                  <summary className="cursor-pointer flex items-center gap-2">
                    {answers[i] === q.correct ? (
                      <CheckCircle2 className="size-4 text-success" />
                    ) : (
                      <XCircle className="size-4 text-destructive" />
                    )}
                    <span>{q.question}</span>
                  </summary>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div>Correct: {q.options[q.correct]}</div>
                    <div className="mt-1">{q.explanation}</div>
                  </div>
                </details>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-6 rounded-lg gradient-bg px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary"
            >
              Try another quiz
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
