import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useGamificationStore, pathProgress, skillColor, statusStyle } from "@/stores/gamificationStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, FlaskConical, FileText, Swords, GraduationCap, CheckCircle2, Lock, Circle, Loader2, ArrowRight, Clock } from "lucide-react";

const kindIcon = {
  course: BookOpen, lesson: BookOpen, lab: FlaskConical, challenge: Swords, assessment: FileText,
} as const;

const statusIcon = {
  completed: CheckCircle2, in_progress: Loader2, available: Circle, locked: Lock,
} as const;

export default function PathDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { learningPaths } = useGamificationStore();
  const navigate = useNavigate();

  const path = learningPaths.find((p) => p.slug === slug);
  if (!path) return <Navigate to="/student/paths" replace />;

  const pp = pathProgress(path);
  const accent = skillColor[path.key];
  const nextUp = path.modules.find((m) => m.status === "in_progress" || m.status === "available");

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/student/paths")} className="gap-1.5 -ml-2">
        <ArrowLeft className="h-3.5 w-3.5" /> All paths
      </Button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div className="h-2" style={{ background: accent }} />
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{path.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{path.tagline}</p>
              <p className="text-sm mt-3 max-w-2xl">{path.description}</p>
            </div>
            <Badge variant="outline" className={`text-[10px] ${pp.pct === 100 ? "text-success border-success/30 bg-success/10" : ""}`}>
              {pp.pct === 100 ? "Completed" : `${pp.pct}% complete`}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <Stat label="Modules" value={`${pp.done} / ${pp.total}`} />
            <Stat label="Est. time" value={`~${path.estHours}h`} />
            <Stat label="Mastery" value={`${path.mastery}%`} />
          </div>

          <Progress value={pp.pct} className="h-1.5" />

          {nextUp && (
            <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-primary font-semibold">Next up</p>
                <p className="text-sm font-semibold mt-0.5">{nextUp.name}</p>
                <p className="text-[11px] text-muted-foreground">{nextUp.detail}</p>
              </div>
              <Button size="sm" onClick={() => navigate(nextUp.link)} className="gap-1.5 shrink-0">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Module sequence */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight">Module sequence</h2>
        <div className="space-y-2">
          {path.modules.map((m, i) => {
            const KindIcon = kindIcon[m.kind];
            const StatusIcon = statusIcon[m.status];
            const isProgress = m.status === "in_progress";
            const locked = m.status === "locked";
            return (
              <Card
                key={m.id}
                className={`overflow-hidden ${locked ? "opacity-60" : "cursor-pointer hover:bg-muted/40"} transition-colors`}
                onClick={() => !locked && navigate(m.link)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`h-8 w-8 rounded-full border flex items-center justify-center ${statusStyle[m.status]}`}>
                      <StatusIcon className={`h-4 w-4 ${isProgress ? "animate-spin" : ""}`} />
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <KindIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{m.name}</p>
                      <Badge variant="outline" className="text-[9px] capitalize">{m.kind}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{m.detail}</p>
                  </div>
                  {m.estMinutes && (
                    <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" /> {m.estMinutes}m
                    </span>
                  )}
                  {!locked && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-base font-semibold tabular-nums mt-0.5">{value}</p>
    </div>
  );
}
