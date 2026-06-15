import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, FlaskConical, FileText, Play, Sparkles, ArrowRight } from "lucide-react";
import { useMeetingStore, CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";
import { studentLabs, studentSchedule } from "@/data/studentMockData";

type Action = {
  kind: "meeting" | "assessment" | "lab" | "lesson";
  title: string;
  subtitle: string;
  href: string;
  cta: string;
  icon: any;
  accent: string;
  urgency: string;
};

export function NextActionCard() {
  const allMeetings = useMeetingStore((s) => s.meetings);
  const meetings = useMemo(
    () =>
      allMeetings.filter(
        (m) =>
          m.batchId === CURRENT_STUDENT_BATCH_ID ||
          m.inviteeIds.includes(CURRENT_STUDENT_ID)
      ),
    [allMeetings]
  );

  const next = useMemo<Action | null>(() => {
    // 1. Live meeting right now
    const live = meetings.find((m) => m.status === "live");
    if (live)
      return {
        kind: "meeting",
        title: live.title,
        subtitle: `Live now · ${live.trainerName}`,
        href: `/student/meeting/${live.id}`,
        cta: "Join now",
        icon: Radio,
        accent: "bg-destructive/10 text-destructive",
        urgency: "Live",
      };

    // 2. Meeting starting within 60 min
    const soon = meetings
      .filter((m) => m.status === "scheduled")
      .map((m) => ({ m, t: +new Date(m.scheduledAt) - Date.now() }))
      .filter((x) => x.t > 0 && x.t < 60 * 60 * 1000)
      .sort((a, b) => a.t - b.t)[0];
    if (soon)
      return {
        kind: "meeting",
        title: soon.m.title,
        subtitle: `Starts in ${Math.round(soon.t / 60000)} min · ${soon.m.trainerName}`,
        href: `/student/meeting/${soon.m.id}`,
        cta: "Open",
        icon: Radio,
        accent: "bg-destructive/10 text-destructive",
        urgency: "Soon",
      };

    // 3. Lab still running
    const runningLab = studentLabs.find((l) => l.status === "running");
    if (runningLab)
      return {
        kind: "lab",
        title: runningLab.name,
        subtitle: `Lab running · ${runningLab.timeRemaining} left`,
        href: `/student/labs/${runningLab.id}`,
        cta: "Resume lab",
        icon: FlaskConical,
        accent: "bg-success/10 text-success",
        urgency: "Active",
      };

    // 4. Next due assessment from schedule
    const due = studentSchedule.find(
      (s) => s.type === "assessment" && s.status !== "completed"
    );
    if (due)
      return {
        kind: "assessment",
        title: due.title,
        subtitle: `Due ${due.date} · ${due.batch}`,
        href: `/student/schedule/${due.id}`,
        cta: "Start",
        icon: FileText,
        accent: "bg-primary/10 text-primary",
        urgency: "Due",
      };

    // 5. Fallback: next self-paced
    const sp = studentSchedule.find(
      (s) => s.type === "self-paced" && s.status !== "completed"
    );
    if (sp)
      return {
        kind: "lesson",
        title: sp.title,
        subtitle: `Recommended · ${sp.batch}`,
        href: `/student/schedule/${sp.id}`,
        cta: "Start",
        icon: Sparkles,
        accent: "bg-amber-500/10 text-amber-600",
        urgency: "Pickup",
      };

    return null;
  }, [meetings]);

  if (!next) return null;
  const Icon = next.icon;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${next.accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Next action
            </p>
            <Badge variant="outline" className="text-[10px] h-4">{next.urgency}</Badge>
          </div>
          <p className="text-sm font-semibold truncate">{next.title}</p>
          <p className="text-xs text-muted-foreground truncate">{next.subtitle}</p>
        </div>
        <Button asChild size="sm" className="gap-1.5 shrink-0">
          <Link to={next.href}>
            <Play className="h-3.5 w-3.5" /> {next.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
