import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play, ArrowRight, Clock, BookOpen, FileText, Github, Video,
  Pause, RotateCcw, ChevronRight, Download, Cloud, Terminal, Container, Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailyMissionsCard } from "@/components/gamification/DailyMissionsCard";
import { StreakMomentumCard } from "@/components/gamification/StreakMomentumCard";
import { SeasonBanner } from "@/components/gamification/SeasonBanner";
import { RivalCallout } from "@/components/gamification/RivalCallout";
import { HeroDashboard } from "@/components/gamification/HeroDashboard";

const courses = [
  { title: "AWS DevOps Bootcamp", module: "Kubernetes Networking", progress: 42, labHours: 31, lastActive: "2h ago", icon: Cloud, gradient: "from-[#FF9F43] via-[#FF6B6B] to-[#A855F7]" },
  { title: "Linux System Administration", module: "Process Management", progress: 68, labHours: 14, lastActive: "Yesterday", icon: Terminal, gradient: "from-[#10B981] via-[#06B6D4] to-[#3B82F6]" },
  { title: "Docker & Containers", module: "Networking Deep Dive", progress: 21, labHours: 22, lastActive: "3d ago", icon: Container, gradient: "from-[#3B82F6] via-[#6366F1] to-[#A855F7]" },
];

const labs = [
  { name: "AWS DevOps Lab", status: "Running", hours: 22, lastActive: "2 hours ago" },
  { name: "Linux Lab Environment", status: "Paused", hours: 14, lastActive: "Yesterday" },
  { name: "Docker Playground", status: "Stopped", hours: 22, lastActive: "3 days ago" },
];

const sessions = [
  { day: "Tomorrow", time: "7:00 PM", title: "Kubernetes Networking Deep Dive", trainer: "Sarah Johnson", type: "Live Class" },
  { day: "Thu, Nov 14", time: "6:30 PM", title: "CI/CD with GitHub Actions", trainer: "Marcus Lee", type: "Workshop" },
  { day: "Sat, Nov 16", time: "11:00 AM", title: "Weekly Doubt Clearance", trainer: "Sarah Johnson", type: "Q&A" },
];

const resources = [
  { name: "Kubernetes Networking Slides", type: "PDF", icon: FileText },
  { name: "Lab Guide · Week 7", type: "Guide", icon: BookOpen },
  { name: "aws-devops-bootcamp", type: "GitHub", icon: Github },
  { name: "Session Recording · Nov 10", type: "Video", icon: Video },
];

const notifications = [
  { text: "Kubernetes Networking session starts in 1 hour", time: "Just now", tone: "bg-primary" },
  { text: "New lab guide added to Week 7", time: "2h ago", tone: "bg-success" },
  { text: "Trainer Sarah posted an announcement", time: "Yesterday", tone: "bg-info" },
];

function statusVariant(s: string): "default" | "secondary" | "outline" {
  if (s === "Running") return "default";
  if (s === "Paused") return "secondary";
  return "outline";
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* WOW gamified hero */}
      <HeroDashboard />

      {/* Season banner + rival */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <SeasonBanner />
        <RivalCallout />
      </div>

      {/* Daily missions + streak */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <DailyMissionsCard />
        <StreakMomentumCard />
      </div>

      {/* Continue learning */}
      <section className="space-y-3">
        <SectionHeader title="Continue learning" subtitle="Pick up where you left off" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => {
            const Icon = c.icon;
            return (
              <Card
                key={c.title}
                className="overflow-hidden cursor-pointer group"
                onClick={() => navigate("/student/courses")}
              >
                {/* Gradient cover */}
                <div className={`sp-cover bg-gradient-to-br ${c.gradient} h-24 relative flex items-center justify-between px-5`}>
                  <Icon className="h-10 w-10 text-white/95 drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 text-right">
                    <div className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">Progress</div>
                    <div className="text-2xl font-bold text-white tabular-nums leading-none">{c.progress}%</div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate">{c.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.module}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{c.lastActive}</span>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {c.labHours}h labs left
                    </span>
                    <span className="font-medium inline-flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                      Continue <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Labs + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <section className="space-y-3">
          <SectionHeader title="My labs" subtitle="Your environments" />
          <Card>
            <CardContent className="p-2">
              {labs.map((l, i) => (
                <div
                  key={l.name}
                  className={`flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors ${i !== labs.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    l.status === "Running" ? "bg-success shadow-[0_0_10px_hsl(var(--success))]" : l.status === "Paused" ? "bg-warning" : "bg-muted-foreground/40"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium truncate">{l.name}</h4>
                      <Badge variant={statusVariant(l.status)} className="text-[10px]">{l.status}</Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{l.hours}h remaining</span>
                      <span>Last active {l.lastActive}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Pause className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" onClick={() => navigate("/student/labs")}>
                      <Play className="mr-1 h-3 w-3" /> Resume
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Upcoming sessions" subtitle="Live with your trainer" />
          <Card>
            <CardContent className="p-0">
              {sessions.map((s, i) => (
                <div
                  key={s.title}
                  className={`p-4 hover:bg-muted/50 transition-colors ${i !== sessions.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.day.split(",")[0]}</span>
                      <span className="text-sm font-medium mt-0.5">{s.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.trainer} · {s.type}</p>
                    </div>
                    {i === 0 && (
                      <Button size="sm" onClick={() => navigate("/student/live-class")}>Join</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Resources + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 pb-2">
        <section className="space-y-3">
          <SectionHeader title="Quick resources" subtitle="Everything for this week" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resources.map((r) => (
              <Card key={r.name} className="cursor-pointer">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/15 to-[hsl(var(--xp)/0.15)] flex items-center justify-center">
                    <r.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.type}</p>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeader title="Notifications" subtitle="Recent updates" />
          <Card>
            <CardContent className="p-2">
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${n.tone}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
