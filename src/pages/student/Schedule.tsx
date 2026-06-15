import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Monitor, Play, Video, BookOpen, Award, Sparkles, Radio, FileVideo, Download } from "lucide-react";
import { studentSchedule } from "@/data/studentMockData";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { LiveNowBanner } from "@/components/meetings/LiveNowBanner";
import { useMeetingStore, CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";
import { downloadIcs, type IcsEvent } from "@/lib/icsExport";
import { toast } from "sonner";

const parseDurationMin = (d: string): number => {
  let total = 0;
  const h = d.match(/(\d+(?:\.\d+)?)\s*h/i);
  const m = d.match(/(\d+)\s*m/i);
  if (h) total += parseFloat(h[1]) * 60;
  if (m) total += parseInt(m[1]);
  return total || 60;
};

const parseTime = (iso: string, time: string): Date => {
  const d = new Date(iso + "T09:00:00");
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hr = parseInt(match[1]);
    const min = parseInt(match[2]);
    const ampm = match[3]?.toUpperCase();
    if (ampm === "PM" && hr < 12) hr += 12;
    if (ampm === "AM" && hr === 12) hr = 0;
    d.setHours(hr, min, 0, 0);
  }
  return d;
};

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  live: { icon: Video, color: "text-destructive", bg: "bg-destructive/10", label: "Live Class" },
  lab: { icon: Monitor, color: "text-success", bg: "bg-success/10", label: "Lab Session" },
  "self-paced": { icon: Sparkles, color: "text-amber-600", bg: "bg-amber-500/10", label: "Self-Paced" },
  assessment: { icon: Award, color: "text-primary", bg: "bg-primary/10", label: "Assessment" },
};

