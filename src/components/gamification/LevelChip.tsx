import { useGamificationStore } from "@/stores/gamificationStore";
import { Flame, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

export function LevelChip() {
  const { profile, streak, momentum } = useGamificationStore();
  const navigate = useNavigate();
  const pct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 h-8 pl-1.5 pr-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
          aria-label="Open progression summary"
        >
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-[11px] font-bold tabular-nums">
            {profile.level}
          </span>
          <span className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Lvl {profile.level}</span>
            <span className="text-[11px] font-semibold">{profile.identity}</span>
          </span>
          <span className="mx-0.5 hidden md:block h-4 w-px bg-border" />
          <span className="flex items-center gap-1 text-[11px] font-semibold text-warning">
            <Flame className="h-3.5 w-3.5" /> {streak.current}
          </span>
          <span className="hidden md:flex items-center gap-1 text-[11px] font-semibold text-primary">
            <Zap className="h-3.5 w-3.5" /> {momentum.multiplier}×
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Level {profile.level} · {profile.identity}</span>
            <span className="text-[10px] text-muted-foreground">Top {100 - profile.percentile}%</span>
          </div>
          <div className="mt-2 space-y-1">
            <Progress value={pct} className="h-1.5" />
            <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
              <span>{profile.totalXp.toLocaleString()} XP</span>
              <span>{profile.nextLevelXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <Stat label="Streak" value={`${streak.current} days`} icon={<Flame className="h-3 w-3 text-warning" />} />
          <Stat label="Momentum" value={`${momentum.multiplier}× boost`} icon={<Zap className="h-3 w-3 text-primary" />} />
          <Stat label="Lab hours" value={`${useGamificationStore.getState().profile.totalLabHours}h`} />
          <Stat label="Tracks" value={`${profile.completedTracks} complete`} />
        </div>
        <button
          onClick={() => navigate("/student/progress")}
          className="w-full text-[11px] font-medium text-primary hover:underline text-center pt-1"
        >
          View full progression →
        </button>
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
      <div className="mt-0.5 text-xs font-semibold">{value}</div>
    </div>
  );
}
