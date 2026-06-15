import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import { Flame, Play, ArrowRight, Sparkles, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HeroDashboard() {
  const { profile, streak, learningPaths, challenges } = useGamificationStore();
  const navigate = useNavigate();

  const activePath = learningPaths.find((p) => p.modules.some((m) => m.status === "in_progress")) ?? learningPaths[0];
  const ap = pathProgress(activePath);
  const activeChallenge = challenges.find((c) => c.status === "in_progress");

  return (
    <section className="sp-hero p-7 md:p-9 relative">
      <div className="pointer-events-none absolute -top-20 -right-12 h-64 w-64 rounded-full bg-white/15 blur-3xl animate-float-soft" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-fuchsia-400/30 blur-3xl" />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85">
            <Sparkles className="h-3 w-3" />
            {greeting()}, {profile.name.split(" ")[0]}
          </p>

          <h1 className="mt-3 text-[28px] md:text-[40px] font-bold tracking-tight leading-[1.05] text-white drop-shadow-sm">
            {activePath ? (
              <>
                You're <span className="text-white/95">{ap.pct}%</span> through {activePath.name}.{" "}
                <span className="text-white/90">Keep the streak alive.</span>
              </>
            ) : (
              <>Start a learning path and keep the streak alive.</>
            )}
          </h1>
          <p className="mt-2 text-sm text-white/80 max-w-xl">
            {profile.batchName} · @{profile.handle}
          </p>

          {/* Path progress bar */}
          {activePath && (
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between mb-2 text-[11px] text-white/90">
                <span className="font-medium tracking-wide inline-flex items-center gap-1.5">
                  <Route className="h-3.5 w-3.5" /> {activePath.name}
                </span>
                <span className="tabular-nums">
                  {ap.done} / {ap.total} modules
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-black/25 overflow-hidden ring-1 ring-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-300 via-white to-cyan-200 sp-sheen"
                  style={{ width: `${ap.pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Streak chip */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Chip icon={<Flame className="h-3.5 w-3.5" />} label={`${streak.current}-day streak · best ${streak.longest}`} />
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/student/courses")}
              className="sp-pill inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              <Play className="h-4 w-4 fill-current" /> Continue learning
            </button>
            <button
              onClick={() => navigate("/student/progress")}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              View progress <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Big streak emblem */}
        <div className="relative hidden md:flex h-44 w-44 shrink-0 items-center justify-center">
          <svg viewBox="0 0 120 120" className="h-44 w-44 -rotate-90">
            <defs>
              <linearGradient id="hero-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef9c3" />
                <stop offset="50%" stopColor="#f0abfc" />
                <stop offset="100%" stopColor="#67e8f9" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="url(#hero-ring)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${Math.min(1, streak.current / Math.max(streak.longest, 30)) * 2 * Math.PI * 50} ${2 * Math.PI * 50}`}
              style={{ transition: "stroke-dasharray .8s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Flame className="h-5 w-5 text-amber-200 drop-shadow" />
            <span className="text-5xl font-bold tabular-nums leading-none mt-1 text-white drop-shadow">
              {streak.current}
            </span>
            <span className="text-[10px] mt-1 text-white/80 tabular-nums">day streak</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur px-2.5 py-1 text-[11px] font-medium text-white tabular-nums">
      {icon} {label}
    </span>
  );
}
