import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  { time: "00:00", students: 12, labs: 8 },
  { time: "04:00", students: 8, labs: 5 },
  { time: "08:00", students: 45, labs: 28 },
  { time: "12:00", students: 78, labs: 45 },
  { time: "16:00", students: 142, labs: 85 },
  { time: "20:00", students: 98, labs: 62 },
  { time: "Now", students: 142, labs: 38 },
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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Good morning, John</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your training sessions today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Students Online" value={142} icon={Users} description="Across all batches" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Active Labs" value={38} icon={FlaskConical} description="Running right now" />
        <StatCard title="Upcoming Batches" value={8} icon={Calendar} description="This month" />
        <StatCard title="Active Alerts" value={3} icon={AlertTriangle} description="Needs attention" />
      </div>

      {/* Activity Chart */}
      <DataCard
        title="Activity Overview"
        icon={BarChart3}
        badge={
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
        }
      >
        <div className="h-56 mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLabs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="students"
                name="Students"
                stroke="hsl(211, 100%, 50%)"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorStudents)"
              />
              <Area
                type="monotone"
                dataKey="labs"
                name="Active Labs"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorLabs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Students Online</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Active Labs</span>
          </div>
        </div>
      </DataCard>

      {/* Content Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
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
                className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors cursor-pointer"
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
