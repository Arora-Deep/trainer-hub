import { StatCard } from "@/components/ui/StatCard";
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
  BarChart3,
  CheckCircle2,
  XCircle,
  MoreVertical,
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
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Good morning, John</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your training sessions today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) => (
            action.href ? (
              <Button
                key={action.label}
                variant={action.primary ? "default" : "outline"}
                size="sm"
                asChild
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
      </div>

      {/* Top Stats Row – 3 columns */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Students Card */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 to-primary/5" />
          <div className="flex items-start justify-between mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Students Online
            </p>
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-5xl font-bold tracking-tight tabular-nums">
            142
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              +23.8%
            </span>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold tabular-nums">96</span>
              <div className="flex flex-col">
                <span className="flex items-center gap-1 text-[10px] font-medium text-success">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                  </span>
                  ACTIVE
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-bold tabular-nums text-muted-foreground">46</span>
              <div className="flex flex-col">
                <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                  IDLE
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Labs Card */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-success/40 to-success/5" />
          <div className="flex items-start justify-between mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Lab Utilization
            </p>
            <div className="rounded-xl bg-success/10 p-2.5">
              <FlaskConical className="h-4 w-4 text-success" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-5xl font-bold tracking-tight tabular-nums">
              4.6
            </p>
            <span className="text-lg text-muted-foreground font-medium">/5</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              +0.3
            </span>
            <span className="text-xs text-muted-foreground">points from last week</span>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barCategoryGap="20%">
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--success))" 
                    radius={[3, 3, 0, 0]}
                    opacity={0.6}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Batch Overview */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-warning/40 to-warning/5" />
          <div className="flex items-start justify-between mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Batch Overview
            </p>
            <div className="rounded-xl bg-warning/10 p-2.5">
              <Calendar className="h-4 w-4 text-warning" />
            </div>
          </div>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3 rounded-xl bg-success/5 border border-success/10 p-3 transition-colors hover:bg-success/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15">
                <CheckCircle2 className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Active Batches</p>
                <p className="text-[11px] text-muted-foreground">Currently running</p>
              </div>
              <span className="text-2xl font-bold tabular-nums">12</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-warning/5 border border-warning/10 p-3 transition-colors hover:bg-warning/10">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/15">
                <Calendar className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Upcoming</p>
                <p className="text-[11px] text-muted-foreground">Scheduled this month</p>
              </div>
              <span className="text-2xl font-bold tabular-nums">8</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/50 p-3 transition-colors hover:bg-muted/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60">
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Completed</p>
                <p className="text-[11px] text-muted-foreground">Last 30 days</p>
              </div>
              <span className="text-2xl font-bold tabular-nums">24</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Chart – Full width, prominent like reference */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-info/30 to-transparent" />
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Activity Overview
            </p>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl font-bold tracking-tight tabular-nums">142</span>
              <span className="text-sm text-muted-foreground">Students Today</span>
              <span className="flex items-center gap-1.5 ml-2 text-[11px] font-medium text-success">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                </span>
                Live
              </span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Labs</span>
            </div>
          </div>
        </div>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradLabs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="students"
                name="Students"
                stroke="hsl(211, 100%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradStudents)"
              />
              <Area
                type="monotone"
                dataKey="labs"
                name="Active Labs"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradLabs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Bottom Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Upcoming Batches */}
        <DataCard
          title="Upcoming Batches"
          icon={Calendar}
          action={{ label: "View all", href: "/batches" }}
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Batch</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Trainer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Start</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBatches.map((batch) => (
                <TableRow key={batch.id} className="group">
                  <TableCell>
                    <Link
                      to={`/batches/${batch.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {batch.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{batch.trainer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{batch.startDate}</TableCell>
                  <TableCell className="text-sm text-right tabular-nums font-medium">{batch.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>

        {/* Active Labs */}
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
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Student</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Lab</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLabs.map((lab) => (
                <TableRow key={lab.id}>
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

        {/* Alerts */}
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
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 transition-all duration-200 cursor-pointer"
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

        {/* Course Progress */}
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
