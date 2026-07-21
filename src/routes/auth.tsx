import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Account created!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Sign in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    router.navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-glass p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="size-10 rounded-xl gradient-bg flex items-center justify-center glow-primary">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-semibold text-xl leading-none">StudyAI</div>
            <div className="text-xs text-muted-foreground mt-1">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </div>
          </div>
        </div>

        <button
          onClick={google}
          disabled={loading}
          className="w-full rounded-lg border border-border bg-surface hover:bg-surface-2 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition"
        >
          <svg className="size-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3-3C17.2 1.9 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.5 2.7C6 7.4 8.8 5 12 5z"/>
            <path fill="#4285F4" d="M23 12c0-.9-.1-1.6-.3-2.4H12v4.6h6.3c-.3 1.4-1.1 2.6-2.3 3.4l3.5 2.7c2.1-1.9 3.5-4.8 3.5-8.3z"/>
            <path fill="#FBBC05" d="M5.1 14.3c-.3-.8-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7C.6 8.5 0 10.2 0 12s.6 3.5 1.6 5l3.5-2.7z"/>
            <path fill="#34A853" d="M12 23c3.2 0 5.9-1.1 7.9-2.9l-3.5-2.7c-1 .7-2.3 1.1-4.4 1.1-3.2 0-5.9-2.4-6.9-5.4L1.6 15.6C3.5 19.4 7.4 23 12 23z"/>
          </svg>
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg gradient-bg py-2.5 text-sm font-semibold text-primary-foreground glow-primary hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
