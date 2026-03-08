import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Monitor, Clock, ExternalLink, Power, Cpu, HardDrive,
  MemoryStick, RefreshCw, Terminal, Download, Activity,
  Copy, Check, Timer, History, ChevronRight, AlertTriangle,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { toast } from "sonner";

/* ── Types & Data ── */
interface Lab {
  id: string;
  name: string;
  template: string;
  status: "running" | "stopped" | "completed" | "failed";
  timeRemaining: string;
  ip: string;
  cpu: number;
  ram: number;
  storage: number;
  uptime: string;
  batch: string;
  sshPort: number;
  username: string;
  lastCommands: string[];
  cpuHistory: { t: number; v: number }[];
  ramHistory: { t: number; v: number }[];
}

const generateSparkline = (base: number) =>
  Array.from({ length: 15 }, (_, i) => ({
    t: i,
    v: Math.max(5, Math.min(98, base + Math.floor((Math.random() - 0.5) * 30))),
  }));

const labs: Lab[] = [
  {
    id: "1", name: "AWS VPC Lab", template: "AWS Cloud Practitioner", status: "running",
    timeRemaining: "1h 45m", ip: "10.0.1.42", cpu: 45, ram: 62, storage: 30,
    uptime: "2h 15m", batch: "Batch 12", sshPort: 22, username: "student",
    lastCommands: ["$ aws ec2 describe-vpcs", "$ aws ec2 create-subnet --vpc-id vpc-0a1b", "$ aws ec2 describe-route-tables"],
    cpuHistory: generateSparkline(45), ramHistory: generateSparkline(62),
  },
  {
    id: "2", name: "K8s Cluster Lab", template: "Kubernetes Fundamentals", status: "running",
    timeRemaining: "2h 30m", ip: "10.0.2.18", cpu: 78, ram: 85, storage: 55,
    uptime: "1h 30m", batch: "Batch 5", sshPort: 22, username: "student",
    lastCommands: ["$ kubectl get pods -A", "$ kubectl apply -f deployment.yaml", "$ kubectl logs nginx-pod"],
    cpuHistory: generateSparkline(78), ramHistory: generateSparkline(85),
  },
  {
    id: "3", name: "Docker Lab", template: "Docker Essentials", status: "stopped",
    timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 20,
    uptime: "-", batch: "Batch 8", sshPort: 22, username: "student",
    lastCommands: [], cpuHistory: [], ramHistory: [],
  },
  {
    id: "4", name: "Terraform Lab", template: "Terraform Basics", status: "completed",
    timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 45,
    uptime: "4h 20m", batch: "Batch 12", sshPort: 22, username: "student",
    lastCommands: [], cpuHistory: [], ramHistory: [],
  },
  {
    id: "5", name: "Linux Networking Lab", template: "Linux Fundamentals", status: "failed",
    timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 0,
    uptime: "-", batch: "Batch 5", sshPort: 22, username: "student",
    lastCommands: [], cpuHistory: [], ramHistory: [],
  },
];

