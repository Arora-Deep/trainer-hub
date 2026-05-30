import { useGamificationStore, tierLabel } from "@/stores/gamificationStore";
import { Flame, Zap, Trophy, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HeroDashboard() {
  const { profile, streak, momentum, season } = useGamificationStore();
  const navigate = useNavigate();
  const pct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));
  const circumference = 2 * Math.PI * 44;
  const dash = (pct / 100) * circumference;

  return (
    <section className="sp-hero p-8 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-8">
        {/* Quiet level ring — monochrome */}
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--muted))" strokeWidth="4" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke="hsl(var(--foreground))" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ transition: "stroke-dasharray .6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Level</span>
            <span className="text-3xl font-semibold tabular-nums leading-none mt-0.5">{profile.level}</span>
          </div>
        </div>

        {/* Identity + XP */}
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {greeting()}, {profile.name.split(" ")[0]}
          </p>
          <h1 className="mt-2 text-[28px] md:text-[34px] font-semibold tracking-tight leading-[1.1]">
            {profile.activeTitle}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tierLabel[profile.tier]} · {profile.identity} · @{profile.handle}
          </p>

          {/* Slim XP bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-foreground transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
              {profile.totalXp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
            </span>
          </div>

          {/* Stat row — flat chips */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <Stat icon={<Flame className="h-3.5 w-3.5" />} label={`${streak.current}-day streak`} />
            <Stat icon={<Zap className="h-3.5 w-3.5" />} label={`${momentum.multiplier}× momentum`} />
            <Stat icon={<Trophy className="h-3.5 w-3.5" />} label={`Season #${season.rank}`} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 lg:items-end">
          <Button onClick={() => navigate("/student/labs")} className="gap-1.5">
            <Play className="h-4 w-4" /> Resume lab
          </Button>
          <Button variant="ghost" onClick={() => navigate("/student/quests")} className="gap-1.5 text-muted-foreground">
            Continue quest <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-foreground/80">
      <span className="text-muted-foreground">{icon}</span>
      <span className="tabular-nums">{label}</span>
    </span>
  );
}
