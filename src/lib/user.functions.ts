import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Award XP + update streak on task completion
export const completeTask = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as { taskId: string; completed: boolean })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("tasks")
      .update({ completed: data.completed })
      .eq("id", data.taskId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);

    if (data.completed) {
      const { data: prof } = await supabase
        .from("profiles")
        .select("xp, streak_days, last_active_date")
        .eq("id", userId)
        .single();
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      let streak = prof?.streak_days ?? 0;
      if (prof?.last_active_date !== today) {
        streak = prof?.last_active_date === yesterday ? streak + 1 : 1;
      }
      await supabase
        .from("profiles")
        .update({
          xp: (prof?.xp ?? 0) + 10,
          streak_days: streak,
          last_active_date: today,
        })
        .eq("id", userId);
    }
    return { ok: true };
  });

export const logFocusSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as { minutes: number })
  .handler(async ({ data, context }) => {
    await context.supabase.from("focus_sessions").insert({
      user_id: context.userId,
      minutes: data.minutes,
    });
    const { data: prof } = await context.supabase
      .from("profiles")
      .select("xp")
      .eq("id", context.userId)
      .single();
    await context.supabase
      .from("profiles")
      .update({ xp: (prof?.xp ?? 0) + Math.floor(data.minutes / 5) })
      .eq("id", context.userId);
    return { ok: true };
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (v: unknown) =>
      v as {
        name: string;
        education_level: string;
        class_year: string;
        daily_hours: number;
        preferred_time: string;
        language: string;
      },
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ ...data, onboarded: true })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const resetStudyData = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const tables = [
      "tasks",
      "quiz_results",
      "chat_messages",
      "notes",
      "flashcards",
      "focus_sessions",
      "subjects",
    ] as const;
    await Promise.all(
      tables.map(async (t) => {
        const { error } = await supabase.from(t).delete().eq("user_id", userId);
        if (error) throw new Error(`${t}: ${error.message}`);
      }),
    );
    const { error: pErr } = await supabase
      .from("profiles")
      .update({
        xp: 0,
        streak_days: 0,
        last_active_date: null,
        onboarded: false,
      })
      .eq("id", userId);
    if (pErr) throw new Error(pErr.message);
    return { ok: true };
  });
