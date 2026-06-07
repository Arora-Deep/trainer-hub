import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Sparkles, Plus, Search, Brain, Target, MessageSquareQuote, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface InsightQuestion {
  id: string;
  prompt: string;
  course: string;
  rubric: string;
  difficulty: "easy" | "medium" | "hard";
  responses: number;
  avgScore: number; // out of 10
  status: "published" | "draft";
}

const seed: InsightQuestion[] = [
  {
    id: "iq1",
    prompt: "Explain in your own words why Kubernetes uses a declarative API instead of an imperative one, and give one trade-off this introduces.",
    course: "DevOps Bootcamp",
    rubric: "Mentions desired-state reconciliation, eventual consistency, and one concrete trade-off (e.g. debugging difficulty, delayed feedback).",
    difficulty: "medium",
    responses: 18,
    avgScore: 7.4,
    status: "published",
  },
  {
    id: "iq2",
    prompt: "A customer complains their AWS bill doubled overnight even though traffic is unchanged. Walk through how you would investigate.",
    course: "AWS Cloud Practitioner",
    rubric: "Cost Explorer breakdown, anomaly detection, untagged resources, NAT/data transfer, recent IaC changes. Logical ordering matters.",
    difficulty: "hard",
    responses: 12,
    avgScore: 6.8,
    status: "published",
  },
  {
    id: "iq3",
    prompt: "When would you choose a CTE over a subquery in PostgreSQL, and when is the opposite true?",
    course: "Python for Data Science",
    rubric: "Readability, materialization behavior, optimizer fences pre-PG12, recursion use cases.",
    difficulty: "medium",
    responses: 22,
    avgScore: 8.1,
    status: "published",
  },
  {
    id: "iq4",
    prompt: "Describe a real situation where eventual consistency is acceptable, and one where it would cause harm.",
    course: "Distributed Systems",
    rubric: "Concrete examples, reasoning about user impact and monetary risk.",
    difficulty: "easy",
    responses: 0,
    avgScore: 0,
    status: "draft",
  },
];

export default function InsightQuestions() {
  const [questions, setQuestions] = useState<InsightQuestion[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ prompt: "", course: "", rubric: "", difficulty: "medium" as const });

  const filtered = questions.filter(
    (x) => x.prompt.toLowerCase().includes(q.toLowerCase()) || x.course.toLowerCase().includes(q.toLowerCase())
  );

  const published = questions.filter((x) => x.status === "published").length;
  const totalResponses = questions.reduce((s, x) => s + x.responses, 0);
  const scored = questions.filter((x) => x.avgScore > 0);
  const avg = scored.length ? (scored.reduce((s, x) => s + x.avgScore, 0) / scored.length).toFixed(1) : "—";

  const create = () => {
    if (!draft.prompt.trim() || !draft.course.trim()) {
      toast({ title: "Missing fields", description: "Prompt and course are required.", variant: "destructive" });
      return;
    }
    setQuestions((prev) => [
      ...prev,
      {
        id: `iq${prev.length + 1}`,
        prompt: draft.prompt,
        course: draft.course,
        rubric: draft.rubric,
        difficulty: draft.difficulty,
        responses: 0,
        avgScore: 0,
        status: "draft",
      },
    ]);
    setDraft({ prompt: "", course: "", rubric: "", difficulty: "medium" });
    setOpen(false);
    toast({ title: "Insight question created", description: "Saved as draft." });
  };

  const diffColor = (d: InsightQuestion["difficulty"]) =>
    d === "easy" ? "bg-success/15 text-success" : d === "medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Insight Questions"
        description="Open-ended reasoning prompts. Students write a free-form answer; AI scores understanding out of 10 against your rubric."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Insight Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> New Insight Question
                </DialogTitle>
                <DialogDescription>
                  Write the prompt and a grading rubric. AI will score each student response 0–10 based on reasoning depth, accuracy and coverage of the rubric.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Input value={draft.course} onChange={(e) => setDraft({ ...draft, course: e.target.value })} placeholder="e.g. DevOps Bootcamp" />
                </div>
                <div className="space-y-2">
                  <Label>Prompt</Label>
                  <Textarea
                    value={draft.prompt}
                    onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                    placeholder="Ask an open-ended question that requires reasoning, not recall…"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5" /> Grading rubric
                  </Label>
                  <Textarea
                    value={draft.rubric}
                    onChange={(e) => setDraft({ ...draft, rubric: e.target.value })}
                    placeholder="List the key points, reasoning steps, or trade-offs a good answer must mention. The AI uses this to score 0–10."
                    className="min-h-[90px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Difficulty</Label>
                  <Select value={draft.difficulty} onValueChange={(v: any) => setDraft({ ...draft, difficulty: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">How AI scoring works</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              Students respond in their own words. The AI evaluates depth of understanding, reasoning, and coverage of the rubric you provide, returning a 0–10 score with feedback. You can override any score.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Questions" value={questions.length} icon={Brain} />
        <StatCard title="Published" value={published} icon={MessageSquareQuote} />
        <StatCard title="Responses" value={totalResponses} icon={Target} />
        <StatCard title="Avg Score" value={`${avg} / 10`} icon={Sparkles} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search prompts or courses..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Prompt</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((x) => (
                <TableRow key={x.id}>
                  <TableCell className="text-sm font-medium max-w-md">
                    <p className="line-clamp-2">{x.prompt}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{x.course}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize text-[10px] ${diffColor(x.difficulty)}`}>
                      {x.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{x.responses}</TableCell>
                  <TableCell className="text-sm font-semibold">
                    {x.avgScore > 0 ? `${x.avgScore.toFixed(1)} / 10` : "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={x.status === "published" ? "success" : "neutral"} label={x.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-10">
                    No insight questions match.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
