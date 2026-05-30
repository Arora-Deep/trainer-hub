import { useGamificationStore, skillColor } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Play, Lock, ChevronRight, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SkillProgressionPath() {
  const tracks = useGamificationStore((s) => s.skillTracks);
  const profile = useGamificationStore((s) => s.profile);
  const navigate = useNavigate();

  // Show the user's specialization track
  const active = tracks.find((t) => t.key === profile.specialization) ?? tracks[0];
  const color = skillColor[active.key];

  return (
    <Card
      className="sp-card overflow-hidden cursor-pointer"
      onClick={() => navigate("/student/skill-tree")}
    >
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${color}, hsl(var(--xp)))` }}
      />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              <GitBranch className="h-3 w-3" />
              <span>Active progression path</span>
            </div>
            <h3 className="mt-1 text-base font-semibold tracking-tight">{active.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{active.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Mastery</div>
            <div className="text-2xl font-bold tabular-nums leading-none" style={{ color }}>
              {active.mastery}%
            </div>
          </div>
        </div>

        {/* Mastery bar */}
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: `${active.mastery}%`,
              background: `linear-gradient(90deg, ${color}, hsl(var(--xp)))`,
              boxShadow: `0 0 10px ${color}`,
            }}
          >
            <span className="absolute inset-0 tier-shimmer" />
          </div>
        </div>

        {/* Nodes ladder */}
        <ol className="space-y-1.5">
          {active.nodes.map((node, i) => {
            const isMastered = node.status === "mastered";
            const isInProgress = node.status === "in_progress";
            const isLocked = node.status === "locked";
            const isAvailable = node.status === "available";

            return (
              <li
                key={node.id}
                className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
                  isInProgress ? "bg-[hsl(var(--xp)/0.06)]" : "hover:bg-muted/50"
                }`}
              >
                {/* Status node */}
                <div className="relative">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                      isMastered
                        ? "bg-success text-success-foreground border-success"
                        : isInProgress
                        ? "border-[hsl(var(--xp))] text-[hsl(var(--xp))] bg-[hsl(var(--xp)/0.1)]"
                        : isAvailable
                        ? "border-border text-muted-foreground bg-card"
                        : "border-dashed border-border text-muted-foreground/60 bg-muted/40"
                    }`}
                  >
                    {isMastered ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : isInProgress ? (
                      <Play className="h-3 w-3 fill-current" />
                    ) : isLocked ? (
                      <Lock className="h-3 w-3" />
                    ) : (
                      <span className="text-[10px] font-semibold tabular-nums">{i + 1}</span>
                    )}
                  </span>
                  {isInProgress && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: `${color}25` }}
                    />
                  )}
                </div>

                {/* Connector */}
                {i !== active.nodes.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute left-[26px] mt-7 h-3 w-px bg-border"
                  />
                )}

                {/* Label */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p
                      className={`text-sm truncate ${
                        isMastered
                          ? "text-foreground"
                          : isInProgress
                          ? "font-semibold text-foreground"
                          : isLocked
                          ? "text-muted-foreground/70"
                          : "text-foreground"
                      }`}
                    >
                      {node.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground tabular-nums mt-0.5">
                      +{node.xp} XP
                      {isInProgress && <span className="ml-2 text-[hsl(var(--xp))] font-semibold">· In progress</span>}
                      {isMastered && <span className="ml-2 text-success font-semibold">· Mastered</span>}
                      {isLocked && <span className="ml-2 text-muted-foreground/60">· Locked</span>}
                    </p>
                  </div>
                  {(isAvailable || isInProgress) && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
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
