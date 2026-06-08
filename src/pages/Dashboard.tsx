import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  FlaskConical,
  Calendar,
  AlertTriangle,
  Plus,
  Play,
  Hammer,
  BookOpen,
  Clock,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  ArrowUp,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const upcomingBatches = [
  { id: 1, name: "AWS Solutions Architect", course: "AWS SA Pro", trainer: "John Smith", startDate: "Jan 15, 2024", students: 24 },
  { id: 2, name: "Kubernetes Fundamentals", course: "K8s Basics", trainer: "Jane Doe", startDate: "Jan 18, 2024", students: 18 },
  { id: 3, name: "Docker Masterclass", course: "Docker Pro", trainer: "Mike Johnson", startDate: "Jan 22, 2024", students: 30 },
];

const activeLabs = [
  { id: 1, student: "Alice Johnson", lab: "AWS EC2 Setup", status: "running", timeRemaining: "45 min" },
  { id: 2, student: "Bob Williams", lab: "Kubernetes Pod", status: "idle", timeRemaining: "30 min" },
  { id: 3, student: "Carol Davis", lab: "Docker Compose", status: "error", timeRemaining: "15 min" },
  { id: 4, student: "David Brown", lab: "Terraform Basics", status: "running", timeRemaining: "60 min" },
];

const alerts = [
  { id: 1, type: "error", message: "Lab VM offline for student Carol Davis", time: "5 min ago" },
  { id: 2, type: "warning", message: "High resource usage in AWS batch", time: "12 min ago" },
  { id: 3, type: "info", message: "New support ticket from Mike Chen", time: "25 min ago" },
];

const courseProgress = [
  { name: "AWS Solutions Architect", progress: 75, students: 24 },
  { name: "Kubernetes Fundamentals", progress: 45, students: 18 },
  { name: "Docker Masterclass", progress: 90, students: 30 },
];

const quickActions = [
  { label: "Create Batch", icon: Plus, href: "/batches/create", primary: true },
  { label: "Create Lab", icon: FlaskConical, href: "/labs/create" },
  { label: "Build Course", icon: Hammer, href: "/course-builder" },
  { label: "Start Session", icon: Play },
];

const activityData = [
  { time: "9:00AM", students: 32, labs: 18 },
  { time: "10:00AM", students: 55, labs: 28 },
  { time: "11:00AM", students: 48, labs: 32 },
  { time: "12:00PM", students: 78, labs: 45 },
  { time: "1:00PM", students: 65, labs: 38 },
  { time: "2:00PM", students: 98, labs: 55 },
  { time: "3:00PM", students: 120, labs: 68 },
  { time: "4:00PM", students: 142, labs: 85 },
  { time: "5:00PM", students: 118, labs: 72 },
  { time: "6:00PM", students: 95, labs: 58 },
];

