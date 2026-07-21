import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { generateStudyPlan, aiBreakdown } from "@/lib/planner.functions";
import { toast } from "sonner";
import { Sparkles, Plus, CalendarDays, Loader2, Wand2 } from "lucide-react";
import ReactMarkdown from "@/components/markdown";

export const Route = createFileRoute("/_authenticated/planner")({
  ssr: false,
  component: Planner,
});

function Planner() {
  const qc = useQueryClient();
  const genPlan = useServerFn(generateStudyPlan);
  const breakdown = useServerFn(aiBreakdown);

  const [name, setName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [topics, setTopics] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [breakdownText, setBreakdownText] = useState("");
  const [bLoading, setBLoading] = useState(false);

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("subjects").select("*").eq("user_id", u.user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const generate = async () => {
    if (!name.trim() || !topics.trim()) {
      toast.error("Enter subject and topics");
      return;
    }
    setLoading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      const { data: subj, error } = await supabase
        .from("subjects")
        .insert({
          user_id: u.user!.id,
          name,
          exam_date: examDate || null,
        })
        .select()
        .single();
      if (error) throw error;

      const res = await genPlan({
        data: {
          subjectId: subj.id,
          subjectName: name,
          topics,
          examDate: examDate || null,
          dailyHours,
        },
      });
      toast.success(`Created ${res.tasksCreated} tasks across ${res.days} days!`);
      setName("");
      setTopics("");
      setExamDate("");
      qc.invalidateQueries();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const runBreakdown = async () => {
    if (!goal.trim()) return;
    setBLoading(true);
    try {
      const { text } = await breakdown({ data: { goal } });
      setBreakdownText(text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-5 text-primary" />
          <span className="text-xs font-medium text-primary">AI Study Planner</span>
        </div>
        <h1 className="text-3xl font-display font-bold">Build your perfect study plan</h1>
        <p className="text-sm text-muted-foreground mt-1">AI creates a day-by-day schedule tailored to your exam.</p>

        <div className="mt-6 grid lg:grid-cols-2 gap-4">
          <div className="card-glass p-6">
            <h2 className="font-semibold flex items-center gap-2"><Plus className="size-4" /> New study plan</h2>
            <div className="mt-4 space-y-3">
              <input
                placeholder="Subject (e.g. Physics)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm"
              />
              <textarea
                placeholder="Topics to cover (e.g. Motion, Force, Energy, Newton's laws)"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Exam date</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full mt-1 rounded-lg bg-surface border border-border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Daily hours: {dailyHours}h</label>
                  <input
                    type="range"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-primary"
                  />
                </div>
              </div>
              <button
                onClick={generate}
                disabled={loading}
                className="w-full rounded-lg gradient-bg py-2.5 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loading ? "Generating..." : "Generate AI plan"}
              </button>
            </div>
          </div>

          <div className="card-glass p-6">
            <h2 className="font-semibold flex items-center gap-2"><Wand2 className="size-4" /> AI Task breakdown</h2>
            <p className="text-xs text-muted-foreground mt-1">Turn a big goal into small daily tasks.</p>
            <textarea
              placeholder='e.g. "I want to prepare Biology in 20 days"'
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="mt-3 w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm resize-none"
            />
            <button
              onClick={runBreakdown}
              disabled={bLoading}
              className="mt-2 w-full rounded-lg border border-primary/40 bg-primary/10 hover:bg-primary/20 py-2 text-sm font-medium disabled:opacity-50"
            >
              {bLoading ? "Thinking..." : "Break it down"}
            </button>
            {breakdownText && (
              <div className="mt-4 max-h-64 overflow-y-auto rounded-lg bg-surface-2 p-3 text-sm">
                <ReactMarkdown>{breakdownText}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Subjects list */}
        <div className="mt-8">
          <h2 className="font-semibold mb-3 flex items-center gap-2"><CalendarDays className="size-4" /> Your subjects</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {subjects.length === 0 && (
              <div className="text-sm text-muted-foreground">No subjects yet.</div>
            )}
            {subjects.map((s) => (
              <div key={s.id} className="card-glass p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {s.exam_date ? `Exam: ${new Date(s.exam_date).toLocaleDateString()}` : "No exam date"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
