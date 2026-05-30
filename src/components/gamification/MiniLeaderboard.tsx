import { useGamificationStore } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MiniLeaderboard() {
  const lb = useGamificationStore((s) => s.leaderboard.batch);
  const navigate = useNavigate();

  return (
    <Card className="sp-card">
      <CardContent className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Batch ranking
            </div>
            <h3 className="text-base font-semibold tracking-tight mt-1">This week</h3>
          </div>
          <button
            onClick={() => navigate("/student/leaderboard")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            Full board <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <ol className="divide-y divide-border/60">
          {lb.slice(0, 5).map((row) => {
            const Trend = row.delta > 0 ? TrendingUp : row.delta < 0 ? TrendingDown : Minus;
            const trendColor =
              row.delta > 0 ? "text-success" : row.delta < 0 ? "text-destructive" : "text-muted-foreground";
            return (
              <li
                key={row.handle}
                className={`flex items-center gap-3 py-2.5 ${row.you ? "" : ""}`}
              >
                <span className="w-5 text-right text-xs font-medium tabular-nums shrink-0 text-muted-foreground">
                  {row.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{row.name}</p>
                    {row.you && (
                      <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">You</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Lvl {row.level} · {row.identity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold tabular-nums">{row.xp.toLocaleString()}</div>
                  <div className={`text-[10px] inline-flex items-center gap-0.5 tabular-nums ${trendColor}`}>
                    <Trend className="h-3 w-3" />
                    {row.delta === 0 ? "—" : Math.abs(row.delta)}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
