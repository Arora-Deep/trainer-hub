import { useGamificationStore, difficultyStyle, skillColor } from "@/stores/gamificationStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Clock, Trophy, ArrowRight, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WeeklyChallengeFeature() {
  const challenges = useGamificationStore((s) => s.challenges);
  const navigate = useNavigate();

  // Pick the highest-XP available or in-progress challenge as the weekly feature
  const featured = [...challenges]
    .filter((c) => c.status !== "completed")
    .sort((a, b) => b.xp - a.xp)[0];

  if (!featured) return null;
  const color = skillColor[featured.category];

  return (
    <Card className="sp-card relative overflow-hidden border-0 p-0">
      {/* Cinematic background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(800px 300px at 0% 0%, ${color}30, transparent 60%),
            radial-gradient(600px 300px at 100% 100%, hsl(var(--xp) / 0.25), transparent 65%),
            linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)) 70%, ${color}15 100%)
          `,
        }}
      />
      <span
        aria-hidden
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: color }}
      />
      <span className="sp-hero-sheen" aria-hidden />

      <div className="relative z-10 p-6 md:p-7">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold">
          <Flame className="h-3.5 w-3.5 text-warning animate-flame-pulse" />
          <span className="sp-gradient-text">This week's challenge</span>
          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">Resets Sunday</span>
        </div>

        <h2 className="mt-3 text-xl md:text-2xl font-bold tracking-tight leading-snug">
          {featured.title}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">{featured.brief}</p>

        {/* Reward & meta strip */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          <RewardStat
            icon={<Zap className="h-3.5 w-3.5" />}
            label="Reward"
            value={`+${featured.xp.toLocaleString()} XP`}
            highlight
          />
          <RewardStat
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Difficulty"
            value={featured.difficulty}
            className={difficultyStyle[featured.difficulty]}
          />
          <RewardStat
            icon={<Clock className="h-3.5 w-3.5" />}
            label="Time"
            value={featured.duration}
          />
          <RewardStat
            icon={<Users className="h-3.5 w-3.5" />}
            label="Engineers in"
            value={featured.participants.toLocaleString()}
          />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground">
            Top finishers earn <span className="text-foreground font-semibold">leaderboard points</span> and the <span className="text-foreground font-semibold">"Cluster Forge"</span> badge.
          </div>
          <Button
            onClick={() => navigate("/student/challenges")}
            className="gap-1.5 shadow-lg shrink-0"
          >
            Accept challenge <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function RewardStat({
  icon, label, value, highlight, className,
}: { icon: React.ReactNode; label: string; value: string; highlight?: boolean; className?: string }) {
  return (
    <div
      className={`rounded-lg border bg-card/60 backdrop-blur px-3 py-2.5 ${
        highlight
          ? "border-[hsl(var(--xp)/0.35)] bg-[hsl(var(--xp)/0.08)]"
          : "border-border/70"
      }`}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={`mt-1 text-sm font-bold tabular-nums ${
          highlight ? "text-[hsl(var(--xp))]" : ""
        } ${className ?? ""}`}
      >
        {value}
      </div>
    </div>
  );
}
