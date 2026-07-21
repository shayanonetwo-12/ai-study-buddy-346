import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { aiJson } from "./ai.server";

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  topic?: string;
};

export const generateQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (v: unknown) =>
      v as { subject: string; topic: string; difficulty: "easy" | "medium" | "hard"; count?: number },
  )
  .handler(async ({ data }) => {
    const count = data.count ?? 8;
    const result = await aiJson<{ questions: QuizQuestion[] }>([
      { role: "system", content: "You output strict JSON only." },
      {
        role: "user",
        content: `Generate ${count} ${data.difficulty} multiple-choice questions on "${data.topic}" in ${data.subject}. Each question has 4 options, one correct index (0-3), a short explanation, and topic tag. Return: {"questions":[{"question":"...","options":["a","b","c","d"],"correct":0,"explanation":"...","topic":"..."}]}`,
      },
    ]);
    return result;
  });

export const submitQuiz = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (v: unknown) =>
      v as {
        subject: string;
        topic: string;
        difficulty: string;
        questions: QuizQuestion[];
        answers: number[];
      },
  )
  .handler(async ({ data, context }) => {
    let score = 0;
    const weak: string[] = [];
    data.questions.forEach((q, i) => {
      if (data.answers[i] === q.correct) score += 1;
      else if (q.topic) weak.push(q.topic);
    });

    await context.supabase.from("quiz_results").insert({
      user_id: context.userId,
      subject: data.subject,
      topic: data.topic,
      difficulty: data.difficulty,
      score,
      total: data.questions.length,
      weak_topics: [...new Set(weak)],
    });

    // Award XP
    await context.supabase.rpc; // no-op
    const { data: prof } = await context.supabase
      .from("profiles")
      .select("xp")
      .eq("id", context.userId)
      .single();
    await context.supabase
      .from("profiles")
      .update({ xp: (prof?.xp ?? 0) + 20 + score * 5 })
      .eq("id", context.userId);

    return { score, total: data.questions.length, weak: [...new Set(weak)] };
  });
