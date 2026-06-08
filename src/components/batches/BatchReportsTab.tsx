import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users, CheckCircle2, Clock, Award, TrendingUp, Activity, Download,
  Calendar, Gauge, Trophy, AlertTriangle, BookOpen, FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";
import type { Batch } from "@/stores/batchStore";

const COLORS = ["hsl(var(--primary))", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export function BatchReportsTab({ batch }: { batch: Batch }) {
  const stats = useMemo(() => {
    const total = batch.participants.length || 1;
    const scores = batch.participants.map((p) => p.quizScore).filter((s): s is number => typeof s === "number");
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const attRates = batch.participants.map((p) =>
      p.attendance.total ? (p.attendance.present / p.attendance.total) * 100 : 0
    );
    const avgAttendance = attRates.length
      ? Math.round(attRates.reduce((a, b) => a + b, 0) / attRates.length)
      : 0;
    const completed = batch.participants.filter((p) => (p.quizScore ?? 0) >= 70).length;
    const completionRate = Math.round((completed / total) * 100);
    const atRisk = batch.participants.filter(
      (p) => (p.quizScore ?? 0) < 60 || (p.attendance.total && p.attendance.present / p.attendance.total < 0.6)
    ).length;
    const labHours = (batch.assignedLabs ?? []).reduce(
      (sum, l) => sum + (l.completions ?? 0) * (parseInt(l.duration) || 60),
      0
    );
    return { avgScore, avgAttendance, completionRate, atRisk, labHours, completed, total: batch.participants.length };
  }, [batch]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "90-100", count: 0 },
      { range: "80-89", count: 0 },
      { range: "70-79", count: 0 },
      { range: "60-69", count: 0 },
      { range: "<60", count: 0 },
    ];
    batch.participants.forEach((p) => {
      const s = p.quizScore ?? 0;
      if (s >= 90) buckets[0].count++;
      else if (s >= 80) buckets[1].count++;
      else if (s >= 70) buckets[2].count++;
      else if (s >= 60) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [batch]);

  const attendanceTrend = useMemo(
    () => [
      { week: "W1", attendance: 96 },
      { week: "W2", attendance: 92 },
      { week: "W3", attendance: 89 },
      { week: "W4", attendance: stats.avgAttendance },
    ],
    [stats.avgAttendance]
  );

  const moduleProgress = useMemo(() => {
    const mods: Record<string, number> = {};
    batch.participants.forEach((p) => {
      const m = p.currentModule || "Not Started";
      mods[m] = (mods[m] ?? 0) + 1;
    });
    return Object.entries(mods).map(([name, value]) => ({ name, value }));
  }, [batch]);

  const labUsage = useMemo(
    () =>
      (batch.assignedLabs ?? []).map((l) => ({
        name: l.name,
        completions: l.completions ?? 0,
        hours: Math.round(((l.completions ?? 0) * (parseInt(l.duration) || 60)) / 60),
      })),
    [batch]
  );

  const topPerformers = useMemo(
    () =>
      [...batch.participants]
        .filter((p) => typeof p.quizScore === "number")
        .sort((a, b) => (b.quizScore ?? 0) - (a.quizScore ?? 0))
        .slice(0, 5),
    [batch]
  );

  const exportReport = (name: string) => toast.success(`${name} report exported (demo)`);

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard size="compact" title="Participants" value={stats.total} icon={Users} />
        <StatCard size="compact" title="Avg Score" value={`${stats.avgScore}%`} icon={Gauge} />
        <StatCard size="compact" title="Attendance" value={`${stats.avgAttendance}%`} icon={Calendar} />
        <StatCard size="compact" title="Completion" value={`${stats.completionRate}%`} icon={CheckCircle2} />
        <StatCard size="compact" title="Lab Hours" value={`${Math.round(stats.labHours / 60)}h`} icon={Clock} />
        <StatCard size="compact" title="At Risk" value={stats.atRisk} icon={AlertTriangle} />
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Score Distribution</CardTitle>
              <CardDescription>Quiz & assessment score buckets</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportReport("Score Distribution")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Attendance Trend</CardTitle>
              <CardDescription>Weekly attendance percentage</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportReport("Attendance")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="attendance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Module Progress</CardTitle>
              <CardDescription>Where participants are right now</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportReport("Module Progress")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            {moduleProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={moduleProgress} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {moduleProgress.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Lab Usage</CardTitle>
              <CardDescription>Time spent in assigned labs</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportReport("Lab Usage")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            {labUsage.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">No labs assigned.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={labUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="hours" fill="#22c55e" radius={[0, 6, 6, 0]} name="Hours" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top performers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Top Performers
            </CardTitle>
            <CardDescription>Leaderboard by quiz score</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => exportReport("Top Performers")}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </CardHeader>
        <CardContent>
          {topPerformers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No scores yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((p, i) => {
                  const att = p.attendance.total
                    ? Math.round((p.attendance.present / p.attendance.total) * 100)
                    : 0;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">{p.currentModule}</TableCell>
                      <TableCell className="w-40">
                        <div className="flex items-center gap-2">
                          <Progress value={att} className="h-1.5" />
                          <span className="text-xs text-muted-foreground w-9">{att}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-mono">
                          {p.quizScore}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Exportable reports list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Reports</CardTitle>
          <CardDescription>Download detailed CSV / PDF reports for this batch</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {[
            { name: "Attendance Register", desc: "Per-session attendance with timestamps", icon: Calendar },
            { name: "Assessment Scores", desc: "All quiz and assignment scores", icon: Award },
            { name: "Lab Usage Time", desc: "Time spent per lab per participant", icon: Clock },
            { name: "Course Completion", desc: "Module-wise completion percentages", icon: CheckCircle2 },
            { name: "Engagement Report", desc: "Logins, video watch %, forum activity", icon: Activity },
            { name: "Certification Eligibility", desc: "Who qualifies for certificate", icon: Award },
            { name: "At-Risk Learners", desc: "Low scores or attendance below 60%", icon: AlertTriangle },
            { name: "Trainer Activity Log", desc: "Live sessions delivered, materials shared", icon: BookOpen },
            { name: "VM Utilization", desc: "VM uptime, snapshots, resource usage", icon: Gauge },
            { name: "Discussion / Q&A", desc: "Forum questions, replies, resolution time", icon: FileText },
          ].map((r) => (
            <div key={r.name} className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5">
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <r.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => exportReport(r.name)}>
                <Download className="h-3.5 w-3.5" /> CSV
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
