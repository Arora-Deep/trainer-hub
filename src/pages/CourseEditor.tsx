import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ChevronDown, ChevronRight, Plus, GripVertical, FileText, PlayCircle, HelpCircle,
  FlaskConical, Save, Eye, Settings as SettingsIcon, Trash2, Code2, Flag, ShieldCheck,
  ClipboardCheck, Send, Sparkles,
} from "lucide-react";
import { useCourseStore, type LessonType, type LabMode, type Lesson, DEFAULT_COURSE_SETTINGS, isAssessmentLesson } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { useQuizStore } from "@/stores/quizStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useExerciseStore } from "@/stores/exerciseStore";
import { Library, Brain } from "lucide-react";
import { toast } from "sonner";

const lessonTypeMeta: Record<LessonType, { label: string; icon: any; hint: string }> = {
  video: { label: "Video", icon: PlayCircle, hint: "Recorded lecture or screencast" },
  reading: { label: "Reading", icon: FileText, hint: "Rich text / markdown content" },
  quiz: { label: "Quiz", icon: HelpCircle, hint: "Knowledge check (multiple choice)" },
  assignment: { label: "Assignment", icon: ClipboardCheck, hint: "File submission" },
  "code-exercise": { label: "Code Exercise", icon: Code2, hint: "Inline editor with auto-grading (Judge0)" },
  lab: { label: "Lab", icon: FlaskConical, hint: "Attached VM blueprint" },
  "lab-instruction": { label: "Lab Instructions", icon: ClipboardCheck, hint: "Structured tasks shown inside a lab" },
  "live-session": { label: "Live Session", icon: PlayCircle, hint: "Scheduled instructor-led session" },
  "ctf-scenario": { label: "CTF Scenario", icon: Flag, hint: "Capture-the-flag with flag submission" },
  exam: { label: "Exam", icon: ShieldCheck, hint: "Timed / proctored — gates certification" },
  "mock-exam": { label: "Mock Exam", icon: ShieldCheck, hint: "Practice run, ungraded" },
  survey: { label: "Survey", icon: HelpCircle, hint: "Collect learner feedback" },
  "game-based-learning": { label: "Game-based Learning", icon: Flag, hint: "Gamified challenge — points, rounds, leaderboard" },
};

