import { useGamificationStore, skillColor } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MasteryTracks() {
  const tracks = useGamificationStore((s) => s.skillTracks);
  const navigate = useNavigate();

  return (
    <Card className="sp-card">
      <CardContent className="p-5">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
              Mastery tracks
            </div>
            <h3 className="text-base font-semibold tracking-tight mt-0.5">
              Becoming an{" "}
              <span className="sp-gradient-text">Infrastructure Architect</span>
            </h3>
          </div>
          <button
            onClick={() => navigate("/student/skill-tree")}
            className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {tracks.map((t) => {
            const color = skillColor[t.key];
            const masteredNodes = t.nodes.filter((n) => n.status === "mastered").length;
            return (
              <button
                key={t.key}
                onClick={() => navigate("/student/skill-tree")}
                className="w-full text-left group rounded-lg border border-transparent hover:border-border hover:bg-muted/30 p-2.5 -mx-2.5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Skill dot */}
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      <span className="text-xs tabular-nums font-semibold shrink-0" style={{ color }}>
                        {t.mastery}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.mastery}%`,
                          background: `linear-gradient(90deg, ${color}, hsl(var(--xp)))`,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-muted-foreground tabular-nums">
                      {masteredNodes} / {t.nodes.length} modules mastered
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
