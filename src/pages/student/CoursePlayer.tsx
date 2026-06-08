import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, CheckCircle, Lock, Video, FileText,
  FlaskConical, Award, BookOpen, Play, Download, MessageSquare, Code2, Flag, ShieldCheck,
  Calendar, Timer, Sparkles, ListChecks, Radio, Maximize2, ExternalLink, Brain, TrendingUp, TrendingDown, AlertCircle, MapPin, Target, Loader2,
} from "lucide-react";
import { getStudentCourse, type StudentLesson } from "@/data/studentMockData";
import { useEnrollmentStore } from "@/stores/enrollmentStore";
import { OnDemandLabPanel } from "@/components/learning/OnDemandLabPanel";
import { PersistentLabPanel } from "@/components/learning/PersistentLabPanel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ── Inline assessments ── */
function InlineQuiz({ lesson }: { lesson: StudentLesson }) {
  const questions = useMemo(
    () => [
      { q: "Which service stores objects in AWS?", opts: ["EC2", "S3", "VPC", "IAM"], a: 1 },
      { q: "What does CIDR stand for?", opts: ["Classless Inter-Domain Routing", "Cloud Internal Data Route", "Common IP Distribution Range", "Centralized IP Domain Resolution"], a: 0 },
      { q: "Default VPC subnet is in how many AZs?", opts: ["1", "2", "All AZs in region", "3"], a: 2 },
    ],
    []
  );
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = submitted ? questions.reduce((s, q, i) => s + (answers[i] === q.a ? 1 : 0), 0) : 0;

  if (submitted) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <Award className="h-10 w-10 mx-auto text-primary mb-2" />
          <p className="text-lg font-semibold">{score} / {questions.length} correct</p>
        </div>
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={i} className="text-sm">
              <p className="font-medium mb-1">{i + 1}. {q.q}</p>
              <p className={cn("text-xs", answers[i] === q.a ? "text-success" : "text-destructive")}>
                Your answer: {q.opts[answers[i] ?? -1] ?? "—"}{" "}
                {answers[i] !== q.a && <span className="text-muted-foreground">· Correct: {q.opts[q.a]}</span>}
              </p>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake</Button>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Award className="h-4 w-4 text-primary" /> {questions.length} questions · {lesson.duration}
      </div>
      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="text-sm font-medium">{i + 1}. {q.q}</p>
          <RadioGroup value={answers[i]?.toString() ?? ""} onValueChange={(v) => setAnswers((a) => ({ ...a, [i]: Number(v) }))}>
            {q.opts.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <RadioGroupItem value={oi.toString()} id={`cp-q${i}-${oi}`} />
                <Label htmlFor={`cp-q${i}-${oi}`} className="text-sm font-normal cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <div className="flex justify-end">
        <Button size="sm" disabled={Object.keys(answers).length < questions.length} onClick={() => { setSubmitted(true); toast.success("Quiz submitted"); }}>
          Submit quiz
        </Button>
      </div>
    </div>
  );
}

