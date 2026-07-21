import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { aiJson } from "./ai.server";

export const summarizeNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as { title: string; content: string })
  .handler(async ({ data, context }) => {
    const result = await aiJson<{ summary: string; keyPoints: string[]; flashcards: { front: string; back: string }[] }>([
      { role: "system", content: "You output strict JSON only." },
      {
        role: "user",
        content: `Summarize the following study notes and produce key points and 5 flashcards. Content:\n\n${data.content.slice(0, 8000)}\n\nReturn: {"summary":"...","keyPoints":["..."],"flashcards":[{"front":"...","back":"..."}]}`,
      },
    ]);

    const { data: note, error } = await context.supabase
      .from("notes")
      .insert({
        user_id: context.userId,
        title: data.title,
        content: data.content,
        summary: result.summary,
        key_points: result.keyPoints,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Insert flashcards
    if (result.flashcards?.length) {
      await context.supabase.from("flashcards").insert(
        result.flashcards.map((f) => ({
          user_id: context.userId,
          subject: data.title,
          front: f.front,
          back: f.back,
        })),
      );
    }
    return { note, flashcards: result.flashcards };
  });

export const generateFlashcards = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => v as { subject: string; topic: string; count?: number })
  .handler(async ({ data, context }) => {
    const count = data.count ?? 10;
    const result = await aiJson<{ cards: { front: string; back: string }[] }>([
      { role: "system", content: "You output strict JSON only." },
      {
        role: "user",
        content: `Create ${count} educational flashcards for ${data.subject} - ${data.topic}. Return: {"cards":[{"front":"Question","back":"Answer"}]}`,
      },
    ]);

    if (result.cards?.length) {
      await context.supabase.from("flashcards").insert(
        result.cards.map((c) => ({
          user_id: context.userId,
          subject: data.subject,
          front: c.front,
          back: c.back,
        })),
      );
    }
    return { count: result.cards?.length ?? 0 };
  });
