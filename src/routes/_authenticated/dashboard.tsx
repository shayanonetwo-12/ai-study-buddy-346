import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { completeTask } from "@/lib/user.functions";
import { CalendarDays, Sparkles, Flame, Trophy, Clock, Plus, CheckCircle2, Circle } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: prof } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", data.user.id)
      .single();
    if (!prof?.onboarded) throw redirect({ to: "/onboarding" });
  },
  component: Dashboard,
});

function Dashboard() {
  const qc = useQueryClient();
  const toggleTask = useServerFn(completeTask);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user!.id).single();
      return p;
    },
  });

  const today = new Date().toISOString().slice(0, 10);

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", "today"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("tasks")
        .select("*, subjects(name, color)")
        .eq("user_id", u.user!.id)
        .eq("task_date", today)
        .order("created_at");
      return data ?? [];
    },
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", u.user!.id)
        .not("exam_date", "is", null)
        .order("exam_date");
      return data ?? [];
    },
  });

  const completed = tasks.filter((t) => t.completed).length;
  const pct = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const level = Math.floor((profile?.xp ?? 0) / 100) + 1;
  const xpToNext = 100 - ((profile?.xp ?? 0) % 100);

  const toggle = async (id: string, done: boolean) => {
    // Optimistic update — instant UI feedback
    qc.setQueryData<any[]>(["tasks", "today"], (old = []) =>
      old.map((t) => (t.id === id ? { ...t, completed: !done } : t)),
    );
    if (!done) {
      qc.setQueryData<any>(["profile"], (p: any) =>
        p ? { ...p, xp: (p.xp ?? 0) + 10 } : p,
      );
      toast.success("+10 XP!");
    }
    try {
      await toggleTask({ data: { taskId: id, completed: !done } });
      qc.invalidateQueries({ queryKey: ["profile"] });
    } catch {
      toast.error("Failed to update");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {greeting}, {profile?.name || "friend"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Here's your study snapshot for today.</p>
          </div>
          <Link
            to="/planner"
            className="rounded-lg gradient-bg px-4 py-2 text-sm font-medium text-primary-foreground glow-primary inline-flex items-center gap-2"
          >
            <Sparkles className="size-4" /> Generate AI plan
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Trophy className="size-5" />} label="Level" value={`${level}`} sub={`${xpToNext} XP to next`} />
          <StatCard icon={<Sparkles className="size-5" />} label="Total XP" value={`${profile?.xp ?? 0}`} sub="Keep going!" />
          <StatCard icon={<Flame className="size-5 text-warning" />} label="Streak" value={`${profile?.streak_days ?? 0}`} sub="days in a row" />
          <StatCard icon={<Clock className="size-5" />} label="Today" value={`${pct}%`} sub={`${completed}/${tasks.length} tasks`} />
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          {/* Progress + tasks */}
          <div className="lg:col-span-2 card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Today's tasks</h2>
              <span className="text-xs text-muted-foreground">{format(new Date(), "EEE, MMM d")}</span>
            </div>
            <div className="mt-3 h-2 bg-surface-2 rounded-full overflow-hidden">
              <div className="h-full gradient-bg transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-5 space-y-2">
              {tasks.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  No tasks yet. <Link to="/planner" className="text-primary underline">Generate a plan</Link> to fill your day.
                </div>
              )}
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id, t.completed)}
                  className="w-full flex items-start gap-3 rounded-lg border border-border bg-surface hover:bg-surface-2 p-3 text-left transition"
                >
                  {t.completed ? (
                    <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${t.completed ? "line-through text-muted-foreground" : ""}`}>
                      {t.title}
                    </div>
                    {t.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">{t.description}</div>
                    )}
                  </div>
                  {t.subjects && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
                      {t.subjects.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming exams */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Upcoming exams</h2>
              <Link to="/planner" className="text-xs text-primary"><Plus className="size-3 inline" /> Add</Link>
            </div>
            <div className="mt-4 space-y-3">
              {subjects.length === 0 && (
                <div className="text-sm text-muted-foreground">No exams scheduled.</div>
              )}
              {subjects.slice(0, 5).map((s) => {
                const days = differenceInDays(new Date(s.exam_date!), new Date());
                return (
                  <div key={s.id} className="flex items-center gap-3 rounded-lg bg-surface p-3">
                    <CalendarDays className="size-5 text-accent" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(s.exam_date!), "MMM d, yyyy")}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold gradient-text">{days}</div>
                      <div className="text-[10px] text-muted-foreground">days</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="card-glass p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon} {label}</div>
      <div className="mt-2 text-2xl font-display font-bold">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}
