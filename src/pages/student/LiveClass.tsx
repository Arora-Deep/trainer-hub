import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Monitor, Video, BookOpen, MessageSquare, Users, Maximize2,
  Minimize2, Terminal, Send, ChevronRight, FileText, Play,
  Pause, Volume2, Settings, Clock, Cpu, MemoryStick,
  Hand, ThumbsUp, Heart, Zap, HelpCircle, Radio,
  PenTool, ChevronDown, ChevronUp, Circle,
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

export default function StudentLiveClass() {
  const [labExpanded, setLabExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [chatInput, setChatInput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");
  const [handRaised, setHandRaised] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const reactionId = useRef(0);

  const sendReaction = (emoji: string) => {
    const id = reactionId.current++;
    setReactions((prev) => [...prev, { id, emoji }]);
  };

  const removeReaction = (id: number) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleHand = () => {
    setHandRaised(!handRaised);
    toast(handRaised ? "Hand lowered" : "✋ Hand raised — instructor notified");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
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

          {/* Hand Raise */}
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

      {/* Main Split View */}
      <div className={`grid gap-4 ${labExpanded ? "grid-cols-1" : "lg:grid-cols-5"}`}>
        {/* LEFT: Video/LMS Panel */}
        {!labExpanded && (
          <div className="lg:col-span-3 space-y-4">
            <Card className="overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <TabsList className="h-8">
                    <TabsTrigger value="video" className="text-xs gap-1.5"><Video className="h-3 w-3" /> Live Video</TabsTrigger>
                    <TabsTrigger value="content" className="text-xs gap-1.5"><BookOpen className="h-3 w-3" /> Course Content</TabsTrigger>
                    <TabsTrigger value="notes" className="text-xs gap-1.5"><FileText className="h-3 w-3" /> Notes</TabsTrigger>
                    <TabsTrigger value="whiteboard" className="text-xs gap-1.5"><PenTool className="h-3 w-3" /> Whiteboard</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Volume2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                <TabsContent value="video" className="m-0">
                  <div className="aspect-video bg-foreground/5 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                      <p className="text-sm font-medium">Live Stream — VPC Deep Dive</p>
                      <p className="text-xs text-muted-foreground mt-1">Instructor is sharing screen</p>
                    </div>

                    {/* Floating Reactions */}
                    <AnimatePresence>
                      {reactions.map((r) => (
                        <FloatingReaction key={r.id} id={r.id} emoji={r.emoji} onDone={removeReaction} />
                      ))}
                    </AnimatePresence>

                    {/* Reactions Bar */}
                    <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border">
                      {[
                        { emoji: "👍", icon: ThumbsUp },
                        { emoji: "👏", icon: Heart },
                        { emoji: "🤯", icon: Zap },
                        { emoji: "❓", icon: HelpCircle },
                      ].map((r) => (
                        <Button
                          key={r.emoji}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-lg hover:scale-125 transition-transform"
                          onClick={() => sendReaction(r.emoji)}
                        >
                          {r.emoji}
                        </Button>
                      ))}
                    </div>

                    {/* Video controls bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-background px-4 py-2 flex items-center gap-3">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-background hover:text-background/80"><Pause className="h-4 w-4" /></Button>
                      <Progress value={55} className="h-1 flex-1 [&>div]:bg-primary" />
                      <span className="text-[11px]">0:55:00 / 2:00:00</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-background hover:text-background/80"><Maximize2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="m-0">
                  <ScrollArea className="h-[400px]">
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
                </TabsContent>

                <TabsContent value="notes" className="m-0">
                  <div className="p-4 h-[400px]">
                    <textarea
                      className="w-full h-full bg-transparent resize-none text-sm focus:outline-none placeholder:text-muted-foreground"
                      placeholder="Type your notes here... These are saved automatically."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="whiteboard" className="m-0">
                  <div className="h-[400px] flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <PenTool className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Shared Whiteboard</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">The instructor can share a whiteboard for collaborative drawing</p>
                      <Badge variant="outline" className="mt-3 text-[10px]">Coming Soon</Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Poll Widget */}
            <Card className="border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">Live Poll</h3>
                  <Badge variant="secondary" className="text-[10px]">{pollData.totalVotes} votes</Badge>
                </div>
                <p className="text-sm font-medium mb-3">{pollData.question}</p>
                <div className="space-y-2">
                  {pollData.options.map((opt, i) => {
                    const pct = pollData.totalVotes > 0 ? Math.round((opt.votes / pollData.totalVotes) * 100) : 0;
                    const isSelected = selectedPollOption === i;
                    return (
                      <button
                        key={i}
                        className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all relative overflow-hidden ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                        }`}
                        onClick={() => setSelectedPollOption(i)}
                      >
                        <div className="absolute inset-0 bg-primary/10 origin-left transition-transform" style={{ transform: `scaleX(${pct / 100})` }} />
                        <div className="relative flex items-center justify-between">
                          <span className={isSelected ? "font-medium" : ""}>{opt.label}</span>
                          {selectedPollOption !== null && <span className="font-medium">{pct}%</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Live Chat</h3>
                  <Badge variant="secondary" className="text-[10px]">{participants.length} online</Badge>
                </div>
                <ScrollArea className="h-[180px] mb-3">
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
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    className="text-xs h-8"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <Button size="sm" className="h-8 px-3"><Send className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* RIGHT: Lab Console Panel */}
        <div className={labExpanded ? "" : "lg:col-span-2"}>
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Lab Console</span>
                <Badge className="bg-success/10 text-success text-[10px]">● Connected</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-[9px] gap-1">
                  <Circle className="h-2 w-2 text-primary fill-primary" /> Instructor synced
                </Badge>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => setLabExpanded(!labExpanded)}
                >
                  {labExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU: 45%</span>
              <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" /> RAM: 62%</span>
              <span>IP: 10.0.1.42</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1h 45m left</span>
            </div>

            <div className="flex-1 bg-foreground/95 text-background p-4 font-mono text-xs min-h-[400px]">
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

            <div className="flex items-center gap-2 border-t border-border bg-foreground/90 px-4 py-2">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
