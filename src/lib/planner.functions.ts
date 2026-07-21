import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { aiJson, aiChat } from "./ai.server";

type PlanInput = {
  subjectId: string;
  subjectName: string;
  topics: string;
  examDate?: string | null;
  dailyHours: number;
};

type PlanDay = {
  day: number;
  date: string;
  focus: string;
  tasks: string[];
};

export const generateStudyPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as PlanInput)
  .handler(async ({ data, context }) => {
    const { subjectId, subjectName, topics, examDate, dailyHours } = data;
    const today = new Date();
    const exam = examDate ? new Date(examDate) : new Date(today.getTime() + 14 * 86400000);
    const days = Math.max(3, Math.min(60, Math.ceil((exam.getTime() - today.getTime()) / 86400000)));

    const prompt = `You are a study planner AI. Create a ${days}-day study plan for the subject "${subjectName}" covering topics: ${topics}. Student has ~${dailyHours} hours/day. Include revision days and quiz/practice days. Return JSON: {"plan":[{"day":1,"date":"YYYY-MM-DD","focus":"...","tasks":["task 1","task 2","task 3"]}]}. Start date: ${today.toISOString().slice(0, 10)}. Cover exactly ${days} days.`;

    const result = await aiJson<{ plan: PlanDay[] }>([
      { role: "system", content: "You output strict JSON only." },
      { role: "user", content: prompt },
    ]);

    // Insert tasks
    const rows = result.plan.flatMap((d) =>
      d.tasks.map((t) => ({
        user_id: context.userId,
        subject_id: subjectId,
        title: t,
        description: d.focus,
        task_date: d.date,
        source: "ai_plan",
        minutes: Math.round((dailyHours * 60) / Math.max(1, d.tasks.length)),
      })),
    );

    if (rows.length) {
      const { error } = await context.supabase.from("tasks").insert(rows);
      if (error) throw new Error(error.message);
    }
    return { days: result.plan.length, tasksCreated: rows.length };
  });

export const aiBreakdown = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as { goal: string })
  .handler(async ({ data }) => {
    const text = await aiChat([
      {
        role: "system",
        content:
          "You break big study goals into small actionable daily tasks. Reply as a friendly markdown list with headers like 'Week 1', 'Week 2', bullet tasks under each day.",
      },
      { role: "user", content: `Break down this goal: ${data.goal}` },
    ]);
    return { text };
  });
