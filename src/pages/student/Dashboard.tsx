import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play, Clock, BookOpen, FileText, Github, Video,
  ChevronRight, Download, Cloud, Terminal, Container, Zap, Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailyMissionsCard } from "@/components/gamification/DailyMissionsCard";
import { StreakMomentumCard } from "@/components/gamification/StreakMomentumCard";
import { SeasonBanner } from "@/components/gamification/SeasonBanner";
import { RivalCallout } from "@/components/gamification/RivalCallout";
import { HeroDashboard } from "@/components/gamification/HeroDashboard";
import { SkillProgressionPath } from "@/components/gamification/SkillProgressionPath";
import { WeeklyChallengeFeature } from "@/components/gamification/WeeklyChallengeFeature";
import { MasteryTracks } from "@/components/gamification/MasteryTracks";
import { AchievementShowcase } from "@/components/gamification/AchievementShowcase";
import { MiniLeaderboard } from "@/components/gamification/MiniLeaderboard";
import { LabMissions } from "@/components/gamification/LabMissions";

type Mission = {
  title: string;
  course: string;
  module: string;
  progress: number;
  xpReward: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  nextMilestone: string;
  lastActive: string;
  icon: typeof Cloud;
  gradient: string;
};

const missions: Mission[] = [
  {
    title: "Deploy Your First Kubernetes Cluster",
    course: "AWS DevOps Bootcamp",
    module: "Kubernetes Networking",
    progress: 42,
    xpReward: 2400,
    difficulty: "Intermediate",
    nextMilestone: "Configure pod-to-pod networking",
    lastActive: "2h ago",
    icon: Cloud,
    gradient: "from-[#FF9F43] via-[#FF6B6B] to-[#A855F7]",
  },
  {
    title: "Infrastructure Automation Fundamentals",
    course: "Linux System Administration",
    module: "Process Management",
    progress: 68,
    xpReward: 1800,
    difficulty: "Beginner",
    nextMilestone: "Write a systemd unit from scratch",
    lastActive: "Yesterday",
    icon: Terminal,
    gradient: "from-[#10B981] via-[#06B6D4] to-[#3B82F6]",
  },
  {
    title: "Enterprise Container Networking",
    course: "Docker & Containers",
    module: "Networking Deep Dive",
    progress: 21,
    xpReward: 2200,
    difficulty: "Advanced",
    nextMilestone: "Build a multi-host overlay",
    lastActive: "3d ago",
    icon: Container,
    gradient: "from-[#3B82F6] via-[#6366F1] to-[#A855F7]",
  },
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

const difficultyTone: Record<Mission["difficulty"], string> = {
  Beginner: "text-success bg-success/10 border-success/20",
  Intermediate: "text-primary bg-primary/10 border-primary/20",
  Advanced: "text-warning bg-warning/10 border-warning/20",
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero — identity & progression */}
      <HeroDashboard />

      {/* Season banner + rival */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <SeasonBanner />
        <RivalCallout />
      </div>

      {/* Weekly challenge — flagship engagement loop */}
      <WeeklyChallengeFeature />

      {/* Skill progression path + mastery tracks */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <SkillProgressionPath />
        <MasteryTracks />
      </div>

      {/* Daily missions + streak */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <DailyMissionsCard />
        <StreakMomentumCard />
      </div>

      {/* Active missions (formerly "courses") */}
      <section className="space-y-3">
        <SectionHeader
          title="Active missions"
          subtitle="Hands-on engineering you started"
          actionLabel="All courses"
          onAction={() => navigate("/student/courses")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {missions.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.title}
                className="overflow-hidden cursor-pointer group"
                onClick={() => navigate("/student/courses")}
              >
                <div className={`sp-cover bg-gradient-to-br ${m.gradient} h-24 relative flex items-center justify-between px-5`}>
                  <Icon className="h-10 w-10 text-white/95 drop-shadow-lg relative z-10 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10 text-right">
                    <div className="text-[10px] uppercase tracking-widest text-white/80 font-semibold">Progress</div>
                    <div className="text-2xl font-bold text-white tabular-nums leading-none">{m.progress}%</div>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                      {m.course}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug mt-0.5">{m.title}</h3>
                  </div>

                  <Progress value={m.progress} className="h-1.5" />

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${difficultyTone[m.difficulty]}`}>
                      {m.difficulty}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-[hsl(var(--xp)/0.25)] bg-[hsl(var(--xp)/0.08)] text-[hsl(var(--xp))]">
                      <Zap className="h-3 w-3" /> +{m.xpReward.toLocaleString()} XP
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground border-t border-border/60 pt-2.5">
                    <Target className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                    <span className="truncate"><span className="text-foreground font-medium">Next:</span> {m.nextMilestone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {m.lastActive}
                    </span>
                    <span className="font-medium inline-flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                      Resume <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Lab challenges + Mini leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="space-y-3">
          <SectionHeader
            title="Lab challenges"
            subtitle="Real environments. Real engineering."
            actionLabel="All labs"
            onAction={() => navigate("/student/labs")}
          />
          <LabMissions />
        </section>

        <section className="space-y-3">
          <SectionHeader title="Ranking" subtitle="Where you stand this week" />
          <MiniLeaderboard />
        </section>
      </div>

      {/* Achievements showcase */}
      <AchievementShowcase />

      {/* Upcoming sessions + Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
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
      </div>

      <div className="h-2" />
    </div>
  );
}

function SectionHeader({
  title, subtitle, actionLabel, onAction,
}: { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all"
        >
          {actionLabel} <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
