import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  FlaskConical,
  Calendar,
  Plus,
  Play,
  Hammer,
  Clock,
  TrendingUp,
  Monitor,
  MoreHorizontal,
  ArrowUpRight,
  CheckCircle2,
  Link2,
  Activity,
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
  Line,
  ComposedChart,
} from "recharts";

// --- Mock Data ---
const weeklyStats = [
  { day: "M", vms: 42, trend: 38 },
  { day: "T", vms: 58, trend: 52 },
  { day: "W", vms: 45, trend: 48 },
  { day: "T", vms: 72, trend: 60 },
  { day: "F", vms: 85, trend: 70 },
  { day: "S", vms: 32, trend: 35 },
  { day: "S", vms: 18, trend: 22 },
];

const activityData = [
  { time: "9AM", students: 32, vms: 18 },
  { time: "10AM", students: 55, vms: 28 },
  { time: "11AM", students: 48, vms: 32 },
  { time: "12PM", students: 78, vms: 45 },
  { time: "1PM", students: 65, vms: 38 },
  { time: "2PM", students: 98, vms: 55 },
  { time: "3PM", students: 120, vms: 68 },
  { time: "4PM", students: 142, vms: 85 },
  { time: "5PM", students: 118, vms: 72 },
];

const recentBatches = [
  { id: 1, name: "AWS Solutions Architect", type: "Cloud", count: "7.2k", change: "+4%", avatar: "🏗️" },
  { id: 2, name: "Kubernetes Fundamentals", type: "DevOps", count: "3.8k", change: "+5%", avatar: "⚓" },
  { id: 3, name: "Docker Masterclass", type: "Container", count: "2.4k", change: "+6%", avatar: "🐳" },
  { id: 4, name: "Terraform Automation", type: "IaC", count: "1.6k", change: "+8%", avatar: "🔧" },
];

const quickActions = [
  { label: "Create Batch", icon: Plus, href: "/batches/create", primary: true },
  { label: "Create Lab", icon: FlaskConical, href: "/labs/create" },
  { label: "Build Course", icon: Hammer, href: "/course-builder" },
  { label: "Start Session", icon: Play },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-semibold text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Donut segment component
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const size = 120;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {segments.map((seg, i) => {
          const dashLength = (seg.value / total) * circumference;
          const dashOffset = -offset;
          offset += dashLength;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Monitor className="h-5 w-5 text-coral" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Training platform overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) =>
            action.href ? (
              <Button
                key={action.label}
                variant={action.primary ? "default" : "outline"}
                size="sm"
                className={action.primary ? "bg-coral hover:bg-coral-dark text-white" : ""}
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
          )}
        </div>
      </div>

      {/* Top Row – Asymmetric grid like screenshot */}
      <div className="grid gap-4 grid-cols-12">
        {/* Hero Card – Coral gradient, Students Online */}
        <Card className="col-span-5 p-6 relative overflow-hidden border-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--coral)) 0%, hsl(var(--coral-light)) 100%)",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-white/80">Total Students</p>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/10">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-5xl font-bold tracking-tight tabular-nums text-white mt-2">
              23,847
            </p>
            {/* Mini sparkline area */}
            <div className="h-16 mt-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth={2}
                    fill="url(#gradHero)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Sub metrics */}
            <div className="flex items-center gap-8 mt-3">
              <div className="text-center">
                <p className="text-xs text-white/60">Active</p>
                <p className="text-lg font-bold text-white tabular-nums">%68</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60">In Labs</p>
                <p className="text-lg font-bold text-white tabular-nums">%22</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60">Idle</p>
                <p className="text-lg font-bold text-white tabular-nums">%10</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Active VMs Card – with donut chart */}
        <Card className="col-span-4 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active VMs</p>
              <p className="text-4xl font-bold tracking-tight tabular-nums mt-2">
                142
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <DonutChart
              segments={[
                { value: 80, color: "hsl(var(--coral))", label: "Running" },
                { value: 20, color: "hsl(var(--warning))", label: "Idle" },
              ]}
            />
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-coral" />
                <span className="text-xs text-muted-foreground">Running</span>
                <span className="ml-auto text-sm font-semibold tabular-nums">%80</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="text-xs text-muted-foreground">Idle</span>
                <span className="ml-auto text-sm font-semibold tabular-nums">%20</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right column – Two stacked compact cards */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Active Batches */}
          <Card className="p-5 flex-1">
            <div className="flex items-start gap-3">
              <div className="text-3xl font-bold tabular-nums text-coral">12</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Active Batches</p>
                <div className="h-1.5 rounded-full bg-muted mt-2 overflow-hidden">
                  <div className="h-full rounded-full bg-coral" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </Card>

          {/* VM Stats – mini bar chart with line */}
          <Card className="p-5 flex-1">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium">VM Stats</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weeklyStats} margin={{ top: 2, right: 2, left: 2, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar dataKey="vms" fill="hsl(var(--muted))" radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar dataKey="trend" fill="hsl(var(--coral))" radius={[3, 3, 0, 0]} barSize={4} />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Middle Row – Activity list + Side metrics */}
      <div className="grid gap-4 grid-cols-12">
        {/* Batch Activity – Post Activity style list */}
        <Card className="col-span-8 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-semibold">Batch Activity</h2>
              <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted">Recent</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1" asChild>
              <Link to="/batches">
                View All
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
          <div className="space-y-1">
            {recentBatches.map((batch) => (
              <Link
                key={batch.id}
                to={`/batches/${batch.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-lg">
                  {batch.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-coral transition-colors">
                    {batch.name}
                  </p>
                  <p className="text-xs text-muted-foreground">Batch #{batch.id}</p>
                </div>
                <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
                  {batch.type}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium tabular-nums">{batch.count}</span>
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    {batch.change}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </Card>

        {/* Right side metrics */}
        <div className="col-span-4 flex flex-col gap-4">
          {/* Completed Sessions */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Completed Sessions</p>
                <p className="text-sm text-muted-foreground mt-0.5">This Week</p>
              </div>
              <span className="text-3xl font-bold tabular-nums">874</span>
            </div>
          </Card>

          {/* Total VMs Provisioned */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-coral/10">
                <Monitor className="h-5 w-5 text-coral" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">VMs Provisioned</p>
              </div>
              <span className="text-3xl font-bold tabular-nums">10.4k</span>
            </div>
          </Card>

          {/* Uptime */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Platform Uptime</p>
              </div>
              <span className="text-3xl font-bold tabular-nums">99.9%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-semibold">Activity Overview</p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold tracking-tight tabular-nums">142</span>
              <span className="text-xs text-muted-foreground">Active Now</span>
              <span className="flex items-center gap-1.5 ml-1 text-[11px] font-medium text-success">
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
              <span className="h-2 w-2 rounded-full bg-coral" />
              <span className="text-xs text-muted-foreground">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">VMs</span>
            </div>
          </div>
        </div>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--coral))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--coral))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVMs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                stroke="hsl(var(--coral))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradStudents)"
              />
              <Area
                type="monotone"
                dataKey="vms"
                name="VMs"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#gradVMs)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
