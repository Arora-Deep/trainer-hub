import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Clock, Zap, ArrowUpRight } from "lucide-react";
import { useGamificationStore } from "@/stores/gamificationStore";
import { useNavigate } from "react-router-dom";

function daysBetween(from: string, to: string) {
  return Math.max(0, Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86400000));
}

export function SeasonBanner({ compact = false }: { compact?: boolean }) {
  const { season } = useGamificationStore();
  const navigate = useNavigate();
  const daysLeft = daysBetween(new Date().toISOString(), season.endsAt);
  const capPct = Math.round((season.weeklyXpEarned / season.weeklyXpCap) * 100);

  return (
    <Card>
      <CardContent className={`${compact ? "p-4" : "p-5"} space-y-4`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>Season</span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {daysLeft}d left</span>
            </div>
            <h3 className="mt-2 text-base font-semibold tracking-tight">{season.name}</h3>
            <p className="text-xs text-muted-foreground">{season.theme}</p>
          </div>
          <button
            onClick={() => navigate("/student/leaderboard")}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Leaderboard <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-1">
          <Stat label="Rank" value={`#${season.rank}`} sub={`of ${season.totalParticipants.toLocaleString()}`} icon={<Trophy className="h-3 w-3" />} />
          <Stat label="Weekly XP" value={season.weeklyXpEarned.toLocaleString()} sub={`/ ${season.weeklyXpCap.toLocaleString()}`} icon={<Zap className="h-3 w-3" />} />
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Cap</div>
            <div className="mt-2 text-base font-semibold tabular-nums leading-none">{capPct}%</div>
            <div className="mt-2 h-0.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-foreground" style={{ width: `${capPct}%` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-2 text-base font-semibold tabular-nums leading-none">{value}</div>
      {sub && <div className="mt-1 text-[10px] text-muted-foreground tabular-nums">{sub}</div>}
    </div>
  );
}