export default function StudentSchedule() {
  const [view, setView] = useState("list");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => studentSchedule.filter((s) => filter === "all" || s.type === filter), [filter]);
  const grouped = useMemo(() => filtered.reduce<Record<string, typeof studentSchedule>>((acc, s) => { (acc[s.date] = acc[s.date] || []).push(s); return acc; }, {}), [filtered]);

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="lime"
        eyebrow="Game Plan"
        icon={Calendar}
        title={<>Show up. <span className="text-white/95">Win the week.</span></>}
        description="Live sessions, labs, assessments and self-paced recommendations."
        stats={[
          { icon: Video, label: "Live", value: studentSchedule.filter(s => s.type === "live").length },
          { icon: Monitor, label: "Labs", value: studentSchedule.filter(s => s.type === "lab").length },
          { icon: Award, label: "Tests", value: studentSchedule.filter(s => s.type === "assessment").length },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-white hover:bg-white/20 hover:text-white gap-1.5"
              onClick={() => {
                const events: IcsEvent[] = filtered
                  .filter((s) => s.status !== "completed" && s.time !== "Any")
                  .map((s) => {
                    const start = parseTime(s.isoDate, s.time);
                    const end = new Date(start.getTime() + parseDurationMin(s.duration) * 60000);
                    return {
                      uid: `${s.id}@cloudadda`,
                      title: s.title,
                      description: `${s.batch} · ${s.instructor}`,
                      location: s.joinUrl || s.batch,
                      start,
                      end,
                    };
                  });
                if (!events.length) return toast.error("Nothing to export");
                downloadIcs("my-schedule", events);
                toast.success(`${events.length} events exported`);
              }}
            >
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Tabs value={view} onValueChange={setView}>
              <TabsList className="bg-white/15 border border-white/25 backdrop-blur">
                <TabsTrigger value="list" className="text-xs text-white data-[state=active]:bg-white data-[state=active]:text-foreground">List</TabsTrigger>
                <TabsTrigger value="week" className="text-xs text-white data-[state=active]:bg-white data-[state=active]:text-foreground">Week</TabsTrigger>
                <TabsTrigger value="month" className="text-xs text-white data-[state=active]:bg-white data-[state=active]:text-foreground">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />


      <LiveNowBanner />

      <StudentMeetingsStrip />

      <div className="flex items-center gap-2 flex-wrap">
        {[
          { v: "all", label: "All" },
          { v: "live", label: "Live" },
          { v: "lab", label: "Lab" },
          { v: "self-paced", label: "Self-paced" },
          { v: "assessment", label: "Assessment" },
        ].map((c) => (
          <button key={c.v} onClick={() => setFilter(c.v)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filter === c.v ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
            {c.label}
          </button>
        ))}
      </div>

      {view === "list" && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, sessions]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">{date}</h3>
                {date === "Today" && <Badge className="bg-primary/10 text-primary text-[10px] border-0">Today</Badge>}
              </div>
              <div className="space-y-2 ml-6 border-l-2 border-border pl-4">
                {sessions.map((s) => {
                  const tc = typeConfig[s.type];
                  return (
                    <Card key={s.id} className={s.status === "completed" ? "opacity-60" : ""}>
                      <CardContent className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tc.bg}`}><tc.icon className={`h-4 w-4 ${tc.color}`} /></div>
                          <Link to={`/student/schedule/${s.id}`} className="flex-1 min-w-0 group">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate group-hover:text-primary">{s.title}</p>
                              <Badge variant="outline" className="text-[10px]">{tc.label}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{s.batch} · {s.instructor}</p>
                          </Link>
                          <div className="text-right text-xs text-muted-foreground shrink-0">
                            <p className="flex items-center gap-1 justify-end"><Clock className="h-3 w-3" />{s.time}</p>
                            <p>{s.duration}</p>
                          </div>
                          {s.status === "today" && s.type === "live" && <Button size="sm" className="gap-1.5"><Play className="h-3.5 w-3.5" /> Join</Button>}
                          {s.status === "today" && s.type === "lab" && <Button size="sm" variant="outline" className="gap-1.5"><Monitor className="h-3.5 w-3.5" /> Launch</Button>}
                          {s.type === "self-paced" && s.status !== "completed" && <Button size="sm" variant="outline" className="gap-1.5"><Play className="h-3.5 w-3.5" /> Start</Button>}
                          {s.status === "completed" && <Badge variant="secondary" className="text-[10px] bg-success/10 text-success">✓ Done</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "week" && <WeekView />}
      {view === "month" && <MonthView />}
    </div>
  );
}

function StudentMeetingsStrip() {
  const meetings = useMeetingStore((s) => s.getMeetingsForStudent(CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID));
  const upcoming = meetings.filter(m => m.status === "scheduled" || m.status === "live")
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt))
    .slice(0, 4);
  const recordings = meetings.filter(m => m.status === "ended" && m.recordings.length > 0).slice(0, 4);
  if (!upcoming.length && !recordings.length) return null;
  return (
    <Card>
      <CardContent className="pt-5 pb-5 space-y-4">
        {upcoming.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Radio className="h-3.5 w-3.5 text-destructive" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live & upcoming meetings</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {upcoming.map(m => (
                <Link key={m.id} to={`/student/meeting/${m.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${m.status === "live" ? "bg-destructive/10" : "bg-primary/10"}`}>
                    {m.status === "live" ? <Radio className="h-4 w-4 text-destructive animate-pulse" /> : <Video className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{m.title}</p>
                      {m.status === "live" && <Badge className="bg-destructive text-destructive-foreground text-[9px] h-4">LIVE</Badge>}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {new Date(m.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })} · {m.trainerName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {recordings.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileVideo className="h-3.5 w-3.5 text-amber-600" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent recordings</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recordings.map(m => (
                <Link key={m.id} to={`/student/meeting/${m.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/40 transition">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                    <FileVideo className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {new Date(m.scheduledAt).toLocaleDateString()} · {m.recordings[0].durationMins} min
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



function WeekView() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, i) => (
            <div key={d} className="border border-border rounded-lg p-2 min-h-[180px]">
              <p className="text-xs font-medium text-muted-foreground mb-2">{d} · {18 + i}</p>
              <div className="space-y-1">
                {studentSchedule.slice(0, 1 + (i % 3)).map((s) => (
                  <Link key={`${d}-${s.id}`} to={`/student/schedule/${s.id}`} className="block text-[10px] p-1.5 rounded bg-primary/10 text-primary truncate hover:bg-primary/20">
                    {s.time} · {s.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MonthView() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-1 text-center">
          {["S","M","T","W","T","F","S"].map((d, i) => <p key={i} className="text-[10px] text-muted-foreground py-2">{d}</p>)}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 4;
            const hasEvent = [4, 8, 14, 18, 22, 25].includes(i);
            return (
              <div key={i} className={`aspect-square border border-border rounded p-1 text-[10px] ${day < 1 || day > 31 ? "opacity-30" : ""}`}>
                <p className="text-muted-foreground">{day > 0 && day <= 31 ? day : ""}</p>
                {hasEvent && <div className="h-1 w-1 rounded-full bg-primary mt-1 mx-auto" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
