import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PageHeader } from "@/components/ui/PageHeader";
import { ArrowLeft, BookOpen, Video, FileText, FlaskConical, Award, Lock, CheckCircle, Play, User, Clock, Star, Sparkles, Radio, Timer, Download } from "lucide-react";
import { getStudentCourse } from "@/data/studentMockData";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const moduleIcons: Record<string, any> = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award, assignment: FileText };

export default function StudentCourseDetail() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const c = getStudentCourse(id);
  if (!c) return <div className="space-y-4"><Button variant="ghost" size="sm" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button><Card><CardContent className="py-12 text-center text-sm">Course not found.</CardContent></Card></div>;

  const pct = Math.round((c.completed / c.modules) * 100);
  const next = c.nextLessonId;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Courses", href: "/student/courses" }, { label: c.name }]}
        title={c.name}
        description={c.description}
        actions={
          <Button asChild className="gap-1.5"><Link to={next ? `/student/courses/${c.id}/learn/${next}` : `/student/courses/${c.id}/learn/${c.chapters[0]?.lessons[0]?.id}`}><Play className="h-4 w-4" /> {c.status === "not_started" ? "Start course" : "Continue learning"}</Link></Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
              {c.deliveryMode === "self-paced" && <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px]"><Sparkles className="h-2.5 w-2.5 mr-0.5" />Self-paced</Badge>}
              {c.deliveryMode === "live" && <Badge className="bg-destructive/10 text-destructive border-0 text-[10px]"><Radio className="h-2.5 w-2.5 mr-0.5" />Live</Badge>}
              {c.deliveryMode === "hybrid" && <Badge className="bg-violet-500/10 text-violet-600 border-0 text-[10px]">Hybrid</Badge>}
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {c.rating}</span>
              <span className="text-xs text-muted-foreground">· {c.batch}</span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">{c.instructor}</p>
                <p className="text-xs text-muted-foreground">{c.instructorBio}</p>
              </div>
            </div>

            {c.prerequisites.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Prerequisites</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.prerequisites.map((p) => <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium">{c.completed}/{c.modules}</span></div>
              <Progress value={pct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{pct}% complete</p>
            </div>
            {c.deliveryMode === "self-paced" && c.totalAccessHours && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" />Lab access</span><span className="font-medium">{c.totalAccessHours - (c.usedAccessHours ?? 0)}h / {c.totalAccessHours}h</span></div>
                <Progress value={((c.usedAccessHours ?? 0) / c.totalAccessHours) * 100} className="h-1.5" />
              </div>
            )}
            {c.nextLiveSession && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Radio className="h-3 w-3" /> Next live session</p>
                <p className="text-sm font-medium mt-1">{c.nextLiveSession.title}</p>
                <p className="text-xs text-muted-foreground">{c.nextLiveSession.date} · {c.nextLiveSession.time}</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Modules" value={c.modules} /><Stat label="Total" value={`${c.totalHours}h`} /><Stat label="Your time" value={c.studyTime} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content" className="text-xs">Course Content</TabsTrigger>
          <TabsTrigger value="resources" className="text-xs" asChild><Link to={`/student/courses/${c.id}/resources`}>Resources</Link></TabsTrigger>
          <TabsTrigger value="discussion" className="text-xs" asChild><Link to={`/student/courses/${c.id}/discussion`}>Discussion</Link></TabsTrigger>
          <TabsTrigger value="progress" className="text-xs">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Accordion type="multiple" defaultValue={c.chapters.map((ch) => ch.id)}>
                {c.chapters.map((ch, ci) => (
                  <AccordionItem key={ch.id} value={ch.id}>
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center gap-2"><span className="text-muted-foreground">Chapter {ci + 1}</span> · {ch.title}<Badge variant="outline" className="text-[10px] ml-2">{ch.lessons.length} lessons</Badge></span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-2">
                        {ch.lessons.map((l) => {
                          const Icon = moduleIcons[l.type] || BookOpen;
                          return (
                            <Link key={l.id} to={l.locked ? "#" : `/student/courses/${c.id}/learn/${l.id}`} className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors ${l.locked ? "opacity-50 cursor-not-allowed" : ""}`}>
                              {l.completed ? <CheckCircle className="h-4 w-4 text-success" /> : l.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Icon className="h-4 w-4 text-muted-foreground" />}
                              <span className="text-sm flex-1">{l.title}</span>
                              <Badge variant="outline" className="text-[10px] capitalize">{l.type}</Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{l.duration}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold mb-3">Study Time This Week</h4>
              {c.studyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={c.studyData}>
                    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} /><stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }} />
                    <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="url(#g)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground">No activity yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return <div className="p-2 rounded-lg bg-muted/50"><p className="text-base font-bold">{value}</p><p className="text-[10px] text-muted-foreground">{label}</p></div>;
}
