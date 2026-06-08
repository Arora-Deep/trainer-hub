import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sparkles, Plus, Search, Brain, Target, Lightbulb, MessageSquareQuote,
  GitCompare, Wrench, AlertCircle, MapPin, BookOpen, TrendingUp, TrendingDown,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type QuestionType =
  | "explain-choice"
  | "compare-options"
  | "improve-solution"
  | "root-cause"
  | "scenario-response";

const TYPE_META: Record<QuestionType, { label: string; icon: any; desc: string; color: string }> = {
  "explain-choice":    { label: "Explain Your Choice",   icon: Lightbulb,        desc: "Student justifies why they picked an option.",     color: "bg-primary/10 text-primary" },
  "compare-options":   { label: "Compare Options",       icon: GitCompare,       desc: "Student weighs trade-offs between alternatives.",  color: "bg-info/10 text-info" },
  "improve-solution":  { label: "Improve This Solution", icon: Wrench,           desc: "Student critiques code or a design.",              color: "bg-warning/10 text-warning" },
  "root-cause":        { label: "Root Cause Analysis",   icon: AlertCircle,      desc: "Student explains the underlying issue.",           color: "bg-destructive/10 text-destructive" },
  "scenario-response": { label: "Scenario Response",     icon: MessageSquareQuote, desc: "Student proposes a solution to a real scenario.", color: "bg-success/10 text-success" },
};

interface DimensionScores {
  conceptAccuracy: number;
  reasoningQuality: number;
  alternativeAnalysis: number;
  technicalDepth: number;
  clarity: number;
}

interface ReasoningResponse {
  id: string;
  student: string;
  submittedAt: string;
  answer: string;
  scores: DimensionScores;
  finalScore: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  suggestedTopics: string[];
}

interface ReasoningQuestion {
  id: string;
  prompt: string;
  course: string;
  type: QuestionType;
  modelAnswer: string;
  rubric: string;
  difficulty: "easy" | "medium" | "hard";
  status: "published" | "draft";
  responses: ReasoningResponse[];
}

const avg = (s: DimensionScores) =>
  Number(((s.conceptAccuracy + s.reasoningQuality + s.alternativeAnalysis + s.technicalDepth + s.clarity) / 5).toFixed(1));

