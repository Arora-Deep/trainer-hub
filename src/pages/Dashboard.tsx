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
  Activity,
  Zap,
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
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl">
        <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-bold text-foreground">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Donut chart
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const size = 130;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.4}
        />
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
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Monitor className="h-5 w-5 text-coral mb-0.5" />
        <span className="text-[10px] font-semibold text-muted-foreground">VMs</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Training platform overview — Real-time metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          {quickActions.map((action) =>
            action.href ? (
              <Button
                key={action.label}
                variant={action.primary ? "coral" : "outline"}
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
          )}
        </div>
      </div>

      {/* Top Row */}
      <div className="grid gap-5 grid-cols-12">
        {/* Hero Card — Coral gradient */}
        <div className="col-span-5 rounded-2xl p-6 relative overflow-hidden shimmer-overlay"
          style={{
            background: "var(--gradient-coral)",
            boxShadow: "0 8px 32px hsl(var(--coral) / 0.25), 0 2px 8px hsl(var(--coral) / 0.1)",
          }}
        >
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/15 backdrop-blur-sm">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-semibold text-white/90">Total Students</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10 rounded-lg">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-5xl font-extrabold tracking-tight tabular-nums text-white mt-3">
              23,847
            </p>
            {/* Sparkline */}
            <div className="h-16 mt-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradHero" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={2}
                    fill="url(#gradHero)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Sub metrics */}
            <div className="flex items-center gap-6 mt-3">
              {[
                { label: "Active", value: "68%" },
                { label: "In Labs", value: "22%" },
                { label: "Idle", value: "10%" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-[11px] text-white/50 font-medium">{m.label}</p>
                  <p className="text-lg font-bold text-white tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active VMs Card */}
        <Card className="col-span-4 p-6 hover:shadow-[var(--shadow-card-hover)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="icon-container-coral p-2">
                  <Zap className="h-4 w-4 text-coral" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground">Active VMs</p>
              </div>
              <p className="text-4xl font-extrabold tracking-tight tabular-nums mt-3">
                142
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-6 mt-5">
            <DonutChart
              segments={[
                { value: 80, color: "hsl(var(--coral))", label: "Running" },
                { value: 20, color: "hsl(var(--warning))", label: "Idle" },
              ]}
            />
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--gradient-coral)" }} />
                <span className="text-xs font-medium text-muted-foreground">Running</span>
                <span className="ml-auto text-sm font-bold tabular-nums">80%</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-xs font-medium text-muted-foreground">Idle</span>
                <span className="ml-auto text-sm font-bold tabular-nums">20%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right stacked cards */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* Active Batches */}
          <Card className="p-5 flex-1 hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-start gap-3">
              <div className="text-3xl font-extrabold tabular-nums text-gradient-coral">12</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Active Batches</p>
                <div className="h-2 rounded-full bg-muted mt-3 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "75%", background: "var(--gradient-coral)" }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">75% capacity</p>
              </div>
            </div>
          </Card>

          {/* VM Stats */}
          <Card className="p-5 flex-1 hover:shadow-[var(--shadow-card-hover)]">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold">VM Stats</p>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground rounded-lg">
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
                  <Bar dataKey="vms" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} barSize={14} />
                  <Bar dataKey="trend" fill="hsl(var(--coral))" radius={[4, 4, 0, 0]} barSize={4} />
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

      {/* Middle Row */}
      <div className="grid gap-5 grid-cols-12">
        {/* Batch Activity */}
        <Card className="col-span-8 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold">Batch Activity</h2>
              <span className="text-[10px] font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-muted/80">Recent</span>
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
                className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted/80 text-lg group-hover:scale-105 transition-transform">
                  {batch.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-coral transition-colors">
                    {batch.name}
                  </p>
                  <p className="text-xs text-muted-foreground/70">Batch #{batch.id}</p>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-muted/80">
                  {batch.type}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-bold tabular-nums">{batch.count}</span>
                  </div>
                  <span className="text-xs font-semibold text-success flex items-center gap-0.5 bg-success/8 px-1.5 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3" />
                    {batch.change}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 rounded-lg">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </Link>
            ))}
          </div>
        </Card>

        {/* Right metrics */}
        <div className="col-span-4 flex flex-col gap-5">
          {[
            { label: "Completed Sessions", sublabel: "This Week", value: "874", icon: CheckCircle2, iconClass: "text-success", containerClass: "icon-container-success" },
            { label: "VMs Provisioned", sublabel: "All Time", value: "10.4k", icon: Monitor, iconClass: "text-coral", containerClass: "icon-container-coral" },
            { label: "Platform Uptime", sublabel: "30 Days", value: "99.9%", icon: Activity, iconClass: "text-primary", containerClass: "icon-container-primary" },
          ].map((metric) => (
            <Card key={metric.label} className="p-5 hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-center gap-3.5">
                <div className={`${metric.containerClass} p-2.5`}>
                  <metric.icon className={`h-5 w-5 ${metric.iconClass}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{metric.sublabel}</p>
                </div>
                <span className="text-2xl font-extrabold tabular-nums">{metric.value}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm font-bold">Activity Overview</p>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="text-3xl font-extrabold tracking-tight tabular-nums">142</span>
              <span className="text-xs text-muted-foreground font-medium">Active Now</span>
              <span className="flex items-center gap-1.5 ml-1 text-[11px] font-semibold text-success bg-success/8 px-2 py-0.5 rounded-full">
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
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--gradient-coral)" }} />
              <span className="text-xs font-medium text-muted-foreground">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-muted-foreground">VMs</span>
            </div>
          </div>
        </div>
        <div className="h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--coral))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--coral))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradVMs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.12} />
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
                strokeWidth={2.5}
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
