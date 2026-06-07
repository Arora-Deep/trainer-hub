import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, CheckCircle, Lock, Video, FileText,
  FlaskConical, Award, BookOpen, Play, Download, MessageSquare, Code2, Flag, ShieldCheck,
  Calendar, Timer, Sparkles, ListChecks, Radio, Maximize2, ExternalLink,
} from "lucide-react";
import { getStudentCourse } from "@/data/studentMockData";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { OnDemandLabPanel } from "@/components/learning/OnDemandLabPanel";
import { PersistentLabPanel } from "@/components/learning/PersistentLabPanel";
import { toast } from "sonner";

const icons: Record<string, any> = {
  video: Video,
  reading: FileText,
  lab: FlaskConical,
  "lab-instruction": ListChecks,
  "live-session": Radio,
  quiz: Award,
  assignment: FileText,
  "code-exercise": Code2,
  "ctf-scenario": Flag,
  exam: ShieldCheck,
  "mock-exam": ShieldCheck,
  survey: MessageSquare,
};

const blockLabel: Record<string, string> = {
  video: "Video",
  reading: "Reading",
  lab: "Lab",
  "lab-instruction": "Lab Instructions",
  "live-session": "Live Session",
  quiz: "Quiz",
  assignment: "Assignment",
  "code-exercise": "Code exercise",
  "ctf-scenario": "CTF scenario",
  exam: "Exam",
  "mock-exam": "Mock Exam",
  survey: "Survey",
};

