import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Play, Clock, BookOpen, FileText, Github, Video,
  ChevronRight, Download, Cloud, Terminal, Container, Zap, Target,
  Trophy, Activity, Flame, Sparkles, Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DailyMissionsCard } from "@/components/gamification/DailyMissionsCard";
import { StreakMomentumCard } from "@/components/gamification/StreakMomentumCard";
import { RivalCallout } from "@/components/gamification/RivalCallout";
import { HeroDashboard } from "@/components/gamification/HeroDashboard";
import { RewardUnlockCard } from "@/components/gamification/RewardUnlockCard";
import { StatDonutCard } from "@/components/gamification/StatDonutCard";
import { StatBarCard } from "@/components/gamification/StatBarCard";
import { TierListCard } from "@/components/gamification/TierListCard";
import { SkillProgressionPath } from "@/components/gamification/SkillProgressionPath";
import { WeeklyChallengeFeature } from "@/components/gamification/WeeklyChallengeFeature";
import { MasteryTracks } from "@/components/gamification/MasteryTracks";
import { AchievementShowcase } from "@/components/gamification/AchievementShowcase";
import { MiniLeaderboard } from "@/components/gamification/MiniLeaderboard";
import { LabMissions } from "@/components/gamification/LabMissions";
import { useGamificationStore } from "@/stores/gamificationStore";

type Mission = {
  title: string; course: string; module: string; progress: number;
  xpReward: number; difficulty: "Beginner" | "Intermediate" | "Advanced";
  nextMilestone: string; lastActive: string; icon: typeof Cloud;
};

