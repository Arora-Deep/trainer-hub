import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Clock, Flag, ArrowLeft, ArrowRight, Upload, Play, Send } from "lucide-react";
import { getStudentAssessment } from "@/data/studentMockData";
import { toast } from "sonner";

export default function AssessmentAttempt() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const a = getStudentAssessment(id);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [code, setCode] = useState(a?.starterCode ?? "");
  const [text, setText] = useState("");
  const [secs, setSecs] = useState((a?.timeLimitMin ?? 30) * 60);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!a) return <Card><CardContent className="py-12 text-center">Not found.</CardContent></Card>;

  const isQuiz = a.type === "Quiz" && a.questions.length > 0;
  const isAssign = a.type === "Assignment";
  const isExercise = a.type === "Exercise";

  const mm = Math.floor(secs / 60).toString().padStart(2, "0");
  const ss = (secs % 60).toString().padStart(2, "0");

  const submit = () => {
    sessionStorage.setItem(`assess-${a.id}-answers`, JSON.stringify(answers));
    toast.success("Submitted!");
    nav(`/student/assessments/${a.id}/result`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2">
        <div>
          <Link to={`/student/assessments/${a.id}`} className="text-xs text-muted-foreground flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Exit attempt</Link>
          <h1 className="text-lg font-bold mt-1">{a.title}</h1>
        </div>
        <Badge className={`text-sm gap-1.5 px-3 py-1.5 ${secs < 60 ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground"}`}>
          <Clock className="h-4 w-4" /> {mm}:{ss}
        </Badge>
      </div>

      {isQuiz && (
        <>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Question {idx + 1} of {a.questions.length}</span>
            <span>{Object.keys(answers).length} answered · {flagged.size} flagged</span>
          </div>
          <Progress value={((idx + 1) / a.questions.length) * 100} className="h-1" />

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-base font-medium flex-1">{a.questions[idx].text}</h2>
                <button onClick={() => { const n = new Set(flagged); n.has(a.questions[idx].id) ? n.delete(a.questions[idx].id) : n.add(a.questions[idx].id); setFlagged(n); }}>
                  <Flag className={`h-4 w-4 ${flagged.has(a.questions[idx].id) ? "text-warning fill-warning" : "text-muted-foreground"}`} />
                </button>
              </div>
              <div className="space-y-2">
                {a.questions[idx].options?.map((opt, oi) => (
                  <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${answers[a.questions[idx].id] === oi ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                    <input type="radio" name={a.questions[idx].id} checked={answers[a.questions[idx].id] === oi} onChange={() => setAnswers({ ...answers, [a.questions[idx].id]: oi })} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}><ArrowLeft className="h-4 w-4 mr-1" /> Previous</Button>
            {idx < a.questions.length - 1 ? (
              <Button onClick={() => setIdx(idx + 1)}>Next <ArrowRight className="h-4 w-4 ml-1" /></Button>
            ) : (
              <Button onClick={submit} className="gap-1.5"><Send className="h-4 w-4" /> Submit</Button>
            )}
          </div>
        </>
      )}

      {isAssign && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{a.instructions}</p>
            <div className="space-y-3">
              <label className="text-sm font-medium">Your submission</label>
              <Textarea rows={6} placeholder="Describe your approach..." value={text} onChange={(e) => setText(e.target.value)} />
              <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                <Input type="file" className="max-w-xs mx-auto" />
                <p className="text-xs text-muted-foreground mt-2">Upload .zip / .pdf / .py</p>
              </div>
            </div>
            <Button onClick={submit} className="w-full gap-1.5"><Send className="h-4 w-4" /> Submit assignment</Button>
          </CardContent>
        </Card>
      )}

      {isExercise && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{a.instructions}</p>
            <div>
              <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium">Code · {a.language}</label><Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Running...")}><Play className="h-3.5 w-3.5" /> Run</Button></div>
              <Textarea rows={14} className="font-mono text-xs" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="bg-foreground/95 text-success font-mono text-xs p-3 rounded-lg min-h-[80px]">
              <p className="text-success/60">$ output</p>
              <p>Ready to run.</p>
            </div>
            <Button onClick={submit} className="w-full gap-1.5"><Send className="h-4 w-4" /> Submit exercise</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
