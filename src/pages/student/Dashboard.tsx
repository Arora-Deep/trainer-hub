import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play, Clock, BookOpen, FileText, Github, Video, ChevronRight, Download,
  Route, ArrowRight, Swords, BadgeCheck, Flame, FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroDashboard } from "@/components/gamification/HeroDashboard";
import { useGamificationStore, pathProgress, challengeProgress, skillColor } from "@/stores/gamificationStore";

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

  const { profile, learningPaths, challenges, getBatchLeaderboard } = useGamificationStore();
  const activePaths = learningPaths.filter((p) => {
    const pp = pathProgress(p);
    return pp.pct > 0 && pp.pct < 100;
  }).slice(0, 3);
  const activeChallenges = challenges.filter((c) => c.status === "in_progress" || c.status === "available").slice(0, 3);
  const batchLb = getBatchLeaderboard(profile.batchId);
  const me = batchLb.find((e) => e.you);

  return (
    <div className="space-y-6">
      <HeroDashboard />

      {/* Quick stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickCard
          label="Batch rank"
          value={me ? `#${me.rank}` : "—"}
          sub={`of ${batchLb.length} in your batch`}
          icon={BadgeCheck}
          onClick={() => navigate("/student/leaderboard")}
        />
        <QuickCard
          label="Active paths"
          value={activePaths.length}
          sub="learning journeys"
          icon={Route}
          onClick={() => navigate("/student/paths")}
        />
        <QuickCard
          label="Open challenges"
          value={activeChallenges.length}
          sub="scenarios to clear"
          icon={Swords}
          onClick={() => navigate("/student/challenges")}
        />
        <QuickCard
          label="Labs shipped"
          value={useGamificationStore.getState().completedLabs.length}
          sub="hands-on work"
          icon={FlaskConical}
          onClick={() => navigate("/student/labs")}
        />
      </div>

      {/* Active learning paths */}
      <Section title="Continue your paths" subtitle="Pick up where you left off" actionLabel="All paths" onAction={() => navigate("/student/paths")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activePaths.map((p) => {
            const pp = pathProgress(p);
            const accent = skillColor[p.key];
            return (
              <Card key={p.slug} className="overflow-hidden cursor-pointer group" onClick={() => navigate(`/student/paths/${p.slug}`)}>
                <div className="h-1.5" style={{ background: accent }} />
                <CardContent className="p-5 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Learning path</p>
                    <h3 className="text-sm font-semibold mt-0.5">{p.name}</h3>
                  </div>
                  <Progress value={pp.pct} className="h-1.5" />
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{pp.done} / {pp.total} modules</span>
                    <span className="font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      Continue <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Active challenges */}
      <Section title="Live challenges" subtitle="Real scenarios. Real proof." actionLabel="All challenges" onAction={() => navigate("/student/challenges")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeChallenges.map((c) => {
            const cp = challengeProgress(c);
            return (
              <Card key={c.id} className="cursor-pointer" onClick={() => navigate("/student/challenges")}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.difficulty}</p>
                      <h3 className="text-sm font-semibold leading-snug mt-0.5">{c.title}</h3>
                    </div>
                    <Swords className="h-4 w-4 text-primary shrink-0" />
                  </div>
                  {c.steps && (
                    <div>
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{cp.done}/{cp.total} steps</span>
                        <span className="tabular-nums">{cp.pct}%</span>
                      </div>
                      <Progress value={cp.pct} className="h-1" />
                    </div>
                  )}
                  {c.reward && <p className="text-[11px] text-muted-foreground">Reward · {c.reward}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Upcoming + resources */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">
        <Section title="Upcoming sessions" subtitle="Live with your trainer">
          <Card>
            <CardContent className="p-0">
              {sessions.map((s, i) => (
                <div key={s.title} className={`p-4 hover:bg-foreground/5 transition-colors ${i !== sessions.length - 1 ? "border-b border-foreground/10" : ""}`}>
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
        </Section>

        <Section title="Quick resources" subtitle="Everything for this week">
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
        </Section>
      </div>
    </div>
  );
}

function QuickCard({ label, value, sub, icon: Icon, onClick }: { label: string; value: string | number; sub: string; icon: typeof Route; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <p className="text-2xl font-bold tabular-nums mt-1">{value}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function Section({ title, subtitle, actionLabel, onAction, children }: { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {actionLabel && onAction && (
          <button onClick={onAction} className="text-xs font-semibold inline-flex items-center gap-1 hover:gap-1.5 transition-all text-primary">
            {actionLabel} <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
