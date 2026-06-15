import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search, Plus, MoreVertical, ClipboardList, FileQuestion, Code2,
  Download, Archive, CheckCircle2, Pencil, Copy, Trash2, Link2,
} from "lucide-react";
import { useAssessments, type AssessmentType, type AssessmentLifecycle } from "@/hooks/useAssessments";
import { useQuizStore } from "@/stores/quizStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useExerciseStore } from "@/stores/exerciseStore";
import { toast } from "@/hooks/use-toast";
import { exportToCsv } from "@/lib/exportCsv";

const typeIcons = { Quiz: FileQuestion, Assignment: ClipboardList, Exercise: Code2 } as const;

const lifecycleColor: Record<AssessmentLifecycle, string> = {
  draft: "bg-muted text-muted-foreground",
  in_review: "bg-amber-500/10 text-amber-600",
  published: "bg-green-500/10 text-green-600",
  archived: "bg-zinc-500/10 text-zinc-500",
};

export default function AssessmentLibrary() {
  const navigate = useNavigate();
  const all = useAssessments();
  const updateQuiz = useQuizStore((s) => s.updateQuiz);
  const deleteQuiz = useQuizStore((s) => s.deleteQuiz);
  const updateAssignment = useAssignmentStore((s) => s.updateAssignment);
  const deleteAssignment = useAssignmentStore((s) => s.deleteAssignment);
  const updateExercise = useExerciseStore((s) => s.updateExercise);
  const deleteExercise = useExerciseStore((s) => s.deleteExercise);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | AssessmentType>("all");
  const [course, setCourse] = useState("all");
  const [status, setStatus] = useState<"all" | AssessmentLifecycle>("all");

  const courses = useMemo(() => Array.from(new Set(all.map((a) => a.course))).filter(Boolean), [all]);

  const filtered = useMemo(() => {
    return all.filter((a) => {
      if (tab !== "all" && a.type !== tab) return false;
      if (course !== "all" && a.course !== course) return false;
      if (status !== "all" && a.status !== status) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [all, tab, course, status, search]);

  const counts = useMemo(() => {
    return {
      total: all.length,
      quiz: all.filter((a) => a.type === "Quiz").length,
      assignment: all.filter((a) => a.type === "Assignment").length,
      exercise: all.filter((a) => a.type === "Exercise").length,
      published: all.filter((a) => a.status === "published").length,
      draft: all.filter((a) => a.status === "draft").length,
    };
  }, [all]);

  const setLifecycle = (a: typeof all[number], next: AssessmentLifecycle) => {
    if (a.type === "Quiz") updateQuiz(a.id, { status: next as any });
    if (a.type === "Assignment") updateAssignment(a.id, { status: next as any });
    if (a.type === "Exercise") updateExercise(a.id, { status: next as any });
    toast({ title: `${a.title}`, description: `Status changed to ${next}.` });
  };

  const remove = (a: typeof all[number]) => {
    if (a.type === "Quiz") deleteQuiz(a.id);
    if (a.type === "Assignment") deleteAssignment(a.id);
    if (a.type === "Exercise") deleteExercise(a.id);
    toast({ title: "Deleted", description: a.title });
  };

  const handleExport = () => {
    exportToCsv(
      `assessments-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered,
      [
        { key: "type", label: "Type" },
        { key: "title", label: "Title" },
        { key: "course", label: "Course / Topic" },
        { key: "status", label: "Status" },
        { key: "attempts", label: "Attempts" },
        { key: "avgScore", label: "Avg Score / Success %" },
      ]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title="Assessment Library"
          description="Quizzes, assignments and exercises across every course in one place."
          breadcrumbs={[{ label: "Assessments" }, { label: "Library" }]}
        />
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> New assessment
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/quizzes/create")}>
                <FileQuestion className="h-4 w-4 mr-2" /> Quiz
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/assignments/create")}>
                <ClipboardList className="h-4 w-4 mr-2" /> Assignment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/exercises/create")}>
                <Code2 className="h-4 w-4 mr-2" /> Coding exercise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        {[
          { label: "Total", value: counts.total },
          { label: "Quizzes", value: counts.quiz },
          { label: "Assignments", value: counts.assignment },
          { label: "Exercises", value: counts.exercise },
          { label: "Published", value: counts.published },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in_review">In review</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Quiz" className="text-xs">Quizzes</TabsTrigger>
            <TabsTrigger value="Assignment" className="text-xs">Assignments</TabsTrigger>
            <TabsTrigger value="Exercise" className="text-xs">Exercises</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Course / Topic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
              <TableHead className="text-right">Avg</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => {
              const Icon = typeIcons[a.type];
              return (
                <TableRow key={`${a.type}-${a.id}`}>
                  <TableCell>
                    <Link to={a.detailPath} className="font-medium text-sm hover:text-primary inline-flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      {a.title}
                    </Link>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{a.type}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.course || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${lifecycleColor[a.status]}`}>
                      {a.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">{a.attempts}</TableCell>
                  <TableCell className="text-right tabular-nums text-sm">{a.avgScore}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(a.editPath)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Open / Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(a.title); toast({ title: "Title copied" }); }}>
                          <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate (copy title)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast({ title: "Attach to lesson", description: "Open the course builder to attach this assessment." })}>
                          <Link2 className="h-3.5 w-3.5 mr-2" /> Attach to lesson
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {a.status !== "published" && (
                          <DropdownMenuItem onClick={() => setLifecycle(a, "published")}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Publish
                          </DropdownMenuItem>
                        )}
                        {a.status !== "draft" && (
                          <DropdownMenuItem onClick={() => setLifecycle(a, "draft")}>
                            <Pencil className="h-3.5 w-3.5 mr-2" /> Move to draft
                          </DropdownMenuItem>
                        )}
                        {a.status !== "archived" && (
                          <DropdownMenuItem onClick={() => setLifecycle(a, "archived")}>
                            <Archive className="h-3.5 w-3.5 mr-2" /> Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => remove(a)}>
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                  No assessments match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
