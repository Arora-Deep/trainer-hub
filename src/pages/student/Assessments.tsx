import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  FileText, Clock, CheckCircle, AlertCircle, Search,
  Award, Code2, ClipboardList, Timer, TrendingUp, ArrowRight,
} from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  type: "Quiz" | "Assignment" | "Exercise";
  course: string;
  dueDate: string;
  score: number | null;
  maxScore: number;
  status: "pending" | "not_started" | "completed" | "overdue";
  questions: number;
  timeLimit: string;
  attempts: number;
  maxAttempts: number;
}

const assessments: Assessment[] = [
  { id: "1", title: "AWS VPC Quiz", type: "Quiz", course: "AWS Cloud Practitioner", dueDate: "Today", score: null, maxScore: 100, status: "pending", questions: 20, timeLimit: "30m", attempts: 0, maxAttempts: 2 },
  { id: "2", title: "Docker Networking Assignment", type: "Assignment", course: "Docker Essentials", dueDate: "Mar 1", score: null, maxScore: 50, status: "pending", questions: 5, timeLimit: "2h", attempts: 0, maxAttempts: 1 },
  { id: "3", title: "K8s Pod Exercise", type: "Exercise", course: "Kubernetes Fundamentals", dueDate: "Mar 3", score: null, maxScore: 30, status: "not_started", questions: 3, timeLimit: "1h", attempts: 0, maxAttempts: 3 },
  { id: "4", title: "S3 & Storage Quiz", type: "Quiz", course: "AWS Cloud Practitioner", dueDate: "Feb 28", score: null, maxScore: 100, status: "overdue", questions: 15, timeLimit: "25m", attempts: 0, maxAttempts: 2 },
  { id: "5", title: "AWS IAM Quiz", type: "Quiz", course: "AWS Cloud Practitioner", dueDate: "Feb 20", score: 85, maxScore: 100, status: "completed", questions: 15, timeLimit: "25m", attempts: 1, maxAttempts: 2 },
  { id: "6", title: "Docker Basics Quiz", type: "Quiz", course: "Docker Essentials", dueDate: "Feb 15", score: 92, maxScore: 100, status: "completed", questions: 10, timeLimit: "20m", attempts: 1, maxAttempts: 2 },
  { id: "7", title: "Dockerfile Lab Exercise", type: "Exercise", course: "Docker Essentials", dueDate: "Feb 10", score: 28, maxScore: 30, status: "completed", questions: 4, timeLimit: "45m", attempts: 2, maxAttempts: 3 },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-warning/10 text-warning", icon: Clock },
  not_started: { color: "bg-muted text-muted-foreground", icon: AlertCircle },
  completed: { color: "bg-success/10 text-success", icon: CheckCircle },
  overdue: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

const typeIcons = { Quiz: Award, Assignment: ClipboardList, Exercise: Code2 };

export default function StudentAssessments() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = assessments.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchSearch;
    if (tab === "due") return matchSearch && (a.status === "pending" || a.status === "overdue" || a.status === "not_started");
    return matchSearch && a.status === tab;
  });

  const avgScore = assessments.filter(a => a.score !== null).reduce((sum, a) => sum + (a.score! / a.maxScore) * 100, 0) / assessments.filter(a => a.score !== null).length;
  const due = assessments.filter(a => a.status !== "completed").length;
  const completed = assessments.filter(a => a.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground text-sm mt-1">Quizzes, assignments, and exercises</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: assessments.length, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
          { label: "Due / Upcoming", value: due, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Completed", value: completed, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
          { label: "Avg Score", value: `${Math.round(avgScore)}%`, icon: TrendingUp, color: "text-info", bg: "bg-info/10" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold mt-0.5">{s.value}</p>
                </div>
                <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="due" className="text-xs">Due ({due})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed ({completed})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Assessment List */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const cfg = statusConfig[a.status];
          const TypeIcon = typeIcons[a.type];
          const scorePct = a.score !== null ? Math.round((a.score / a.maxScore) * 100) : null;

          return (
            <Card key={a.id} className={a.status === "overdue" ? "border-destructive/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      a.status === "completed" ? "bg-success/10" : a.status === "overdue" ? "bg-destructive/10" : "bg-muted"
                    }`}>
                      <TypeIcon className={`h-5 w-5 ${a.status === "completed" ? "text-success" : a.status === "overdue" ? "text-destructive" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm truncate">{a.title}</h3>
                        <Badge variant="outline" className="text-[10px] shrink-0">{a.type}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span>{a.course}</span>
                        <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{a.questions} questions</span>
                        <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{a.timeLimit}</span>
                        <span>Attempts: {a.attempts}/{a.maxAttempts}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {scorePct !== null && (
                      <div className="text-right">
                        <p className="text-lg font-bold">{scorePct}%</p>
                        <p className="text-[11px] text-muted-foreground">{a.score}/{a.maxScore}</p>
                      </div>
                    )}
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className={`text-xs capitalize ${cfg.color}`}>
                        {a.status === "overdue" ? "⚠ Overdue" : a.status.replace("_", " ")}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">Due: {a.dueDate}</span>
                    </div>
                    {a.status !== "completed" && (
                      <Button size="sm" variant={a.status === "overdue" ? "destructive" : "default"} className="gap-1.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                        {a.status === "pending" ? "Continue" : a.status === "overdue" ? "Submit Now" : "Start"}
                      </Button>
                    )}
                    {a.status === "completed" && a.attempts < a.maxAttempts && (
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs">Retry</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
