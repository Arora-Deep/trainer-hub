import { useGamificationStore } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MasteryTracks() {
  const tracks = useGamificationStore((s) => s.skillTracks);
  const navigate = useNavigate();

  return (
    <Card className="sp-card">
      <CardContent className="p-5">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Mastery tracks
            </div>
            <h3 className="text-base font-semibold tracking-tight mt-1">
              Toward Infrastructure Architect
            </h3>
          </div>
          <button
            onClick={() => navigate("/student/skill-tree")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
          >
            All <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-4">
          {tracks.map((t) => {
            const masteredNodes = t.nodes.filter((n) => n.status === "mastered").length;
            return (
              <button
                key={t.key}
                onClick={() => navigate("/student/skill-tree")}
                className="w-full text-left group block"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <p className="text-sm font-medium truncate group-hover:text-foreground">{t.name}</p>
                  <span className="text-xs tabular-nums text-muted-foreground shrink-0">{t.mastery}%</span>
                </div>
                <div className="h-0.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground transition-all" style={{ width: `${t.mastery}%` }} />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground tabular-nums">
                  {masteredNodes} / {t.nodes.length} modules mastered
                </p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
