import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Users, PlayCircle, CheckCircle2, Search, Clock, Plus, Trash2 } from "lucide-react";
import { useBatchStore, type Batch } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const statusToBadge = (s: Batch["status"]) =>
  s === "live" ? "success" : s === "upcoming" ? "warning" : "default";

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const within = (date: Date, start: Date, end: Date) => date >= start && date <= end;

export default function Schedule() {
  const batches = useBatchStore((s) => s.batches);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [trainerFilter, setTrainerFilter] = useState<string>("all");
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const trainers = useMemo(
    () => Array.from(new Set(batches.flatMap((b) => b.instructors))),
    [batches]
  );

  const filtered = useMemo(
    () =>
      batches.filter((b) => {
        if (statusFilter !== "all" && b.status !== statusFilter) return false;
        if (trainerFilter !== "all" && !b.instructors.includes(trainerFilter)) return false;
        if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [batches, statusFilter, trainerFilter, search]
  );

  const counts = useMemo(
    () => ({
      upcoming: filtered.filter((b) => b.status === "upcoming").length,
      live: filtered.filter((b) => b.status === "live").length,
      completed: filtered.filter((b) => b.status === "completed").length,
      total: filtered.length,
    }),
    [filtered]
  );

  const batchesOnDay = (day: Date) =>
    filtered.filter((b) => within(day, new Date(b.startDate), new Date(b.endDate)));

  // Timeline range: min start to max end across filtered
  const { minDate, maxDate } = useMemo(() => {
    if (!filtered.length) {
      const t = new Date();
      return { minDate: t, maxDate: t };
    }
    const starts = filtered.map((b) => new Date(b.startDate).getTime());
    const ends = filtered.map((b) => new Date(b.endDate).getTime());
    return { minDate: new Date(Math.min(...starts)), maxDate: new Date(Math.max(...ends)) };
  }, [filtered]);

  const span = Math.max(1, (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule"
        description="All batches at a glance — calendar, timeline and kanban views."
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Batches" value={counts.total} icon={CalendarDays} size="compact" />
        <StatCard title="Upcoming" value={counts.upcoming} icon={CalendarDays} size="compact" />
        <StatCard title="Live Now" value={counts.live} icon={PlayCircle} size="compact" />
        <StatCard title="Completed" value={counts.completed} icon={CheckCircle2} size="compact" />
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search batches…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={trainerFilter} onValueChange={setTrainerFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trainers</SelectItem>
              {trainers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => { setSelectedDay(new Date()); setDrawerOpen(true); }}>
            Today
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="free">Free Time</TabsTrigger>
        </TabsList>

        {/* CALENDAR */}
        <TabsContent value="calendar">
          <Card className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
              <Calendar
                mode="single"
                selected={selectedDay}
                onSelect={(d) => { setSelectedDay(d); if (d) setDrawerOpen(true); }}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasBatch: (date) => batchesOnDay(date).length > 0,
                }}
                modifiersClassNames={{
                  hasBatch: "bg-primary/10 font-semibold text-primary",
                }}
              />
              <div>
                <h3 className="text-sm font-semibold mb-3">Active this week</h3>
                <div className="space-y-2">
                  {filtered
                    .filter((b) => {
                      const wkStart = new Date();
                      wkStart.setHours(0, 0, 0, 0);
                      const wkEnd = new Date(wkStart);
                      wkEnd.setDate(wkEnd.getDate() + 7);
                      return new Date(b.startDate) <= wkEnd && new Date(b.endDate) >= wkStart;
                    })
                    .slice(0, 8)
                    .map((b) => (
                      <Link
                        key={b.id}
                        to={`/batches/${b.id}`}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/40 transition"
                      >
                        <div>
                          <div className="text-sm font-medium">{b.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {b.instructors.join(", ")} • {b.startDate} → {b.endDate}
                          </div>
                        </div>
                        <StatusBadge status={statusToBadge(b.status)} label={b.status} size="sm" />
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TIMELINE */}
        <TabsContent value="timeline">
          <Card className="p-4 overflow-x-auto">
            <div className="text-xs text-muted-foreground mb-3">
              {minDate.toDateString()} — {maxDate.toDateString()}
            </div>
            <div className="space-y-2 min-w-[700px]">
              {filtered.map((b) => {
                const start = new Date(b.startDate);
                const end = new Date(b.endDate);
                const left = ((start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / span) * 100;
                const width = Math.max(2, ((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) / span) * 100);
                const color =
                  b.status === "live" ? "bg-success/80" : b.status === "upcoming" ? "bg-warning/80" : "bg-muted-foreground/40";
                return (
                  <Link
                    key={b.id}
                    to={`/batches/${b.id}`}
                    className="grid grid-cols-[200px_1fr] gap-3 items-center group"
                  >
                    <div className="text-xs truncate">
                      <div className="font-medium truncate">{b.name}</div>
                      <div className="text-muted-foreground truncate">{b.instructors[0]}</div>
                    </div>
                    <div className="relative h-7 bg-muted/40 rounded-md">
                      <div
                        className={cn("absolute top-1 bottom-1 rounded-md transition group-hover:opacity-100 opacity-90", color)}
                        style={{ left: `${left}%`, width: `${width}%` }}
                        title={`${b.startDate} → ${b.endDate}`}
                      />
                    </div>
                  </Link>
                );
              })}
              {!filtered.length && <div className="text-sm text-muted-foreground py-8 text-center">No batches match.</div>}
            </div>
          </Card>
        </TabsContent>

        {/* KANBAN */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {(["upcoming", "live", "completed"] as const).map((status) => {
              const items = filtered.filter((b) => b.status === status);
              return (
                <Card key={status} className="p-3">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold capitalize">{status}</h3>
                    <span className="text-xs text-muted-foreground">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((b) => (
                      <Link
                        key={b.id}
                        to={`/batches/${b.id}`}
                        className="block p-3 rounded-lg border hover:bg-muted/40 transition"
                      >
                        <div className="text-sm font-medium mb-1">{b.name}</div>
                        <div className="text-xs text-muted-foreground mb-2">{b.courseName}</div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" /> {b.participants?.length ?? 0}/{b.seatCount}
                          </span>
                          <StatusBadge status={statusToBadge(status)} label={status} size="sm" />
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-2">
                          {b.startDate} → {b.endDate}
                        </div>
                      </Link>
                    ))}
                    {!items.length && <div className="text-xs text-muted-foreground py-6 text-center">None</div>}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-[420px]">
          <SheetHeader>
            <SheetTitle>{selectedDay?.toDateString()}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {selectedDay && batchesOnDay(selectedDay).map((b) => (
              <Link
                key={b.id}
                to={`/batches/${b.id}`}
                className="block p-3 rounded-lg border hover:bg-muted/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">{b.name}</div>
                  <StatusBadge status={statusToBadge(b.status)} label={b.status} size="sm" />
                </div>
                <div className="text-xs text-muted-foreground">{b.instructors.join(", ")}</div>
              </Link>
            ))}
            {selectedDay && batchesOnDay(selectedDay).length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">No batches active on this day.</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
