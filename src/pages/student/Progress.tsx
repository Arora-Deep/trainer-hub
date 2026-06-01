import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import { TrendingUp, Flame, Calendar, Route, BookOpen, Target, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";

const activeCourses = [
  { id: "c1", name: "AWS DevOps Bootcamp", percent: 58, lastActive: "2h ago" },
  { id: "c2", name: "Linux System Administration", percent: 84, lastActive: "Yesterday" },
  { id: "c3", name: "Docker & Containers", percent: 21, lastActive: "3d ago" },
];

const upcoming = [
  { id: "u1", title: "Kubernetes Networking Live Session", when: "Tomorrow · 7:00 PM", kind: "Live class" },
  { id: "u2", title: "Linux Mastery Check (Assessment)", when: "Thu · 6:00 PM", kind: "Assessment" },
  { id: "u3", title: "Challenge ends: Debug Broken Infrastructure", when: "Fri · 11:59 PM", kind: "Challenge" },
  { id: "u4", title: "CI/CD with GitHub Actions Workshop", when: "Sat · 11:00 AM", kind: "Workshop" },
];

export default function Progress_Page() {
  const { profile, streak, skillMastery, learningPaths } = useGamificationStore();
  const navigate = useNavigate();

  // Mock batch progress
  const batchProgress = { pct: 42, weeksElapsed: 7, weeksTotal: 16 };
  const activePaths = learningPaths.filter((p) => {
    const pp = pathProgress(p);
    return pp.pct > 0 && pp.pct < 100;
  });

  // 30-day streak grid: pull from streak.activity (latest 30 entries)
  const today = new Date();
  const last30: Array<{ date: string; intensity: number }> = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last30.push({ date: key, intensity: streak.activity[key] ?? 0 });
  }

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="cyan"
        eyebrow="My Progress"
        icon={TrendingUp}
        title={<>What you've <span className="text-white/95">actually shipped</span>.</>}
        description="Batch progress, active learning, skill mastery, and what's due next."
      />

      {/* Batch progress */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Current batch</p>
              <h2 className="text-lg font-semibold tracking-tight">{profile.batchName}</h2>
            </div>
            <Badge variant="outline" className="text-[10px]">
              Week {batchProgress.weeksElapsed} of {batchProgress.weeksTotal}
            </Badge>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Program progress</span>
              <span className="font-medium tabular-nums">{batchProgress.pct}%</span>
            </div>
            <Progress value={batchProgress.pct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold">Streak</h3>
                <p className="text-[11px] text-muted-foreground">Showing up is how compounding starts.</p>
              </div>
            </div>
            <div className="flex gap-3 text-right">
              <Stat label="Current" value={`${streak.current}d`} />
              <Stat label="Longest" value={`${streak.longest}d`} />
            </div>
          </div>
          <div className="flex items-end gap-0.5 overflow-hidden">
            {last30.map((d) => (
              <div
                key={d.date}
                className="flex-1 h-8 rounded-sm transition-colors"
                title={`${d.date} · ${d.intensity > 0 ? "active" : "off"}`}
                style={{
                  background:
                    d.intensity === 0 ? "hsl(var(--muted))" :
                    d.intensity === 1 ? "hsl(38 95% 60% / 0.35)" :
                    d.intensity === 2 ? "hsl(38 95% 60% / 0.6)" :
                    d.intensity === 3 ? "hsl(28 90% 55% / 0.85)" :
                                        "hsl(12 85% 55%)",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>30 days ago</span><span>Today</span>
          </div>
        </CardContent>
      </Card>

      {/* Active courses + Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Active courses" icon={BookOpen} onAll={() => navigate("/student/courses")}>
          <Card><CardContent className="p-2">
            {activeCourses.map((c, i) => (
              <button
                key={c.id}
                onClick={() => navigate("/student/courses")}
                className={`w-full text-left p-3 hover:bg-muted/40 transition-colors ${i !== activeCourses.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium">{c.name}</p>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{c.percent}%</span>
                </div>
                <Progress value={c.percent} className="h-1" />
                <p className="text-[10px] text-muted-foreground mt-1.5 inline-flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {c.lastActive}</p>
              </button>
            ))}
          </CardContent></Card>
        </Section>

        <Section title="Active learning paths" icon={Route} onAll={() => navigate("/student/paths")}>
          <Card><CardContent className="p-2">
            {activePaths.map((p, i) => {
              const pp = pathProgress(p);
              return (
                <button
                  key={p.slug}
                  onClick={() => navigate(`/student/paths/${p.slug}`)}
                  className={`w-full text-left p-3 hover:bg-muted/40 transition-colors ${i !== activePaths.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium">{p.name}</p>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{pp.done}/{pp.total}</span>
                  </div>
                  <Progress value={pp.pct} className="h-1" />
                </button>
              );
            })}
            {activePaths.length === 0 && (
              <div className="p-6 text-center text-sm text-muted-foreground">No active paths.</div>
            )}
          </CardContent></Card>
        </Section>
      </div>

      {/* Skill mastery */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight">Skill mastery</h2>
        <Card><CardContent className="p-5 space-y-3">
          {skillMastery.map((s) => (
            <div key={s.key} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{s.label}</span>
                <span className="tabular-nums text-muted-foreground">{s.mastery}%</span>
              </div>
              <Progress value={s.mastery} className="h-1.5" />
            </div>
          ))}
        </CardContent></Card>
      </section>

      {/* Upcoming deadlines */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight">Upcoming</h2>
        <Card><CardContent className="p-2">
          {upcoming.map((u, i) => (
            <div key={u.id} className={`p-3 flex items-center gap-3 ${i !== upcoming.length - 1 ? "border-b border-border/50" : ""}`}>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                {u.kind === "Challenge" ? <Target className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{u.title}</p>
                <p className="text-[11px] text-muted-foreground">{u.kind}</p>
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{u.when}</span>
            </div>
          ))}
        </CardContent></Card>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Section({ title, icon: Icon, onAll, children }: { title: string; icon: typeof BookOpen; onAll?: () => void; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold inline-flex items-center gap-1.5"><Icon className="h-3.5 w-3.5" /> {title}</h3>
        {onAll && (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={onAll}>
            All <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}