function InlineAssignment({ lesson }: { lesson: StudentLesson }) {
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (submitted) {
    return (
      <div className="p-8 text-center space-y-2">
        <CheckCircle className="h-10 w-10 mx-auto text-success" />
        <p className="text-sm font-medium">Assignment submitted</p>
        <p className="text-xs text-muted-foreground">{file?.name ?? "submission"} · awaiting review</p>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Brief</p>
        <p className="text-sm text-muted-foreground">{lesson.body ?? "Complete the assignment and upload your submission below."}</p>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Upload your file</Label>
        <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Notes for reviewer (optional)</Label>
        <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div className="flex justify-end">
        <Button size="sm" disabled={!file} onClick={() => { setSubmitted(true); toast.success("Assignment submitted"); }}>
          Submit assignment
        </Button>
      </div>
    </div>
  );
}

function InlineExam({ lesson }: { lesson: StudentLesson }) {
  const [started, setStarted] = useState(false);
  if (!started) {
    return (
      <div className="p-8 text-center space-y-3">
        <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
        <div>
          <p className="text-sm font-medium">{lesson.title}</p>
          <p className="text-xs text-muted-foreground">Timed exam · {lesson.duration}{lesson.proctored ? " · Proctored" : ""}</p>
        </div>
        {lesson.proctored && <Badge variant="outline" className="text-[10px]">Camera + lockdown browser required</Badge>}
        <div className="pt-2">
          <Button size="sm" className="gap-1.5" onClick={() => setStarted(true)}>
            <Play className="h-4 w-4" /> Begin exam
          </Button>
        </div>
      </div>
    );
  }
  return <InlineQuiz lesson={lesson} />;
}

/* ── Inline AI Reasoning Evaluation ── */
type ReasoningDims = {
  conceptAccuracy: number;
  reasoningQuality: number;
  alternativeAnalysis: number;
  technicalDepth: number;
  clarity: number;
};
type ReasoningResult = {
  scores: ReasoningDims;
  finalScore: number;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  suggestedTopics: string[];
};

function evaluateReasoning(answer: string, rubric: string[]): ReasoningResult {
  const text = answer.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const len = words.length;

  // Concept accuracy: how many rubric items the student touched
  const hit = rubric.map((r) => {
    const tokens = r.toLowerCase().split(/[\s/(),]+/).filter((t) => t.length > 3);
    const matched = tokens.filter((t) => text.includes(t)).length;
    return { rubric: r, ratio: tokens.length ? matched / tokens.length : 0 };
  });
  const conceptCoverage = hit.reduce((s, h) => s + h.ratio, 0) / Math.max(rubric.length, 1);
  const conceptAccuracy = Math.min(10, Math.round((conceptCoverage * 9 + (len > 25 ? 1 : 0)) * 10) / 10);

  // Reasoning quality: causal/justification words
  const causal = ["because", "since", "due to", "as a result", "therefore", "so that", "in order", "this means", "which means", "reason"];
  const causalHits = causal.filter((w) => text.includes(w)).length;
  const reasoningQuality = Math.min(10, Math.round((Math.min(causalHits, 4) * 2 + (len > 40 ? 2 : len > 20 ? 1 : 0)) * 10) / 10);

  // Alternative analysis: comparative words
  const compare = [" vs ", "instead", "rather", "compared", "while ", "whereas", "alternative", "trade-off", "tradeoff", "however", "on the other hand", "better than", "worse than"];
  const compareHits = compare.filter((w) => text.includes(w)).length;
  const alternativeAnalysis = Math.min(10, Math.round((Math.min(compareHits, 4) * 2.2 + (len > 50 ? 1 : 0)) * 10) / 10);

  // Technical depth: long answers + technical jargon density (any rubric-token longer than 5 chars)
  const techTokens = rubric.flatMap((r) => r.toLowerCase().split(/[\s/(),]+/)).filter((t) => t.length > 5);
  const techHits = new Set(techTokens.filter((t) => text.includes(t))).size;
  const technicalDepth = Math.min(10, Math.round((techHits * 1.6 + Math.min(len / 25, 4)) * 10) / 10);

  // Clarity: punctuation + sentence structure + length sweet spot
  const sentences = answer.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const avgSentLen = sentences ? len / sentences : len;
  let clarity = 5;
  if (len >= 25) clarity += 2;
  if (len >= 60) clarity += 1;
  if (avgSentLen >= 6 && avgSentLen <= 25) clarity += 2;
  if (sentences >= 2) clarity += 1;
  clarity = Math.min(10, clarity);

  const scores: ReasoningDims = { conceptAccuracy, reasoningQuality, alternativeAnalysis, technicalDepth, clarity };
  const finalScore = Math.round(((conceptAccuracy + reasoningQuality + alternativeAnalysis + technicalDepth + clarity) / 5) * 10) / 10;

  const covered = hit.filter((h) => h.ratio >= 0.5).map((h) => h.rubric);
  const missing = hit.filter((h) => h.ratio < 0.3).map((h) => h.rubric);

  const strengths: string[] = [];
  if (conceptAccuracy >= 7) strengths.push("Good grasp of the core concept");
  if (reasoningQuality >= 7) strengths.push("Explains the 'why' clearly with causal language");
  if (alternativeAnalysis >= 7) strengths.push("Compares alternatives explicitly");
  if (technicalDepth >= 7) strengths.push("Uses precise technical vocabulary");
  if (clarity >= 8) strengths.push("Well-structured, coherent answer");
  if (covered.length) strengths.push(`Covered: ${covered.slice(0, 2).join(", ")}`);
  if (!strengths.length) strengths.push("Attempted the question — keep building on this");

  const weaknesses: string[] = [];
  if (len < 20) weaknesses.push("Answer is too short — expand your reasoning");
  if (reasoningQuality < 5) weaknesses.push("Missing the 'why' — justify your choice with reasoning");
  if (alternativeAnalysis < 5) weaknesses.push("Did not compare the alternative option");
  if (technicalDepth < 5) weaknesses.push("Explanation stays at a surface level — add technical depth");
  if (clarity < 6) weaknesses.push("Structure could be clearer — try shorter, focused sentences");
  if (!weaknesses.length) weaknesses.push("Minor polish only — strong attempt");

  const suggested: string[] = [];
  if (alternativeAnalysis < 7) suggested.push("Comparative analysis & trade-off framing");
  if (reasoningQuality < 7) suggested.push("Cause-and-effect explanation patterns");
  if (technicalDepth < 7) suggested.push("Deeper dive into the underlying mechanism");
  if (!suggested.length) suggested.push("Advanced edge cases for this topic");

  return {
    scores,
    finalScore,
    strengths,
    weaknesses,
    missingConcepts: missing.length ? missing : [],
    suggestedTopics: suggested,
  };
}

const dimColor = (v: number) => (v >= 8 ? "text-success" : v >= 6 ? "text-warning" : "text-destructive");

function DimBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("font-semibold tabular-nums", dimColor(value))}>{value.toFixed(1)}/10</span>
      </div>
      <Progress value={value * 10} className="h-1.5" />
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = {
  "explain-choice": "Explain Your Choice",
  "compare-options": "Compare Options",
  "improve-solution": "Improve This Solution",
  "root-cause": "Root Cause Analysis",
  "scenario-response": "Scenario Response",
};

