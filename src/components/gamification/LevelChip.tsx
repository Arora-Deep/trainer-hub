import { useGamificationStore, tierColor, tierLabel } from "@/stores/gamificationStore";
import { Flame, Zap, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { TierBadge } from "@/components/gamification/TierBadge";

export function LevelChip() {
  const { profile, streak, momentum, season } = useGamificationStore();
  const navigate = useNavigate();
  const pct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));
  const ringColor = tierColor[profile.tier];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
          aria-label="Open progression summary"
        >
          <span
            className="relative flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-bold tabular-nums text-white"
            style={{ background: ringColor, boxShadow: `0 0 0 2px hsl(var(--card)), 0 0 0 3px ${ringColor}` }}
          >
            {profile.level}
          </span>
          <span className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{tierLabel[profile.tier]} · Lvl {profile.level}</span>
            <span className="text-[11px] font-semibold truncate max-w-[120px]">{profile.activeTitle}</span>
          </span>
          <span className="mx-0.5 hidden md:block h-4 w-px bg-border" />
          <span className="flex items-center gap-1 text-[11px] font-semibold text-warning">
            <Flame className="h-3.5 w-3.5 animate-flame-pulse" /> {streak.current}
          </span>
          <span className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> {momentum.multiplier}×
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{profile.name}</p>
            <p className="text-[11px] text-muted-foreground">{profile.activeTitle} · {profile.identity}</p>
          </div>
          <TierBadge tier={profile.tier} shimmer size="sm" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums mb-1">
            <span>Lvl {profile.level} → {profile.level + 1}</span>
            <span>{profile.totalXp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP</span>
          </div>
          <Progress value={pct} className="h-1.5" />
        </div>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <Stat label="Streak" value={`${streak.current}d`} icon={<Flame className="h-3 w-3 text-warning" />} />
          <Stat label="Momentum" value={`${momentum.multiplier}×`} icon={<Zap className="h-3 w-3 text-primary" />} />
          <Stat label="Season" value={`#${season.rank}`} icon={<Trophy className="h-3 w-3" />} />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={() => navigate("/student/profile")} className="text-[11px] font-medium text-primary hover:underline text-left">
            View profile →
          </button>
          <button onClick={() => navigate("/student/progress")} className="text-[11px] font-medium text-primary hover:underline text-right">
            All progression →
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-2">
      <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-0.5 text-xs font-semibold tabular-nums">{value}</div>
    </div>
  );
}
