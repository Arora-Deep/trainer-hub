import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useQuizStore } from "@/stores/quizStore";
import { ArrowLeft, Clock, HelpCircle, Target, RotateCcw, Edit, Play } from "lucide-react";

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quiz = useQuizStore((s) => s.quizzes.find((q) => q.id === id));

  const sample = useMemo(
    () => quiz?.questions.slice(0, 5) || [],
    [quiz]
  );

  if (!quiz) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/quizzes")} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to Quizzes
        </Button>
        <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">Quiz not found</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/quizzes")} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back to Quizzes
      </Button>

      <PageHeader
        title={quiz.title}
        description={quiz.course}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => navigate(`/quizzes/create?duplicate=${quiz.id}`)}><Edit className="h-4 w-4" /> Edit</Button>
            <Button
              className="gap-2"
              onClick={() => {
                if (quiz.questions.length === 0) {
                  alert("This quiz has no questions yet. Add questions before previewing.");
                  return;
                }
                window.alert(`Preview mode — ${quiz.questions.length} questions, ${quiz.duration} min. (Demo: opens in the student view in production.)`);
              }}
            ><Play className="h-4 w-4" /> Preview</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><HelpCircle className="h-4 w-4 text-primary" /></div>
          <div><p className="text-xs text-muted-foreground">Questions</p><p className="text-xl font-bold">{quiz.questions.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Clock className="h-4 w-4 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">Duration</p><p className="text-xl font-bold">{quiz.duration} min</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><Target className="h-4 w-4 text-green-600" /></div>
          <div><p className="text-xs text-muted-foreground">Passing</p><p className="text-xl font-bold">{quiz.passingPercentage}%</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10"><RotateCcw className="h-4 w-4 text-amber-600" /></div>
          <div><p className="text-xs text-muted-foreground">Max Attempts</p><p className="text-xl font-bold">{quiz.maxAttempts}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Overview</CardTitle>
          <StatusBadge status={quiz.status === "published" ? "success" : "warning"} label={quiz.status} />
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Total Marks</span><span className="font-medium">{quiz.totalMarks}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Attempts</span><span className="font-medium">{quiz.attempts}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Avg Score</span><span className="font-medium">{quiz.avgScore}%</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Shuffle</span><span className="font-medium">{quiz.settings.shuffleQuestions ? "Yes" : "No"}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Show Answers</span><span className="font-medium">{quiz.settings.showAnswers ? "Yes" : "No"}</span></div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-muted-foreground">Negative Marking</span><span className="font-medium">{quiz.settings.enableNegativeMarking ? "Yes" : "No"}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Questions Preview</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {quiz.questions.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No questions added yet.</p>
          )}
          {sample.map((q, i) => (
            <div key={q.id} className="p-4 rounded-lg border bg-muted/10">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">Q{i + 1}. {q.question}</p>
                <Badge variant="secondary" className="text-[10px] capitalize">{q.type}</Badge>
              </div>
              {q.options && (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {q.options.map((o, j) => <li key={j}>• {o}</li>)}
                </ul>
              )}
            </div>
          ))}
          {quiz.questions.length > sample.length && (
            <p className="text-xs text-muted-foreground text-center">+ {quiz.questions.length - sample.length} more</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
