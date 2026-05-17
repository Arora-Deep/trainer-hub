import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Monitor, Video, BookOpen, MessageSquare, Users, Maximize2,
  Minimize2, Terminal, Send, ChevronRight, FileText, Play,
  Pause, Volume2, Settings, Clock, Cpu, MemoryStick,
  Hand, ThumbsUp, Heart, Zap, HelpCircle, Radio,
  ChevronDown, ChevronUp, Circle, LayoutGrid, Columns2,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  RotateCw, Power, Save, StickyNote, Mic, Camera, Share2,
  Download, Link2, Image as ImageIcon, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/* ── Data ── */
const courseModules = [
  { name: "Introduction to AWS", completed: true },
  { name: "IAM & Security", completed: true },
  { name: "EC2 Fundamentals", completed: true },
  { name: "EC2 Hands-on Lab", completed: true },
  { name: "S3 & Storage", completed: true },
  { name: "S3 Quiz", completed: true },
  { name: "Networking Basics", completed: true },
  { name: "VPC Overview", completed: true },
  { name: "VPC Deep Dive", completed: false, current: true },
  { name: "VPC Lab", completed: false },
  { name: "Route 53 & CDN", completed: false },
  { name: "Final Assessment", completed: false },
];

const chatMessages = [
  { user: "Instructor", message: "Welcome to today's VPC Deep Dive session!", time: "2:00 PM", isInstructor: true },
  { user: "Amit K.", message: "Can you explain subnet CIDR blocks?", time: "2:05 PM", isInstructor: false },
  { user: "Instructor", message: "Great question! Let me pull up the diagram...", time: "2:06 PM", isInstructor: true },
  { user: "Priya S.", message: "Is it possible to peer VPCs across regions?", time: "2:12 PM", isInstructor: false },
  { user: "Instructor", message: "Yes! We'll cover cross-region peering in the next section.", time: "2:13 PM", isInstructor: true },
  { user: "You", message: "What about transit gateways?", time: "2:18 PM", isInstructor: false },
];

const terminalLines = [
  "$ aws ec2 describe-vpcs --region us-east-1",
  '{"Vpcs": [{"VpcId": "vpc-0a1b2c3d4e", "CidrBlock": "10.0.0.0/16", "State": "available"}]}',
  "$ aws ec2 describe-subnets --vpc-id vpc-0a1b2c3d4e",
  '{"Subnets": [{"SubnetId": "subnet-abc123", "CidrBlock": "10.0.1.0/24", "AvailabilityZone": "us-east-1a"}]}',
  "$ aws ec2 create-security-group --group-name lab-sg --description \"Lab SG\" --vpc-id vpc-0a1b2c3d4e",
  '{"GroupId": "sg-0x1y2z3w4v"}',
  "$ _",
];

const participants = [
  { name: "James Wilson", role: "instructor", status: "presenting" },
  { name: "You (Sarah)", role: "student", status: "watching" },
  { name: "Amit K.", role: "student", status: "watching" },
  { name: "Priya S.", role: "student", status: "hand_raised" },
  { name: "Rahul M.", role: "student", status: "watching" },
  { name: "Neha D.", role: "student", status: "away" },
  { name: "Vikram J.", role: "student", status: "watching" },
  { name: "Ananya R.", role: "student", status: "watching" },
  { name: "Deepak P.", role: "student", status: "watching" },
  { name: "Meera T.", role: "student", status: "watching" },
  { name: "Karan S.", role: "student", status: "away" },
  { name: "Sanya B.", role: "student", status: "watching" },
  { name: "Rohan G.", role: "student", status: "watching" },
  { name: "Nidhi L.", role: "student", status: "watching" },
  { name: "Arjun V.", role: "student", status: "watching" },
];

const pollData = {
  question: "Which VPC component controls outbound traffic?",
  options: [
    { label: "Security Group", votes: 5 },
    { label: "NACL", votes: 8 },
    { label: "Route Table", votes: 2 },
    { label: "Internet Gateway", votes: 0 },
  ],
  totalVotes: 15,
  yourVote: null as number | null,
};

