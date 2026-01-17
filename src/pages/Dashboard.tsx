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
  { label: "Create Batch", icon: Plus, href: "/batches", primary: true },
  { label: "Create Lab", icon: FlaskConical, href: "/labs" },
  { label: "Build Course", icon: Hammer, href: "/course-builder" },
  { label: "Start Session", icon: Play },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Dashboard"
        description="Welcome back, John! Here's what's happening with your training sessions."
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      <Card className="border-dashed bg-muted/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 mr-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Quick actions</span>
            </div>
            {quickActions.map((action) => (
              action.href ? (
                <Button 
                  key={action.label}
                  variant={action.primary ? "default" : "outline"} 
                  size="sm"
                  className={action.primary ? "shadow-md" : ""}
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
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-medium">Batch Name</TableHead>
                <TableHead className="font-medium">Trainer</TableHead>
                <TableHead className="font-medium">Start Date</TableHead>
                <TableHead className="font-medium text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBatches.map((batch) => (
                <TableRow key={batch.id} className="table-row-premium">
                  <TableCell>
                    <Link to={`/batches/${batch.id}`} className="font-medium hover:text-primary transition-colors">
                      {batch.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{batch.startDate}</TableCell>
                  <TableCell className="text-right tabular-nums font-medium">{batch.students}</TableCell>
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
            <span className="flex items-center gap-1.5 text-xs text-success font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Live
            </span>
          }
          noPadding
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="font-medium">Student</TableHead>
                <TableHead className="font-medium">Lab</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium text-right">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLabs.map((lab) => (
                <TableRow key={lab.id} className="table-row-premium">
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
                      <Clock className="h-3 w-3" />
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
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
              {alerts.length} new
            </span>
          }
        >
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-xl border border-border p-3 hover:bg-muted/30 hover:border-border/80 transition-all cursor-pointer interactive"
              >
                <div className="mt-0.5 shrink-0">
                  <span
                    className={`flex h-2 w-2 rounded-full ${
                      alert.type === "error"
                        ? "bg-destructive"
                        : alert.type === "warning"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
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
          <div className="space-y-5">
            {courseProgress.map((course, index) => (
              <div key={index} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate">{course.name}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{course.progress}%</span>
                </div>
                <ProgressBar 
                  value={course.progress} 
                  size="default"
                  variant={course.progress >= 80 ? "success" : course.progress >= 50 ? "primary" : "warning"}
                />
                <p className="text-xs text-muted-foreground">{course.students} students enrolled</p>
              </div>
            ))}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
