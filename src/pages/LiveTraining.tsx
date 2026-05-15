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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Radio, Hand, Users, AlertCircle, Megaphone, BookOpen, Camera, Power,
  MessageSquare, Send, X, Search, Wifi, WifiOff, RotateCcw, Monitor,
  FileText, Link2, Download, Sparkles, ChevronLeft, ChevronRight, Play,
  CheckCircle2, Circle, Mic, Video, ScreenShare,
} from "lucide-react";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore } from "@/stores/courseStore";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StudentState = "healthy" | "raised" | "warning" | "offline";

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
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [broadcastText, setBroadcastText] = useState("");
  const [chatTab, setChatTab] = useState("chat");
  const [chatInput, setChatInput] = useState("");
  const [trainerOpen, setTrainerOpen] = useState(true);
  const [trainerTab, setTrainerTab] = useState<"trainer" | "course" | "materials">("trainer");
  const [activeLessonIdx, setActiveLessonIdx] = useState(2);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [shareOn, setShareOn] = useState(false);

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

  const grid: StudentRow[] = useMemo(() => {
    return participants.map((p, i) => {
      const vm = participantVMs.find(v => v.assignedTo === p.name);
      const baseStatus = vm?.status || p.vmStatus || "running";
      let state: StudentState = "healthy";
      if (baseStatus === "stopped" || baseStatus === "error" || baseStatus === "not_assigned") state = "offline";
      else if (i % 7 === 1) state = "raised";
      else if (i % 11 === 3) state = "warning";
      return {
        id: p.id, name: p.name, email: p.email,
        initials: p.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(),
        ip: vm?.ipAddress || "—",
        state,
        connection: state === "offline" ? "offline" : (i % 13 === 5 ? "weak" : "strong"),
        vmName: vm?.vmName || `${p.name.split(" ")[0].toLowerCase()}-vm`,
        cpu: 18 + ((i * 13) % 60),
        ram: 24 + ((i * 17) % 55),
      };
    });
  }, [participants, participantVMs]);

  const filtered = grid.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const onlineCount = grid.filter(s => s.state !== "offline").length;
  const handsRaised = grid.filter(s => s.state === "raised").length;
  const issues = grid.filter(s => s.state === "warning").length;
  const selectedStudent = grid.find(s => s.id === selectedStudentId);

  // Course content for left rail (LMS integration)
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

          <div className="flex items-center gap-1 rounded-xl border border-border p-1">
            <ToolbarBtn icon={<Megaphone className="h-3.5 w-3.5" />} label="Broadcast" onClick={() => setBroadcastOpen(true)} />
            <ToolbarBtn icon={<BookOpen className="h-3.5 w-3.5" />} label="Resources" onClick={() => setResourcesOpen(true)} />
            <ToolbarBtn
              icon={<Camera className="h-3.5 w-3.5" />}
              label="Snapshot all"
              onClick={() => {
                createSnapshot(batch.id, `Session ${formatTimer(sessionTimer)}`, "Live snapshot");
                toast({ title: "Snapshot created", description: "All student VMs captured." });
              }}
            />
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setEndOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Power className="h-3.5 w-3.5" /> End session
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Pill icon={<Users className="h-3 w-3" />} label="Online" value={`${onlineCount}/${grid.length}`} />
            <Pill icon={<Hand className="h-3 w-3" />} label="Raised" value={handsRaised} accent={handsRaised > 0 ? "amber" : undefined} />
            <Pill icon={<AlertCircle className="h-3 w-3" />} label="Issues" value={issues} accent={issues > 0 ? "rose" : undefined} />
          </div>
        </div>
      </header>

      {/* Body: Sticky Trainer Rail + Student Grid */}
      <div className="flex">
        {/* LEFT TRAINER RAIL */}
        <aside
          className={cn(
            "sticky top-[64px] self-start shrink-0 border-r border-border bg-card transition-all duration-200",
            trainerOpen ? "w-[340px]" : "w-[56px]",
          )}
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* Collapse toggle */}
          <button
            onClick={() => setTrainerOpen(o => !o)}
            className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border border-border bg-background shadow-sm flex items-center justify-center hover:bg-muted"
            aria-label={trainerOpen ? "Collapse trainer panel" : "Expand trainer panel"}
          >
            {trainerOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>

          {!trainerOpen ? (
            <div className="flex flex-col items-center gap-3 pt-6">
              <RailIcon icon={<Radio className="h-4 w-4" />} active onClick={() => { setTrainerOpen(true); setTrainerTab("trainer"); }} />
              <RailIcon icon={<BookOpen className="h-4 w-4" />} onClick={() => { setTrainerOpen(true); setTrainerTab("course"); }} />
              <RailIcon icon={<FileText className="h-4 w-4" />} onClick={() => { setTrainerOpen(true); setTrainerTab("materials"); }} />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Trainer header card */}
              <div className="px-5 pt-5 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">YT</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">You · Trainer</p>
                    <p className="text-[11px] text-muted-foreground truncate">{batch.name}</p>
                  </div>
                </div>

                {/* Live presence controls */}
                <div className="mt-4 grid grid-cols-3 gap-1.5">
                  <PresenceBtn active={micOn} onClick={() => setMicOn(v => !v)} icon={<Mic className="h-3.5 w-3.5" />} label="Mic" />
                  <PresenceBtn active={camOn} onClick={() => setCamOn(v => !v)} icon={<Video className="h-3.5 w-3.5" />} label="Cam" />
                  <PresenceBtn active={shareOn} onClick={() => setShareOn(v => !v)} icon={<ScreenShare className="h-3.5 w-3.5" />} label="Share" />
                </div>
              </div>

              {/* Tabs */}
              <div className="px-3 pt-3">
                <div className="grid grid-cols-3 rounded-lg bg-muted p-1 text-[11px] font-medium">
                  {([
                    { k: "trainer", l: "Now" },
                    { k: "course",  l: "Course" },
                    { k: "materials", l: "Files" },
                  ] as const).map(t => (
                    <button
                      key={t.k}
                      onClick={() => setTrainerTab(t.k)}
                      className={cn(
                        "h-7 rounded-md transition-colors",
                        trainerTab === t.k ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >{t.l}</button>
                  ))}
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="px-5 py-4 space-y-5">
                  {trainerTab === "trainer" && (
                    <>
                      <RailSection title="Now playing">
                        <div className="rounded-xl border border-border p-3">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{lessons[activeLessonIdx]?.module}</p>
                          <p className="text-sm font-medium mt-0.5">{lessons[activeLessonIdx]?.title}</p>
                          <div className="mt-2.5 h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "40%" }} />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-muted-foreground">In progress · 24 min</span>
                            <button className="text-[11px] font-medium text-primary hover:underline">Mark complete</button>
                          </div>
                        </div>
                      </RailSection>
                      <RailSection title="Quick actions">
                        <div className="grid grid-cols-2 gap-1.5">
                          <RailAction icon={<Megaphone className="h-3.5 w-3.5" />} label="Broadcast" onClick={() => setBroadcastOpen(true)} />
                          <RailAction icon={<Camera className="h-3.5 w-3.5" />} label="Snapshot" onClick={() => createSnapshot(batch.id, `Session ${formatTimer(sessionTimer)}`, "Live")} />
                          <RailAction icon={<MessageSquare className="h-3.5 w-3.5" />} label="Open chat" onClick={() => setChatOpen(true)} />
                          <RailAction icon={<Sparkles className="h-3.5 w-3.5" />} label="Help raised" onClick={() => toast({ title: "Pinged raised hands" })} />
                        </div>
                      </RailSection>
                      <RailSection title="Class pulse">
                        <div className="space-y-2">
                          <PulseRow label="Online" value={`${onlineCount}/${grid.length}`} tone="default" />
                          <PulseRow label="Hands raised" value={handsRaised} tone={handsRaised ? "warn" : "default"} />
                          <PulseRow label="Issues" value={issues} tone={issues ? "bad" : "default"} />
                        </div>
                      </RailSection>
                    </>
                  )}

                  {trainerTab === "course" && (
                    <RailSection title={linkedCourse?.title || "Course content"}>
                      <ul className="space-y-1">
                        {lessons.map((l, idx) => {
                          const done = idx < activeLessonIdx;
                          const active = idx === activeLessonIdx;
                          return (
                            <li key={l.id}>
                              <button
                                onClick={() => setActiveLessonIdx(idx)}
                                className={cn(
                                  "w-full text-left flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                                  active ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-muted"
                                )}
                              >
                                <span className="mt-0.5">
                                  {done ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                                    active ? <Play className="h-4 w-4 text-primary" /> :
                                    <Circle className="h-4 w-4 text-muted-foreground" />}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{l.module}</span>
                                  <span className={cn("block text-[13px] truncate", active ? "font-medium text-foreground" : "text-foreground")}>{l.title}</span>
                                </span>
                                {l.duration && <span className="text-[10px] text-muted-foreground mt-1">{l.duration}</span>}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </RailSection>
                  )}

                  {trainerTab === "materials" && (
                    <>
                      <RailSection title="Materials">
                        <div className="space-y-1.5">
                          {[
                            { i: <FileText className="h-3.5 w-3.5" />, t: "Lab guide.pdf", s: "1.2 MB" },
                            { i: <FileText className="h-3.5 w-3.5" />, t: "Slides — VPC peering.pdf", s: "3.4 MB" },
                            { i: <Link2 className="h-3.5 w-3.5" />, t: "github.com/cloudadda/aws-labs", s: "Repository" },
                            { i: <FileText className="h-3.5 w-3.5" />, t: "Architecture diagram.png", s: "820 KB" },
                          ].map((r, i) => (
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
                      </RailSection>
                      <RailSection title="Share with class">
                        <p className="text-[11px] text-muted-foreground">Push a link or file to all student environments.</p>
                        <Button size="sm" variant="outline" className="mt-2 w-full">Share new resource</Button>
                      </RailSection>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </aside>

        {/* MAIN: student grid */}
        <main className="flex-1 px-6 lg:px-8 pt-8 pb-24 max-w-[1400px]">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((s, idx) => (
              <StudentCard
                key={s.id}
                student={s}
                index={idx}
                onClick={() => setSelectedStudentId(s.id)}
                onAssist={() => toast({ title: `Assisting ${s.name}` })}
                onRestart={() => toast({ title: `Restarting ${s.vmName}` })}
                onMessage={() => setSelectedStudentId(s.id)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-sm text-muted-foreground">No students match "{search}"</div>
          )}
        </main>
      </div>

      {/* Floating Conversations */}
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

      {/* Student Drawer */}
      <Sheet open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudentId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[520px] p-0">
          {selectedStudent && <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudentId(null)} />}
        </SheetContent>
      </Sheet>

      {/* Resources Drawer */}
      <Sheet open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[440px] p-0">
          <ResourcesPanel batchName={batch.name} />
        </SheetContent>
      </Sheet>

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

/* ---------------- Sub-components ---------------- */

function ToolbarBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors">
      {icon}{label}
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

function StudentCard({
  student, index, onClick, onAssist, onRestart, onMessage,
}: {
  student: StudentRow; index: number;
  onClick: () => void; onAssist: () => void; onRestart: () => void; onMessage: () => void;
}) {
  const accent = stateAccent[student.state];
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.012, 0.25) }}
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-2xl p-4 bg-card border border-border",
        "hover:border-foreground/20 hover:shadow-sm transition-all duration-150",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("relative h-9 w-9 rounded-full ring-2", accent.ring)}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-muted text-foreground text-xs font-medium">{student.initials}</AvatarFallback>
            </Avatar>
            <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", accent.dot)} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{student.name}</p>
            <p className={cn("text-[11px] mt-0.5", accent.text)}>{accent.label}</p>
          </div>
        </div>
        {student.state === "raised" && <Hand className="h-4 w-4 text-warning animate-pulse" />}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {student.connection === "offline" ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
          <span className="font-mono">{student.ip}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">VM</span>
      </div>

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150">
        <QuickAction onClick={(e) => { e.stopPropagation(); onClick(); }} label="View VM"><Monitor className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onAssist(); }} label="Assist"><Sparkles className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onRestart(); }} label="Restart"><RotateCcw className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onMessage(); }} label="Message"><MessageSquare className="h-3 w-3" /></QuickAction>
      </div>
    </motion.button>
  );
}

function QuickAction({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={onClick} className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-background border border-border text-foreground hover:bg-muted transition-colors">
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-[11px]">{label}</TooltipContent>
    </Tooltip>
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
          <Section title="VM preview">
            <div className="aspect-video rounded-xl bg-muted border border-border flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-7 w-7 mx-auto text-muted-foreground" />
                <p className="text-[11px] text-muted-foreground mt-2">{student.vmName}</p>
              </div>
            </div>
          </Section>
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

function ResourcesPanel({ batchName }: { batchName: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Session resources</p>
        <h3 className="mt-1 text-base font-semibold tracking-tight">{batchName}</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-5 space-y-6">
          <Section title="Current lesson">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium">Module 4 — VPC Peering & Transit Gateway</p>
              <p className="text-[11px] text-muted-foreground mt-1">In progress · 24 min</p>
            </div>
          </Section>
          <Section title="Materials">
            <div className="space-y-2">
              {[
                { i: <FileText className="h-3.5 w-3.5" />, t: "Lab guide.pdf", s: "1.2 MB" },
                { i: <FileText className="h-3.5 w-3.5" />, t: "Slides — VPC peering.pdf", s: "3.4 MB" },
                { i: <Link2 className="h-3.5 w-3.5" />, t: "github.com/cloudadda/aws-labs", s: "Repository" },
                { i: <FileText className="h-3.5 w-3.5" />, t: "Architecture diagram.png", s: "820 KB" },
              ].map((r, i) => (
                <button key={i} className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left border border-border hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground">{r.i}</span>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{r.t}</p>
                      <p className="text-[10px] text-muted-foreground">{r.s}</p>
                    </div>
                  </div>
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              ))}
            </div>
          </Section>
        </div>
      </ScrollArea>
    </div>
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
