import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGamificationStore } from "@/stores/gamificationStore";
import { Target, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DailyMissionsCard() {
  const { dailyMissions } = useGamificationStore();
  const navigate = useNavigate();
  const totalXp = dailyMissions.reduce((s, m) => s + m.xp, 0);
  const earned = dailyMissions
    .filter((m) => m.progress >= m.target)
    .reduce((s, m) => s + m.xp, 0);

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Today's missions</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
              {earned} / {totalXp} XP earned · resets in 14h
            </p>
          </div>
          <button
            onClick={() => navigate("/student/challenges")}
            className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-0.5"
          >
            All challenges <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-3">
          {dailyMissions.map((m) => {
            const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
            const done = m.progress >= m.target;
            return (
              <div key={m.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${done ? "text-muted-foreground line-through" : ""}`}>{m.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{m.detail}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold text-primary tabular-nums">+{m.xp} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={pct} className="h-1 flex-1" />
                  <span className="text-[10px] text-muted-foreground tabular-nums w-12 text-right">
                    {m.progress}/{m.target}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
