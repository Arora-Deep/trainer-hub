import { useGamificationStore, pathProgress, skillColor } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { useNavigate } from "react-router-dom";
import { Route, ArrowRight, Clock, Layers } from "lucide-react";

export default function Paths() {
  const { learningPaths } = useGamificationStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="violet"
        eyebrow="Learning Paths"
        icon={Route}
        title={<>Structured journeys, <span className="text-white/95">end to end</span>.</>}
        description="Each path threads courses, labs, and assessments into one coherent skill. Finish a path, ship the proof."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learningPaths.map((p) => {
          const pp = pathProgress(p);
          const accent = skillColor[p.key];
          return (
            <Card key={p.slug} className="overflow-hidden cursor-pointer group" onClick={() => navigate(`/student/paths/${p.slug}`)}>
              <div className="h-1.5" style={{ background: accent }} />
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.tagline}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${pp.pct === 100 ? "text-success border-success/30 bg-success/10" : ""}`}>
                    {pp.pct === 100 ? "Completed" : pp.pct > 0 ? "In progress" : "Not started"}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{pp.done} / {pp.total} modules</span>
                    <span className="tabular-nums">{pp.pct}%</span>
                  </div>
                  <Progress value={pp.pct} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> ~{p.estHours}h</span>
                    <span className="inline-flex items-center gap-1"><Layers className="h-3 w-3" /> {p.modules.length} modules</span>
                  </div>
                  <span className="text-xs font-semibold inline-flex items-center gap-1 text-primary group-hover:gap-1.5 transition-all">
                    {pp.pct === 0 ? "Start" : "Continue"} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
