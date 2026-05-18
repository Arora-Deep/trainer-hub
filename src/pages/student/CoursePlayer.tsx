import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, CheckCircle, Lock, Video, FileText, FlaskConical, Award, BookOpen, Play, Download, MessageSquare } from "lucide-react";
import { getStudentCourse } from "@/data/studentMockData";
import { toast } from "sonner";

const icons: Record<string, any> = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award, assignment: FileText };

export default function CoursePlayer() {
  const { id = "", lessonId = "" } = useParams();
  const nav = useNavigate();
  const c = getStudentCourse(id);
  const [notes, setNotes] = useState("");

  const flat = useMemo(() => c?.chapters.flatMap((ch) => ch.lessons.map((l) => ({ ...l, chapterTitle: ch.title }))) ?? [], [c]);
  const idx = flat.findIndex((l) => l.id === lessonId);
  const lesson = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  if (!c || !lesson) {
    return <div className="space-y-4"><Button variant="ghost" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button><Card><CardContent className="py-12 text-center">Lesson not found.</CardContent></Card></div>;
  }

  const completedCount = flat.filter((l) => l.completed).length;
  const pct = Math.round((completedCount / flat.length) * 100);

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to={`/student/courses/${c.id}`} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> {c.name}</Link>
          <div className="mt-2 flex items-center justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{completedCount}/{flat.length}</span></div>
          <Progress value={pct} className="h-1 mt-1" />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {c.chapters.map((ch, ci) => (
            <div key={ch.id}>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1">Ch {ci + 1} · {ch.title}</p>
              {ch.lessons.map((l) => {
                const Icon = icons[l.type] || BookOpen;
                const active = l.id === lessonId;
                return (
                  <Link key={l.id} to={l.locked ? "#" : `/student/courses/${c.id}/learn/${l.id}`} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${active ? "bg-primary/10 text-primary font-medium" : l.locked ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"}`}>
                    {l.completed ? <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" /> : l.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
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
        <Card>
          <CardContent className="p-0">
            {lesson.type === "video" && (
              <div className="aspect-video bg-foreground/95 flex items-center justify-center text-background relative">
                <Play className="h-14 w-14 opacity-70" />
                <p className="absolute bottom-4 left-4 text-xs opacity-70">Video player · {lesson.duration}</p>
              </div>
            )}
            {lesson.type === "reading" && (
              <div className="p-8 prose prose-sm max-w-none">
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground mt-2">{lesson.body ?? "Reading content goes here. This lesson is a written walkthrough — read through it and mark it complete when you're done."}</p>
                <p className="text-sm text-muted-foreground mt-2">Take notes on the right and revisit this anytime from the course outline.</p>
              </div>
            )}
            {lesson.type === "lab" && (
              <div className="p-8 text-center">
                <FlaskConical className="h-10 w-10 mx-auto text-primary mb-3" />
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Hands-on lab · {lesson.duration}</p>
                <Button asChild className="gap-1.5"><Link to="/student/labs"><Play className="h-4 w-4" /> Launch lab</Link></Button>
              </div>
            )}
            {lesson.type === "quiz" && (
              <div className="p-8 text-center">
                <Award className="h-10 w-10 mx-auto text-primary mb-3" />
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Quiz · {lesson.duration}</p>
                <Button asChild className="gap-1.5"><Link to="/student/assessments"><Play className="h-4 w-4" /> Start quiz</Link></Button>
              </div>
            )}
            {lesson.type === "assignment" && (
              <div className="p-8 text-center">
                <FileText className="h-10 w-10 mx-auto text-primary mb-3" />
                <h2 className="text-lg font-semibold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Assignment · {lesson.duration}</p>
                <Button asChild className="gap-1.5"><Link to="/student/assessments"><Play className="h-4 w-4" /> Open</Link></Button>
              </div>
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
          <Button size="sm" className="gap-1.5" onClick={() => { toast.success("Lesson marked complete"); next && nav(`/student/courses/${c.id}/learn/${next.id}`); }}>
            <Check className="h-4 w-4" /> Mark complete {next ? "& continue" : ""} {next && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
