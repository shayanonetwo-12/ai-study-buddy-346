import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/app-shell";
import { logFocusSession } from "@/lib/user.functions";
import { Timer, Play, Pause, RotateCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/focus")({
  ssr: false,
  component: Focus,
});

const STUDY = 25 * 60;
const BREAK = 5 * 60;

function Focus() {
  const log = useServerFn(logFocusSession);
  const [mode, setMode] = useState<"study" | "break">("study");
  const [remaining, setRemaining] = useState(STUDY);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (mode === "study") {
            log({ data: { minutes: 25 } }).catch(() => {});
            setCompleted((c) => c + 1);
            setMode("break");
            toast.success("Study session done! +5 XP");
            return BREAK;
          } else {
            setMode("study");
            toast.info("Break over — ready to focus?");
            return STUDY;
          }
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode, log]);

  const reset = () => {
    setRunning(false);
    setRemaining(mode === "study" ? STUDY : BREAK);
    startRef.current = null;
  };

  const min = Math.floor(remaining / 60);
  const sec = remaining % 60;
  const total = mode === "study" ? STUDY : BREAK;
  const pct = ((total - remaining) / total) * 100;

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-6 md:p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-primary mb-1">
          <Timer className="size-4" /> Pomodoro
        </div>
        <h1 className="text-3xl font-display font-bold">Focus timer</h1>

        <div className="mt-6 inline-flex rounded-full border border-border bg-surface p-1">
          {(["study", "break"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setRemaining(m === "study" ? STUDY : BREAK);
                setRunning(false);
              }}
              className={`px-4 py-1.5 rounded-full text-sm capitalize ${
                mode === m ? "gradient-bg text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {m === "study" ? "Study (25m)" : "Break (5m)"}
            </button>
          ))}
        </div>

        <div className="mt-10 relative size-72 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="4" className="stroke-surface-2" />
            <circle
              cx="50" cy="50" r="45" fill="none" strokeWidth="4"
              stroke="url(#g)"
              strokeDasharray={`${pct * 2.827}, 999`}
              strokeLinecap="round"
              className="transition-all"
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.58 0.22 262)" />
                <stop offset="100%" stopColor="oklch(0.55 0.26 300)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-6xl font-display font-bold tabular-nums">
              {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
            </div>
            <div className="text-xs text-muted-foreground mt-2 capitalize">{mode}</div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full size-12 border border-border bg-surface flex items-center justify-center"
          >
            <RotateCw className="size-4" />
          </button>
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-full size-16 gradient-bg glow-primary flex items-center justify-center"
          >
            {running ? <Pause className="size-6 text-primary-foreground" /> : <Play className="size-6 text-primary-foreground ml-1" />}
          </button>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Sessions completed today: <span className="font-semibold text-foreground">{completed}</span>
        </div>
      </div>
    </AppShell>
  );
}
