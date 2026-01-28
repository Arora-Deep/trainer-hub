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
  ArrowUpRight,
  Sparkles,
  Activity,
  BarChart3,
  Globe,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

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
  { label: "Create Batch", icon: Plus, href: "/batches/create", primary: true },
  { label: "Create Lab", icon: FlaskConical, href: "/labs/create" },
  { label: "Build Course", icon: Hammer, href: "/course-builder" },
  { label: "Start Session", icon: Play },
];

// Activity chart data
const activityData = [
  { time: "00:00", students: 12, labs: 8 },
  { time: "04:00", students: 8, labs: 5 },
  { time: "08:00", students: 45, labs: 28 },
  { time: "12:00", students: 78, labs: 45 },
  { time: "16:00", students: 142, labs: 85 },
  { time: "20:00", students: 98, labs: 62 },
  { time: "Now", students: 142, labs: 38 },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card-static px-4 py-3 shadow-lg border border-border/50">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Live indicator component
const LiveIndicator = () => (
  <span className="flex items-center gap-2 text-xs font-semibold text-success">
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
    </span>
    Live
  </span>
);

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
    >
      {/* Hero Header with animated gradient */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl p-8 border border-border/50"
        style={{
          background: "var(--gradient-primary-soft)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        {/* Animated background orbs */}
        <motion.div
          className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-accent/5 blur-2xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <motion.div
            className="flex items-center gap-2 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-sm font-semibold text-primary">Welcome back</span>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {greeting()}, John! 👋
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-base max-w-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Here's what's happening with your training sessions today. You have{" "}
            <span className="text-foreground font-medium">3 batches</span> scheduled and{" "}
            <span className="text-foreground font-medium">4 active labs</span> running.
          </motion.p>

          {/* Mini stats in hero */}
          <motion.div
            className="flex flex-wrap gap-6 mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: Globe, label: "Regions Active", value: "3" },
              { icon: Server, label: "VMs Running", value: "38" },
              { icon: Activity, label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--primary-rgb), 0.05)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <stat.icon className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-sm font-bold">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Row with staggered animation */}
      <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
        {[
          { title: "Students Online", value: 142, icon: Users, description: "Across all batches", trend: { value: 12, isPositive: true }, variant: "primary" as const },
          { title: "Active Labs", value: 38, icon: FlaskConical, description: "Running right now", variant: "success" as const },
          { title: "Upcoming Batches", value: 8, icon: Calendar, description: "This month", variant: "info" as const },
          { title: "Active Alerts", value: 3, icon: AlertTriangle, description: "Needs attention", variant: "warning" as const },
        ].map((stat, index) => (
          <motion.div key={stat.title} variants={scaleVariants} custom={index}>
            <motion.div whileHover={{ y: -4, transition: { type: "spring", stiffness: 300 } }}>
              <StatCard {...stat} />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions with hover effects */}
      <motion.div variants={itemVariants}>
        <Card className="border-dashed border-2 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 overflow-hidden">
          <CardContent className="py-5">
            <div className="flex flex-wrap items-center gap-4">
              <motion.div
                className="flex items-center gap-2.5 mr-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <motion.div
                  className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--gradient-primary-soft)" }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Zap className="h-4 w-4 text-primary" />
                </motion.div>
                <span className="text-sm font-semibold text-foreground">Quick actions</span>
              </motion.div>
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  {action.href ? (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={action.primary ? "default" : "outline"}
                        size="sm"
                        className={action.primary ? "btn-gradient rounded-xl" : "rounded-xl hover:border-primary/30"}
                        asChild
                      >
                        <Link to={action.href}>
                          <action.icon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Link>
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" size="sm" className="rounded-xl hover:border-primary/30">
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Chart - NEW */}
      <motion.div variants={itemVariants}>
        <DataCard
          title="Activity Overview"
          icon={BarChart3}
          badge={<LiveIndicator />}
          action={{ label: "View analytics", href: "/analytics" }}
        >
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLabs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(152, 76%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(152, 76%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="students"
                  name="Students"
                  stroke="hsl(262, 83%, 58%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorStudents)"
                />
                <Area
                  type="monotone"
                  dataKey="labs"
                  name="Active Labs"
                  stroke="hsl(152, 76%, 42%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorLabs)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Students Online</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success" />
              <span className="text-sm text-muted-foreground">Active Labs</span>
            </div>
          </div>
        </DataCard>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div className="grid gap-6 lg:grid-cols-2" variants={containerVariants}>
        {/* Upcoming Batches */}
        <motion.div variants={itemVariants}>
          <DataCard
            title="Upcoming Batches"
            icon={Calendar}
            action={{ label: "View all", href: "/batches" }}
            noPadding
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Batch Name</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Trainer</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Start Date</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">Students</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {upcomingBatches.map((batch, index) => (
                    <motion.tr
                      key={batch.id}
                      className="table-row-premium border-b border-border/30 last:border-0 group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                    >
                      <TableCell>
                        <Link
                          to={`/batches/${batch.id}`}
                          className="font-medium hover:text-primary transition-colors flex items-center gap-1 group/link"
                        >
                          {batch.name}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">{batch.startDate}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          {batch.students}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </DataCard>
        </motion.div>

        {/* Active Labs */}
        <motion.div variants={itemVariants}>
          <DataCard
            title="Active Labs"
            icon={FlaskConical}
            action={{ label: "View all", href: "/labs" }}
            badge={<LiveIndicator />}
            noPadding
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Student</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Lab</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-right">Time Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {activeLabs.map((lab, index) => (
                    <motion.tr
                      key={lab.id}
                      className="table-row-premium border-b border-border/30 last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                    >
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
                          <Clock className="h-3.5 w-3.5" />
                          {lab.timeRemaining}
                        </span>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </DataCard>
        </motion.div>

        {/* Alerts & Issues */}
        <motion.div variants={itemVariants}>
          <DataCard
            title="Alerts & Issues"
            icon={AlertTriangle}
            badge={
              <motion.span
                className="rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-semibold text-destructive"
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.9, 1.05, 1] }}
                transition={{ duration: 0.3 }}
              >
                {alerts.length} new
              </motion.span>
            }
          >
            <div className="space-y-3">
              <AnimatePresence>
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="flex items-start gap-3 rounded-xl border border-border/50 p-4 hover:bg-muted/30 hover:border-border transition-all cursor-pointer group"
                  >
                    <motion.div
                      className="mt-0.5 shrink-0"
                      animate={alert.type === "error" ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <span
                        className={`flex h-2.5 w-2.5 rounded-full ${
                          alert.type === "error"
                            ? "bg-destructive"
                            : alert.type === "warning"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                      />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug font-medium group-hover:text-primary transition-colors">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </DataCard>
        </motion.div>

        {/* Course Progress */}
        <motion.div variants={itemVariants}>
          <DataCard title="Course Progress" icon={TrendingUp} action={{ label: "View all", href: "/courses" }}>
            <div className="space-y-6">
              {courseProgress.map((course, index) => (
                <motion.div
                  key={index}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div
                        className="rounded-xl p-2.5"
                        style={{ background: "var(--gradient-primary-soft)" }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <BookOpen className="h-4 w-4 text-primary" />
                      </motion.div>
                      <div className="min-w-0">
                        <span className="text-sm font-semibold truncate block">{course.name}</span>
                        <span className="text-xs text-muted-foreground">{course.students} students</span>
                      </div>
                    </div>
                    <motion.span
                      className="text-lg font-bold tabular-nums text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {course.progress}%
                    </motion.span>
                  </div>
                  <ProgressBar
                    value={course.progress}
                    size="default"
                    variant={course.progress >= 80 ? "success" : course.progress >= 50 ? "primary" : "warning"}
                    animated
                  />
                </motion.div>
              ))}
            </div>
          </DataCard>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