const seed: ReasoningQuestion[] = [
  {
    id: "rq1",
    prompt: "You need to process records until a user enters EXIT. Would you use a for loop or a while loop? Explain your reasoning.",
    course: "Python Fundamentals",
    type: "explain-choice",
    modelAnswer: "A while loop is preferred because the number of iterations is not known in advance — execution continues until a sentinel value (EXIT) is encountered. A for loop fits known/iterable ranges. Mention readability, exit condition placement, and risk of infinite loops if the sentinel check is wrong.",
    rubric: "Identifies unknown iteration count as the key driver. Compares for vs while. Notes sentinel/exit condition. Bonus: maintainability or infinite-loop risk.",
    difficulty: "easy",
    status: "published",
    responses: [
      {
        id: "r1", student: "Aarav Mehta", submittedAt: "2h ago",
        answer: "I would use a while loop because we do not know the number of iterations beforehand. A for loop works better when the number of iterations is known. Since the user can continue entering records indefinitely, while is more suitable.",
        scores: { conceptAccuracy: 8, reasoningQuality: 9, alternativeAnalysis: 7, technicalDepth: 7, clarity: 9 },
        finalScore: 8.0,
        strengths: ["Good understanding of iteration control", "Clear contrast between for and while"],
        weaknesses: ["Did not discuss maintainability or infinite-loop risk"],
        missingConcepts: ["Sentinel value handling"],
        suggestedTopics: ["Loop Selection Best Practices", "Defensive Loop Design"],
      },
      {
        id: "r2", student: "Priya Sharma", submittedAt: "3h ago",
        answer: "for loop is fine, you can just break when EXIT.",
        scores: { conceptAccuracy: 4, reasoningQuality: 3, alternativeAnalysis: 2, technicalDepth: 3, clarity: 5 },
        finalScore: 3.4,
        strengths: ["Recognized break as a control mechanism"],
        weaknesses: ["Did not justify why for is appropriate", "Missed the unknown-iteration argument"],
        missingConcepts: ["Sentinel-controlled iteration", "Idiomatic Python loop selection"],
        suggestedTopics: ["When to use while vs for", "Pythonic loop patterns"],
      },
      {
        id: "r3", student: "Rohan Iyer", submittedAt: "5h ago",
        answer: "While loop. Unknown iteration count, sentinel-driven exit. For loop assumes a finite, known iterable. Also while keeps the exit condition explicit at the top, which is easier to maintain. Risk: must guarantee the sentinel check runs, else infinite loop.",
        scores: { conceptAccuracy: 10, reasoningQuality: 10, alternativeAnalysis: 9, technicalDepth: 9, clarity: 10 },
        finalScore: 9.6,
        strengths: ["Excellent reasoning depth", "Covered maintainability and failure modes"],
        weaknesses: [],
        missingConcepts: [],
        suggestedTopics: ["Advanced control flow patterns"],
      },
    ],
  },
  {
    id: "rq2",
    prompt: "Why would you use Kubernetes instead of running containers directly on virtual machines?",
    course: "DevOps Bootcamp",
    type: "compare-options",
    modelAnswer: "Kubernetes provides declarative orchestration, self-healing, service discovery, rolling updates, horizontal scaling and resource bin-packing across many nodes. Raw VMs with containers force you to script all of that. Trade-offs: operational complexity, learning curve, control-plane overhead for small workloads.",
    rubric: "Names at least three orchestration capabilities. Acknowledges trade-offs (complexity / overhead). Bonus: declarative vs imperative, multi-tenant scheduling.",
    difficulty: "medium",
    status: "published",
    responses: [
      {
        id: "r1", student: "Neha Kapoor", submittedAt: "1d ago",
        answer: "Kubernetes auto-restarts failed containers, scales horizontally based on CPU, and lets you do rolling updates without downtime. On plain VMs you'd script all of that yourself and still not get scheduling across a fleet. Downside is k8s itself is complex — for a single app a VM with docker compose is often enough.",
        scores: { conceptAccuracy: 9, reasoningQuality: 8, alternativeAnalysis: 9, technicalDepth: 7, clarity: 9 },
        finalScore: 8.4,
        strengths: ["Concrete capabilities listed", "Honest about when k8s is overkill"],
        weaknesses: ["Did not mention declarative reconciliation"],
        missingConcepts: ["Declarative API / desired state"],
        suggestedTopics: ["Control loops & reconciliation", "Kubernetes operational cost"],
      },
    ],
  },
  {
    id: "rq3",
    prompt: "Explain why `chmod 777` is considered risky on a production Linux server.",
    course: "Linux Administration",
    type: "root-cause",
    modelAnswer: "777 grants read/write/execute to owner, group and others. Any local user — including compromised service accounts — can modify or replace the file/binary, leading to privilege escalation, data tampering, and persistence. Correct approach: least privilege (e.g. 640/750) and ownership scoping.",
    rubric: "Decodes 777 correctly. Explains the security blast radius. Proposes least-privilege alternative.",
    difficulty: "easy",
    status: "published",
    responses: [],
  },
  {
    id: "rq4",
    prompt: "Why would a company choose VLANs instead of a flat network architecture?",
    course: "Networking Essentials",
    type: "compare-options",
    modelAnswer: "VLANs segment broadcast domains, contain lateral movement, allow policy-per-segment, and scale without re-cabling. Flat networks suffer broadcast storms, weak isolation, and noisy-neighbor security exposure.",
    rubric: "Broadcast domain isolation. Security segmentation. Operational flexibility. Bonus: inter-VLAN routing implications.",
    difficulty: "medium",
    status: "draft",
    responses: [],
  },
];

const dimColor = (v: number) =>
  v >= 8 ? "text-success" : v >= 6 ? "text-warning" : "text-destructive";

