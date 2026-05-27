import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Trophy, Clock, Zap, ArrowUpRight } from "lucide-react";
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
    <Card className="relative overflow-hidden border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-[hsl(var(--xp)/0.08)] pointer-events-none" />
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <CardContent className={`relative ${compact ? "p-4" : "p-5"} space-y-3`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5">
                <Sparkles className="h-3 w-3" /> SEASON
              </span>
              <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {daysLeft} days left
              </span>
            </div>
            <h3 className="mt-1.5 text-base font-semibold tracking-tight">{season.name}</h3>
            <p className="text-xs text-muted-foreground">{season.theme}</p>
          </div>
          <button
            onClick={() => navigate("/student/leaderboard")}
            className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Leaderboard <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Your rank" value={`#${season.rank}`} sub={`of ${season.totalParticipants.toLocaleString()}`} icon={<Trophy className="h-3 w-3" />} />
          <Stat label="Weekly XP" value={`${season.weeklyXpEarned.toLocaleString()}`} sub={`/ ${season.weeklyXpCap.toLocaleString()} cap`} icon={<Zap className="h-3 w-3 text-primary" />} />
          <div className="rounded-lg border border-border p-2.5 flex flex-col justify-between">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Cap used</span>
            <div className="mt-1 space-y-1">
              <Progress value={capPct} className="h-1" />
              <span className="text-[10px] text-muted-foreground tabular-nums">{capPct}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-0.5 text-base font-semibold tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[10px] text-muted-foreground tabular-nums">{sub}</div>}
    </div>
  );
}
