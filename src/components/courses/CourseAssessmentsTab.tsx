import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, HelpCircle, ClipboardCheck, Code2, Trash2, Pencil, GripVertical,
  ChevronDown, ChevronRight, BookOpen, Flag,
} from "lucide-react";
import {
  useCourseStore,
  type AssessmentKind,
  type AssessmentPlacement,
  type CourseAssessment,
  type Course,
} from "@/stores/courseStore";
import { useQuizStore } from "@/stores/quizStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useExerciseStore } from "@/stores/exerciseStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const kindMeta: Record<AssessmentKind, { label: string; icon: any; color: string }> = {
  quiz: { label: "Quiz", icon: HelpCircle, color: "text-info" },
  assignment: { label: "Assignment", icon: ClipboardCheck, color: "text-warning" },
  exercise: { label: "Code Exercise", icon: Code2, color: "text-primary" },
};

function placementLabel(p: AssessmentPlacement, course: Course): string {
  if (p.type === "course-start") return "Course start";
  if (p.type === "course-end") return "Course end (final)";
  if (p.type === "after-module") {
    const ch = course.chapters.find((c) => c.id === p.chapterId);
    const idx = course.chapters.findIndex((c) => c.id === p.chapterId);
    return ch ? `After Module ${idx + 1}: ${ch.title}` : "After module";
  }
  const ch = course.chapters.find((c) => c.id === p.chapterId);
  const lesson = ch?.lessons.find((l) => l.id === p.lessonId);
  return lesson ? `After lesson: ${lesson.title}` : "After lesson";
}

function placementKey(p: AssessmentPlacement): string {
  if (p.type === "course-start") return "course-start";
  if (p.type === "course-end") return "course-end";
  if (p.type === "after-module") return `module:${p.chapterId}`;
  return `lesson:${p.chapterId}:${p.lessonId}`;
}

