import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  HelpCircle, ClipboardList, Code2, GraduationCap, Library, AlertTriangle, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import {
  useCourseStore,
  getCourseAssessments,
  type Course,
  type LessonType,
  type AssessmentEntry,
} from "@/stores/courseStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeMeta: Record<LessonType, { label: string; icon: any; color: string } | undefined> = {
  video: undefined,
  reading: undefined,
  lab: undefined,
  "ctf-scenario": undefined,
  quiz: { label: "Quiz", icon: HelpCircle, color: "text-info" },
  assignment: { label: "Assignment", icon: ClipboardList, color: "text-warning" },
  "code-exercise": { label: "Code Exercise", icon: Code2, color: "text-primary" },
  exam: { label: "Exam", icon: GraduationCap, color: "text-destructive" },
};

// Mock submissions — would come from a real submissions store
const MOCK_STUDENTS = [
  "Aarav Sharma", "Priya Patel", "Marcus Lee", "Sofia Garcia", "James Wong",
  "Emma Davis", "Rahul Kumar", "Yuki Tanaka", "Olivia Brown", "Diego Martinez",
];
type SubStatus = "graded" | "pending" | "late";
interface MockSubmission {
  id: string;
  lessonId: string;
  student: string;
  submittedAt: string;
  score: number | null;
  status: SubStatus;
}

function buildMockSubmissions(entries: AssessmentEntry[]): MockSubmission[] {
  const subs: MockSubmission[] = [];
  entries.forEach((e, ei) => {
    const count = 3 + (ei % 4);
    for (let i = 0; i < count; i++) {
      const student = MOCK_STUDENTS[(ei * 3 + i) % MOCK_STUDENTS.length];
      const daysAgo = (ei + i) % 14;
      const statusRoll = (ei + i) % 5;
      const status: SubStatus = statusRoll === 0 ? "pending" : statusRoll === 1 ? "late" : "graded";
      subs.push({
        id: `${e.lesson.id}-${i}`,
        lessonId: e.lesson.id,
        student,
        submittedAt: `${daysAgo}d ago`,
        score: status === "pending" ? null : 55 + ((ei * 7 + i * 11) % 45),
        status,
      });
    }
  });
  return subs;
}

export function CourseAssessmentsTab({ course }: { course: Course }) {
  const { updateLesson } = useCourseStore();
  const entries = useMemo(() => getCourseAssessments(course), [course]);
  const [submissionFilter, setSubmissionFilter] = useState<string>("all");
  const [drawerSub, setDrawerSub] = useState<MockSubmission | null>(null);

  const submissions = useMemo(() => buildMockSubmissions(entries), [entries]);
  const filteredSubs = submissionFilter === "all"
    ? submissions
    : submissions.filter((s) => s.lessonId === submissionFilter);

  const totalWeight = entries.reduce((s, e) => s + (e.lesson.weight ?? 0), 0);
  const weightOk = totalWeight === 100;

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No assessments yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Assessments are placed as lessons inside the course tree. Add a Quiz, Assignment, Code Exercise, or Exam from the <strong>Content</strong> tab — they will appear here for grading config and submissions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
        <div>
          <p className="text-sm font-semibold">Grading configuration</p>
          <p className="text-xs text-muted-foreground">
            {entries.length} assessments · placed inline in course content
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {weightOk ? (
            <Badge className="gap-1 bg-success/15 text-success border-success/30">
              <CheckCircle2 className="h-3 w-3" /> Weights total 100%
            </Badge>
          ) : (
            <Badge className="gap-1 bg-warning/15 text-warning border-warning/30">
              <AlertTriangle className="h-3 w-3" /> Weights total {totalWeight}% (target 100%)
            </Badge>
          )}
        </div>
      </div>

      {/* Section A — Grading table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assessments in course order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Located in</TableHead>
                <TableHead className="w-[120px]">Weight (%)</TableHead>
                <TableHead className="w-[100px] text-center">Required</TableHead>
                <TableHead className="w-[100px] text-right">Submissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => {
                const meta = typeMeta[e.lesson.type];
                if (!meta) return null;
                const Icon = meta.icon;
                const subCount = submissions.filter((s) => s.lessonId === e.lesson.id).length;
                return (
                  <TableRow key={e.lesson.id}>
                    <TableCell className="text-xs text-muted-foreground">{e.orderIndex + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                        <span className="text-sm font-medium">{e.lesson.title}</span>
                        {e.lesson.source === "library" && (
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <Library className="h-2.5 w-2.5" /> Library
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{meta.label}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Module {e.chapterIndex + 1} › L{e.lessonIndex + 1}
                      <div className="text-[10px] opacity-60 truncate max-w-[180px]">{e.chapterTitle}</div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={e.lesson.weight ?? 0}
                        onChange={(ev) => updateLesson(course.id, e.chapterId, e.lesson.id, { weight: Number(ev.target.value) })}
                        className="h-8 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={e.lesson.required ?? false}
                        onCheckedChange={(v) => updateLesson(course.id, e.chapterId, e.lesson.id, { required: v })}
                      />
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setSubmissionFilter(e.lesson.id)}
                      >
                        {subCount}
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-3 flex justify-end text-xs text-muted-foreground">
            <span>Total weight: <span className={cn("font-semibold", weightOk ? "text-success" : "text-warning")}>{totalWeight}%</span></span>
          </div>
        </CardContent>
      </Card>

      {/* Section B — Submissions */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Submissions</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filter by assessment</span>
            <Select value={submissionFilter} onValueChange={setSubmissionFilter}>
              <SelectTrigger className="w-[260px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All assessments</SelectItem>
                {entries.map((e) => (
                  <SelectItem key={e.lesson.id} value={e.lesson.id}>
                    {e.lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredSubs.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-10">No submissions yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assessment</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubs.slice(0, 40).map((s) => {
                  const entry = entries.find((e) => e.lesson.id === s.lessonId);
                  return (
                    <TableRow key={s.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setDrawerSub(s)}>
                      <TableCell className="text-sm font-medium">{s.student}</TableCell>
                      <TableCell className="text-xs">{entry?.lesson.title ?? "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.submittedAt}</TableCell>
                      <TableCell className="text-center text-xs">{s.score !== null ? `${s.score}%` : "—"}</TableCell>
                      <TableCell>
                        <StatusChip status={s.status} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Submission detail drawer */}
      <Sheet open={!!drawerSub} onOpenChange={(o) => !o && setDrawerSub(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Submission detail</SheetTitle>
            <SheetDescription>
              {drawerSub && `${drawerSub.student} · ${drawerSub.submittedAt}`}
            </SheetDescription>
          </SheetHeader>
          {drawerSub && (
            <div className="py-4 space-y-4 text-sm">
              <div className="rounded-md border p-3 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Assessment</span><span className="text-xs font-medium">{entries.find((e) => e.lesson.id === drawerSub.lessonId)?.lesson.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Score</span><span className="text-xs font-medium">{drawerSub.score !== null ? `${drawerSub.score}%` : "Not graded"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-xs">Status</span><StatusChip status={drawerSub.status} /></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Detailed submission content (answers, code, attachments) will appear here once submissions are wired to the live data layer.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to={`/courses/${course.id}`}>
                  Open in grading view <ArrowUpRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatusChip({ status }: { status: SubStatus }) {
  const map: Record<SubStatus, string> = {
    graded: "bg-success/15 text-success border-success/30",
    pending: "bg-warning/15 text-warning border-warning/30",
    late: "bg-destructive/15 text-destructive border-destructive/30",
  };
  return <Badge variant="outline" className={cn("text-[10px] capitalize", map[status])}>{status}</Badge>;
}
