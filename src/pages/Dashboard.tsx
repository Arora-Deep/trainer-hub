import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-6">
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
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">Quick actions:</span>
            {quickActions.map((action) => (
              action.href ? (
                <Button 
                  key={action.label}
                  variant={action.primary ? "default" : "outline"} 
                  size="sm"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Upcoming Batches</CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/batches">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border overflow-hidden">
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
                    <TableRow key={batch.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                      <TableCell className="text-muted-foreground">{batch.startDate}</TableCell>
                      <TableCell className="text-right tabular-nums">{batch.students}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Active Labs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Active Labs</CardTitle>
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/labs">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg border border-border overflow-hidden">
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
                    <TableRow key={lab.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{lab.student}</TableCell>
                      <TableCell className="text-muted-foreground">{lab.lab}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                          label={lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                        />
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {lab.timeRemaining}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Issues */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Alerts & Issues</CardTitle>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                {alerts.length} new
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div
                    className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                      alert.type === "error"
                        ? "bg-destructive"
                        : alert.type === "warning"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Course Progress</CardTitle>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/courses">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-5">
              {courseProgress.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="rounded-lg bg-primary/10 p-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium truncate">{course.name}</span>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{course.students} students enrolled</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
