import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Calendar, Download, Mail, TrendingUp, Users } from "lucide-react";
import { useProgressStore, type ProgressItem } from "@/stores/progressStore";
import { exportToCsv } from "@/lib/exportCsv";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { StudentProgressDrawer } from "./StudentProgressDrawer";

const statusColor: Record<string, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-500/10 text-amber-600",
  submitted: "bg-blue-500/10 text-blue-600",
  graded: "bg-green-500/10 text-green-600",
};

interface ProgressRollupTabProps {
  batchId: string;
  batchName: string;
}

export function ProgressRollupTab({ batchId, batchName }: ProgressRollupTabProps) {
  const items = useProgressStore((s) => s.forBatch(batchId));
  const dueWeek = useProgressStore((s) => s.dueThisWeek(batchId));
  const atRisk = useProgressStore((s) => s.atRiskStudents(batchId));

  const [openStudent, setOpenStudent] = useState<{ id: string; name: string } | null>(null);

  const students = useMemo(() => {
    const map = new Map<string, { id: string; name: string; total: number; done: number; lastActivity: string }>();
    for (const i of items) {
      const cur = map.get(i.studentId) || { id: i.studentId, name: i.studentName, total: 0, done: 0, lastActivity: "" };
      cur.total += 1;
      if (i.status === "graded" || i.status === "submitted") cur.done += 1;
      if (i.lastActivityAt && (!cur.lastActivity || +new Date(i.lastActivityAt) > +new Date(cur.lastActivity))) {
        cur.lastActivity = i.lastActivityAt;
      }
      map.set(i.studentId, cur);
    }
    return Array.from(map.values()).map((s) => ({
      ...s,
      completion: s.total ? Math.round((s.done / s.total) * 100) : 0,
      atRisk: atRisk.some((a) => a.studentId === s.id),
    }));
  }, [items, atRisk]);

  // Group "due this week" by item
  const dueByItem = useMemo(() => {
    const map = new Map<string, { itemId: string; itemTitle: string; itemType: string; dueAt?: string; total: number; submitted: number; graded: number }>();
    for (const i of dueWeek) {
      const cur = map.get(i.itemId) || {
        itemId: i.itemId, itemTitle: i.itemTitle, itemType: i.itemType, dueAt: i.dueAt, total: 0, submitted: 0, graded: 0,
      };
      cur.total += 1;
      if (i.status === "submitted") cur.submitted += 1;
      if (i.status === "graded") cur.graded += 1;
      map.set(i.itemId, cur);
    }
    return Array.from(map.values()).sort((a, b) => +new Date(a.dueAt || 0) - +new Date(b.dueAt || 0));
  }, [dueWeek]);

  const handleExportStudents = () => {
    exportToCsv(`progress-${batchName}-${new Date().toISOString().slice(0, 10)}.csv`, students, [
      { key: "name", label: "Student" },
      { key: "completion", label: "Completion %" },
      { key: "done", label: "Submitted" },
      { key: "total", label: "Total items" },
      { key: "lastActivity", label: "Last activity" },
      { key: "atRisk", label: "At risk" },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Students", value: students.length, Icon: Users, tone: "text-primary" },
          { label: "Due this week", value: dueByItem.length, Icon: Calendar, tone: "text-amber-600" },
          { label: "At risk", value: atRisk.length, Icon: AlertTriangle, tone: "text-destructive" },
          {
            label: "Avg completion",
            value: students.length
              ? `${Math.round(students.reduce((a, b) => a + b.completion, 0) / students.length)}%`
              : "—",
            Icon: TrendingUp, tone: "text-green-600",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                <s.Icon className={`h-3.5 w-3.5 ${s.tone}`} />
              </div>
              <div className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="week">This week</TabsTrigger>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="mt-4">
          <Card>
            {dueByItem.length === 0 ? (
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Nothing due in the next 7 days.
              </CardContent>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Submission rate</TableHead>
                    <TableHead className="text-right">To grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dueByItem.map((i) => {
                    const subPct = i.total ? Math.round(((i.submitted + i.graded) / i.total) * 100) : 0;
                    return (
                      <TableRow key={i.itemId}>
                        <TableCell className="font-medium text-sm">{i.itemTitle}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] capitalize">{i.itemType}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {i.dueAt ? format(new Date(i.dueAt), "EEE, MMM d") : "—"}
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div className="flex items-center gap-2">
                            <Progress value={subPct} className="h-1.5" />
                            <span className="text-xs text-muted-foreground tabular-nums">{subPct}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {i.submitted > 0 ? (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600">{i.submitted}</Badge>
                          ) : (
                            <span className="text-muted-foreground">0</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-4 space-y-3">
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Reminders sent", description: `Nudged ${atRisk.length} at-risk students.` })}>
              <Mail className="h-3.5 w-3.5 mr-1.5" /> Nudge at-risk
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportStudents}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
            </Button>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead>Last activity</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className={s.atRisk ? "bg-destructive/5" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{s.name}</span>
                        {s.atRisk && <Badge variant="destructive" className="text-[9px]">At risk</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="w-[260px]">
                      <div className="flex items-center gap-2">
                        <Progress value={s.completion} className="h-1.5" />
                        <span className="text-xs text-muted-foreground tabular-nums w-10">{s.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{s.done}/{s.total}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.lastActivity ? format(new Date(s.lastActivity), "MMM d, h:mm a") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => setOpenStudent({ id: s.id, name: s.name })}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      No participants yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <StudentProgressDrawer
        open={!!openStudent}
        onOpenChange={(o) => !o && setOpenStudent(null)}
        batchId={batchId}
        studentId={openStudent?.id}
        studentName={openStudent?.name}
      />
    </div>
  );
}
