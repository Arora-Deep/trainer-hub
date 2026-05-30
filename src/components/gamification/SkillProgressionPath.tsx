import { useGamificationStore } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Play, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SkillProgressionPath() {
  const tracks = useGamificationStore((s) => s.skillTracks);
  const profile = useGamificationStore((s) => s.profile);
  const navigate = useNavigate();

  const active = tracks.find((t) => t.key === profile.specialization) ?? tracks[0];

  return (
    <Card
      className="sp-card cursor-pointer"
      onClick={() => navigate("/student/skill-tree")}
    >
      <CardContent className="p-5 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Active progression
            </div>
            <h3 className="mt-1 text-base font-semibold tracking-tight">{active.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{active.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Mastery</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums leading-none">{active.mastery}%</div>
          </div>
        </div>

        <div className="h-0.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-foreground transition-all" style={{ width: `${active.mastery}%` }} />
        </div>

        <ol className="space-y-0.5">
          {active.nodes.map((node, i) => {
            const isMastered = node.status === "mastered";
            const isInProgress = node.status === "in_progress";
            const isLocked = node.status === "locked";

            return (
              <li
                key={node.id}
                className="group flex items-center gap-3 rounded-lg px-2 py-2 -mx-2 transition-colors hover:bg-muted/40"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] tabular-nums shrink-0 ${
                    isMastered
                      ? "bg-foreground text-background border-foreground"
                      : isInProgress
                      ? "border-foreground text-foreground"
                      : isLocked
                      ? "border-dashed border-border text-muted-foreground/60"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {isMastered ? (
                    <Check className="h-3 w-3" />
                  ) : isInProgress ? (
                    <Play className="h-2.5 w-2.5 fill-current" />
                  ) : isLocked ? (
                    <Lock className="h-2.5 w-2.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${isInProgress ? "font-semibold" : isLocked ? "text-muted-foreground/70" : ""}`}>
                      {node.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                      +{node.xp} XP
                      {isInProgress && <span className="ml-2 text-foreground">· In progress</span>}
                      {isMastered && <span className="ml-2">· Mastered</span>}
                    </p>
                  </div>
                  {!isLocked && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