const pastSessions = [
  { name: "AWS VPC Lab", date: "Mar 5, 2026", duration: "1h 50m", status: "completed" },
  { name: "Docker Lab", date: "Mar 3, 2026", duration: "2h 10m", status: "completed" },
  { name: "K8s Lab", date: "Mar 1, 2026", duration: "45m", status: "terminated" },
  { name: "AWS EC2 Lab", date: "Feb 28, 2026", duration: "3h 00m", status: "completed" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

/* ── Mini Sparkline ── */
function Sparkline({ data, color }: { data: { t: number; v: number }[]; color: string }) {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={28}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={1.5} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "10px", padding: "4px 8px" }}
          formatter={(value: number) => [`${value}%`]}
          labelFormatter={() => ""}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ── Resource Meter with Sparkline ── */
function ResourceMeter({ label, value, icon: Icon, data, color }: {
  label: string; value: number; icon: typeof Cpu; data: { t: number; v: number }[]; color: string;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1 text-muted-foreground"><Icon className="h-3 w-3" />{label}</span>
        <span className={`font-medium ${value > 80 ? "text-destructive" : value > 60 ? "text-warning" : ""}`}>{value}%</span>
      </div>
      <Sparkline data={data} color={color} />
    </div>
  );
}

export default function StudentLabs() {
  const [tab, setTab] = useState("all");
  const [consoleLab, setConsoleLab] = useState<Lab | null>(null);
  const [extendLab, setExtendLab] = useState<Lab | null>(null);
  const [extendReason, setExtendReason] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = labs.filter((l) => tab === "all" || l.status === tab);
  const running = labs.filter(l => l.status === "running").length;
  const total = labs.length;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Labs</h1>
          <p className="text-muted-foreground text-sm mt-1">Access and manage your lab environments</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Activity className="h-4 w-4 text-success" />
            <span>{running} running</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span>{total} total</span>
          </div>
        </div>
      </div>

      {/* Quick Actions for running labs */}
      {running > 0 && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="py-3 flex items-center gap-3">
            <span className="text-xs font-medium text-success flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" /> {running} lab{running > 1 ? "s" : ""} running
            </span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 ml-auto">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setConsoleLab(labs.find(l => l.status === "running") || null)}>
                <Terminal className="h-3 w-3" /> Open Console
              </Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <RefreshCw className="h-3 w-3" /> Reset All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All ({total})</TabsTrigger>
            <TabsTrigger value="running" className="text-xs">Running ({running})</TabsTrigger>
            <TabsTrigger value="stopped" className="text-xs">Stopped ({labs.filter(l => l.status === "stopped").length})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed ({labs.filter(l => l.status === "completed").length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setShowHistory(!showHistory)}>
          <History className="h-3.5 w-3.5" /> {showHistory ? "Hide" : "Show"} History
        </Button>
      </div>

      {/* Lab Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((lab) => (
          <motion.div key={lab.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={lab.status === "running" ? "border-success/30" : ""}>
              <CardContent className="pt-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      lab.status === "running" ? "bg-success/10" : "bg-muted"
                    }`}>
                      <Monitor className={`h-5 w-5 ${lab.status === "running" ? "text-success" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{lab.name}</h3>
                      <p className="text-xs text-muted-foreground">{lab.template} · {lab.batch}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className={`text-xs capitalize ${statusColors[lab.status]}`}>
                    {lab.status === "running" && "● "}{lab.status}
                  </Badge>
                </div>

                {/* Running Lab Details */}
                {lab.status === "running" && (
                  <>
                    {/* Mini Console Preview */}
                    <div
                      className="bg-foreground/95 rounded-lg p-3 font-mono text-[10px] text-success/80 space-y-0.5 cursor-pointer hover:ring-1 hover:ring-success/30 transition-all"
                      onClick={() => setConsoleLab(lab)}
                    >
                      {lab.lastCommands.map((cmd, i) => (
                        <div key={i} className={cmd.startsWith("$") ? "text-success" : "text-background/60"}>{cmd}</div>
                      ))}
                      <div className="text-muted-foreground text-[9px] mt-1 flex items-center gap-1">
                        <Terminal className="h-2.5 w-2.5" /> Click to expand console
                      </div>
                    </div>

                    {/* Resource Sparklines */}
                    <div className="flex gap-4 mt-4 p-3 rounded-lg bg-muted/50">
                      <ResourceMeter label="CPU" value={lab.cpu} icon={Cpu} data={lab.cpuHistory} color="hsl(var(--primary))" />
                      <ResourceMeter label="RAM" value={lab.ram} icon={MemoryStick} data={lab.ramHistory} color="hsl(var(--warning))" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1 text-muted-foreground"><HardDrive className="h-3 w-3" />Disk</span>
                          <span className="font-medium">{lab.storage}%</span>
                        </div>
                        <Progress value={lab.storage} className="h-1 mt-3" />
                      </div>
                    </div>

                    {/* Meta with Connection Popover */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lab.timeRemaining} left</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center gap-1 hover:text-primary transition-colors underline decoration-dashed underline-offset-2">
                              IP: {lab.ip}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-4">
                            <h4 className="text-xs font-semibold mb-3">Connection Details</h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">IP Address</span>
                                <button className="flex items-center gap-1 font-mono" onClick={() => copyToClipboard(lab.ip, "IP")}>
                                  {lab.ip} {copied === "IP" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                                </button>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">SSH Port</span>
                                <span className="font-mono">{lab.sshPort}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Username</span>
                                <span className="font-mono">{lab.username}</span>
                              </div>
                              <Separator className="my-2" />
                              <div>
                                <p className="text-[10px] text-muted-foreground mb-1">SSH Command</p>
                                <div className="flex items-center gap-2 bg-muted rounded p-2">
                                  <code className="text-[10px] font-mono flex-1">ssh {lab.username}@{lab.ip} -p {lab.sshPort}</code>
                                  <button onClick={() => copyToClipboard(`ssh ${lab.username}@${lab.ip} -p ${lab.sshPort}`, "SSH")}>
                                    {copied === "SSH" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <span>Uptime: {lab.uptime}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button size="sm" className="gap-1.5 flex-1" onClick={() => setConsoleLab(lab)}>
                        <ExternalLink className="h-3.5 w-3.5" /> Launch Console
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <Terminal className="h-3.5 w-3.5" /> SSH
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setExtendLab(lab)}>
                        <Timer className="h-3.5 w-3.5" /> Extend
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5">
                        <RefreshCw className="h-3.5 w-3.5" /> Reset
                      </Button>
                    </div>
                  </>
                )}

                {lab.status === "stopped" && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">Lab is currently stopped</p>
                    <Button size="sm" variant="outline" className="gap-1.5"><Power className="h-3.5 w-3.5" /> Start Lab</Button>
                  </div>
                )}

                {lab.status === "completed" && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-muted-foreground">Completed · Total time: {lab.uptime}</p>
                    <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Download Logs</Button>
                  </div>
                )}

                {lab.status === "failed" && (
                  <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-destructive/5">
                    <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Provisioning failed — contact support</p>
                    <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30">
                      <RefreshCw className="h-3.5 w-3.5" /> Retry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Past Sessions */}
      {showHistory && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-1.5">
                <History className="h-4 w-4 text-muted-foreground" /> Past Sessions
              </h3>
              <div className="space-y-2">
                {pastSessions.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0 text-xs">
                    <span className="font-medium flex-1">{s.name}</span>
                    <span className="text-muted-foreground">{s.date}</span>
                    <span className="text-muted-foreground">{s.duration}</span>
                    <Badge variant="outline" className={`text-[10px] capitalize ${s.status === "completed" ? "text-success" : "text-warning"}`}>
                      {s.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Console Sheet */}
      <Sheet open={!!consoleLab} onOpenChange={() => setConsoleLab(null)}>
        <SheetContent side="bottom" className="h-[70vh] p-0">
          {consoleLab && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold">{consoleLab.name} — Console</span>
                  <Badge className="bg-success/10 text-success text-[10px]">● Connected</Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Cpu className="h-3 w-3" /> {consoleLab.cpu}%</span>
                  <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" /> {consoleLab.ram}%</span>
                  <span>IP: {consoleLab.ip}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {consoleLab.timeRemaining}</span>
                </div>
              </div>
              <div className="flex-1 bg-foreground/95 text-background p-4 font-mono text-xs overflow-y-auto">
                <div className="space-y-1">
                  <div className="text-success">student@{consoleLab.name.toLowerCase().replace(/ /g, "-")}:~$</div>
                  {consoleLab.lastCommands.map((cmd, i) => (
                    <div key={i} className={cmd.startsWith("$") ? "text-success" : "text-background/70"}>{cmd}</div>
                  ))}
                  <div className="text-success">$ <span className="animate-pulse">▊</span></div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-border bg-foreground/90 px-4 py-2">
                <Terminal className="h-4 w-4 text-success" />
                <input
                  type="text"
                  className="flex-1 bg-transparent text-background text-xs font-mono focus:outline-none placeholder:text-background/40"
                  placeholder="Type command..."
                />
                <Button size="sm" variant="ghost" className="h-6 px-2 text-background hover:text-background/80">
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Extension Request Dialog */}
      <Dialog open={!!extendLab} onOpenChange={() => setExtendLab(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Lab Extension</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50 text-xs">
              <p><span className="font-medium">Lab:</span> {extendLab?.name}</p>
              <p><span className="font-medium">Current Time Left:</span> {extendLab?.timeRemaining}</p>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Reason for extension</label>
              <Textarea
                placeholder="Explain why you need more time..."
                value={extendReason}
                onChange={(e) => setExtendReason(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendLab(null)}>Cancel</Button>
            <Button onClick={() => { toast.success("Extension request submitted!"); setExtendLab(null); setExtendReason(""); }}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
