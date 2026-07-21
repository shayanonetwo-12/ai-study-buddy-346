import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  ssr: false,
  component: Analytics,
});

function Analytics() {
  const { data } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [tasks, quizzes, focus, subjects] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", uid).gte("created_at", weekAgo),
        supabase.from("quiz_results").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
        supabase.from("focus_sessions").select("minutes").eq("user_id", uid).gte("completed_at", weekAgo),
        supabase.from("subjects").select("name").eq("user_id", uid),
      ]);
      return {
        tasks: tasks.data ?? [],
        quizzes: quizzes.data ?? [],
        focusMinutes: (focus.data ?? []).reduce((a, b) => a + (b.minutes ?? 0), 0),
        subjects: subjects.data ?? [],
      };
    },
  });

  const tasks = data?.tasks ?? [];
  const quizzes = data?.quizzes ?? [];
  const done = tasks.filter((t) => t.completed).length;
  const quizAvg = quizzes.length
    ? Math.round((quizzes.reduce((a, q) => a + q.score / q.total, 0) / quizzes.length) * 100)
    : 0;

  // Group by subject
  const subjectScores: Record<string, { total: number; count: number }> = {};
  quizzes.forEach((q) => {
    if (!subjectScores[q.subject]) subjectScores[q.subject] = { total: 0, count: 0 };
    subjectScores[q.subject].total += (q.score / q.total) * 100;
    subjectScores[q.subject].count += 1;
  });
  const subjectRanking = Object.entries(subjectScores)
    .map(([s, v]) => ({ subject: s, avg: Math.round(v.total / v.count) }))
    .sort((a, b) => b.avg - a.avg);

  const weakTopics = quizzes.flatMap((q) => (q.weak_topics as string[]) ?? []);
  const weakCount: Record<string, number> = {};
  weakTopics.forEach((t) => (weakCount[t] = (weakCount[t] ?? 0) + 1));
  const topWeak = Object.entries(weakCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
          <BarChart3 className="size-4" /> Performance Analytics
        </div>
        <h1 className="text-3xl font-display font-bold">Your learning insights</h1>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={<Clock />} label="Focus (week)" value={`${Math.round((data?.focusMinutes ?? 0) / 60 * 10) / 10}h`} />
          <Stat icon={<Target />} label="Tasks done (week)" value={`${done}/${tasks.length}`} />
          <Stat icon={<TrendingUp />} label="Quiz average" value={`${quizAvg}%`} />
          <Stat icon={<BarChart3 />} label="Quizzes taken" value={`${quizzes.length}`} />
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <div className="card-glass p-6">
            <h2 className="font-semibold">Subject performance</h2>
            <div className="mt-4 space-y-3">
              {subjectRanking.length === 0 && (
                <div className="text-sm text-muted-foreground">Take a quiz to see your subject performance.</div>
              )}
              {subjectRanking.map((s) => (
                <div key={s.subject}>
                  <div className="flex justify-between text-sm">
                    <span>{s.subject}</span>
                    <span className="font-semibold">{s.avg}%</span>
                  </div>
                  <div className="mt-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                    <div className="h-full gradient-bg" style={{ width: `${s.avg}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {subjectRanking.length >= 2 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-success/10 border border-success/30 p-3">
                  <div className="text-xs text-muted-foreground">Strongest</div>
                  <div className="font-semibold text-success">{subjectRanking[0].subject}</div>
                </div>
                <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
                  <div className="text-xs text-muted-foreground">Needs work</div>
                  <div className="font-semibold text-warning">{subjectRanking[subjectRanking.length - 1].subject}</div>
                </div>
              </div>
            )}
          </div>

          <div className="card-glass p-6">
            <h2 className="font-semibold">Weak topics to revise</h2>
            <div className="mt-4 space-y-2">
              {topWeak.length === 0 && (
                <div className="text-sm text-muted-foreground">Great — no weak topics yet!</div>
              )}
              {topWeak.map(([t, c]) => (
                <div key={t} className="flex items-center justify-between rounded-lg bg-surface p-3 text-sm">
                  <span>{t}</span>
                  <span className="text-xs text-muted-foreground">missed {c}x</span>
                </div>
              ))}
            </div>
            {topWeak.length > 0 && (
              <div className="mt-4 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
                💡 <span className="font-semibold">AI tip:</span> Add 20 minutes of daily practice on your weakest topic to see fast improvement.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-glass p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground [&>svg]:size-4">
        {icon} {label}
      </div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
    </div>
  );
}
