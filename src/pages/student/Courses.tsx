import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, CheckCircle } from "lucide-react";

const courses = [
  { id: "1", name: "AWS Cloud Practitioner", modules: 12, completed: 8, totalHours: 24, status: "in_progress" },
  { id: "2", name: "Kubernetes Fundamentals", modules: 8, completed: 2, totalHours: 16, status: "in_progress" },
  { id: "3", name: "Docker Essentials", modules: 6, completed: 6, totalHours: 10, status: "completed" },
  { id: "4", name: "Terraform Basics", modules: 10, completed: 0, totalHours: 18, status: "not_started" },
];

export default function StudentCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your learning journey</p>
      </div>

      <div className="space-y-4">
        {courses.map((c) => {
          const pct = Math.round((c.completed / c.modules) * 100);
          return (
            <Card key={c.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {c.status === "completed" ? <CheckCircle className="h-5 w-5 text-success" /> : <BookOpen className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.completed}/{c.modules} modules · {c.totalHours}h total</p>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant={c.status === "completed" ? "outline" : "default"} className="gap-1.5 shrink-0">
                    <Play className="h-3.5 w-3.5" /> {c.status === "completed" ? "Review" : c.status === "not_started" ? "Start" : "Continue"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
