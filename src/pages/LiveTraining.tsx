import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Radio, Hand, Users, AlertCircle, Megaphone, BookOpen, Camera, Power,
  MessageSquare, Send, X, Search, Wifi, WifiOff, RotateCcw, Monitor,
  FileText, Link2, Download, ChevronRight, Sparkles, MoreHorizontal,
} from "lucide-react";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type StudentState = "healthy" | "raised" | "warning" | "offline";

const stateAccent: Record<StudentState, { dot: string; ring: string; label: string; text: string }> = {
  healthy:  { dot: "bg-emerald-400",  ring: "ring-emerald-400/20",  label: "Healthy",      text: "text-emerald-300" },
  raised:   { dot: "bg-amber-400",    ring: "ring-amber-400/30",    label: "Hand raised",  text: "text-amber-300" },
  warning:  { dot: "bg-orange-400",   ring: "ring-orange-400/25",   label: "Needs attention", text: "text-orange-300" },
  offline:  { dot: "bg-zinc-500",     ring: "ring-zinc-500/20",     label: "Disconnected", text: "text-zinc-400" },
};

function formatTimer(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export default function LiveTraining() {
  const {
    batches, recloneAllVMs, restartParticipantVM, snapshotParticipantVM,
    createSnapshot,
  } = useBatchStore();

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

  // Derive presentation-only state for each student
  const grid = useMemo(() => {
    return participants.map((p, i) => {
      const vm = participantVMs.find(v => v.assignedTo === p.name);
      const baseStatus = vm?.status || p.vmStatus || "running";
      let state: StudentState = "healthy";
      if (baseStatus === "stopped" || baseStatus === "error" || baseStatus === "not_assigned") state = "offline";
      else if (i % 7 === 1) state = "raised";
      else if (i % 11 === 3) state = "warning";
      return {
        id: p.id,
        name: p.name,
        email: p.email,
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

  // No batch
  if (!batch) {
    return (
      <div className="dark min-h-screen bg-[#07080b] text-zinc-100 -m-6 p-10 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
            <Radio className="h-6 w-6 text-zinc-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">No live session</h1>
            <p className="text-sm text-zinc-400 mt-1.5">Schedule a batch to start running live training.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark -m-6 min-h-screen bg-[#07080b] text-zinc-100 antialiased selection:bg-white/10">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% -10%, rgba(99,102,241,0.10), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(16,185,129,0.06), transparent 60%)",
        }}
      />

      {/* Top Session Bar */}
      <header
        className="sticky top-0 z-30 backdrop-blur-xl"
        style={{ background: "rgba(10,11,14,0.72)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="h-[72px] px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* Left: session identity */}
          <div className="flex items-center gap-4 min-w-0">
            <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="h-9 w-auto border-white/10 bg-white/[0.03] hover:bg-white/[0.06] gap-2 text-zinc-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d0e12] border-white/10 text-zinc-200">
                {liveBatches.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="hidden md:block min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[15px] font-semibold tracking-tight truncate">{batch.name}</h1>
                {sessionActive && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 ring-1 ring-rose-500/30">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-rose-300">LIVE</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                <span>Live training</span>
                <span className="text-zinc-700">•</span>
                <span className="font-mono tabular-nums">{formatTimer(sessionTimer)}</span>
              </p>
            </div>
          </div>

          {/* Center: primary controls */}
          <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-1">
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
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={() => setEndOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <Power className="h-3.5 w-3.5" />
              End session
            </button>
          </div>

          {/* Right: live indicators */}
          <div className="flex items-center gap-2">
            <Pill icon={<Users className="h-3 w-3" />} label="Online" value={`${onlineCount}/${grid.length}`} />
            <Pill icon={<Hand className="h-3 w-3" />} label="Raised" value={handsRaised} accent={handsRaised > 0 ? "amber" : undefined} />
            <Pill icon={<AlertCircle className="h-3 w-3" />} label="Issues" value={issues} accent={issues > 0 ? "rose" : undefined} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative px-6 lg:px-10 pt-10 pb-32 max-w-[1600px] mx-auto">
        {/* Section heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">Classroom</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
              {grid.length} students <span className="text-zinc-600 font-normal">· live now</span>
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search students"
              className="h-9 w-[260px] pl-9 bg-white/[0.03] border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-white/20"
            />
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((s, idx) => (
            <StudentCard
              key={s.id}
              student={s}
              index={idx}
              onClick={() => setSelectedStudentId(s.id)}
              onAssist={() => toast({ title: `Assisting ${s.name}` })}
              onRestart={() => toast({ title: `Restarting ${s.vmName}` })}
              onMessage={() => { setSelectedStudentId(s.id); }}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-sm text-zinc-500">No students match "{search}"</div>
        )}
      </main>

      {/* Floating Chat trigger */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 px-5 inline-flex items-center gap-2.5 rounded-full bg-white text-black text-sm font-medium shadow-2xl shadow-black/40 hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <MessageSquare className="h-4 w-4" />
        Conversations
        {messages.filter(m => m.kind === "q").length > 0 && (
          <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-semibold">
            {messages.filter(m => m.kind === "q").length}
          </span>
        )}
      </button>

      {/* Student Drawer */}
      <Sheet open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudentId(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[520px] bg-[#0a0b0e] border-white/10 text-zinc-100 p-0"
        >
          {selectedStudent && (
            <StudentDrawer student={selectedStudent} onClose={() => setSelectedStudentId(null)} />
          )}
        </SheetContent>
      </Sheet>

      {/* Resources Drawer */}
      <Sheet open={resourcesOpen} onOpenChange={setResourcesOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[440px] bg-[#0a0b0e] border-white/10 text-zinc-100 p-0">
          <ResourcesPanel batchName={batch.name} />
        </SheetContent>
      </Sheet>

      {/* Conversations Drawer */}
      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[420px] bg-[#0a0b0e] border-white/10 text-zinc-100 p-0 flex flex-col">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-base font-semibold tracking-tight">Conversations</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Live chat, questions and announcements.</p>
          </div>
          <Tabs value={chatTab} onValueChange={setChatTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-5 bg-white/[0.04] border border-white/10 h-9">
              <TabsTrigger value="chat" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">Chat</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">Questions</TabsTrigger>
              <TabsTrigger value="announce" className="text-xs data-[state=active]:bg-white/10 data-[state=active]:text-white">Announcements</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 mt-3">
              <ScrollArea className="flex-1 px-5">
                <div className="space-y-3 pb-4">
                  {messages.filter(m => m.kind !== "q").map(m => (
                    <ChatBubble key={m.id} {...m} />
                  ))}
                </div>
              </ScrollArea>
              <ChatInput value={chatInput} onChange={setChatInput} onSend={sendChat} />
            </TabsContent>
            <TabsContent value="questions" className="flex-1 mt-3">
              <ScrollArea className="h-full px-5 pb-4">
                <div className="space-y-2">
                  {messages.filter(m => m.kind === "q").map(m => (
                    <div key={m.id} className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-zinc-300">{m.from}</span>
                        <span className="text-[10px] text-zinc-500">{m.t}</span>
                      </div>
                      <p className="text-sm text-zinc-200 mt-1.5">{m.text}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button className="text-[11px] text-zinc-400 hover:text-white">Mark answered</button>
                        <span className="text-zinc-700">·</span>
                        <button className="text-[11px] text-zinc-400 hover:text-white">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="announce" className="flex-1 mt-3 px-5">
              <Textarea
                placeholder="Pin an announcement for this session…"
                className="min-h-[120px] bg-white/[0.03] border-white/10 text-zinc-200 placeholder:text-zinc-600 resize-none"
              />
              <Button className="mt-3 w-full bg-white text-black hover:bg-zinc-100">Pin announcement</Button>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="bg-[#0a0b0e] border-white/10 text-zinc-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Broadcast message</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Sends a notification to all {participants.length} students in this batch.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={broadcastText}
            onChange={e => setBroadcastText(e.target.value)}
            placeholder="Write a short message…"
            className="min-h-[120px] bg-white/[0.03] border-white/10 text-zinc-200 placeholder:text-zinc-600 resize-none"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBroadcastOpen(false)} className="text-zinc-400 hover:bg-white/5 hover:text-white">Cancel</Button>
            <Button onClick={sendBroadcast} className="bg-white text-black hover:bg-zinc-100">
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End session dialog */}
      <Dialog open={endOpen} onOpenChange={setEndOpen}>
        <DialogContent className="bg-[#0a0b0e] border-white/10 text-zinc-100 max-w-sm">
          <DialogHeader>
            <DialogTitle>End this session?</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Students will lose access to live controls. VMs remain running.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEndOpen(false)} className="text-zinc-400 hover:bg-white/5 hover:text-white">Keep running</Button>
            <Button
              onClick={() => { setSessionActive(false); setEndOpen(false); toast({ title: "Session ended" }); }}
              className="bg-rose-500 text-white hover:bg-rose-600"
            >
              End session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------- Sub-components -------- */

function ToolbarBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 inline-flex items-center gap-2 rounded-lg text-xs font-medium text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function Pill({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent?: "amber" | "rose" }) {
  const accentText = accent === "amber" ? "text-amber-300" : accent === "rose" ? "text-rose-300" : "text-zinc-200";
  const accentDot = accent === "amber" ? "bg-amber-400" : accent === "rose" ? "bg-rose-400" : "bg-zinc-500";
  return (
    <div className="h-8 inline-flex items-center gap-2 rounded-full bg-white/[0.03] ring-1 ring-white/[0.06] px-3">
      <span className={cn("h-1.5 w-1.5 rounded-full", accentDot)} />
      <span className="text-[11px] text-zinc-500">{label}</span>
      <span className={cn("text-xs font-semibold tabular-nums", accentText)}>{value}</span>
    </div>
  );
}

function StudentCard({
  student, index, onClick, onAssist, onRestart, onMessage,
}: {
  student: ReturnType<typeof useDeriveType>;
  index: number;
  onClick: () => void;
  onAssist: () => void;
  onRestart: () => void;
  onMessage: () => void;
}) {
  const accent = stateAccent[student.state];
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.3) }}
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-2xl p-4 bg-white/[0.025] ring-1 ring-white/[0.06]",
        "hover:bg-white/[0.04] hover:ring-white/[0.12] transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
      )}
    >
      {/* status indicator */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("relative h-9 w-9 rounded-full ring-2", accent.ring)}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-zinc-800 text-zinc-200 text-xs font-medium">
                {student.initials}
              </AvatarFallback>
            </Avatar>
            <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#07080b]", accent.dot)} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-100 truncate">{student.name}</p>
            <p className={cn("text-[11px] mt-0.5", accent.text)}>{accent.label}</p>
          </div>
        </div>
        {student.state === "raised" && (
          <Hand className="h-4 w-4 text-amber-300 animate-pulse" />
        )}
      </div>

      {/* meta */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
          {student.connection === "offline" ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
          <span className="font-mono">{student.ip}</span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-zinc-600">VM</span>
      </div>

      {/* hover quick actions */}
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-1.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
        <QuickAction onClick={(e) => { e.stopPropagation(); onClick(); }} label="View VM"><Monitor className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onAssist(); }} label="Assist"><Sparkles className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onRestart(); }} label="Restart"><RotateCcw className="h-3 w-3" /></QuickAction>
        <QuickAction onClick={(e) => { e.stopPropagation(); onMessage(); }} label="Message"><MessageSquare className="h-3 w-3" /></QuickAction>
      </div>
    </motion.button>
  );
}

// trick to derive student type
function useDeriveType() { return null as unknown as {
  id: string; name: string; email: string; initials: string; ip: string;
  state: StudentState; connection: string; vmName: string; cpu: number; ram: number;
}; }

function QuickAction({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: (e: React.MouseEvent) => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-black/40 backdrop-blur ring-1 ring-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-zinc-900 border-white/10 text-zinc-100 text-[11px]">{label}</TooltipContent>
    </Tooltip>
  );
}

function StudentDrawer({ student, onClose }: { student: ReturnType<typeof useDeriveType>; onClose: () => void }) {
  const accent = stateAccent[student.state];
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("relative h-11 w-11 rounded-full ring-2", accent.ring)}>
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-zinc-800 text-zinc-200 text-sm">{student.initials}</AvatarFallback>
              </Avatar>
              <span className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[#0a0b0e]", accent.dot)} />
            </div>
            <div>
              <h3 className="text-base font-semibold tracking-tight">{student.name}</h3>
              <p className="text-xs text-zinc-500">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 inline-flex items-center justify-center rounded-md text-zinc-500 hover:bg-white/5 hover:text-zinc-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ring-1", accent.ring, accent.text)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
            {accent.label}
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">{student.ip}</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-6 py-5 space-y-6">
          {/* VM preview */}
          <Section title="VM preview">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ring-1 ring-white/5 flex items-center justify-center">
              <div className="text-center">
                <Monitor className="h-7 w-7 mx-auto text-zinc-700" />
                <p className="text-[11px] text-zinc-600 mt-2">{student.vmName}</p>
              </div>
            </div>
          </Section>

          {/* Resource usage */}
          <Section title="Resources">
            <div className="space-y-3">
              <Meter label="CPU" value={student.cpu} />
              <Meter label="Memory" value={student.ram} />
            </div>
          </Section>

          {/* VM controls */}
          <Section title="Controls">
            <div className="grid grid-cols-2 gap-2">
              <DrawerBtn icon={<Sparkles className="h-3.5 w-3.5" />} label="Assist student" onClick={() => toast({ title: "Joining session" })} />
              <DrawerBtn icon={<Camera className="h-3.5 w-3.5" />} label="Snapshot" onClick={() => toast({ title: "Snapshot saved" })} />
              <DrawerBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Restart VM" onClick={() => toast({ title: "VM restarting" })} />
              <DrawerBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Restore snapshot" onClick={() => toast({ title: "Restoring…" })} />
            </div>
          </Section>

          {/* Activity */}
          <Section title="Recent activity">
            <ul className="space-y-2.5 text-xs">
              {[
                { t: "Now", e: "Connected to lab terminal" },
                { t: "2m", e: "Submitted exercise: VPC peering" },
                { t: "8m", e: "Joined session" },
              ].map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 h-1 w-1 rounded-full bg-zinc-600" />
                  <div className="flex-1">
                    <p className="text-zinc-300">{a.e}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{a.t} ago</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* Notes */}
          <Section title="Trainer notes">
            <Textarea
              placeholder="Private notes for this student…"
              className="min-h-[80px] bg-white/[0.03] border-white/10 text-zinc-200 placeholder:text-zinc-600 resize-none text-sm"
            />
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500 mb-3">{title}</h4>
      {children}
    </div>
  );
}

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
        <span>{label}</span>
        <span className="font-mono tabular-nums text-zinc-300">{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-zinc-200 transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DrawerBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 inline-flex items-center justify-center gap-2 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06] text-xs font-medium text-zinc-200 hover:bg-white/[0.08] hover:ring-white/15 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function ResourcesPanel({ batchName }: { batchName: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">Session resources</p>
        <h3 className="mt-1 text-base font-semibold tracking-tight">{batchName}</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-6 py-5 space-y-6">
          <Section title="Current lesson">
            <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/[0.06] p-4">
              <p className="text-sm font-medium">Module 4 — VPC Peering & Transit Gateway</p>
              <p className="text-[11px] text-zinc-500 mt-1">In progress · 24 min</p>
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
                <button key={i} className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left bg-white/[0.02] ring-1 ring-white/[0.05] hover:bg-white/[0.05] hover:ring-white/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-zinc-500">{r.i}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{r.t}</p>
                      <p className="text-[10px] text-zinc-500">{r.s}</p>
                    </div>
                  </div>
                  <Download className="h-3.5 w-3.5 text-zinc-600" />
                </button>
              ))}
            </div>
          </Section>
          <Section title="Shared with class">
            <p className="text-xs text-zinc-500">Drop a link or file to push it to all student environments.</p>
            <Button className="mt-3 w-full bg-white/[0.05] ring-1 ring-white/10 text-zinc-200 hover:bg-white/[0.1]">Share new resource</Button>
          </Section>
        </div>
      </ScrollArea>
    </div>
  );
}

function ChatBubble({ from, text, t, kind }: { from: string; text: string; t: string; kind: "msg" | "q" | "sys" }) {
  if (kind === "sys") {
    return <p className="text-center text-[11px] text-zinc-600">{text}</p>;
  }
  const me = from === "You";
  return (
    <div className={cn("flex flex-col gap-1", me ? "items-end" : "items-start")}>
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-zinc-500">{from}</span>
        <span className="text-[10px] text-zinc-600">{t}</span>
      </div>
      <div className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm",
        me ? "bg-white text-black" : "bg-white/[0.05] text-zinc-100 ring-1 ring-white/[0.06]"
      )}>
        {text}
      </div>
    </div>
  );
}

function ChatInput({ value, onChange, onSend }: { value: string; onChange: (v: string) => void; onSend: () => void }) {
  return (
    <div className="p-4 border-t border-white/5">
      <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] px-3 py-1.5 focus-within:ring-white/20 transition">
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
          placeholder="Message your students…"
          className="flex-1 bg-transparent border-0 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none py-2"
        />
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-white text-black disabled:opacity-30 hover:bg-zinc-100 transition"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