const missions: Mission[] = [
  { title: "Deploy Your First Kubernetes Cluster", course: "AWS DevOps Bootcamp", module: "Kubernetes Networking", progress: 42, xpReward: 2400, difficulty: "Intermediate", nextMilestone: "Configure pod-to-pod networking", lastActive: "2h ago", icon: Cloud },
  { title: "Infrastructure Automation Fundamentals", course: "Linux System Administration", module: "Process Management", progress: 68, xpReward: 1800, difficulty: "Beginner", nextMilestone: "Write a systemd unit from scratch", lastActive: "Yesterday", icon: Terminal },
  { title: "Enterprise Container Networking", course: "Docker & Containers", module: "Networking Deep Dive", progress: 21, xpReward: 2200, difficulty: "Advanced", nextMilestone: "Build a multi-host overlay", lastActive: "3d ago", icon: Container },
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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const { profile, streak, achievements, skills } = useGamificationStore();

  // Derived stats for the hero metrics row
  const labsCompletion = 58;
  const challengeCompletion = 41;
  const masteryRate = 75;
  const totalXp = profile.totalXp;
  const labHours = profile.totalLabHours;
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* HERO ROW — gradient banner + reward card (mirrors reference) */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <HeroDashboard />
        <RewardUnlockCard />
      </div>

      {/* SECTION TITLE */}
      <SectionTitle title="Your performance" subtitle="This week at a glance" />

      {/* DONUT ROW — 3 stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatDonutCard
          label="Lab completion"
          value={labsCompletion}
          primary={`${Math.round((labsCompletion / 100) * 24)} labs`}
          secondary={`${100 - labsCompletion}% until next milestone reward`}
          icon={Trophy}
          variant="violet"
        />
        <StatDonutCard
          label="Challenges"
          value={challengeCompletion}
          primary={`${Math.round((challengeCompletion / 100) * 18)} cleared`}
          secondary={`${100 - challengeCompletion}% until next benefit unlocks`}
          icon={Sparkles}
          variant="magenta"
        />
        <StatDonutCard
          label="Skill mastery"
          value={masteryRate}
          primary={`${skills.length} skills tracked`}
          secondary={`${100 - masteryRate}% until next tier`}
          icon={Activity}
          variant="cyan"
        />
      </div>

      {/* BARS + TIER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatBarCard
          label="Total XP"
          primary={totalXp.toLocaleString()}
          subtitle="Career to date"
          bars={[28, 34, 30, 38, 42, 36, 48, 52, 47, 56]}
          trend={{ dir: "up", pct: 53 }}
          variant="violet"
        />
        <StatBarCard
          label="Lab hours"
          primary={`${labHours}h`}
          subtitle="Hands-on engineering time"
          bars={[12, 18, 14, 22, 19, 26, 24, 30, 28, 34]}
          trend={{ dir: "up", pct: 22 }}
          variant="cyan"
        />
        <TierListCard
          title="Reward tiers"
          rows={[
            { label: "Architect tier", value: "25%" },
            { label: "Specialist tier", value: "22%" },
            { label: "Engineer tier", value: "20%" },
          ]}
        />
      </div>

      {/* Rival + streak strip */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        <RivalCallout />
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #fb923c, #ec4899)" }}
            >
              <Flame className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Streak</p>
              <h3 className="text-lg font-bold tracking-tight">
                {streak.current} days · <span className="sp-gradient-text">on fire</span>
              </h3>
              <p className="text-xs text-muted-foreground">Personal best: {streak.longest} days</p>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {streak.weeklyDays.map((d, i) => (
                <span
                  key={i}
                  className={`h-7 w-2.5 rounded-full ${
                    d ? "bg-gradient-to-b from-amber-400 to-rose-500" : "bg-foreground/10"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly challenge feature */}
      <WeeklyChallengeFeature />

      {/* Skill path + Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        <SkillProgressionPath />
        <MasteryTracks />
      </div>

      {/* Daily missions + Streak detail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-5">
        <DailyMissionsCard />
        <StreakMomentumCard />
      </div>

      {/* Active missions */}
      <section className="space-y-3">
        <SectionHeader
          title="Active missions"
          subtitle="Hands-on engineering you started"
          actionLabel="All courses"
          onAction={() => navigate("/student/courses")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {missions.map((m, idx) => {
            const Icon = m.icon;
            const accents = [
              { from: "#a78bfa", to: "#22d3ee" },
              { from: "#22d3ee", to: "#10b981" },
              { from: "#f0abfc", to: "#a855f7" },
            ];
            const accent = accents[idx % accents.length];
            return (
              <Card
                key={m.title}
                className="overflow-hidden cursor-pointer group"
                onClick={() => navigate("/student/courses")}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="h-11 w-11 rounded-2xl flex items-center justify-center text-white shrink-0"
                      style={{ background: `linear-gradient(135deg, ${accent.from}, ${accent.to})` }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Progress</div>
                      <div
                        className="text-xl font-bold tabular-nums leading-none mt-1 sp-gradient-text"
                      >
                        {m.progress}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {m.course}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug mt-1">{m.title}</h3>
                  </div>

                  <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${m.progress}%`,
                        background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                    <span className="tabular-nums">{m.difficulty}</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Zap className="h-3 w-3" /> +{m.xpReward.toLocaleString()} XP
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-muted-foreground border-t border-foreground/10 pt-3">
                    <Target className="h-3 w-3 mt-0.5 shrink-0" />
                    <span className="truncate"><span className="text-foreground">Next:</span> {m.nextMilestone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {m.lastActive}
                    </span>
                    <span className="font-semibold inline-flex items-center gap-1 group-hover:gap-1.5 transition-all sp-gradient-cyan-text">
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
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
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

      {/* Upcoming + resources */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
        <section className="space-y-3">
          <SectionHeader title="Upcoming sessions" subtitle="Live with your trainer" />
          <Card>
            <CardContent className="p-0">
              {sessions.map((s, i) => (
                <div
                  key={s.title}
                  className={`p-4 hover:bg-foreground/5 transition-colors ${i !== sessions.length - 1 ? "border-b border-foreground/10" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.day.split(",")[0]}</span>
                      <span className="text-sm font-semibold mt-0.5">{s.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium">{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.trainer} · {s.type}</p>
                    </div>
                    {i === 0 && (
                      <Button size="sm" onClick={() => navigate("/student/live-class")} className="gap-1.5">
                        <Play className="h-3.5 w-3.5" /> Join
                      </Button>
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
                  <div className="h-9 w-9 rounded-xl bg-foreground/5 flex items-center justify-center">
                    <r.icon className="h-4 w-4" />
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

      {/* Tiny credit line */}
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2">
        <Award className="h-3 w-3" /> {unlocked} achievements unlocked · keep going
      </div>

      <div className="h-2" />
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
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
          className="text-xs font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all sp-gradient-cyan-text"
        >
          {actionLabel} <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
