import { Card, CardContent } from "@/components/ui/card";
import { useGamificationStore } from "@/stores/gamificationStore";
import { Flame, Zap, TrendingUp } from "lucide-react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakMomentumCard() {
  const { streak, momentum, profile } = useGamificationStore();

  return (
    <Card>
      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <Flame className="h-3 w-3" /> Streak
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular-nums leading-none">{streak.current}</span>
              <span className="text-xs text-muted-foreground">days</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Longest: {streak.longest}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <Zap className="h-3 w-3" /> Momentum
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tabular-nums leading-none">{momentum.multiplier}×</span>
              <span className="text-xs text-success inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> {momentum.value}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">Decays in {momentum.decayInHours}h</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">
            <span>This week</span>
            <span>Lvl {profile.level}</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {streak.weeklyDays.map((active, i) => (
              <div
                key={i}
                className={`h-9 rounded-md border flex items-center justify-center text-[10px] font-medium ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                {DAYS[i]}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
