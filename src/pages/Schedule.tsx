import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Users, Clock, User as UserIcon, PlayCircle, ChevronLeft, ChevronRight, CalendarDays, Sparkles } from "lucide-react";
import { useBatchStore, type Batch } from "@/stores/batchStore";
import { cn } from "@/lib/utils";

// ───────────────────── helpers ─────────────────────
const HOUR_START = 8;
const HOUR_END = 20; // exclusive
const HOURS = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

interface Session {
  batch: Batch;
  dayOffset: number; // from today
  startHour: number; // 24h, fractional ok
  durationH: number;
}

const fmtTime = (h: number) => {
  const hr = Math.floor(h);
  const mi = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? "PM" : "AM";
  const hh = ((hr + 11) % 12) + 1;
  return `${hh}:${mi.toString().padStart(2, "0")} ${ap}`;
};

const fmtHourLabel = (h: number) => {
  const ap = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh.toString().padStart(2, "0")}:00 ${ap}`;
};

const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// Deterministic daily schedule for each batch — recurs Mon–Fri while batch is active.
const generateSessions = (batches: Batch[], baseDate: Date, daysAhead: number): Session[] => {
  const out: Session[] = [];
  for (let offset = -7; offset <= daysAhead; offset++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + offset);
    const dow = d.getDay(); // 0 Sun, 6 Sat
    if (dow === 0 || dow === 6) continue;
    batches.forEach((b) => {
      // Skip self-paced and draft
      if (b.deliveryMode === "self-paced") return;
      if (b.status === "draft" || b.status === "pending_approval") return;
      // Pseudo-random schedule per batch
      const h = hash(b.id);
      const startSlot = h % 8; // 0..7
      const startHour = HOUR_START + startSlot + ((h >> 3) % 2) * 0.5; // 0 or 0.5
      const durationH = 1.5 + ((h >> 5) % 4) * 0.5; // 1.5..3.0
      // batches don't all meet every weekday — use a pattern based on id
      const meetsToday = ((h >> 7) + offset) % 2 === 0 || b.status === "live";
      if (!meetsToday) return;
      out.push({ batch: b, dayOffset: offset, startHour, durationH });
    });
  }
  return out;
};

const statusColor = (s: Batch["status"], live: boolean) => {
  if (live) return { bar: "bg-success", chip: "bg-success/10 text-success border-success/20", soft: "bg-success/5" };
  if (s === "upcoming") return { bar: "bg-primary", chip: "bg-primary/10 text-primary border-primary/20", soft: "bg-primary/5" };
  return { bar: "bg-muted-foreground/40", chip: "bg-muted text-muted-foreground border-border", soft: "bg-muted/30" };
};

// ───────────────────── components ─────────────────────
function BatchPill({ session, live }: { session: Session; live: boolean }) {
  const c = statusColor(session.batch.status, live);
  const end = session.startHour + session.durationH;
  return (
    <Link
      to={`/batches/${session.batch.id}`}
      className={cn(
        "block rounded-xl border border-border/70 p-3 hover:shadow-sm transition-all hover:border-foreground/20",
        c.soft
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate">{session.batch.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{session.batch.courseName}</p>
        </div>
        {live && (
          <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[10px] font-medium", c.chip)}>
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><UserIcon className="h-3 w-3" />{session.batch.instructors[0] ?? "—"}</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{session.batch.participants?.length ?? session.batch.seatCount ?? 0}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtTime(session.startHour)} – {fmtTime(end)}</span>
      </div>
    </Link>
  );
}

function LiveNowCard({ session }: { session: Session }) {
  const end = session.startHour + session.durationH;
  return (
    <Card className="p-4 border-success/30 bg-success/[0.03]">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
            </span>
          </div>
          <h3 className="text-sm font-semibold truncate">{session.batch.name}</h3>
          <p className="text-xs text-muted-foreground">{session.batch.courseName}</p>
        </div>
        <Button size="sm" asChild>
          <Link to={`/batches/${session.batch.id}`}><PlayCircle className="h-3.5 w-3.5 mr-1.5" />Open Session</Link>
        </Button>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{fmtTime(session.startHour)} – {fmtTime(end)}</span>
        <span className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" />{session.batch.instructors[0]}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{session.batch.participants?.length ?? session.batch.seatCount} students</span>
      </div>
    </Card>
  );
}

// Hour timeline showing overlapping batches as stacked rows
function DayTimeline({ sessions, now }: { sessions: Session[]; now: Date }) {
  // Sort and lay out: within each hour bucket, sessions stack vertically
  const sorted = [...sessions].sort((a, b) => a.startHour - b.startHour);
  const ROW_H = 64; // px per hour
  const totalH = HOURS.length * ROW_H;
  const nowH = now.getHours() + now.getMinutes() / 60;
  const showNow = nowH >= HOUR_START && nowH < HOUR_END;

  // Simple lane assignment (column packing)
  type Laid = Session & { lane: number };
  const laid: Laid[] = [];
  const lanes: number[] = []; // end time per lane
  sorted.forEach((s) => {
    const end = s.startHour + s.durationH;
    let lane = lanes.findIndex((e) => e <= s.startHour);
    if (lane === -1) { lane = lanes.length; lanes.push(end); }
    else lanes[lane] = end;
    laid.push({ ...s, lane });
  });
  const laneCount = Math.max(1, lanes.length);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" /> Today's Timeline
        </h3>
        <p className="text-xs text-muted-foreground">{sessions.length} session{sessions.length === 1 ? "" : "s"}</p>
      </div>
      <div className="relative" style={{ height: totalH }}>
        {/* Hour rows */}
        {HOURS.map((h, i) => (
          <div
            key={h}
            className="absolute left-0 right-0 flex"
            style={{ top: i * ROW_H, height: ROW_H }}
          >
            <div className="w-20 shrink-0 border-r border-border/60 text-[10px] font-mono text-muted-foreground px-3 pt-1.5 tabular-nums">
              {fmtHourLabel(h)}
            </div>
            <div className="flex-1 border-b border-border/40" />
          </div>
        ))}

        {/* Now line */}
        {showNow && (
          <div
            className="absolute left-20 right-0 z-20 pointer-events-none"
            style={{ top: (nowH - HOUR_START) * ROW_H }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive shadow-[0_0_0_3px_hsl(var(--destructive)/0.2)]" />
              <div className="h-px flex-1 bg-destructive" />
            </div>
          </div>
        )}

        {/* Session blocks */}
        <div className="absolute left-20 right-3 top-0 bottom-0">
          {laid.map((s) => {
            const top = (s.startHour - HOUR_START) * ROW_H;
            const height = s.durationH * ROW_H - 6;
            const widthPct = 100 / laneCount;
            const leftPct = s.lane * widthPct;
            const live = sameYMD(new Date(new Date().setDate(new Date().getDate() + s.dayOffset)), new Date()) &&
              nowH >= s.startHour && nowH < s.startHour + s.durationH;
            const c = statusColor(s.batch.status, live);
            return (
              <Link
                key={s.batch.id + s.dayOffset + s.startHour}
                to={`/batches/${s.batch.id}`}
                className={cn(
                  "absolute rounded-xl border border-border/70 overflow-hidden p-2.5 hover:shadow-md transition-all hover:-translate-y-0.5",
                  c.soft
                )}
                style={{ top: top + 3, height, left: `calc(${leftPct}% + 4px)`, width: `calc(${widthPct}% - 8px)` }}
              >
                <div className="flex h-full gap-2">
                  <div className={cn("w-1 rounded-full shrink-0", c.bar)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <p className="text-xs font-semibold leading-tight line-clamp-1">{s.batch.name}</p>
                      {live && (
                        <span className="text-[9px] font-semibold text-success uppercase tracking-wide shrink-0">Live</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.batch.instructors[0]}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-0.5"><Users className="h-2.5 w-2.5" />{s.batch.participants?.length ?? s.batch.seatCount}</span>
                      <span>{fmtTime(s.startHour)} – {fmtTime(s.startHour + s.durationH)}</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function NextUpPanel({ upcoming, now }: { upcoming: Session[]; now: Date }) {
  const nowH = now.getHours() + now.getMinutes() / 60;
  const todaysUpcoming = upcoming.filter((s) => s.dayOffset === 0 && s.startHour > nowH).slice(0, 4);
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Next Up</h3>
      </div>
      {todaysUpcoming.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">No more sessions today.</p>
      ) : (
        <div className="space-y-3">
          {todaysUpcoming.map((s) => {
            const diff = s.startHour - nowH;
            const hrs = Math.floor(diff);
            const mins = Math.round((diff - hrs) * 60);
            const inLabel = hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
            return (
              <Link
                key={s.batch.id + s.startHour}
                to={`/batches/${s.batch.id}`}
                className="block group"
              >
                <p className="text-xs font-mono text-muted-foreground">{fmtTime(s.startHour)}</p>
                <p className="text-sm font-medium group-hover:text-primary truncate">{s.batch.name}</p>
                <p className="text-[11px] text-muted-foreground">Starts in {inLabel}</p>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function MyDayPanel({ sessions, trainer }: { sessions: Session[]; trainer: string | null }) {
  if (!trainer) return null;
  const mine = sessions.filter((s) => s.dayOffset === 0 && s.batch.instructors.includes(trainer)).sort((a, b) => a.startHour - b.startHour);
  const totalStudents = mine.reduce((sum, s) => sum + (s.batch.participants?.length ?? s.batch.seatCount ?? 0), 0);
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">My Day</h3>
        <Badge variant="secondary" className="text-[10px]">{trainer}</Badge>
      </div>
      <div className="space-y-2 mb-3">
        {mine.map((s) => (
          <div key={s.batch.id} className="flex items-center gap-3 text-xs">
            <span className="font-mono tabular-nums text-muted-foreground w-16">{fmtTime(s.startHour)}</span>
            <span className="truncate flex-1">{s.batch.courseName ?? s.batch.name}</span>
          </div>
        ))}
        {mine.length === 0 && <p className="text-xs text-muted-foreground py-2">Nothing today.</p>}
      </div>
      <div className="flex items-center justify-between text-xs pt-3 border-t">
        <span className="text-muted-foreground">{mine.length} session{mine.length === 1 ? "" : "s"}</span>
        <span className="font-semibold">{totalStudents} students</span>
      </div>
    </Card>
  );
}

function WeekView({ sessions, weekStart }: { sessions: Session[]; weekStart: Date }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
  const today = new Date();
  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {days.map((d, i) => {
          const dayOffset = Math.round((d.getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
          const daySessions = sessions.filter((s) => s.dayOffset === dayOffset).sort((a, b) => a.startHour - b.startHour);
          const isToday = sameYMD(d, today);
          return (
            <div key={i} className={cn("rounded-xl border p-2 min-h-[260px]", isToday ? "border-primary/40 bg-primary/[0.03]" : "border-border/70")}>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className={cn("text-[10px] uppercase font-semibold tracking-wider", isToday ? "text-primary" : "text-muted-foreground")}>
                  {d.toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className={cn("text-sm font-bold tabular-nums", isToday ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
              </div>
              <div className="space-y-1.5">
                {daySessions.map((s) => {
                  const c = statusColor(s.batch.status, false);
                  return (
                    <Link
                      key={s.batch.id + s.startHour}
                      to={`/batches/${s.batch.id}`}
                      className={cn("block rounded-lg p-1.5 text-[10px] hover:shadow-sm transition", c.soft, "border border-border/60")}
                    >
                      <p className="font-mono tabular-nums text-muted-foreground">{fmtTime(s.startHour)}</p>
                      <p className="font-semibold leading-tight line-clamp-2 mt-0.5">{s.batch.name}</p>
                    </Link>
                  );
                })}
                {daySessions.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-4">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function MonthView({ sessions, anchor }: { sessions: Session[]; anchor: Date }) {
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const first = new Date(y, m, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const today = new Date();

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <p key={d} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground text-center py-1">{d}</p>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const dayOffset = Math.round((d.getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
          const daySessions = sessions.filter((s) => s.dayOffset === dayOffset);
          const isToday = sameYMD(d, today);
          return (
            <div key={i} className={cn("rounded-lg border p-1.5 min-h-[88px]", isToday ? "border-primary/40 bg-primary/[0.04]" : "border-border/60")}>
              <p className={cn("text-xs font-semibold tabular-nums mb-1", isToday ? "text-primary" : "text-foreground")}>{d.getDate()}</p>
              <div className="space-y-0.5">
                {daySessions.slice(0, 3).map((s) => (
                  <Link key={s.batch.id + s.startHour} to={`/batches/${s.batch.id}`} className="block text-[9px] truncate text-primary hover:underline">
                    • {s.batch.courseName ?? s.batch.name}
                  </Link>
                ))}
                {daySessions.length > 3 && <p className="text-[9px] text-muted-foreground">+{daySessions.length - 3} more</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ───────────────────── page ─────────────────────
export default function Schedule() {
  const batches = useBatchStore((s) => s.batches);
  const [tab, setTab] = useState("today");
  const [search, setSearch] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const today = useMemo(() => new Date(), []);
  const now = today;

  const trainers = useMemo(
    () => Array.from(new Set(batches.flatMap((b) => b.instructors))).sort(),
    [batches]
  );
  const courses = useMemo(
    () => Array.from(new Set(batches.map((b) => b.courseName).filter(Boolean) as string[])).sort(),
    [batches]
  );

  const filtered = useMemo(
    () =>
      batches.filter((b) => {
        if (trainerFilter !== "all" && !b.instructors.includes(trainerFilter)) return false;
        if (courseFilter !== "all" && b.courseName !== courseFilter) return false;
        if (search && !`${b.name} ${b.courseName ?? ""} ${b.instructors.join(" ")}`.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [batches, trainerFilter, courseFilter, search]
  );

  const allSessions = useMemo(() => generateSessions(filtered, today, 40), [filtered, today]);
  const todaySessions = useMemo(() => allSessions.filter((s) => s.dayOffset === 0), [allSessions]);

  const nowH = now.getHours() + now.getMinutes() / 60;
  const liveNow = todaySessions.filter((s) => nowH >= s.startHour && nowH < s.startHour + s.durationH);

  const weekStart = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - d.getDay() + weekOffset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [today, weekOffset]);

  const monthAnchor = useMemo(() => {
    const d = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
    return d;
  }, [today, monthOffset]);

  const meTrainer = trainerFilter !== "all" ? trainerFilter : (trainers[0] ?? null);

  return (
    <div className="space-y-6">
      <PageHeader
        title={today.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        description="Your trainer-first command centre. Live sessions, today's timeline and what's next."
      />

      {/* Filter bar */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search batches…" className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={trainerFilter} onValueChange={setTrainerFilter}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="All Trainers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trainers</SelectItem>
              {trainers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-[200px] h-9"><SelectValue placeholder="All Courses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* TODAY */}
        <TabsContent value="today" className="space-y-5">
          {liveNow.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <h2 className="text-sm font-semibold">Live Now ({liveNow.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {liveNow.map((s) => <LiveNowCard key={s.batch.id + s.startHour} session={s} />)}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            <DayTimeline sessions={todaySessions} now={now} />
            <div className="space-y-4">
              <NextUpPanel upcoming={allSessions} now={now} />
              <MyDayPanel sessions={allSessions} trainer={meTrainer} />
            </div>
          </div>
        </TabsContent>

        {/* WEEK */}
        <TabsContent value="week" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Week of {weekStart.toLocaleDateString(undefined, { day: "numeric", month: "short" })}
            </h2>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setWeekOffset(0)}>This week</Button>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setWeekOffset((w) => w + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <WeekView sessions={allSessions} weekStart={weekStart} />
        </TabsContent>

        {/* MONTH */}
        <TabsContent value="month" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              {monthAnchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setMonthOffset((m) => m - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setMonthOffset(0)}>This month</Button>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => setMonthOffset((m) => m + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          <MonthView sessions={allSessions} anchor={monthAnchor} />
        </TabsContent>

        {/* TIMELINE (full-width focused) */}
        <TabsContent value="timeline">
          <DayTimeline sessions={todaySessions} now={now} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
