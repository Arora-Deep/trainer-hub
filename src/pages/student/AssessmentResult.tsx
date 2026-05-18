import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckCircle, XCircle, Award, ArrowRight, RefreshCw, BookOpen } from "lucide-react";
import { getStudentAssessment } from "@/data/studentMockData";

export default function AssessmentResult() {
  const { id = "" } = useParams();
  const a = getStudentAssessment(id);
  if (!a) return <Card><CardContent className="py-12 text-center">Not found.</CardContent></Card>;

  const stored = typeof window !== "undefined" ? sessionStorage.getItem(`assess-${a.id}-answers`) : null;
  const answers = stored ? (JSON.parse(stored) as Record<string, number>) : {};

  // mock score
  let correct = 0;
  a.questions.forEach((q) => { if (answers[q.id] === q.correctIndex) correct++; });
  const total = a.questions.length || 1;
  const computedPct = a.score !== null ? Math.round((a.score / a.maxScore) * 100) : Math.round((correct / total) * 100);
  const passed = computedPct >= 60;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Assessments", href: "/student/assessments" }, { label: a.title, href: `/student/assessments/${a.id}` }, { label: "Result" }]}
        title="Result"
        description={a.title}
      />

      <Card className={passed ? "border-success/30" : "border-destructive/30"}>
        <CardContent className="pt-6 text-center space-y-4">
          <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center ${passed ? "bg-success/10" : "bg-destructive/10"}`}>
            <Award className={`h-10 w-10 ${passed ? "text-success" : "text-destructive"}`} />
          </div>
          <div>
            <p className="text-4xl font-bold">{computedPct}%</p>
            <p className="text-sm text-muted-foreground mt-1">{passed ? "Passed" : "Did not pass"} · {correct}/{total} correct</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            {a.attempts + 1 < a.maxAttempts && <Button asChild variant="outline" className="gap-1.5"><Link to={`/student/assessments/${a.id}/attempt`}><RefreshCw className="h-4 w-4" /> Retry</Link></Button>}
            <Button asChild className="gap-1.5"><Link to={`/student/courses/${a.courseId}`}><BookOpen className="h-4 w-4" /> Back to course</Link></Button>
          </div>
        </CardContent>
      </Card>

      {a.questions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-4">Per-question breakdown</h3>
            <div className="space-y-3">
              {a.questions.map((q, i) => {
                const userAns = answers[q.id];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div key={q.id} className="p-3 rounded-lg border border-border">
                    <div className="flex items-start gap-2">
                      {isCorrect ? <CheckCircle className="h-4 w-4 text-success mt-0.5" /> : <XCircle className="h-4 w-4 text-destructive mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{i + 1}. {q.text}</p>
                        <p className="text-xs mt-1">Your answer: <span className={isCorrect ? "text-success" : "text-destructive"}>{userAns !== undefined ? q.options?.[userAns] : "—"}</span></p>
                        {!isCorrect && <p className="text-xs text-success">Correct: {q.options?.[q.correctIndex!]}</p>}
                        {q.explanation && <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
