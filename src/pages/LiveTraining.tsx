import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Radio, Hand, Users, AlertCircle, Megaphone, BookOpen, Camera, Power,
  MessageSquare, Send, X, Search, Wifi, WifiOff, RotateCcw, Monitor,
  FileText, Link2, Download, Sparkles, ChevronLeft, ChevronRight, Play,
  CheckCircle2, Circle, Mic, Video, ScreenShare, Square, RefreshCw,
  BarChart3, TrendingUp, Clock, Activity, Maximize2, LayoutPanelLeft, Minimize2,
} from "lucide-react";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore } from "@/stores/courseStore";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StudentState = "healthy" | "raised" | "warning" | "offline";
type MainTab = "split" | "students" | "trainer" | "resources" | "analytics";
type SplitSide = "students" | "chat" | null;

const stateAccent: Record<StudentState, { dot: string; ring: string; label: string; text: string; bg: string }> = {
  healthy: { dot: "bg-success",     ring: "ring-success/25",     label: "Healthy",         text: "text-success",     bg: "bg-success/5" },
  raised:  { dot: "bg-warning",     ring: "ring-warning/35",     label: "Hand raised",     text: "text-warning",     bg: "bg-warning/5" },
  warning: { dot: "bg-destructive", ring: "ring-destructive/30", label: "Needs attention", text: "text-destructive", bg: "bg-destructive/5" },
  offline: { dot: "bg-muted-foreground", ring: "ring-border",    label: "Disconnected",    text: "text-muted-foreground", bg: "bg-muted/40" },
};

