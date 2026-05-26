import { Card, CardContent } from "@/components/ui/card";
import { useGamificationStore } from "@/stores/gamificationStore";
import { Flame, Zap, TrendingUp } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakMomentumCard() {
  const { streak, momentum, profile } = useGamificationStore();

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Flame className="h-3 w-3 text-warning" /> Streak
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular-nums">{streak.current}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Longest: {streak.longest} days</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" /> Momentum
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular-nums">{momentum.multiplier}×</span>
              <span className="text-xs text-success inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> {momentum.value}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">XP boost · decays in {momentum.decayInHours}h</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            <span>This week</span>
            <span>Lvl {profile.level} · {profile.identity}</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {streak.weeklyDays.map((active, i) => (
              <div
                key={i}
                className={`h-9 rounded-md border flex flex-col items-center justify-center text-[10px] font-medium ${
                  active
                    ? "border-warning/40 bg-warning/10 text-warning"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <span>{DAYS[i]}</span>
                {active && <Flame className="h-2.5 w-2.5 mt-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
