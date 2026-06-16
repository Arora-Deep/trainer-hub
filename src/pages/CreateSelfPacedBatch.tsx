import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore, type Lesson } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Sparkles, FileText, Clock, Monitor, CheckCircle2, ArrowRight, ArrowLeft,
  CalendarIcon, Users, AlertCircle, Plus,
} from "lucide-react";
import { RequestTemplateSheet } from "@/components/sandbox/RequestTemplateSheet";

const steps = [
  { id: 1, name: "Basics", icon: FileText },
  { id: 2, name: "Access & enrollment", icon: Clock },
  { id: 3, name: "On-demand labs", icon: Monitor },
  { id: 4, name: "Review", icon: CheckCircle2 },
];

type LabRow = {
  key: string;            // chapter:lesson
  lessonId: string;
  lessonTitle: string;
  chapterTitle: string;
  attachedTemplateId?: string;
  templateId?: string;    // chosen
  runtimeLimit: number;
  maxLaunches: number;
  idleShutdownMin: number;
  skipped: boolean;
};

export default function CreateSelfPacedBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();
  const { courses } = useCourseStore();
  const { templates } = useLabStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);

  // Step 2
  const [enrollmentMode, setEnrollmentMode] = useState<"always-open" | "window" | "invite-only">("always-open");
  const [enrollmentStart, setEnrollmentStart] = useState<Date | undefined>();
  const [enrollmentEnd, setEnrollmentEnd] = useState<Date | undefined>();
  const [accessModel, setAccessModel] = useState<"full-course" | "lesson-unlock">("full-course");
  const [totalAccessHours, setTotalAccessHours] = useState(120);
  const [expiryDays, setExpiryDays] = useState(60);
  const [maxConcurrentLearners, setMaxConcurrentLearners] = useState(50);

  // Step 3
  const labLessons = useMemo<Array<{ key: string; lesson: Lesson; chapterTitle: string }>>(() => {
    if (!course) return [];
    const out: Array<{ key: string; lesson: Lesson; chapterTitle: string }> = [];
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        if (l.type === "lab" || l.lab) out.push({ key: `${ch.id}:${l.id}`, lesson: l, chapterTitle: ch.title });
      });
    });
    return out;
  }, [course]);

  const [labRows, setLabRows] = useState<Record<string, LabRow>>({});
  const [requestSheetOpen, setRequestSheetOpen] = useState(false);
  const [requestContext, setRequestContext] = useState<string>("");

  // initialize labRows when course picked
  useEffect(() => {
    setLabRows((prev) => {
      const next: Record<string, LabRow> = {};
      labLessons.forEach(({ key, lesson, chapterTitle }) => {
        const existing = prev[key];
        const initialTplId = existing?.templateId || lesson.lab?.templateId;
        const tpl = templates.find((t) => t.id === initialTplId);
        next[key] = existing || {
          key,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          chapterTitle,
          attachedTemplateId: lesson.lab?.templateId,
          templateId: initialTplId,
          runtimeLimit: tpl?.runtimeLimit || 120,
          maxLaunches: 10,
          idleShutdownMin: 15,
          skipped: false,
        };
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labLessons.length]);

  const updateLab = (key: string, patch: Partial<LabRow>) =>
    setLabRows((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const labsReady = useMemo(() => {
    const rows = Object.values(labRows);
    if (rows.length === 0) return true;
    return rows.every((r) => r.skipped || r.templateId);
  }, [labRows]);

  // Step validation
  const canNext = () => {
    if (currentStep === 1) return name.trim().length > 1 && !!courseId;
    if (currentStep === 2) return totalAccessHours > 0 && (enrollmentMode !== "window" || (enrollmentStart && enrollmentEnd));
    if (currentStep === 3) return labsReady;
    return true;
  };

  const handleCreate = () => {
    const rows = Object.values(labRows);
    addBatch({
      name,
      description,
      courseId: course?.id,
      courseName: course?.name,
      instructors: ["You"],
      settings: { published: true, allowSelfEnrollment: enrollmentMode !== "invite-only", certification: true },
      startDate: (enrollmentStart || new Date()).toISOString(),
      endDate: (enrollmentEnd || new Date(Date.now() + expiryDays * 86400000)).toISOString(),
      evaluationEndDate: (enrollmentEnd || new Date(Date.now() + expiryDays * 86400000)).toISOString(),
      additionalDetails: "",
      seatCount: 0,
      medium: "online",
      deliveryMode: "self-paced",
      accessModel,
      totalAccessHours,
      enrollmentMode: "floating",
      selfPacedConfig: {
        enrollmentMode,
        enrollmentStart: enrollmentStart?.toISOString(),
        enrollmentEnd: enrollmentEnd?.toISOString(),
        accessModel,
        totalAccessHours,
        expiryDays,
        maxConcurrentLearners,
        perLabCaps: rows
          .filter((r) => !r.skipped && r.templateId)
          .map((r) => ({
            labId: r.lessonId,
            labName: r.lessonTitle,
            templateId: r.templateId!,
            runtimeLimit: r.runtimeLimit,
            maxLaunches: r.maxLaunches,
            idleShutdownMin: r.idleShutdownMin,
          })),
      },
    });
    toast({ title: "Self-paced batch created", description: `"${name}" is now live for floating enrollment.` });
    navigate("/batches");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Create self-paced batch"
        description="Set up an always-on batch where learners run labs on demand from your template library."
        breadcrumbs={[{ label: "Batches", href: "/batches" }, { label: "Create self-paced" }]}
      />

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const active = currentStep === s.id;
          const done = currentStep > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "h-9 w-9 rounded-xl flex items-center justify-center border-2 transition-all shrink-0",
                done ? "bg-success/15 border-success text-success" : active ? "bg-primary/15 border-primary text-primary" : "border-border text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-xs font-medium truncate", active ? "text-foreground" : "text-muted-foreground")}>{s.name}</p>
              </div>
              {i < steps.length - 1 && <div className={cn("h-px flex-1", done ? "bg-success" : "bg-border")} />}
            </div>
          );
        })}
      </div>

      {/* STEP 1 */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
            <CardDescription>Name your batch and link a course whose lessons have labs attached.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Batch name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="e.g. AWS S3 — Self-paced cohort" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" placeholder="What learners will achieve." />
            </div>
            <div>
              <Label className="text-xs">Linked course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pick a course" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
              {course && labLessons.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-2 flex items-center gap-1.5">
                  <AlertCircle className="h-3 w-3" /> This course has no lab lessons. Self-paced batches need on-demand labs.
                </p>
              )}
              {course && labLessons.length > 0 && (
                <p className="text-[11px] text-muted-foreground mt-2">{labLessons.length} lab lesson{labLessons.length === 1 ? "" : "s"} found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2 */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Access & enrollment</CardTitle>
            <CardDescription>How learners join and how much VM time they get.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-xs mb-2 block">Enrollment</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "always-open", l: "Always open", d: "Anyone with the link" },
                  { v: "window", l: "Window", d: "Open between dates" },
                  { v: "invite-only", l: "Invite only", d: "Admin/trainer adds" },
                ].map((opt) => (
                  <button key={opt.v} type="button" onClick={() => setEnrollmentMode(opt.v as typeof enrollmentMode)}
                    className={cn("p-3 rounded-xl border-2 text-left transition-all", enrollmentMode === opt.v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                    <p className="text-xs font-semibold">{opt.l}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.d}</p>
                  </button>
                ))}
              </div>
            </div>

            {enrollmentMode === "window" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Enrollment opens", val: enrollmentStart, set: setEnrollmentStart },
                  { label: "Enrollment closes", val: enrollmentEnd, set: setEnrollmentEnd },
                ].map((f) => (
                  <div key={f.label}>
                    <Label className="text-xs">{f.label}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="mt-1 w-full justify-start text-xs">
                          <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                          {f.val ? format(f.val, "MMM d, yyyy") : "Pick date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={f.val} onSelect={f.set} /></PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label className="text-xs mb-2 block">Access model</Label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setAccessModel("full-course")}
                  className={cn("p-3 rounded-xl border-2 text-left transition-all", accessModel === "full-course" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                  <p className="text-xs font-semibold">Full-course pool</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Learner spends from a shared VM-hour budget</p>
                </button>
                <button type="button" onClick={() => setAccessModel("lesson-unlock")}
                  className={cn("p-3 rounded-xl border-2 text-left transition-all", accessModel === "lesson-unlock" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                  <p className="text-xs font-semibold">Lesson-unlock</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Per-lab caps unlocked as they progress</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Total VM hours / learner</Label>
                <Input type="number" min={1} value={totalAccessHours} onChange={(e) => setTotalAccessHours(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Expiry after first launch (days)</Label>
                <Input type="number" min={1} value={expiryDays} onChange={(e) => setExpiryDays(Number(e.target.value))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Max concurrent learners</Label>
                <Input type="number" min={1} value={maxConcurrentLearners} onChange={(e) => setMaxConcurrentLearners(Number(e.target.value))} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3 */}
      {currentStep === 3 && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-base">On-demand labs</CardTitle>
              <CardDescription>Pick a published lab template for every lab lesson, or request one.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.values(labRows).length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-8">No lab lessons in this course.</p>
            )}
            {Object.values(labRows).map((row) => {
              const tpl = templates.find((t) => t.id === row.templateId);
              return (
                <div key={row.key} className={cn("p-4 rounded-xl border", row.skipped ? "border-dashed opacity-60" : "border-border")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{row.lessonTitle}</p>
                      <p className="text-[11px] text-muted-foreground">{row.chapterTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!row.templateId && !row.skipped && <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600">Needs template</Badge>}
                      {row.templateId && tpl?.source === "sandbox" && <Badge variant="outline" className="text-[10px]">From your sandbox</Badge>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                    <div className="md:col-span-2">
                      <Label className="text-[10px] text-muted-foreground">Template</Label>
                      <Select value={row.templateId || ""} onValueChange={(v) => updateLab(row.key, { templateId: v, runtimeLimit: templates.find((t) => t.id === v)?.runtimeLimit || row.runtimeLimit })} disabled={row.skipped}>
                        <SelectTrigger className="mt-1 text-xs"><SelectValue placeholder="Choose template" /></SelectTrigger>
                        <SelectContent>
                          {templates.map((t) => <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Runtime / launch (min)</Label>
                      <Input type="number" min={5} value={row.runtimeLimit} onChange={(e) => updateLab(row.key, { runtimeLimit: Number(e.target.value) })} className="mt-1 text-xs h-9" disabled={row.skipped} />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Max launches / learner</Label>
                      <Input type="number" min={1} value={row.maxLaunches} onChange={(e) => updateLab(row.key, { maxLaunches: Number(e.target.value) })} className="mt-1 text-xs h-9" disabled={row.skipped} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-[11px] h-7 gap-1"
                      onClick={() => { setRequestContext(`${row.lessonTitle} (${course?.name})`); setRequestSheetOpen(true); }}>
                      <Plus className="h-3 w-3" /> Request a new template
                    </Button>
                    <Button size="sm" variant="ghost" className="text-[11px] h-7" onClick={() => updateLab(row.key, { skipped: !row.skipped })}>
                      {row.skipped ? "Include lab" : "Skip / manual later"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* STEP 4 */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review & publish</CardTitle>
            <CardDescription>Confirm the setup. Self-paced batches publish immediately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Row k="Name" v={name} />
            <Row k="Course" v={course?.name || "—"} />
            <Row k="Enrollment" v={enrollmentMode} />
            <Row k="Access model" v={accessModel} />
            <Row k="VM hours / learner" v={`${totalAccessHours} h`} />
            <Row k="Expiry after first launch" v={`${expiryDays} days`} />
            <Row k="Max concurrent learners" v={String(maxConcurrentLearners)} />
            <Row k="Configured labs" v={`${Object.values(labRows).filter((r) => r.templateId && !r.skipped).length} of ${Object.values(labRows).length}`} />
          </CardContent>
        </Card>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => currentStep === 1 ? navigate("/batches") : setCurrentStep(currentStep - 1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        {currentStep < 4 ? (
          <Button disabled={!canNext()} onClick={() => setCurrentStep(currentStep + 1)} className="gap-1.5">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} className="gap-1.5"><Sparkles className="h-4 w-4" /> Publish self-paced batch</Button>
        )}
      </div>

      <RequestTemplateSheet
        open={requestSheetOpen}
        onOpenChange={setRequestSheetOpen}
        contextLabel={requestContext}
        defaultCourse={course?.name}
      />
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-xs font-medium capitalize">{v}</span>
    </div>
  );
}
