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
  ChevronLeft,
  ChevronRight,
  X,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  { name: "Hannah Morgan", subject: "Meeting scheduled", time: "1:34 PM", avatar: "HM", color: "hsl(350 70% 55%)" },
  { name: "Megan Clark", subject: "Update on marketing campaign", time: "12:32 PM", avatar: "MC", color: "hsl(260 60% 55%)" },
  { name: "Brandon Williams", subject: "Designing 2.0 is about to launch", time: "Yesterday at 8:57 PM", avatar: "BW", color: "hsl(200 65% 50%)" },
];

const todoItems = [
  { label: "Run payroll", due: "Mar 4 at 6:00 pm" },
  { label: "Review time off request", due: "Mar 7 at 6:00 pm" },
  { label: "Sign board resolution", due: "Mar 12 at 6:00 pm" },
  { label: "Finish onboarding Tony", due: "Mar 12 at 6:00 pm" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-md px-3 py-2 shadow-lg">
        <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[11px] text-muted-foreground">
            {entry.name}: <span className="font-bold text-foreground">${(entry.value / 1000).toFixed(0)}K</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Circular icon with dotted border — matches reference exactly
function CircleIcon({ icon: Icon }: { icon: any }) {
  return (
    <div className="relative flex items-center justify-center w-[52px] h-[52px] flex-shrink-0">
      <svg className="absolute inset-0 w-[52px] h-[52px]" viewBox="0 0 52 52">
        <circle
          cx="26" cy="26" r="23"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
          strokeDasharray="3.5 3"
        />
      </svg>
      <Icon className="h-5 w-5 text-foreground/70" />
    </div>
  );
}

// Progress stepper for Formation Status
function ProgressStepper() {
  return (
    <div className="flex items-center gap-0 my-4">
      {/* Completed dot */}
      <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
      <div className="flex-1 h-px bg-foreground" />
      {/* Current dot */}
      <div className="w-3 h-3 rounded-full border-2 border-foreground bg-card" />
      <div className="flex-1 h-px border-t border-dashed border-muted-foreground/40" />
      {/* Future dot */}
      <div className="w-2.5 h-2.5 rounded-full border-2 border-muted-foreground/30 bg-card" />
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
        <h1 className="text-[22px] font-bold tracking-tight">
          {greeting}, James!
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-card border-border/60">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg bg-card border-border/60">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Avatar className="h-10 w-10 ring-2 ring-card shadow-md">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=James" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Top Row: Stats + Formation Status */}
      <div className="grid grid-cols-12 gap-5">
        {/* 4 Stat Cards in one unified card */}
        <div className="col-span-8">
          <Card className="p-1.5 relative">
            {/* Close & Menu buttons */}
            <div className="absolute left-3 top-3 z-10">
              <button className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
                <X className="h-3 w-3 text-foreground/60" />
              </button>
            </div>
            <div className="absolute right-3 top-3 z-10">
              <button className="w-5 h-5 rounded-full hover:bg-foreground/10 flex items-center justify-center transition-colors">
                <MoreHorizontal className="h-3.5 w-3.5 text-foreground/40" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 divide-x divide-border/40 pt-4 pb-2">
              {[
                { icon: CreditCard, label: "Your bank\nbalance", value: "$143,624" },
                { icon: Layers, label: "Uncategorised\ntransactions", value: "12" },
                { icon: Users, label: "Employees\nworking today", value: "7" },
                { icon: Monitor, label: "This week's\ncard spending", value: "$3,287.49" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 px-4 py-2">
                  <CircleIcon icon={stat.icon} />
                  <div className="min-w-0">
                    <p className="text-lg font-bold tracking-tight tabular-nums leading-tight">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight whitespace-pre-line">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Formation Status Card */}
        <div className="col-span-4">
          <Card className="p-5 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Formation status</h3>
              <span className="text-[10px] font-semibold text-foreground bg-foreground/10 px-2.5 py-1 rounded-full">
                In progress
              </span>
            </div>
            
            <ProgressStepper />
            
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-xs text-muted-foreground text-center">
                Estimated processing
              </p>
              <p className="text-sm font-bold text-center mt-0.5">4–6 business days</p>
              <Button variant="outline" size="sm" className="mt-3 w-full text-xs rounded-full border-foreground/20 hover:bg-foreground/5">
                View status
              </Button>
            </div>
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
              <span className="text-[38px] font-extrabold tracking-tight tabular-nums leading-none">54</span>
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                18.7%
              </span>
            </div>
          </Card>

          {/* Invoices Overdue */}
          <Card className="p-5 flex-1">
            <p className="text-xs font-medium text-muted-foreground mb-3">Invoices overdue</p>
            <div className="flex items-baseline gap-2.5">
              <span className="text-[38px] font-extrabold tracking-tight tabular-nums leading-none">6</span>
              <span className="flex items-center gap-0.5 text-[11px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
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
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>Last 7 days VS prior week</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                  </div>
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
                    stroke="hsl(var(--muted-foreground) / 0.25)"
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
            <h3 className="text-sm font-semibold mb-4">Your to-Do list</h3>
            <div className="space-y-4">
              {todoItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full bg-coral" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium leading-tight">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Board Meeting */}
          <Card 
            className="p-4 text-white border-0"
            style={{ background: "var(--gradient-sidebar)" }}
          >
            <h3 className="text-[13px] font-semibold mb-1.5">Board meeting</h3>
            <div className="flex items-center gap-2 text-white/70 mb-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium">Feb 22 at 6:00 PM</span>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed">
              You have been invited to attend a meeting of the Board of Directors.
            </p>
          </Card>
        </div>
      </div>

      {/* Bottom: Recent Emails */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold mb-4">Recent emails</h3>
        <div className="space-y-0.5">
          {recentEmails.map((email, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                style={{ background: email.color }}
              >
                {email.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{email.name}</p>
              </div>
              <p className="text-[13px] text-muted-foreground truncate flex-1">{email.subject}</p>
              <p className="text-[11px] text-muted-foreground whitespace-nowrap">{email.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}