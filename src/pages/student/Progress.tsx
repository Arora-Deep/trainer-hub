import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGamificationStore, skillColor, tierStyle, type SkillKey } from "@/stores/gamificationStore";
import {
  Flame, Zap, TrendingUp, Trophy, Award, Clock, Layers, Activity,
  Cloud, Terminal, Boxes, Shield, Network, Workflow, Brain, Code, Server,
  Rocket, Moon, Lock, ChevronRight, Sparkles,
} from "lucide-react";
import { StreakMomentumCard } from "@/components/gamification/StreakMomentumCard";
import { useNavigate } from "react-router-dom";

const skillIcons: Record<SkillKey, typeof Cloud> = {
  cloud: Cloud, linux: Terminal, kubernetes: Boxes, security: Shield,
  networking: Network, devops: Workflow, ai: Brain, python: Code, infra: Server,
};

const achievementIcons: Record<string, typeof Rocket> = {
  Rocket, Terminal, Boxes, Network, Cloud, Clock, Moon, Server, Workflow, Activity,
};

export default function Progress_Page() {
  const { profile, skills, achievements, xpFeed } = useGamificationStore();
  const navigate = useNavigate();
  const xpPct = Math.min(100, Math.round((profile.totalXp / profile.nextLevelXp) * 100));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progression"
        description="Your technical identity, skill mastery, and momentum across CloudAdda."
      />

      {/* Identity Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {profile.level}
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">{profile.name}</h2>
                    <Badge variant="outline" className="text-[10px]">{profile.handle}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Level {profile.level} · {profile.identity}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Top {100 - profile.percentile}% globally · Specializing in {skills.find(s => s.key === profile.specialization)?.label}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progress to Level {profile.level + 1}</span>
                  <span className="font-medium tabular-nums">
                    {profile.totalXp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
                  </span>
                </div>
                <Progress value={xpPct} className="h-2" />
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.topSkills.map((s) => {
                  const sk = skills.find(x => x.key === s)!;
                  const Icon = skillIcons[s];
                  return (
                    <div key={s} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-muted/40 text-xs">
                      <Icon className="h-3 w-3" style={{ color: skillColor[s] }} />
                      <span className="font-medium">{sk.label}</span>
                      <span className="text-muted-foreground">Lvl {sk.level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile icon={Clock} label="Lab hours" value={`${profile.totalLabHours}h`} />
              <StatTile icon={Layers} label="Tracks complete" value={`${profile.completedTracks}`} />
              <StatTile icon={Trophy} label="Certifications" value={`${profile.certifications}`} />
              <StatTile icon={Award} label="Achievements" value={`${achievements.filter(a => a.unlocked).length} / ${achievements.length}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        <StreakMomentumCard />
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="text-sm font-semibold">Where to go next</h3>
            <button onClick={() => navigate("/student/skill-tree")} className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="text-sm font-medium">Skill trees</p>
                <p className="text-[11px] text-muted-foreground">Visualize your mastery paths</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/student/challenges")} className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="text-sm font-medium">Challenges</p>
                <p className="text-[11px] text-muted-foreground">Daily, weekly & technical challenges</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/student/leaderboard")} className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left">
              <div>
                <p className="text-sm font-medium">Leaderboards</p>
                <p className="text-[11px] text-muted-foreground">See where you stand in your cohort</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Skill Mastery Grid */}
      <section className="space-y-3">
        <SectionHeader title="Skill mastery" subtitle="Per-track XP, level, and percentile" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((s) => {
            const Icon = skillIcons[s.key];
            const pct = Math.min(100, Math.round((s.xp / s.nextLevelXp) * 100));
            return (
              <Card key={s.key}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${skillColor[s.key]}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: skillColor[s.key] }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{s.label}</p>
                        <p className="text-[11px] text-muted-foreground">Lvl {s.level} · {s.rank}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">Top {100 - s.percentile}%</Badge>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                    <span>{s.xp.toLocaleString()} XP</span>
                    <span>{s.nextLevelXp.toLocaleString()} XP</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Achievements + XP Feed */}
      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">XP Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {achievements.map((a) => {
              const Icon = achievementIcons[a.icon] ?? Rocket;
              const locked = !a.unlocked;
              return (
                <Card key={a.id} className={locked ? "opacity-70" : ""}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${tierStyle[a.tier]}`}>
                        {locked ? <Lock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <Badge variant="outline" className={`text-[10px] capitalize ${tierStyle[a.tier]}`}>{a.tier}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                    </div>
                    {a.unlocked ? (
                      <p className="text-[10px] text-muted-foreground">Unlocked {a.unlockedAt}</p>
                    ) : a.progress ? (
                      <div className="space-y-1">
                        <Progress value={(a.progress.current / a.progress.total) * 100} className="h-1" />
                        <p className="text-[10px] text-muted-foreground tabular-nums">{a.progress.current} / {a.progress.total}</p>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-2">
              {xpFeed.map((e, i) => {
                const Icon = skillIcons[e.skill];
                return (
                  <div
                    key={e.id}
                    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${i !== xpFeed.length - 1 ? "border-b border-border/50" : ""}`}
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${skillColor[e.skill]}20` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: skillColor[e.skill] }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{e.label}</p>
                      <p className="text-[11px] text-muted-foreground">{new Date(e.ts).toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary tabular-nums shrink-0">+{e.amount} XP</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: typeof Cloud; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}
