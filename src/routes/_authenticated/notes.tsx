import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { summarizeNote } from "@/lib/notes.functions";
import { StickyNote, Sparkles, Loader2, Plus } from "lucide-react";
import Markdown from "@/components/markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notes")({
  ssr: false,
  component: Notes,
});

function Notes() {
  const qc = useQueryClient();
  const summarize = useServerFn(summarizeNote);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", u.user!.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const save = async () => {
    if (!title.trim() || !content.trim()) return toast.error("Title and content required");
    setLoading(true);
    try {
      await summarize({ data: { title, content } });
      toast.success("Note summarized + flashcards created!");
      setTitle("");
      setContent("");
      qc.invalidateQueries({ queryKey: ["notes"] });
      qc.invalidateQueries({ queryKey: ["flashcards"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const activeNote = notes.find((n) => n.id === active);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
          <StickyNote className="size-4" /> Notes
        </div>
        <h1 className="text-3xl font-display font-bold">Your notes + AI summaries</h1>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <div className="card-glass p-5 lg:col-span-1">
            <h2 className="font-semibold flex items-center gap-2"><Plus className="size-4" /> New note</h2>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Paste your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="mt-2 w-full rounded-lg bg-surface border border-border px-3 py-2 text-sm resize-none"
            />
            <button
              onClick={save}
              disabled={loading}
              className="mt-3 w-full rounded-lg gradient-bg py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Summarize + make flashcards
            </button>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {notes.length === 0 && (
              <div className="card-glass p-6 text-sm text-muted-foreground text-center">
                No notes yet. Paste your first note to see AI-powered summaries.
              </div>
            )}
            {notes.map((n) => (
              <div key={n.id} className="card-glass p-5">
                <button
                  onClick={() => setActive(active === n.id ? null : n.id)}
                  className="w-full text-left"
                >
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at!).toLocaleDateString()}
                  </div>
                </button>
                {active === n.id && (
                  <div className="mt-3 border-t border-border pt-3">
                    {n.summary && (
                      <div>
                        <div className="text-xs font-medium text-primary mb-1">Summary</div>
                        <div className="text-sm"><Markdown>{n.summary}</Markdown></div>
                      </div>
                    )}
                    {Array.isArray(n.key_points) && n.key_points.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-primary mb-1">Key points</div>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          {(n.key_points as string[]).map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
