import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore } from "@/stores/courseStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Sparkles, FileText, Users, CheckCircle2, ArrowRight, ArrowLeft,
  CalendarIcon, AlertCircle,
} from "lucide-react";

const steps = [
  { id: 1, name: "Basics", icon: FileText },
  { id: 2, name: "Enrollment", icon: Users },
  { id: 3, name: "Review", icon: CheckCircle2 },
];

export default function CreateSelfPacedBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();
  const { courses } = useCourseStore();

  const [currentStep, setCurrentStep] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const course = useMemo(() => courses.find((c) => c.id === courseId), [courses, courseId]);

  const [enrollmentMode, setEnrollmentMode] = useState<"always-open" | "window" | "invite-only">("always-open");
  const [enrollmentStart, setEnrollmentStart] = useState<Date | undefined>();
  const [enrollmentEnd, setEnrollmentEnd] = useState<Date | undefined>();
  const [maxConcurrentLearners, setMaxConcurrentLearners] = useState(50);

  // Only self-paced courses can back a self-paced batch
  const selfPacedCourses = useMemo(
    () => courses.filter((c) => c.settings?.deliveryType === "self-paced"),
    [courses]
  );

  const courseLabReadiness = useMemo(() => {
    if (!course) return { total: 0, ready: 0, pending: [] as string[] };
    const labLessons: Array<{ title: string; ready: boolean }> = [];
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        if (l.type === "lab" || l.lab) {
          labLessons.push({ title: l.title, ready: !!l.lab?.templateId });
        }
      });
    });
    return {
      total: labLessons.length,
      ready: labLessons.filter((l) => l.ready).length,
      pending: labLessons.filter((l) => !l.ready).map((l) => l.title),
    };
  }, [course]);

  const courseReady = course && courseLabReadiness.total > 0 && courseLabReadiness.pending.length === 0;

  const canNext = () => {
    if (currentStep === 1) return name.trim().length > 1 && !!courseId && !!courseReady;
    if (currentStep === 2) return enrollmentMode !== "window" || (enrollmentStart && enrollmentEnd);
    return true;
  };

  const handleCreate = () => {
    addBatch({
      name,
      description,
      courseId: course?.id,
      courseName: course?.name,
      instructors: ["You"],
      settings: { published: true, allowSelfEnrollment: enrollmentMode !== "invite-only", certification: true },
      startDate: (enrollmentStart || new Date()).toISOString(),
      endDate: (enrollmentEnd || new Date(Date.now() + 365 * 86400000)).toISOString(),
      evaluationEndDate: (enrollmentEnd || new Date(Date.now() + 365 * 86400000)).toISOString(),
      additionalDetails: "",
      seatCount: 0,
      medium: "online",
      deliveryMode: "self-paced",
      enrollmentMode: "floating",
      // Access type is per-lab on the course; batch keeps a generic full-course marker for back-compat.
      accessModel: "full-course",
      selfPacedConfig: {
        enrollmentMode,
        enrollmentStart: enrollmentStart?.toISOString(),
        enrollmentEnd: enrollmentEnd?.toISOString(),
        accessModel: "full-course",
        totalAccessHours: 0,
        expiryDays: course?.settings?.validityAfterLaunchDays || 60,
        maxConcurrentLearners,
        perLabCaps: [],
      },
    });
    toast({ title: "Self-paced batch published", description: `"${name}" is open for enrollment.` });
    navigate("/batches");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Create self-paced batch"
        description="Open enrollment on a self-paced course. All lab settings come from the course itself."
        breadcrumbs={[{ label: "Batches", href: "/batches" }, { label: "Create self-paced" }]}
      />

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

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
            <CardDescription>Pick a self-paced course that already has its labs &amp; access configured.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Batch name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="e.g. AWS S3 — Self-paced cohort" />
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Linked course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pick a self-paced course" /></SelectTrigger>
                <SelectContent>
                  {selfPacedCourses.length === 0 && (
                    <div className="px-3 py-4 text-xs text-muted-foreground">No self-paced courses yet. Create one in Courses.</div>
                  )}
                  {selfPacedCourses.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>

              {course && courseLabReadiness.total === 0 && (
                <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs">
                  <p className="font-medium flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-amber-600" /> No lab lessons in this course</p>
                  <p className="text-muted-foreground mt-1">Add lab lessons in the course content first, then come back.</p>
                  <Button asChild variant="outline" size="sm" className="mt-2 h-7 text-[11px]">
                    <Link to={`/courses/${course.id}`}>Open course</Link>
                  </Button>
                </div>
              )}

              {course && courseLabReadiness.pending.length > 0 && (
                <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs">
                  <p className="font-medium flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Course labs aren't ready</p>
                  <p className="text-muted-foreground mt-1">
                    {courseLabReadiness.pending.length} lab{courseLabReadiness.pending.length === 1 ? "" : "s"} still need a template:&nbsp;
                    {courseLabReadiness.pending.slice(0, 3).join(", ")}{courseLabReadiness.pending.length > 3 ? "…" : ""}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-2 h-7 text-[11px]">
                    <Link to={`/courses/${course.id}`}>Configure labs in course →</Link>
                  </Button>
                </div>
              )}

              {courseReady && (
                <p className="text-[11px] text-success mt-2 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" /> {courseLabReadiness.ready} lab{courseLabReadiness.ready === 1 ? "" : "s"} ready — access is configured per VM in the course.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment</CardTitle>
            <CardDescription>Who can join this batch, and when. VM hours and per-lab caps are inherited from the course.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-xs mb-2 block">Enrollment mode</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Max concurrent learners (soft cap)</Label>
                <Input type="number" min={1} value={maxConcurrentLearners} onChange={(e) => setMaxConcurrentLearners(Number(e.target.value))} className="mt-1" />
                <p className="text-[10px] text-muted-foreground mt-1">Used for capacity projections only — doesn't hard-block enrollment.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-border bg-muted/30 text-xs">
              <p className="font-medium mb-1">Inherited from course</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-muted-foreground">
                <div><span className="text-foreground">Access model:</span> {course?.settings?.accessModel || "full-course"}</div>
                <div><span className="text-foreground">VM hours:</span> {course?.settings?.totalAccessHours ?? "—"}</div>
                <div><span className="text-foreground">Validity:</span> {course?.settings?.validityAfterLaunchDays ?? "—"} d</div>
                <div><span className="text-foreground">Idle shutdown:</span> {course?.settings?.defaultIdleShutdownMin ?? "—"} min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review &amp; publish</CardTitle>
            <CardDescription>Confirm and publish. The batch goes live immediately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Name" v={name} />
            <Row k="Course" v={course?.name || "—"} />
            <Row k="Enrollment" v={enrollmentMode} />
            {enrollmentMode === "window" && (
              <Row k="Window" v={`${enrollmentStart ? format(enrollmentStart, "MMM d, yyyy") : "—"} → ${enrollmentEnd ? format(enrollmentEnd, "MMM d, yyyy") : "—"}`} />
            )}
            <Row k="Max concurrent" v={String(maxConcurrentLearners)} />
            <Row k="Access model (course)" v={course?.settings?.accessModel || "full-course"} />
            <Row k="VM hours / learner (course)" v={`${course?.settings?.totalAccessHours ?? "—"} h`} />
            <Row k="Configured labs (course)" v={`${courseLabReadiness.ready} of ${courseLabReadiness.total}`} />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => currentStep === 1 ? navigate("/batches") : setCurrentStep(currentStep - 1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> {currentStep === 1 ? "Cancel" : "Back"}
        </Button>
        {currentStep < 3 ? (
          <Button disabled={!canNext()} onClick={() => setCurrentStep(currentStep + 1)} className="gap-1.5">
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} className="gap-1.5"><Sparkles className="h-4 w-4" /> Publish self-paced batch</Button>
        )}
      </div>
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
