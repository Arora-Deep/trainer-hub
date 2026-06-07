import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video, FileText, HelpCircle, ClipboardList, Code2, FlaskConical, Flag, GraduationCap,
  Upload, Link2, Library, Plus, X, FileUp, Trash2, Radio, ListChecks, MessageSquareQuote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TemplatePickerDropdown } from "@/components/labs/TemplatePickerDropdown";
import { useLabStore } from "@/stores/labStore";
import { useQuizStore } from "@/stores/quizStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useExerciseStore } from "@/stores/exerciseStore";
import { isAssessmentLesson, type Lesson, type LessonType, type LessonAttachment, type LabInstructionTask, type LabInstructionResource, type LabAllocation, type LabAllocationType } from "@/stores/courseStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const typeMeta: Record<LessonType, { label: string; icon: any; hint: string }> = {
  video: { label: "Video", icon: Video, hint: "Upload a video file or paste a YouTube / Vimeo / MP4 link." },
  reading: { label: "Reading / Document", icon: FileText, hint: "Write content directly or attach PDFs and slides." },
  quiz: { label: "Quiz", icon: HelpCircle, hint: "Create a quiz inline or pull one from your library." },
  assignment: { label: "Assignment", icon: ClipboardList, hint: "Add a graded assignment with submission rules." },
  "code-exercise": { label: "Code Exercise", icon: Code2, hint: "Define a coding challenge with starter code and tests." },
  lab: { label: "Lab", icon: FlaskConical, hint: "Attach a lab template with an allocation rule." },
  "lab-instruction": { label: "Lab Instructions", icon: ListChecks, hint: "Structured step-by-step instructions students follow inside a lab." },
  "live-session": { label: "Live Session", icon: Radio, hint: "Schedule a live instructor-led session." },
  "ctf-scenario": { label: "CTF Scenario", icon: Flag, hint: "Capture-the-flag style scenario on a lab box." },
  exam: { label: "Exam", icon: GraduationCap, hint: "Final graded assessment, optionally proctored." },
  "mock-exam": { label: "Mock Exam", icon: GraduationCap, hint: "Practice exam — same shape as the real one, but ungraded." },
  survey: { label: "Survey", icon: MessageSquareQuote, hint: "Collect feedback from learners." },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Lesson | null;
  defaultType?: LessonType;
  onSave: (lesson: Omit<Lesson, "id"> & { id?: string }) => void;
}

