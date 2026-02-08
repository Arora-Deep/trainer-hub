import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Monitor,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Layers,
  Circle,
  Mail,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
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
  CartesianGrid,
} from "recharts";

// --- Mock Data ---
const revenueData = [
  { date: "Feb 14", current: 62000, previous: 58000 },
  { date: "Feb 15", current: 55000, previous: 60000 },
  { date: "Feb 16", current: 68000, previous: 62000 },
  { date: "Feb 17", current: 72000, previous: 65000 },
  { date: "Feb 18", current: 58000, previous: 63000 },
  { date: "Feb 19", current: 64000, previous: 59000 },
  { date: "Feb 22", current: 78000, previous: 67000 },
];

const recentEmails = [
  { name: "Hannah Morgan", subject: "Meeting scheduled", time: "1:34 PM", avatar: "HM" },
  { name: "Megan Clark", subject: "Update on marketing campaign", time: "12:32 PM", avatar: "MC" },
  { name: "Brandon Williams", subject: "Designing 2.0 is about to launch", time: "Yesterday at 8:57 PM", avatar: "BW" },
];

const todoItems = [
  { label: "Run payroll", due: "Mar 4 at 6:00 pm", done: false, icon: CreditCard },
  { label: "Review time off request", due: "Mar 7 at 6:00 pm", done: false, icon: Clock },
  { label: "Sign board resolution", due: "Mar 12 at 6:00 pm", done: false, icon: CheckCircle2 },
  { label: "Finish onboarding Tony", due: "Mar 12 at 6:00 pm", done: false, icon: Users },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-md px-3.5 py-2.5 shadow-xl">
        <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            {entry.name}: <span className="font-bold text-foreground">${(entry.value / 1000).toFixed(0)}K</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Circular icon with dotted border
function CircleIcon({ icon: Icon, color }: { icon: any; color: string }) {
  return (
    <div className="relative flex items-center justify-center w-14 h-14">
      <svg className="absolute inset-0 w-14 h-14" viewBox="0 0 56 56">
        <circle
          cx="28" cy="28" r="25"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity={0.4}
        />
      </svg>
      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${color}12` }}>
        <Icon className="h-4.5 w-4.5" style={{ color }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      {/* Greeting Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting}, James!
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl bg-card border-border/60">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl bg-card border-border/60">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Top Row: Stats + Formation Status */}
      <div className="grid grid-cols-12 gap-5">
        {/* 4 Stat Cards in one unified card */}
        <div className="col-span-8">
          <Card className="p-2">
            <div className="grid grid-cols-4 divide-x divide-border/40">
              {[
                { icon: CreditCard, label: "Your bank balance", value: "$143,624", color: "hsl(var(--foreground))" },
                { icon: Layers, label: "Uncategorised transactions", value: "12", color: "hsl(var(--primary))" },
                { icon: Users, label: "Employees working today", value: "7", color: "hsl(var(--primary))" },
                { icon: Monitor, label: "This week's card spending", value: "$3,287.49", color: "hsl(var(--foreground))" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-4 py-3">
                  <CircleIcon icon={stat.icon} color={stat.color} />
                  <div className="min-w-0">
                    <p className="text-xl font-bold tracking-tight tabular-nums">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Formation/System Status Card */}
        <div className="col-span-4">
          <Card className="p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Formation status</h3>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  In progress
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Estimated processing
              </p>
              <p className="text-sm font-bold mt-0.5">4–6 business days</p>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full text-xs rounded-xl">
              View status
            </Button>
          </Card>
        </div>
      </div>

      {/* Middle Row: Metrics + Chart + ToDo */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left: Two small metric cards */}
        <div className="col-span-3 flex flex-col gap-5">
          {/* New Clients */}
          <Card className="p-5 flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-3">New clients</p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl font-extrabold tracking-tight tabular-nums">54</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                18.7%
              </span>
            </div>
          </Card>

          {/* Invoices Overdue */}
          <Card className="p-5 flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-3">Invoices overdue</p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-4xl font-extrabold tracking-tight tabular-nums">6</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                <TrendingDown className="h-3 w-3" />
                2.7%
              </span>
            </div>
          </Card>
        </div>

        {/* Center: Revenue Chart */}
        <div className="col-span-5">
          <Card className="p-5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Revenue</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-foreground" />
                  <span className="text-[10px] text-muted-foreground">Last 7 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground">Prior week</span>
                </div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
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
                    tickFormatter={(v) => `${v / 1000}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="previous"
                    name="Prior Week"
                    stroke="hsl(var(--muted-foreground) / 0.3)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fillOpacity={0}
                    fill="none"
                    dot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="current"
                    name="This Week"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#gradCurrent)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right: To-Do + Meeting */}
        <div className="col-span-4 flex flex-col gap-5">
          {/* To-Do List */}
          <Card className="p-5 flex-1">
            <h3 className="text-sm font-semibold mb-3">Your to-Do list</h3>
            <div className="space-y-3">
              {todoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-primary/8 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Board Meeting */}
          <Card 
            className="p-5 text-white border-0"
            style={{ background: "var(--gradient-sidebar)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold">Board meeting</h3>
            </div>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Feb 22 at 6:00 PM</span>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              You have been invited to attend a meeting of the Board of Directors.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom: Recent Emails */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Recent emails</h3>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground gap-1 -mr-2">
            View all
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-1">
          {recentEmails.map((email, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                {email.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{email.name}</p>
              </div>
              <p className="text-sm text-muted-foreground truncate flex-1">{email.subject}</p>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{email.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}