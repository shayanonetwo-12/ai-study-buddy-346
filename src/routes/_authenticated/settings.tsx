import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/app-shell";
import { resetStudyData } from "@/lib/user.functions";
import { Settings as SettingsIcon, LogOut, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  ssr: false,
  component: Settings,
});

function Settings() {
  const qc = useQueryClient();
  const router = useRouter();
  const reset = useServerFn(resetStudyData);
  const [resetting, setResetting] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const { data: p } = await supabase.from("profiles").select("*").eq("id", data.user!.id).single();
      return p;
    },
  });

  const [form, setForm] = useState({
    name: "",
    education_level: "",
    class_year: "",
    daily_hours: 2,
    preferred_time: "Evening",
    language: "English",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        education_level: profile.education_level ?? "",
        class_year: profile.class_year ?? "",
        daily_hours: Number(profile.daily_hours ?? 2),
        preferred_time: profile.preferred_time ?? "Evening",
        language: profile.language ?? "English",
      });
    }
  }, [profile]);

  const save = async () => {
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("profiles").update(form).eq("id", u.user!.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/", replace: true });
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-1">
          <SettingsIcon className="size-4" /> Settings
        </div>
        <h1 className="text-3xl font-display font-bold">Profile</h1>

        <div className="mt-6 card-glass p-6 space-y-3">
          <Field label="Name">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
          </Field>
          <Field label="Education level">
            <input value={form.education_level} onChange={(e) => setForm({ ...form, education_level: e.target.value })} className="input" />
          </Field>
          <Field label="Class / Year">
            <input value={form.class_year} onChange={(e) => setForm({ ...form, class_year: e.target.value })} className="input" />
          </Field>
          <Field label={`Daily hours: ${form.daily_hours}h`}>
            <input type="range" min={0.5} max={8} step={0.5} value={form.daily_hours} onChange={(e) => setForm({ ...form, daily_hours: parseFloat(e.target.value) })} className="w-full accent-primary" />
          </Field>
          <Field label="Preferred time">
            <select value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })} className="input">
              {["Morning", "Afternoon", "Evening", "Night"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <button onClick={save} className="w-full rounded-lg gradient-bg py-2 text-sm font-semibold text-primary-foreground glow-primary">Save</button>
        </div>

        <div className="mt-6 card-glass p-6">
          <div className="text-sm text-muted-foreground">Total XP</div>
          <div className="text-3xl font-display font-bold gradient-text">{profile?.xp ?? 0}</div>
          <div className="text-xs text-muted-foreground mt-1">🔥 {profile?.streak_days ?? 0} day streak</div>
        </div>

        <button onClick={signOut} className="mt-6 w-full rounded-lg border border-destructive/40 bg-destructive/10 hover:bg-destructive/20 py-2 text-sm text-destructive inline-flex items-center justify-center gap-2">
          <LogOut className="size-4" /> Sign out
        </button>
      </div>
      <style>{`.input{width:100%;background:var(--color-surface);border:1px solid var(--color-border);border-radius:.5rem;padding:.5rem .75rem;font-size:.875rem}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