export default function CourseEditor() {
  const { id = "" } = useParams();
  const { courses, updateCourse, updateSettings, submitForReview, addChapter, addLesson, updateLesson, deleteLesson, deleteChapter } = useCourseStore();
  const course = courses.find((c) => c.id === id) ?? courses[0];
  const settings = course?.settings ?? DEFAULT_COURSE_SETTINGS;

  const [tab, setTab] = useState<"content" | "settings">("content");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(course?.chapters[0]?.lessons[0]?.id ?? null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState<{ chapterId: string } | null>(null);
  const [pickerStage, setPickerStage] = useState<{ type: LessonType; source: "inline" | "library"; refId: string } | null>(null);

  const { quizzes } = useQuizStore();
  const { assignments } = useAssignmentStore();
  const { exercises } = useExerciseStore();

  const pickerLibOptions = (() => {
    if (!pickerStage) return [];
    if (pickerStage.type === "quiz") return quizzes.map((q) => ({ id: q.id, label: q.title }));
    if (pickerStage.type === "assignment") return assignments.map((a) => ({ id: a.id, label: a.title }));
    if (pickerStage.type === "code-exercise") return exercises.map((e) => ({ id: e.id, label: e.title }));
    return [];
  })();

  const { selectedLesson, selectedChapterId } = useMemo(() => {
    if (!course || !selectedLessonId) return { selectedLesson: undefined, selectedChapterId: undefined };
    for (const ch of course.chapters) {
      const l = ch.lessons.find((x) => x.id === selectedLessonId);
      if (l) return { selectedLesson: l, selectedChapterId: ch.id };
    }
    return { selectedLesson: undefined, selectedChapterId: undefined };
  }, [course, selectedLessonId]);

  if (!course) return <div className="p-6 text-sm text-muted-foreground">Course not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={course.name}
        description={course.description ?? "Edit course content, settings, and lab attachments"}
        breadcrumbs={[{ label: "Courses", href: "/courses" }, { label: course.name }]}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] capitalize">{course.moderation ?? "draft"}</Badge>
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <SettingsIcon className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/courses/${course.id}`}><Eye className="mr-2 h-4 w-4" /> Preview</Link>
            </Button>
            {settings.visibility === "marketplace" && course.moderation !== "approved" && (
              <Button variant="outline" size="sm" onClick={() => { submitForReview(course.id); toast.success("Submitted for review"); }}>
                <Send className="mr-2 h-4 w-4" /> Submit for review
              </Button>
            )}
            <Button size="sm" onClick={() => toast.success("Course saved")}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            {/* Module tree */}
            <Card className="h-fit">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm">Modules</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { addChapter(course.id, `New module ${course.chapters.length + 1}`); }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-1">
                {course.chapters.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No modules yet.<br />Click + to add one.</p>
                )}
                {course.chapters.map((ch, ci) => (
                  <ChapterNode
                    key={ch.id}
                    index={ci}
                    chapter={ch}
                    selectedLessonId={selectedLessonId}
                    onSelectLesson={setSelectedLessonId}
                    onAddLesson={() => setPickerOpen({ chapterId: ch.id })}
                    onDeleteLesson={(lid) => deleteLesson(course.id, ch.id, lid)}
                    onDeleteChapter={() => deleteChapter(course.id, ch.id)}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Lesson editor */}
            <div className="space-y-4">
              {selectedLesson && selectedChapterId ? (
                <LessonEditor
                  key={selectedLesson.id}
                  courseId={course.id}
                  chapterId={selectedChapterId}
                  lesson={selectedLesson}
                  onChange={(updates) => updateLesson(course.id, selectedChapterId, selectedLesson.id, updates)}
                />
              ) : (
                <Card>
                  <CardContent className="py-16 text-center text-sm text-muted-foreground">
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Select a lesson on the left, or add one to a module.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <CourseSettingsForm
            settings={settings}
            onChange={(updates) => updateSettings(course.id, updates)}
          />
        </TabsContent>
      </Tabs>

      {/* Add-lesson picker */}
      <Sheet open={!!pickerOpen} onOpenChange={(o) => { if (!o) { setPickerOpen(null); setPickerStage(null); } }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{pickerStage ? `Add ${lessonTypeMeta[pickerStage.type].label}` : "Add a lesson"}</SheetTitle>
            <SheetDescription>
              {pickerStage ? "Create new or pick an existing item from the library." : "Pick the block type to add to this module."}
            </SheetDescription>
          </SheetHeader>

          {!pickerStage && (
            <div className="grid gap-2 mt-4">
              {Object.entries(lessonTypeMeta).map(([type, meta]) => {
                const Icon = meta.icon;
                const lt = type as LessonType;
                const handle = () => {
                  if (!pickerOpen) return;
                  if (isAssessmentLesson(lt)) {
                    setPickerStage({ type: lt, source: "inline", refId: "" });
                    return;
                  }
                  addLesson(course.id, pickerOpen.chapterId, {
                    title: `New ${meta.label}`,
                    type: lt,
                    duration: lt === "video" ? "10 min" : lt === "lab" || lt === "ctf-scenario" ? "open" : "15 min",
                  });
                  setPickerOpen(null);
                };
                return (
                  <button
                    key={type}
                    onClick={handle}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-all text-left"
                  >
                    <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{meta.label}</p>
                      <p className="text-xs text-muted-foreground">{meta.hint}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {pickerStage && (
            <div className="mt-4 space-y-4">
              <div>
                <Label className="text-xs">Source</Label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {(["inline", "library"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setPickerStage({ ...pickerStage, source: s, refId: "" })}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-all",
                        pickerStage.source === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/40"
                      )}
                    >
                      {s === "library" ? <Library className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      <span className="font-medium">{s === "inline" ? "Create new" : "Pick from library"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {pickerStage.source === "library" && (
                <div>
                  <Label className="text-xs">Library item</Label>
                  <Select value={pickerStage.refId} onValueChange={(v) => setPickerStage({ ...pickerStage, refId: v })}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder={`Choose a ${lessonTypeMeta[pickerStage.type].label.toLowerCase()}…`} />
                    </SelectTrigger>
                    <SelectContent>
                      {pickerLibOptions.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">No items in library.</div>
                      ) : (
                        pickerLibOptions.map((o) => (
                          <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <SheetFooter className="!justify-between pt-2">
                <Button variant="outline" onClick={() => setPickerStage(null)}>Back</Button>
                <Button
                  disabled={pickerStage.source === "library" && !pickerStage.refId}
                  onClick={() => {
                    if (!pickerOpen) return;
                    const meta = lessonTypeMeta[pickerStage.type];
                    const opt = pickerLibOptions.find((o) => o.id === pickerStage.refId);
                    const payload: Omit<Lesson, "id"> = {
                      title: pickerStage.source === "library" ? (opt?.label ?? `New ${meta.label}`) : `New ${meta.label}`,
                      type: pickerStage.type,
                      duration: "15 min",
                      source: pickerStage.source,
                      refId: pickerStage.source === "library" ? pickerStage.refId : undefined,
                    };
                    addLesson(course.id, pickerOpen.chapterId, payload);
                    setPickerStage(null);
                    setPickerOpen(null);
                  }}
                >
                  Add
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Settings drawer */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Course settings</SheetTitle>
            <SheetDescription>Delivery, lab policy, prerequisites, completion & certification rules.</SheetDescription>
          </SheetHeader>
          <div className="mt-5">
            <CourseSettingsForm
              settings={settings}
              onChange={(updates) => updateSettings(course.id, updates)}
            />
          </div>
          <SheetFooter className="mt-6">
            <Button onClick={() => { setSettingsOpen(false); toast.success("Settings updated"); }}>Done</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ChapterNode({ index, chapter, selectedLessonId, onSelectLesson, onAddLesson, onDeleteLesson, onDeleteChapter }: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1 rounded-md px-2 py-1.5 hover:bg-muted group">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab" />
        <button onClick={() => setOpen((o) => !o)} className="flex-1 flex items-center gap-1.5 text-left text-sm font-medium">
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          <span className="truncate">{index + 1}. {chapter.title}</span>
        </button>
        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={onDeleteChapter}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      {open && (
        <div className="ml-5 space-y-0.5">
          {chapter.lessons.map((l: any) => {
            const meta = lessonTypeMeta[l.type as LessonType];
            const Icon = meta?.icon ?? FileText;
            const active = l.id === selectedLessonId;
            return (
              <div key={l.id} className={cn("flex items-center gap-1 rounded-md px-2 py-1 group", active ? "bg-primary/10 text-primary" : "hover:bg-muted")}>
                <button onClick={() => onSelectLesson(l.id)} className="flex-1 flex items-center gap-2 text-left text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate flex-1">{l.title}</span>
                  {l.source === "library" && (
                    <Library className="h-3 w-3 text-primary/70" />
                  )}
                  <span className="text-[10px] text-muted-foreground capitalize">{meta?.label}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={() => onDeleteLesson(l.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
          <button onClick={onAddLesson} className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
            <Plus className="h-3.5 w-3.5" /> Add lesson
          </button>
        </div>
      )}
    </div>
  );
}

function LessonEditor({ courseId, chapterId, lesson, onChange }: any) {
  const { templates } = useLabStore();
  const meta = lessonTypeMeta[lesson.type as LessonType];
  const Icon = meta?.icon ?? FileText;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
          <div>
            <CardTitle className="text-sm">{meta.label}</CardTitle>
            <p className="text-[11px] text-muted-foreground">{meta.hint}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Title">
            <Input value={lesson.title} onChange={(e) => onChange({ title: e.target.value })} />
          </Field>
          <Field label="Estimated duration">
            <Input value={lesson.duration} onChange={(e) => onChange({ duration: e.target.value })} placeholder="e.g. 15 min" />
          </Field>
        </div>

        {lesson.type === "video" && (
          <Field label="Video URL">
            <Input value={lesson.videoUrl ?? ""} onChange={(e) => onChange({ videoUrl: e.target.value })} placeholder="https://..." />
          </Field>
        )}

        {lesson.type === "reading" && (
          <Field label="Reading content">
            <Textarea rows={6} value={lesson.body ?? ""} onChange={(e) => onChange({ body: e.target.value })} placeholder="Write the lesson body…" />
          </Field>
        )}

        {lesson.type === "code-exercise" && (
          <Field label="Language">
            <Select value={lesson.language ?? "python"} onValueChange={(v) => onChange({ language: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["python", "javascript", "typescript", "java", "go", "rust", "cpp"].map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        {(lesson.type === "lab" || lesson.type === "ctf-scenario") && (
          <div className="space-y-3 p-3 rounded-lg border border-border bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lab attachment</p>
            <Field label="Blueprint">
              <Select
                value={lesson.lab?.templateId ?? ""}
                onValueChange={(v) => {
                  const tpl = templates.find((t) => t.id === v);
                  onChange({ lab: { ...(lesson.lab ?? { mode: "on-demand" as LabMode }), templateId: v, templateName: tpl?.name ?? v } });
                }}
              >
                <SelectTrigger><SelectValue placeholder="Pick a lab template…" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Mode">
              <Select
                value={lesson.lab?.mode ?? "on-demand"}
                onValueChange={(v) => onChange({ lab: { ...(lesson.lab ?? { templateId: "", templateName: "" }), mode: v as LabMode } })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-demand">On-demand — student launches, auto-suspends</SelectItem>
                  <SelectItem value="persistent">Persistent — VM stays for the entire course validity</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {lesson.lab?.mode === "on-demand" && (
              <Field label="Estimated hours per session">
                <Input
                  type="number"
                  step="0.5"
                  value={lesson.lab?.estimatedHours ?? 1}
                  onChange={(e) => onChange({ lab: { ...(lesson.lab ?? { templateId: "", templateName: "", mode: "on-demand" }), estimatedHours: Number(e.target.value) } })}
                />
              </Field>
            )}
          </div>
        )}

        {lesson.type === "exam" && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
            <div>
              <p className="text-sm font-medium">Proctored exam</p>
              <p className="text-xs text-muted-foreground">Camera + lockdown browser required during attempt.</p>
            </div>
            <Switch checked={!!lesson.proctored} onCheckedChange={(v) => onChange({ proctored: v })} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CourseSettingsForm({ settings, onChange }: any) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-sm">Delivery & validity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Delivery type">
            <Select value={settings.deliveryType} onValueChange={(v) => onChange({ deliveryType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="self-paced">Self-paced</SelectItem>
                <SelectItem value="instructor-led">Instructor-led (live)</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Validity model">
            <Select value={settings.validityModel} onValueChange={(v) => onChange({ validityModel: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="days-from-enrollment">Fixed days from enrollment</SelectItem>
                <SelectItem value="fixed-end-date">Fixed end date</SelectItem>
                <SelectItem value="cohort">Rolling cohort</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {settings.validityModel === "days-from-enrollment" && (
            <Field label="Validity (days)">
              <Input type="number" value={settings.validityDays ?? 90} onChange={(e) => onChange({ validityDays: Number(e.target.value) })} />
            </Field>
          )}
          {settings.validityModel === "fixed-end-date" && (
            <Field label="End date">
              <Input type="date" value={settings.endDate ?? ""} onChange={(e) => onChange({ endDate: e.target.value })} />
            </Field>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Lab policy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label="Lab access model">
            <Select value={settings.labPolicy} onValueChange={(v) => onChange({ labPolicy: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly-wallet">Hourly wallet — N hours per student</SelectItem>
                <SelectItem value="unlimited-during-validity">Unlimited during course validity</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground mt-1">
              Hourly wallet applies only to on-demand labs. Persistent labs are always-on for the validity window regardless of policy.
            </p>
          </Field>
          {settings.labPolicy === "hourly-wallet" && (
            <Field label="Lab wallet hours per student">
              <Input type="number" value={settings.labWalletHours ?? 20} onChange={(e) => onChange({ labWalletHours: Number(e.target.value) })} />
            </Field>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Completion & certification</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Field label={`Minimum lesson completion (${settings.completionMinPct}%)`}>
            <Input type="range" min={50} max={100} value={settings.completionMinPct} onChange={(e) => onChange({ completionMinPct: Number(e.target.value) })} />
          </Field>
          <Field label={`Minimum quiz score (${settings.completionMinQuizScore}%)`}>
            <Input type="range" min={0} max={100} value={settings.completionMinQuizScore} onChange={(e) => onChange({ completionMinQuizScore: Number(e.target.value) })} />
          </Field>
          <ToggleRow label="Require final exam to pass" checked={settings.requireExam} onChange={(v) => onChange({ requireExam: v })} />
          <ToggleRow label="Issue certificate on completion" checked={settings.issuesCertificate} onChange={(v) => onChange({ issuesCertificate: v })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Structure & visibility</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow label="Sequential — must complete lessons in order" checked={settings.sequential} onChange={(v) => onChange({ sequential: v })} />
          <ToggleRow label="Enable course discussion" checked={settings.discussionEnabled} onChange={(v) => onChange({ discussionEnabled: v })} />
          <Separator />
          <Field label="Visibility">
            <Select value={settings.visibility} onValueChange={(v) => onChange({ visibility: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private — assigned batches only</SelectItem>
                <SelectItem value="customer">Customer — anyone in my organization</SelectItem>
                <SelectItem value="marketplace">Marketplace — public (requires CloudAdda approval)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