const DimensionBar = ({ label, value }: { label: string; value: number }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold tabular-nums ${dimColor(value)}`}>{value}/10</span>
    </div>
    <Progress value={value * 10} className="h-1.5" />
  </div>
);

export default function InsightQuestions() {
  const [questions, setQuestions] = useState<ReasoningQuestion[]>(seed);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | QuestionType>("all");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ReasoningQuestion | null>(null);
  const [activeResp, setActiveResp] = useState<ReasoningResponse | null>(null);

  const [draft, setDraft] = useState({
    prompt: "", course: "", modelAnswer: "", rubric: "",
    type: "explain-choice" as QuestionType,
    difficulty: "medium" as ReasoningQuestion["difficulty"],
  });

  const filtered = questions.filter((x) => {
    const matchQ = x.prompt.toLowerCase().includes(q.toLowerCase()) || x.course.toLowerCase().includes(q.toLowerCase());
    const matchT = typeFilter === "all" || x.type === typeFilter;
    return matchQ && matchT;
  });

  const stats = useMemo(() => {
    const published = questions.filter((x) => x.status === "published").length;
    const allResp = questions.flatMap((x) => x.responses);
    const avgScore = allResp.length
      ? (allResp.reduce((s, r) => s + r.finalScore, 0) / allResp.length).toFixed(1)
      : "—";
    return { published, total: allResp.length, avgScore };
  }, [questions]);

  const create = () => {
    if (!draft.prompt.trim() || !draft.course.trim() || !draft.rubric.trim()) {
      toast({ title: "Missing fields", description: "Prompt, course and rubric are required.", variant: "destructive" });
      return;
    }
    setQuestions((prev) => [
      ...prev,
      { ...draft, id: `rq${prev.length + 1}`, status: "draft", responses: [] },
    ]);
    setDraft({ prompt: "", course: "", modelAnswer: "", rubric: "", type: "explain-choice", difficulty: "medium" });
    setOpen(false);
    toast({ title: "Reasoning question created", description: "Saved as draft." });
  };

  const diffColor = (d: ReasoningQuestion["difficulty"]) =>
    d === "easy" ? "bg-success/15 text-success" : d === "medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Reasoning Evaluation"
        description="Open-ended prompts scored by AI across five dimensions — measure conceptual understanding, not just recall."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Reasoning Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> New Reasoning Question
                </DialogTitle>
                <DialogDescription>
                  Define the prompt, a model answer, and an evaluation rubric. AI scores each student response across Concept Accuracy, Reasoning Quality, Alternative Analysis, Technical Depth and Clarity.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Course</Label>
                    <Input value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} placeholder="e.g. DevOps Bootcamp" />
                  </div>
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select value={draft.type} onValueChange={(v: QuestionType) => setDraft({ ...draft, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(TYPE_META).map(([k, v]) => (
                          <SelectItem key={k} value={k}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">{TYPE_META[draft.type].desc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <Textarea
                    value={draft.prompt}
                    onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                    placeholder="Ask a question that requires reasoning, not recall…"
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Model answer</Label>
                  <Textarea
                    value={draft.modelAnswer}
                    onChange={(e) => setDraft({ ...draft, modelAnswer: e.target.value })}
                    placeholder="Write the ideal answer. AI uses this as the reference for concept accuracy."
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Target className="h-3.5 w-3.5" /> Evaluation rubric</Label>
                  <Textarea
                    value={draft.rubric}
                    onChange={(e) => setDraft({ ...draft, rubric: e.target.value })}
                    placeholder="List key points, reasoning steps and trade-offs a strong answer must cover."
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={draft.difficulty} onValueChange={(v: any) => setDraft({ ...draft, difficulty: v })}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={create}>Save draft</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Five-dimension AI scoring</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Each response is graded on <b>Concept Accuracy</b>, <b>Reasoning Quality</b>, <b>Alternative Analysis</b>, <b>Technical Depth</b> and <b>Clarity</b>. The final reasoning score (0–10) is the mean. Trainers see strengths, weaknesses, missing concepts and suggested learning areas per student.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Questions" value={questions.length} icon={Brain} />
        <StatCard title="Published" value={stats.published} icon={MessageSquareQuote} />
        <StatCard title="Responses Graded" value={stats.total} icon={Target} />
        <StatCard title="Avg Reasoning Score" value={`${stats.avgScore} / 10`} icon={Sparkles} />
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center gap-3 space-y-0">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search prompts or courses..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
            <SelectTrigger className="w-56"><SelectValue placeholder="All types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All question types</SelectItem>
              {Object.entries(TYPE_META).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[38%]">Prompt</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Avg Reasoning</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((x) => {
                const Icon = TYPE_META[x.type].icon;
                const avgR = x.responses.length
                  ? (x.responses.reduce((s, r) => s + r.finalScore, 0) / x.responses.length).toFixed(1)
                  : null;
                return (
                  <TableRow key={x.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setActive(x)}>
                    <TableCell className="text-sm font-medium max-w-md">
                      <p className="line-clamp-2">{x.prompt}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] gap-1 ${TYPE_META[x.type].color} border-transparent`}>
                        <Icon className="h-3 w-3" /> {TYPE_META[x.type].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{x.course}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`capitalize text-[10px] ${diffColor(x.difficulty)}`}>
                        {x.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{x.responses.length}</TableCell>
                    <TableCell className="text-sm font-semibold">
                      {avgR ? <span className={dimColor(Number(avgR))}>{avgR} / 10</span> : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={x.status === "published" ? "success" : "neutral"} label={x.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-10">
                    No reasoning questions match.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Question detail drawer */}
      <Sheet open={!!active} onOpenChange={(o) => { if (!o) { setActive(null); setActiveResp(null); } }}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {active && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[10px] gap-1 ${TYPE_META[active.type].color} border-transparent`}>
                    {TYPE_META[active.type].label}
                  </Badge>
                  <Badge variant="outline" className={`capitalize text-[10px] ${diffColor(active.difficulty)}`}>{active.difficulty}</Badge>
                </div>
                <SheetTitle className="text-base leading-snug">{active.prompt}</SheetTitle>
                <SheetDescription>{active.course}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 mt-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Model answer</p>
                  <p className="text-sm leading-relaxed p-3 rounded-lg bg-muted/40 border border-border">{active.modelAnswer}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Rubric</p>
                  <p className="text-sm leading-relaxed">{active.rubric}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Student responses</p>
                    <span className="text-xs text-muted-foreground">{active.responses.length} graded</span>
                  </div>
                  {active.responses.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-lg">
                      No responses yet.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {active.responses.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => setActiveResp(r)}
                          className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{r.student}</span>
                            <span className={`text-sm font-semibold ${dimColor(r.finalScore)}`}>{r.finalScore.toFixed(1)} / 10</span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{r.answer}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{r.submittedAt}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Response detail drawer */}
      <Sheet open={!!activeResp} onOpenChange={(o) => { if (!o) setActiveResp(null); }}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {activeResp && (
            <>
              <SheetHeader>
                <SheetTitle>{activeResp.student}</SheetTitle>
                <SheetDescription>Submitted {activeResp.submittedAt}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 mt-5">
                <Card>
                  <CardContent className="pt-5 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Final reasoning score</p>
                    <p className={`text-4xl font-bold mt-1 ${dimColor(activeResp.finalScore)}`}>{activeResp.finalScore.toFixed(1)}<span className="text-lg text-muted-foreground">/10</span></p>
                  </CardContent>
                </Card>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Student answer</p>
                  <p className="text-sm leading-relaxed p-3 rounded-lg bg-muted/40 border border-border whitespace-pre-wrap">{activeResp.answer}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dimension scores</p>
                  <div className="space-y-3">
                    <DimensionBar label="Concept Accuracy" value={activeResp.scores.conceptAccuracy} />
                    <DimensionBar label="Reasoning Quality" value={activeResp.scores.reasoningQuality} />
                    <DimensionBar label="Alternative Analysis" value={activeResp.scores.alternativeAnalysis} />
                    <DimensionBar label="Technical Depth" value={activeResp.scores.technicalDepth} />
                    <DimensionBar label="Clarity" value={activeResp.scores.clarity} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeResp.strengths.length > 0 && (
                    <div className="p-3 rounded-lg border border-success/30 bg-success/5">
                      <p className="text-xs font-semibold text-success flex items-center gap-1.5 mb-2"><TrendingUp className="h-3.5 w-3.5" /> Strengths</p>
                      <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                        {activeResp.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {activeResp.weaknesses.length > 0 && (
                    <div className="p-3 rounded-lg border border-warning/30 bg-warning/5">
                      <p className="text-xs font-semibold text-warning flex items-center gap-1.5 mb-2"><TrendingDown className="h-3.5 w-3.5" /> Weaknesses</p>
                      <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                        {activeResp.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {activeResp.missingConcepts.length > 0 && (
                    <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                      <p className="text-xs font-semibold text-destructive flex items-center gap-1.5 mb-2"><AlertCircle className="h-3.5 w-3.5" /> Missing concepts</p>
                      <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                        {activeResp.missingConcepts.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                  {activeResp.suggestedTopics.length > 0 && (
                    <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                      <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2"><MapPin className="h-3.5 w-3.5" /> Suggested learning areas</p>
                      <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                        {activeResp.suggestedTopics.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full" onClick={() => toast({ title: "Score override", description: "Trainer override saved." })}>
                  Override AI score
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
