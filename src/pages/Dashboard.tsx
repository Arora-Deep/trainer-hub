import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FlaskConical,
  Calendar,
  AlertTriangle,
  Plus,
  Play,
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const upcomingBatches = [
  { id: 1, name: "AWS Solutions Architect", startDate: "Jan 15", students: 24 },
  { id: 2, name: "Kubernetes Fundamentals", startDate: "Jan 18", students: 18 },
  { id: 3, name: "Docker Masterclass", startDate: "Jan 22", students: 30 },
];

const activeLabs = [
  { id: 1, student: "Alice Johnson", lab: "AWS EC2 Setup", status: "running", time: "45m" },
  { id: 2, student: "Bob Williams", lab: "Kubernetes Pod", status: "idle", time: "30m" },
  { id: 3, student: "Carol Davis", lab: "Docker Compose", status: "error", time: "15m" },
];

const alerts = [
  { id: 1, type: "error", message: "Lab VM offline for Carol Davis", time: "5m ago" },
  { id: 2, type: "warning", message: "High resource usage in AWS batch", time: "12m ago" },
];

const courseProgress = [
  { name: "AWS Solutions Architect", progress: 75, students: 24 },
  { name: "Kubernetes Fundamentals", progress: 45, students: 18 },
  { name: "Docker Masterclass", progress: 90, students: 30 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in-up">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your training overview."
        breadcrumbs={[{ label: "Dashboard" }]}
      />

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Students Online", value: "142", change: "+12%", icon: Users, color: "text-primary" },
          { label: "Active Labs", value: "38", icon: FlaskConical, color: "text-success" },
          { label: "Upcoming Batches", value: "8", icon: Calendar, color: "text-info" },
          { label: "Active Alerts", value: "3", icon: AlertTriangle, color: "text-warning" },
        ].map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                    {stat.change && (
                      <span className="flex items-center text-xs font-medium text-success">
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`rounded-xl bg-muted/50 p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/batches">
            <Plus className="mr-2 h-4 w-4" />
            Create Batch
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/labs">
            <FlaskConical className="mr-2 h-4 w-4" />
            New Lab
          </Link>
        </Button>
        <Button variant="outline">
          <Play className="mr-2 h-4 w-4" />
          Start Session
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Batches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Upcoming Batches</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/batches">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {upcomingBatches.map((batch) => (
                  <Link
                    key={batch.id}
                    to={`/batches/${batch.id}`}
                    className="flex items-center justify-between p-3 -mx-1 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{batch.name}</p>
                        <p className="text-xs text-muted-foreground">Starts {batch.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{batch.students} students</span>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Course Progress</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/courses">
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-5">
                {courseProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{course.name}</span>
                      <span className="text-sm font-semibold tabular-nums">{course.progress}%</span>
                    </div>
                    <ProgressBar 
                      value={course.progress} 
                      size="sm"
                      variant={course.progress >= 80 ? "success" : "primary"}
                    />
                    <p className="text-xs text-muted-foreground">{course.students} students</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Active Labs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Active Labs</CardTitle>
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/labs">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {activeLabs.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between py-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{lab.student}</p>
                      <p className="text-xs text-muted-foreground truncate">{lab.lab}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <StatusBadge
                        status={lab.status === "running" ? "success" : lab.status === "idle" ? "warning" : "error"}
                        label={lab.status}
                        size="sm"
                        pulse={lab.status === "running"}
                      />
                      <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lab.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">Alerts</CardTitle>
                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  {alerts.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 -mx-1 rounded-lg bg-muted/30"
                  >
                    <span
                      className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        alert.type === "error" ? "bg-destructive" : "bg-warning"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
