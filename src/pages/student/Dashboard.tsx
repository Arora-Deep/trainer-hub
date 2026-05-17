import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play, ArrowRight, Clock, Calendar, BookOpen, Monitor,
  FileText, Github, Video, Pause, RotateCcw, Bell, Sparkles,
  ChevronRight, GraduationCap, Activity, Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ── Data ── */
const activeCourse = {
  title: "AWS DevOps Bootcamp",
  module: "Module 7 · Kubernetes Networking",
  progress: 42,
  remainingLabHours: 31,
  nextSession: "Tomorrow · 7:00 PM",
};

const courses = [
  {
    title: "AWS DevOps Bootcamp",
    module: "Kubernetes Networking",
    progress: 42,
    labHours: 31,
    lastActive: "2h ago",
    accent: "from-violet-500/20 to-indigo-500/5",
    icon: "☁️",
  },
  {
    title: "Linux System Administration",
    module: "Process Management",
    progress: 68,
    labHours: 14,
    lastActive: "Yesterday",
    accent: "from-emerald-500/20 to-teal-500/5",
    icon: "🐧",
  },
  {
    title: "Docker & Containers",
    module: "Networking Deep Dive",
    progress: 21,
    labHours: 22,
    lastActive: "3d ago",
    accent: "from-sky-500/20 to-cyan-500/5",
    icon: "🐳",
  },
];

const labs = [
  { name: "AWS DevOps Lab", status: "Running", hours: 22, lastActive: "2 hours ago" },
  { name: "Linux Lab Environment", status: "Paused", hours: 14, lastActive: "Yesterday" },
  { name: "Docker Playground", status: "Stopped", hours: 22, lastActive: "3 days ago" },
];

const sessions = [
  {
    day: "Tomorrow",
    time: "7:00 PM",
    title: "Kubernetes Networking Deep Dive",
    trainer: "Sarah Johnson",
    type: "Live Class",
  },
  {
    day: "Thu, Nov 14",
    time: "6:30 PM",
    title: "CI/CD with GitHub Actions",
    trainer: "Marcus Lee",
    type: "Workshop",
  },
  {
    day: "Sat, Nov 16",
    time: "11:00 AM",
    title: "Weekly Doubt Clearance",
    trainer: "Sarah Johnson",
    type: "Q&A",
  },
];

const resources = [
  { name: "Kubernetes Networking Slides", type: "PDF", icon: FileText },
  { name: "Lab Guide · Week 7", type: "Guide", icon: BookOpen },
  { name: "aws-devops-bootcamp", type: "GitHub", icon: Github },
  { name: "Session Recording · Nov 10", type: "Video", icon: Video },
];

const notifications = [
  { text: "Kubernetes Networking session starts in 1 hour", time: "Just now", dot: "bg-violet-400" },
  { text: "New lab guide added to Week 7", time: "2h ago", dot: "bg-emerald-400" },
  { text: "Trainer Sarah posted an announcement", time: "Yesterday", dot: "bg-sky-400" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] -mx-6 -my-6 bg-gradient-to-b from-[#0a0b10] via-[#0b0d14] to-[#0a0b10] text-zinc-100">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[420px] w-[420px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-32 right-0 h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-10 space-y-12">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_60%)]" />
          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  {greeting()}, Sarah.
                </h1>
                <p className="mt-3 text-lg text-zinc-400">
                  Ready to continue Kubernetes?
                </p>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-2 text-sm">
                <Meta label="Active course" value={activeCourse.title} />
                <Meta label="Progress" value={`${activeCourse.progress}%`} />
                <Meta label="Lab hours" value={`${activeCourse.remainingLabHours}h remaining`} />
                <Meta label="Next session" value={activeCourse.nextSession} />
              </div>

              <div className="pt-2 max-w-md">
                <Progress
                  value={activeCourse.progress}
                  className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-violet-400 [&>div]:to-indigo-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Button
                size="lg"
                onClick={() => navigate("/student/labs")}
                className="h-14 px-8 text-base bg-white text-zinc-950 hover:bg-zinc-200 rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)]"
              >
                <Play className="mr-2 h-5 w-5 fill-zinc-950" /> Resume Lab
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate("/student/courses")}
                className="h-12 px-6 text-zinc-300 hover:bg-white/5 hover:text-white rounded-2xl"
              >
                Continue Course <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.section>

        {/* CONTINUE LEARNING */}
        <section className="space-y-5">
          <SectionHeader title="Continue learning" subtitle="Pick up where you left off" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 p-6 cursor-pointer"
                onClick={() => navigate("/student/courses")}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative space-y-5">
                  <div className="flex items-start justify-between">
                    <div className="h-12 w-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-2xl">
                      {c.icon}
                    </div>
                    <span className="text-xs text-zinc-500">{c.lastActive}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{c.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1">{c.module}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-zinc-400">
                      <span>{c.progress}% complete</span>
                      <span>{c.labHours}h labs left</span>
                    </div>
                    <Progress
                      value={c.progress}
                      className="h-1 bg-white/[0.06] [&>div]:bg-white"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                      Continue
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LABS + SESSIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
          {/* My Labs */}
          <section className="space-y-5">
            <SectionHeader title="My labs" subtitle="Your environments" />
            <div className="space-y-3">
              {labs.map((l) => (
                <div
                  key={l.name}
                  className="group flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5"
                >
                  <StatusDot status={l.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="text-base font-medium text-white truncate">{l.name}</h4>
                      <StatusPill status={l.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{l.hours}h remaining</span>
                      <span>Last active {l.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg">
                      <Pause className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate("/student/labs")}
                      className="h-8 px-4 bg-white text-zinc-950 hover:bg-zinc-200 rounded-lg text-xs font-medium"
                    >
                      <Play className="mr-1.5 h-3 w-3 fill-zinc-950" /> Resume
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming sessions */}
          <section className="space-y-5">
            <SectionHeader title="Upcoming sessions" subtitle="Live with your trainer" />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {sessions.map((s, i) => (
                <div
                  key={s.title}
                  className={`group p-5 hover:bg-white/[0.03] transition-colors ${i !== sessions.length - 1 ? "border-b border-white/[0.04]" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center min-w-[64px] pt-0.5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{s.day.split(",")[0]}</span>
                      <span className="text-sm font-medium text-white mt-0.5">{s.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white">{s.title}</h4>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {s.trainer} · {s.type}
                      </p>
                    </div>
                    {i === 0 && (
                      <Button
                        size="sm"
                        onClick={() => navigate("/student/live-class")}
                        className="h-8 px-3 bg-violet-500 hover:bg-violet-400 text-white rounded-lg text-xs"
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RESOURCES + NOTIFICATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 pb-10">
          <section className="space-y-5">
            <SectionHeader title="Quick resources" subtitle="Everything for this week" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((r) => (
                <div
                  key={r.name}
                  className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-4 cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <r.icon className="h-4 w-4 text-zinc-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.type}</p>
                  </div>
                  <Download className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <SectionHeader title="Notifications" subtitle="Recent updates" />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-2">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition"
                >
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${n.dot} shadow-[0_0_12px_currentColor]`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200">{n.text}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Bits ── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-xl font-medium text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "Running" ? "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.6)]"
    : status === "Paused" ? "bg-amber-400"
    : "bg-zinc-600";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Running" ? "text-emerald-300 bg-emerald-400/10 border-emerald-400/20"
    : status === "Paused" ? "text-amber-300 bg-amber-400/10 border-amber-400/20"
    : "text-zinc-400 bg-white/[0.04] border-white/[0.08]";
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-medium ${cls}`}>
      {status}
    </span>
  );
}
