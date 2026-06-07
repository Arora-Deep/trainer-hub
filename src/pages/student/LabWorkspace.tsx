import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  ArrowLeft, Play, Square, RotateCw, Pause, Save, History, Maximize2, Timer,
  Cpu, MemoryStick, Wifi, Monitor, ListChecks, ExternalLink, AlertCircle,
} from "lucide-react";
import { getStudentCourse, type StudentLesson, type StudentLabInstruction } from "@/data/studentMockData";
import { toast } from "sonner";

type VmStatus = "running" | "stopped" | "paused" | "provisioning";

export default function LabWorkspace() {
  const { id = "", lessonId = "" } = useParams();
  const nav = useNavigate();
  const course = getStudentCourse(id);

  const flat = useMemo(
    () => course?.chapters.flatMap((ch) => ch.lessons) ?? [],
    [course]
  );
  const lesson = flat.find((l) => l.id === lessonId);
  // Try to find sibling lab-instruction for this lab
  const instructionLesson: StudentLesson | undefined =
    flat.find((l) => l.type === "lab-instruction" && l.id !== lessonId) ?? lesson;
  const instructions: StudentLabInstruction | undefined =
    lesson?.labInstruction ?? instructionLesson?.labInstruction;

  const [status, setStatus] = useState<VmStatus>("provisioning");
  const [elapsed, setElapsed] = useState(0);
  const [taskState, setTaskState] = useState<Record<string, boolean>>({});

  // Time limit (seconds)
  const sessionLimitSec =
    (lesson?.labAllocation?.sessionDurationHrs ?? lesson?.estimatedHours ?? 2) * 3600;

  useEffect(() => {
    const t = setTimeout(() => setStatus("running"), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  if (!course || !lesson) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Card><CardContent className="py-12 text-center text-sm">Lab not found.</CardContent></Card>
      </div>
    );
  }

  const remaining = Math.max(0, sessionLimitSec - elapsed);
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };
  const toggleTask = (tid: string) => setTaskState((p) => ({ ...p, [tid]: !p[tid] }));
  const doneCount = instructions?.tasks?.filter((t) => taskState[t.id]).length ?? 0;
  const totalTasks = instructions?.tasks?.length ?? 0;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/student/courses/${course.id}/learn/${lesson.id}`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to lesson
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-base font-semibold truncate">{lesson.labTemplate ?? lesson.title}</h1>
            <p className="text-[11px] text-muted-foreground truncate">{course.name} · {lesson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={
            status === "running" ? "bg-success/10 text-success border-0" :
            status === "provisioning" ? "bg-warning/10 text-warning border-0" :
            "bg-muted text-muted-foreground border-0"
          }>
            ● {status === "provisioning" ? "Booting…" : status === "running" ? "Running" : status}
          </Badge>
          <Badge variant="outline" className="gap-1 font-mono text-[11px]">
            <Timer className="h-3 w-3" /> {fmt(remaining)} left
          </Badge>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border bg-card">
        {/* Left: instructions */}
        <ResizablePanel defaultSize={26} minSize={18}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Lab Instructions</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{doneCount}/{totalTasks}</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-5 text-sm">
                {!instructions ? (
                  <p className="text-xs text-muted-foreground">No instructions attached. Ask your trainer to add lab instructions to this lesson.</p>
                ) : (
                  <>
                    {instructions.objective && (
                      <Section title="Objective">
                        <p className="text-xs text-foreground/80">{instructions.objective}</p>
                      </Section>
                    )}
                    {instructions.prerequisites && instructions.prerequisites.length > 0 && (
                      <Section title="Prerequisites">
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                          {instructions.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </Section>
                    )}
                    {instructions.tasks && instructions.tasks.length > 0 && (
                      <Section title="Tasks">
                        <div className="space-y-2">
                          {instructions.tasks.map((t, i) => {
                            const done = !!taskState[t.id];
                            return (
                              <div key={t.id} className="flex items-start gap-2">
                                <Checkbox checked={done} onCheckedChange={() => toggleTask(t.id)} className="mt-0.5" />
                                <div className={`flex-1 ${done ? "line-through text-muted-foreground" : ""}`}>
                                  <p className="text-xs font-medium">{i + 1}. {t.title}</p>
                                  {t.detail && <p className="text-[11px] text-muted-foreground mt-0.5 whitespace-pre-wrap">{t.detail}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Section>
                    )}
                    {instructions.expectedOutcome && (
                      <Section title="Expected outcome">
                        <p className="text-xs text-foreground/80">{instructions.expectedOutcome}</p>
                      </Section>
                    )}
                    {instructions.resources && instructions.resources.length > 0 && (
                      <Section title="Resources">
                        <div className="space-y-1.5">
                          {instructions.resources.map((r, i) => (
                            <a key={i} href={r.url ?? "#"} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline">
                              <ExternalLink className="h-3 w-3" /> {r.label}
                            </a>
                          ))}
                        </div>
                      </Section>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center: console */}
        <ResizablePanel defaultSize={54} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">VM Console</span>
                <Badge variant="outline" className="text-[10px]">10.0.1.42</Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> 45%</span>
                <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" /> 62%</span>
                <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-success" /> Connected</span>
              </div>
            </div>
            <div className="flex-1 bg-foreground/95 text-background p-4 font-mono text-xs overflow-auto">
              {status === "provisioning" ? (
                <div className="flex items-center justify-center h-full text-background/60">
                  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                  Booting your VM…
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-success">student@vpc-lab:~$ ip a</div>
                  <div className="text-background/70">inet 10.0.1.42/24 brd 10.0.1.255 scope global eth0</div>
                  <div className="text-success">student@vpc-lab:~$ aws ec2 describe-vpcs --region us-east-1</div>
                  <div className="text-background/70">{`{ "Vpcs": [ { "VpcId": "vpc-0a1b2c", "CidrBlock": "10.0.0.0/16", "State": "available" } ] }`}</div>
                  <div className="text-success">student@vpc-lab:~$ _</div>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: controls */}
        <ResizablePanel defaultSize={20} minSize={16}>
          <div className="flex flex-col h-full">
            <div className="border-b px-4 py-2">
              <span className="text-sm font-semibold">Lab Controls</span>
            </div>
            <div className="p-4 space-y-4 overflow-auto">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => { setStatus("running"); toast.success("VM started"); }}>
                  <Play className="h-3.5 w-3.5" /> Start
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => { setStatus("stopped"); toast.message("VM stopped"); }}>
                  <Square className="h-3.5 w-3.5" /> Stop
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => { setStatus("provisioning"); setTimeout(() => setStatus("running"), 1200); toast.message("Restarting…"); }}>
                  <RotateCw className="h-3.5 w-3.5" /> Restart
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => { setStatus("paused"); toast.message("VM paused"); }}>
                  <Pause className="h-3.5 w-3.5" /> Pause
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Snapshot saved")}>
                  <Save className="h-3.5 w-3.5" /> Snapshot
                </Button>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.message("Restored")}>
                  <History className="h-3.5 w-3.5" /> Restore
                </Button>
              </div>

              <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={() => toast.message("Fullscreen mode")}>
                <Maximize2 className="h-3.5 w-3.5" /> Fullscreen console
              </Button>

              <div className="rounded-md border bg-muted/40 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Timer className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">Session time</span>
                </div>
                <p className="font-mono text-lg tabular-nums">{fmt(remaining)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {lesson.labAllocation?.type === "time-limited"
                    ? `Time-limited · ${lesson.labAllocation.sessionDurationHrs ?? 2}h per launch`
                    : lesson.labAllocation?.type === "hour-pool"
                    ? `Hour pool · ${lesson.labAllocation.hours ?? 0}h available`
                    : lesson.labAllocation?.type === "persistent"
                    ? "Persistent · available for course duration"
                    : "On-demand session"}
                </p>
              </div>

              {remaining < 600 && (
                <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-2 text-[11px]">
                  <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                  <span>Less than 10 minutes left. Save your work before the VM auto-suspends.</span>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
