import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLeft, BookOpen, Video, FileText, FlaskConical, Award, Lock, CheckCircle, Play, User, Clock, Star, Sparkles, Radio, Timer, ClipboardList, Code2, ShieldCheck, Brain, Monitor, Upload } from "lucide-react";
import { getStudentCourse, studentLabs, type StudentLesson } from "@/data/studentMockData";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const moduleIcons: Record<string, any> = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award, assignment: FileText, "code-exercise": Code2, exam: ShieldCheck, "mock-exam": ShieldCheck, reasoning: Brain };

const ASSESSMENT_TYPES = new Set(["quiz", "assignment", "exam", "mock-exam", "code-exercise", "reasoning"]);
const assessmentMeta: Record<string, { label: string; icon: any; tint: string }> = {
  quiz: { label: "Quiz", icon: Award, tint: "text-primary bg-primary/10" },
  assignment: { label: "Assignment", icon: ClipboardList, tint: "text-amber-600 bg-amber-500/10" },
  exam: { label: "Exam", icon: ShieldCheck, tint: "text-destructive bg-destructive/10" },
  "mock-exam": { label: "Mock Exam", icon: ShieldCheck, tint: "text-destructive bg-destructive/10" },
  "code-exercise": { label: "Code Exercise", icon: Code2, tint: "text-violet-600 bg-violet-500/10" },
  reasoning: { label: "AI Reasoning", icon: Brain, tint: "text-cyan-600 bg-cyan-500/10" },
};

