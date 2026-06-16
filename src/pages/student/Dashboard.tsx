import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/ui/PageHeader";
import { studentCourses, studentCertificates } from "@/data/studentMockData";
import { useGamificationStore, pathProgress } from "@/stores/gamificationStore";
import {
  TrendingUp, Briefcase, Award, ChevronRight, BookOpen, BadgeCheck, Clock, Calendar
} from "lucide-react";

export default function StudentDashboard() {
  const { profile, skillMastery, learningPaths } = useGamificationStore();

  const inProgress = studentCourses.filter((c) => c.status === "in_progress");
  const issuedCerts = studentCertificates.filter((c) => c.status === "issued");
  const inProgressCerts = studentCertificates.filter((c) => c.status === "in_progress");

  const activePaths = learningPaths.filter((p) => {
    const pp = pathProgress(p);
    return pp.pct > 0 && pp.pct < 100;
  });

  // Batch progress (mock)
  const batchProgress = { pct: 42, weeksElapsed: 7, weeksTotal: 16 };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${profile.name.split(" ")[0]}`}
        description="Your learning at a glance."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Progress */}
        <Card className="flex flex-col">
          <CardContent className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight">My Progress</h2>
                <p className="text-[11px] text-muted-foreground">Courses, paths & batch</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {/* Batch */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{profile.batchName}</span>
                  <span className="text-muted-foreground tabular-nums">Week {batchProgress.weeksElapsed}/{batchProgress.weeksTotal}</span>
                </div>
                <Progress value={batchProgress.pct} className="h-1.5" />
              </div>

              {/* Active courses */}
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Active courses</p>
                {inProgress.slice(0, 3).map((c) => {
                  const pct = Math.round((c.completed / c.modules) * 100);
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="truncate pr-2">{c.name}</span>
                        <span className="tabular-nums text-muted-foreground">{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1" />
                    </div>
                  );
                })}
                {inProgress.length === 0 && (
                  <p className="text-xs text-muted-foreground">No active courses.</p>
                )}
              </div>

              {/* Active paths */}
              {activePaths.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Learning paths</p>
                  {activePaths.slice(0, 2).map((p) => {
                    const pp = pathProgress(p);
                    return (
                      <div key={p.slug} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate pr-2">{p.name}</span>
                          <span className="tabular-nums text-muted-foreground">{pp.pct}%</span>
                        </div>
                        <Progress value={pp.pct} className="h-1" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button asChild variant="outline" size="sm" className="w-full mt-5 gap-1">
              <Link to="/student/progress"><ChevronRight className="h-3.5 w-3.5" /> View progress</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="flex flex-col">
          <CardContent className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-600">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight">Portfolio</h2>
                <p className="text-[11px] text-muted-foreground">Proof of work & skills</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {/* Top skills */}
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Top skills</p>
                {[...skillMastery].sort((a, b) => b.mastery - a.mastery).slice(0, 4).map((s) => (
                  <div key={s.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{s.label}</span>
                      <span className="tabular-nums text-muted-foreground">{s.mastery}%</span>
                    </div>
                    <Progress value={s.mastery} className="h-1" />
                  </div>
                ))}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">{learningPaths.filter(p => pathProgress(p).pct === 100).length}</p>
                  <p className="text-[10px] text-muted-foreground">Paths completed</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <p className="text-lg font-bold">{issuedCerts.length}</p>
                  <p className="text-[10px] text-muted-foreground">Certificates</p>
                </div>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full mt-5 gap-1">
              <Link to="/student/portfolio"><ChevronRight className="h-3.5 w-3.5" /> Open portfolio</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="flex flex-col">
          <CardContent className="p-6 flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight">Certificates</h2>
                <p className="text-[11px] text-muted-foreground">Earned & in progress</p>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {/* Issued */}
              {issuedCerts.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={`/student/certificates/${c.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted/40 transition-colors"
                >
                  <BadgeCheck className="h-4 w-4 text-success shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {c.issuedDate}
                    </p>
                  </div>
                </Link>
              ))}

              {/* In progress */}
              {inProgressCerts.slice(0, 2).map((c) => (
                <Link
                  key={c.id}
                  to={`/student/certificates/${c.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-lg border hover:bg-muted/40 transition-colors"
                >
                  <Clock className="h-4 w-4 text-warning shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <Progress value={c.progress} className="h-1 mt-1" />
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{c.progress}%</span>
                </Link>
              ))}

              {issuedCerts.length === 0 && inProgressCerts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No certificates yet.</p>
              )}
            </div>

            <Button asChild variant="outline" size="sm" className="w-full mt-5 gap-1">
              <Link to="/student/certificates"><ChevronRight className="h-3.5 w-3.5" /> Trophy room</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
