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
        breadcrumbs={[{ label: "Dashboard" }]}
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/batches">
                <Plus className="mr-2 h-4 w-4" />
                Create Batch
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/labs">
                <FlaskConical className="mr-2 h-4 w-4" />
                Create Lab
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/course-builder">
                <Hammer className="mr-2 h-4 w-4" />
                Build Course
              </Link>
            </Button>
            <Button variant="outline">
              <Play className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Batches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-medium">Upcoming Batches</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/batches">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.trainer}</TableCell>
                    <TableCell>{batch.startDate}</TableCell>
                    <TableCell className="text-right">{batch.students}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Labs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-medium">Active Labs Right Now</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/labs">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Lab</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Time Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeLabs.map((lab) => (
                  <TableRow key={lab.id}>
                    <TableCell className="font-medium">{lab.student}</TableCell>
                    <TableCell>{lab.lab}</TableCell>
                    <TableCell>
                      <StatusBadge
                        status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                        label={lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                      />
                    </TableCell>
                    <TableCell className="text-right">{lab.timeRemaining}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Alerts & Issues */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Alerts & Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border border-border p-3"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      alert.type === "error"
                        ? "bg-destructive"
                        : alert.type === "warning"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-medium">Course Progress Overview</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseProgress.map((course, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{course.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{course.students} students enrolled</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}