const statusIndicators: Record<string, { color: string; label: string }> = {
  presenting: { color: "bg-primary", label: "Presenting" },
  watching: { color: "bg-success", label: "Online" },
  hand_raised: { color: "bg-warning", label: "Hand Raised" },
  away: { color: "bg-muted-foreground/40", label: "Away" },
};

type ViewMode = "default" | "content" | "lab" | "notes";
type SideRail = "materials" | "chat" | "students" | null;

const sessionMaterials = [
  { name: "Lab guide.pdf", size: "1.2 MB", icon: FileText },
  { name: "Slides — VPC peering.pdf", size: "3.4 MB", icon: FileText },
  { name: "github.com/cloudadda/aws-labs", size: "Repository", icon: Link2 },
  { name: "Architecture diagram.png", size: "820 KB", icon: ImageIcon },
];

/* ── Floating Reaction ── */
function FloatingReaction({ emoji, id, onDone }: { emoji: string; id: number; onDone: (id: number) => void }) {
  return (
    <motion.div
      className="absolute text-2xl pointer-events-none"
      style={{ left: `${30 + Math.random() * 40}%`, bottom: "60px" }}
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -200, scale: 1.5 }}
      transition={{ duration: 2, ease: "easeOut" }}
      onAnimationComplete={() => onDone(id)}
    >
      {emoji}
    </motion.div>
  );
}

