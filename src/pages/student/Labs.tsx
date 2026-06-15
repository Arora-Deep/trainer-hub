import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Monitor, Clock, ExternalLink, Power, RotateCcw, Terminal, Download,
  Activity, Copy, Check, Timer, Search, Cpu, MemoryStick, HardDrive,
  PlayCircle, AlertTriangle, Snowflake, Camera, Radio, Info,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { studentLabs } from "@/data/studentMockData";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { FlaskConical } from "lucide-react";

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

export default function StudentLabs() {
  const [search, setSearch] = useState("");
  const [batch, setBatch] = useState<string>("all");
  const [mode, setMode] = useState<string>("all");
  const [tab, setTab] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const batches = useMemo(() => Array.from(new Set(studentLabs.map((l) => l.batch))), []);

  // An "active" lab is a course-persistent VM (always available) or a currently-running lesson lab.
  const isActive = (l: typeof studentLabs[number]) =>
    l.accessKind === "course-persistent" || l.status === "running";

  const filtered = useMemo(
    () =>
      studentLabs.filter((l) => {
        if (!showAll && !isActive(l)) return false;
        if (tab !== "all" && l.status !== tab) return false;
        if (batch !== "all" && l.batch !== batch) return false;
        if (mode !== "all" && l.deliveryMode !== mode) return false;
        if (search && !l.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [tab, batch, mode, search, showAll]
  );

  const running = studentLabs.filter((l) => l.status === "running").length;
  const persistent = studentLabs.filter((l) => l.accessKind === "course-persistent").length;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="cyan"
        eyebrow="Active Labs"
        icon={FlaskConical}
        title={<>Your live VMs. <span className="text-white/95">Right now.</span></>}
        description="Only the labs you can use right now — always-on course VMs and active lesson sessions."
        stats={[
          { icon: Activity, label: "Running", value: running },
          { icon: Monitor, label: "Always-on", value: persistent },
          { icon: Timer, label: "Total active", value: studentLabs.filter(isActive).length },
        ]}
      />



      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search labs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={batch} onValueChange={setBatch}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Batch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All batches</SelectItem>
            {batches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All modes</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="self-paced">Self-paced</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="running" className="text-xs">Running</TabsTrigger>
            <TabsTrigger value="stopped" className="text-xs">Stopped</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant={showAll ? "default" : "outline"} size="sm" onClick={() => setShowAll((v) => !v)} className="ml-auto text-xs">
          {showAll ? "Active only" : "Show all labs"}
        </Button>
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((lab) => {
          const isSelfPaced = lab.deliveryMode === "self-paced";
          const remainingHrs = (lab.totalAccessHours ?? 0) - (lab.usedAccessHours ?? 0);
          return (
            <motion.div key={lab.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={lab.status === "running" ? "border-success/30" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <Link to={`/student/labs/${lab.id}`} className="flex items-center gap-3 group">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${lab.status === "running" ? "bg-success/10" : "bg-muted"}`}>
                        <Monitor className={`h-5 w-5 ${lab.status === "running" ? "text-success" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{lab.name}</h3>
                        <p className="text-xs text-muted-foreground">{lab.template} · {lab.batch}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      {lab.accessKind === "course-persistent" ? (
                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-0">Always available</Badge>
                      ) : (
                        <Badge className="text-[10px] bg-amber-500/10 text-amber-600 border-0">Lesson lab</Badge>
                      )}
                      <Badge variant="secondary" className={`text-xs capitalize ${statusColors[lab.status]}`}>
                        {lab.status === "running" && "● "}{lab.status}
                      </Badge>
                    </div>
                  </div>


                  {lab.status === "running" && (
                    <>
                      {isSelfPaced && lab.totalAccessHours ? (
                        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-muted-foreground flex items-center gap-1"><Timer className="h-3 w-3" /> Lab time</span>
                            <span className="font-medium">
                              <span className="text-foreground">{lab.usedAccessHours ?? 0}h used</span>
                              <span className="mx-1 text-muted-foreground">·</span>
                              <span className="text-foreground">{remainingHrs}h left</span>
                              <span className="text-muted-foreground"> / {lab.totalAccessHours}h</span>
                            </span>
                          </div>
                          <Progress value={((lab.usedAccessHours ?? 0) / lab.totalAccessHours) * 100} className="h-1.5" />
                        </div>
                      ) : lab.deliveryMode === "live" ? (
                        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Radio className="h-3 w-3 text-destructive" /> Live training VM
                          </span>
                          <span className="font-medium">Available till {lab.availableUntil ?? "batch end"}</span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lab.timeRemaining}</span>
                        <span>IP: {lab.ip}</span>
                        <span>Up: {lab.uptime}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 flex-wrap">
                        <Button size="sm" asChild className="gap-1.5">
                          <Link to={`/student/labs/${lab.id}`}><ExternalLink className="h-3.5 w-3.5" /> Open Console</Link>
                        </Button>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1.5"><Terminal className="h-3.5 w-3.5" /> Connect</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80 p-4 space-y-3">
                            <h4 className="text-xs font-semibold">Connection details</h4>
                            <div className="space-y-1.5 text-xs">
                              <Row label="IP" value={lab.ip} onCopy={() => copy(lab.ip, "IP")} copied={copied === "IP"} />
                              <Row label="User" value={lab.username} onCopy={() => copy(lab.username, "User")} copied={copied === "User"} />
                              <Row label="Password" value={"•".repeat(lab.password.length)} onCopy={() => copy(lab.password, "Password")} copied={copied === "Password"} />
                              <Row label="SSH Port" value={String(lab.sshPort)} />
                            </div>
                            <Separator />
                            <div>
                              <p className="text-[10px] text-muted-foreground mb-1">SSH command</p>
                              <div className="flex items-center gap-2 bg-muted rounded p-2">
                                <code className="text-[10px] flex-1">ssh {lab.username}@{lab.ip} -p {lab.sshPort}</code>
                                <button onClick={() => copy(`ssh ${lab.username}@${lab.ip} -p ${lab.sshPort}`, "SSH")}>
                                  {copied === "SSH" ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                                </button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1.5"><Power className="h-3.5 w-3.5" /> Actions</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <ActionItem icon={Power} label="Stop VM" onClick={() => toast.success("Stop requested")} />
                            <ActionItem icon={RotateCcw} label="Restart VM" onClick={() => toast.success("Restart requested")} />
                            <ActionItem icon={Snowflake} label="Reset to snapshot" onClick={() => toast.success("Reset queued")} />
                            <ActionItem icon={Camera} label="Take snapshot" onClick={() => toast.success("Snapshot started")} />
                            <ActionItem icon={Timer} label={isSelfPaced ? "Extend hours" : "Extend time"} onClick={() => toast.success("Request sent")} />
                            <ActionItem icon={Download} label="Download logs" onClick={() => toast.success("Logs downloading")} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  )}

                  {lab.status === "stopped" && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-muted-foreground">Lab is currently stopped {isSelfPaced && "· on-demand"}</p>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Starting lab...")}>
                        <PlayCircle className="h-3.5 w-3.5" /> Start Lab
                      </Button>
                    </div>
                  )}

                  {lab.status === "completed" && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-muted-foreground">Completed · {lab.uptime}</p>
                      <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Download Logs</Button>
                    </div>
                  )}

                  {lab.status === "failed" && (
                    <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-destructive/5">
                      <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Provisioning failed</p>
                      <Button size="sm" variant="outline" className="gap-1.5"><RotateCcw className="h-3.5 w-3.5" /> Retry</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="md:col-span-2"><CardContent className="py-12 text-center text-sm text-muted-foreground">No labs match your filters.</CardContent></Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, onCopy, copied }: { label: string; value: string; onCopy?: () => void; copied?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {onCopy ? (
        <button onClick={onCopy} className="flex items-center gap-1 font-mono">
          {value} {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
        </button>
      ) : (
        <span className="font-mono">{value}</span>
      )}
    </div>
  );
}

function ActionItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded hover:bg-muted transition-colors">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {label}
    </button>
  );
}
