import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { Clock, Calendar, User, Play, Monitor, Download, Video, FileText, Sparkles, Award } from "lucide-react";
import { getStudentSession } from "@/data/studentMockData";
import { toast } from "sonner";

const typeIcons: Record<string, any> = { live: Video, lab: Monitor, "self-paced": Sparkles, assessment: Award };

export default function SessionDetail() {
  const { id = "" } = useParams();
  const s = getStudentSession(id);
  if (!s) return <Card><CardContent className="py-12 text-center">Session not found.</CardContent></Card>;
  const Icon = typeIcons[s.type] || Video;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Schedule", href: "/student/schedule" }, { label: s.title }]}
        title={s.title}
        description={s.description}
        actions={
          <div className="flex items-center gap-2">
            {s.type === "live" && s.joinUrl && <Button className="gap-1.5"><Play className="h-4 w-4" /> Join session</Button>}
            {s.type === "lab" && s.labId && <Button asChild className="gap-1.5"><Link to={`/student/labs/${s.labId}`}><Monitor className="h-4 w-4" /> Launch lab</Link></Button>}
            {s.type === "assessment" && <Button asChild className="gap-1.5"><Link to="/student/assessments"><Play className="h-4 w-4" /> Open assessment</Link></Button>}
            {s.type === "self-paced" && <Button className="gap-1.5"><Play className="h-4 w-4" /> Start now</Button>}
            <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Calendar invite downloaded")}><Download className="h-4 w-4" /> .ics</Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-0 text-[10px] capitalize"><Icon className="h-3 w-3 mr-1" />{s.type}</Badge>
              <Badge variant="outline" className="text-[10px]">{s.batch}</Badge>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Agenda</h3>
              <ul className="space-y-1.5">
                {s.agenda.map((a, i) => <li key={i} className="text-sm flex gap-2"><span className="text-muted-foreground">{i + 1}.</span>{a}</li>)}
                {s.agenda.length === 0 && <p className="text-sm text-muted-foreground">No agenda provided.</p>}
              </ul>
            </div>
            {s.prep.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Prep checklist</h3>
                <div className="space-y-1.5">
                  {s.prep.map((p, i) => <label key={i} className="flex items-center gap-2 text-sm"><Checkbox /> {p}</label>)}
                </div>
              </div>
            )}
            {s.resources.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Related materials</h3>
                <div className="space-y-2">
                  {s.resources.map((r) => (
                    <a key={r.id} href={r.url} className="flex items-center gap-3 p-2 rounded border border-border hover:bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" /><span className="text-sm flex-1">{r.name}</span><Download className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{s.date}</span></div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" /><span>{s.time} · {s.duration}</span></div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>{s.instructor}</span></div>
            {s.labId && <Link to={`/student/labs/${s.labId}`} className="text-xs text-primary underline mt-2 block">Related lab →</Link>}
            {s.courseId && <Link to={`/student/courses/${s.courseId}`} className="text-xs text-primary underline block">Open course →</Link>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
