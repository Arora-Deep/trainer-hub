import { useGamificationStore, tierColor, tierLabel } from "@/stores/gamificationStore";
import { Flame, Zap, Trophy, Sparkles, Play, ArrowRight } from "lucide-react";
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
  const ringColor = tierColor[profile.tier];
  const pct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));
  const circumference = 2 * Math.PI * 44;
  const dash = (pct / 100) * circumference;

  return (
    <section className="sp-hero p-6 md:p-8">
      <span className="sp-hero-glow" aria-hidden />
      <span className="sp-hero-sheen" aria-hidden />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] items-center gap-6 lg:gap-8">
        {/* Level ring */}
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="44" fill="none"
              stroke={ringColor} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              style={{ filter: `drop-shadow(0 0 6px ${ringColor})`, transition: "stroke-dasharray .6s ease" }}
            />
          </svg>
          <div
            className="absolute inset-2 rounded-full flex flex-col items-center justify-center text-white"
            style={{
              background: `linear-gradient(135deg, ${ringColor}, hsl(var(--xp)))`,
              boxShadow: `0 10px 30px -10px ${ringColor}`,
            }}
          >
            <span className="text-[9px] uppercase tracking-widest opacity-80">Lvl</span>
            <span className="text-3xl font-bold tabular-nums leading-none">{profile.level}</span>
          </div>
        </div>

        {/* Identity + XP */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>{greeting()}, {profile.name.split(" ")[0]} · {tierLabel[profile.tier]}</span>
          </div>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
            <span className="sp-gradient-text">{profile.activeTitle}</span>
          </h1>
          <p className="text-sm text-muted-foreground truncate">
            {profile.identity} · @{profile.handle}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden relative">
              <div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${ringColor}, hsl(var(--xp)))`,
                  boxShadow: `0 0 12px ${ringColor}`,
                }}
              >
                <span className="absolute inset-0 tier-shimmer" />
              </div>
            </div>
            <span className="text-[11px] font-semibold tabular-nums text-muted-foreground shrink-0">
              {profile.totalXp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
            </span>
          </div>

          {/* Stat pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Pill icon={<Flame className="h-3.5 w-3.5 animate-flame-pulse" />} tone="warning" label={`${streak.current}-day streak`} />
            <Pill icon={<Zap className="h-3.5 w-3.5" />} tone="xp" label={`${momentum.multiplier}× momentum`} />
            <Pill icon={<Trophy className="h-3.5 w-3.5" />} tone="primary" label={`Season rank #${season.rank}`} />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2 lg:items-end">
          <Button onClick={() => navigate("/student/labs")} className="gap-1.5 shadow-lg">
            <Play className="h-4 w-4" /> Resume lab
          </Button>
          <Button variant="outline" onClick={() => navigate("/student/quests")} className="gap-1.5">
            Continue quest <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function Pill({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "warning" | "xp" | "primary" }) {
  const toneClass = {
    warning: "bg-warning/10 text-warning border-warning/20",
    xp: "bg-[hsl(var(--xp)/0.1)] text-[hsl(var(--xp))] border-[hsl(var(--xp)/0.25)]",
    primary: "bg-primary/10 text-primary border-primary/20",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
      {icon}{label}
    </span>
  );
}
