import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Monitor, Play, Video, BookOpen } from "lucide-react";

interface Session {
  id: string;
  title: string;
  batch: string;
  date: string;
  time: string;
  duration: string;
  type: "live" | "lab" | "self-paced";
  instructor: string;
  status: "upcoming" | "today" | "completed";
}

const schedule: Session[] = [
  { id: "1", title: "AWS VPC Deep Dive", batch: "AWS Batch 12", date: "Today", time: "2:00 PM", duration: "2h", type: "live", instructor: "James Wilson", status: "today" },
  { id: "2", title: "VPC Lab Session", batch: "AWS Batch 12", date: "Today", time: "4:00 PM", duration: "1.5h", type: "lab", instructor: "James Wilson", status: "today" },
  { id: "3", title: "K8s Pod Networking", batch: "K8s Batch 5", date: "Tomorrow", time: "10:00 AM", duration: "1.5h", type: "live", instructor: "Sarah Chen", status: "upcoming" },
  { id: "4", title: "K8s Lab: First Cluster", batch: "K8s Batch 5", date: "Tomorrow", time: "11:30 AM", duration: "2h", type: "lab", instructor: "Sarah Chen", status: "upcoming" },
  { id: "5", title: "IAM Policies Deep Dive", batch: "AWS Batch 12", date: "Wed, Mar 5", time: "3:00 PM", duration: "1h", type: "live", instructor: "James Wilson", status: "upcoming" },
  { id: "6", title: "Self-paced: S3 Review", batch: "AWS Batch 12", date: "Thu, Mar 6", time: "Any", duration: "45m", type: "self-paced", instructor: "-", status: "upcoming" },
  { id: "7", title: "AWS EC2 Lab", batch: "AWS Batch 12", date: "Yesterday", time: "2:00 PM", duration: "1h", type: "lab", instructor: "James Wilson", status: "completed" },
];

const typeConfig = {
  live: { icon: Video, color: "text-destructive", bg: "bg-destructive/10", label: "Live Class" },
  lab: { icon: Monitor, color: "text-success", bg: "bg-success/10", label: "Lab Session" },
  "self-paced": { icon: BookOpen, color: "text-primary", bg: "bg-primary/10", label: "Self-Paced" },
};

export default function StudentSchedule() {
  const grouped = schedule.reduce<Record<string, Session[]>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming sessions, labs, and self-paced work</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> Live</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Lab</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Self-Paced</span>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([date, sessions]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">{date}</h3>
              {date === "Today" && <Badge className="bg-primary/10 text-primary text-[10px]">Today</Badge>}
            </div>
            <div className="space-y-2 ml-6 border-l-2 border-border pl-4">
              {sessions.map((s) => {
                const tc = typeConfig[s.type];
                return (
                  <Card key={s.id} className={s.status === "completed" ? "opacity-60" : ""}>
                    <CardContent className="py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tc.bg}`}>
                          <tc.icon className={`h-4 w-4 ${tc.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{s.title}</p>
                            <Badge variant="outline" className="text-[10px]">{tc.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{s.batch} · {s.instructor !== "-" ? s.instructor : "Self-paced"}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right text-xs text-muted-foreground">
                            <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.time}</p>
                            <p>{s.duration}</p>
                          </div>
                          {s.status === "today" && s.type === "live" && (
                            <Button size="sm" className="gap-1.5"><Play className="h-3.5 w-3.5" /> Join</Button>
                          )}
                          {s.status === "today" && s.type === "lab" && (
                            <Button size="sm" variant="outline" className="gap-1.5"><Monitor className="h-3.5 w-3.5" /> Launch</Button>
                          )}
                          {s.status === "completed" && (
                            <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">✓ Done</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
