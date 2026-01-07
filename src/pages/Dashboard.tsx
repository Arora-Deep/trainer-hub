import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
  ArrowRight,
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

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back, John! Here's what's happening with your training sessions."
        breadcrumbs={[{ label: "Statistics" }]}
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Students Online"
          value={142}
          icon={Users}
          description="Across all batches"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Active Labs"
          value={38}
          icon={FlaskConical}
          description="Running right now"
        />
        <StatCard
          title="Upcoming Batches"
          value={8}
          icon={Calendar}
          description="This month"
        />
        <StatCard
          title="Active Alerts"
          value={3}
          icon={AlertTriangle}
          description="Needs attention"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link to="/batches">
              <Plus className="mr-2 h-4 w-4" />
              Create Batch
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/labs">
              <FlaskConical className="mr-2 h-4 w-4" />
              Create Lab
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/course-builder">
              <Hammer className="mr-2 h-4 w-4" />
              Build Course
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Play className="mr-2 h-4 w-4" />
            Start Session
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Batches */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-medium">Upcoming Batches</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/batches" className="text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Batch Name</TableHead>
                <TableHead className="text-xs">Trainer</TableHead>
                <TableHead className="text-xs">Start Date</TableHead>
                <TableHead className="text-xs text-right">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium text-sm">{batch.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{batch.trainer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{batch.startDate}</TableCell>
                  <TableCell className="text-sm text-right">{batch.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Active Labs */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-medium">Active Labs Right Now</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/labs" className="text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Student</TableHead>
                <TableHead className="text-xs">Lab</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Time Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeLabs.map((lab) => (
                <TableRow key={lab.id}>
                  <TableCell className="font-medium text-sm">{lab.student}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lab.lab}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                      label={lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-right text-muted-foreground">{lab.timeRemaining}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Alerts & Issues */}
        <div className="rounded-lg border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium">Alerts & Issues</h3>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    alert.type === "error"
                      ? "bg-red-500"
                      : alert.type === "warning"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Course Progress */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-sm font-medium">Course Progress Overview</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses" className="text-muted-foreground hover:text-foreground">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="p-4 space-y-4">
            {courseProgress.map((course, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{course.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{course.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-foreground transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{course.students} students enrolled</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
