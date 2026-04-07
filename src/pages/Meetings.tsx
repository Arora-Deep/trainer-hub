import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Phone, PhoneOff,
  Users, MessageSquare, Hand, Settings, Copy, ExternalLink, Plus,
  Calendar, Clock, Link2, MoreVertical, Search, Play, Square,
  Volume2, VolumeX, Maximize2, Minimize2, Grid3X3, LayoutGrid,
  Share2, Download, Upload, Camera, CircleDot, Send, Smile,
  ChevronRight, AlertCircle, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock meetings data
const mockMeetings = [
  {
    id: "m1", title: "Kubernetes Batch - Day 3 Session", batch: "K8s Advanced - DevOps Academy",
    status: "live" as const, startTime: "10:00 AM", endTime: "12:00 PM", date: "2026-04-07",
    participants: 24, maxParticipants: 30, host: "Trainer Rahul",
    platform: "built-in" as const, link: "", recording: true,
  },
  {
    id: "m2", title: "ML Lab Walkthrough", batch: "ML GPU Lab - DataScience Bootcamp",
    status: "scheduled" as const, startTime: "2:00 PM", endTime: "4:00 PM", date: "2026-04-07",
    participants: 0, maxParticipants: 20, host: "Trainer Priya",
    platform: "google-meet" as const, link: "https://meet.google.com/abc-defg-hij", recording: false,
  },
  {
    id: "m3", title: "Linux Networking - Doubt Clearing", batch: "Linux Fundamentals - Corporate L&D",
    status: "scheduled" as const, startTime: "5:00 PM", endTime: "6:00 PM", date: "2026-04-08",
    participants: 0, maxParticipants: 15, host: "Trainer Amit",
    platform: "zoom" as const, link: "https://zoom.us/j/123456789", recording: false,
  },
  {
    id: "m4", title: "Docker Basics - Day 1", batch: "K8s Advanced - DevOps Academy",
    status: "ended" as const, startTime: "10:00 AM", endTime: "12:00 PM", date: "2026-04-06",
    participants: 22, maxParticipants: 30, host: "Trainer Rahul",
    platform: "built-in" as const, link: "", recording: true,
  },
  {
    id: "m5", title: "AWS Workshop Review", batch: "Cloud Practitioner - Corporate L&D",
    status: "ended" as const, startTime: "3:00 PM", endTime: "5:00 PM", date: "2026-04-05",
    participants: 18, maxParticipants: 25, host: "Trainer Priya",
    platform: "google-meet" as const, link: "https://meet.google.com/xyz-uvwx-yz", recording: true,
  },
];

const mockParticipants = [
  { id: "p1", name: "Alice Johnson", avatar: "AJ", mic: true, video: true, hand: false, speaking: true },
  { id: "p2", name: "Bob Williams", avatar: "BW", mic: false, video: true, hand: false, speaking: false },
  { id: "p3", name: "Carol Davis", avatar: "CD", mic: true, video: false, hand: true, speaking: false },
  { id: "p4", name: "David Brown", avatar: "DB", mic: true, video: true, hand: false, speaking: false },
  { id: "p5", name: "Eva Martinez", avatar: "EM", mic: false, video: true, hand: false, speaking: false },
  { id: "p6", name: "Frank Lee", avatar: "FL", mic: true, video: false, hand: false, speaking: false },
  { id: "p7", name: "Grace Kim", avatar: "GK", mic: false, video: false, hand: true, speaking: false },
  { id: "p8", name: "Henry Wang", avatar: "HW", mic: true, video: true, hand: false, speaking: false },
];

const mockChatMessages = [
  { id: "c1", sender: "Alice Johnson", text: "Can you zoom into the terminal?", time: "10:34 AM" },
  { id: "c2", sender: "You", text: "Sure, let me share my screen", time: "10:34 AM" },
  { id: "c3", sender: "Bob Williams", text: "Got it, thanks!", time: "10:35 AM" },
  { id: "c4", sender: "Carol Davis", text: "I have a question about the deployment", time: "10:36 AM" },
  { id: "c5", sender: "System", text: "Recording started", time: "10:37 AM" },
];