function formatTimer(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

type StudentRow = {
  id: string; name: string; email: string; initials: string; ip: string;
  state: StudentState; connection: string; vmName: string; cpu: number; ram: number;
  lessonIdx: number; errors: number; attendance: number;
};

export default function LiveTraining() {
  const { batches, createSnapshot } = useBatchStore();
  const { courses } = useCourseStore();

  const liveBatches = batches.filter(b => b.status === "live" || b.status === "upcoming");
  const [selectedBatchId, setSelectedBatchId] = useState(liveBatches[0]?.id || "");
  const batch = batches.find(b => b.id === selectedBatchId);

  const [sessionActive, setSessionActive] = useState(true);
  const [sessionTimer, setSessionTimer] = useState(8062);
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");
  const [chatTab, setChatTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [trainerOpen, setTrainerOpen] = useState(true);
  const [activeLessonIdx, setActiveLessonIdx] = useState(2);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [shareOn, setShareOn] = useState(false);
  const [trainerVmRunning, setTrainerVmRunning] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>("students");
  const [splitFullscreen, setSplitFullscreen] = useState(false);
  const [splitSide, setSplitSide] = useState<SplitSide>("students");

  const [messages, setMessages] = useState<{ id: string; from: string; text: string; t: string; kind: "msg" | "q" | "sys" }[]>([
    { id: "1", from: "Alice Johnson", text: "Can you re-explain VPC peering?", t: "2:34", kind: "q" },
    { id: "2", from: "Bob Williams", text: "Got it, thanks!", t: "2:35", kind: "msg" },
    { id: "3", from: "Eva Martinez", text: "Permission denied on port 443", t: "2:37", kind: "q" },
  ]);

  useEffect(() => {
    if (!sessionActive) return;
    const iv = setInterval(() => setSessionTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [sessionActive]);

  const participants = batch?.participants || [];
  const participantVMs = batch?.vmConfig?.participantVMs || [];

  // Course content
  const linkedCourse = courses.find(c => batch?.courseId === c.id) || courses[0];
  const lessons = useMemo(() => {
    const mods = linkedCourse?.chapters || [];
    const flat: { id: string; title: string; module: string; duration?: string }[] = [];
    mods.forEach(m => {
      (m.lessons || []).forEach(l => flat.push({ id: l.id, title: l.title, module: m.title, duration: l.duration }));
    });
    if (flat.length === 0) {
      return [
        { id: "l1", title: "Course intro & objectives", module: "Module 1", duration: "10m" },
        { id: "l2", title: "Cloud networking primer", module: "Module 2", duration: "25m" },
        { id: "l3", title: "VPC peering & transit gateway", module: "Module 4", duration: "40m" },
        { id: "l4", title: "Hands-on lab: peering setup", module: "Module 4", duration: "60m" },
        { id: "l5", title: "Q&A and recap", module: "Module 5", duration: "15m" },
      ];
    }
    return flat;
  }, [linkedCourse]);

  const grid: StudentRow[] = useMemo(() => {
    return participants.map((p, i) => {
      const vm = participantVMs.find(v => v.assignedTo === p.name);
      const baseStatus = vm?.status || p.vmStatus || "running";
      let state: StudentState = "healthy";
      if (baseStatus === "stopped" || baseStatus === "error" || baseStatus === "not_assigned") state = "offline";
      else if (i % 7 === 1) state = "raised";
      else if (i % 11 === 3) state = "warning";
      const lessonIdx = Math.max(0, Math.min(lessons.length - 1, activeLessonIdx + ((i % 5) - 2)));
      return {
        id: p.id, name: p.name, email: p.email,
        initials: p.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(),
        ip: vm?.ipAddress || "—",
        state,
        connection: state === "offline" ? "offline" : (i % 13 === 5 ? "weak" : "strong"),
        vmName: vm?.vmName || `${p.name.split(" ")[0].toLowerCase()}-vm`,
        cpu: 18 + ((i * 13) % 60),
        ram: 24 + ((i * 17) % 55),
        lessonIdx,
        errors: state === "warning" ? 2 + (i % 3) : (i % 9 === 0 ? 1 : 0),
        attendance: state === "offline" ? 0 : 70 + ((i * 7) % 30),
      };
    });
  }, [participants, participantVMs, lessons.length, activeLessonIdx]);

  const filtered = grid.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = grid.filter(s => s.state !== "offline").length;
  const handsRaised = grid.filter(s => s.state === "raised").length;
  const issues = grid.filter(s => s.state === "warning").length;
  const selectedStudent = grid.find(s => s.id === selectedStudentId);

  const sendBroadcast = () => {
    if (!broadcastText.trim()) return;
    toast({ title: "Broadcast sent", description: `Delivered to ${participants.length} students.` });
    setBroadcastText("");
    setBroadcastOpen(false);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(), from: "You", text: chatInput.trim(),
      t: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), kind: "msg",
    }]);
    setChatInput("");
  };

  if (!batch) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-muted flex items-center justify-center">
            <Radio className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">No live session</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Schedule a batch to start running live training.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-m-6 min-h-screen bg-background text-foreground">
      {/* Top Session Bar */}
      <header className="sticky top-0 z-30 bg-background border-b border-border">
        <div className="h-[64px] px-6 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="h-9 w-auto gap-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {liveBatches.map(b => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
            <div className="hidden md:block min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[15px] font-semibold tracking-tight truncate">{batch.name}</h1>
                {sessionActive && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 ring-1 ring-destructive/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-destructive">LIVE</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>Live training</span><span className="opacity-50">·</span>
                <span className="font-mono tabular-nums">{formatTimer(sessionTimer)}</span>
              </p>
            </div>
          </div>

          {/* MAIN VIEW SWITCHER */}
          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            <ViewTab active={mainTab === "split"} onClick={() => setMainTab("split")} icon={<LayoutPanelLeft className="h-3.5 w-3.5" />} label="Split" />
            <ViewTab active={mainTab === "students"} onClick={() => setMainTab("students")} icon={<Users className="h-3.5 w-3.5" />} label="Students" badge={grid.length} />
            <ViewTab active={mainTab === "trainer"} onClick={() => setMainTab("trainer")} icon={<Monitor className="h-3.5 w-3.5" />} label="Trainer" />
            <ViewTab active={mainTab === "resources"} onClick={() => setMainTab("resources")} icon={<BookOpen className="h-3.5 w-3.5" />} label="Resources" />
            <ViewTab active={mainTab === "analytics"} onClick={() => setMainTab("analytics")} icon={<BarChart3 className="h-3.5 w-3.5" />} label="Analytics" />
          </div>

          <div className="flex items-center gap-2">
            <Pill icon={<Users className="h-3 w-3" />} label="Online" value={`${onlineCount}/${grid.length}`} />
            <Pill icon={<Hand className="h-3 w-3" />} label="Raised" value={handsRaised} accent={handsRaised > 0 ? "amber" : undefined} />
            <Pill icon={<AlertCircle className="h-3 w-3" />} label="Issues" value={issues} accent={issues > 0 ? "rose" : undefined} />
            <div className="w-px h-5 bg-border mx-1" />
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setBroadcastOpen(true)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors">
                  <Megaphone className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Broadcast</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => { createSnapshot(batch.id, `Session ${formatTimer(sessionTimer)}`, "Live snapshot"); toast({ title: "Snapshot created", description: "All student VMs captured." }); }} className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">Snapshot all</TooltipContent>
            </Tooltip>
            <button
              onClick={() => setEndOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Power className="h-3.5 w-3.5" /> End
            </button>
          </div>
        </div>
      </header>

      {/* Body: Sticky Trainer Rail + Main */}
      <div className="flex">
        {/* LEFT TRAINER RAIL */}
        <aside
          className={cn(
            "sticky top-[64px] self-start shrink-0 border-r border-border bg-card transition-all duration-200",
            trainerOpen ? "w-[340px]" : "w-[56px]",
          )}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <button
            onClick={() => setTrainerOpen(o => !o)}
            className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center hover:bg-muted"
            aria-label={trainerOpen ? "Collapse trainer panel" : "Expand trainer panel"}
          >
            {trainerOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>

          {!trainerOpen ? (
            <div className="flex flex-col items-center gap-3 pt-6">
              <RailIcon icon={<Monitor className="h-4 w-4" />} active onClick={() => setTrainerOpen(true)} />
              <RailIcon icon={<Mic className={cn("h-4 w-4", micOn && "text-primary")} />} onClick={() => setMicOn(v => !v)} />
              <RailIcon icon={<Video className={cn("h-4 w-4", camOn && "text-primary")} />} onClick={() => setCamOn(v => !v)} />
              <RailIcon icon={<ScreenShare className={cn("h-4 w-4", shareOn && "text-primary")} />} onClick={() => setShareOn(v => !v)} />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Trainer identity */}
              <div className="px-5 pt-5 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">YT</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">You · Trainer</p>
                    <p className="text-[11px] text-muted-foreground truncate">trainer-master-vm</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  <PresenceBtn active={micOn} onClick={() => setMicOn(v => !v)} icon={<Mic className="h-3.5 w-3.5" />} label="Mic" />
                  <PresenceBtn active={camOn} onClick={() => setCamOn(v => !v)} icon={<Video className="h-3.5 w-3.5" />} label="Cam" />
                  <PresenceBtn active={shareOn} onClick={() => setShareOn(v => !v)} icon={<ScreenShare className="h-3.5 w-3.5" />} label="Share" />
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-5 py-4 space-y-5">
                  {/* CONSOLE PREVIEW */}
                  <RailSection title="Your machine">
                    <div
                      onClick={() => trainerVmRunning && setConsoleOpen(true)}
                      className={cn(
                        "group relative aspect-video rounded-xl overflow-hidden border border-border bg-zinc-950",
                        trainerVmRunning ? "cursor-pointer" : "cursor-not-allowed",
                      )}
                    >
                      {/* Mock terminal */}
                      {trainerVmRunning ? (
                        <>
                          <div className="absolute inset-0 p-3 font-mono text-[9px] leading-tight text-emerald-400/80 overflow-hidden">
                            <div>$ kubectl get pods -n training</div>
                            <div className="text-zinc-500">NAME                READY   STATUS</div>
                            <div>vpc-router-7d4f      1/1     Running</div>
                            <div>peering-gw-6a9e      1/1     Running</div>
                            <div>nat-instance-2f      1/1     Running</div>
                            <div className="mt-1">$ terraform apply</div>
                            <div className="text-zinc-500">Plan: 4 to add, 0 to change.</div>
                            <div className="text-emerald-400">Apply complete! Resources: 4 added.</div>
                            <div className="mt-1 inline-flex items-center">$ <span className="ml-1 inline-block h-2 w-1.5 bg-emerald-400 animate-pulse" /></div>
                          </div>
                          {/* status chip */}
                          <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[9px] font-medium text-white tracking-wide">RUNNING</span>
                          </div>
                          {/* hover overlay */}
                          <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Maximize2 className="h-5 w-5 text-white" />
                            <span className="text-[11px] font-medium text-white">Open console</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
                          <Power className="h-6 w-6" />
                          <span className="text-[11px]">VM stopped</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono">10.0.4.21</span>
                      <span>4 vCPU · 8 GB</span>
                    </div>
                  </RailSection>

                  {/* VM CONTROLS */}
                  <RailSection title="VM controls">
                    <div className="grid grid-cols-2 gap-1.5">
                      {trainerVmRunning ? (
                        <RailAction icon={<Square className="h-3.5 w-3.5" />} label="Stop" onClick={() => { setTrainerVmRunning(false); toast({ title: "VM stopped" }); }} />
                      ) : (
                        <RailAction icon={<Play className="h-3.5 w-3.5" />} label="Start" onClick={() => { setTrainerVmRunning(true); toast({ title: "VM starting" }); }} />
                      )}
                      <RailAction icon={<RotateCcw className="h-3.5 w-3.5" />} label="Restart" onClick={() => toast({ title: "VM restarting" })} />
                      <RailAction icon={<Camera className="h-3.5 w-3.5" />} label="Snapshot" onClick={() => toast({ title: "Snapshot saved" })} />
                      <RailAction icon={<RefreshCw className="h-3.5 w-3.5" />} label="Reset VM" onClick={() => toast({ title: "VM reset to template" })} />
                      <RailAction icon={<Monitor className="h-3.5 w-3.5" />} label="Console" onClick={() => setConsoleOpen(true)} />
                      <RailAction icon={<ScreenShare className="h-3.5 w-3.5" />} label="Share VM" onClick={() => toast({ title: "VM shared with class" })} />
                    </div>
                  </RailSection>

                  {/* Completed lessons */}
                  <RailSection title="Completed">
                    <div className="rounded-xl border border-border p-3">
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-semibold tabular-nums">{activeLessonIdx}</p>
                        <p className="text-[11px] text-muted-foreground">of {lessons.length}</p>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${lessons.length ? (activeLessonIdx / lessons.length) * 100 : 0}%` }} />
                      </div>
                      <div className="mt-3 space-y-1 max-h-32 overflow-auto">
                        {lessons.slice(0, activeLessonIdx).map((l) => (
                          <div key={l.id} className="flex items-center gap-1.5 text-[11px]">
                            <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                            <span className="truncate text-muted-foreground">{l.title}</span>
                          </div>
                        ))}
                        {activeLessonIdx === 0 && (
                          <p className="text-[11px] text-muted-foreground italic">No lessons completed yet</p>
                        )}
                      </div>
                      <button onClick={() => setMainTab("resources")} className="mt-2 text-[11px] font-medium text-primary hover:underline">Open course</button>
                    </div>
                  </RailSection>

                  {/* Class pulse */}
                  <RailSection title="Class pulse">
                    <div className="space-y-2">
                      <PulseRow label="Online" value={`${onlineCount}/${grid.length}`} tone="default" />
                      <PulseRow label="Hands raised" value={handsRaised} tone={handsRaised ? "warn" : "default"} />
                      <PulseRow label="Issues" value={issues} tone={issues ? "bad" : "default"} />
                    </div>
                  </RailSection>
                </div>
              </ScrollArea>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="flex-1 px-6 lg:px-8 pt-8 pb-24 max-w-[1400px]">
          {mainTab === "students" && (
            <StudentsView
              filtered={filtered} grid={grid} search={search} setSearch={setSearch}
              onSelect={(id) => setSelectedStudentId(id)}
              onAssist={(s) => toast({ title: `Assisting ${s.name}` })}
              onRestart={(s) => toast({ title: `Restarting ${s.vmName}` })}
            />
          )}
          {mainTab === "trainer" && (
            <TrainerView
              vmRunning={trainerVmRunning}
              setVmRunning={setTrainerVmRunning}
              micOn={micOn} setMicOn={setMicOn}
              camOn={camOn} setCamOn={setCamOn}
              shareOn={shareOn} setShareOn={setShareOn}
              messages={messages}
              chatInput={chatInput} setChatInput={setChatInput}
              onSendChat={sendChat}
              onOpenConsole={() => setConsoleOpen(true)}
            />
          )}
          {mainTab === "resources" && (
            <ResourcesView lessons={lessons} activeLessonIdx={activeLessonIdx} setActiveLessonIdx={setActiveLessonIdx} courseName={linkedCourse?.name || "Course"} />
          )}
          {mainTab === "analytics" && (
            <AnalyticsView grid={grid} lessons={lessons} sessionTimer={sessionTimer} />
          )}
          {mainTab === "split" && !splitFullscreen && (
            <SplitView
              batchName={batch.name}
              sessionTimer={sessionTimer}
              sessionActive={sessionActive}
              mainTab={mainTab}
              setMainTab={setMainTab}
              gridLength={grid.length}
              splitSide={splitSide}
              setSplitSide={setSplitSide}
              students={filtered}
              search={search}
              setSearch={setSearch}
              onSelectStudent={(id) => setSelectedStudentId(id)}
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              onSendChat={sendChat}
              lessons={lessons}
              activeLessonIdx={activeLessonIdx}
              setActiveLessonIdx={setActiveLessonIdx}
              courseName={linkedCourse?.name || "Course"}
              trainerVmRunning={trainerVmRunning}
              setTrainerVmRunning={setTrainerVmRunning}
              micOn={micOn} setMicOn={setMicOn}
              camOn={camOn} setCamOn={setCamOn}
              shareOn={shareOn} setShareOn={setShareOn}
              onOpenConsole={() => setConsoleOpen(true)}
              onSnapshot={() => { createSnapshot(batch.id, `Session ${formatTimer(sessionTimer)}`, "Live snapshot"); toast({ title: "Snapshot created" }); }}
              onEnd={() => setEndOpen(true)}
              fullscreen={false}
              setFullscreen={setSplitFullscreen}
            />
          )}
        </main>
      </div>

      {/* Floating Conversations */}
      {mainTab !== "split" && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-12 px-5 inline-flex items-center gap-2.5 rounded-full bg-foreground text-background text-sm font-medium shadow-lg hover:opacity-90 transition"
        >
          <MessageSquare className="h-4 w-4" /> Conversations
          {messages.filter(m => m.kind === "q").length > 0 && (
            <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold">
              {messages.filter(m => m.kind === "q").length}
            </span>
          )}
        </button>
      )}

      {/* SPLIT VIEW (fullscreen overlay) */}
      {mainTab === "split" && splitFullscreen && (
        <SplitView
          batchName={batch.name}
          sessionTimer={sessionTimer}
          sessionActive={sessionActive}
          mainTab={mainTab}
          setMainTab={setMainTab}
          gridLength={grid.length}
          splitSide={splitSide}
          setSplitSide={setSplitSide}
          students={filtered}
          search={search}
          setSearch={setSearch}
          onSelectStudent={(id) => setSelectedStudentId(id)}
          messages={messages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSendChat={sendChat}
          lessons={lessons}
          activeLessonIdx={activeLessonIdx}
          setActiveLessonIdx={setActiveLessonIdx}
          courseName={linkedCourse?.name || "Course"}
          trainerVmRunning={trainerVmRunning}
          setTrainerVmRunning={setTrainerVmRunning}
          micOn={micOn} setMicOn={setMicOn}
          camOn={camOn} setCamOn={setCamOn}
          shareOn={shareOn} setShareOn={setShareOn}
          onOpenConsole={() => setConsoleOpen(true)}
          onSnapshot={() => { createSnapshot(batch.id, `Session ${formatTimer(sessionTimer)}`, "Live snapshot"); toast({ title: "Snapshot created" }); }}
          onEnd={() => setEndOpen(true)}
          fullscreen
          setFullscreen={setSplitFullscreen}
        />
      )}

      {/* Student Drawer */}
      <Sheet open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudentId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[760px] p-0">
          {selectedStudent && <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudentId(null)} />}
        </SheetContent>
      </Sheet>

      {/* Trainer Console Dialog */}
      <Dialog open={consoleOpen} onOpenChange={setConsoleOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="px-5 py-3 border-b border-border">
            <DialogTitle className="text-sm font-semibold">trainer-master-vm — Console</DialogTitle>
            <DialogDescription className="text-xs">Connected · 10.0.4.21 · 4 vCPU · 8 GB</DialogDescription>
          </DialogHeader>
          <div className="aspect-video bg-zinc-950 p-5 font-mono text-[12px] leading-relaxed text-emerald-400 overflow-hidden">
            <div>$ kubectl get pods -n training</div>
            <div className="text-zinc-500">NAME                READY   STATUS    AGE</div>
            <div>vpc-router-7d4f      1/1     Running   2h</div>
            <div>peering-gw-6a9e      1/1     Running   2h</div>
            <div>nat-instance-2f      1/1     Running   2h</div>
            <div className="mt-2">$ terraform apply -auto-approve</div>
            <div className="text-zinc-500">Plan: 4 to add, 0 to change, 0 to destroy.</div>
            <div className="text-emerald-400">Apply complete! Resources: 4 added.</div>
            <div className="mt-2 inline-flex items-center">$ <span className="ml-1 inline-block h-3 w-2 bg-emerald-400 animate-pulse" /></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conversations Drawer */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] p-0 flex flex-col">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-base font-semibold tracking-tight">Conversations</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live chat, questions and announcements.</p>
          </div>
          <Tabs value={chatTab} onValueChange={setChatTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-5 h-9">
              <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs">Questions</TabsTrigger>
              <TabsTrigger value="announce" className="text-xs">Announcements</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-3">
              <ScrollArea className="flex-1 px-5">
                <div className="space-y-3 pb-4">
                  {messages.filter(m => m.kind !== "q").map(m => <ChatBubble key={m.id} {...m} />)}
                </div>
              </ScrollArea>
              <ChatInput value={chatInput} onChange={setChatInput} onSend={sendChat} />
            </TabsContent>
            <TabsContent value="questions" className="flex-1 mt-3">
              <ScrollArea className="h-full px-5 pb-4">
                <div className="space-y-2">
                  {messages.filter(m => m.kind === "q").map(m => (
                    <div key={m.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{m.from}</span>
                        <span className="text-[10px] text-muted-foreground">{m.t}</span>
                      </div>
                      <p className="text-sm mt-1.5">{m.text}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="text-[11px] text-muted-foreground hover:text-foreground">Mark answered</button>
                        <span className="text-muted-foreground">·</span>
                        <button className="text-[11px] text-muted-foreground hover:text-foreground">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="announce" className="flex-1 mt-3 px-5">
              <Textarea placeholder="Pin an announcement for this session…" className="min-h-[120px] resize-none" />
              <Button className="mt-3 w-full">Pin announcement</Button>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Broadcast message</DialogTitle>
            <DialogDescription>
              Sends a notification to all {participants.length} students in this batch.
            </DialogDescription>
          </DialogHeader>
          <Textarea value={broadcastText} onChange={e => setBroadcastText(e.target.value)} placeholder="Write a short message…" className="min-h-[120px] resize-none" />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBroadcastOpen(false)}>Cancel</Button>
            <Button onClick={sendBroadcast}><Send className="h-3.5 w-3.5 mr-1.5" />Broadcast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End session */}
      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>End this session?</DialogTitle>
            <DialogDescription>Students will lose access to live controls. VMs remain running.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEndOpen(false)}>Keep running</Button>
            <Button variant="destructive" onClick={() => { setSessionActive(false); setEndOpen(false); toast({ title: "Session ended" }); }}>End session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Main views ---------------- */

function StudentsView({
  filtered, grid, search, setSearch, onSelect, onAssist, onRestart,
}: {
  filtered: StudentRow[]; grid: StudentRow[]; search: string; setSearch: (v: string) => void;
  onSelect: (id: string) => void; onAssist: (s: StudentRow) => void; onRestart: (s: StudentRow) => void;
}) {
  return (
    <>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Classroom</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            {grid.length} students <span className="text-muted-foreground font-normal">· live now</span>
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search students"
            className="h-9 w-[260px] pl-9"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_auto] items-center gap-4 px-5 py-3 border-b border-border bg-muted/30 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span>Student</span>
          <span>Status</span>
          <span>VM</span>
          <span>Network</span>
          <span>Resources</span>
          <span className="text-right">Actions</span>
        </div>
        {filtered.map((s, idx) => (
          <StudentListRow
            key={s.id} student={s} index={idx}
            onClick={() => onSelect(s.id)}
            onAssist={() => onAssist(s)}
            onRestart={() => onRestart(s)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground">No students match "{search}"</div>
        )}
      </div>
    </>
  );
}

function StudentListRow({
  student, index, onClick, onAssist, onRestart,
}: {
  student: StudentRow; index: number;
  onClick: () => void; onAssist: () => void; onRestart: () => void;
}) {
  const accent = stateAccent[student.state];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(index * 0.008, 0.2) }}
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr_auto] items-center gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={cn("relative h-8 w-8 rounded-full ring-2 shrink-0", accent.ring)}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-foreground text-[11px] font-medium">{student.initials}</AvatarFallback>
          </Avatar>
          <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card", accent.dot)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{student.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{student.email}</p>
        </div>
        {student.state === "raised" && <Hand className="h-3.5 w-3.5 text-warning animate-pulse shrink-0" />}
      </div>

      <div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1", accent.ring, accent.text, accent.bg)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />{accent.label}
        </span>
      </div>

      <div className="text-[11px] text-muted-foreground font-mono truncate">{student.vmName}</div>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        {student.connection === "offline" ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
        <span className="font-mono">{student.ip}</span>
      </div>

      <div className="flex items-center gap-3">
        <MicroMeter label="CPU" value={student.cpu} />
        <MicroMeter label="RAM" value={student.ram} />
      </div>

      <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
        <RowAction onClick={onClick} label="Open VM"><Monitor className="h-3.5 w-3.5" /></RowAction>
        <RowAction onClick={onAssist} label="Assist"><Sparkles className="h-3.5 w-3.5" /></RowAction>
        <RowAction onClick={onRestart} label="Restart"><RotateCcw className="h-3.5 w-3.5" /></RowAction>
      </div>
    </motion.div>
  );
}

function MicroMeter({ label, value }: { label: string; value: number }) {
  const tone = value > 80 ? "bg-destructive" : value > 60 ? "bg-warning" : "bg-foreground";
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[10px] text-muted-foreground w-7">{label}</span>
      <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-mono tabular-nums text-foreground w-7">{value}%</span>
    </div>
  );
}

function RowAction({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground border border-transparent hover:border-border transition-colors">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px]">{label}</TooltipContent>
    </Tooltip>
  );
}

function ResourcesView({
  lessons, activeLessonIdx, setActiveLessonIdx, courseName,
}: {
  lessons: { id: string; title: string; module: string; duration?: string }[];
  activeLessonIdx: number; setActiveLessonIdx: (i: number) => void; courseName: string;
}) {
  // group by module
  const grouped = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    lessons.forEach(l => {
      if (!map.has(l.module)) map.set(l.module, []);
      map.get(l.module)!.push(l);
    });
    return Array.from(map.entries());
  }, [lessons]);

  const materials = [
    { i: <FileText className="h-4 w-4" />, t: "Lab guide.pdf", s: "1.2 MB" },
    { i: <FileText className="h-4 w-4" />, t: "Slides — VPC peering.pdf", s: "3.4 MB" },
    { i: <Link2 className="h-4 w-4" />, t: "github.com/cloudadda/aws-labs", s: "Repository" },
    { i: <FileText className="h-4 w-4" />, t: "Architecture diagram.png", s: "820 KB" },
  ];

  return (
    <>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Course content</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{courseName}</h2>
        </div>
        <Button variant="outline" size="sm">Push current lesson</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Curriculum + active lesson preview */}
        <div className="space-y-5">
          {lessons[activeLessonIdx] && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-medium">Now teaching</p>
                  <h3 className="text-base font-semibold tracking-tight truncate mt-0.5">{lessons[activeLessonIdx].title}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{lessons[activeLessonIdx].module}{lessons[activeLessonIdx].duration ? ` · ${lessons[activeLessonIdx].duration}` : ""}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 ring-1 ring-primary/20 shrink-0">
                  <Play className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-semibold tracking-wider text-primary">LIVE</span>
                </span>
              </div>
              <div className="px-5 py-5 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This lesson covers the key concepts and hands-on exercises for <span className="text-foreground font-medium">{lessons[activeLessonIdx].title}</span>. Students follow along on their own lab VMs while you walk through the material.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lesson</p>
                    <p className="text-sm font-semibold mt-1">{activeLessonIdx + 1} / {lessons.length}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completed</p>
                    <p className="text-sm font-semibold mt-1 text-success">{activeLessonIdx}</p>
                  </div>
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Remaining</p>
                    <p className="text-sm font-semibold mt-1">{Math.max(0, lessons.length - activeLessonIdx - 1)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => setActiveLessonIdx(Math.max(0, activeLessonIdx - 1))} disabled={activeLessonIdx === 0}>
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Button>
                  <Button size="sm" onClick={() => setActiveLessonIdx(Math.min(lessons.length - 1, activeLessonIdx + 1))} disabled={activeLessonIdx >= lessons.length - 1}>
                    Mark complete & next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {grouped.map(([module, items]) => (
            <div key={module} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-tight">{module}</h3>
                <span className="text-[11px] text-muted-foreground">{items.length} lessons</span>
              </div>
              <ul>
                {items.map((l) => {
                  const idx = lessons.findIndex(x => x.id === l.id);
                  const done = idx < activeLessonIdx;
                  const active = idx === activeLessonIdx;
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setActiveLessonIdx(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-5 py-3 text-left border-b border-border last:border-0 transition-colors",
                          active ? "bg-primary/5" : "hover:bg-muted/40"
                        )}
                      >
                        <span>
                          {done ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                            active ? <Play className="h-4 w-4 text-primary" /> :
                            <Circle className="h-4 w-4 text-muted-foreground" />}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className={cn("block text-sm truncate", active && "font-medium")}>{l.title}</span>
                        </span>
                        {l.duration && <span className="text-[11px] text-muted-foreground">{l.duration}</span>}
                        {active && <span className="text-[10px] font-medium uppercase tracking-wider text-primary">Now</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Materials sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-3">Session materials</h3>
            <div className="space-y-1.5">
              {materials.map((r, i) => (
                <button key={i} className="w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-muted transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-muted-foreground">{r.i}</span>
                    <div className="min-w-0">
                      <p className="text-[13px] truncate">{r.t}</p>
                      <p className="text-[10px] text-muted-foreground">{r.s}</p>
                    </div>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">Share new resource</Button>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold tracking-tight mb-1">Push to class</h3>
            <p className="text-[11px] text-muted-foreground mb-3">Send a link, file, or command directly to every student VM.</p>
            <Button size="sm" className="w-full">Open broadcast composer</Button>
          </div>
        </div>
      </div>
    </>
  );
}

function AnalyticsView({
  grid, lessons, sessionTimer,
}: {
  grid: StudentRow[]; lessons: { id: string; title: string; module: string }[]; sessionTimer: number;
}) {
  const total = grid.length || 1;
  const online = grid.filter(s => s.state !== "offline").length;
  const attendancePct = Math.round((online / total) * 100);
  const avgAttendance = Math.round(grid.reduce((a, s) => a + s.attendance, 0) / total);
  const totalErrors = grid.reduce((a, s) => a + s.errors, 0);
  const handsRaised = grid.filter(s => s.state === "raised").length;
  const avgCpu = Math.round(grid.reduce((a, s) => a + s.cpu, 0) / total);
  const avgRam = Math.round(grid.reduce((a, s) => a + s.ram, 0) / total);

  // per-lesson distribution
  const lessonBuckets = lessons.map((l, i) => ({
    label: l.title,
    module: l.module,
    count: grid.filter(s => s.lessonIdx === i).length,
  }));
  const maxBucket = Math.max(1, ...lessonBuckets.map(b => b.count));

  const struggling = [...grid]
    .filter(s => s.state === "warning" || s.errors > 0)
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 6);

  return (
    <>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Session analytics</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Live snapshot · <span className="font-mono text-muted-foreground font-normal">{formatTimer(sessionTimer)}</span></h2>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi icon={<Users className="h-4 w-4" />} label="Attendance" value={`${attendancePct}%`} sub={`${online}/${total} online`} />
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Avg engagement" value={`${avgAttendance}%`} sub="Across session" />
        <Kpi icon={<AlertCircle className="h-4 w-4" />} label="Errors" value={totalErrors} sub={`${handsRaised} hands raised`} tone={totalErrors > 0 ? "warn" : "default"} />
        <Kpi icon={<Activity className="h-4 w-4" />} label="Avg load" value={`${avgCpu}% / ${avgRam}%`} sub="CPU · RAM" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Lesson progress distribution */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight">Where students are</h3>
            <span className="text-[11px] text-muted-foreground">Lesson distribution</span>
          </div>
          <div className="space-y-2.5">
            {lessonBuckets.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-44 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{b.module}</p>
                  <p className="text-[12px] truncate">{b.label}</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${(b.count / maxBucket) * 100}%` }} />
                </div>
                <span className="w-10 text-right text-[12px] font-mono tabular-nums">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Needs attention */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-tight">Needs attention</h3>
            <span className="text-[11px] text-muted-foreground">Top {struggling.length}</span>
          </div>
          {struggling.length === 0 ? (
            <div className="py-8 text-center text-[12px] text-muted-foreground">All students are on track.</div>
          ) : (
            <ul className="space-y-2">
              {struggling.map(s => (
                <li key={s.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/40">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-muted text-[10px]">{s.initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{lessons[s.lessonIdx]?.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 ring-1 ring-destructive/30 px-2 py-0.5 text-[10px] font-medium text-destructive">
                    {s.errors} {s.errors === 1 ? "err" : "errs"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Per-student progress table */}
      <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold tracking-tight">Per-student progress</h3>
          <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1.5"><Clock className="h-3 w-3" /> Updated live</span>
        </div>
        <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr] items-center gap-4 px-5 py-2.5 bg-muted/30 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span>Student</span><span>Current lesson</span><span>Attendance</span><span>Errors</span><span>State</span>
        </div>
        {grid.map(s => {
          const accent = stateAccent[s.state];
          return (
            <div key={s.id} className="grid grid-cols-[2fr_1.4fr_1fr_1fr_1fr] items-center gap-4 px-5 py-2.5 border-b border-border last:border-0 text-[12px]">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-6 w-6"><AvatarFallback className="bg-muted text-[10px]">{s.initials}</AvatarFallback></Avatar>
                <span className="truncate">{s.name}</span>
              </div>
              <span className="truncate text-muted-foreground">{lessons[s.lessonIdx]?.title}</span>
              <div className="flex items-center gap-2">
                <div className="h-1 w-16 rounded-full bg-muted overflow-hidden"><div className="h-full bg-foreground" style={{ width: `${s.attendance}%` }} /></div>
                <span className="font-mono tabular-nums text-[11px]">{s.attendance}%</span>
              </div>
              <span className={cn("font-mono tabular-nums", s.errors > 0 ? "text-destructive" : "text-muted-foreground")}>{s.errors}</span>
              <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ring-1", accent.ring, accent.text, accent.bg)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />{accent.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------- Sub-components ---------------- */

function ViewTab({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors",
        active ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
      )}
    >
      {icon}{label}
      {typeof badge === "number" && (
        <span className={cn("inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-semibold", active ? "bg-background/20 text-background" : "bg-muted text-muted-foreground")}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Pill({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent?: "amber" | "rose" }) {
  const accentText = accent === "amber" ? "text-warning" : accent === "rose" ? "text-destructive" : "text-foreground";
  const accentDot = accent === "amber" ? "bg-warning" : accent === "rose" ? "bg-destructive" : "bg-muted-foreground";
  return (
    <div className="h-8 inline-flex items-center gap-2 rounded-full border border-border px-3">
      <span className={cn("h-1.5 w-1.5 rounded-full", accentDot)} />
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("text-xs font-semibold tabular-nums", accentText)}>{value}</span>
    </div>
  );
}

function RailIcon({ icon, active, onClick }: { icon: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "h-9 w-9 rounded-lg inline-flex items-center justify-center transition-colors",
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}>{icon}</button>
  );
}

function PresenceBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} className={cn(
      "h-9 inline-flex flex-col items-center justify-center rounded-lg border text-[10px] font-medium transition-colors",
      active ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted"
    )}>
      {icon}
      <span className="mt-0.5">{label}</span>
    </button>
  );
}

function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2">{title}</h4>
      {children}
    </div>
  );
}

function RailAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="h-9 px-2.5 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border text-[12px] font-medium hover:bg-muted transition-colors">
      {icon}{label}
    </button>
  );
}

function PulseRow({ label, value, tone }: { label: string; value: number | string; tone: "default" | "warn" | "bad" }) {
  const dot = tone === "warn" ? "bg-warning" : tone === "bad" ? "bg-destructive" : "bg-success";
  return (
    <div className="flex items-center justify-between text-[12px]">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

function Kpi({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string | number; sub: string; tone?: "default" | "warn" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className={cn("text-muted-foreground", tone === "warn" && "text-warning")}>{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function StudentDrawer({ student, onClose }: { student: StudentRow; onClose: () => void }) {
  const accent = stateAccent[student.state];
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-5 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("relative h-11 w-11 rounded-full ring-2", accent.ring)}>
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-muted text-sm">{student.initials}</AvatarFallback>
              </Avatar>
              <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background", accent.dot)} />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">{student.name}</h3>
              <p className="text-xs text-muted-foreground">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ring-1", accent.ring, accent.text, accent.bg)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />{accent.label}
          </span>
          <span className="text-[11px] text-muted-foreground font-mono">{student.ip}</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-5 space-y-6">
          <VMTabsPanel
            vms={[
              { id: "vm1", name: student.vmName, role: "Primary", ip: student.ip, running: student.state !== "offline", specs: "4 vCPU · 8 GB" },
              { id: "vm2", name: `${student.vmName.replace(/-vm$/, "")}-db`, role: "Database", ip: "10.0.5.42", running: student.state !== "offline", specs: "2 vCPU · 4 GB" },
              { id: "vm3", name: `${student.vmName.replace(/-vm$/, "")}-edge`, role: "Edge node", ip: "10.0.6.18", running: false, specs: "2 vCPU · 4 GB" },
            ]}
          />
          <Section title="Resources">
            <div className="space-y-3">
              <Meter label="CPU" value={student.cpu} />
              <Meter label="Memory" value={student.ram} />
            </div>
          </Section>
          <Section title="Controls">
            <div className="grid grid-cols-2 gap-2">
              <DrawerBtn icon={<Sparkles className="h-3.5 w-3.5" />} label="Assist student" onClick={() => toast({ title: "Joining session" })} />
              <DrawerBtn icon={<Camera className="h-3.5 w-3.5" />} label="Snapshot" onClick={() => toast({ title: "Snapshot saved" })} />
              <DrawerBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Restart VM" onClick={() => toast({ title: "VM restarting" })} />
              <DrawerBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Restore snapshot" onClick={() => toast({ title: "Restoring…" })} />
            </div>
          </Section>
          <Section title="Recent activity">
            <ul className="space-y-2.5 text-xs">
              {[
                { t: "Now", e: "Connected to lab terminal" },
                { t: "2m", e: "Submitted exercise: VPC peering" },
                { t: "8m", e: "Joined session" },
              ].map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground" />
                  <div className="flex-1">
                    <p>{a.e}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{a.t} ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Trainer notes">
            <Textarea placeholder="Private notes for this student…" className="min-h-[80px] resize-none text-sm" />
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
        <span>{label}</span><span className="font-mono tabular-nums text-foreground">{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function DrawerBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="h-9 px-3 inline-flex items-center justify-center gap-2 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
      {icon}{label}
    </button>
  );
}

function ChatBubble({ from, text, t, kind }: { from: string; text: string; t: string; kind: "msg" | "q" | "sys" }) {
  if (kind === "sys") return <p className="text-center text-[11px] text-muted-foreground">{text}</p>;
  const me = from === "You";
  return (
    <div className={cn("flex flex-col gap-1", me ? "items-end" : "items-start")}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">{from}</span>
        <span className="text-[10px] text-muted-foreground">{t}</span>
      </div>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
        me ? "bg-foreground text-background" : "bg-muted"
      )}>{text}</div>
    </div>
  );
}

function ChatInput({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 focus-within:border-foreground/40 transition">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
          placeholder="Message your students…"
          className="flex-1 bg-transparent border-0 text-sm focus:outline-none py-2"
        />
        <button onClick={onSend} disabled={!value.trim()} className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-foreground text-background disabled:opacity-30 hover:opacity-90 transition">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Trainer View ---------------- */

type TrainerViewProps = {
  vmRunning: boolean;
  setVmRunning: (v: boolean) => void;
  micOn: boolean; setMicOn: (v: boolean | ((p: boolean) => boolean)) => void;
  camOn: boolean; setCamOn: (v: boolean | ((p: boolean) => boolean)) => void;
  shareOn: boolean; setShareOn: (v: boolean | ((p: boolean) => boolean)) => void;
  messages: { id: string; from: string; text: string; t: string; kind: "msg" | "q" | "sys" }[];
  chatInput: string; setChatInput: (v: string) => void;
  onSendChat: () => void;
  onOpenConsole: () => void;
};

function TrainerView({
  vmRunning, setVmRunning,
  micOn, setMicOn, camOn, setCamOn, shareOn, setShareOn,
  messages, chatInput, setChatInput, onSendChat, onOpenConsole,
}: TrainerViewProps) {
  const [chatOpen, setChatOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const trainerVMs = [
    { id: "vm1", name: "trainer-master-vm", role: "Primary", ip: "10.0.4.21", specs: "4 vCPU · 8 GB" },
    { id: "vm2", name: "trainer-db-vm", role: "Database", ip: "10.0.4.22", specs: "2 vCPU · 4 GB" },
    { id: "vm3", name: "trainer-edge-vm", role: "Edge node", ip: "10.0.4.23", specs: "2 vCPU · 4 GB" },
  ];
  const [activeVm, setActiveVm] = useState(trainerVMs[0].id);
  const current = trainerVMs.find(v => v.id === activeVm)!;
  return (
    <div className="-mx-6 lg:-mx-8 -mt-8 -mb-24">
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-64px)]">
        <ResizablePanel defaultSize={chatOpen ? 75 : 100} minSize={40}>
          <div className="h-full flex flex-col">

        {/* CENTER CONSOLE */}
        <section className="flex-1 min-w-0 bg-muted/30 flex flex-col">
          <div className="px-6 py-3 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{current.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{current.role} · {current.ip} · {current.specs}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onOpenConsole} className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                <Maximize2 className="h-3.5 w-3.5" /> Pop out
              </button>
              <button onClick={() => setChatOpen(o => !o)} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors" aria-label="Toggle chat">
                {chatOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* VM Tabs */}
          <div className="px-4 border-b border-border bg-card flex items-center gap-1 overflow-x-auto">
            {trainerVMs.map(vm => (
              <button
                key={vm.id}
                onClick={() => setActiveVm(vm.id)}
                className={cn(
                  "h-9 px-3 inline-flex items-center gap-2 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                  activeVm === vm.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>{vm.name}</span>
                <span className="text-[10px] text-muted-foreground">· {vm.role}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            <div className="h-full w-full rounded-2xl border border-border bg-zinc-950 overflow-hidden relative shadow-sm">
              {vmRunning ? (
                <>
                  <div className="absolute inset-0 p-6 font-mono text-[13px] leading-relaxed text-emerald-400 overflow-auto">
                    <div>$ kubectl get pods -n training</div>
                    <div className="text-zinc-500">NAME                READY   STATUS    AGE</div>
                    <div>vpc-router-7d4f      1/1     Running   2h</div>
                    <div>peering-gw-6a9e      1/1     Running   2h</div>
                    <div>nat-instance-2f      1/1     Running   2h</div>
                    <div className="mt-3">$ terraform apply -auto-approve</div>
                    <div className="text-zinc-500">Plan: 4 to add, 0 to change, 0 to destroy.</div>
                    <div className="text-emerald-400">Apply complete! Resources: 4 added.</div>
                    <div className="mt-3">$ aws ec2 describe-vpc-peering-connections</div>
                    <div className="text-zinc-500">{`{ "VpcPeeringConnections": [ ... ] }`}</div>
                    <div className="mt-3 inline-flex items-center">$ <span className="ml-1 inline-block h-3.5 w-2 bg-emerald-400 animate-pulse" /></div>
                  </div>
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] font-medium text-white tracking-wide">RUNNING</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-zinc-500">
                  <Power className="h-10 w-10" />
                  <span className="text-sm">VM is stopped</span>
                  <button onClick={() => setVmRunning(true)} className="mt-2 h-9 px-4 inline-flex items-center gap-2 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition">
                    <Play className="h-3.5 w-3.5" /> Start VM
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
          </div>
        </ResizablePanel>

        {chatOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
              <aside className="h-full border-l border-border bg-card flex flex-col">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Live chat</p>
                    <p className="text-[11px] text-muted-foreground">Class conversation</p>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted" aria-label="Collapse chat">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="px-5 py-4 space-y-3">
                    {messages.map(m => <ChatBubble key={m.id} {...m} />)}
                  </div>
                </ScrollArea>
                <ChatInput value={chatInput} onChange={setChatInput} onSend={onSendChat} />
              </aside>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}

function TVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-b border-border">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">{title}</p>
      {children}
    </div>
  );
}

function RailRow({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full h-8 px-2 inline-flex items-center gap-2 rounded-md text-xs font-medium hover:bg-muted transition-colors text-left">
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ---------------- VM Tabs Panel (Student Drawer) ---------------- */

type StudentVM = { id: string; name: string; role: string; ip: string; running: boolean; specs: string };

function VMTabsPanel({ vms }: { vms: StudentVM[] }) {
  const [active, setActive] = useState(vms[0]?.id);
  const current = vms.find(v => v.id === active) || vms[0];
  if (!current) return null;
  return (
    <div>
      <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-3">Virtual machines</h4>
      <div className="flex items-center gap-1 border-b border-border mb-3 overflow-x-auto">
        {vms.map(vm => (
          <button
            key={vm.id}
            onClick={() => setActive(vm.id)}
            className={cn(
              "h-8 px-3 inline-flex items-center gap-1.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              active === vm.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", vm.running ? "bg-success" : "bg-muted-foreground")} />
            <span>{vm.role}</span>
          </button>
        ))}
      </div>
      <div className="aspect-video rounded-xl bg-zinc-950 border border-border overflow-hidden relative">
        {current.running ? (
          <>
            <div className="absolute inset-0 p-4 font-mono text-[10px] leading-tight text-emerald-400/80 overflow-hidden">
              <div>$ ssh student@{current.ip}</div>
              <div className="text-zinc-500">Last login: today 10:24:11</div>
              <div>$ systemctl status nginx</div>
              <div className="text-emerald-400">● active (running)</div>
              <div className="mt-1 inline-flex items-center">$ <span className="ml-1 inline-block h-2 w-1.5 bg-emerald-400 animate-pulse" /></div>
            </div>
            <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] font-medium text-white tracking-wide">RUNNING</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-zinc-500">
            <Power className="h-6 w-6" />
            <span className="text-[11px]">VM stopped</span>
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="font-mono">{current.name} · {current.ip}</span>
        <span>{current.specs}</span>
      </div>
    </div>
  );
}

/* ---------------- Split View ---------------- */

type Msg = { id: string; from: string; text: string; t: string; kind: "msg" | "q" | "sys" };

function SplitView(props: {
  batchName: string;
  sessionTimer: number;
  sessionActive: boolean;
  mainTab: MainTab;
  setMainTab: (t: MainTab) => void;
  gridLength: number;
  splitSide: SplitSide;
  setSplitSide: (s: SplitSide) => void;
  students: StudentRow[];
  search: string;
  setSearch: (v: string) => void;
  onSelectStudent: (id: string) => void;
  messages: Msg[];
  chatInput: string;
  setChatInput: (v: string) => void;
  onSendChat: () => void;
  lessons: { id: string; title: string; module: string; duration?: string }[];
  activeLessonIdx: number;
  setActiveLessonIdx: (i: number) => void;
  courseName: string;
  trainerVmRunning: boolean;
  setTrainerVmRunning: (v: boolean) => void;
  micOn: boolean; setMicOn: (v: boolean) => void;
  camOn: boolean; setCamOn: (v: boolean) => void;
  shareOn: boolean; setShareOn: (v: boolean) => void;
  onOpenConsole: () => void;
  onSnapshot: () => void;
  onEnd: () => void;
  fullscreen?: boolean;
  setFullscreen?: (v: boolean) => void;
}) {
  const {
    batchName, sessionTimer, sessionActive, setMainTab, gridLength,
    splitSide, setSplitSide, students, search, setSearch, onSelectStudent,
    messages, chatInput, setChatInput, onSendChat,
    lessons, activeLessonIdx, setActiveLessonIdx, courseName,
    trainerVmRunning, setTrainerVmRunning, micOn, setMicOn, camOn, setCamOn,
    shareOn, setShareOn, onOpenConsole, onSnapshot, onEnd,
    fullscreen = false, setFullscreen,
  } = props;

  const sideOpen = splitSide !== null;

  return (
    <div className={cn(
      fullscreen
        ? "fixed inset-0 z-50 bg-background flex flex-col"
        : "-mx-6 lg:-mx-8 -mt-8 -mb-24 h-[calc(100vh-64px)] flex flex-col bg-background"
    )}>
      {/* Slim top bar */}
      <header className="h-[44px] shrink-0 border-b border-border bg-card flex items-center justify-between px-3 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {sessionActive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 ring-1 ring-destructive/30 shrink-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              <span className="text-[10px] font-semibold tracking-[0.12em] text-destructive">LIVE</span>
            </span>
          )}
          <span className="text-[13px] font-semibold truncate">{batchName}</span>
          <span className="text-[11px] text-muted-foreground font-mono tabular-nums hidden sm:inline">{formatTimer(sessionTimer)}</span>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          <ViewTab active onClick={() => {}} icon={<LayoutPanelLeft className="h-3.5 w-3.5" />} label="Split" />
          <ViewTab active={false} onClick={() => setMainTab("students")} icon={<Users className="h-3.5 w-3.5" />} label="Students" badge={gridLength} />
          <ViewTab active={false} onClick={() => setMainTab("trainer")} icon={<Monitor className="h-3.5 w-3.5" />} label="Trainer" />
          <ViewTab active={false} onClick={() => setMainTab("resources")} icon={<BookOpen className="h-3.5 w-3.5" />} label="Resources" />
          <ViewTab active={false} onClick={() => setMainTab("analytics")} icon={<BarChart3 className="h-3.5 w-3.5" />} label="Analytics" />
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setMicOn(!micOn)} className={cn("h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted", micOn && "text-primary")} title="Mic"><Mic className="h-3.5 w-3.5" /></button>
          <button onClick={() => setCamOn(!camOn)} className={cn("h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted", camOn && "text-primary")} title="Cam"><Video className="h-3.5 w-3.5" /></button>
          <button onClick={() => setShareOn(!shareOn)} className={cn("h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted", shareOn && "text-primary")} title="Share"><ScreenShare className="h-3.5 w-3.5" /></button>
          <div className="w-px h-5 bg-border mx-1" />
          <button onClick={onSnapshot} className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-muted" title="Snapshot"><Camera className="h-3.5 w-3.5" /></button>
          {fullscreen ? (
            <button onClick={() => setFullscreen?.(false)} className="h-7 px-2 inline-flex items-center gap-1.5 rounded-md hover:bg-muted text-[11px]" title="Exit fullscreen"><Minimize2 className="h-3.5 w-3.5" /> Exit</button>
          ) : (
            <button onClick={() => setFullscreen?.(true)} className="h-7 px-2 inline-flex items-center gap-1.5 rounded-md hover:bg-muted text-[11px]" title="Fullscreen"><Maximize2 className="h-3.5 w-3.5" /> Fullscreen</button>
          )}
          <button onClick={onEnd} className="h-7 px-2 inline-flex items-center gap-1.5 rounded-md text-destructive hover:bg-destructive/10 text-[11px]"><Power className="h-3.5 w-3.5" /> End</button>
        </div>
      </header>

      {/* Body: console | LMS | side panel */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        <ResizablePanel defaultSize={40} minSize={20}>
        {/* CONSOLE */}
        <section className="h-full min-w-0 flex flex-col border-r border-border bg-zinc-950">
          <div className="h-9 shrink-0 px-3 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60">
            <div className="flex items-center gap-2 min-w-0">
              <Monitor className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-[12px] font-medium text-zinc-200 truncate">trainer-master-vm</span>
              <span className="text-[10px] text-zinc-500 font-mono">10.0.4.21</span>
              {trainerVmRunning && (
                <span className="inline-flex items-center gap-1 ml-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[9px] text-zinc-400 tracking-wider">RUNNING</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {trainerVmRunning ? (
                <button onClick={() => setTrainerVmRunning(false)} className="h-6 px-2 inline-flex items-center gap-1 rounded text-[10px] text-zinc-300 hover:bg-zinc-800"><Square className="h-3 w-3" /> Stop</button>
              ) : (
                <button onClick={() => setTrainerVmRunning(true)} className="h-6 px-2 inline-flex items-center gap-1 rounded text-[10px] text-zinc-300 hover:bg-zinc-800"><Play className="h-3 w-3" /> Start</button>
              )}
              <button className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-300 hover:bg-zinc-800" title="Restart"><RotateCcw className="h-3 w-3" /></button>
              <button onClick={onOpenConsole} className="h-6 w-6 inline-flex items-center justify-center rounded text-zinc-300 hover:bg-zinc-800" title="Expand"><Maximize2 className="h-3 w-3" /></button>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-[12px] leading-relaxed text-emerald-400 overflow-auto">
            {trainerVmRunning ? (
              <>
                <div>$ kubectl get pods -n training</div>
                <div className="text-zinc-500">NAME                READY   STATUS    AGE</div>
                <div>vpc-router-7d4f      1/1     Running   2h</div>
                <div>peering-gw-6a9e      1/1     Running   2h</div>
                <div>nat-instance-2f      1/1     Running   2h</div>
                <div className="mt-2">$ terraform apply -auto-approve</div>
                <div className="text-zinc-500">Plan: 4 to add, 0 to change, 0 to destroy.</div>
                <div className="text-emerald-400">Apply complete! Resources: 4 added.</div>
                <div className="mt-2 inline-flex items-center">$ <span className="ml-1 inline-block h-3 w-2 bg-emerald-400 animate-pulse" /></div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500 gap-2">
                <Power className="h-8 w-8" />
                <span className="text-xs">VM stopped</span>
                <button onClick={() => setTrainerVmRunning(true)} className="mt-2 h-7 px-3 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] hover:bg-emerald-500/30">Start VM</button>
              </div>
            )}
          </div>
        </section>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
        {/* LMS */}
        <section className="h-full min-w-0 flex flex-col bg-card">
          <div className="h-9 shrink-0 px-3 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[12px] font-medium truncate">{courseName}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{lessons.length} lessons</span>
          </div>
          <div className="px-4 py-3 border-b border-border bg-muted/20">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Now playing</p>
            <p className="text-sm font-medium mt-0.5 truncate">{lessons[activeLessonIdx]?.title}</p>
            <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "40%" }} />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <ul className="p-2">
              {lessons.map((l, idx) => {
                const done = idx < activeLessonIdx;
                const active = idx === activeLessonIdx;
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => setActiveLessonIdx(idx)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-lg transition-colors",
                        active ? "bg-primary/10" : "hover:bg-muted/60"
                      )}
                    >
                      {done ? <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" /> :
                        active ? <Play className="h-3.5 w-3.5 text-primary shrink-0" /> :
                        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                      <span className="flex-1 min-w-0">
                        <span className={cn("block text-[12px] truncate", active && "font-medium")}>{l.title}</span>
                        <span className="block text-[10px] text-muted-foreground truncate">{l.module}</span>
                      </span>
                      {l.duration && <span className="text-[10px] text-muted-foreground">{l.duration}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        </section>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={5} maxSize={45}>
        {/* SIDE PANEL: students / chat */}
        <aside className={cn("h-full border-l border-border bg-card flex flex-col transition-all duration-200")}>
          {/* tab switcher */}
          <div className="h-9 shrink-0 border-b border-border flex items-center">
            <SidePanelTab
              active={splitSide === "students"}
              icon={<Users className="h-3.5 w-3.5" />}
              label="Students"
              badge={gridLength}
              collapsed={!sideOpen}
              onClick={() => setSplitSide(splitSide === "students" ? null : "students")}
            />
            <SidePanelTab
              active={splitSide === "chat"}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              label="Live chat"
              badge={messages.filter(m => m.kind === "q").length || undefined}
              collapsed={!sideOpen}
              onClick={() => setSplitSide(splitSide === "chat" ? null : "chat")}
            />
            {sideOpen && (
              <button onClick={() => setSplitSide(null)} className="ml-auto mr-1 h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:bg-muted" title="Collapse">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {sideOpen && splitSide === "students" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-2.5 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students" className="h-8 pl-7 text-[12px]" />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <ul className="p-1.5">
                  {students.map(s => {
                    const accent = stateAccent[s.state];
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => onSelectStudent(s.id)}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left hover:bg-muted/60 transition-colors"
                        >
                          <div className={cn("relative h-7 w-7 rounded-full ring-2 shrink-0", accent.ring)}>
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-muted text-[10px] font-medium">{s.initials}</AvatarFallback>
                            </Avatar>
                            <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card", accent.dot)} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium truncate">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate">{s.vmName}</p>
                          </div>
                          {s.state === "raised" && <Hand className="h-3 w-3 text-warning animate-pulse shrink-0" />}
                          <Monitor className="h-3 w-3 text-muted-foreground shrink-0" />
                        </button>
                      </li>
                    );
                  })}
                  {students.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-muted-foreground">No students match.</div>
                  )}
                </ul>
              </ScrollArea>
            </div>
          )}

          {sideOpen && splitSide === "chat" && (
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 px-3">
                <div className="space-y-2.5 py-3">
                  {messages.map(m => <ChatBubble key={m.id} {...m} />)}
                </div>
              </ScrollArea>
              <ChatInput value={chatInput} onChange={setChatInput} onSend={onSendChat} />
            </div>
          )}
        </aside>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function SidePanelTab({ active, icon, label, badge, collapsed, onClick }: {
  active: boolean; icon: React.ReactNode; label: string; badge?: number; collapsed: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-full px-3 inline-flex items-center gap-1.5 text-[11px] font-medium border-b-2 transition-colors",
        active ? "border-primary text-foreground bg-muted/40" : "border-transparent text-muted-foreground hover:text-foreground"
      )}
      title={label}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
      {!collapsed && badge !== undefined && (
        <span className="ml-0.5 inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-muted text-[9px] font-semibold">{badge}</span>
      )}
    </button>
  );
}
