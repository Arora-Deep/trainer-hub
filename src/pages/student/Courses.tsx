import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookOpen, Play, CheckCircle, Search, Star, Clock, Timer, ChevronRight, Sparkles, Radio, Video, FileText, FlaskConical, Award, Lock, User, GraduationCap, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { studentCourses } from "@/data/studentMockData";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";

const moduleIcons: Record<string, any> = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award, assignment: FileText };

const modeBadge = (mode: string) => {
  if (mode === "self-paced") return <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-0"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>;
  if (mode === "hybrid") return <Badge className="text-[10px] bg-violet-500/10 text-violet-600 border-0">Hybrid</Badge>;
  return <Badge className="text-[10px] bg-destructive/10 text-destructive border-0"><Radio className="h-2.5 w-2.5 mr-0.5" />Live</Badge>;
};

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [mode, setMode] = useState("all");

  const defaultActive = studentCourses.find((c) => c.status === "in_progress")?.id || studentCourses[0]?.id || "";
  const [activeId, setActiveId] = useState(defaultActive);
  const active = studentCourses.find((c) => c.id === activeId) || studentCourses[0];

  const filtered = useMemo(
    () =>
      studentCourses.filter((c) => {
        if (!c.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (tab !== "all" && c.status !== tab) return false;
        if (mode !== "all" && c.deliveryMode !== mode) return false;
        return true;
      }),
    [search, tab, mode]
  );

  const activePct = active ? Math.round((active.completed / active.modules) * 100) : 0;
  const activeNext = active?.nextLessonId || active?.chapters[0]?.lessons[0]?.id;

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="violet"
        eyebrow="Learning Centre"
        icon={GraduationCap}
        title={<>Level up your <span className="text-white/95">craft</span>.</>}
        description="Live, self-paced and hybrid trainings — every module you finish powers up your profile."
        stats={[
          { icon: Trophy, label: "Completed", value: `${studentCourses.filter((c) => c.status === "completed").length}/${studentCourses.length}` },
          { icon: Zap, label: "In progress", value: studentCourses.filter((c) => c.status === "in_progress").length },
          { icon: Sparkles, label: "Modules", value: studentCourses.reduce((s, c) => s + c.modules, 0) },
        ]}
      />


      {/* Active training selector */}
      {active && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Currently learning</span>
              </div>
              <Select value={activeId} onValueChange={setActiveId}>
                <SelectTrigger className="h-10 flex-1 min-w-[260px] max-w-[480px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {studentCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground capitalize">· {c.deliveryMode}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button asChild className="gap-1.5 ml-auto">
                <Link to={activeNext ? `/student/courses/${active.id}/learn/${activeNext}` : `/student/courses/${active.id}`}>
                  <Play className="h-4 w-4" /> {active.status === "not_started" ? "Start" : "Continue"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to={`/student/courses/${active.id}`}>Course details <ChevronRight className="h-3.5 w-3.5 ml-0.5" /></Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_280px]">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {modeBadge(active.deliveryMode)}
                  <Badge variant="outline" className="text-[10px]">{active.category}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {active.rating}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><User className="h-3 w-3" />{active.instructor}</span>
                  <span className="text-xs text-muted-foreground">· {active.batch}</span>
                </div>
                <p className="text-sm text-muted-foreground">{active.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{active.completed}/{active.modules} · {activePct}%</span></div>
                <Progress value={activePct} className="h-2" />
                {active.deliveryMode === "self-paced" && active.totalAccessHours && (
                  <div className="mt-2 p-2 rounded-md bg-amber-500/5 border border-amber-500/20">
                    <div className="flex justify-between text-[11px]"><span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" />Lab access</span><span className="font-medium">{active.totalAccessHours - (active.usedAccessHours ?? 0)}h / {active.totalAccessHours}h</span></div>
                  </div>
                )}
                {active.nextLiveSession && (
                  <div className="mt-2 p-2 rounded-md bg-destructive/5 border border-destructive/20">
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Radio className="h-3 w-3" /> Next live</p>
                    <p className="text-xs font-medium mt-0.5">{active.nextLiveSession.title}</p>
                    <p className="text-[11px] text-muted-foreground">{active.nextLiveSession.date} · {active.nextLiveSession.time}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Course content accordion */}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Course Content</h3>
                <span className="text-[11px] text-muted-foreground">{active.chapters.length} chapters · {active.modules} lessons</span>
              </div>
              <Accordion type="multiple" defaultValue={active.chapters.map((ch) => ch.id)}>
                {active.chapters.map((ch, ci) => (
                  <AccordionItem key={ch.id} value={ch.id}>
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2"><span className="text-muted-foreground">Chapter {ci + 1}</span> · {ch.title}<Badge variant="outline" className="text-[10px] ml-2">{ch.lessons.length} lessons</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-2">
                        {ch.lessons.map((l) => {
                          const Icon = moduleIcons[l.type] || BookOpen;
                          return (
                            <Link key={l.id} to={l.locked ? "#" : `/student/courses/${active.id}/learn/${l.id}`} className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${l.locked ? "opacity-50 cursor-not-allowed" : ""}`}>
                              {l.completed ? <CheckCircle className="h-4 w-4 text-success" /> : l.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Icon className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-sm flex-1">{l.title}</span>
                              <Badge variant="outline" className="text-[10px] capitalize">{l.type}</Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{l.duration}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browse all */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">All enrollments</h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="self-paced">Self-paced</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="in_progress" className="text-xs">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
              <TabsTrigger value="not_started" className="text-xs">Not Started</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-3">
          {filtered.map((c) => {
            const pct = c.modules > 0 ? Math.round((c.completed / c.modules) * 100) : 0;
            const isCompleted = c.status === "completed";
            const isSelfPaced = c.deliveryMode === "self-paced";
            const isHybrid = c.deliveryMode === "hybrid";
            const isActive = c.id === activeId;

            return (
              <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`transition-all hover:shadow-md ${isCompleted ? "border-success/20" : ""} ${isActive ? "ring-1 ring-primary/40" : ""}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <button type="button" onClick={() => setActiveId(c.id)} className="flex items-start gap-3 flex-1 min-w-0 group text-left">
                        <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${isCompleted ? "bg-success/10" : c.status === "in_progress" ? "bg-primary/10" : "bg-muted"}`}>
                          {isCompleted ? <CheckCircle className="h-5 w-5 text-success" /> : <BookOpen className="h-5 w-5 text-primary" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm group-hover:text-primary">{c.name}</h3>
                            <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                            {isSelfPaced && <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-0"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>}
                            {isHybrid && <Badge className="text-[10px] bg-violet-500/10 text-violet-600 border-0">Hybrid</Badge>}
                            {c.deliveryMode === "live" && <Badge className="text-[10px] bg-destructive/10 text-destructive border-0"><Radio className="h-2.5 w-2.5 mr-0.5" />Live</Badge>}
                            <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><Star className="h-3 w-3 text-warning fill-warning" /> {c.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">By {c.instructor} · {c.completed}/{c.modules} modules · {c.totalHours}h total</p>
                          {c.status === "in_progress" && c.nextLiveSession && (
                            <p className="text-xs text-primary mt-1 flex items-center gap-1"><Radio className="h-3 w-3" /> Next live: {c.nextLiveSession.title} · {c.nextLiveSession.date} {c.nextLiveSession.time}</p>
                          )}
                          {isSelfPaced && c.totalAccessHours && (
                            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><Timer className="h-3 w-3" /> Lab access: {(c.totalAccessHours - (c.usedAccessHours ?? 0))}h / {c.totalAccessHours}h left</p>
                          )}
                          <div className="mt-3 flex items-center gap-3">
                            <Progress value={pct} className="h-1.5 flex-1" />
                            <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5">
                            {c.lastAccessed !== "—" && <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> Last: {c.lastAccessed}</p>}
                            <p className="text-[11px] text-muted-foreground">Study: {c.studyTime}</p>
                          </div>
                        </div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button size="sm" asChild variant={isCompleted ? "outline" : "default"} className="gap-1.5">
                          <Link to={c.nextLessonId ? `/student/courses/${c.id}/learn/${c.nextLessonId}` : `/student/courses/${c.id}`}>
                            <Play className="h-3.5 w-3.5" /> {isCompleted ? "Review" : c.status === "not_started" ? "Start" : "Continue"}
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" asChild><Link to={`/student/courses/${c.id}`}><ChevronRight className="h-4 w-4" /></Link></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          {filtered.length === 0 && <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No courses match.</CardContent></Card>}
        </div>
      </div>
    </div>
  );
}
