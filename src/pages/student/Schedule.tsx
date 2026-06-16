import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Monitor, Play, Video, Award, AlarmClock } from "lucide-react";
import { studentSchedule, type StudentSession } from "@/data/studentMockData";

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  live: { icon: Video, color: "text-destructive", bg: "bg-destructive/10", label: "Live Class" },
  lab: { icon: Monitor, color: "text-success", bg: "bg-success/10", label: "Lab" },
  assessment: { icon: Award, color: "text-primary", bg: "bg-primary/10", label: "Deadline" },
  "self-paced": { icon: AlarmClock, color: "text-amber-600", bg: "bg-amber-500/10", label: "Event" },
};

export default function StudentSchedule() {
  // Keep only things the student needs to act on: live classes + deadlines/events.
  // Drop self-paced "recommendations" and past items from this view.
  const upcoming = useMemo(
    () =>
      studentSchedule
        .filter((s) => s.status !== "completed")
        .sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    []
  );

  const next = upcoming.find((s) => s.status === "today" && s.type === "live") ?? upcoming[0];
  const rest = upcoming.filter((s) => s.id !== next?.id);

  const grouped = useMemo(
    () =>
      rest.reduce<Record<string, StudentSession[]>>((acc, s) => {
        (acc[s.date] = acc[s.date] || []).push(s);
        return acc;
      }, {}),
    [rest]
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your upcoming live trainings, deadlines and events.
        </p>
      </div>

      {next && <NextUpCard session={next} />}

      <div className="space-y-5">
        {Object.entries(grouped).map(([date, sessions]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">{date}</h2>
            </div>
            <div className="space-y-2">
              {sessions.map((s) => (
                <SessionRow key={s.id} session={s} />
              ))}
            </div>
          </div>
        ))}

        {upcoming.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nothing scheduled. You're all caught up.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function NextUpCard({ session }: { session: StudentSession }) {
  const tc = typeConfig[session.type];
  const isToday = session.status === "today";
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="py-5">
        <div className="flex items-start gap-4">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${tc.bg}`}>
            <tc.icon className={`h-5 w-5 ${tc.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[10px]">{tc.label}</Badge>
              {isToday && <Badge className="bg-primary text-primary-foreground text-[10px] border-0">Today</Badge>}
            </div>
            <p className="text-base font-semibold">{session.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session.batch} · {session.instructor}
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-3">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{session.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{session.time} · {session.duration}</span>
            </p>
          </div>
          <SessionAction session={session} primary />
        </div>
      </CardContent>
    </Card>
  );
}

function SessionRow({ session }: { session: StudentSession }) {
  const tc = typeConfig[session.type];
  return (
    <Card>
      <CardContent className="py-3">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tc.bg}`}>
            <tc.icon className={`h-4 w-4 ${tc.color}`} />
          </div>
          <Link to={`/student/schedule/${session.id}`} className="flex-1 min-w-0 group">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate group-hover:text-primary">{session.title}</p>
              <Badge variant="outline" className="text-[10px]">{tc.label}</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{session.batch}</p>
          </Link>
          <div className="text-right text-xs text-muted-foreground shrink-0">
            <p className="flex items-center gap-1 justify-end"><Clock className="h-3 w-3" />{session.time}</p>
            <p>{session.duration}</p>
          </div>
          <SessionAction session={session} />
        </div>
      </CardContent>
    </Card>
  );
}

function SessionAction({ session, primary }: { session: StudentSession; primary?: boolean }) {
  if (session.status === "today" && session.type === "live") {
    return (
      <Button size="sm" className="gap-1.5">
        <Play className="h-3.5 w-3.5" /> Join now
      </Button>
    );
  }
  if (session.type === "assessment") {
    return (
      <Button asChild size="sm" variant={primary ? "default" : "outline"}>
        <Link to={`/student/schedule/${session.id}`}>View</Link>
      </Button>
    );
  }
  return (
    <Button asChild size="sm" variant="outline">
      <Link to={`/student/schedule/${session.id}`}>Details</Link>
    </Button>
  );
}
