import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataCard } from "@/components/ui/DataCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
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

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in-up">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-border/50"
        style={{ 
          background: "var(--gradient-primary-soft)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-primary">Welcome back</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Good morning, John! 👋
          </h1>
          <p className="text-muted-foreground text-base max-w-xl">
            Here's what's happening with your training sessions today. You have 3 batches scheduled and 4 active labs running.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
      </div>

      {/* Stats Row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Students Online"
          value={142}
          icon={Users}
          description="Across all batches"
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Labs"
          value={38}
          icon={FlaskConical}
          description="Running right now"
          variant="success"
        />
        <StatCard
          title="Upcoming Batches"
          value={8}
          icon={Calendar}
          description="This month"
          variant="info"
        />
        <StatCard
          title="Active Alerts"
          value={3}
          icon={AlertTriangle}
          description="Needs attention"
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <CardContent className="py-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5 mr-2">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary-soft)" }}
              >
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Quick actions</span>
            </div>
            {quickActions.map((action) => (
              action.href ? (
                <Button 
                  key={action.label}
                  variant={action.primary ? "default" : "outline"} 
                  size="sm"
                  className={action.primary ? "btn-gradient rounded-xl" : "rounded-xl hover:border-primary/30"}
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Link>
                </Button>
              ) : (
                <Button 
                  key={action.label}
                  variant="outline" 
                  size="sm"
                  className="rounded-xl hover:border-primary/30"
                >
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Button>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Batches */}
        <DataCard 
          title="Upcoming Batches" 
          icon={Calendar}
          action={{ label: "View all", href: "/batches" }}
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Batch Name</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Trainer</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Start Date</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBatches.map((batch) => (
                <TableRow key={batch.id} className="table-row-premium border-b border-border/30 last:border-0">
                  <TableCell>
                    <Link 
                      to={`/batches/${batch.id}`} 
                      className="font-medium hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                      {batch.name}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{batch.startDate}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {batch.students}
                    </span>
                  </TableCell>
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
            <span className="flex items-center gap-1.5 text-xs text-success font-semibold px-2 py-1 rounded-full bg-success/10">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          }
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Student</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Lab</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLabs.map((lab) => (
                <TableRow key={lab.id} className="table-row-premium border-b border-border/30 last:border-0">
                  <TableCell className="font-medium">{lab.student}</TableCell>
                  <TableCell className="text-muted-foreground">{lab.lab}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                      label={lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                      pulse={lab.status === "running"}
                    />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {lab.timeRemaining}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>

        {/* Alerts & Issues */}
        <DataCard 
          title="Alerts & Issues"
          icon={AlertTriangle}
          badge={
            <span className="rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-semibold text-destructive">
              {alerts.length} new
            </span>
          }
        >
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-xl border border-border/50 p-4 hover:bg-muted/30 hover:border-border transition-all cursor-pointer group"
              >
                <div className="mt-0.5 shrink-0">
                  <span
                    className={`flex h-2.5 w-2.5 rounded-full ${
                      alert.type === "error"
                        ? "bg-destructive"
                        : alert.type === "warning"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug font-medium group-hover:text-primary transition-colors">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </DataCard>

        {/* Course Progress */}
        <DataCard 
          title="Course Progress"
          icon={TrendingUp}
          action={{ label: "View all", href: "/courses" }}
        >
          <div className="space-y-6">
            {courseProgress.map((course, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-xl p-2.5" style={{ background: "var(--gradient-primary-soft)" }}>
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold truncate block">{course.name}</span>
                      <span className="text-xs text-muted-foreground">{course.students} students</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-foreground">{course.progress}%</span>
                </div>
                <ProgressBar 
                  value={course.progress} 
                  size="default"
                  variant={course.progress >= 80 ? "success" : course.progress >= 50 ? "primary" : "warning"}
                  animated
                />
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
