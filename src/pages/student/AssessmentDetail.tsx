import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Clock, FileText, Award, Timer, Play, RefreshCw, BookOpen, CheckCircle } from "lucide-react";
import { getStudentAssessment } from "@/data/studentMockData";

export default function AssessmentDetail() {
  const { id = "" } = useParams();
  const a = getStudentAssessment(id);
  if (!a) return <Card><CardContent className="py-12 text-center">Assessment not found.</CardContent></Card>;

  const canStart = a.attempts < a.maxAttempts && a.status !== "completed";

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Assessments", href: "/student/assessments" }, { label: a.title }]}
        title={a.title}
        description={`${a.type} · ${a.course}`}
        actions={
          <div className="flex items-center gap-2">
            {a.status === "completed" && <Button asChild variant="outline" className="gap-1.5"><Link to={`/student/assessments/${a.id}/result`}><Award className="h-4 w-4" /> View Result</Link></Button>}
            {canStart && <Button asChild className="gap-1.5"><Link to={`/student/assessments/${a.id}/attempt`}><Play className="h-4 w-4" /> {a.attempts === 0 ? "Start attempt" : "Retry"}</Link></Button>}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Instructions</h3>
              <p className="text-sm text-muted-foreground">{a.instructions}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">What's covered</h3>
              <ul className="space-y-1.5">{a.syllabus.map((s, i) => <li key={i} className="text-sm flex gap-2"><CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />{s}</li>)}</ul>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
              ⚠ Once started, the timer runs continuously. Stable internet recommended.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3 text-sm">
            <Row icon={Badge} label="Type" value={a.type} />
            <Row icon={Timer} label="Time limit" value={`${a.timeLimitMin} minutes`} />
            {a.questions.length > 0 && <Row icon={FileText} label="Questions" value={`${a.questions.length}`} />}
            <Row icon={Award} label="Max score" value={`${a.maxScore}`} />
            <Row icon={RefreshCw} label="Attempts" value={`${a.attempts}/${a.maxAttempts}`} />
            <Row icon={Clock} label="Due" value={a.dueDate} />
            <Row icon={BookOpen} label="Batch" value={a.batch} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-3.5 w-3.5" />{label}</span><span className="font-medium">{value}</span></div>;
}