export default function StudentCourseDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const c = getStudentCourse(id);
  if (!c) return <div className="space-y-4"><Button variant="ghost" size="sm" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button><Card><CardContent className="py-12 text-center text-sm">Course not found.</CardContent></Card></div>;

  const pct = Math.round((c.completed / c.modules) * 100);
  const next = c.nextLessonId;
  const continueHref = next ? `/student/courses/${c.id}/learn/${next}` : `/student/courses/${c.id}/learn/${c.chapters[0]?.lessons[0]?.id}`;

  // Labs the student has access to for this course
  const courseLabs = studentLabs.filter((l) => l.courseId === c.id);
  if (c.persistentLab && !courseLabs.find((l) => l.id === c.persistentLab!.labId)) {
    // ensure persistent lab is represented even if not in studentLabs
  }

  // All assessment-style lessons across chapters
  const assessments: (StudentLesson & { chapter: string })[] = c.chapters.flatMap((ch) =>
    ch.lessons.filter((l) => ASSESSMENT_TYPES.has(l.type)).map((l) => ({ ...l, chapter: ch.title }))
  );
  const completedAssessments = assessments.filter((a) => a.completed).length;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Courses", href: "/student/courses" }, { label: c.name }]}
        title={c.name}
        description={c.description}
      />

      {/* Top: course meta + inline mentor */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
            {c.deliveryMode === "self-paced" && <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>}
            {c.deliveryMode === "live" && <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]"><Radio className="h-2.5 w-2.5 mr-0.5" />Live</Badge>}
            {c.deliveryMode === "hybrid" && <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[10px]">Hybrid</Badge>}
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {c.rating}</span>
            <span className="text-xs text-muted-foreground">· {c.batch}</span>
          </div>

          {/* Inline mentor line */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-medium">{c.instructor}</span>
            <span className="text-muted-foreground text-xs">— {c.instructorBio}</span>
          </div>

          {c.prerequisites.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Prerequisites</p>
              <div className="flex flex-wrap gap-1.5">
                {c.prerequisites.map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full-width progress + active labs */}
      <Card>
        <CardContent className="pt-6 grid gap-6 md:grid-cols-[1.2fr_1fr]">
          {/* Progress side */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your progress</p>
                <span className="text-xs font-medium">{c.completed}/{c.modules} modules · {pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Stat label="Modules" value={c.modules} />
              <Stat label="Done" value={c.completed} />
              <Stat label="Total" value={`${c.totalHours}h`} />
              <Stat label="Your time" value={c.studyTime} />
            </div>
            {c.nextLiveSession && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Radio className="h-3 w-3" /> Next live session</p>
                <p className="text-sm font-medium mt-1">{c.nextLiveSession.title}</p>
                <p className="text-xs text-muted-foreground">{c.nextLiveSession.date} · {c.nextLiveSession.time}</p>
              </div>
            )}
          </div>

          {/* Labs side */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Labs you have access to</p>
            {courseLabs.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No labs provisioned yet for this course.</p>
            ) : (
              <div className="space-y-2">
                {courseLabs.map((l) => (
                  <Link key={l.id} to={`/student/labs/${l.id}`} className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors group">
                    <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${l.status === "running" ? "bg-success/10" : "bg-muted"}`}>
                      <Monitor className={`h-4 w-4 ${l.status === "running" ? "text-success" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-primary">{l.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{l.template}</p>
                    </div>
                    <Badge className={`text-[10px] border-0 ${l.status === "running" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {l.status === "running" && "● "}{l.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="content">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList>
            <TabsTrigger value="content" className="text-xs">Course Content</TabsTrigger>
            <TabsTrigger value="assessments" className="text-xs">Assessments {assessments.length > 0 && <Badge variant="outline" className="ml-1.5 text-[9px] h-4 px-1">{completedAssessments}/{assessments.length}</Badge>}</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-xs"><Link to={`/student/courses/${c.id}/resources`}>Resources →</Link></Button>
            <Button asChild variant="ghost" size="sm" className="text-xs"><Link to={`/student/courses/${c.id}/discussion`}>Discussion →</Link></Button>
            <Button asChild size="sm" className="gap-1.5">
              <Link to={continueHref}><Play className="h-3.5 w-3.5" /> {c.status === "not_started" ? "Start course" : "Continue learning"}</Link>
            </Button>
          </div>
        </div>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Accordion type="multiple" defaultValue={c.chapters.map((ch) => ch.id)}>
                {c.chapters.map((ch, ci) => (
                  <AccordionItem key={ch.id} value={ch.id}>
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2"><span className="text-muted-foreground">Chapter {ci + 1}</span> · {ch.title}<Badge variant="outline" className="text-[10px] ml-2">{ch.lessons.length} lessons</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-2">
                        {ch.lessons.map((l) => {
                          const Icon = moduleIcons[l.type] || BookOpen;
                          const isAssessment = ASSESSMENT_TYPES.has(l.type);
                          return (
                            <Link key={l.id} to={l.locked ? "#" : `/student/courses/${c.id}/learn/${l.id}`} className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${l.locked ? "opacity-50 cursor-not-allowed" : ""}`}>
                              {l.completed ? <CheckCircle className="h-4 w-4 text-success" /> : l.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Icon className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-sm flex-1">{l.title}</span>
                              {isAssessment && (l.type === "assignment" ? (
                                <Badge variant="outline" className="text-[10px] gap-1 border-amber-500/40 text-amber-600"><Upload className="h-2.5 w-2.5" />Submit</Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] capitalize border-primary/40 text-primary">{assessmentMeta[l.type]?.label ?? l.type}</Badge>
                              ))}
                              {!isAssessment && <Badge variant="outline" className="text-[10px] capitalize">{l.type}</Badge>}
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{l.duration}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {assessments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No assessments in this course yet.</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">All quizzes, assignments, code exercises and exams across this course. Click to attempt or submit.</p>
                  {assessments.map((a) => {
                    const meta = assessmentMeta[a.type] ?? { label: a.type, icon: Award, tint: "text-muted-foreground bg-muted" };
                    const Icon = meta.icon;
                    const isSubmittable = a.type === "assignment";
                    return (
                      <Link key={a.id} to={a.locked ? "#" : `/student/courses/${c.id}/learn/${a.id}`} className={`flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors ${a.locked ? "opacity-50 pointer-events-none" : ""}`}>
                        <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${meta.tint}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium truncate">{a.title}</p>
                            <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
                            {a.completed && <Badge className="text-[10px] bg-success/10 text-success border-0">Completed</Badge>}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{a.chapter} · {a.duration}</p>
                        </div>
                        <Button size="sm" variant={a.completed ? "outline" : "default"} className="gap-1.5 shrink-0">
                          {isSubmittable ? <><Upload className="h-3.5 w-3.5" />{a.completed ? "View" : "Upload"}</> : <><Play className="h-3.5 w-3.5" />{a.completed ? "Review" : "Attempt"}</>}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold mb-3">Study Time This Week</h4>
              {c.studyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={c.studyData}>
                    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
                    <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="url(#g)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground">No activity yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return <div className="p-2 rounded-lg bg-muted/50 text-center"><p className="text-base font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}
