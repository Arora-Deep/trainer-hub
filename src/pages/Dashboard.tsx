import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  FlaskConical,
  Calendar,
  AlertTriangle,
  Plus,
  Play,
  Hammer,
  Clock,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  DollarSign,
  Monitor,
  CheckCircle2,
  Circle,
  ArrowRight,
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

/* ── mock data ─────────────────────────────── */

const revenueData = [
  { date: "Feb 14", current: 62000, prior: 55000 },
  { date: "Feb 15", current: 58000, prior: 60000 },
  { date: "Feb 17", current: 72000, prior: 58000 },
  { date: "Feb 19", current: 65000, prior: 62000 },
  { date: "Feb 21", current: 80000, prior: 68000 },
  { date: "Feb 23", current: 75000, prior: 72000 },
];

const todoItems = [
  { id: 1, task: "Provision VMs for AWS batch", due: "star 4 at 6:00 pm", done: false },
  { id: 2, task: "Review lab template request", due: "star 7 at 6:00 pm", done: false },
  { id: 3, task: "Configure K8s cluster access", due: "star 10 at 6:00 pm", done: false },
  { id: 4, task: "Finish onboarding new trainer", due: "star 12 at 6:00 pm", done: false },
];

const recentActivity = [
  { id: 1, name: "Alice Johnson", action: "Lab provisioned", time: "1:34 PM", avatar: "Alice" },
  { id: 2, name: "Bob Williams", action: "Batch enrollment complete", time: "12:32 PM", avatar: "Bob" },
  { id: 3, name: "Carol Davis", action: "VM template submitted", time: "Yesterday at 8:57 PM", avatar: "Carol" },
];

const formationSteps = [
  { label: "Batch Created", done: true },
  { label: "VMs Configured", done: true },
  { label: "Trainer VM Ready", done: true },
  { label: "Student VMs Cloned", done: false },
  { label: "Go Live", done: false },
];

/* ── custom tooltip ─────────────────────────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-semibold text-foreground">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ── dotted-border icon component ──────────── */

function DottedIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center h-12 w-12 ${className || ""}`}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 48 48">
        <circle
          cx="24" cy="24" r="22"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>
      {children}
    </div>
  );
}

/* ── dashboard ──────────────────────────────── */

export default function Dashboard() {
  const currentStep = formationSteps.filter(s => s.done).length;

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex items-end justify-between pt-1">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-foreground">
            Good morning, John!
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Top Stats Row (unified card like Dappr) ─────── */}
      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-4 divide-x divide-border">
          {[
            { icon: <Users className="h-5 w-5 text-primary" />, value: "142", label: "Students online", prefix: "" },
            { icon: <AlertTriangle className="h-5 w-5 text-coral" />, value: "12", label: "Unresolved alerts", prefix: "" },
            { icon: <Monitor className="h-5 w-5 text-primary" />, value: "7", label: "VMs running today", prefix: "" },
            { icon: <DollarSign className="h-5 w-5 text-success" />, value: "$3,287.49", label: "This week's VM spend", prefix: "" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <DottedIcon>{stat.icon}</DottedIcon>
              <div>
                <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
                  {stat.prefix}{stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
              {i === 0 && (
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-muted-foreground">
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ── Main Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5">

        {/* Left Column (span 3) */}
        <div className="col-span-3 space-y-5">
          {/* New Students */}
          <Card className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">New students</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">54</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="h-3 w-3" />
                +18.7%
              </span>
            </div>
          </Card>

          {/* VM Alerts */}
          <Card className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">VM alerts overdue</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">6</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-coral">
                <TrendingDown className="h-3 w-3" />
                +2.7%
              </span>
            </div>
          </Card>
        </div>

        {/* Center Column - Revenue/Activity Chart (span 5) */}
        <div className="col-span-5">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-foreground">Activity</p>
              <span className="text-[11px] text-muted-foreground">Last 7 days VS prior week</span>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(174, 62%, 40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradPrior" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220, 25%, 12%)" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="hsl(220, 25%, 12%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name="This week"
                    stroke="hsl(174, 62%, 40%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradCurrent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="prior"
                    name="Prior week"
                    stroke="hsl(220, 25%, 40%)"
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    fillOpacity={1}
                    fill="url(#gradPrior)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column (span 4) */}
        <div className="col-span-4 space-y-5">
          {/* Formation Status */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Batch Status</p>
              <StatusBadge status="info" label="In progress" size="sm" />
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-0 mb-4">
              {formationSteps.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${
                    step.done ? "bg-primary" : "bg-border"
                  }`} />
                  {i < formationSteps.length - 1 && (
                    <div className={`h-0.5 w-8 flex-shrink-0 ${
                      formationSteps[i + 1]?.done ? "bg-primary" : "bg-border"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              Estimated processing <span className="font-semibold text-foreground">4-6 business days</span>
            </p>
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
              View status
            </Button>
          </Card>
        </div>
      </div>

      {/* ── Bottom Grid ────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5">

        {/* To-Do List (span 4) */}
        <div className="col-span-4">
          <Card className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4">Your to-Do list</p>
            <div className="space-y-3">
              {todoItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-1.5 flex h-2 w-2 shrink-0 rounded-full bg-coral" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <p className="text-[11px] text-muted-foreground">{item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity (span 5) */}
        <div className="col-span-5">
          <Card className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4">Recent activity</p>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {item.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.action}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Next Training Session - Dark card (span 3) */}
        <div className="col-span-3">
          <div className="rounded-2xl bg-sidebar p-5 h-full flex flex-col justify-between" style={{ boxShadow: "var(--shadow-elevated)" }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-sidebar-foreground/60" />
                <span className="text-[11px] font-medium text-sidebar-foreground/60">Next session</span>
              </div>
              <p className="text-lg font-bold text-sidebar-accent-foreground mb-1">
                Feb 22 at 6:00 PM
              </p>
              <p className="text-xs text-sidebar-foreground/60 leading-relaxed">
                You have been invited to attend a training review for the AWS batch.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4 w-full rounded-xl text-xs border-sidebar-foreground/20 text-sidebar-accent-foreground hover:bg-sidebar-accent"
            >
              View details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
