import { useGamificationStore, difficultyStyle } from "@/stores/gamificationStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Users, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WeeklyChallengeFeature() {
  const challenges = useGamificationStore((s) => s.challenges);
  const navigate = useNavigate();

  const featured = [...challenges]
    .filter((c) => c.status !== "completed")
    .sort((a, b) => b.xp - a.xp)[0];

  if (!featured) return null;

  return (
    <Card className="sp-card p-7 md:p-8">
      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>This week's challenge</span>
        <span className="tabular-nums">Resets Sunday</span>
      </div>

      <h2 className="mt-3 text-2xl md:text-[28px] font-semibold tracking-tight leading-tight">
        {featured.title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">{featured.brief}</p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4">
        <Meta icon={<Zap className="h-3 w-3" />} label="Reward" value={`+${featured.xp.toLocaleString()} XP`} />
        <Meta label="Difficulty" value={featured.difficulty} className={difficultyStyle[featured.difficulty]} />
        <Meta icon={<Clock className="h-3 w-3" />} label="Time" value={featured.duration} />
        <Meta icon={<Users className="h-3 w-3" />} label="Engineers in" value={featured.participants.toLocaleString()} />
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 pt-5 border-t border-border">
        <p className="text-[11px] text-muted-foreground">
          Top finishers earn the <span className="text-foreground font-medium">Cluster Forge</span> badge.
        </p>
        <Button onClick={() => navigate("/student/challenges")} className="gap-1.5 shrink-0">
          Accept <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function Meta({ icon, label, value, className }: { icon?: React.ReactNode; label: string; value: string; className?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}{label}
      </div>
      <div className={`mt-1.5 text-sm font-semibold tabular-nums ${className ?? ""}`}>{value}</div>
    </div>
  );
}
