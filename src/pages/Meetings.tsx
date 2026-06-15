import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Video, Plus, Radio, Calendar as CalendarIcon, FileVideo, Search, X,
} from "lucide-react";
import { useMeetingStore, Meeting, MeetingKind, MeetingStatus } from "@/stores/meetingStore";
import { useBatchStore } from "@/stores/batchStore";
import { useTrainerStore } from "@/stores/trainerStore";
import { BBB_INTEGRATION_STATUS } from "@/lib/bbbConfig";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { ScheduleMeetingDrawer } from "@/components/meetings/ScheduleMeetingDrawer";
import { OfficeHoursSlotsTab } from "@/components/meetings/OfficeHoursSlotsTab";
import { Link } from "react-router-dom";

export default function Meetings() {
  const meetings = useMeetingStore((s) => s.meetings);
  const batches = useBatchStore((s) => s.batches);
  const trainers = useTrainerStore((s) => s.trainers);

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<MeetingKind | "all">("all");
  const [status, setStatus] = useState<MeetingStatus | "all">("all");
  const [batch, setBatch] = useState<string>("all");
  const [trainer, setTrainer] = useState<string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  const filtered = useMemo(() => meetings.filter((m) => {
    if (q && !m.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (kind !== "all" && m.kind !== kind) return false;
    if (status !== "all" && m.status !== status) return false;
    if (batch !== "all" && m.batchId !== batch) return false;
    if (trainer !== "all" && m.trainerId !== trainer) return false;
    return true;
  }), [meetings, q, kind, status, batch, trainer]);

  const live = filtered.filter((m) => m.status === "live");
  const upcoming = filtered.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = filtered.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));
  const unassigned = filtered.filter((m) => !m.batchId);

  const totalRecordings = meetings.reduce((s, m) => s + m.recordings.length, 0);

  const clearFilters = () => { setQ(""); setKind("all"); setStatus("all"); setBatch("all"); setTrainer("all"); };
  const hasFilters = q || kind !== "all" || status !== "all" || batch !== "all" || trainer !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description="Schedule and run live training sessions. Powered by BigBlueButton."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status="warning" label={`BBB ${BBB_INTEGRATION_STATUS}`} size="sm" />
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Schedule meeting
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Live now" value={meetings.filter(m => m.status === "live").length} icon={Radio} size="compact" />
        <StatCard title="Upcoming" value={meetings.filter(m => m.status === "scheduled").length} icon={CalendarIcon} size="compact" />
        <StatCard title="Past sessions" value={meetings.filter(m => m.status === "ended").length} icon={Video} size="compact" />
        <StatCard title="Recordings" value={totalRecordings} icon={FileVideo} size="compact" />
      </div>

      <Card className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search meetings…" className="pl-8 h-9" />
          </div>
          <Select value={kind} onValueChange={(v) => setKind(v as any)}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              <SelectItem value="batch-session">Batch sessions</SelectItem>
              <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
              <SelectItem value="office-hours">Office hours</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={batch} onValueChange={setBatch}>
            <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All batches</SelectItem>
              {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={trainer} onValueChange={setTrainer}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trainers</SelectItem>
              {trainers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}><X className="h-3.5 w-3.5 mr-1" /> Clear</Button>
          )}
          <div className="ml-auto">
            <Tabs value={view} onValueChange={(v) => setView(v as any)}>
              <TabsList>
                <TabsTrigger value="list" className="text-xs">List</TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs">Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </Card>

      {view === "list" && (
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            <TabsTrigger value="unassigned">Unassigned ({unassigned.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {live.map(m => <MeetingCard key={m.id} m={m} />)}
            {!live.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">No live meetings right now.</Card>}
          </TabsContent>
          <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {upcoming.map(m => <MeetingCard key={m.id} m={m} />)}
            {!upcoming.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">Nothing scheduled.</Card>}
          </TabsContent>
          <TabsContent value="past" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {past.map(m => <MeetingCard key={m.id} m={m} />)}
            {!past.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">No past meetings yet.</Card>}
          </TabsContent>
          <TabsContent value="unassigned" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {unassigned.map(m => <MeetingCard key={m.id} m={m} showBatch={false} />)}
            {!unassigned.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">All meetings are attached to a batch.</Card>}
          </TabsContent>
        </Tabs>
      )}

      {view === "calendar" && <CalendarView meetings={filtered} />}

      <ScheduleMeetingDrawer open={open} onOpenChange={setOpen} />
    </div>
  );
}

function CalendarView({ meetings }: { meetings: Meeting[] }) {
  const [cursor, setCursor] = useState(new Date());
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);

  const byDay: Record<string, Meeting[]> = {};
  meetings.forEach(m => {
    const d = new Date(m.scheduledAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    (byDay[key] ||= []).push(m);
  });

  const today = new Date();
  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold">{monthLabel}</div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</Button>
          <Button size="sm" variant="outline" onClick={() => setCursor(new Date())}>Today</Button>
          <Button size="sm" variant="outline" onClick={() => setCursor(new Date(year, month + 1, 1))}>›</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="text-center py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} className="aspect-square" />;
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          const events = byDay[key] || [];
          const isToday = d.toDateString() === today.toDateString();
          return (
            <div key={i} className={`min-h-[80px] rounded-lg border p-1.5 text-[10px] ${isToday ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className={`text-right text-xs mb-1 ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{d.getDate()}</div>
              <div className="space-y-0.5">
                {events.slice(0, 3).map(m => (
                  <Link key={m.id} to={`/meetings/${m.id}`} className={`block truncate px-1 py-0.5 rounded ${
                    m.status === "live" ? "bg-destructive/15 text-destructive" :
                    m.status === "ended" ? "bg-muted text-muted-foreground" :
                    "bg-primary/15 text-primary"
                  }`}>
                    {new Date(m.scheduledAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })} · {m.title}
                  </Link>
                ))}
                {events.length > 3 && <div className="text-muted-foreground">+{events.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