function InlineReasoning({ lesson }: { lesson: StudentLesson }) {
  const [answer, setAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState<ReasoningResult | null>(null);
  const [showModel, setShowModel] = useState(false);

  const rubric = lesson.reasoningRubric ?? [];

  const onSubmit = () => {
    if (answer.trim().split(/\s+/).length < 5) {
      toast.error("Write at least a couple of sentences before submitting.");
      return;
    }
    setEvaluating(true);
    setTimeout(() => {
      setResult(evaluateReasoning(answer, rubric));
      setEvaluating(false);
    }, 1400);
  };

  const reset = () => { setResult(null); setAnswer(""); setShowModel(false); };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-transparent gap-1">
          <Brain className="h-3 w-3" /> AI Reasoning Evaluation
        </Badge>
        {lesson.reasoningType && (
          <Badge variant="outline" className="text-[10px]">{TYPE_LABEL[lesson.reasoningType]}</Badge>
        )}
        <span className="text-xs text-muted-foreground">Scored across 5 dimensions · {lesson.duration}</span>
      </div>

      <div className="p-4 rounded-lg border border-border bg-muted/30">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Question</p>
        <p className="text-sm leading-relaxed">{lesson.reasoningPrompt}</p>
      </div>

      {!result && (
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your answer</Label>
          <Textarea
            rows={7}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Explain your reasoning in your own words. Compare alternatives where relevant, and justify *why*…"
            disabled={evaluating}
            className="text-sm"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
            <Button size="sm" onClick={onSubmit} disabled={evaluating || !answer.trim()} className="gap-1.5">
              {evaluating ? <><Loader2 className="h-4 w-4 animate-spin" /> AI evaluating…</> : <><Sparkles className="h-4 w-4" /> Evaluate with AI</>}
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Final score */}
          <Card className="border-primary/30">
            <CardContent className="pt-5 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Final reasoning score</p>
              <p className={cn("text-4xl font-bold mt-1", dimColor(result.finalScore))}>
                {result.finalScore.toFixed(1)}<span className="text-lg text-muted-foreground">/10</span>
              </p>
            </CardContent>
          </Card>

          {/* Dimension scores */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Dimension scores</p>
            <div className="space-y-3">
              <DimBar label="Concept Accuracy" value={result.scores.conceptAccuracy} />
              <DimBar label="Reasoning Quality" value={result.scores.reasoningQuality} />
              <DimBar label="Alternative Analysis" value={result.scores.alternativeAnalysis} />
              <DimBar label="Technical Depth" value={result.scores.technicalDepth} />
              <DimBar label="Clarity" value={result.scores.clarity} />
            </div>
          </div>

          {/* Feedback grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-success/30 bg-success/5">
              <p className="text-xs font-semibold text-success flex items-center gap-1.5 mb-2"><TrendingUp className="h-3.5 w-3.5" /> Strengths</p>
              <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="p-3 rounded-lg border border-warning/30 bg-warning/5">
              <p className="text-xs font-semibold text-warning flex items-center gap-1.5 mb-2"><TrendingDown className="h-3.5 w-3.5" /> What could be better</p>
              <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                {result.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            {result.missingConcepts.length > 0 && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                <p className="text-xs font-semibold text-destructive flex items-center gap-1.5 mb-2"><AlertCircle className="h-3.5 w-3.5" /> Missing concepts</p>
                <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                  {result.missingConcepts.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}
            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
              <p className="text-xs font-semibold text-primary flex items-center gap-1.5 mb-2"><MapPin className="h-3.5 w-3.5" /> Suggested learning areas</p>
              <ul className="text-xs space-y-1 list-disc list-inside text-foreground/80">
                {result.suggestedTopics.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

          {/* Your answer + model */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your answer</p>
            <p className="text-sm leading-relaxed p-3 rounded-lg bg-muted/40 border border-border whitespace-pre-wrap">{answer}</p>
          </div>

          {lesson.reasoningModelAnswer && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" /> Model answer
                </p>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowModel((v) => !v)}>
                  {showModel ? "Hide" : "Reveal"}
                </Button>
              </div>
              {showModel && (
                <p className="text-sm leading-relaxed p-3 rounded-lg bg-primary/5 border border-primary/20">{lesson.reasoningModelAnswer}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={reset}>Try again</Button>
            <Button size="sm" onClick={() => toast.success("Reasoning lesson complete")}>Save & continue</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Inline code exercise (mock Judge0) ── */
type CodeTestResult = { id: string; passed: boolean; actual: string; expected: string; hidden: boolean; weight: number; time: number; memoryKB: number };

function InlineCodeExercise({ lesson }: { lesson: StudentLesson }) {
  const tests = lesson.codeTests ?? [];
  const totalWeight = tests.reduce((s, t) => s + (t.weight ?? 0), 0) || 100;
  const [code, setCode] = useState(lesson.codeStarter ?? "// Write your solution here\n");
  const [tab, setTab] = useState<"problem" | "results">("problem");
  const [results, setResults] = useState<CodeTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [customInput, setCustomInput] = useState(tests[0]?.input ?? "");
  const [customOutput, setCustomOutput] = useState("");

  // Heuristic "AI grader": passes when student code differs meaningfully from starter
  // and roughly resembles the reference solution. Hidden tests deterministic per lesson.
  const grade = () => {
    const trimmed = code.replace(/\s+/g, " ").trim();
    const starter = (lesson.codeStarter ?? "").replace(/\s+/g, " ").trim();
    const sol = (lesson.codeSolution ?? "").replace(/\s+/g, " ").trim();
    const changed = trimmed !== starter && trimmed.length > starter.length * 0.4;
    const solTokens = new Set(sol.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean));
    const codeTokens = new Set(trimmed.toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean));
    const overlap = sol ? [...solTokens].filter((t) => codeTokens.has(t)).length / solTokens.size : 1;
    const quality = changed ? Math.min(1, 0.5 + overlap) : 0;
    return tests.map((t, i) => {
      // visible tests pass when quality > 0.55; hidden tests need stronger overlap
      const threshold = t.hidden ? 0.7 : 0.55;
      const passed = quality >= threshold;
      return {
        id: t.id,
        passed,
        expected: t.expectedOutput,
        actual: passed ? t.expectedOutput : (changed ? simulateBadOutput(t.expectedOutput, i) : "(no output)"),
        hidden: !!t.hidden,
        weight: t.weight ?? Math.floor(100 / tests.length),
        time: +(0.05 + Math.random() * 0.4).toFixed(3),
        memoryKB: Math.floor(2400 + Math.random() * 800),
      };
    });
  };

  const handleRun = async () => {
    setIsRunning(true);
    setCustomOutput("");
    await new Promise((r) => setTimeout(r, 800));
    const trimmed = code.replace(/\s+/g, " ").trim();
    const starter = (lesson.codeStarter ?? "").replace(/\s+/g, " ").trim();
    const matchTest = tests.find((t) => t.input === customInput && !t.hidden);
    const ok = trimmed !== starter && trimmed.length > starter.length * 0.5;
    setCustomOutput(
      matchTest && ok
        ? matchTest.expectedOutput
        : ok
          ? "// Program ran. Output preview not available for custom input in demo mode."
          : "// Edit the starter code and try again — looks like nothing was changed."
    );
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResults([]);
    await new Promise((r) => setTimeout(r, 1400));
    setResults(grade());
    setIsSubmitting(false);
    setTab("results");
  };

  const reset = () => {
    setCode(lesson.codeStarter ?? "");
    setResults([]);
    setCustomOutput("");
  };

  const passedCount = results.filter((r) => r.passed).length;
  const score = results.reduce((s, r) => s + (r.passed ? r.weight : 0), 0);
  const allPassed = results.length > 0 && passedCount === results.length;

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] capitalize">{lesson.language ?? "code"}</Badge>
          <span className="text-xs text-muted-foreground">Auto-graded · {tests.length} test cases · {totalWeight} pts</span>
        </div>
        <div className="flex gap-1">
          <Button variant={tab === "problem" ? "secondary" : "ghost"} size="sm" onClick={() => setTab("problem")}>Problem</Button>
          <Button variant={tab === "results" ? "secondary" : "ghost"} size="sm" onClick={() => setTab("results")}>
            Results{results.length > 0 && <Badge variant="outline" className="ml-1.5 text-[10px]">{passedCount}/{results.length}</Badge>}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {/* Left: problem / results */}
        <div className="rounded-lg border border-border bg-muted/20 p-3 max-h-[520px] overflow-y-auto">
          {tab === "problem" ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Problem</p>
                <p className="whitespace-pre-wrap">{lesson.codeProblem ?? "No problem statement provided."}</p>
              </div>
              {lesson.codeConstraints && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Constraints</p>
                  <pre className="text-xs font-mono bg-background border border-border rounded p-2 whitespace-pre-wrap">{lesson.codeConstraints}</pre>
                </div>
              )}
              {tests.filter((t) => !t.hidden).length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Sample test cases</p>
                  {tests.filter((t) => !t.hidden).map((t, i) => (
                    <div key={t.id} className="rounded border border-border bg-background p-2">
                      <p className="text-[10px] text-muted-foreground mb-1">Example {i + 1}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div>
                          <p className="text-[10px] text-muted-foreground font-sans">Input</p>
                          <pre className="whitespace-pre-wrap">{t.input}</pre>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground font-sans">Expected</p>
                          <pre className="whitespace-pre-wrap">{t.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tests.some((t) => t.hidden) && (
                    <p className="text-[11px] text-muted-foreground">+ {tests.filter((t) => t.hidden).length} hidden test case(s) used for grading</p>
                  )}
                </div>
              )}
              {lesson.codeHints && lesson.codeHints.length > 0 && (
                <div>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowHints((v) => !v)}>
                    <Sparkles className="h-3 w-3 mr-1" />{showHints ? "Hide hints" : "Show hints"}
                  </Button>
                  {showHints && (
                    <ul className="mt-1 space-y-1 text-xs list-disc pl-5 text-muted-foreground">
                      {lesson.codeHints.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-xs text-muted-foreground py-10">
              <ListChecks className="h-8 w-8 mb-2 opacity-60" />
              Submit your code to see test results.
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className={cn("flex items-center justify-between gap-3 p-3 rounded-lg border",
                allPassed ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                <div className="flex items-center gap-2">
                  {allPassed ? <CheckCircle className="h-6 w-6 text-success" /> : <AlertCircle className="h-6 w-6 text-destructive" />}
                  <div>
                    <p className="font-medium text-sm">{allPassed ? "All tests passed!" : "Some tests failed"}</p>
                    <p className="text-[11px] text-muted-foreground">{passedCount} of {results.length} passed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{score}<span className="text-xs text-muted-foreground">/{totalWeight}</span></p>
                  <p className="text-[10px] text-muted-foreground">score</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {results.map((r, i) => (
                  <div key={r.id} className={cn("rounded border px-3 py-2",
                    r.passed ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5")}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        {r.passed ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                        <span className="font-medium">Test {i + 1}</span>
                        {r.hidden && <Badge variant="outline" className="text-[9px]">Hidden</Badge>}
                        <span className="text-muted-foreground">· {r.weight} pts</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{r.time}s · {r.memoryKB} KB</span>
                    </div>
                    {!r.passed && !r.hidden && (
                      <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono">
                        <div>
                          <p className="text-[10px] font-sans text-muted-foreground">Expected</p>
                          <pre className="bg-background border border-border rounded p-1.5 whitespace-pre-wrap">{r.expected}</pre>
                        </div>
                        <div>
                          <p className="text-[10px] font-sans text-muted-foreground">Your output</p>
                          <pre className="bg-background border border-border rounded p-1.5 whitespace-pre-wrap">{r.actual}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: editor + custom test */}
        <div className="space-y-2">
          <div className="rounded-lg border border-border overflow-hidden bg-background">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-muted/40">
              <div className="flex items-center gap-1.5 text-xs">
                <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">Code editor</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={reset}>Reset</Button>
                {lesson.codeSolution && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => setShowSolution((v) => !v)}>
                    {showSolution ? "Hide solution" : "View solution"}
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="font-mono text-xs border-0 rounded-none focus-visible:ring-0 resize-none"
            />
            {showSolution && lesson.codeSolution && (
              <pre className="text-[11px] font-mono bg-muted/40 border-t border-border p-2 max-h-40 overflow-auto whitespace-pre-wrap">{lesson.codeSolution}</pre>
            )}
          </div>

          <div className="rounded-lg border border-border bg-background p-2 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Custom test</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Input</p>
                <Textarea rows={3} value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="font-mono text-[11px]" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Output</p>
                <pre className="font-mono text-[11px] bg-muted/40 border border-border rounded p-2 min-h-[64px] whitespace-pre-wrap">{customOutput || "—"}</pre>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning}>
                {isRunning ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Running…</> : <><Play className="h-3.5 w-3.5 mr-1" />Run</>}
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Grading…</> : <>Submit</>}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function simulateBadOutput(expected: string, seed: number) {
  const lines = expected.split("\n");
  if (lines.length === 0) return "";
  // tweak the (seed % lines.length)-th line
  const idx = seed % lines.length;
  lines[idx] = "?" + (lines[idx] ?? "");
  return lines.join("\n");
}

const icons: Record<string, any> = {
  video: Video,
  reading: FileText,
  lab: FlaskConical,
  "lab-instruction": ListChecks,
  "live-session": Radio,
  quiz: Award,
  assignment: FileText,
  "code-exercise": Code2,
  "ctf-scenario": Flag,
  exam: ShieldCheck,
  "mock-exam": ShieldCheck,
  survey: MessageSquare,
  "game-based-learning": Sparkles,
  reasoning: Brain,
};

const blockLabel: Record<string, string> = {
  video: "Video",
  reading: "Reading",
  lab: "Lab",
  "lab-instruction": "Lab Instructions",
  "live-session": "Live Session",
  quiz: "Quiz",
  assignment: "Assignment",
  "code-exercise": "Code exercise",
  "ctf-scenario": "CTF scenario",
  exam: "Exam",
  "mock-exam": "Mock Exam",
  survey: "Survey",
  "game-based-learning": "Game",
  reasoning: "AI Reasoning",
};

export default function CoursePlayer() {
  const { id = "", lessonId = "" } = useParams();
  const nav = useNavigate();
  const c = getStudentCourse(id);
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("# Write your solution here\n");
  const [flag, setFlag] = useState("");

  const enrollment = useEnrollmentStore((s) => s.getForCourse("me", id));
  const consumeHours = useEnrollmentStore((s) => s.consumeHours);
  const markComplete = useEnrollmentStore((s) => s.markComplete);
  const walletRemaining = useEnrollmentStore((s) => s.walletRemaining);

  const flat = useMemo(
    () => c?.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title }))) ?? [],
    [c]
  );
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  if (!c || !lesson) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Card><CardContent className="py-12 text-center">Lesson not found.</CardContent></Card>
      </div>
    );
  }

  const isCompletedLesson = enrollment?.completedLessonIds.includes(lesson.id) ?? lesson.completed;
  const completedCount = flat.filter((l) => enrollment?.completedLessonIds.includes(l.id) || l.completed).length;
  const pct = Math.round((completedCount / flat.length) * 100);
  const wallet = enrollment ? walletRemaining(enrollment) : null;
  const Icon = icons[lesson.type] || BookOpen;

  const validUntil = enrollment?.validUntil;
  const daysLeft = validUntil ? Math.max(0, Math.ceil((new Date(validUntil).getTime() - Date.now()) / 86400000)) : null;

  const onMarkComplete = () => {
    if (enrollment) markComplete(enrollment.id, lesson.id);
    toast.success("Lesson marked complete");
    if (next) nav(`/student/courses/${c.id}/learn/${next.id}`);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to={`/student/courses/${c.id}`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ChevronLeft className="h-3 w-3" /> {c.name}
          </Link>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedCount}/{flat.length}</span>
          </div>
          <Progress value={pct} className="h-1 mt-1" />

          {/* Self-paced meta strip */}
          {c.deliveryMode === "self-paced" && (
            <div className="mt-3 space-y-1.5 text-[11px]">
              {daysLeft !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Validity</span>
                  <span className="font-medium">{daysLeft}d left</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" /> Lab wallet</span>
                <span className="font-medium">{wallet === null ? "Unlimited" : `${wallet.toFixed(1)}h`}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {c.chapters.map((ch, ci) => (
            <div key={ch.id}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1">Ch {ci + 1} · {ch.title}</p>
              {ch.lessons.map((l) => {
                const I = icons[l.type] || BookOpen;
                const active = l.id === lessonId;
                const done = enrollment?.completedLessonIds.includes(l.id) || l.completed;
                return (
                  <Link
                    key={l.id}
                    to={l.locked ? "#" : `/student/courses/${c.id}/learn/${l.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/10 text-primary font-medium" : l.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"}`}
                  >
                    {done ? <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" /> : l.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <I className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                    <span className="flex-1 truncate">{l.title}</span>
                    <span className="text-[10px] text-muted-foreground">{l.duration}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Main */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {/* Lesson header */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center"><Icon className="h-4 w-4" /></div>
            <div>
              <h1 className="text-base font-semibold">{lesson.title}</h1>
              <p className="text-[11px] text-muted-foreground">{blockLabel[lesson.type]} · {lesson.duration}</p>
            </div>
          </div>
          {isCompletedLesson && <Badge variant="outline" className="text-success border-success/30 bg-success/5 text-[10px]"><Check className="h-3 w-3 mr-1" /> Completed</Badge>}
        </div>

        {/* Block renderer */}
        <Card>
          <CardContent className="p-0">
            {lesson.type === "video" && (
              lesson.videoUrl && /youtube|vimeo/.test(lesson.videoUrl) ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={lesson.videoUrl}
                    title={lesson.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-foreground/95 flex items-center justify-center text-background relative">
                  <Play className="h-14 w-14 opacity-70" />
                  <p className="absolute bottom-4 left-4 text-xs opacity-70">Video player · {lesson.duration}</p>
                </div>
              )
            )}
            {lesson.type === "reading" && (
              lesson.bodyHtml ? (
                <div
                  className="p-8 prose prose-sm max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-relaxed prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted/60 prose-pre:text-foreground prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-table:text-xs"
                  dangerouslySetInnerHTML={{ __html: lesson.bodyHtml }}
                />
              ) : (
                <div className="p-8 prose prose-sm max-w-none">
                  <p className="text-sm text-muted-foreground">{lesson.body ?? "Read through the material below, then mark it complete."}</p>
                </div>
              )
            )}
            {(lesson.type === "quiz" || lesson.type === "mock-exam") && (
              <InlineQuiz lesson={lesson} />
            )}
            {lesson.type === "assignment" && (
              <InlineAssignment lesson={lesson} />
            )}
            {lesson.type === "code-exercise" && (
              <InlineCodeExercise lesson={lesson} />
            )}
            {(lesson.type === "lab" || lesson.type === "ctf-scenario") && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-xs text-muted-foreground">
                    {lesson.labAllocation?.type === "time-limited" && <>Time-limited · {lesson.labAllocation.sessionDurationHrs ?? 2}h per launch</>}
                    {lesson.labAllocation?.type === "hour-pool" && <>Hour pool · {lesson.labAllocation.hours ?? 0}h available</>}
                    {lesson.labAllocation?.type === "persistent" && <>Persistent · available for course duration</>}
                    {lesson.labAllocation?.type === "module-unlock" && <>Unlocks after: {lesson.labAllocation.unlockAfterLabel ?? "prerequisite"}</>}
                  </div>
                  <Button asChild size="sm" className="gap-1.5">
                    <Link to={`/student/courses/${c.id}/labs/${lesson.id}/workspace`}>
                      <Maximize2 className="h-3.5 w-3.5" /> Open Lab Workspace
                    </Link>
                  </Button>
                </div>
                {lesson.labMode === "persistent" ? (
                  <PersistentLabPanel templateName={lesson.labTemplate ?? "Course VM"} validUntil={validUntil} />
                ) : (
                  <OnDemandLabPanel
                    templateName={lesson.labTemplate ?? "Lab VM"}
                    estimatedHours={lesson.estimatedHours}
                    walletRemaining={wallet}
                    onConsumeHours={(h) => (enrollment ? consumeHours(enrollment.id, lesson.id, h) : false)}
                  />
                )}
                {lesson.type === "ctf-scenario" && (
                  <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><Flag className="h-3 w-3" /> Submit flag</p>
                    <div className="flex gap-2">
                      <Input placeholder="flag{...}" value={flag} onChange={(e) => setFlag(e.target.value)} className="font-mono text-xs" />
                      <Button size="sm" onClick={() => toast.success("Flag accepted · +1 to score")}>Submit</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {lesson.type === "lab-instruction" && (
              <div className="p-5 space-y-4">
                {lesson.labInstruction?.objective && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Objective</p>
                    <p className="text-sm">{lesson.labInstruction.objective}</p>
                  </div>
                )}
                {lesson.labInstruction?.prerequisites && lesson.labInstruction.prerequisites.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Prerequisites</p>
                    <ul className="text-sm list-disc pl-5 text-muted-foreground space-y-0.5">
                      {lesson.labInstruction.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                )}
                {lesson.labInstruction?.tasks && lesson.labInstruction.tasks.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tasks</p>
                    <ol className="space-y-2 text-sm">
                      {lesson.labInstruction.tasks.map((t, i) => (
                        <li key={t.id} className="flex gap-2">
                          <span className="font-mono text-xs text-muted-foreground w-5">{i + 1}.</span>
                          <div>
                            <p className="font-medium">{t.title}</p>
                            {t.detail && <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">{t.detail}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {lesson.labInstruction?.expectedOutcome && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expected outcome</p>
                    <p className="text-sm">{lesson.labInstruction.expectedOutcome}</p>
                  </div>
                )}
                {lesson.labInstruction?.resources && lesson.labInstruction.resources.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Resources</p>
                    <div className="space-y-1">
                      {lesson.labInstruction.resources.map((r, i) => (
                        <a key={i} href={r.url ?? "#"} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" /> {r.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <Button asChild className="gap-1.5">
                    <Link to={`/student/courses/${c.id}/labs/${lesson.id}/workspace`}>
                      <Play className="h-4 w-4" /> Launch Lab
                    </Link>
                  </Button>
                </div>
              </div>
            )}
            {lesson.type === "live-session" && (
              <div className="p-8 text-center space-y-3">
                <Radio className="h-10 w-10 mx-auto text-destructive" />
                <div>
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">Live instructor-led session · {lesson.duration}</p>
                </div>
                <Button asChild className="gap-1.5"><Link to="/student/live-class"><Play className="h-4 w-4" /> Join live class</Link></Button>
              </div>
            )}
            {lesson.type === "exam" && (
              <InlineExam lesson={lesson} />
            )}
            {lesson.type === "reasoning" && (
              <InlineReasoning lesson={lesson} />
            )}
            {lesson.type === "game-based-learning" && (
              <GameLessonPanel
                lessonId={lesson.id}
                title={lesson.title}
                gameType={lesson.gameType}
                gameUrl={lesson.gameUrl}
                description={lesson.body}
              />
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="notes">
          <TabsList>
            <TabsTrigger value="notes" className="text-xs">My Notes</TabsTrigger>
            <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
            <TabsTrigger value="discussion" className="text-xs">Discussion</TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-3">
            <Card><CardContent className="pt-6"><Textarea rows={5} placeholder="Jot down what you learned..." value={notes} onChange={(e) => setNotes(e.target.value)} /></CardContent></Card>
          </TabsContent>
          <TabsContent value="resources" className="mt-3">
            <Card><CardContent className="pt-6 space-y-2">
              {c.resources.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-2 rounded border border-border">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm flex-1">{r.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">{r.type}</Badge>
                  {r.size && <span className="text-xs text-muted-foreground">{r.size}</span>}
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="discussion" className="mt-3">
            <Card><CardContent className="pt-6 text-sm text-muted-foreground"><MessageSquare className="h-5 w-5 mb-2" /><Link to={`/student/courses/${c.id}/discussion`} className="text-primary underline">Open full discussion →</Link></CardContent></Card>
          </TabsContent>
        </Tabs>

        {/* Bottom bar */}
        <div className="sticky bottom-0 bg-background border-t border-border py-3 flex items-center justify-between">
          <Button variant="outline" size="sm" disabled={!prev} asChild={!!prev}>
            {prev ? <Link to={`/student/courses/${c.id}/learn/${prev.id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Previous</Link> : <span><ArrowLeft className="h-4 w-4 mr-1" /> Previous</span>}
          </Button>
          <Button size="sm" className="gap-1.5" onClick={onMarkComplete}>
            <Check className="h-4 w-4" /> Mark complete {next ? "& continue" : ""} {next && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
