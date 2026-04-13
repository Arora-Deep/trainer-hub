import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Monitor, Terminal, Play, Pause, RotateCcw, ExternalLink, Copy, Wifi, WifiOff,
  Users, Eye, EyeOff, Megaphone, Send, Camera, Power, PowerOff, Shield,
  Cpu, HardDrive, Clock, CheckCircle2, AlertCircle, XCircle, RefreshCw,
  MessageSquare, Hand, Zap, Settings, Volume2, VolumeX, Share2, Download,
  ChevronRight, Search, MoreVertical, Radio, Loader2, Lock, Unlock,
  ScreenShare, ScreenShareOff, Clipboard, Server, Activity, ArrowUpDown,
  Star, ChevronDown, FileText,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBatchStore, type Student, type VMInstance } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

const cpuData = Array.from({ length: 20 }, (_, i) => ({ t: i, v: 30 + Math.random() * 40 }));
const ramData = Array.from({ length: 20 }, (_, i) => ({ t: i, v: 40 + Math.random() * 30 }));

const mockChat: { id: string; name: string; msg: string; time: string; type: "message" | "question" | "system" }[] = [
  { id: "1", name: "Alice Johnson", msg: "Can you explain the VPC peering concept again?", time: "2:34 PM", type: "question" },
  { id: "2", name: "Bob Williams", msg: "Got it, thanks!", time: "2:35 PM", type: "message" },
  { id: "3", name: "System", msg: "Carol Davis raised hand", time: "2:36 PM", type: "system" },
  { id: "4", name: "Eva Martinez", msg: "My terminal is showing permission denied on port 443", time: "2:37 PM", type: "question" },
  { id: "5", name: "David Brown", msg: "Same issue here with the security group settings", time: "2:38 PM", type: "message" },
];

const terminalLines = [
  "root@trainer-vm:~# kubectl get pods -n production",
  "NAME                          READY   STATUS    RESTARTS   AGE",
  "nginx-dep-7f44fc4d4-2k8x9    1/1     Running   0          2h",
  "nginx-dep-7f44fc4d4-9j3bc    1/1     Running   0          2h",
  "redis-master-0                1/1     Running   0          5h",
  "root@trainer-vm:~# _",
];

const vmLogLines = [
  "[2024-01-17 14:32:01] INFO  VM started successfully",
  "[2024-01-17 14:32:03] INFO  Network interface eth0 configured: 10.0.1.x",
  "[2024-01-17 14:32:05] INFO  SSH daemon started on port 22",
  "[2024-01-17 14:33:12] INFO  User login: root from 10.0.0.1",
  "[2024-01-17 14:35:45] WARN  High CPU usage detected: 87%",
  "[2024-01-17 14:36:01] INFO  Snapshot checkpoint created",
  "[2024-01-17 14:40:22] INFO  Package update: kubectl v1.28.4 installed",
  "[2024-01-17 14:42:10] INFO  Lab environment validation passed",
];

