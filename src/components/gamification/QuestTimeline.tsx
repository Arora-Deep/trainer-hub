import { CheckCircle2, Circle, Lock, Play, Video, FlaskConical, FileQuestion, Flag, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Quest, QuestStepKind } from "@/stores/questStore";
import { useNavigate } from "react-router-dom";

const stepIcon: Record<QuestStepKind, typeof Video> = {
  lesson: Video, course: Video, lab: FlaskConical, quiz: FileQuestion, challenge: Flag, assessment: FileText,
};

export function QuestTimeline({ quest }: { quest: Quest }) {
  const navigate = useNavigate();
  const currentIdx = quest.steps.findIndex(s => !s.completed);

  return (
    <ol className="relative space-y-3">
      <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {quest.steps.map((step, i) => {
        const Icon = stepIcon[step.kind];
        const isCurrent = i === currentIdx;
        const isLocked = currentIdx >= 0 && i > currentIdx;
        return (
          <li key={step.id} className="relative pl-10">
            <span
              className={`absolute left-0 top-1 h-8 w-8 rounded-full border flex items-center justify-center bg-background ${
                step.completed
                  ? "border-success text-success"
                  : isCurrent
                    ? "border-primary text-primary ring-4 ring-primary/15"
                    : "border-border text-muted-foreground"
              }`}
            >
              {step.completed ? <CheckCircle2 className="h-4 w-4" /> : isLocked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
            </span>
            <div
              className={`flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors ${
                isCurrent
                  ? "border-primary/30 bg-primary/[0.04]"
                  : step.completed
                    ? "border-border bg-muted/20"
                    : "border-border"
              }`}
            >
              <div className="min-w-0">
                <p className={`text-sm font-medium ${step.completed ? "text-muted-foreground line-through" : ""}`}>{step.title}</p>
                <p className="text-[11px] text-muted-foreground">{step.detail} · +{step.xp} XP</p>
              </div>
              {isCurrent && (
                <Button size="sm" className="h-7 text-xs gap-1" onClick={() => navigate(step.link)}>
                  <Play className="h-3 w-3" /> Start
                </Button>
              )}
              {!isCurrent && !step.completed && !isLocked && (
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => navigate(step.link)}>Open <ChevronRight className="h-3 w-3" /></Button>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
