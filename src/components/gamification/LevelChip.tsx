import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import { Flame, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

export function LevelChip() {
  const { profile, streak, learningPaths } = useGamificationStore();
  const navigate = useNavigate();
  const activePath = learningPaths.find((p) => p.modules.some((m) => m.status === "in_progress")) ?? learningPaths[0];
  const ap = pathProgress(activePath);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 h-8 pl-2 pr-2.5 rounded-full border border-border bg-card hover:bg-muted transition-colors"
          aria-label="Open progress summary"
        >
          <span className="flex items-center gap-1 text-[11px] font-semibold text-warning">
            <Flame className="h-3.5 w-3.5 animate-flame-pulse" /> {streak.current}d
          </span>
          <span className="hidden md:block h-4 w-px bg-border" />
          <span className="hidden md:flex items-center gap-1 text-[11px] font-medium text-primary">
            <Route className="h-3.5 w-3.5" /> {ap.pct}%
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold">{profile.name}</p>
          <p className="text-[11px] text-muted-foreground">{profile.batchName}</p>
        </div>
        {activePath && (
          <div>
            <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums mb-1">
              <span>{activePath.name}</span>
              <span>{ap.done} / {ap.total} modules</span>
            </div>
            <Progress value={ap.pct} className="h-1.5" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <Stat label="Streak" value={`${streak.current}d`} icon={<Flame className="h-3 w-3 text-warning" />} />
          <Stat label="Best" value={`${streak.longest}d`} icon={<Flame className="h-3 w-3 text-muted-foreground" />} />
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button onClick={() => navigate("/student/portfolio")} className="text-[11px] font-medium text-primary hover:underline text-left">
            View portfolio →
          </button>
          <button onClick={() => navigate("/student/progress")} className="text-[11px] font-medium text-primary hover:underline text-right">
            My progress →
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