/* ── Reusable Console Panel ── */
function ConsolePanel({
  terminalInput,
  setTerminalInput,
  showActions = true,
  compact = false,
}: {
  terminalInput: string;
  setTerminalInput: (v: string) => void;
  showActions?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-success" />
          <span className="text-sm font-semibold">Lab Console</span>
          <Badge className="bg-success/10 text-success text-[10px]">● Connected</Badge>
        </div>
        <Badge variant="outline" className="text-[9px] gap-1">
          <Circle className="h-2 w-2 text-primary fill-primary" /> Synced
        </Badge>
      </div>
      <div className="flex items-center gap-3 px-3 py-1.5 border-b border-border bg-muted/30 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> 45%</span>
        <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" /> 62%</span>
        <span>10.0.1.42</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1h 45m</span>
      </div>
      {showActions && (
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border bg-muted/10">
          <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] gap-1"><Power className="h-3 w-3" /> Start</Button>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] gap-1"><Pause className="h-3 w-3" /> Stop</Button>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] gap-1"><RotateCw className="h-3 w-3" /> Restart</Button>
          <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px] gap-1 ml-auto"><Save className="h-3 w-3" /> Snapshot</Button>
        </div>
      )}
      <div className={`flex-1 bg-foreground/95 text-background p-3 font-mono text-xs ${compact ? "min-h-[200px]" : "min-h-[300px]"}`}>
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {terminalLines.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-success" : "text-background/70"}>
                {line}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex items-center gap-2 border-t border-border bg-foreground/90 px-3 py-1.5">
        <Terminal className="h-4 w-4 text-success" />
        <input
          type="text"
          className="flex-1 bg-transparent text-background text-xs font-mono focus:outline-none placeholder:text-background/40"
          placeholder="Type command..."
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
        />
        <Button size="sm" variant="ghost" className="h-6 px-2 text-background hover:text-background/80">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ── Reusable Chat Panel ── */
function ChatPanel({ chatInput, setChatInput }: { chatInput: string; setChatInput: (v: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">Live Chat</h3>
        <Badge variant="secondary" className="text-[10px] ml-auto">{participants.length} online</Badge>
      </div>
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-3">
          {chatMessages.map((msg, i) => (
            <div key={i} className="flex gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                msg.isInstructor ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {msg.user[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{msg.user}</span>
                  {msg.isInstructor && <Badge className="text-[9px] bg-primary/10 text-primary h-4">Instructor</Badge>}
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-xs text-foreground/80 mt-0.5">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2 px-3 py-2 border-t border-border">
        <Input
          placeholder="Type a message..."
          className="text-xs h-8"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
        />
        <Button size="sm" className="h-8 px-3"><Send className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

/* ── Reusable Course Content Panel ── */
function CourseContentPanel() {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-semibold mb-3">Course Modules</h3>
        {courseModules.map((m, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 py-2 px-3 rounded-md text-sm cursor-pointer transition-colors ${
              m.current ? "bg-primary/10 border border-primary/30" : m.completed ? "text-muted-foreground" : "hover:bg-muted/50"
            }`}
          >
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
              m.completed ? "bg-success/10 text-success" : m.current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {m.completed ? "✓" : i + 1}
            </div>
            <span className={`flex-1 text-xs ${m.completed ? "line-through" : ""}`}>{m.name}</span>
            {m.current && <Badge className="text-[10px] bg-primary/20 text-primary">Current</Badge>}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

/* ── Students Rail ── */
function StudentsRail() {
  return (
    <ScrollArea className="h-full">
      <div className="p-3 space-y-1">
        {participants.map((p, i) => {
          const indicator = statusIndicators[p.status];
          return (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 text-xs">
              <div className={`h-2 w-2 rounded-full ${indicator.color} ${p.status === "hand_raised" ? "animate-pulse" : ""}`} />
              <span className={`flex-1 ${p.role === "instructor" ? "font-semibold" : ""}`}>{p.name}</span>
              {p.role === "instructor" && <Badge className="text-[8px] bg-primary/10 text-primary h-3.5 px-1">Tutor</Badge>}
              {p.status === "hand_raised" && <Hand className="h-3 w-3 text-warning" />}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

export default function StudentLiveClass() {
  const [viewMode, setViewMode] = useState<ViewMode>("default");
  const [labExpanded, setLabExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [chatInput, setChatInput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [handRaised, setHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const reactionId = useRef(0);

  // Split view state
  const [splitLeftCollapsed, setSplitLeftCollapsed] = useState(false);
  const [splitRail, setSplitRail] = useState<SideRail>("materials");
  const [fullscreen, setFullscreen] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  // Content view state
  const [contentLeftCollapsed, setContentLeftCollapsed] = useState(false);
  const [labRailCollapsed, setLabRailCollapsed] = useState(false);

  // Notes view state
  const [notesRailCollapsed, setNotesRailCollapsed] = useState(false);
  const [notesValue, setNotesValue] = useState("");

  const sendReaction = (emoji: string) => {
    const id = reactionId.current++;
    setReactions((prev) => [...prev, { id, emoji }]);
  };
  const removeReaction = (id: number) => setReactions((prev) => prev.filter((r) => r.id !== id));
  const toggleHand = () => {
    setHandRaised(!handRaised);
    toast(handRaised ? "Hand lowered" : "✋ Hand raised — instructor notified");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">AWS VPC Deep Dive</h1>
            <Badge className="bg-destructive/10 text-destructive text-[10px] animate-pulse">● LIVE</Badge>
            <Badge variant="outline" className="text-[10px] gap-1"><Radio className="h-2.5 w-2.5 text-destructive" /> Recording</Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">AWS Cloud Practitioner — Batch 12 · Instructor: James Wilson</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs cursor-pointer" onClick={() => setShowParticipants(!showParticipants)}>
            <Users className="h-3 w-3" /> {participants.length} Online
            {showParticipants ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs"><Clock className="h-3 w-3" /> 1h 45m remaining</Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={handRaised ? "default" : "outline"}
                  size="sm"
                  className={`gap-1.5 ${handRaised ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}`}
                  onClick={toggleHand}
                >
                  <Hand className="h-3.5 w-3.5" />
                  {handRaised ? "Lower" : "Raise"}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p className="text-xs">Signal the instructor</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="destructive" size="sm">Leave Session</Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="h-9">
            <TabsTrigger value="default" className="text-xs gap-1.5"><LayoutGrid className="h-3.5 w-3.5" /> Default</TabsTrigger>
            <TabsTrigger value="content" className="text-xs gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Content View</TabsTrigger>
            <TabsTrigger value="lab" className="text-xs gap-1.5"><Terminal className="h-3.5 w-3.5" /> Lab View</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs gap-1.5"><StickyNote className="h-3.5 w-3.5" /> Notes</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Recording Notice */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-destructive">
        <Radio className="h-3 w-3 animate-pulse" />
        This session is being recorded. Recording will be available within 24 hours.
      </div>

      {/* Participants Panel */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <Card>
              <CardContent className="py-3">
                <div className="flex flex-wrap gap-2">
                  {participants.map((p, i) => {
                    const indicator = statusIndicators[p.status];
                    return (
                      <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 text-xs">
                        <div className={`h-2 w-2 rounded-full ${indicator.color} ${p.status === "hand_raised" ? "animate-pulse" : ""}`} />
                        <span className={p.role === "instructor" ? "font-semibold" : ""}>{p.name}</span>
                        {p.role === "instructor" && <Badge className="text-[8px] bg-primary/10 text-primary h-3.5 px-1">Instructor</Badge>}
                        {p.status === "hand_raised" && <Hand className="h-3 w-3 text-warning" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== DEFAULT VIEW ===== */}
      {viewMode === "default" && (
        <div className={`grid gap-4 ${labExpanded ? "grid-cols-1" : "lg:grid-cols-5"}`}>
          {!labExpanded && (
            <div className="lg:col-span-3 space-y-4 flex flex-col">
              {/* Course Content — extended to fill area down to chat */}
              <Card className="overflow-hidden flex-1">
                <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Course Content</span>
                    <Badge variant="outline" className="text-[10px]">Synced with instructor</Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                </div>
                <div className="h-[520px]"><CourseContentPanel /></div>
              </Card>

              {/* Chat */}
              <Card>
                <CardContent className="py-0 px-0">
                  <div className="h-[280px]"><ChatPanel chatInput={chatInput} setChatInput={setChatInput} /></div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Right: Lab Console */}
          <div className={labExpanded ? "" : "lg:col-span-2"}>
            <Card className="h-full">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold">Lab Console</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setLabExpanded(!labExpanded)}>
                  {labExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <ConsolePanel terminalInput={terminalInput} setTerminalInput={setTerminalInput} />
            </Card>
          </div>
        </div>
      )}

      {/* ===== CONTENT VIEW ===== */}
      {viewMode === "content" && (
        <div className="grid gap-3 transition-all" style={{
          gridTemplateColumns: `${contentLeftCollapsed ? "44px" : "320px"} 1fr`,
        }}>
          {/* Left: Console & Actions rail (matches Split-view "You" rail) */}
          <Card className="overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-2 py-1.5 shrink-0">
              {!contentLeftCollapsed && <span className="text-xs font-semibold px-1 text-muted-foreground uppercase tracking-wider">You</span>}
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setContentLeftCollapsed(!contentLeftCollapsed)}>
                {contentLeftCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
              </Button>
            </div>

            {!contentLeftCollapsed && (
              <ScrollArea className="flex-1 h-[700px]">
                <div className="p-3 space-y-4">
                  {/* Profile */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">SR</div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-background" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold leading-tight">You · Student</div>
                      <div className="text-[11px] text-muted-foreground truncate">student-vm-sarah-42</div>
                    </div>
                  </div>

                  {/* Mic / Cam / Share */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <Button variant={micOn ? "default" : "outline"} size="sm"
                      className={`h-12 flex-col gap-0.5 text-[10px] ${micOn ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20" : ""}`}
                      onClick={() => setMicOn(!micOn)}>
                      <Mic className="h-3.5 w-3.5" /> Mic
                    </Button>
                    <Button variant={camOn ? "default" : "outline"} size="sm"
                      className={`h-12 flex-col gap-0.5 text-[10px] ${camOn ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20" : ""}`}
                      onClick={() => setCamOn(!camOn)}>
                      <Camera className="h-3.5 w-3.5" /> Cam
                    </Button>
                    <Button variant="outline" size="sm" className="h-12 flex-col gap-0.5 text-[10px]">
                      <Share2 className="h-3.5 w-3.5" /> Share
                    </Button>
                  </div>

                  {/* Your Machine */}
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Your Machine</div>
                    <div className="rounded-lg overflow-hidden border border-border bg-foreground text-background p-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="text-success">$ kubectl get pods -n training</div>
                      <div className="text-background/70">NAME    READY  STATUS</div>
                      <div className="text-background/70">vpc-router-7d4f  1/1  Running</div>
                      <div className="text-background/70">peering-gw-6a9e  1/1  Running</div>
                      <div className="text-background/70">nat-instance-2f  1/1  Running</div>
                      <div className="text-success mt-1">$ terraform apply</div>
                      <div className="text-background/70">Plan: 4 to add, 0 to change.</div>
                      <div className="text-background/70">Apply complete! Resources: 4 added.</div>
                      <div className="text-success">$ <span className="animate-pulse">▍</span></div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1 px-0.5">
                      <span className="font-mono">10.0.4.21</span>
                      <span>4 vCPU · 8 GB</span>
                    </div>
                  </div>

                  {/* VM Controls */}
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">VM Controls</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Power className="h-3 w-3" /> Stop</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><RotateCw className="h-3 w-3" /> Restart</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Save className="h-3 w-3" /> Snapshot</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Zap className="h-3 w-3" /> Reset VM</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Monitor className="h-3 w-3" /> Console</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Share2 className="h-3 w-3" /> Share VM</Button>
                    </div>
                  </div>

                  {/* Live Chat (replaces Now Playing) */}
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Live Chat</div>
                    <div className="rounded-lg border border-border overflow-hidden h-[260px]">
                      <ChatPanel chatInput={chatInput} setChatInput={setChatInput} />
                    </div>
                  </div>

                  {/* Class Pulse */}
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Class Pulse</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Circle className="h-2 w-2 fill-success text-success" /> Online</span>
                        <span className="text-muted-foreground">{participants.filter(p => p.status === "watching" || p.status === "presenting").length}/{participants.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Circle className="h-2 w-2 fill-warning text-warning" /> Hands raised</span>
                        <span className="text-muted-foreground">{participants.filter(p => p.status === "hand_raised").length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Circle className="h-2 w-2 fill-destructive text-destructive" /> Issues</span>
                        <span className="text-muted-foreground">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </Card>

          {/* Right: Full course content */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">VPC Deep Dive — Lesson Material</span>
              <Badge variant="outline" className="text-[10px] ml-auto">Current</Badge>
            </div>
            <ScrollArea className="h-[700px]">
              <div className="p-6 max-w-3xl space-y-4">
                <h2 className="text-lg font-semibold">VPC Deep Dive</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A Virtual Private Cloud (VPC) is an isolated section of the AWS cloud where you can launch
                  resources in a virtual network you define. In this lesson we cover CIDR ranges, subnets,
                  route tables, NACLs, security groups, and inter-region peering.
                </p>
                <h3 className="text-sm font-semibold mt-4">1. CIDR &amp; Subnetting</h3>
                <p className="text-xs text-muted-foreground">A /16 VPC gives you 65,536 IPs. Subdivide into /24 subnets for AZ-level isolation.</p>
                <h3 className="text-sm font-semibold mt-4">2. Route Tables</h3>
                <p className="text-xs text-muted-foreground">Every subnet is associated with a route table that controls traffic direction.</p>
                <h3 className="text-sm font-semibold mt-4">3. Security Layers</h3>
                <p className="text-xs text-muted-foreground">Security Groups are stateful, NACLs are stateless. Use both for defense-in-depth.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-border bg-muted/30">
                    <h4 className="text-xs font-semibold mb-1">Module list</h4>
                    <CourseContentPanel />
                  </div>
                  <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                    <h4 className="text-xs font-semibold mb-1">Try it in your lab</h4>
                    <p className="text-[11px] text-muted-foreground mb-2">Run the commands shown in the console on the left.</p>
                    <Badge className="bg-primary/10 text-primary text-[10px]">Hands-on</Badge>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* ===== LAB VIEW ===== */}
      {viewMode === "lab" && (
        <div className="grid gap-3 transition-all" style={{
          gridTemplateColumns: `1fr ${labRailCollapsed ? "44px" : "340px"}`,
        }}>
          {/* Console — primary */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Lab Console</span>
                <Badge className="bg-success/10 text-success text-[10px]">● Connected</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1"><Save className="h-3.5 w-3.5" /> Snapshot</Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1"><RotateCw className="h-3.5 w-3.5" /> Restart</Button>
              </div>
            </div>
            <div className="h-[700px]"><ConsolePanel terminalInput={terminalInput} setTerminalInput={setTerminalInput} /></div>
          </Card>

          {/* Right rail: lab instructions / VM info */}
          <Card className="overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-2 py-1.5 shrink-0">
              {!labRailCollapsed && <span className="text-xs font-semibold px-1 text-muted-foreground uppercase tracking-wider">Lab Guide</span>}
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setLabRailCollapsed(!labRailCollapsed)}>
                {labRailCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelRightClose className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {!labRailCollapsed && (
              <ScrollArea className="flex-1 h-[700px]">
                <div className="p-3 space-y-4">
                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">VM Info</div>
                    <div className="rounded-lg border border-border p-2.5 space-y-1 text-[11px]">
                      <div className="flex justify-between"><span className="text-muted-foreground">Host</span><span className="font-mono">student-vm-sarah-42</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">IP</span><span className="font-mono">10.0.4.21</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Specs</span><span>4 vCPU · 8 GB</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span>1h 45m</span></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Lab Steps</div>
                    <ol className="space-y-2 text-xs">
                      {[
                        "List existing VPCs in us-east-1",
                        "Create a new /16 VPC and tag it as lab",
                        "Add two /24 subnets across AZs",
                        "Attach an internet gateway and route table",
                        "Validate connectivity with ping & curl",
                      ].map((step, i) => (
                        <li key={i} className="flex gap-2 p-2 rounded-md border border-border/60">
                          <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                          <span className="text-foreground/80">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Materials</div>
                    <div className="space-y-1.5">
                      {sessionMaterials.map((m, i) => {
                        const Icon = m.icon;
                        return (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 border border-border/50">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">{m.name}</div>
                              <div className="text-[10px] text-muted-foreground">{m.size}</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0"><Download className="h-3 w-3" /></Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">VM Controls</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Power className="h-3 w-3" /> Stop</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><RotateCw className="h-3 w-3" /> Restart</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Save className="h-3 w-3" /> Snapshot</Button>
                      <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 justify-start"><Zap className="h-3 w-3" /> Reset</Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            )}
          </Card>
        </div>
      )}


      {/* ===== NOTES VIEW ===== */}
      {viewMode === "notes" && (
        <div className="grid gap-3 transition-all" style={{
          gridTemplateColumns: `1fr ${notesRailCollapsed ? "44px" : "320px"}`,
        }}>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <StickyNote className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">My Notes</span>
                <Badge variant="outline" className="text-[10px]">Autosaved</Badge>
              </div>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1"><Save className="h-3.5 w-3.5" /> Export</Button>
            </div>
            <div className="p-4 h-[640px]">
              <textarea
                className="w-full h-full bg-transparent resize-none text-sm focus:outline-none placeholder:text-muted-foreground leading-relaxed"
                placeholder="Take notes during the live session... These sync to your account automatically."
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
              />
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
              {!notesRailCollapsed && <span className="text-xs font-semibold px-1">Course Outline</span>}
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={() => setNotesRailCollapsed(!notesRailCollapsed)}>
                {notesRailCollapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelRightClose className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {!notesRailCollapsed && <div className="h-[640px]"><CourseContentPanel /></div>}
          </Card>
        </div>
      )}
    </div>
  );
}
