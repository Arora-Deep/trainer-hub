import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Monitor, Play, Video, BookOpen, Award, Sparkles } from "lucide-react";
import { studentSchedule } from "@/data/studentMockData";

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">Live sessions, labs, assessments and self-paced recommendations</p>
        </div>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