export function CourseAssessmentsTab({ course }: { course: Course }) {
  const { addAssessment, updateAssessment, deleteAssessment } = useCourseStore();
  const { quizzes } = useQuizStore();
  const { assignments } = useAssignmentStore();
  const { exercises } = useExerciseStore();

  const [picker, setPicker] = useState<{ placement: AssessmentPlacement } | null>(null);
  const [editing, setEditing] = useState<CourseAssessment | null>(null);

  const assessments = course.assessments ?? [];
  const grouped = useMemo(() => {
    const map = new Map<string, CourseAssessment[]>();
    for (const a of assessments) {
      const k = placementKey(a.placement);
      const list = map.get(k) ?? [];
      list.push(a);
      map.set(k, list);
    }
    return map;
  }, [assessments]);

  const totalWeight = assessments.reduce((s, a) => s + (a.weight || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
        <div>
          <p className="text-sm font-semibold">Assessments</p>
          <p className="text-xs text-muted-foreground">
            {assessments.length} attached · {totalWeight}% total grade weight
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="gap-1"><HelpCircle className="h-3 w-3" /> {assessments.filter(a => a.kind === "quiz").length} quizzes</Badge>
          <Badge variant="outline" className="gap-1"><ClipboardCheck className="h-3 w-3" /> {assessments.filter(a => a.kind === "assignment").length} assignments</Badge>
          <Badge variant="outline" className="gap-1"><Code2 className="h-3 w-3" /> {assessments.filter(a => a.kind === "exercise").length} exercises</Badge>
        </div>
      </div>

      {/* Outline with insertion points */}
      <Card>
        <CardContent className="p-4 space-y-2">
          {/* Course start slot */}
          <PlacementSlot
            label="Course start"
            icon={<Flag className="h-3.5 w-3.5" />}
            items={grouped.get("course-start") ?? []}
            course={course}
            onAdd={() => setPicker({ placement: { type: "course-start" } })}
            onEdit={setEditing}
            onDelete={(id) => { deleteAssessment(course.id, id); toast.success("Assessment removed"); }}
          />

          {course.chapters.length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-8 border-2 border-dashed rounded-md">
              Add modules to the course to attach mid-course assessments.
            </div>
          )}

          {course.chapters.map((ch, ci) => (
            <ChapterBlock
              key={ch.id}
              chapter={ch}
              index={ci}
              course={course}
              grouped={grouped}
              onAddAfterLesson={(lessonId) => setPicker({ placement: { type: "after-lesson", chapterId: ch.id, lessonId } })}
              onAddAfterModule={() => setPicker({ placement: { type: "after-module", chapterId: ch.id } })}
              onEdit={setEditing}
              onDelete={(id) => { deleteAssessment(course.id, id); toast.success("Assessment removed"); }}
            />
          ))}

          {/* Course end slot */}
          <PlacementSlot
            label="Course end (final)"
            icon={<Flag className="h-3.5 w-3.5" />}
            items={grouped.get("course-end") ?? []}
            course={course}
            onAdd={() => setPicker({ placement: { type: "course-end" } })}
            onEdit={setEditing}
            onDelete={(id) => { deleteAssessment(course.id, id); toast.success("Assessment removed"); }}
          />
        </CardContent>
      </Card>

      {/* Picker sheet (add) */}
      <Sheet open={!!picker} onOpenChange={(o) => !o && setPicker(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Attach an assessment</SheetTitle>
            <SheetDescription>
              {picker && `Placement — ${placementLabel(picker.placement, course)}`}
            </SheetDescription>
          </SheetHeader>
          {picker && (
            <PickerForm
              quizzes={quizzes}
              assignments={assignments}
              exercises={exercises}
              onSubmit={(payload) => {
                addAssessment(course.id, { ...payload, placement: picker.placement });
                toast.success("Assessment attached");
                setPicker(null);
              }}
              onCancel={() => setPicker(null)}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Edit sheet */}
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit assessment</SheetTitle>
            <SheetDescription>
              {editing && placementLabel(editing.placement, course)}
            </SheetDescription>
          </SheetHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-xs">Display title</Label>
                <Input
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Weight (%)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editing.weight}
                    onChange={(e) => setEditing({ ...editing, weight: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-end justify-between rounded-md border px-3 py-2">
                  <span className="text-xs">Required to progress</span>
                  <Switch
                    checked={editing.required}
                    onCheckedChange={(v) => setEditing({ ...editing, required: v })}
                  />
                </div>
              </div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => {
              if (!editing) return;
              updateAssessment(course.id, editing.id, {
                title: editing.title, weight: editing.weight, required: editing.required,
              });
              toast.success("Updated");
              setEditing(null);
            }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ChapterBlock({
  chapter, index, course, grouped, onAddAfterLesson, onAddAfterModule, onEdit, onDelete,
}: any) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-lg border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/40 rounded-t-lg"
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm font-medium flex-1">Module {index + 1}: {chapter.title}</span>
        <span className="text-[10px] text-muted-foreground">{chapter.lessons.length} lessons</span>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-1.5">
          {chapter.lessons.map((l: any) => (
            <div key={l.id}>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/30 text-xs">
                <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="flex-1 truncate">{l.title}</span>
                <span className="text-[10px] text-muted-foreground capitalize">{l.type}</span>
              </div>
              <PlacementSlot
                indent
                label="After this lesson"
                items={grouped.get(`lesson:${chapter.id}:${l.id}`) ?? []}
                course={course}
                onAdd={() => onAddAfterLesson(l.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          ))}

          <PlacementSlot
            label={`End of Module ${index + 1}`}
            items={grouped.get(`module:${chapter.id}`) ?? []}
            course={course}
            onAdd={onAddAfterModule}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
}

function PlacementSlot({
  label, items, course, onAdd, onEdit, onDelete, indent, icon,
}: {
  label: string;
  items: CourseAssessment[];
  course: Course;
  onAdd: () => void;
  onEdit: (a: CourseAssessment) => void;
  onDelete: (id: string) => void;
  indent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1", indent && "ml-5")}>
      {items.map((a) => {
        const meta = kindMeta[a.kind];
        const Icon = meta.icon;
        return (
          <div
            key={a.id}
            className="group flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-primary/20 bg-primary/5"
          >
            <GripVertical className="h-3 w-3 text-muted-foreground/60" />
            <Icon className={cn("h-3.5 w-3.5", meta.color)} />
            <span className="text-xs font-medium flex-1 truncate">{a.title}</span>
            <Badge variant="outline" className="text-[10px]">{meta.label}</Badge>
            {a.required && <Badge className="text-[10px] bg-warning/15 text-warning border-warning/30">Required</Badge>}
            <span className="text-[10px] text-muted-foreground w-10 text-right">{a.weight}%</span>
            <div className="flex opacity-0 group-hover:opacity-100">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEdit(a)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDelete(a.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      })}
      <button
        onClick={onAdd}
        className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-md border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
      >
        {icon ?? <Plus className="h-3 w-3" />}
        <span>Add assessment — <span className="opacity-70">{label}</span></span>
      </button>
    </div>
  );
}

function PickerForm({
  quizzes, assignments, exercises, onSubmit, onCancel,
}: any) {
  const [kind, setKind] = useState<AssessmentKind>("quiz");
  const [refId, setRefId] = useState<string>("");
  const [weight, setWeight] = useState<number>(10);
  const [required, setRequired] = useState<boolean>(true);

  const options: { id: string; label: string }[] = useMemo(() => {
    if (kind === "quiz") return quizzes.map((q: any) => ({ id: q.id, label: q.title }));
    if (kind === "assignment") return assignments.map((a: any) => ({ id: a.id, label: a.title }));
    return exercises.map((e: any) => ({ id: e.id, label: e.title }));
  }, [kind, quizzes, assignments, exercises]);

  const selected = options.find((o) => o.id === refId);

  return (
    <div className="py-4 space-y-4">
      <div>
        <Label className="text-xs">Assessment type</Label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {(Object.keys(kindMeta) as AssessmentKind[]).map((k) => {
            const m = kindMeta[k];
            const Icon = m.icon;
            const active = kind === k;
            return (
              <button
                key={k}
                onClick={() => { setKind(k); setRefId(""); }}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md border p-3 text-xs transition-all",
                  active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted/40"
                )}
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="text-xs">Pick from library</Label>
        <Select value={refId} onValueChange={setRefId}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={`Choose a ${kindMeta[kind].label.toLowerCase()}…`} />
          </SelectTrigger>
          <SelectContent>
            {options.length === 0 && (
              <div className="px-3 py-4 text-xs text-muted-foreground">No {kindMeta[kind].label.toLowerCase()}s available.</div>
            )}
            {options.map((o) => (
              <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Weight (%)</Label>
          <Input type="number" min={0} max={100} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mt-1.5" />
        </div>
        <div className="flex items-end justify-between rounded-md border px-3 py-2">
          <span className="text-xs">Required to progress</span>
          <Switch checked={required} onCheckedChange={setRequired} />
        </div>
      </div>

      <SheetFooter className="!justify-between pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          disabled={!selected}
          onClick={() => selected && onSubmit({
            kind, refId: selected.id, title: selected.label, weight, required,
          })}
        >
          Attach
        </Button>
      </SheetFooter>
    </div>
  );
}
