import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle, AlertCircle, Search, Award, Code2, ClipboardList, Timer, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { studentAssessments } from "@/data/studentMockData";

const statusConfig: Record<string, { color: string; icon: any }> = {
  pending: { color: "bg-warning/10 text-warning", icon: Clock },
  not_started: { color: "bg-muted text-muted-foreground", icon: AlertCircle },
  completed: { color: "bg-success/10 text-success", icon: CheckCircle },
  overdue: { color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};
const typeIcons: Record<string, any> = { Quiz: Award, Assignment: ClipboardList, Exercise: Code2 };

export default function StudentAssessments() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [course, setCourse] = useState("all");
  const [type, setType] = useState("all");

  const courses = useMemo(() => Array.from(new Set(studentAssessments.map((a) => a.course))), []);
  const filtered = useMemo(() => studentAssessments.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (course !== "all" && a.course !== course) return false;
    if (type !== "all" && a.type !== type) return false;
    if (tab === "all") return true;
    if (tab === "due") return ["pending", "overdue", "not_started"].includes(a.status);
    return a.status === tab;
  }), [search, course, type, tab]);

  const scored = studentAssessments.filter((a) => a.score !== null);
  const avg = scored.length ? Math.round(scored.reduce((s, a) => s + (a.score! / a.maxScore) * 100, 0) / scored.length) : 0;
  const due = studentAssessments.filter((a) => a.status !== "completed").length;
  const completed = studentAssessments.filter((a) => a.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground text-sm mt-1">Quizzes, assignments, and exercises across your courses</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total", value: studentAssessments.length, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
          { label: "Due / Upcoming", value: due, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
          { label: "Completed", value: completed, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
          { label: "Avg Score", value: `${avg}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <Card key={s.label}><CardContent className="py-4"><div className="flex items-center justify-between"><div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold mt-0.5">{s.value}</p></div><div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}><s.icon className={`h-4 w-4 ${s.color}`} /></div></div></CardContent></Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All courses</SelectItem>{courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All types</SelectItem><SelectItem value="Quiz">Quiz</SelectItem><SelectItem value="Assignment">Assignment</SelectItem><SelectItem value="Exercise">Exercise</SelectItem></SelectContent>
        </Select>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList><TabsTrigger value="all" className="text-xs">All</TabsTrigger><TabsTrigger value="due" className="text-xs">Due</TabsTrigger><TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger></TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const cfg = statusConfig[a.status];
          const TypeIcon = typeIcons[a.type];
          const scorePct = a.score !== null ? Math.round((a.score / a.maxScore) * 100) : null;
          return (
            <Card key={a.id} className={a.status === "overdue" ? "border-destructive/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <Link to={`/student/assessments/${a.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${a.status === "completed" ? "bg-success/10" : a.status === "overdue" ? "bg-destructive/10" : "bg-muted"}`}>
                      <TypeIcon className={`h-5 w-5 ${a.status === "completed" ? "text-success" : a.status === "overdue" ? "text-destructive" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary">{a.title}</h3>
                        <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                        {a.deliveryMode === "self-paced" && <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-0"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        <span>{a.course}</span>
                        {a.questions.length > 0 && <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{a.questions.length} questions</span>}
                        <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{a.timeLimitMin}m</span>
                        <span>Attempts: {a.attempts}/{a.maxAttempts}</span>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 shrink-0">
                    {scorePct !== null && <div className="text-right"><p className="text-lg font-bold">{scorePct}%</p><p className="text-[11px] text-muted-foreground">{a.score}/{a.maxScore}</p></div>}
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant="secondary" className={`text-xs capitalize ${cfg.color}`}>{a.status === "overdue" ? "⚠ Overdue" : a.status.replace("_", " ")}</Badge>
                      <span className="text-[11px] text-muted-foreground">Due: {a.dueDate}</span>
                    </div>
                    {a.status !== "completed" && (
                      <Button size="sm" asChild variant={a.status === "overdue" ? "destructive" : "default"} className="gap-1.5">
                        <Link to={`/student/assessments/${a.id}`}><ArrowRight className="h-3.5 w-3.5" />{a.status === "pending" ? "Continue" : "Start"}</Link>
                      </Button>
                    )}
                    {a.status === "completed" && <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs"><Link to={`/student/assessments/${a.id}/result`}>View</Link></Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No assessments match.</CardContent></Card>}
      </div>
    </div>
  );
}