const weeklyData = [
  { day: "S", value: 42 },
  { day: "M", value: 78 },
  { day: "T", value: 65 },
  { day: "W", value: 90 },
  { day: "T", value: 82 },
  { day: "F", value: 110 },
  { day: "S", value: 55 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-sm px-3 py-2 shadow-lg">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs text-muted-foreground capitalize">{entry.name}</span>
            </div>
            <span className="text-xs font-semibold tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ duration: 0.35 }} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight leading-none">Good morning, John</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Overview of your active training ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((action) => (
            action.href ? (
              <Button
                key={action.label}
                variant={action.primary ? "default" : "outline"}
                size="sm"
                asChild
                className={action.primary ? "shadow-sm shadow-primary/20" : ""}
              >
                <Link to={action.href}>
                  <action.icon className="mr-1.5 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button key={action.label} variant="outline" size="sm">
                <action.icon className="mr-1.5 h-4 w-4" />
                {action.label}
              </Button>
            )
          ))}
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Students Online */}
        <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.05 }}>
          <Card className="p-6 group hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Students Online
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-baseline gap-3">
              <p className="text-[44px] font-bold tracking-tight tabular-nums leading-none">142</p>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                <ArrowUp className="h-3 w-3" />
                23.8%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">vs. last week</p>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                <span className="text-sm font-semibold tabular-nums">96</span>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                <span className="text-sm font-semibold tabular-nums">46</span>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Idle</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lab Utilization */}
        <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
          <Card className="p-6 group hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <FlaskConical className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Lab Utilization
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-baseline gap-3">
              <div className="flex items-baseline gap-1">
                <p className="text-[44px] font-bold tracking-tight tabular-nums leading-none">4.6</p>
                <span className="text-lg text-muted-foreground/60 font-medium">/5</span>
              </div>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                <ArrowUp className="h-3 w-3" />
                0.3
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">points from last week</p>

            <div className="mt-6 pt-4 border-t border-border/60">
              <div className="h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} barCategoryGap="24%">
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Batch Overview */}
        <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.15 }}>
          <Card className="p-6 group hover:border-primary/20 hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-300">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Batch Overview
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { icon: CheckCircle2, label: "Active", desc: "Running now", value: 12, tone: "success" },
                { icon: Calendar, label: "Upcoming", desc: "This month", value: 8, tone: "warning" },
                { icon: XCircle, label: "Completed", desc: "Last 30 days", value: 24, tone: "muted" },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-lg -mx-2 px-2 py-1.5 hover:bg-muted/40 transition-colors">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg shrink-0",
                      row.tone === "success" && "bg-success/10 text-success",
                      row.tone === "warning" && "bg-warning/10 text-warning",
                      row.tone === "muted" && "bg-muted text-muted-foreground"
                    )}
                  >
                    <row.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{row.label} Batches</p>
                    <p className="text-[11px] text-muted-foreground">{row.desc}</p>
                  </div>
                  <span className="text-xl font-bold tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity Chart */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Activity Overview
              </p>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-[36px] font-bold tracking-tight tabular-nums leading-none">142</span>
                <span className="text-sm text-muted-foreground">Students today</span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  Live
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-4 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[11px] font-medium text-muted-foreground">Students</span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-[11px] font-medium text-muted-foreground">Labs</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradLabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  dy={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "3 3" }} />
                <Area
                  type="monotone"
                  dataKey="students"
                  name="Students"
                  stroke="hsl(211, 100%, 50%)"
                  strokeWidth={2.25}
                  fillOpacity={1}
                  fill="url(#gradStudents)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                />
                <Area
                  type="monotone"
                  dataKey="labs"
                  name="Labs"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#gradLabs)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <DataCard
          title="Upcoming Batches"
          icon={Calendar}
          action={{ label: "View all", href: "/batches" }}
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Batch</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Trainer</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Start</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBatches.map((batch) => (
                <TableRow key={batch.id} className="group border-border/60">
                  <TableCell>
                    <Link
                      to={`/batches/${batch.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      {batch.name}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{batch.trainer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{batch.startDate}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums font-semibold">{batch.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>

        <DataCard
          title="Active Labs"
          icon={FlaskConical}
          action={{ label: "View all", href: "/labs" }}
          badge={
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live
            </span>
          }
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/60">
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Student</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Lab</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground text-right">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLabs.map((lab) => (
                <TableRow key={lab.id} className="border-border/60">
                  <TableCell className="text-sm font-medium">{lab.student}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lab.lab}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                      label={lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                      pulse={lab.status === "running"}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-right tabular-nums text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {lab.timeRemaining}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>

        <DataCard
          title="Alerts"
          icon={AlertTriangle}
          badge={
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
              {alerts.length} new
            </span>
          }
        >
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-xl border border-border/60 p-3 hover:bg-muted/40 hover:border-border transition-all cursor-pointer"
              >
                <span
                  className={`mt-1.5 flex h-2 w-2 shrink-0 rounded-full ${
                    alert.type === "error"
                      ? "bg-destructive"
                      : alert.type === "warning"
                      ? "bg-warning"
                      : "bg-info"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </DataCard>

        <DataCard title="Course Progress" icon={TrendingUp} action={{ label: "View all", href: "/courses" }}>
          <div className="space-y-5">
            {courseProgress.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.students} students</p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{course.progress}%</span>
                </div>
                <ProgressBar
                  value={course.progress}
                  size="default"
                  variant={course.progress >= 80 ? "success" : course.progress >= 50 ? "primary" : "warning"}
                />
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