export function LessonEditorSheet({ open, onOpenChange, initial, defaultType, onSave }: Props) {
  const { templates } = useLabStore();
  const { quizzes } = useQuizStore();
  const { assignments } = useAssignmentStore();
  const { exercises } = useExerciseStore();

  const [form, setForm] = useState<Lesson>(() => emptyLesson(defaultType));
  const [videoMode, setVideoMode] = useState<"url" | "upload">("url");

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyLesson(defaultType));
      setVideoMode(initial?.videoFileName ? "upload" : "url");
    }
  }, [open, initial, defaultType]);

  const setField = <K extends keyof Lesson>(k: K, v: Lesson[K]) => setForm((p) => ({ ...p, [k]: v }));
  const Icon = typeMeta[form.type].icon;
  const isAssess = isAssessmentLesson(form.type);

  const libraryOptions = (() => {
    if (form.type === "quiz") return quizzes.map((q) => ({ id: q.id, label: q.title }));
    if (form.type === "assignment") return assignments.map((a) => ({ id: a.id, label: a.title }));
    if (form.type === "code-exercise") return exercises.map((e) => ({ id: e.id, label: e.title }));
    return [];
  })();

  const createNewHref =
    form.type === "quiz" ? "/quizzes/create"
    : form.type === "assignment" ? "/assignments/create"
    : form.type === "code-exercise" ? "/exercises/create"
    : null;

  const handleFileAttach = (files: FileList | null) => {
    if (!files) return;
    const next: LessonAttachment[] = Array.from(files).map((f) => ({ name: f.name, size: f.size, kind: f.type }));
    setForm((p) => ({ ...p, attachments: [...(p.attachments ?? []), ...next] }));
  };

  const removeAttachment = (i: number) =>
    setForm((p) => ({ ...p, attachments: (p.attachments ?? []).filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Lesson title is required"); return; }
    if (form.source === "library" && !form.refId) { toast.error("Pick an item from the library"); return; }
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            {initial ? "Edit lesson" : "Add lesson"}
          </SheetTitle>
          <SheetDescription>{typeMeta[form.type].hint}</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-5">
          {/* Common */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs">Lesson title</Label>
              <Input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g., What is AWS?" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Duration</Label>
              <Input value={form.duration} onChange={(e) => setField("duration", e.target.value)} placeholder="15 min" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <Select value={form.type} onValueChange={(v: LessonType) => setForm((p) => ({ ...p, type: v, source: isAssessmentLesson(v) ? (p.source ?? "inline") : undefined }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(typeMeta) as LessonType[]).map((t) => {
                  const I = typeMeta[t].icon;
                  return (
                    <SelectItem key={t} value={t}>
                      <div className="flex items-center gap-2"><I className="h-3.5 w-3.5" />{typeMeta[t].label}</div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Short summary</Label>
            <Textarea rows={2} value={form.summary ?? ""} onChange={(e) => setField("summary", e.target.value)} placeholder="One-line description shown in the lesson list." />
          </div>

          {/* Type-specific */}
          <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{typeMeta[form.type].label} content</p>

            {form.type === "video" && (
              <Tabs value={videoMode} onValueChange={(v) => setVideoMode(v as any)}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="url"><Link2 className="h-3.5 w-3.5 mr-1.5" />Paste URL</TabsTrigger>
                  <TabsTrigger value="upload"><Upload className="h-3.5 w-3.5 mr-1.5" />Upload file</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2 pt-3">
                  <Input value={form.videoUrl ?? ""} onChange={(e) => setField("videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..." />
                  {form.videoUrl && (
                    <div className="aspect-video rounded-md bg-black/80 flex items-center justify-center text-xs text-white/70 border">
                      <Video className="h-6 w-6 mr-2" /> Preview · {form.videoUrl.slice(0, 50)}…
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="upload" className="space-y-2 pt-3">
                  <label className="flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed py-8 cursor-pointer hover:bg-muted/40 transition-colors">
                    <FileUp className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm font-medium">Drop a video file or click to browse</span>
                    <span className="text-[11px] text-muted-foreground">MP4 / WebM / MOV · up to 2 GB</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) { setField("videoFileName", f.name); toast.success(`${f.name} attached`); }
                      }}
                    />
                  </label>
                  {form.videoFileName && (
                    <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
                      <span className="flex items-center gap-2"><Video className="h-3.5 w-3.5 text-primary" />{form.videoFileName}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setField("videoFileName", undefined)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {form.type === "video" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Transcript (optional)</Label>
                <Textarea rows={4} value={form.transcript ?? ""} onChange={(e) => setField("transcript", e.target.value)} placeholder="Paste transcript or closed captions text…" />
              </div>
            )}

            {form.type === "reading" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Content</Label>
                <Textarea
                  rows={10}
                  value={form.body ?? ""}
                  onChange={(e) => setField("body", e.target.value)}
                  placeholder={"# Heading\n\nWrite lesson content here. Markdown is supported."}
                  className="font-mono text-sm"
                />
                <p className="text-[11px] text-muted-foreground">Tip: use markdown for headings, lists, code blocks.</p>
              </div>
            )}

            {(form.type === "reading" || form.type === "video") && (
              <AttachmentsBlock
                attachments={form.attachments ?? []}
                onAdd={handleFileAttach}
                onRemove={removeAttachment}
                allowDownload={form.allowDownload ?? true}
                onToggleDownload={(v) => setField("allowDownload", v)}
              />
            )}

            {(form.type === "lab" || form.type === "ctf-scenario") && (
              <div className="space-y-3">
                <Label className="text-xs">Lab template</Label>
                <TemplatePickerDropdown
                  templates={templates}
                  selectedId={form.lab?.templateId}
                  onSelect={(t) => setForm((p) => ({
                    ...p,
                    lab: { templateId: t.id, templateName: t.name, mode: p.lab?.mode ?? "on-demand", estimatedHours: p.lab?.estimatedHours ?? 1 },
                  }))}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Mode</Label>
                    <Select
                      value={form.lab?.mode ?? "on-demand"}
                      onValueChange={(v: "on-demand" | "persistent") => setForm((p) => ({ ...p, lab: { ...(p.lab ?? { templateId: "", templateName: "" }), mode: v } as any }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-demand">On-demand</SelectItem>
                        <SelectItem value="persistent">Persistent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Estimated hours</Label>
                    <Input type="number" min={0} value={form.lab?.estimatedHours ?? 1} onChange={(e) => setForm((p) => ({ ...p, lab: { ...(p.lab ?? { templateId: "", templateName: "", mode: "on-demand" }), estimatedHours: Number(e.target.value) } as any }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Success criteria</Label>
                  <Textarea rows={3} value={form.successCriteria ?? ""} onChange={(e) => setField("successCriteria", e.target.value)} placeholder="What does the learner need to achieve in this lab?" />
                </div>
              </div>
            )}

            {form.type === "code-exercise" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Language</Label>
                    <Select value={form.language ?? "python"} onValueChange={(v) => setField("language", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["python", "javascript", "typescript", "java", "cpp", "go", "rust"].map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Time limit (min)</Label>
                    <Input type="number" value={form.timeLimit ?? ""} onChange={(e) => setField("timeLimit", Number(e.target.value))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Starter code</Label>
                  <Textarea rows={6} value={form.starterCode ?? ""} onChange={(e) => setField("starterCode", e.target.value)} className="font-mono text-xs" placeholder="// starter code shown in the editor" />
                </div>
              </div>
            )}

            {isAssess && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {(["inline", "library"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, source: s, refId: s === "inline" ? undefined : p.refId }))}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition-all",
                        (form.source ?? "inline") === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/40"
                      )}
                    >
                      {s === "library" ? <Library className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      <span className="font-medium">{s === "inline" ? "Create new" : "Pick from library"}</span>
                    </button>
                  ))}
                </div>

                {form.source === "library" ? (
                  <Select value={form.refId ?? ""} onValueChange={(v) => {
                    const opt = libraryOptions.find((o) => o.id === v);
                    setForm((p) => ({ ...p, refId: v, title: opt?.label ?? p.title }));
                  }}>
                    <SelectTrigger><SelectValue placeholder="Choose an item…" /></SelectTrigger>
                    <SelectContent>
                      {libraryOptions.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">No items yet.</div>
                      ) : libraryOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : createNewHref ? (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to={createNewHref} target="_blank"><Plus className="h-3.5 w-3.5 mr-1" />Open full builder in new tab</Link>
                  </Button>
                ) : null}

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Passing %</Label>
                    <Input type="number" min={0} max={100} value={form.passingScore ?? ""} onChange={(e) => setField("passingScore", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Attempts</Label>
                    <Input type="number" min={1} value={form.attempts ?? ""} onChange={(e) => setField("attempts", Number(e.target.value))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Time (min)</Label>
                    <Input type="number" min={0} value={form.timeLimit ?? ""} onChange={(e) => setField("timeLimit", Number(e.target.value))} />
                  </div>
                </div>

                {form.type === "exam" && (
                  <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Proctored exam</p>
                      <p className="text-[11px] text-muted-foreground">Enable webcam + screen monitoring.</p>
                    </div>
                    <Switch checked={!!form.proctored} onCheckedChange={(v) => setField("proctored", v)} />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">Learner instructions</Label>
              <Textarea rows={3} value={form.instructions ?? ""} onChange={(e) => setField("instructions", e.target.value)} placeholder="What should the learner do in this lesson?" />
            </div>
          </div>

          {/* Grading + completion */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
              <div>
                <p className="text-sm font-medium">Required</p>
                <p className="text-[11px] text-muted-foreground">Must complete to progress.</p>
              </div>
              <Switch checked={!!form.required} onCheckedChange={(v) => setField("required", v)} />
            </div>
            {isAssess && (
              <div className="space-y-1.5">
                <Label className="text-xs">Weight in final grade (%)</Label>
                <Input type="number" min={0} max={100} value={form.weight ?? ""} onChange={(e) => setField("weight", Number(e.target.value))} />
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>{initial ? "Save changes" : "Add lesson"}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function emptyLesson(defaultType?: LessonType): Lesson {
  return {
    id: "",
    title: "",
    type: defaultType ?? "video",
    duration: "",
    allowDownload: true,
    attachments: [],
  };
}

function AttachmentsBlock({
  attachments, onAdd, onRemove, allowDownload, onToggleDownload,
}: {
  attachments: LessonAttachment[];
  onAdd: (files: FileList | null) => void;
  onRemove: (i: number) => void;
  allowDownload: boolean;
  onToggleDownload: (v: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">Attachments</Label>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Allow download</span>
          <Switch checked={allowDownload} onCheckedChange={onToggleDownload} />
        </div>
      </div>
      <label className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-xs cursor-pointer hover:bg-muted/40">
        <Upload className="h-3.5 w-3.5" />
        Add files (PDF, slides, code…)
        <input type="file" multiple className="hidden" onChange={(e) => onAdd(e.target.files)} />
      </label>
      {attachments.length > 0 && (
        <div className="space-y-1">
          {attachments.map((a, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border bg-card px-3 py-1.5 text-xs">
              <span className="flex items-center gap-2 truncate"><FileText className="h-3.5 w-3.5 text-muted-foreground" />{a.name}{a.size ? <span className="text-muted-foreground"> · {(a.size / 1024).toFixed(0)} KB</span> : null}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRemove(i)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
