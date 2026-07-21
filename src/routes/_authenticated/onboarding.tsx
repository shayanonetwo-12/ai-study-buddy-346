import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { completeOnboarding } from "@/lib/user.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

const LEVELS = ["School", "High School", "University", "Competitive Exam"];
const TIMES = ["Morning", "Afternoon", "Evening", "Night"];

function Onboarding() {
  const router = useRouter();
  const submit = useServerFn(completeOnboarding);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    education_level: "High School",
    class_year: "Class 10",
    daily_hours: 2,
    preferred_time: "Evening",
    language: "English",
  });
  const [loading, setLoading] = useState(false);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const finish = async () => {
    setLoading(true);
    try {
      await submit({ data: form });
      toast.success("You're all set!");
      router.navigate({ to: "/dashboard" });
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg card-glass p-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="size-5 text-primary" />
          <span className="text-xs font-medium text-primary">Step {step + 1}/4</span>
        </div>
        <h1 className="text-2xl font-display font-bold mt-2">
          {step === 0 && "Welcome to StudyAI 🎓"}
          {step === 1 && "Your education"}
          {step === 2 && "Study preferences"}
          {step === 3 && "Almost done!"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 mb-6">
          {step === 0 && "Let's build your perfect study plan."}
          {step === 1 && "Tell us about your class."}
          {step === 2 && "When and how long do you study?"}
          {step === 3 && "Confirm and get started."}
        </p>

        <div className="space-y-4">
          {step === 0 && (
            <input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm"
            />
          )}
          {step === 1 && (
            <>
              <div>
                <label className="text-xs text-muted-foreground">Education level</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setForm({ ...form, education_level: l })}
                      className={`rounded-lg border px-3 py-2 text-sm ${
                        form.education_level === l
                          ? "border-primary bg-primary/15 text-foreground"
                          : "border-border bg-surface"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <input
                placeholder="Class / Year (e.g. Class 10, Year 2)"
                value={form.class_year}
                onChange={(e) => setForm({ ...form, class_year: e.target.value })}
                className="w-full rounded-lg bg-surface border border-border px-3 py-2.5 text-sm"
              />
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="text-xs text-muted-foreground">
                  Daily study hours: <span className="text-foreground font-semibold">{form.daily_hours}h</span>
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={8}
                  step={0.5}
                  value={form.daily_hours}
                  onChange={(e) => setForm({ ...form, daily_hours: parseFloat(e.target.value) })}
                  className="w-full mt-2 accent-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Preferred study time</label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm({ ...form, preferred_time: t })}
                      className={`rounded-lg border px-2 py-2 text-xs ${
                        form.preferred_time === t
                          ? "border-primary bg-primary/15"
                          : "border-border bg-surface"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span>{form.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Level</span><span>{form.education_level}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Class</span><span>{form.class_year}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Daily</span><span>{form.daily_hours}h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span>{form.preferred_time}</span></div>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-2">
          {step > 0 && (
            <button
              onClick={prev}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={next}
              className="ml-auto rounded-lg gradient-bg px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={loading}
              className="ml-auto rounded-lg gradient-bg px-5 py-2 text-sm font-semibold text-primary-foreground glow-primary disabled:opacity-50"
            >
              {loading ? "Saving..." : "Let's go!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
