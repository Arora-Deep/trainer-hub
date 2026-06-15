import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, PlayCircle, Calendar, Clock, FileVideo, Users } from "lucide-react";
import { useMeetingStore, CURRENT_STUDENT_ID } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  duration: string;
}

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export function MeetingLessonPanel({ courseId, lessonId, lessonTitle, duration }: Props) {
  const meetings = useMeetingStore((s) => s.meetings);
  // Try linked meeting first, otherwise pick any live/scheduled meeting for this course
  const linked =
    meetings.find((m) => m.courseId === courseId && m.lessonId === lessonId) ||
    meetings.find((m) => m.courseId === courseId && (m.status === "live" || m.status === "scheduled")) ||
    meetings.find((m) => m.courseId === courseId);

  const join = (url: string) => {
    toast({ title: "BBB integration pending", description: "Live rooms will open once BigBlueButton is connected." });
    window.open(url, "_blank");
  };

  if (!linked) {
    return (
      <div className="p-8 text-center space-y-3">
        <Radio className="h-10 w-10 mx-auto text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{lessonTitle}</p>
          <p className="text-xs text-muted-foreground">Live instructor-led session · {duration}</p>
        </div>
        <p className="text-xs text-muted-foreground">No meeting scheduled yet for this lesson.</p>
      </div>
    );
  }

  const m = linked;
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">Live session</Badge>
            {m.status === "live" && (
              <Badge className="bg-destructive text-destructive-foreground text-[10px] gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </Badge>
            )}
            {m.status === "scheduled" && <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/30">Scheduled</Badge>}
            {m.status === "ended" && <Badge variant="outline" className="text-[10px]">Ended</Badge>}
          </div>
          <h3 className="text-base font-semibold">{m.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{m.trainerName} · {m.batchName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        <Card className="p-3">
          <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> When</div>
          <div className="font-medium mt-0.5">{fmt(m.scheduledAt)}</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</div>
          <div className="font-medium mt-0.5">{m.durationMins} min</div>
        </Card>
        <Card className="p-3">
          <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Class</div>
          <div className="font-medium mt-0.5">{m.totalInvited} students</div>
        </Card>
      </div>

      {m.agenda.length > 0 && (
        <div>
          <div className="text-xs font-semibold mb-1.5">Agenda</div>
          <ul className="text-xs space-y-1">
            {m.agenda.map((a, i) => <li key={i} className="text-muted-foreground">· {a}</li>)}
          </ul>
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t">
        {(m.status === "live" || m.status === "scheduled") && (
          <Button size="sm" onClick={() => join(m.bbb.joinUrlMock)}>
            <PlayCircle className="h-4 w-4 mr-1.5" />
            {m.status === "live" ? "Join live class" : "Open meeting room"}
          </Button>
        )}
        {m.status === "ended" && m.recordings.length > 0 && (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/student/meeting/${m.id}`}><FileVideo className="h-4 w-4 mr-1.5" />Watch recording</Link>
          </Button>
        )}
        <Button size="sm" variant="ghost" asChild><Link to={`/student/meeting/${m.id}`}>View details</Link></Button>
      </div>
    </div>
  );
}
