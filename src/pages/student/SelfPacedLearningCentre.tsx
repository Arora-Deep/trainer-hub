import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  CheckCircle, Lock, Video, FileText, FlaskConical, Award, BookOpen, Play,
  ListChecks, Radio, ShieldCheck, Code2, Flag, MessageSquare, ArrowRight, ArrowLeft,
  Monitor, Wifi, Timer, RotateCw, Save, Maximize2, Square, ExternalLink, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StudentCourse, StudentLesson } from "@/data/studentMockData";
import { OnDemandLabPanel } from "@/components/learning/OnDemandLabPanel";

const icons: Record<string, any> = {
  video: Video, reading: FileText, lab: FlaskConical, "lab-instruction": ListChecks,
  "live-session": Radio, quiz: Award, assignment: FileText, "code-exercise": Code2,
  "ctf-scenario": Flag, exam: ShieldCheck, "mock-exam": ShieldCheck, survey: MessageSquare,
};

const blockLabel: Record<string, string> = {
  video: "Video", reading: "Reading", lab: "Lab", "lab-instruction": "Lab Instructions",
  "live-session": "Live Session", quiz: "Quiz", assignment: "Assignment",
  "code-exercise": "Code exercise", "ctf-scenario": "CTF scenario", exam: "Exam",
  "mock-exam": "Mock exam", survey: "Survey",
};

