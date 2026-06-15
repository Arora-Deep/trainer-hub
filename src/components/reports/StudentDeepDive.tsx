import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useProgressStore } from "@/stores/progressStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { useMemo } from "react";
import { format } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId?: string;
  studentName?: string;
  batchId?: string;
}

export function StudentDeepDive({ open, onOpenChange, studentId, studentName, batchId }: Props) {
  const allProgress = useProgressStore((s) => s.items);
  const meetings = useMeetingStore((s) => s.meetings);

  const items = useMemo(
    () => allProgress.filter((i) => i.studentId === studentId && (!batchId || i.batchId === batchId)),
    [allProgress, studentId, batchId]
  );

  const completion = useMemo(() => {
    if (!items.length) return 0;
    const done = items.filter((i) => i.status === "graded" || i.status === "submitted").length;
    return Math.round((done / items.length) * 100);
  }, [items]);

  const attendanceRows = useMemo(() => {
    const rows: { meetingId: string; meetingTitle: string; date: string; status: string; presentPct: number }[] = [];
    for (const m of meetings) {
      if (batchId && m.batchId !== batchId) continue;
      const att = m.attendance.find((a) => a.studentId === studentId);
      if (att) rows.push({ meetingId: m.id, meetingTitle: m.title, date: m.scheduledAt, status: att.status, presentPct: att.presentPct });
    }
    return rows.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [meetings, studentId, batchId]);

  const engagementRows = useMemo(() => {
    const rows: { meetingTitle: string; date: string; score: number; tier: string }[] = [];
    for (const m of meetings) {
      if (batchId && m.batchId !== batchId) continue;
      const e = m.engagement.find((x) => x.studentId === studentId);
      if (e) rows.push({ meetingTitle: m.title, date: m.scheduledAt, score: e.score, tier: e.tier });
    }
    return rows.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [meetings, studentId, batchId]);

  const byType = (t: string) => items.filter((i) => i.itemType === t);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{studentName || "Student"}</SheetTitle>
          <SheetDescription>Cross-portal performance snapshot.</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-5">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assess">Assessments</TabsTrigger>
            <TabsTrigger value="att">Attendance</TabsTrigger>
            <TabsTrigger value="eng">Engagement</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-3">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course completion</span>
                  <span className="text-2xl font-bold tabular-nums">{completion}%</span>
                </div>
                <Progress value={completion} className="h-2" />
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Assessments done", value: byType("quiz").concat(byType("assignment"), byType("exercise")).filter((i) => i.status === "graded").length },
                { label: "Sessions attended", value: attendanceRows.filter((r) => r.status === "present" || r.status === "late").length },
                { label: "Avg engagement", value: engagementRows.length ? `${Math.round(engagementRows.reduce((a, b) => a + b.score, 0) / engagementRows.length)}%` : "—" },
              ].map((s) => (
                <Card key={s.label}><CardContent className="py-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-semibold mt-0.5">{s.value}</p>
                </CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assess" className="mt-4 space-y-2">
            {[...byType("quiz"), ...byType("assignment"), ...byType("exercise")].map((i) => (
              <Card key={i.id}><CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{i.itemTitle}</p>
                  <Badge variant="outline" className="text-[10px] capitalize mt-1">{i.itemType}</Badge>
                </div>
                <div className="text-right">
                  {i.score !== undefined && <span className="text-sm font-semibold tabular-nums">{i.score}/{i.maxScore}</span>}
                  <Badge variant="secondary" className="ml-2 text-[10px] capitalize">{i.status.replace("_", " ")}</Badge>
                </div>
              </CardContent></Card>
            ))}
          </TabsContent>

          <TabsContent value="att" className="mt-4 space-y-2">
            {attendanceRows.map((r) => (
              <Card key={r.meetingId}><CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.meetingTitle}</p>
                  <p className="text-[11px] text-muted-foreground">{format(new Date(r.date), "MMM d, h:mm a")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{r.status}</Badge>
                  <span className="text-sm tabular-nums">{r.presentPct}%</span>
                </div>
              </CardContent></Card>
            ))}
            {attendanceRows.length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No attendance recorded.</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="eng" className="mt-4 space-y-2">
            {engagementRows.map((r) => (
              <Card key={r.meetingTitle + r.date}><CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.meetingTitle}</p>
                  <p className="text-[11px] text-muted-foreground">{format(new Date(r.date), "MMM d")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{r.tier}</Badge>
                  <span className="text-sm font-semibold tabular-nums">{r.score}</span>
                </div>
              </CardContent></Card>
            ))}
            {engagementRows.length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No engagement data.</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="labs" className="mt-4 space-y-2">
            {byType("lab").map((i) => (
              <Card key={i.id}><CardContent className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{i.itemTitle}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {i.lastActivityAt ? `Last activity ${format(new Date(i.lastActivityAt), "MMM d")}` : "Not started"}
                  </p>
                </div>
                <Badge variant="secondary" className="text-[10px] capitalize">{i.status.replace("_", " ")}</Badge>
              </CardContent></Card>
            ))}
            {byType("lab").length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No labs assigned.</CardContent></Card>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
