import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Monitor, FileText, Trophy, Clock, Calendar,
  TrendingUp, Play, ArrowRight, Flame, Target, Bell,
  CheckCircle2, AlertCircle, Zap, Star, Award, Swords,
  ChevronRight, Rocket, Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

/* ── Data ── */
const stats = [
  { label: "Active Courses", value: "3", icon: BookOpen, color: "text-primary", bg: "bg-primary/10", change: "+1 this week" },
  { label: "Lab Hours", value: "24h", icon: Monitor, color: "text-success", bg: "bg-success/10", change: "6h this week" },
  { label: "Assessments Due", value: "2", icon: FileText, color: "text-warning", bg: "bg-warning/10", change: "Due today" },
  { label: "Certificates", value: "1", icon: Trophy, color: "text-info", bg: "bg-info/10", change: "1 in progress" },
];

const skillData = [
  { subject: "Cloud", A: 85 },
  { subject: "DevOps", A: 70 },
  { subject: "Linux", A: 60 },
  { subject: "Networking", A: 75 },
  { subject: "Security", A: 55 },
  { subject: "IaC", A: 40 },
];

const leaderboard = [
  { rank: 1, name: "Amit K.", xp: 2480, badge: "🥇" },
  { rank: 2, name: "Priya S.", xp: 2210, badge: "🥈" },
  { rank: 3, name: "You (Sarah)", xp: 1980, badge: "🥉", isYou: true },
  { rank: 4, name: "Rahul M.", xp: 1750, badge: "" },
  { rank: 5, name: "Neha D.", xp: 1620, badge: "" },
];

const continueItem = {
  type: "course" as const,
  title: "VPC Deep Dive",
  subtitle: "AWS Cloud Practitioner · Module 9 of 12",
  progress: 67,
  timeLeft: "~45m remaining",
  icon: BookOpen,
};

const dailyChallenge = {
  title: "Complete 1 Lab Exercise",
  xpReward: 50,
  description: "Finish any hands-on lab to earn bonus XP today!",
  progress: 0,
  target: 1,
};

const deadlines = [
  { title: "AWS VPC Quiz", due: "Today, 6:00 PM", urgent: true, type: "quiz" },
  { title: "K8s Lab Submission", due: "Tomorrow, 11:59 PM", urgent: false, type: "lab" },
  { title: "Docker Final Assessment", due: "Mar 12, 5:00 PM", urgent: false, type: "assessment" },
  { title: "Terraform Intro Quiz", due: "Mar 15, 3:00 PM", urgent: false, type: "quiz" },
];

