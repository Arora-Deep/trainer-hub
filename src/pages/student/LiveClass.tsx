import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
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
  Download, Link2, Image as ImageIcon, X, CheckCircle, Lock, Sparkles, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { studentCourses, type StudentCourse, type StudentLesson } from "@/data/studentMockData";
import SelfPacedLearningCentre from "@/pages/student/SelfPacedLearningCentre";
import { useBatchStore, type Material } from "@/stores/batchStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { MeetingsListPanel } from "@/components/meetings/MeetingsListPanel";

/* ── Data ── */
const lessonIcons: Record<StudentLesson["type"], typeof Video> = {
  video: Video,
  reading: FileText,
  lab: Terminal,
  "lab-instruction": FileText,
  "live-session": Video,
  quiz: HelpCircle,
  assignment: FileText,
  "code-exercise": FileText,
  "ctf-scenario": Terminal,
  exam: HelpCircle,
  "mock-exam": HelpCircle,
  survey: HelpCircle,
  "game-based-learning": HelpCircle,
  reasoning: Sparkles,
};

const getCurrentLesson = (course: StudentCourse) => {
  const lessons = course.chapters.flatMap((chapter) => chapter.lessons);
  return lessons.find((lesson) => lesson.id === course.nextLessonId) ?? lessons.find((lesson) => !lesson.completed && !lesson.locked) ?? lessons[0];
};

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

