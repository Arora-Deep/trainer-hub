import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor, Video, BookOpen, MessageSquare, Users, Maximize2,
  Minimize2, Terminal, Send, ChevronRight, FileText, Play,
  Pause, Volume2, Settings, Clock, Cpu, MemoryStick,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export default function StudentLiveClass() {
  const [labExpanded, setLabExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [chatInput, setChatInput] = useState("");
  const [terminalInput, setTerminalInput] = useState("");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">AWS VPC Deep Dive</h1>
            <Badge className="bg-destructive/10 text-destructive text-[10px] animate-pulse">● LIVE</Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">AWS Cloud Practitioner — Batch 12 · Instructor: James Wilson · 15 students online</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs"><Users className="h-3 w-3" /> 15 Online</Badge>
          <Badge variant="outline" className="gap-1 text-xs"><Clock className="h-3 w-3" /> 1h 45m remaining</Badge>
          <Button variant="destructive" size="sm">Leave Session</Button>
        </div>
      </div>

      {/* Main Split View */}
      <div className={`grid gap-4 ${labExpanded ? "grid-cols-1" : "lg:grid-cols-5"}`}>
        {/* LEFT: Video/LMS Panel */}
        {!labExpanded && (
          <div className="lg:col-span-3 space-y-4">
            {/* Video / Course Content Tabs */}
            <Card className="overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <TabsList className="h-8">
                    <TabsTrigger value="video" className="text-xs gap-1.5"><Video className="h-3 w-3" /> Live Video</TabsTrigger>
                    <TabsTrigger value="content" className="text-xs gap-1.5"><BookOpen className="h-3 w-3" /> Course Content</TabsTrigger>
                    <TabsTrigger value="notes" className="text-xs gap-1.5"><FileText className="h-3 w-3" /> Notes</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Volume2 className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Settings className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>

                <TabsContent value="video" className="m-0">
                  {/* Simulated video player */}
                  <div className="aspect-video bg-foreground/5 flex items-center justify-center relative">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Play className="h-8 w-8 text-primary ml-1" />
                      </div>
                      <p className="text-sm font-medium">Live Stream — VPC Deep Dive</p>
                      <p className="text-xs text-muted-foreground mt-1">Instructor is sharing screen</p>
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
              </Tabs>
            </Card>

            {/* Chat */}
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold">Live Chat</h3>
                  <Badge variant="secondary" className="text-[10px]">15 online</Badge>
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
            {/* Lab Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Lab Console</span>
                <Badge className="bg-success/10 text-success text-[10px]">● Connected</Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost" size="icon" className="h-7 w-7"
                  onClick={() => setLabExpanded(!labExpanded)}
                >
                  {labExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>

            {/* Lab Resource Bar */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> CPU: 45%</span>
              <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" /> RAM: 62%</span>
              <span>IP: 10.0.1.42</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1h 45m left</span>
            </div>

            {/* Terminal */}
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

            {/* Terminal Input */}
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