// Generate 12 weeks of heatmap data (84 days)
const generateHeatmap = () => {
  const data: { day: number; week: number; value: number; date: string }[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const week = Math.floor((83 - i) / 7);
    const day = d.getDay();
    // Simulate activity — more recent = more active
    const base = i < 7 ? 3 : i < 21 ? 2 : i < 42 ? 1.5 : 1;
    const value = Math.floor(Math.random() * base * 2);
    data.push({ day, week, value, date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
  }
  return data;
};
const heatmapData = generateHeatmap();

const enrolledBatches = [
  { name: "AWS Cloud Practitioner — Batch 12", trainer: "TechSkills Academy", progress: 65, nextSession: "Today, 2:00 PM", status: "live" as const },
  { name: "Kubernetes Fundamentals — Batch 5", trainer: "CodeCraft Institute", progress: 30, nextSession: "Tomorrow, 10:00 AM", status: "upcoming" as const },
];

const upcomingSessions = [
  { title: "AWS VPC Deep Dive", time: "Today, 2:00 PM", duration: "2h", batch: "AWS Batch 12", type: "live" as const },
  { title: "K8s Pod Networking", time: "Tomorrow, 10:00 AM", duration: "1.5h", batch: "K8s Batch 5", type: "scheduled" as const },
  { title: "IAM Policies Lab", time: "Wed, 3:00 PM", duration: "1h", batch: "AWS Batch 12", type: "lab" as const },
];

const recentActivity = [
  { action: "Completed Module 8", detail: "AWS Cloud Practitioner", time: "2h ago", icon: CheckCircle2, color: "text-success" },
  { action: "Scored 92%", detail: "Docker Basics Quiz", time: "1d ago", icon: Target, color: "text-primary" },
  { action: "Lab session ended", detail: "K8s Cluster Lab — 2h 15m", time: "2d ago", icon: Monitor, color: "text-info" },
  { action: "Certificate issued", detail: "Docker Essentials", time: "5d ago", icon: Trophy, color: "text-warning" },
];

const notifications = [
  { text: "Quiz 'AWS VPC' is due today", type: "warning" as const },
  { text: "New lab environment available: Terraform Lab", type: "info" as const },
  { text: "Batch 12 live session starts in 2 hours", type: "info" as const },
];

/* ── Heatmap Cell ── */
const heatmapColors = [
  "bg-muted",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

function HeatmapCell({ value, date }: { value: number; date: string }) {
  const colorClass = heatmapColors[Math.min(value, 5)];
  return (
    <div
      className={`h-3 w-3 rounded-[2px] ${colorClass} transition-colors`}
      title={`${date}: ${value} activities`}
    />
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [challengeCompleted] = useState(false);

  // Group heatmap data by week
  const weeks: typeof heatmapData[] = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(heatmapData.filter((d) => d.week === w));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, Sarah!</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your learning command center</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/student/schedule")}>
            <Calendar className="h-3.5 w-3.5" /> My Schedule
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/student/live-class")}>
            <Play className="h-3.5 w-3.5" /> Join Live Class
          </Button>
        </div>
      </div>

      {/* Continue Where You Left Off — Hero CTA */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-transparent to-transparent overflow-hidden relative">
          <CardContent className="py-5 flex items-center gap-5">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Rocket className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Continue Where You Left Off</p>
              <h2 className="text-lg font-bold mt-0.5">{continueItem.title}</h2>
              <p className="text-sm text-muted-foreground">{continueItem.subtitle}</p>
              <div className="flex items-center gap-3 mt-2">
                <Progress value={continueItem.progress} className="h-1.5 flex-1 max-w-xs" />
                <span className="text-xs text-muted-foreground">{continueItem.progress}%</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{continueItem.timeLeft}</span>
              </div>
            </div>
            <Button size="sm" className="gap-1.5 shrink-0" onClick={() => navigate("/student/courses")}>
              <Play className="h-3.5 w-3.5" /> Resume
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Streak + XP Banner */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">🔥 7-day learning streak!</p>
                <p className="text-xs text-muted-foreground">You've been consistent this week. Keep it up!</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-foreground">1,980</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground">#3</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenge */}
        <Card className="bg-gradient-to-r from-warning/5 via-transparent to-transparent border-warning/20">
          <CardContent className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Swords className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-sm">⚡ Daily Challenge</p>
                <p className="text-xs text-muted-foreground">{dailyChallenge.description}</p>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="secondary" className="bg-warning/10 text-warning font-bold">+{dailyChallenge.xpReward} XP</Badge>
              <p className="text-[10px] text-muted-foreground mt-1">{challengeCompleted ? "Completed!" : "0/1 labs"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" /> {s.change}
                  </p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden">
            <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
            {notifications.map((n, i) => (
              <Badge key={i} variant="secondary" className={`shrink-0 text-xs gap-1 ${n.type === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>
                {n.type === "warning" ? <AlertCircle className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                {n.text}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Heatmap */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Learning Activity</h3>
                <span className="text-xs text-muted-foreground">Last 12 weeks</span>
              </div>
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const cell = week.find((d) => d.day === dayIdx);
                      return cell ? (
                        <HeatmapCell key={dayIdx} value={cell.value} date={cell.date} />
                      ) : (
                        <div key={dayIdx} className="h-3 w-3" />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((v) => (
                  <div key={v} className={`h-3 w-3 rounded-[2px] ${heatmapColors[v]}`} />
                ))}
                <span>More</span>
              </div>
            </CardContent>
          </Card>

          {/* My Batches */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">My Batches</h3>
                <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
              </div>
              <div className="space-y-4">
                {enrolledBatches.map((b, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{b.name}</p>
                          {b.status === "live" && (
                            <Badge className="bg-destructive/10 text-destructive text-[10px] animate-pulse">● LIVE</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{b.trainer}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{b.progress}%</Badge>
                    </div>
                    <Progress value={b.progress} className="h-1.5" />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Next: {b.nextSession}
                      </p>
                      {b.status === "live" && (
                        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => navigate("/student/live-class")}>
                          <Play className="h-3 w-3" /> Join Now
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Upcoming Sessions</h3>
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/student/schedule")}>
                  Full Schedule <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-3">
                {upcomingSessions.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      s.type === "live" ? "bg-destructive/10" : s.type === "lab" ? "bg-success/10" : "bg-primary/10"
                    }`}>
                      {s.type === "live" ? <Play className="h-4 w-4 text-destructive" /> :
                       s.type === "lab" ? <Monitor className="h-4 w-4 text-success" /> :
                       <Calendar className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.batch} · {s.duration}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">{s.time}</span>
                      <Badge variant="outline" className="ml-2 text-[10px] capitalize">{s.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skill Radar */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-2">Skill Proficiency</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={skillData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Skill"
                    dataKey="A"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm flex items-center gap-1.5"><Award className="h-4 w-4 text-warning" /> Batch Leaderboard</h3>
              </div>
              <div className="space-y-2">
                {leaderboard.map((p) => (
                  <div
                    key={p.rank}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm ${
                      p.isYou ? "bg-primary/5 border border-primary/20" : ""
                    }`}
                  >
                    <span className="w-6 text-center font-bold text-xs">{p.badge || `#${p.rank}`}</span>
                    <span className={`flex-1 text-xs font-medium ${p.isYou ? "text-primary" : ""}`}>{p.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{p.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-1.5">
                <Timer className="h-4 w-4 text-destructive" /> Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {deadlines.map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${d.urgent ? "bg-destructive animate-pulse" : "bg-muted-foreground/40"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${d.urgent ? "text-destructive" : ""}`}>{d.title}</p>
                      <p className="text-[11px] text-muted-foreground">{d.due}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize shrink-0">{d.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0 ${a.color}`}>
                      <a.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{a.action}</p>
                      <p className="text-xs text-muted-foreground">{a.detail}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Weekly Goals</h3>
              <div className="space-y-3">
                {[
                  { label: "Study Hours", current: 12, target: 15 },
                  { label: "Labs Completed", current: 3, target: 5 },
                  { label: "Quizzes Passed", current: 2, target: 3 },
                ].map((g, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{g.label}</span>
                      <span className="font-medium">{g.current}/{g.target}</span>
                    </div>
                    <Progress value={(g.current / g.target) * 100} className="h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/student/labs")}>
                  <Monitor className="h-4 w-4" />
                  <span className="text-xs">My Labs</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/student/assessments")}>
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Assessments</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/student/courses")}>
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs">Courses</span>
                </Button>
                <Button variant="outline" size="sm" className="h-auto py-3 flex-col gap-1.5" onClick={() => navigate("/student/certificates")}>
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs">Certificates</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