export default function SelfPacedLearningCentre({ course }: { course: StudentCourse }) {
  const flat = useMemo(
    () => course.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title }))),
    [course]
  );
  const initialId = course.nextLessonId ?? flat.find((l) => !l.completed && !l.locked)?.id ?? flat[0]?.id ?? "";
  const [currentId, setCurrentId] = useState(initialId);
  const idx = flat.findIndex((l) => l.id === currentId);
  const lesson = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const persistentLab = course.persistentLab;
  const hasPersistent = !!persistentLab;

  const [completedSet, setCompletedSet] = useState<Set<string>>(
    () => new Set(flat.filter((l) => l.completed).map((l) => l.id))
  );
  const markComplete = () => {
    if (!lesson) return;
    setCompletedSet((s) => new Set([...s, lesson.id]));
    toast.success("Lesson marked complete");
    if (next) setCurrentId(next.id);
  };
  const pct = Math.round((completedSet.size / Math.max(1, flat.length)) * 100);

  if (!lesson) {
    return <Card><CardContent className="py-12 text-center text-sm">No lessons yet.</CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      {/* Header strip */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight truncate">{course.name}</h1>
            <Badge className="bg-amber-500/10 text-amber-600 text-[10px] gap-1">
              <Sparkles className="h-3 w-3" /> Self-paced
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {course.batch} · {flat.length} lessons · Mentor {course.instructor.replace(/^Mentor:\s*/i, "")}
          </p>
        </div>
        {course.totalAccessHours && (
          <Badge variant="outline" className="text-[11px] gap-1">
            <Timer className="h-3 w-3" /> {Math.max(0, course.totalAccessHours - (course.usedAccessHours ?? 0))}h validity
          </Badge>
        )}
      </div>

      {/* Layout: left rail (lab + curriculum) + center lesson */}
      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* Left rail */}
        <div className="flex flex-col gap-3 h-[calc(100vh-13rem)]">
          {hasPersistent && (
            <PersistentLabRail lab={persistentLab!} />
          )}
          <Card className="overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Course Content</span>
                <span className="font-medium">{completedSet.size}/{flat.length}</span>
              </div>
              <Progress value={pct} className="h-1 mt-1" />
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-3">
                {course.chapters.map((ch, ci) => (
                  <div key={ch.id}>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1">
                      Ch {ci + 1} · {ch.title}
                    </p>
                    {ch.lessons.map((l) => {
                      const I = icons[l.type] || BookOpen;
                      const active = l.id === currentId;
                      const done = completedSet.has(l.id);
                      return (
                        <button
                          key={l.id}
                          disabled={l.locked}
                          onClick={() => !l.locked && setCurrentId(l.id)}
                          className={cn(
                            "w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors",
                            active ? "bg-primary/10 text-primary font-medium" :
                            l.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                          )}
                        >
                          {done ? <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" /> :
                           l.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> :
                           <I className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                          <span className="flex-1 truncate">{l.title}</span>
                          <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Center: lesson */}
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                {(() => { const I = icons[lesson.type] || BookOpen; return <I className="h-4 w-4" />; })()}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-semibold truncate">{lesson.title}</h2>
                <p className="text-[11px] text-muted-foreground">{blockLabel[lesson.type]} · {lesson.duration}</p>
              </div>
            </div>
            {completedSet.has(lesson.id) && (
              <Badge variant="outline" className="text-success border-success/30 bg-success/5 text-[10px]">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <LessonBlock lesson={lesson} courseId={course.id} />
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Button variant="outline" size="sm" disabled={!prev} onClick={() => prev && setCurrentId(prev.id)} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={markComplete} className="gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" /> Mark complete
              </Button>
              <Button variant="outline" size="sm" disabled={!next} onClick={() => next && setCurrentId(next.id)} className="gap-1.5">
                Next <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Lesson block renderer (subset of CoursePlayer + inline assessments) ── */
function LessonBlock({ lesson, courseId }: { lesson: StudentLesson; courseId: string }) {
  const [code, setCode] = useState("# Write your solution here\n");
  const [flag, setFlag] = useState("");

  if (lesson.type === "video") {
    return (
      <div className="aspect-video bg-foreground/95 flex items-center justify-center text-background relative">
        <Play className="h-14 w-14 opacity-70" />
        <p className="absolute bottom-4 left-4 text-xs opacity-70">Video player · {lesson.duration}</p>
      </div>
    );
  }
  if (lesson.type === "reading") {
    return lesson.body ? (
      <div
        className="p-8 prose prose-sm max-w-none prose-headings:font-semibold prose-blockquote:border-l-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-pre:bg-muted"
        dangerouslySetInnerHTML={{ __html: lesson.body }}
      />
    ) : (
      <div className="p-8 prose prose-sm max-w-none">
        <p className="text-sm text-muted-foreground">Read through the material below, then mark it complete.</p>
      </div>
    );
  }
  if (lesson.type === "quiz" || lesson.type === "mock-exam") {
    return <InlineQuiz lesson={lesson} />;
  }
  if (lesson.type === "assignment") {
    return <InlineAssignment lesson={lesson} />;
  }
  if (lesson.type === "exam") {
    return <InlineExam lesson={lesson} />;
  }
  if (lesson.type === "code-exercise") {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] capitalize">{lesson.language ?? "python"}</Badge>
          <span className="text-xs text-muted-foreground">Auto-graded</span>
        </div>
        <Textarea rows={10} className="font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm">Run</Button>
          <Button size="sm" onClick={() => toast.success("Submitted")}>Submit</Button>
        </div>
      </div>
    );
  }
  if (lesson.type === "lab" || lesson.type === "ctf-scenario") {
    return (
      <div className="p-5 space-y-4">
        <div className="text-xs text-muted-foreground">
          {lesson.labAllocation?.type === "time-limited" && <>Time-limited · {lesson.labAllocation.sessionDurationHrs ?? 2}h per launch · resets between lessons</>}
          {lesson.labAllocation?.type === "hour-pool" && <>Hour pool · {lesson.labAllocation.hours ?? 0}h available</>}
          {!lesson.labAllocation && <>On-demand lab · {lesson.duration}</>}
        </div>
        <OnDemandLabPanel
          templateName={lesson.labTemplate ?? "Lab VM"}
          estimatedHours={lesson.estimatedHours}
          walletRemaining={null}
        />
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to={`/student/courses/${courseId}/labs/${lesson.id}/workspace`}>
            <Maximize2 className="h-3.5 w-3.5" /> Open Lab Workspace
          </Link>
        </Button>
        {lesson.type === "ctf-scenario" && (
          <div className="p-3 rounded-lg border bg-muted/30 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1">
              <Flag className="h-3 w-3" /> Submit flag
            </p>
            <div className="flex gap-2">
              <Input placeholder="flag{...}" value={flag} onChange={(e) => setFlag(e.target.value)} className="font-mono text-xs" />
              <Button size="sm" onClick={() => toast.success("Flag accepted")}>Submit</Button>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (lesson.type === "lab-instruction") {
    const li = lesson.labInstruction;
    return (
      <div className="p-5 space-y-4">
        {li?.objective && <Field title="Objective"><p className="text-sm">{li.objective}</p></Field>}
        {li?.tasks && li.tasks.length > 0 && (
          <Field title="Tasks">
            <ol className="space-y-2 text-sm">
              {li.tasks.map((t, i) => (
                <li key={t.id} className="flex gap-2">
                  <span className="font-mono text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <div><p className="font-medium">{t.title}</p>{t.detail && <p className="text-xs text-muted-foreground mt-0.5">{t.detail}</p>}</div>
                </li>
              ))}
            </ol>
          </Field>
        )}
        {li?.expectedOutcome && <Field title="Expected outcome"><p className="text-sm">{li.expectedOutcome}</p></Field>}
        <div className="pt-2 border-t">
          <Button asChild className="gap-1.5">
            <Link to={`/student/courses/${courseId}/labs/${lesson.id}/workspace`}>
              <Play className="h-4 w-4" /> Launch Lab
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  if (lesson.type === "live-session") {
    return (
      <div className="p-8 text-center space-y-3">
        <Radio className="h-10 w-10 mx-auto text-destructive" />
        <p className="text-sm font-medium">{lesson.title}</p>
        <p className="text-xs text-muted-foreground">Live session · {lesson.duration}</p>
      </div>
    );
  }
  return <div className="p-8 text-sm text-muted-foreground text-center">Content type: {lesson.type}</div>;
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
      {children}
    </div>
  );
}

/* ── Inline assessments (no routing to /student/assessments) ── */
function InlineQuiz({ lesson }: { lesson: StudentLesson }) {
  const questions = useMemo(
    () => [
      { q: "Which service stores objects in AWS?", opts: ["EC2", "S3", "VPC", "IAM"], a: 1 },
      { q: "What does CIDR stand for?", opts: ["Classless Inter-Domain Routing", "Cloud Internal Data Route", "Common IP Distribution Range", "Centralized IP Domain Resolution"], a: 0 },
      { q: "Default VPC subnet is in how many AZs?", opts: ["1", "2", "All AZs in region", "3"], a: 2 },
    ],
    []
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0) : 0;

  if (submitted) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <Award className="h-10 w-10 mx-auto text-primary mb-2" />
          <p className="text-lg font-semibold">{score} / {questions.length} correct</p>
          <p className="text-xs text-muted-foreground">{score === questions.length ? "Perfect!" : "Review and try again."}</p>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium mb-1">{i + 1}. {q.q}</p>
              <p className={cn("text-xs", answers[i] === q.a ? "text-success" : "text-destructive")}>
                Your answer: {q.opts[answers[i] ?? -1] ?? "—"} {answers[i] !== q.a && <span className="text-muted-foreground">· Correct: {q.opts[q.a]}</span>}
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Award className="h-4 w-4 text-primary" /> {questions.length} questions · {lesson.duration}
      </div>
      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="text-sm font-medium">{i + 1}. {q.q}</p>
          <RadioGroup value={answers[i]?.toString() ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...a, [i]: Number(v) }))}>
            {q.opts.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <RadioGroupItem value={oi.toString()} id={`q${i}-${oi}`} />
                <Label htmlFor={`q${i}-${oi}`} className="text-sm font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={Object.keys(answers).length < questions.length}
          onClick={() => { setSubmitted(true); toast.success("Quiz submitted"); }}
        >
          Submit quiz
        </Button>
      </div>
    </div>
  );
}

function InlineAssignment({ lesson }: { lesson: StudentLesson }) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-2">
        <CheckCircle className="h-10 w-10 mx-auto text-success" />
        <p className="text-sm font-medium">Assignment submitted</p>
        <p className="text-xs text-muted-foreground">{file?.name ?? "submission.zip"} · awaiting review</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Brief</p>
        <p className="text-sm text-muted-foreground">{lesson.body ?? "Complete the assignment described in your course materials and upload your submission."}</p>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Upload your file</Label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Notes for reviewer (optional)</Label>
        <Textarea rows={4} placeholder="Anything the reviewer should know..." value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button size="sm" disabled={!file} onClick={() => { setSubmitted(true); toast.success("Assignment submitted"); }}>
          Submit assignment
        </Button>
      </div>
    </div>
  );
}

function InlineExam({ lesson }: { lesson: StudentLesson }) {
  const [started, setStarted] = useState(false);
  if (!started) {
    return (
      <div className="p-8 text-center space-y-3">
        <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
        <div>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">Timed exam · {lesson.duration}{lesson.proctored ? " · Proctored" : ""}</p>
        </div>
        {lesson.proctored && <Badge variant="outline" className="text-[10px]">Camera + lockdown browser required</Badge>}
        <div className="pt-2">
          <Button size="sm" onClick={() => setStarted(true)} className="gap-1.5">
            <Play className="h-4 w-4" /> Begin exam
          </Button>
        </div>
      </div>
    );
  }
  return <InlineQuiz lesson={lesson} />;
}

/* ── Persistent VM rail (top-left, like VILT lab console) ── */
function PersistentLabRail({
  lab,
}: {
  lab: { labId: string; templateName: string; totalHours: number; usedHours: number; ip?: string; status?: "running" | "stopped" };
}) {
  const [status, setStatus] = useState<"running" | "stopped" | "booting">(lab.status ?? "stopped");
  const [used, setUsed] = useState(lab.usedHours);
  const remaining = Math.max(0, lab.totalHours - used);
  const pct = Math.min(100, (used / lab.totalHours) * 100);

  useEffect(() => {
    if (status !== "running") return;
    const t = setInterval(() => setUsed((u) => Math.min(lab.totalHours, u + 1 / 3600)), 1000);
    return () => clearInterval(t);
  }, [status, lab.totalHours]);

  const start = () => { setStatus("booting"); setTimeout(() => { setStatus("running"); toast.success("VM running"); }, 1200); };
  const stop = () => { setStatus("stopped"); toast.message("VM stopped"); };

  return (
    <Card className="overflow-hidden shrink-0">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <Monitor className="h-4 w-4 text-success shrink-0" />
          <span className="text-xs font-semibold truncate">Course Lab</span>
        </div>
        <Badge className={cn(
          "text-[10px] border-0 shrink-0",
          status === "running" ? "bg-success/10 text-success" :
          status === "booting" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
        )}>
          ● {status === "booting" ? "Booting" : status === "running" ? "Running" : "Stopped"}
        </Badge>
      </div>

      {/* Mini console preview */}
      <div className="bg-foreground/95 text-background p-2.5 font-mono text-[10px] h-[120px] overflow-hidden">
        {status === "booting" ? (
          <div className="flex items-center justify-center h-full text-background/60">
            <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
            Booting…
          </div>
        ) : status === "running" ? (
          <div className="space-y-0.5">
            <div className="text-success">student@vm:~$ uname -a</div>
            <div className="text-background/70 truncate">Linux 5.15 x86_64</div>
            <div className="text-success">student@vm:~$ <span className="animate-pulse">▍</span></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-background/50 text-center">
            VM is stopped
          </div>
        )}
      </div>

      {/* Hours meter */}
      <div className="px-3 py-2 border-t bg-muted/20">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-muted-foreground flex items-center gap-1"><Timer className="h-2.5 w-2.5" /> Lab hours</span>
          <span className="font-medium">{remaining.toFixed(1)}h / {lab.totalHours}h</span>
        </div>
        <Progress value={pct} className="h-1" />
        {status === "running" && lab.ip && (
          <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1"><Wifi className="h-2.5 w-2.5 text-success" /> {lab.ip}</p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t p-2 grid grid-cols-2 gap-1.5">
        {status === "running" ? (
          <Button variant="outline" size="sm" onClick={stop} className="h-7 gap-1 text-[10px]"><Square className="h-3 w-3" /> Stop</Button>
        ) : (
          <Button size="sm" onClick={start} className="h-7 gap-1 text-[10px]"><Play className="h-3 w-3" /> Start</Button>
        )}
        <Button variant="outline" size="sm" disabled={status !== "running"} className="h-7 gap-1 text-[10px]" onClick={() => { setStatus("booting"); setTimeout(() => setStatus("running"), 1000); }}>
          <RotateCw className="h-3 w-3" /> Restart
        </Button>
        <Button variant="outline" size="sm" disabled={status !== "running"} className="h-7 gap-1 text-[10px]" onClick={() => toast.success("Snapshot saved")}>
          <Save className="h-3 w-3" /> Snapshot
        </Button>
        <Button variant="outline" size="sm" disabled={status !== "running"} className="h-7 gap-1 text-[10px]" asChild>
          <Link to={`/student/labs/${lab.labId}`}><ExternalLink className="h-3 w-3" /> Open</Link>
        </Button>
      </div>
    </Card>
  );
}
