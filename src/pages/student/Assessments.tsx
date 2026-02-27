import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";

const assessments = [
  { id: "1", title: "AWS VPC Quiz", type: "Quiz", course: "AWS Cloud Practitioner", dueDate: "Today", score: null, status: "pending", questions: 20 },
  { id: "2", title: "Docker Assignment", type: "Assignment", course: "Docker Essentials", dueDate: "Mar 1", score: null, status: "pending", questions: 5 },
  { id: "3", title: "K8s Pod Exercise", type: "Exercise", course: "Kubernetes Fundamentals", dueDate: "Mar 3", score: null, status: "not_started", questions: 3 },
  { id: "4", title: "AWS IAM Quiz", type: "Quiz", course: "AWS Cloud Practitioner", dueDate: "Feb 20", score: 85, status: "completed", questions: 15 },
  { id: "5", title: "Docker Basics Quiz", type: "Quiz", course: "Docker Essentials", dueDate: "Feb 15", score: 92, status: "completed", questions: 10 },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  pending: { color: "bg-warning/10 text-warning", icon: Clock },
  not_started: { color: "bg-muted text-muted-foreground", icon: AlertCircle },
  completed: { color: "bg-success/10 text-success", icon: CheckCircle },
};

export default function StudentAssessments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground text-sm mt-1">Quizzes, assignments, and exercises</p>
      </div>

      <div className="space-y-3">
        {assessments.map((a) => {
          const cfg = statusConfig[a.status];
          return (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{a.title}</h3>
                        <Badge variant="outline" className="text-[11px]">{a.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.course} · {a.questions} questions · Due: {a.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.score !== null && <span className="text-sm font-bold">{a.score}%</span>}
                    <Badge variant="secondary" className={`text-xs capitalize ${cfg.color}`}>{a.status.replace("_", " ")}</Badge>
                    {a.status !== "completed" && <Button size="sm">{a.status === "pending" ? "Continue" : "Start"}</Button>}
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
