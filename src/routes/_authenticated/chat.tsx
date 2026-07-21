import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { sendChatMessage, clearChat } from "@/lib/chat.functions";
import { Send, Sparkles, Loader2, Trash2 } from "lucide-react";
import Markdown from "@/components/markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/chat")({
  ssr: false,
  component: Chat,
});

const SUGGESTIONS = [
  "Explain photosynthesis simply",
  "What is Newton's second law?",
  "Give me a study tip for math",
  "Summarize the French Revolution",
];

function Chat() {
  const qc = useQueryClient();
  const send = useServerFn(sendChatMessage);
  const clr = useServerFn(clearChat);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["chat"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", u.user!.id)
        .order("created_at");
      return data ?? [];
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const submit = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);
    // optimistic
    qc.setQueryData(["chat"], (old: any[] = []) => [
      ...old,
      { id: `tmp-${Date.now()}`, role: "user", content: text, created_at: new Date().toISOString() },
    ]);
    try {
      await send({ data: { message: text } });
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    await clr({});
    qc.invalidateQueries({ queryKey: ["chat"] });
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-screen p-4 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Sparkles className="size-4" /> StudyAI Assistant
            </div>
            <h1 className="text-2xl font-display font-bold">Ask anything</h1>
          </div>
          {messages.length > 0 && (
            <button onClick={clear} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
              <Trash2 className="size-3.5" /> Clear
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="size-14 mx-auto rounded-2xl gradient-bg flex items-center justify-center glow-primary">
                <Sparkles className="size-7 text-primary-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Try asking:</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="text-xs rounded-full border border-border bg-surface px-3 py-1.5 hover:bg-surface-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "gradient-bg text-primary-foreground"
                    : "card-glass"
                }`}
              >
                {m.role === "assistant" ? <Markdown>{m.content}</Markdown> : <p>{m.content}</p>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="card-glass px-4 py-3 text-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="mt-4 flex items-end gap-2 card-glass p-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            rows={1}
            placeholder="Ask StudyAI anything..."
            className="flex-1 bg-transparent px-3 py-2 text-sm resize-none outline-none max-h-32"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="size-10 rounded-xl gradient-bg text-primary-foreground flex items-center justify-center disabled:opacity-40 glow-primary"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