export default function CoursePlayer() {
  const { id = "", lessonId = "" } = useParams();
  const nav = useNavigate();
  const c = getStudentCourse(id);
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("# Write your solution here\n");
  const [flag, setFlag] = useState("");

  const enrollment = useEnrollmentStore((s) => s.getForCourse("me", id));
  const consumeHours = useEnrollmentStore((s) => s.consumeHours);
  const markComplete = useEnrollmentStore((s) => s.markComplete);
  const walletRemaining = useEnrollmentStore((s) => s.walletRemaining);

  const flat = useMemo(
    () => c?.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title }))) ?? [],
    [c]
  );
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  if (!c || !lesson) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Card><CardContent className="py-12 text-center">Lesson not found.</CardContent></Card>
      </div>
    );
  }

  const isCompletedLesson = enrollment?.completedLessonIds.includes(lesson.id) ?? lesson.completed;
  const completedCount = flat.filter((l) => enrollment?.completedLessonIds.includes(l.id) || l.completed).length;
  const pct = Math.round((completedCount / flat.length) * 100);
  const wallet = enrollment ? walletRemaining(enrollment) : null;
  const Icon = icons[lesson.type] || BookOpen;

  const validUntil = enrollment?.validUntil;
  const daysLeft = validUntil ? Math.max(0, Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000)) : null;

  const onMarkComplete = () => {
    if (enrollment) markComplete(enrollment.id, lesson.id);
    toast.success("Lesson marked complete");
    if (next) nav(`/student/courses/${c.id}/learn/${next.id}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to={`/student/courses/${c.id}`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> {c.name}
          </Link>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedCount}/{flat.length}</span>
          </div>
          <Progress value={pct} className="h-1 mt-1" />

          {/* Self-paced meta strip */}
          {c.deliveryMode === "self-paced" && (
            <div className="mt-3 space-y-1.5 text-[11px]">
              {daysLeft !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Validity</span>
                  <span className="font-medium">{daysLeft}d left</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" /> Lab wallet</span>
                <span className="font-medium">{wallet === null ? "Unlimited" : `${wallet.toFixed(1)}h`}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {c.chapters.map((ch, ci) => (
            <div key={ch.id}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1">Ch {ci + 1} · {ch.title}</p>
              {ch.lessons.map((l) => {
                const I = icons[l.type] || BookOpen;
                const active = l.id === lessonId;
                const done = enrollment?.completedLessonIds.includes(l.id) || l.completed;
                return (
                  <Link
                    key={l.id}
                    to={l.locked ? "#" : `/student/courses/${c.id}/learn/${l.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/10 text-primary font-medium" : l.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"}`}
                  >
                    {done ? <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" /> : l.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <I className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <span className="flex-1 truncate">{l.title}</span>
                    <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Main */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {/* Lesson header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
            <div>
              <h1 className="text-base font-semibold">{lesson.title}</h1>
              <p className="text-[11px] text-muted-foreground">{blockLabel[lesson.type]} · {lesson.duration}</p>
            </div>
          </div>
          {isCompletedLesson && <Badge variant="outline" className="text-success border-success/30 bg-success/5 text-[10px]"><Check className="h-3 w-3 mr-1" /> Completed</Badge>}
        </div>

        {/* Block renderer */}
        <Card>
          <CardContent className="p-0">
            {lesson.type === "video" && (
              <div className="aspect-video bg-foreground/95 flex items-center justify-center text-background relative">
                <Play className="h-14 w-14 opacity-70" />
                <p className="absolute bottom-4 left-4 text-xs opacity-70">Video player · {lesson.duration}</p>
              </div>
            )}
            {lesson.type === "reading" && (
              <div className="p-8 prose prose-sm max-w-none">
                <p className="text-sm text-muted-foreground">{lesson.body ?? "Read through the material below, then mark it complete."}</p>
              </div>
            )}
            {lesson.type === "quiz" && (
              <div className="p-8 text-center">
                <Award className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Knowledge check · {lesson.duration}</p>
                <Button asChild className="gap-1.5"><Link to="/student/assessments"><Play className="h-4 w-4" /> Start quiz</Link></Button>
              </div>
            )}
            {lesson.type === "assignment" && (
              <div className="p-8 text-center">
                <FileText className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Assignment · upload your submission</p>
                <Input type="file" className="max-w-sm mx-auto" />
              </div>
            )}
            {lesson.type === "code-exercise" && (
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] capitalize">{lesson.language ?? "python"}</Badge>
                  <span className="text-xs text-muted-foreground">Auto-graded via Judge0</span>
                </div>
                <Textarea rows={10} className="font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm">Run</Button>
                  <Button size="sm" onClick={() => toast.success("Submitted · all tests passed")}>Submit</Button>
                </div>
              </div>
            )}
            {(lesson.type === "lab" || lesson.type === "ctf-scenario") && (
              <div className="p-5 space-y-4">
                {lesson.labMode === "persistent" ? (
                  <PersistentLabPanel templateName={lesson.labTemplate ?? "Course VM"} validUntil={validUntil} />
                ) : (
                  <OnDemandLabPanel
                    templateName={lesson.labTemplate ?? "Lab VM"}
                    estimatedHours={lesson.estimatedHours}
                    walletRemaining={wallet}
                    onConsumeHours={(h) => (enrollment ? consumeHours(enrollment.id, lesson.id, h) : false)}
                  />
                )}
                {lesson.type === "ctf-scenario" && (
                  <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Flag className="h-3 w-3" /> Submit flag</p>
                    <div className="flex gap-2">
                      <Input placeholder="flag{...}" value={flag} onChange={(e) => setFlag(e.target.value)} className="font-mono text-xs" />
                      <Button size="sm" onClick={() => toast.success("Flag accepted · +1 to score")}>Submit</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {lesson.type === "exam" && (
              <div className="p-8 text-center space-y-3">
                <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
                <div>
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">Timed exam · {lesson.duration}{lesson.proctored ? " · Proctored" : ""}</p>
                </div>
                {lesson.proctored && (
                  <Badge variant="outline" className="text-[10px]">Camera + lockdown browser required</Badge>
                )}
                <div className="pt-2">
                  <Button asChild className="gap-1.5"><Link to="/student/assessments"><Play className="h-4 w-4" /> Begin exam</Link></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="notes">
          <TabsList>
            <TabsTrigger value="notes" className="text-xs">My Notes</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
            <TabsTrigger value="discussion" className="text-xs">Discussion</TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-3">
            <Card><CardContent className="pt-6"><Textarea rows={5} placeholder="Jot down what you learned..." value={notes} onChange={(e) => setNotes(e.target.value)} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="resources" className="mt-3">
            <Card><CardContent className="pt-6 space-y-2">
              {c.resources.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded border border-border">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">{r.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">{r.type}</Badge>
                  {r.size && <span className="text-xs text-muted-foreground">{r.size}</span>}
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="discussion" className="mt-3">
            <Card><CardContent className="pt-6 text-sm text-muted-foreground"><MessageSquare className="h-5 w-5 mb-2" /><Link to={`/student/courses/${c.id}/discussion`} className="text-primary underline">Open full discussion →</Link></CardContent></Card>
          </TabsContent>
        </Tabs>

        {/* Bottom bar */}
        <div className="sticky bottom-0 bg-background border-t border-border py-3 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={!prev} asChild={!!prev}>
            {prev ? <Link to={`/student/courses/${c.id}/learn/${prev.id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Previous</Link> : <span><ArrowLeft className="h-4 w-4 mr-1" /> Previous</span>}
          </Button>
          <Button size="sm" className="gap-1.5" onClick={onMarkComplete}>
            <Check className="h-4 w-4" /> Mark complete {next ? "& continue" : ""} {next && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
