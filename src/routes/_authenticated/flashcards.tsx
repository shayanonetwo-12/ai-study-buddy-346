import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { generateFlashcards } from "@/lib/notes.functions";
import { Layers, Sparkles, Loader2, ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/flashcards")({
  ssr: false,
  component: Flashcards,
});

function Flashcards() {
  const qc = useQueryClient();
  const gen = useServerFn(generateFlashcards);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: cards = [] } = useQuery({
    queryKey: ["flashcards"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("flashcards")
        .select("*")
        .eq("user_id", u.user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const create = async () => {
    if (!subject.trim() || !topic.trim()) return toast.error("Fill both fields");
    setLoading(true);
    try {
      const r = await gen({ data: { subject, topic } });
      toast.success(`Created ${r.count} flashcards!`);
      setSubject("");
      setTopic("");
      qc.invalidateQueries({ queryKey: ["flashcards"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const current = cards[index];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
          <Layers className="size-4" /> Flashcards
        </div>
        <h1 className="text-3xl font-display font-bold">Memorize with AI flashcards</h1>

        <div className="mt-6 card-glass p-5 grid md:grid-cols-3 gap-3">
          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-lg bg-surface border border-border px-3 py-2 text-sm"
          />
          <input
            placeholder="Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="rounded-lg bg-surface border border-border px-3 py-2 text-sm"
          />
          <button
            onClick={create}
            disabled={loading}
            className="rounded-lg gradient-bg py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Generate 10 cards
          </button>
        </div>

        {cards.length > 0 && current && (
          <div className="mt-8">
            <div className="text-center text-xs text-muted-foreground mb-2">
              Card {index + 1} of {cards.length} · {current.subject}
            </div>
            <button
              onClick={() => setFlipped(!flipped)}
              className="w-full min-h-[280px] card-glass p-8 flex items-center justify-center text-center hover:border-primary/40 transition"
            >
              <div>
                <div className="text-xs text-muted-foreground mb-3">{flipped ? "Answer" : "Question"}</div>
                <div className="text-xl font-semibold">
                  {flipped ? current.back : current.front}
                </div>
                <div className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <RotateCw className="size-3" /> Tap to flip
                </div>
              </div>
            </button>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  setFlipped(false);
                  setIndex((i) => (i - 1 + cards.length) % cards.length);
                }}
                className="rounded-lg border border-border bg-surface px-4 py-2 text-sm inline-flex items-center gap-1"
              >
                <ArrowLeft className="size-4" /> Prev
              </button>
              <button
                onClick={() => {
                  setFlipped(false);
                  setIndex((i) => (i + 1) % cards.length);
                }}
                className="rounded-lg gradient-bg px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary inline-flex items-center gap-1"
              >
                Next <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        )}

        {cards.length === 0 && (
          <div className="card-glass p-10 mt-6 text-center text-sm text-muted-foreground">
            No flashcards yet — generate your first set above.
          </div>
        )}
      </div>
    </AppShell>
  );
}
