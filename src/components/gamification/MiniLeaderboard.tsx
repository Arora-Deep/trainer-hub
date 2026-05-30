import { useGamificationStore } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MiniLeaderboard() {
  const lb = useGamificationStore((s) => s.leaderboard.batch);
  const navigate = useNavigate();

  return (
    <Card className="sp-card">
      <CardContent className="p-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1.5">
              <Trophy className="h-3 w-3 text-warning" />
              Batch ranking
            </div>
            <h3 className="text-base font-semibold tracking-tight mt-0.5">This week's standings</h3>
          </div>
          <button
            onClick={() => navigate("/student/leaderboard")}
            className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            Full board <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <ol className="space-y-1">
          {lb.slice(0, 5).map((row) => {
            const Trend = row.delta > 0 ? TrendingUp : row.delta < 0 ? TrendingDown : Minus;
            const trendColor =
              row.delta > 0 ? "text-success" : row.delta < 0 ? "text-destructive" : "text-muted-foreground";
            return (
              <li
                key={row.handle}
                className={`flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
                  row.you
                    ? "bg-[hsl(var(--xp)/0.08)] border border-[hsl(var(--xp)/0.25)]"
                    : "hover:bg-muted/40"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold tabular-nums shrink-0 ${
                    row.rank === 1
                      ? "bg-[hsl(var(--tier-gold)/0.15)] text-[hsl(var(--tier-gold))] border border-[hsl(var(--tier-gold)/0.3)]"
                      : row.rank === 2
                      ? "bg-[hsl(var(--tier-silver)/0.15)] text-[hsl(var(--tier-silver))] border border-[hsl(var(--tier-silver)/0.3)]"
                      : row.rank === 3
                      ? "bg-[hsl(var(--tier-bronze)/0.15)] text-[hsl(var(--tier-bronze))] border border-[hsl(var(--tier-bronze)/0.3)]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {row.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate">{row.name}</p>
                    {row.you && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[hsl(var(--xp))]">You</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    Lvl {row.level} · {row.identity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold tabular-nums">{row.xp.toLocaleString()}</div>
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
