import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Monitor, Sparkles, CheckCircle2, AlertCircle, Infinity as InfinityIcon, Clock, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCourseStore, type Course, type Lesson, type LabAccessType, type OnExpireBehavior } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { RequestTemplateSheet } from "@/components/sandbox/RequestTemplateSheet";
import { toast } from "@/hooks/use-toast";

interface Props {
  course: Course;
}

export function CourseLabsAccessTab({ course }: Props) {
  const { updateSettings, updateLesson } = useCourseStore();
  const { templates } = useLabStore();

  const s = course.settings || ({} as any);
  const [validityDays, setValidityDays] = useState<number>(s.validityAfterLaunchDays || 60);
  const [idleMin, setIdleMin] = useState<number>(s.defaultIdleShutdownMin || 15);
  const [onExpire, setOnExpire] = useState<OnExpireBehavior>(s.onExpire || "suspend");

  const [requestOpen, setRequestOpen] = useState(false);
  const [requestContext, setRequestContext] = useState("");
  const [labQuery, setLabQuery] = useState("");

  const labLessons = useMemo(() => {
    const out: Array<{ chapterId: string; chapterTitle: string; lesson: Lesson }> = [];
    course.chapters.forEach((ch) => {
      ch.lessons.forEach((l) => {
        if (l.type === "lab" || l.lab) out.push({ chapterId: ch.id, chapterTitle: ch.title, lesson: l });
      });
    });
    return out;
  }, [course]);

  const saveDefaults = () => {
    updateSettings(course.id, {
      validityAfterLaunchDays: validityDays,
      defaultIdleShutdownMin: idleMin,
      onExpire,
    });
    toast({ title: "Defaults saved" });
  };

  const updateLab = (chapterId: string, lesson: Lesson, patch: Partial<NonNullable<Lesson["lab"]>>) => {
    const base = lesson.lab || { templateId: "", templateName: "", mode: "on-demand" as const };
    updateLesson(course.id, chapterId, lesson.id, { lab: { ...base, ...patch } });
  };

  const setTemplate = (chapterId: string, lesson: Lesson, templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    updateLab(chapterId, lesson, {
      templateId: tpl.id,
      templateName: tpl.name,
      runtimeLimitMin: lesson.lab?.runtimeLimitMin || tpl.runtimeLimit,
      accessType: lesson.lab?.accessType || "full-course",
    });
  };

  const readyCount = labLessons.filter((r) => !!r.lesson.lab?.templateId).length;

  return (
    <div className="space-y-6">
      {/* Course-wide defaults (no access model — that's per-lab now) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Course-wide defaults</CardTitle>
          <CardDescription>Validity, idle behavior, and expiry rules applied to every lab unless overridden.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Validity after first launch (days)</Label>
              <Input type="number" min={1} value={validityDays} onChange={(e) => setValidityDays(Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Default idle shutdown (min)</Label>
              <Input type="number" min={1} value={idleMin} onChange={(e) => setIdleMin(Number(e.target.value))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">On expiry</Label>
              <Select value={onExpire} onValueChange={(v) => setOnExpire(v as OnExpireBehavior)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="suspend">Suspend VM</SelectItem>
                  <SelectItem value="lock">Lock access</SelectItem>
                  <SelectItem value="delete">Delete VM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={saveDefaults}>Save defaults</Button>
          </div>
        </CardContent>
      </Card>

      {/* Per-lab template + access type */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" /> Lab templates &amp; access
            </CardTitle>
            <CardDescription>
              {readyCount} of {labLessons.length} lab lessons have a template configured. Set how each VM is rationed.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => { setRequestContext(course.name); setRequestOpen(true); }}>
            <Plus className="h-3.5 w-3.5" /> Request a template
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {labLessons.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No lab lessons in this course yet. Add lab lessons in the Content tab first.
            </p>
          )}
          {labLessons.map(({ chapterId, chapterTitle, lesson }) => {
            const lab = lesson.lab;
            const tpl = templates.find((t) => t.id === lab?.templateId);
            const ready = !!lab?.templateId;
            const accessType: LabAccessType = lab?.accessType || "full-course";
            return (
              <div key={lesson.id} className={cn("p-4 rounded-xl border", ready ? "border-border" : "border-amber-500/30 bg-amber-500/5")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                    <p className="text-[11px] text-muted-foreground">{chapterTitle}</p>
                  </div>
                  {ready ? (
                    <Badge variant="outline" className="text-[10px] gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Template set</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] bg-amber-500/10 text-amber-600 gap-1"><AlertCircle className="h-3 w-3" /> Awaiting template</Badge>
                  )}
                </div>

                {/* Template picker */}
                <div className="mt-3">
                  <Label className="text-[10px] text-muted-foreground">Template</Label>
                  <Select value={lab?.templateId || ""} onValueChange={(v) => setTemplate(chapterId, lesson, v)}>
                    <SelectTrigger className="mt-1 text-xs"><SelectValue placeholder="Choose template" /></SelectTrigger>
                    <SelectContent>
                      {templates.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs">
                          {t.name} {t.source === "sandbox" && <span className="text-muted-foreground">· sandbox</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Access type — per VM */}
                {ready && (
                  <div className="mt-3">
                    <Label className="text-[10px] text-muted-foreground mb-1.5 block">Access type for this VM</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateLab(chapterId, lesson, { accessType: "full-course" })}
                        className={cn(
                          "p-3 rounded-xl border-2 text-left transition-all",
                          accessType === "full-course" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        )}
                      >
                        <p className="text-xs font-semibold flex items-center gap-1.5"><InfinityIcon className="h-3 w-3" /> Full course access</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Unlimited usage during course validity</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLab(chapterId, lesson, { accessType: "limited" })}
                        className={cn(
                          "p-3 rounded-xl border-2 text-left transition-all",
                          accessType === "limited" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                        )}
                      >
                        <p className="text-xs font-semibold flex items-center gap-1.5"><Clock className="h-3 w-3" /> Limited usage</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Capped by hours / launches</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Per-lab caps */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Runtime / launch (min)</Label>
                    <Input
                      type="number"
                      min={5}
                      value={lab?.runtimeLimitMin ?? tpl?.runtimeLimit ?? 60}
                      onChange={(e) => updateLab(chapterId, lesson, { runtimeLimitMin: Number(e.target.value) })}
                      className="mt-1 text-xs h-9"
                      disabled={!ready}
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-muted-foreground">Idle shutdown (min)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={lab?.idleShutdownMin ?? idleMin}
                      onChange={(e) => updateLab(chapterId, lesson, { idleShutdownMin: Number(e.target.value) })}
                      className="mt-1 text-xs h-9"
                      disabled={!ready}
                    />
                  </div>
                  {accessType === "limited" && (
                    <>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Total hours cap</Label>
                        <Input
                          type="number"
                          min={1}
                          value={lab?.hoursCap ?? 10}
                          onChange={(e) => updateLab(chapterId, lesson, { hoursCap: Number(e.target.value) })}
                          className="mt-1 text-xs h-9"
                          disabled={!ready}
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground">Max launches / learner</Label>
                        <Input
                          type="number"
                          min={1}
                          value={lab?.maxLaunches ?? 10}
                          onChange={(e) => updateLab(chapterId, lesson, { maxLaunches: Number(e.target.value) })}
                          className="mt-1 text-xs h-9"
                          disabled={!ready}
                        />
                      </div>
                    </>
                  )}
                </div>

                {!ready && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-[11px] h-7 gap-1" onClick={() => { setRequestContext(`${lesson.title} (${course.name})`); setRequestOpen(true); }}>
                      <Sparkles className="h-3 w-3" /> Request a template for this lab
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <RequestTemplateSheet
        open={requestOpen}
        onOpenChange={setRequestOpen}
        contextLabel={requestContext}
        defaultCourse={course.name}
      />
    </div>
  );
}