type ViewMode = "default" | "content" | "lab" | "meetings" | "notes" | "materials";
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
function CourseContentPanel({ course, currentLessonId }: { course: StudentCourse; currentLessonId?: string }) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold">{course.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{course.chapters.length} chapters · {course.modules} lessons</p>
        </div>
        {course.chapters.map((chapter, chapterIndex) => (
          <div key={chapter.id} className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Chapter {chapterIndex + 1}</p>
              <span className="text-[10px] text-muted-foreground">{chapter.lessons.length} lessons</span>
            </div>
            <div className="space-y-1">
              {chapter.lessons.map((lesson, lessonIndex) => {
                const current = lesson.id === currentLessonId;
                const Icon = lessonIcons[lesson.type] ?? BookOpen;
                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-colors border",
                      current
                        ? "bg-primary/10 border-primary/30"
                        : lesson.completed
                          ? "border-transparent text-muted-foreground"
                          : "border-transparent hover:bg-muted/50",
                      lesson.locked && "opacity-60"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                      lesson.completed ? "bg-success/10 text-success" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {lesson.completed ? <CheckCircle className="h-3.5 w-3.5" /> : lesson.locked ? <Lock className="h-3.5 w-3.5" /> : lessonIndex + 1}
                    </div>
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className={cn("flex-1 text-xs min-w-0", lesson.completed && "line-through")}>{lesson.title}</span>
                    {current && <Badge className="text-[10px] bg-primary/20 text-primary">Current</Badge>}
                    <span className="text-[10px] text-muted-foreground shrink-0">{lesson.duration}</span>
                  </div>
                );
              })}
            </div>
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
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    studentCourses.find((course) => course.deliveryMode === "self-paced")?.id ?? studentCourses[0]?.id ?? ""
  );
  const selectedCourse = studentCourses.find((course) => course.id === selectedCourseId) ?? studentCourses[0];
  const currentLesson = selectedCourse ? getCurrentLesson(selectedCourse) : undefined;
  const isSelfPaced = selectedCourse?.deliveryMode === "self-paced";
  const hoursLeft = Math.max(0, (selectedCourse?.totalAccessHours ?? 0) - (selectedCourse?.usedAccessHours ?? 0));

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
  const [pushedAssessment, setPushedAssessment] = useState<{ kind: "quiz" | "insight question" | "game session"; title: string } | null>({
    kind: "quiz",
    title: "VPC Basics — 5 questions · 4 min",
  });

  const sendReaction = (emoji: string) => {
    const id = reactionId.current++;
    setReactions((prev) => [...prev, { id, emoji }]);
  };
  const removeReaction = (id: number) => setReactions((prev) => prev.filter((r) => r.id !== id));
  const toggleHand = () => {
    setHandRaised(!handRaised);
    toast(handRaised ? "Hand lowered" : "✋ Hand raised — instructor notified");
  };

  if (!selectedCourse) {
    return <div className="text-sm text-muted-foreground">No courses assigned yet.</div>;
  }

  const courseSwitcher = studentCourses.length > 0 && (
    <div className="flex flex-wrap items-center gap-3 pb-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Choose training</span>
      <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
        <SelectTrigger className="h-10 w-full max-w-md min-w-[280px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {studentCourses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{course.name}</span>
                <span className="text-[10px] text-muted-foreground capitalize">· {course.deliveryMode}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isSelfPaced && (
        <Badge className="bg-amber-500/10 text-amber-600 text-[10px] gap-1">
          <Sparkles className="h-3 w-3" /> Self-paced course
        </Badge>
      )}
    </div>
  );

  // Self-paced courses get a dedicated LMS-style learning centre.
  if (isSelfPaced) {
    return (
      <div className="space-y-4">
        {courseSwitcher}
        <SelfPacedLearningCentre course={selectedCourse} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courseSwitcher}


      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              {currentLesson?.title ?? selectedCourse.name}
            </h1>
            {isSelfPaced ? (
              <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">SELF-PACED</Badge>
            ) : (
              <>
                <Badge className="bg-destructive/10 text-destructive text-[10px] animate-pulse">● LIVE</Badge>
                <Badge variant="outline" className="text-[10px] gap-1"><Radio className="h-2.5 w-2.5 text-destructive" /> Recording</Badge>
              </>
            )}
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            {selectedCourse.name} · {isSelfPaced ? "Self-paced" : selectedCourse.batch} · Instructor: {selectedCourse.instructor}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSelfPaced ? (
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="h-3 w-3" /> {hoursLeft}h lab access left
            </Badge>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="h-9">
            <TabsTrigger value="default" className="text-xs gap-1.5"><LayoutGrid className="h-3.5 w-3.5" /> {isSelfPaced ? "Overview" : "Default"}</TabsTrigger>
            <TabsTrigger value="content" className="text-xs gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Content View</TabsTrigger>
            <TabsTrigger value="lab" className="text-xs gap-1.5"><Terminal className="h-3.5 w-3.5" /> Lab View</TabsTrigger>
            <TabsTrigger value="meetings" className="text-xs gap-1.5"><Video className="h-3.5 w-3.5" /> Meetings</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs gap-1.5"><StickyNote className="h-3.5 w-3.5" /> Notes</TabsTrigger>
            <TabsTrigger value="materials" className="text-xs gap-1.5"><FileText className="h-3.5 w-3.5" /> Materials</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mode Notice */}
      {isSelfPaced ? (
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <BookOpen className="h-3.5 w-3.5" />
            Self-paced course — work through lessons on your schedule. Lab time is metered.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Hours remaining</span>
            <div className="w-32"><Progress value={Math.min(100, (hoursLeft / 120) * 100)} className="h-1.5" /></div>
            <span className="font-semibold tabular-nums">{hoursLeft}h</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-destructive/5 border border-destructive/10 text-xs text-destructive">
          <Radio className="h-3 w-3 animate-pulse" />
          This session is being recorded. Recording will be available within 24 hours.
        </div>
      )}

      {/* Trainer-pushed Assessment Banner (VILT only) */}
      {!isSelfPaced && pushedAssessment && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30"
        >
          <div className="h-9 w-9 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Instructor pushed a {pushedAssessment.kind}</span>
              <Badge className="bg-primary/15 text-primary text-[10px]">Live</Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate">{pushedAssessment.title}</p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => toast.success(`Starting ${pushedAssessment.kind}…`)}>
            <Play className="h-3.5 w-3.5" /> Start now
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setPushedAssessment(null)}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      )}


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
        <ResizablePanelGroup direction="horizontal" className="min-h-[820px]">
          {!labExpanded && (
            <>
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="h-full pr-2">
                  <Card className="overflow-hidden h-full">
                    <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Course Content</span>
                        <Badge variant="outline" className="text-[10px]">Synced with instructor</Badge>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                    </div>
                    <div className="h-[calc(100%-44px)]"><CourseContentPanel course={selectedCourse} currentLessonId={currentLesson?.id} /></div>
                  </Card>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          <ResizablePanel defaultSize={labExpanded ? 100 : 50} minSize={25}>
            <div className="h-full pl-2">
              <Card className="h-full overflow-hidden flex flex-col">
                {/* VM Tabs */}
                <Tabs defaultValue="vm-web" className="shrink-0">
                  <div className="flex items-center justify-between border-b border-border px-3 py-1.5 gap-2">
                    <TabsList className="h-8 bg-muted/50">
                      {[
                        { id: "vm-web", name: "Web VM" },
                        { id: "vm-db", name: "DB VM" },
                        { id: "vm-app", name: "App VM" },
                      ].map((v) => (
                        <TabsTrigger key={v.id} value={v.id} className="text-[11px] h-6 gap-1.5">
                          <Monitor className="h-3 w-3" /> {v.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setLabExpanded(!labExpanded)}>
                      {labExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </Tabs>
                <div className="flex-1 min-h-0"><ConsolePanel terminalInput={terminalInput} setTerminalInput={setTerminalInput} /></div>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {/* ===== CONTENT VIEW ===== */}
      {viewMode === "content" && (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{currentLesson?.title ?? selectedCourse.name} — Lesson Material</span>
            <Badge variant="outline" className="text-[10px] ml-auto">Current</Badge>
          </div>
          <ScrollArea className="h-[760px]">
            <div className="p-6 max-w-3xl space-y-4">
              <h2 className="text-lg font-semibold">{currentLesson?.title ?? selectedCourse.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentLesson?.body ?? selectedCourse.description}
              </p>
              <h3 className="text-sm font-semibold mt-4">Course focus</h3>
              <p className="text-xs text-muted-foreground">{selectedCourse.category} · {selectedCourse.totalHours}h total · {selectedCourse.modules} lessons</p>
              <h3 className="text-sm font-semibold mt-4">Next step</h3>
              <p className="text-xs text-muted-foreground">Continue from the highlighted lesson in the course outline below.</p>
              {isSelfPaced && (
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
                  Self-paced access is active. You can move through lessons independently with {hoursLeft}h lab access remaining.
                </div>
              )}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <h4 className="text-xs font-semibold mb-1">Module list</h4>
                  <CourseContentPanel course={selectedCourse} currentLessonId={currentLesson?.id} />
                </div>
                <div className="p-3 rounded-lg border border-primary/30 bg-primary/5">
                  <h4 className="text-xs font-semibold mb-1">Try it in your lab</h4>
                  <p className="text-[11px] text-muted-foreground mb-2">Switch to the Lab view to launch the console for this lesson.</p>
                  <Badge className="bg-primary/10 text-primary text-[10px]">Hands-on</Badge>
                </div>
              </div>
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* ===== LAB VIEW ===== */}
      {viewMode === "lab" && (
        <ResizablePanelGroup direction="horizontal" className="min-h-[760px]">
          <ResizablePanel defaultSize={70} minSize={30}>
          <div className="h-full pr-2 flex gap-2">
            {/* Left VM switcher rail */}
            <div className="w-14 shrink-0 rounded-xl border border-border bg-card/50 backdrop-blur p-1.5 flex flex-col items-center gap-1.5">
              <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">VMs</div>
              {[
                { id: "vm-web", name: "Web", short: "W", active: true },
                { id: "vm-db", name: "DB", short: "D", active: false },
                { id: "vm-app", name: "App", short: "A", active: false },
                { id: "vm-bastion", name: "Bastion", short: "B", active: false },
              ].map((v) => (
                <TooltipProvider key={v.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toast.success(`Switched to ${v.name} VM`)}
                        className={cn(
                          "h-10 w-10 rounded-lg flex flex-col items-center justify-center transition-all relative",
                          v.active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted hover:bg-muted/70 text-foreground"
                        )}
                      >
                        <Monitor className="h-3.5 w-3.5" />
                        <span className="text-[9px] mt-0.5 font-medium">{v.short}</span>
                        {v.active && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-success rounded-full ring-2 ring-card" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p className="text-xs">{v.name} VM</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toast.info("VM picker coming soon")}
                      className="h-10 w-10 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/40 flex items-center justify-center mt-auto"
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right"><p className="text-xs">All VMs</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Console — primary */}
            <Card className="overflow-hidden h-full flex-1">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold">Lab Console</span>
                  <Badge className="bg-success/10 text-success text-[10px]">● Web VM</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1"><Save className="h-3.5 w-3.5" /> Snapshot</Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1"><RotateCw className="h-3.5 w-3.5" /> Restart</Button>
                </div>
              </div>
              <div className="h-[700px]"><ConsolePanel terminalInput={terminalInput} setTerminalInput={setTerminalInput} /></div>
            </Card>
          </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={labRailCollapsed ? 6 : 30} minSize={4} maxSize={50}>
          <div className="h-full pl-2">
          {/* Right rail: lab instructions / VM info */}
          <Card className="overflow-hidden flex flex-col h-full">
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
          </ResizablePanel>
        </ResizablePanelGroup>
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
            {!notesRailCollapsed && <div className="h-[640px]"><CourseContentPanel course={selectedCourse} currentLessonId={currentLesson?.id} /></div>}
          </Card>
        </div>
      )}

      {/* ===== MEETINGS VIEW ===== */}
      {viewMode === "meetings" && <MeetingsPanel batchId={selectedCourse.batchId} batchName={selectedCourse.batch} />}

      {/* ===== MATERIALS VIEW ===== */}
      {viewMode === "materials" && <MaterialsPanel />}
    </div>
  );
}

/* ===== Materials Panel (student view) ===== */
const materialTypeMeta: Record<Material["type"], { label: string; cls: string; icon: any }> = {
  video: { label: "Video", cls: "text-rose-600 bg-rose-50", icon: Video },
  document: { label: "Document", cls: "text-blue-600 bg-blue-50", icon: FileText },
  link: { label: "Link", cls: "text-violet-600 bg-violet-50", icon: Link2 },
  slide: { label: "Slides", cls: "text-amber-600 bg-amber-50", icon: FileText },
  image: { label: "Image", cls: "text-emerald-600 bg-emerald-50", icon: ImageIcon },
  other: { label: "File", cls: "text-slate-600 bg-slate-100", icon: FileText },
};

function MaterialsPanel() {
  const batches = useBatchStore((s) => s.batches);
  const items = batches.flatMap((b) => (b.materials ?? []).map((m) => ({ ...m, batchName: b.name, batchId: b.id })));
  const [q, setQ] = useState("");
  const filtered = items.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Materials shared by your trainer</span>
          <Badge variant="outline" className="text-[10px]">{filtered.length}</Badge>
        </div>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="h-8 w-56" />
      </div>
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No materials shared yet. Your trainer can upload videos, slides, documents, or links from the batch page.
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {filtered.map((m) => {
              const meta = materialTypeMeta[m.type];
              const Icon = meta.icon;
              return (
                <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5 hover:bg-muted/40 transition">
                  <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${meta.cls}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <Badge variant="outline" className="text-[10px] uppercase">{meta.label}</Badge>
                    </div>
                    {m.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{m.batchName} · {m.uploadedAt}</p>
                  </div>
                  {m.type === "link" ? <ExternalLink className="h-3.5 w-3.5 text-muted-foreground mt-1" /> : <Download className="h-3.5 w-3.5 text-muted-foreground mt-1" />}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

/* ===== Meetings Panel (student view inside Learning Centre) ===== */
/* Shows only today's meeting(s) for the current batch with a Join button. */
function MeetingsPanel({ batchId, batchName }: { batchId?: string; batchName?: string }) {
  const meetings = useMeetingStore((s) => s.meetings);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const todays = meetings.filter((m) => {
    if (m.status === "ended") return false;
    const matchBatch = batchId ? m.batchId === batchId : true;
    if (!matchBatch) return false;
    const t = new Date(m.scheduledAt);
    return t >= today && t < tomorrow;
  }).sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));

  if (todays.length === 0) {
    return (
      <Card className="p-10 text-center">
        <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm font-medium">No meeting scheduled for today</p>
        <p className="text-xs text-muted-foreground mt-1">
          {batchName ? `Nothing on the agenda for ${batchName} today.` : "Check back later."}
        </p>
      </Card>
    );
  }

  const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Radio className="h-3.5 w-3.5 text-destructive animate-pulse" />
        <h3 className="text-sm font-semibold">Today's session{todays.length > 1 ? "s" : ""}</h3>
        <Badge variant="secondary" className="text-[10px]">{batchName ?? "Batch"}</Badge>
      </div>
      {todays.map((m) => {
        const isLive = m.status === "live";
        return (
          <Card key={m.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{m.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {fmtTime(m.scheduledAt)} · {m.durationMins}m</span>
                <span>· {m.trainerName ?? "Trainer"}</span>
              </div>
            </div>
            <Button
              size="sm"
              disabled={!isLive}
              onClick={() => {
                toast("BBB integration pending — opening room…");
                window.open(m.joinUrl, "_blank");
              }}
            >
              <Play className="h-3.5 w-3.5 mr-1.5" />
              {isLive ? "Join Now" : `Starts ${fmtTime(m.scheduledAt)}`}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