export default function LiveTraining() {
  const { batches, recloneStudentVM, recloneAllVMs, resetStudentVM, resetAllVMs,
    restartStudentVM, stopStudentVM, startStudentVM, snapshotStudentVM,
    recloneTrainerVM, resetTrainerVM, stopTrainerVM, startTrainerVM, createSnapshot } = useBatchStore();
  const liveBatches = batches.filter(b => b.status === "live" || b.status === "upcoming");
  const [selectedBatchId, setSelectedBatchId] = useState(liveBatches[0]?.id || "");
  const batch = batches.find(b => b.id === selectedBatchId);

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [screenSharing, setScreenSharing] = useState(false);
  const [labSync, setLabSync] = useState(false);
  const [recordingOn, setRecordingOn] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [chatMessages, setChatMessages] = useState(mockChat);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentVM, setSelectedStudentVM] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState("");
  const [lockAllVMs, setLockAllVMs] = useState(false);
  const [quickPollOpen, setQuickPollOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [trainerConsoleOpen, setTrainerConsoleOpen] = useState(false);
  const [showTrainerPassword, setShowTrainerPassword] = useState(false);
  const [resetSnapshotId, setResetSnapshotId] = useState("");
  const [recloneConfirmVM, setRecloneConfirmVM] = useState<string | null>(null);
  const [showStudentLogs, setShowStudentLogs] = useState(false);
  const [snapshotPanelOpen, setSnapshotPanelOpen] = useState(true);
  const [trainerSnapshotDialogOpen, setTrainerSnapshotDialogOpen] = useState(false);
  const [trainerSnapshotName, setTrainerSnapshotName] = useState("");
  const [trainerRecloneSnapshotId, setTrainerRecloneSnapshotId] = useState("");
  const [trainerResetSnapshotId, setTrainerResetSnapshotId] = useState("");

  useEffect(() => {
    if (!sessionActive) return;
    const iv = setInterval(() => setSessionTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [sessionActive]);

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const vm = batch?.vmConfig;
  const students = batch?.students || [];
  const studentVMs = vm?.studentVMs || [];
  const snapshots = vm?.snapshots || [];

  const studentGrid = students.map(s => {
    const svm = studentVMs.find(v => v.assignedTo === s.name);
    return { ...s, vm: svm };
  });

  const filteredStudents = studentGrid.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineCount = students.filter(s => s.vmStatus === "running").length;
  const handsRaised = 2;
  const questionsCount = chatMessages.filter(m => m.type === "question").length;

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(), name: "You (Trainer)", msg: chatInput.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), type: "message",
    }]);
    setChatInput("");
  };

  const sendAnnouncement = () => {
    if (!announcementText.trim() || !batch) return;
    toast({ title: "Announcement Sent", description: `Broadcast to ${students.length} students` });
    setAnnouncementText("");
  };

  if (!batch) {
    return (
      <div className="space-y-6">
        <PageHeader title="Live Training" description="Select a batch to start a live training session" />
        <Card>
          <CardContent className="py-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Radio className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold">No Active Batches</h3>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">Create a batch and start a live training session to use this command center.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <PageHeader title="Live Training" description="Real-time session command center" breadcrumbs={[{ label: "Live Training" }]} />
          <div className="flex items-center gap-2">
            <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="Select batch..." />
              </SelectTrigger>
              <SelectContent>
                {liveBatches.map(b => (
                  <SelectItem key={b.id} value={b.id}>
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", b.status === "live" ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--warning))]")} />
                      {b.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Session Control Bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-xl border p-3 flex items-center justify-between gap-4",
            sessionActive ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5" : "border-border bg-card"
          )}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-3">
            {sessionActive ? (
              <Button variant="destructive" size="sm" onClick={() => { setSessionActive(false); toast({ title: "Session Ended" }); }}>
                <Pause className="mr-1.5 h-3.5 w-3.5" />End Session
              </Button>
            ) : (
              <Button size="sm" onClick={() => { setSessionActive(true); setSessionTimer(0); toast({ title: "Session Started", description: "Live training is now active" }); }}>
                <Play className="mr-1.5 h-3.5 w-3.5" />Start Session
              </Button>
            )}
            {sessionActive && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[hsl(var(--destructive))] animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-[hsl(var(--destructive))]">LIVE</span>
                </div>
                <span className="text-sm font-mono font-semibold tabular-nums">{formatTimer(sessionTimer)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip><TooltipTrigger asChild>
              <Button variant={screenSharing ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => { setScreenSharing(!screenSharing); toast({ title: screenSharing ? "Screen Share Stopped" : "Screen Sharing" }); }}>
                {screenSharing ? <ScreenShare className="h-3.5 w-3.5" /> : <ScreenShareOff className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger><TooltipContent>Screen Share</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant={labSync ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => { setLabSync(!labSync); toast({ title: labSync ? "Lab Sync Off" : "Lab Sync On — Students see your terminal" }); }}>
                <Terminal className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger><TooltipContent>Sync Terminal to Students</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant={recordingOn ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => { setRecordingOn(!recordingOn); toast({ title: recordingOn ? "Recording Stopped" : "Recording Started" }); }}>
                <Camera className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger><TooltipContent>Record Session</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setAudioOn(!audioOn)}>
                {audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger><TooltipContent>{audioOn ? "Mute" : "Unmute"}</TooltipContent></Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Tooltip><TooltipTrigger asChild>
              <Button variant={lockAllVMs ? "destructive" : "outline"} size="icon" className="h-8 w-8" onClick={() => { setLockAllVMs(!lockAllVMs); toast({ title: lockAllVMs ? "VMs Unlocked" : "All Student VMs Locked" }); }}>
                {lockAllVMs ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger><TooltipContent>{lockAllVMs ? "Unlock All VMs" : "Lock All VMs"}</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Snapshot Created", description: "All student VMs snapshotted" })}>
                <Camera className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger><TooltipContent>Snapshot All VMs</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => toast({ title: "VMs Restarted" })}>
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger><TooltipContent>Restart All VMs</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => { recloneAllVMs(batch.id); toast({ title: "Recloning All VMs", description: "All student VMs being recloned from golden..." }); }}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger><TooltipContent>Reclone All from Golden</TooltipContent></Tooltip>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold">{onlineCount}</span>
              <span className="text-muted-foreground">/ {students.length}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Hand className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
              <span className="font-semibold">{handsRaised}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold">{questionsCount}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Meeting Widget */}
      <Card className="border-primary/20">
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Monitor className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Meeting Room</p>
              <p className="text-xs text-muted-foreground">Start or join a video meeting with your batch</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => { window.location.href = "/meetings"; }}>
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> All Meetings
            </Button>
            <Button size="sm" onClick={() => toast({ title: "Meeting Started", description: "CloudAdda Meet room is now live for this batch" })}>
              <Monitor className="h-3.5 w-3.5 mr-1.5" /> Start Meeting
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4" style={{ height: "calc(100vh - 300px)" }}>
        {/* Left: Trainer VM + Snapshots + Controls */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0 overflow-y-auto">
          {/* Trainer VM Card */}
          <Card className="flex-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Trainer VM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vm?.trainerVM ? (
                <>
                  <div className="flex items-center justify-between">
                    <StatusBadge
                      status={vm.trainerVM.status === "running" || vm.trainerVM.status === "configured" ? "success" : "warning"}
                      label={vm.trainerVM.status === "running" || vm.trainerVM.status === "configured" ? "Running" : vm.trainerVM.status}
                      pulse={vm.trainerVM.status === "running" || vm.trainerVM.status === "configured"}
                    />
                    <code className="text-xs font-mono px-2 py-0.5 rounded bg-muted">{vm.trainerVM.ipAddress || "—"}</code>
                  </div>

                  {/* Mini terminal preview */}
                  <div className="rounded-lg bg-[hsl(var(--foreground))] p-2.5 font-mono text-[10px] leading-relaxed text-[hsl(var(--background))] overflow-hidden">
                    {terminalLines.slice(-4).map((line, i) => (
                      <div key={i} className="opacity-80">{line}</div>
                    ))}
                  </div>

                  {/* Mini resource charts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border/50 p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">CPU</span>
                        <span className="text-[10px] font-semibold">47%</span>
                      </div>
                      <ResponsiveContainer width="100%" height={24}>
                        <AreaChart data={cpuData}>
                          <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="rounded-lg border border-border/50 p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-muted-foreground">RAM</span>
                        <span className="text-[10px] font-semibold">62%</span>
                      </div>
                      <ResponsiveContainer width="100%" height={24}>
                        <AreaChart data={ramData}>
                          <Area type="monotone" dataKey="v" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Trainer VM actions */}
                  <div className="space-y-1.5">
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setTrainerConsoleOpen(true)}>
                        <Terminal className="mr-1 h-3 w-3" />Console
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { navigator.clipboard.writeText(`ssh ${vm.trainerVM.credentials.username}@${vm.trainerVM.ipAddress}`); toast({ title: "SSH Copied" }); }}>
                        <Clipboard className="mr-1 h-3 w-3" />SSH
                      </Button>
                    </div>

                    {/* Power controls */}
                    <div className="grid grid-cols-2 gap-1.5">
                      {(vm.trainerVM.status === "running" || vm.trainerVM.status === "configured") ? (
                        <Button size="sm" variant="outline" className="text-xs h-7 text-destructive" onClick={() => { stopTrainerVM(batch.id); toast({ title: "Trainer VM Stopping..." }); }}>
                          <PowerOff className="mr-1 h-3 w-3" />Stop
                        </Button>
                      ) : vm.trainerVM.status === "stopped" ? (
                        <Button size="sm" variant="outline" className="text-xs h-7 text-[hsl(var(--success))]" onClick={() => { startTrainerVM(batch.id); toast({ title: "Trainer VM Starting..." }); }}>
                          <Power className="mr-1 h-3 w-3" />Start
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-7" disabled>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />...
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast({ title: "VM Restarting..." })}>
                        <RotateCcw className="mr-1 h-3 w-3" />Restart
                      </Button>
                    </div>

                    {/* Snapshot actions */}
                    <Button size="sm" variant="outline" className="text-xs h-7 w-full" onClick={() => setTrainerSnapshotDialogOpen(true)}>
                      <Camera className="mr-1 h-3 w-3" />Take Named Snapshot
                    </Button>

                    {/* Reclone from snapshot */}
                    {snapshots.filter(s => s.status === "ready").length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reclone from Snapshot</p>
                        <div className="flex gap-1">
                          <Select value={trainerRecloneSnapshotId} onValueChange={setTrainerRecloneSnapshotId}>
                            <SelectTrigger className="h-7 text-xs flex-1">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {snapshots.filter(s => s.status === "ready").map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex items-center gap-1.5">
                                    {s.isGolden && <Star className="h-2.5 w-2.5 text-primary" />}
                                    {s.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="destructive" className="text-xs h-7 px-2 shrink-0" disabled={!trainerRecloneSnapshotId} onClick={() => {
                            recloneTrainerVM(batch.id, trainerRecloneSnapshotId);
                            toast({ title: "Recloning Trainer VM", description: "Destroying and rebuilding from snapshot..." });
                            setTrainerRecloneSnapshotId("");
                          }}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reset to snapshot */}
                    {snapshots.filter(s => s.status === "ready").length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reset to Snapshot</p>
                        <div className="flex gap-1">
                          <Select value={trainerResetSnapshotId} onValueChange={setTrainerResetSnapshotId}>
                            <SelectTrigger className="h-7 text-xs flex-1">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {snapshots.filter(s => s.status === "ready").map(s => (
                                <SelectItem key={s.id} value={s.id}>
                                  <div className="flex items-center gap-1.5">
                                    {s.isGolden && <Star className="h-2.5 w-2.5 text-primary" />}
                                    {s.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2 shrink-0" disabled={!trainerResetSnapshotId} onClick={() => {
                            resetTrainerVM(batch.id, trainerResetSnapshotId);
                            toast({ title: "Resetting Trainer VM", description: "Restoring disk state from snapshot..." });
                            setTrainerResetSnapshotId("");
                          }}>
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* RDP command for Windows */}
                    <Button size="sm" variant="outline" className="text-xs h-7 w-full" onClick={() => { navigator.clipboard.writeText(`mstsc /v:${vm.trainerVM.ipAddress}`); toast({ title: "RDP Command Copied" }); }}>
                      <Monitor className="mr-1 h-3 w-3" />Copy RDP Command
                    </Button>
                  </div>

                  {/* SSH credentials */}
                  <div className="rounded-lg border border-border/50 p-2.5 space-y-1.5">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Credentials</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">User</span>
                      <code className="font-mono">{vm.trainerVM.credentials.username}</code>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Port</span>
                      <code className="font-mono">{vm.trainerVM.credentials.sshPort}</code>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Monitor className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No VM configured</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Snapshot Quick Panel */}
          {snapshots.length > 0 && (
            <Collapsible open={snapshotPanelOpen} onOpenChange={setSnapshotPanelOpen}>
              <Card className="flex-none">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 cursor-pointer">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />
                        Snapshots ({snapshots.length})
                      </div>
                      <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", snapshotPanelOpen && "rotate-180")} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-2">
                    {snapshots.filter(s => s.status === "ready").map(snap => (
                      <div key={snap.id} className={cn(
                        "flex items-center justify-between p-2 rounded-lg border text-xs",
                        snap.isGolden ? "border-primary/30 bg-primary/5" : "border-border/50"
                      )}>
                        <div className="flex items-center gap-2 min-w-0">
                          {snap.isGolden ? <Star className="h-3 w-3 text-primary shrink-0" /> : <Camera className="h-3 w-3 text-muted-foreground shrink-0" />}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{snap.name}</p>
                            <p className="text-[10px] text-muted-foreground">{snap.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2 shrink-0" onClick={() => {
                          resetAllVMs(batch.id, snap.id);
                          toast({ title: "Resetting All", description: `Resetting all VMs to "${snap.name}"` });
                        }}>
                          <RotateCcw className="mr-1 h-2.5 w-2.5" />Reset All
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Quick Broadcast */}
          <Card className="flex-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-[hsl(var(--warning))]" />
                Quick Broadcast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Type announcement..." value={announcementText} onChange={e => setAnnouncementText(e.target.value)} className="text-xs h-8" onKeyDown={e => e.key === "Enter" && sendAnnouncement()} />
                <Button size="sm" className="h-8 px-3 shrink-0" onClick={sendAnnouncement}><Send className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Poll */}
          <Card className="flex-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Quick Poll
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button size="sm" variant="outline" className="w-full text-xs h-8" onClick={() => setQuickPollOpen(true)}>
                <Zap className="mr-1.5 h-3 w-3" />Launch Quick Poll
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Center: Student VM Grid */}
        <div className="col-span-6 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-3 flex-none">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  Student VMs & Monitoring
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{students.length}</Badge>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input placeholder="Search students..." className="pl-7 h-7 w-48 text-xs" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs"><ArrowUpDown className="mr-1 h-3 w-3" />Sort</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Name A-Z</DropdownMenuItem>
                      <DropdownMenuItem>Status</DropdownMenuItem>
                      <DropdownMenuItem>Last Active</DropdownMenuItem>
                      <DropdownMenuItem>Attendance</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4 pt-0">
                  {/* Stats Row */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Online", value: onlineCount, color: "text-[hsl(var(--success))]", icon: Wifi },
                      { label: "Offline", value: students.length - onlineCount, color: "text-muted-foreground", icon: WifiOff },
                      { label: "Hands Up", value: handsRaised, color: "text-[hsl(var(--warning))]", icon: Hand },
                      { label: "Errors", value: students.filter(s => s.vmStatus === "error").length, color: "text-[hsl(var(--destructive))]", icon: AlertCircle },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-lg border border-border/50 p-2.5 text-center">
                        <stat.icon className={cn("h-3.5 w-3.5 mx-auto mb-1", stat.color)} />
                        <p className="text-lg font-bold tabular-nums">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Student Grid */}
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
                    <AnimatePresence>
                      {filteredStudents.map((student, i) => {
                        const vmRunning = student.vmStatus === "running";
                        const vmError = student.vmStatus === "error";
                        const vmStopped = student.vmStatus === "stopped";
                        const mockCpu = Math.floor(20 + Math.random() * 60);
                        const mockRam = Math.floor(30 + Math.random() * 50);
                        const isRaisedHand = i < handsRaised;

                        return (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className={cn(
                              "rounded-xl border p-3 relative group cursor-pointer hover:border-primary/30 transition-all",
                              vmError && "border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5",
                              isRaisedHand && "ring-2 ring-[hsl(var(--warning))]/40",
                              vmRunning && "border-border",
                              vmStopped && "border-border/50 opacity-70"
                            )}
                            onClick={() => setSelectedStudentVM(student.id)}
                          >
                            {isRaisedHand && (
                              <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-[hsl(var(--warning))] flex items-center justify-center">
                                <Hand className="h-2.5 w-2.5 text-[hsl(var(--warning-foreground))]" />
                              </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                                  {student.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold truncate">{student.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{student.currentModule}</p>
                              </div>
                              <span className={cn(
                                "h-2 w-2 rounded-full shrink-0",
                                vmRunning && "bg-[hsl(var(--success))]",
                                vmError && "bg-[hsl(var(--destructive))]",
                                vmStopped && "bg-muted-foreground",
                                student.vmStatus === "not_assigned" && "bg-muted"
                              )} />
                            </div>

                            {vmRunning && (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-muted-foreground">CPU</span>
                                  <span className="font-mono font-medium">{mockCpu}%</span>
                                </div>
                                <Progress value={mockCpu} className="h-1" />
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-muted-foreground">RAM</span>
                                  <span className="font-mono font-medium">{mockRam}%</span>
                                </div>
                                <Progress value={mockRam} className="h-1" />
                                <div className="flex items-center justify-between text-[10px] mt-1">
                                  <code className="font-mono text-muted-foreground">{student.vmIpAddress}</code>
                                  <span className="text-muted-foreground">{student.lastActive}</span>
                                </div>
                              </div>
                            )}

                            {vmError && (
                              <div className="mt-1 text-[10px] text-[hsl(var(--destructive))] flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />VM Error — needs attention
                              </div>
                            )}

                            {/* Hover actions */}
                            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); toast({ title: `Console: ${student.name}` }); }}>
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent>Open Console</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); toast({ title: `Viewing ${student.name}'s screen` }); }}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent>View Screen</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); if (student.vm) { restartStudentVM(batch.id, student.vm.id); } toast({ title: `Restarting ${student.name}'s VM` }); }}>
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent>Restart VM</TooltipContent></Tooltip>
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="secondary" size="icon" className="h-6 w-6" onClick={e => { e.stopPropagation(); if (student.vm) { recloneStudentVM(batch.id, student.vm.id); } toast({ title: `Recloning ${student.name}'s VM` }); }}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent>Reclone from Golden</TooltipContent></Tooltip>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {filteredStudents.length === 0 && (
                      <div className="col-span-full py-8 text-center">
                        <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No students found</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right: Chat & Attendance */}
        <div className="col-span-3 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardHeader className="pb-2 flex-none">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Live Chat
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{chatMessages.length}</Badge>
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setChatMessages([])}>
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-0">
              <ScrollArea className="flex-1 px-4">
                <div className="space-y-2 py-2">
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "rounded-lg p-2.5 text-xs",
                          msg.type === "question" && "border border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5",
                          msg.type === "system" && "bg-muted/50 text-center italic text-muted-foreground",
                          msg.type === "message" && "bg-muted/30",
                          msg.name === "You (Trainer)" && "bg-primary/10 border border-primary/20"
                        )}
                      >
                        {msg.type !== "system" && (
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-semibold">{msg.name}</span>
                            <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                          </div>
                        )}
                        <p className={msg.type === "system" ? "text-[10px]" : ""}>{msg.msg}</p>
                        {msg.type === "question" && (
                          <Badge variant="outline" className="mt-1.5 text-[9px] h-4 border-[hsl(var(--warning))]/30 text-[hsl(var(--warning))]">
                            Question
                          </Badge>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
              <div className="p-3 border-t border-border flex gap-2">
                <Input placeholder="Reply to students..." className="text-xs h-8" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} />
                <Button size="sm" className="h-8 px-3 shrink-0" onClick={sendChat}><Send className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Summary */}
          <Card className="flex-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {students.slice(0, 5).map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      s.vmStatus === "running" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"
                    )} />
                    <span className="truncate max-w-[120px]">{s.name}</span>
                  </div>
                  <span className="text-muted-foreground font-mono">{s.attendance.present}/{s.attendance.total}</span>
                </div>
              ))}
              {students.length > 5 && (
                <p className="text-[10px] text-muted-foreground text-center mt-1">+{students.length - 5} more</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student VM Detail Sheet — Enhanced */}
      <Sheet open={!!selectedStudentVM} onOpenChange={() => setSelectedStudentVM(null)}>
        <SheetContent className="w-[520px] sm:max-w-[520px]">
          {(() => {
            const student = students.find(s => s.id === selectedStudentVM);
            if (!student) return null;
            const svm = studentVMs.find(v => v.assignedTo === student.name);
            const mockCpu = Math.floor(20 + Math.random() * 60);
            const mockRam = Math.floor(30 + Math.random() * 50);
            const mockDisk = Math.floor(20 + Math.random() * 40);
            const currentSnap = snapshots.find(s => s.id === svm?.currentSnapshotId);

            return (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span>{student.name}</span>
                      <p className="text-sm font-normal text-muted-foreground">{student.email}</p>
                    </div>
                  </SheetTitle>
                  <SheetDescription>Student VM details and actions</SheetDescription>
                </SheetHeader>

                <ScrollArea className="mt-6 h-[calc(100vh-160px)]">
                  <div className="space-y-6 pr-4">
                    {/* Status Overview */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl border border-border p-3 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">VM</p>
                        <StatusBadge
                          status={student.vmStatus === "running" ? "success" : student.vmStatus === "error" ? "error" : "default"}
                          label={student.vmStatus || "N/A"}
                        />
                      </div>
                      <div className="rounded-xl border border-border p-3 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Score</p>
                        <p className="text-lg font-bold">{student.quizScore ?? "—"}</p>
                      </div>
                      <div className="rounded-xl border border-border p-3 text-center">
                        <p className="text-[10px] text-muted-foreground uppercase mb-1">Attend.</p>
                        <p className="text-lg font-bold">{Math.round((student.attendance.present / Math.max(student.attendance.total, 1)) * 100)}%</p>
                      </div>
                    </div>

                    {/* VM Resources */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">VM Resources</h4>
                      {[
                        { label: "CPU", value: mockCpu },
                        { label: "RAM", value: mockRam },
                        { label: "Disk", value: mockDisk },
                      ].map(r => (
                        <div key={r.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">{r.label}</span>
                            <span className="font-mono font-medium">{r.value}%</span>
                          </div>
                          <Progress value={r.value} className="h-1.5" />
                        </div>
                      ))}
                    </div>

                    {/* Connection Info */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connection</h4>
                      <div className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">IP Address</span>
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono">{student.vmIpAddress || "—"}</code>
                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { navigator.clipboard.writeText(student.vmIpAddress || ""); toast({ title: "Copied" }); }}>
                              <Copy className="h-2.5 w-2.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Module</span>
                          <span className="font-medium">{student.currentModule}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Last Active</span>
                          <span>{student.lastActive}</span>
                        </div>
                        {currentSnap && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Current Snapshot</span>
                            <Badge variant="secondary" className="text-[10px] h-4 px-1.5">{currentSnap.name}</Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" className="text-xs" onClick={() => toast({ title: `Console opened for ${student.name}` })}>
                          <ExternalLink className="mr-1.5 h-3 w-3" />Open Console
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: `Viewing ${student.name}'s screen` })}>
                          <Eye className="mr-1.5 h-3 w-3" />View Screen
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => { if (svm) restartStudentVM(batch.id, svm.id); toast({ title: `Restarting VM` }); }}>
                          <RotateCcw className="mr-1.5 h-3 w-3" />Restart VM
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => { navigator.clipboard.writeText(`ssh root@${student.vmIpAddress}`); toast({ title: "SSH Copied" }); }}>
                          <Terminal className="mr-1.5 h-3 w-3" />Copy SSH
                        </Button>
                        {svm && svm.status === "running" ? (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => { stopStudentVM(batch.id, svm.id); toast({ title: "VM Stopped" }); }}>
                            <PowerOff className="mr-1.5 h-3 w-3" />Stop VM
                          </Button>
                        ) : svm ? (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => { startStudentVM(batch.id, svm.id); toast({ title: "VM Starting" }); }}>
                            <Power className="mr-1.5 h-3 w-3" />Start VM
                          </Button>
                        ) : null}
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => {
                          if (svm) { snapshotStudentVM(batch.id, svm.id, `${student.name} - ${new Date().toLocaleTimeString()}`); }
                          toast({ title: "Snapshot Created", description: `Saving ${student.name}'s VM state` });
                        }}>
                          <Camera className="mr-1.5 h-3 w-3" />Take Snapshot
                        </Button>
                      </div>
                    </div>

                    {/* Reset to Snapshot Selector */}
                    {snapshots.filter(s => s.status === "ready").length > 0 && svm && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reset to Snapshot</h4>
                        <div className="flex gap-2">
                          <Select value={resetSnapshotId} onValueChange={setResetSnapshotId}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select snapshot..." />
                            </SelectTrigger>
                            <SelectContent>
                              {snapshots.filter(s => s.status === "ready").map(snap => (
                                <SelectItem key={snap.id} value={snap.id}>
                                  <div className="flex items-center gap-1.5">
                                    {snap.isGolden && <Star className="h-3 w-3 text-primary" />}
                                    {snap.name} ({snap.size})
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" className="h-8 text-xs shrink-0" disabled={!resetSnapshotId} onClick={() => {
                            if (svm && resetSnapshotId) {
                              resetStudentVM(batch.id, svm.id, resetSnapshotId);
                              toast({ title: "Resetting VM", description: `Resetting to "${snapshots.find(s => s.id === resetSnapshotId)?.name}"` });
                              setResetSnapshotId("");
                            }
                          }}>
                            <RefreshCw className="mr-1 h-3 w-3" />Reset
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Reclone from Golden */}
                    {svm && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reclone</h4>
                        <Button size="sm" variant="destructive" className="w-full text-xs" onClick={() => {
                          recloneStudentVM(batch.id, svm.id);
                          toast({ title: "Recloning VM", description: `Destroying and recreating ${student.name}'s VM from golden snapshot` });
                        }}>
                          <Copy className="mr-1.5 h-3 w-3" />Reclone from Golden Snapshot
                        </Button>
                      </div>
                    )}

                    {/* VM Logs */}
                    <Collapsible open={showStudentLogs} onOpenChange={setShowStudentLogs}>
                      <div className="space-y-2">
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">VM Logs</h4>
                          <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", showStudentLogs && "rotate-180")} />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="rounded-lg bg-[hsl(var(--foreground))] p-3 font-mono text-[10px] leading-relaxed text-[hsl(var(--background))] max-h-[200px] overflow-y-auto">
                            {vmLogLines.map((line, i) => (
                              <div key={i} className={cn(
                                "opacity-80",
                                line.includes("WARN") && "text-yellow-400",
                                line.includes("ERROR") && "text-red-400"
                              )}>{line}</div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  </div>
                </ScrollArea>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>

      {/* Trainer Console Sheet */}
      <Sheet open={trainerConsoleOpen} onOpenChange={setTrainerConsoleOpen}>
        <SheetContent className="w-[560px] sm:max-w-[560px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Trainer Console
            </SheetTitle>
            <SheetDescription>Full console access to your trainer VM</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {/* Terminal */}
            <div className="rounded-lg bg-[hsl(var(--foreground))] p-4 font-mono text-xs leading-relaxed text-[hsl(var(--background))] min-h-[280px]">
              {terminalLines.map((line, i) => (
                <div key={i} className="opacity-80">{line}</div>
              ))}
            </div>

            {/* Connection Details */}
            {vm?.trainerVM && (
              <div className="rounded-xl border border-border p-4 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connection Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">IP Address</span>
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono">{vm.trainerVM.ipAddress}</code>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { navigator.clipboard.writeText(vm.trainerVM.ipAddress); toast({ title: "Copied" }); }}>
                        <Copy className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">SSH Command</span>
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono text-xs">ssh {vm.trainerVM.credentials.username}@{vm.trainerVM.ipAddress}</code>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { navigator.clipboard.writeText(`ssh ${vm.trainerVM.credentials.username}@${vm.trainerVM.ipAddress}`); toast({ title: "SSH Copied" }); }}>
                        <Copy className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Username</span>
                    <code className="font-mono text-xs">{vm.trainerVM.credentials.username}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Password</span>
                    <div className="flex items-center gap-1.5">
                      <code className="font-mono text-xs">{showTrainerPassword ? vm.trainerVM.credentials.password : "••••••••"}</code>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowTrainerPassword(!showTrainerPassword)}>
                        {showTrainerPassword ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Port</span>
                    <code className="font-mono text-xs">{vm.trainerVM.credentials.sshPort}</code>
                  </div>
                </div>
              </div>
            )}

            {/* Trainer VM Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "VM Restarting..." })}>
                  <RotateCcw className="mr-1.5 h-3 w-3" />Restart
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Snapshot Created" })}>
                  <Camera className="mr-1.5 h-3 w-3" />Snapshot
                </Button>
                <Button size="sm" variant="destructive" className="text-xs" onClick={() => toast({ title: "VM Stopped" })}>
                  <PowerOff className="mr-1.5 h-3 w-3" />Stop
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Quick Poll Dialog */}
      <Dialog open={quickPollOpen} onOpenChange={setQuickPollOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Launch Quick Poll</DialogTitle>
            <DialogDescription>Create and broadcast a poll to all students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <Input placeholder="e.g., Are you able to see the output?" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select defaultValue="yesno">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yesno">Yes / No</SelectItem>
                  <SelectItem value="abc">A / B / C / D</SelectItem>
                  <SelectItem value="scale">Scale 1-5</SelectItem>
                  <SelectItem value="thumbs">👍 / 👎</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickPollOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast({ title: "Poll Launched", description: `"${pollQuestion}" sent to ${students.length} students` }); setQuickPollOpen(false); setPollQuestion(""); }}>
              <Zap className="mr-1.5 h-3.5 w-3.5" />Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
