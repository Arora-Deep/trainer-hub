import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play, BookOpen, Radio, FlaskConical, Timer, Trophy, ChevronRight,
  CheckCircle, Clock, ArrowRight, Sparkles, FileText, Award,
} from "lucide-react";
import { studentCourses, studentLabs } from "@/data/studentMockData";
import { PageHeader } from "@/components/ui/PageHeader";
import { LiveNowBanner } from "@/components/meetings/LiveNowBanner";
import { NextActionCard } from "@/components/student/NextActionCard";

export default function StudentDashboard() {
  const nav = useNavigate();

  const inProgress = studentCourses.filter((c) => c.status === "in_progress");
  const continueCourse = inProgress[0];
  const continuePct = continueCourse ? Math.round((continueCourse.completed / continueCourse.modules) * 100) : 0;

  const upcomingSessions = studentCourses
    .filter((c) => c.deliveryMode !== "self-paced" && c.nextLiveSession)
    .map((c) => ({ course: c, session: c.nextLiveSession! }))
    .slice(0, 3);

  const activeLabs = studentLabs.filter((l) => l.status === "running" || l.status === "stopped").slice(0, 4);

  const hourPoolCourses = studentCourses.filter((c) => c.totalAccessHours && c.totalAccessHours > 0);

  const recentActivity = [
    { icon: CheckCircle, color: "text-success", text: "Completed 'S3 Quiz' in AWS Cloud Practitioner", time: "2h ago" },
    { icon: FlaskConical, color: "text-warning", text: "Launched 'AWS VPC Lab'", time: "3h ago" },
    { icon: FileText, color: "text-primary", text: "Submitted assignment 'Cleaning Real Data'", time: "Yesterday" },
    { icon: Award, color: "text-amber-600", text: "Earned 'Docker Essentials' certificate", time: "2d ago" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Sarah"
        description="Here's what to focus on today."
      />

      <LiveNowBanner />

      <NextActionCard />




      {/* Continue learning */}
      {continueCourse && (
        <section className="space-y-2">
          <SectionHeader title="Continue learning" actionLabel="All courses" onAction={() => nav("/student/courses")} />
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-[1fr_auto] gap-0">
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{continueCourse.category}</Badge>
                    <DeliveryBadge mode={continueCourse.deliveryMode} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{continueCourse.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{continueCourse.description}</p>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-muted-foreground">{continueCourse.completed}/{continueCourse.modules} modules</span>
                      <span className="font-medium">{continuePct}%</span>
                    </div>
                    <Progress value={continuePct} className="h-1.5" />
                  </div>
                </div>
                <div className="border-t md:border-t-0 md:border-l p-5 flex flex-col justify-center gap-2 bg-muted/20 md:min-w-[240px]">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Next lesson</p>
                  <p className="text-sm font-medium">VPC Deep Dive</p>
                  <Button asChild size="sm" className="gap-1.5 mt-1">
                    <Link to={continueCourse.nextLessonId ? `/student/courses/${continueCourse.id}/learn/${continueCourse.nextLessonId}` : `/student/courses/${continueCourse.id}`}>
                      <Play className="h-3.5 w-3.5" /> Resume
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Active labs */}
        <section className="space-y-2">
          <SectionHeader title="Active labs" actionLabel="All labs" onAction={() => nav("/student/labs")} />
          {activeLabs.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No active labs.</CardContent></Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeLabs.map((l) => (
                <Card key={l.id} className="hover:border-primary/40 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold truncate">{l.name}</h4>
                        <p className="text-[11px] text-muted-foreground truncate">{l.template}</p>
                      </div>
                      <Badge className={
                        l.status === "running" ? "bg-success/10 text-success border-0 text-[10px]" :
                        "bg-muted text-muted-foreground border-0 text-[10px]"
                      }>● {l.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Timer className="h-3 w-3" /> {l.timeRemaining}</span>
                      <span>{l.ip}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline" className="flex-1 h-8 text-xs">
                        <Link to={`/student/labs/${l.id}`}>Open</Link>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 text-xs">Snapshot</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming live sessions */}
        <section className="space-y-2">
          <SectionHeader title="Upcoming live sessions" actionLabel="Schedule" onAction={() => nav("/student/schedule")} />
          {upcomingSessions.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No live sessions scheduled.</CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                {upcomingSessions.map((u, i) => (
                  <div key={i} className={`p-4 flex items-start gap-3 ${i !== upcomingSessions.length - 1 ? "border-b" : ""}`}>
                    <div className="h-9 w-9 rounded-md bg-destructive/10 flex items-center justify-center shrink-0">
                      <Radio className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.session.title}</p>
                      <p className="text-[11px] text-muted-foreground">{u.course.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {u.session.date} · {u.session.time}
                      </p>
                    </div>
                    <Button size="sm" className="gap-1 h-8" onClick={() => nav("/student/live-class")}>
                      <Play className="h-3.5 w-3.5" /> Join
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </section>
      </div>

      {/* Lab hours remaining + course progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        <section className="space-y-2">
          <SectionHeader title="Lab hours remaining" />
          <Card>
            <CardContent className="p-4 space-y-3">
              {hourPoolCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No metered courses.</p>
              ) : hourPoolCourses.map((c) => {
                const remain = (c.totalAccessHours ?? 0) - (c.usedAccessHours ?? 0);
                const pct = ((c.usedAccessHours ?? 0) / (c.totalAccessHours ?? 1)) * 100;
                return (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate">{c.name}</span>
                      <span className="text-muted-foreground tabular-nums">{remain}h / {c.totalAccessHours}h</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <SectionHeader title="Course progress" />
          <Card>
            <CardContent className="p-0">
              {inProgress.map((c, i) => {
                const pct = Math.round((c.completed / c.modules) * 100);
                return (
                  <Link key={c.id} to={`/student/courses/${c.id}`} className={`flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors ${i !== inProgress.length - 1 ? "border-b" : ""}`}>
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <Progress value={pct} className="h-1 mt-1" />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{pct}%</span>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Recent activity + Achievements */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        <section className="space-y-2">
          <SectionHeader title="Recent activity" />
          <Card>
            <CardContent className="p-0">
              {recentActivity.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 ${i !== recentActivity.length - 1 ? "border-b" : ""}`}>
                  <a.icon className={`h-4 w-4 ${a.color} shrink-0 mt-0.5`} />
                  <p className="text-sm flex-1">{a.text}</p>
                  <span className="text-[11px] text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <SectionHeader title="Achievements" actionLabel="View all" onAction={() => nav("/student/certificates")} />
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">3 certificates earned</p>
                  <p className="text-xs text-muted-foreground">Latest: Docker Essentials</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <Stat label="Streak" value="7d" icon={Sparkles} />
                <Stat label="Labs done" value="14" icon={FlaskConical} />
                <Stat label="Hours" value="68" icon={Clock} />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function SectionHeader({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-end justify-between">
      <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-xs font-medium text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
          {actionLabel} <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

function DeliveryBadge({ mode }: { mode: "live" | "self-paced" | "hybrid" }) {
  if (mode === "live") return <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]"><Radio className="h-2.5 w-2.5 mr-0.5" />VILT</Badge>;
  if (mode === "self-paced") return <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>;
  return <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[10px]">Hybrid</Badge>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm font-bold tabular-nums">{value}</span>
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
