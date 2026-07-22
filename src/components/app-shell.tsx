import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquareText,
  Brain,
  BarChart3,
  StickyNote,
  Layers,
  Timer,
  Settings,
  Sparkles,
  Flame,
  Trophy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "AI Planner", icon: CalendarDays },
  { to: "/chat", label: "AI Chat", icon: MessageSquareText },
  { to: "/quiz", label: "Quiz", icon: Brain },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const qc = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return null;
      const { data: p } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      return p;
    },
  });

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
  };

  const level = Math.floor((profile?.xp ?? 0) / 100) + 1;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-surface/50 backdrop-blur px-4 py-6 sticky top-0 h-screen">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-6">
          <div className="size-9 rounded-xl gradient-bg flex items-center justify-center glow-primary">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-semibold text-lg leading-none">StudyAI</div>
            <div className="text-[10px] text-muted-foreground">AI Study Coach</div>
          </div>
        </Link>

        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((n) => {
            const active = path === n.to || path.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/15 text-foreground border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2",
                )}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 card-glass p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Trophy className="size-3.5 text-accent" /> Level {level}
          </div>
          <div className="mt-1 text-lg font-bold gradient-text">{profile?.xp ?? 0} XP</div>
          <div className="flex items-center gap-1 text-xs mt-1">
            <Flame className="size-3.5 text-warning" />
            <span className="font-semibold">{profile?.streak_days ?? 0}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-3 w-full text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface/95 backdrop-blur border-t border-border z-40 flex overflow-x-auto">
        {NAV.slice(0, 5).map((n) => {
          const active = path === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-[10px]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <n.icon className="size-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
