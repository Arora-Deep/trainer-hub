import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Monitor, FileText, Trophy, Clock, Calendar } from "lucide-react";

const enrolledBatches = [
  { name: "AWS Cloud Practitioner — Batch 12", trainer: "TechSkills Academy", progress: 65, nextSession: "Today, 2:00 PM" },
  { name: "Kubernetes Fundamentals — Batch 5", trainer: "CodeCraft Institute", progress: 30, nextSession: "Tomorrow, 10:00 AM" },
];

const upcomingSessions = [
  { title: "AWS VPC Deep Dive", time: "Today, 2:00 PM", duration: "2h", batch: "AWS Batch 12" },
  { title: "K8s Pod Networking", time: "Tomorrow, 10:00 AM", duration: "1.5h", batch: "K8s Batch 5" },
  { title: "IAM Policies Lab", time: "Wed, 3:00 PM", duration: "1h", batch: "AWS Batch 12" },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your learning progress</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Active Courses", value: "3", icon: BookOpen, color: "text-primary" },
          { label: "Lab Hours", value: "24h", icon: Monitor, color: "text-success" },
          { label: "Assessments Due", value: "2", icon: FileText, color: "text-warning" },
          { label: "Certificates", value: "1", icon: Trophy, color: "text-info" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div>
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${s.color}`}><s.icon className="h-5 w-5" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-4">My Batches</h3>
            <div className="space-y-4">
              {enrolledBatches.map((b, i) => (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div><p className="font-medium text-sm">{b.name}</p><p className="text-xs text-muted-foreground">{b.trainer}</p></div>
                    <Badge variant="secondary" className="text-xs">{b.progress}%</Badge>
                  </div>
                  <Progress value={b.progress} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Clock className="h-3 w-3" /> Next: {b.nextSession}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-4">Upcoming Sessions</h3>
            <div className="space-y-3">
              {upcomingSessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-4 w-4 text-primary" /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.batch} · {s.duration}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
