import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor, Clock, ExternalLink, Power, Cpu, HardDrive,
  MemoryStick, RefreshCw, Terminal, Download, Activity,
} from "lucide-react";

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
}

const labs: Lab[] = [
  { id: "1", name: "AWS VPC Lab", template: "AWS Cloud Practitioner", status: "running", timeRemaining: "1h 45m", ip: "10.0.1.42", cpu: 45, ram: 62, storage: 30, uptime: "2h 15m", batch: "Batch 12" },
  { id: "2", name: "K8s Cluster Lab", template: "Kubernetes Fundamentals", status: "running", timeRemaining: "2h 30m", ip: "10.0.2.18", cpu: 78, ram: 85, storage: 55, uptime: "1h 30m", batch: "Batch 5" },
  { id: "3", name: "Docker Lab", template: "Docker Essentials", status: "stopped", timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 20, uptime: "-", batch: "Batch 8" },
  { id: "4", name: "Terraform Lab", template: "Terraform Basics", status: "completed", timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 45, uptime: "4h 20m", batch: "Batch 12" },
  { id: "5", name: "Linux Networking Lab", template: "Linux Fundamentals", status: "failed", timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 0, uptime: "-", batch: "Batch 5" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

const UsageMeter = ({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Cpu }) => (
  <div className="flex-1">
    <div className="flex items-center justify-between text-[11px] mb-1">
      <span className="flex items-center gap-1 text-muted-foreground"><Icon className="h-3 w-3" />{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <Progress value={value} className={`h-1 ${value > 80 ? "[&>div]:bg-destructive" : value > 60 ? "[&>div]:bg-warning" : ""}`} />
  </div>
);

export default function StudentLabs() {
  const [tab, setTab] = useState("all");

  const filtered = labs.filter((l) => tab === "all" || l.status === tab);
  const running = labs.filter(l => l.status === "running").length;
  const total = labs.length;

  return (
    <div className="space-y-6">
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

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all" className="text-xs">All ({total})</TabsTrigger>
          <TabsTrigger value="running" className="text-xs">Running ({running})</TabsTrigger>
          <TabsTrigger value="stopped" className="text-xs">Stopped ({labs.filter(l => l.status === "stopped").length})</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs">Completed ({labs.filter(l => l.status === "completed").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((lab) => (
          <Card key={lab.id} className={lab.status === "running" ? "border-success/30" : ""}>
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
                  {/* Resource Usage */}
                  <div className="flex gap-4 mt-4 p-3 rounded-lg bg-muted/50">
                    <UsageMeter label="CPU" value={lab.cpu} icon={Cpu} />
                    <UsageMeter label="RAM" value={lab.ram} icon={MemoryStick} />
                    <UsageMeter label="Disk" value={lab.storage} icon={HardDrive} />
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lab.timeRemaining} left</span>
                      <span>IP: {lab.ip}</span>
                      <span>Uptime: {lab.uptime}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" className="gap-1.5 flex-1"><ExternalLink className="h-3.5 w-3.5" /> Launch Console</Button>
                    <Button size="sm" variant="outline" className="gap-1.5"><Terminal className="h-3.5 w-3.5" /> SSH</Button>
                    <Button size="sm" variant="outline" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Reset</Button>
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
                  <p className="text-xs text-destructive">Provisioning failed — contact support</p>
                  <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/30">
                    <RefreshCw className="h-3.5 w-3.5" /> Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