export default function Meetings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [inMeeting, setInMeeting] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<typeof mockMeetings[0] | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Meeting controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const [recording, setRecording] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [gridView, setGridView] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [meetingTimer, setMeetingTimer] = useState(0);

  // Schedule form
  const [scheduleForm, setScheduleForm] = useState({
    title: "", batch: "", date: "", startTime: "", endTime: "",
    platform: "built-in", link: "", enableRecording: true, enableChat: true,
    waitingRoom: false, muteOnEntry: true,
  });

  const joinMeeting = (meeting: typeof mockMeetings[0]) => {
    if (meeting.platform !== "built-in") {
      window.open(meeting.link, "_blank");
      toast({ title: "Opening external meeting", description: `Redirecting to ${meeting.platform === "google-meet" ? "Google Meet" : "Zoom"}...` });
      return;
    }
    setActiveMeeting(meeting);
    setInMeeting(true);
    setRecording(meeting.recording);
    toast({ title: "Joined meeting", description: meeting.title });
  };

  const leaveMeeting = () => {
    setInMeeting(false);
    setActiveMeeting(null);
    setScreenShare(false);
    setRecording(false);
    toast({ title: "Left meeting" });
  };

  const scheduleMeeting = () => {
    toast({ title: "Meeting scheduled", description: `"${scheduleForm.title}" scheduled for ${scheduleForm.date}` });
    setScheduleOpen(false);
    setScheduleForm({ title: "", batch: "", date: "", startTime: "", endTime: "", platform: "built-in", link: "", enableRecording: true, enableChat: true, waitingRoom: false, muteOnEntry: true });
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link || `https://cloudadda.meet/join/${Date.now()}`);
    toast({ title: "Meeting link copied" });
  };

  const statusColor = (s: string) => {
    if (s === "live") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (s === "scheduled") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  const platformIcon = (p: string) => {
    if (p === "google-meet") return "🟢";
    if (p === "zoom") return "🔵";
    return "⚡";
  };

  const filteredMeetings = mockMeetings.filter(m => {
    if (activeTab === "upcoming") return m.status === "live" || m.status === "scheduled";
    if (activeTab === "past") return m.status === "ended";
    return true;
  }).filter(m =>
    !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─── IN-MEETING VIEW ────────────────────────────────────────
  if (inMeeting && activeMeeting) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CircleDot className="h-4 w-4 text-destructive animate-pulse" />
              <span className="text-sm font-medium">{activeMeeting.title}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {activeMeeting.startTime} - {activeMeeting.endTime}
            </Badge>
            {recording && (
              <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs animate-pulse">
                <CircleDot className="h-3 w-3 mr-1" /> REC
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Users className="h-3 w-3 mr-1" /> {mockParticipants.length} participants
            </Badge>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyLink("")}>
              <Link2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setFullscreen(!fullscreen)}>
              {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Video grid */}
          <div className="flex-1 flex flex-col">
            <div className={cn("flex-1 p-3", gridView ? "grid grid-cols-3 gap-2" : "flex flex-col gap-2")}>
              {/* Trainer (You) - large tile */}
              <div className={cn(
                "relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20",
                gridView ? "col-span-2 row-span-2" : "flex-[2]"
              )}>
                <div className="absolute inset-0 flex items-center justify-center">
                  {videoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <Avatar className="h-20 w-20 mx-auto mb-3 ring-4 ring-primary/30">
                          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">TR</AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">Camera Preview</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Avatar className="h-20 w-20 mx-auto mb-3">
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">TR</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">You (Trainer)</p>
                    </div>
                  )}
                </div>
                {screenShare && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary/20 text-primary text-xs">
                      <Monitor className="h-3 w-3 mr-1" /> Sharing Screen
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1">
                  <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm">
                    You (Host)
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  {!micOn && <div className="h-6 w-6 rounded-full bg-destructive/80 flex items-center justify-center"><MicOff className="h-3 w-3" /></div>}
                </div>
              </div>

              {/* Participant tiles */}
              {mockParticipants.slice(0, gridView ? 4 : 6).map((p) => (
                <div key={p.id} className="relative rounded-xl overflow-hidden bg-card border border-border min-h-[120px] group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {p.video ? (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-sm">{p.avatar}</AvatarFallback>
                        </Avatar>
                      </div>
                    ) : (
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="text-sm">{p.avatar}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  {p.speaking && <div className="absolute inset-0 ring-2 ring-primary rounded-xl animate-pulse" />}
                  {p.hand && (
                    <div className="absolute top-2 right-2">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                        <Hand className="h-4 w-4 text-amber-400" />
                      </motion.div>
                    </div>
                  )}
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                    <Badge variant="outline" className="text-[10px] bg-background/60 backdrop-blur-sm py-0">
                      {p.name.split(" ")[0]}
                    </Badge>
                  </div>
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5">
                    {!p.mic && <div className="h-5 w-5 rounded-full bg-destructive/60 flex items-center justify-center"><MicOff className="h-2.5 w-2.5" /></div>}
                  </div>
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <MicOff className="h-3 w-3 mr-1" /> Mute
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      <Monitor className="h-3 w-3 mr-1" /> Pin
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls bar */}
            <div className="flex items-center justify-center gap-2 p-3 bg-card border-t border-border">
              <Button
                variant={micOn ? "outline" : "destructive"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={videoOn ? "outline" : "destructive"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setVideoOn(!videoOn)}
              >
                {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button
                variant={screenShare ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setScreenShare(!screenShare)}
              >
                {screenShare ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              </Button>
              <Button
                variant={recording ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => { setRecording(!recording); toast({ title: recording ? "Recording stopped" : "Recording started" }); }}
              >
                <CircleDot className={cn("h-4 w-4", recording && "text-destructive")} />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant={handRaised ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setHandRaised(!handRaised)}
              >
                <Hand className={cn("h-4 w-4", handRaised && "text-amber-400")} />
              </Button>
              <Button
                variant={chatOpen ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => { setChatOpen(!chatOpen); setParticipantsOpen(false); }}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant={participantsOpen ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => { setParticipantsOpen(!participantsOpen); setChatOpen(false); }}
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant={gridView ? "secondary" : "outline"}
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={() => setGridView(!gridView)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="destructive" size="sm" className="rounded-full px-6" onClick={leaveMeeting}>
                <PhoneOff className="h-4 w-4 mr-2" /> Leave
              </Button>
            </div>
          </div>

          {/* Side panel (chat or participants) */}
          <AnimatePresence>
            {(chatOpen || participantsOpen) && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-border bg-card flex flex-col overflow-hidden"
              >
                {chatOpen && (
                  <>
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <span className="text-sm font-medium">Meeting Chat</span>
                      <Badge variant="outline" className="text-xs">{mockChatMessages.length}</Badge>
                    </div>
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-3">
                        {mockChatMessages.map((msg) => (
                          <div key={msg.id} className={cn("text-sm", msg.sender === "System" && "text-center")}>
                            {msg.sender === "System" ? (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">{msg.text}</Badge>
                            ) : (
                              <>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className={cn("font-medium text-xs", msg.sender === "You" ? "text-primary" : "text-foreground")}>
                                    {msg.sender}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                                </div>
                                <p className="text-muted-foreground text-xs">{msg.text}</p>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-3 border-t border-border flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="text-xs h-8"
                        onKeyDown={(e) => { if (e.key === "Enter" && chatInput.trim()) { toast({ title: "Message sent" }); setChatInput(""); }}}
                      />
                      <Button size="icon" className="h-8 w-8 shrink-0">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                )}
                {participantsOpen && (
                  <>
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <span className="text-sm font-medium">Participants</span>
                      <Badge variant="outline" className="text-xs">{mockParticipants.length}</Badge>
                    </div>
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-1">
                        {/* Host */}
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">TR</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">You (Host)</p>
                          </div>
                          <Badge variant="outline" className="text-[9px]">Host</Badge>
                        </div>
                        {mockParticipants.map((p) => (
                          <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group">
                            <div className="relative">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[10px]">{p.avatar}</AvatarFallback>
                              </Avatar>
                              {p.speaking && <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs truncate">{p.name}</p>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {p.hand && <Hand className="h-3 w-3 text-amber-400" />}
                              {p.mic ? <Mic className="h-3 w-3 text-muted-foreground" /> : <MicOff className="h-3 w-3 text-destructive" />}
                              {p.video ? <Video className="h-3 w-3 text-muted-foreground" /> : <VideoOff className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast({ title: `Muted ${p.name}` })}>
                                  <MicOff className="h-3.5 w-3.5 mr-2" /> Mute
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast({ title: `Pinned ${p.name}` })}>
                                  <Monitor className="h-3.5 w-3.5 mr-2" /> Pin Video
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" onClick={() => toast({ title: `Removed ${p.name}` })}>
                                  <XCircle className="h-3.5 w-3.5 mr-2" /> Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-3 border-t border-border space-y-2">
                      <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => toast({ title: "All participants muted" })}>
                        <VolumeX className="h-3 w-3 mr-1.5" /> Mute All
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ─── MEETING LIST VIEW ──────────────────────────────────────
  return (
    <div className="space-y-6">
      <PageHeader title="Meetings" subtitle="Schedule, join, and manage training meetings">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search meetings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-64" />
          </div>
          <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Schedule Meeting</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Schedule a Meeting</DialogTitle>
                <DialogDescription>Set up a new training meeting for a batch</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Meeting Title</Label>
                  <Input placeholder="e.g. Kubernetes Day 4 - Deployments" value={scheduleForm.title} onChange={(e) => setScheduleForm({...scheduleForm, title: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Batch</Label>
                  <Select value={scheduleForm.batch} onValueChange={(v) => setScheduleForm({...scheduleForm, batch: v})}>
                    <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="k8s">K8s Advanced - DevOps Academy</SelectItem>
                      <SelectItem value="ml">ML GPU Lab - DataScience Bootcamp</SelectItem>
                      <SelectItem value="linux">Linux Fundamentals - Corporate L&D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date</Label>
                    <Input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start</Label>
                    <Input type="time" value={scheduleForm.startTime} onChange={(e) => setScheduleForm({...scheduleForm, startTime: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">End</Label>
                    <Input type="time" value={scheduleForm.endTime} onChange={(e) => setScheduleForm({...scheduleForm, endTime: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Platform</Label>
                  <Select value={scheduleForm.platform} onValueChange={(v) => setScheduleForm({...scheduleForm, platform: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="built-in">⚡ Built-in (CloudAdda Meet)</SelectItem>
                      <SelectItem value="google-meet">🟢 Google Meet</SelectItem>
                      <SelectItem value="zoom">🔵 Zoom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {scheduleForm.platform !== "built-in" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Meeting Link</Label>
                    <Input placeholder="Paste meeting URL..." value={scheduleForm.link} onChange={(e) => setScheduleForm({...scheduleForm, link: e.target.value})} />
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enable Recording</Label>
                    <Switch checked={scheduleForm.enableRecording} onCheckedChange={(v) => setScheduleForm({...scheduleForm, enableRecording: v})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Enable Chat</Label>
                    <Switch checked={scheduleForm.enableChat} onCheckedChange={(v) => setScheduleForm({...scheduleForm, enableChat: v})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Waiting Room</Label>
                    <Switch checked={scheduleForm.waitingRoom} onCheckedChange={(v) => setScheduleForm({...scheduleForm, waitingRoom: v})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Mute on Entry</Label>
                    <Switch checked={scheduleForm.muteOnEntry} onCheckedChange={(v) => setScheduleForm({...scheduleForm, muteOnEntry: v})} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
                <Button onClick={scheduleMeeting}>Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CircleDot className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockMeetings.filter(m => m.status === "live").length}</p>
              <p className="text-xs text-muted-foreground">Live Now</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockMeetings.filter(m => m.status === "scheduled").length}</p>
              <p className="text-xs text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockMeetings.reduce((a, m) => a + m.participants, 0)}</p>
              <p className="text-xs text-muted-foreground">Total Participants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockMeetings.filter(m => m.recording).length}</p>
              <p className="text-xs text-muted-foreground">Recordings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming & Live</TabsTrigger>
          <TabsTrigger value="past">Past Meetings</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {/* Live meetings highlight */}
          {activeTab !== "past" && mockMeetings.filter(m => m.status === "live").length > 0 && (
            <div className="mb-4 space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CircleDot className="h-3.5 w-3.5 text-emerald-400 animate-pulse" /> Live Now
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockMeetings.filter(m => m.status === "live").map((meeting) => (
                  <Card key={meeting.id} className="border-emerald-500/30 bg-emerald-500/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{platformIcon(meeting.platform)}</span>
                            <h4 className="font-medium text-sm">{meeting.title}</h4>
                          </div>
                          <p className="text-xs text-muted-foreground">{meeting.batch}</p>
                        </div>
                        <Badge className={statusColor(meeting.status)} variant="outline">
                          <CircleDot className="h-3 w-3 mr-1" /> Live
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {meeting.startTime} - {meeting.endTime}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {meeting.participants}/{meeting.maxParticipants}</span>
                        <span>Host: {meeting.host}</span>
                      </div>
                      <Progress value={(meeting.participants / meeting.maxParticipants) * 100} className="h-1.5 mb-3" />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => joinMeeting(meeting)}>
                          <Play className="h-3.5 w-3.5 mr-1.5" /> Join Now
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => copyLink(meeting.link)}>
                          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Link
                        </Button>
                        {meeting.platform !== "built-in" && (
                          <Button size="sm" variant="ghost" onClick={() => window.open(meeting.link, "_blank")}>
                            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open in {meeting.platform === "google-meet" ? "Meet" : "Zoom"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Meeting table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Platform</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="text-lg">{platformIcon(meeting.platform)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{meeting.title}</p>
                          {meeting.recording && <Badge variant="outline" className="text-[10px] mt-0.5">📹 Recording</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{meeting.batch}</TableCell>
                      <TableCell className="text-sm">
                        <div>{meeting.date}</div>
                        <div className="text-xs text-muted-foreground">{meeting.startTime} - {meeting.endTime}</div>
                      </TableCell>
                      <TableCell className="text-sm">{meeting.host}</TableCell>
                      <TableCell className="text-sm">{meeting.participants}/{meeting.maxParticipants}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("text-xs", statusColor(meeting.status))}>
                          {meeting.status === "live" && <CircleDot className="h-3 w-3 mr-1" />}
                          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {meeting.status === "live" && (
                            <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => joinMeeting(meeting)}>
                              Join
                            </Button>
                          )}
                          {meeting.status === "scheduled" && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => joinMeeting(meeting)}>
                              {meeting.platform === "built-in" ? "Start" : "Open"}
                            </Button>
                          )}
                          {meeting.status === "ended" && meeting.recording && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs">
                              <Download className="h-3 w-3 mr-1" /> Recording
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyLink(meeting.link)}>
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => copyLink(meeting.link)}>
                                <Copy className="h-3.5 w-3.5 mr-2" /> Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem><Share2 className="h-3.5 w-3.5 mr-2" /> Share</DropdownMenuItem>
                              {meeting.status === "scheduled" && (
                                <>
                                  <DropdownMenuItem><Settings className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive"><XCircle className="h-3.5 w-3.5 mr-2" /> Cancel</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
