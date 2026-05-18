import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Monitor, Cpu, MemoryStick, HardDrive, Power, RotateCcw, Snowflake,
  Camera, Timer, Download, Terminal, Copy, Check, Activity,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { getStudentLab } from "@/data/studentMockData";
import { toast } from "sonner";

const series = (base: number) => Array.from({ length: 20 }, (_, i) => ({ t: i, v: Math.max(5, Math.min(98, base + Math.floor((Math.random() - 0.5) * 30))) }));

export default function StudentLabDetail() {
  const { id = "" } = useParams();
  const lab = getStudentLab(id);
  const nav = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);

  if (!lab) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => nav(-1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">Lab not found.</CardContent></Card>
      </div>
    );
  }

  const isSelfPaced = lab.deliveryMode === "self-paced";
  const remaining = (lab.totalAccessHours ?? 0) - (lab.usedAccessHours ?? 0);
  const copy = (text: string, label: string) => { navigator.clipboard.writeText(text); setCopied(label); toast.success(`${label} copied`); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Labs", href: "/student/labs" }, { label: lab.name }]}
        title={lab.name}
        description={`${lab.template} · ${lab.batch}`}
        actions={
          <div className="flex items-center gap-2">
            <Badge className={lab.status === "running" ? "bg-success/10 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
              {lab.status === "running" && "● "}{lab.status}
            </Badge>
            {isSelfPaced && <Badge className="bg-amber-500/10 text-amber-600 border-0">Self-paced</Badge>}
          </div>
        }
      />

      {/* Top: Console + quick stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0 overflow-hidden">
            <div className="bg-foreground/95 aspect-video flex items-center justify-center text-success/70 font-mono text-xs relative">
              {lab.status === "running" ? (
                <div className="absolute inset-0 p-4 overflow-hidden">
                  <p className="text-success/40 text-[10px]">Connected to {lab.ip} as {lab.username}</p>
                  {lab.lastCommands.map((c, i) => <div key={i} className="text-success">{c}</div>)}
                  <div className="mt-2 inline-flex items-center"><span className="text-success">$</span><span className="ml-1 w-2 h-3 bg-success animate-pulse" /></div>
                </div>
              ) : (
                <div className="text-center">
                  <Monitor className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Console offline — start the lab to connect</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Power</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Start queued")}><Power className="h-3.5 w-3.5" /> Start</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Stop queued")}><Power className="h-3.5 w-3.5" /> Stop</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Restart queued")}><RotateCcw className="h-3.5 w-3.5" /> Restart</Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Reset queued")}><Snowflake className="h-3.5 w-3.5" /> Reset</Button>
              </div>
            </div>
            <Separator />
            <div className="text-xs space-y-1.5">
              <Row label="IP" value={lab.ip} onCopy={() => copy(lab.ip, "IP")} copied={copied === "IP"} />
              <Row label="User" value={lab.username} onCopy={() => copy(lab.username, "User")} copied={copied === "User"} />
              <Row label="Password" value={"•".repeat(lab.password.length)} onCopy={() => copy(lab.password, "Password")} copied={copied === "Password"} />
              <Row label="SSH" value={`${lab.sshPort}`} />
            </div>
            {isSelfPaced && lab.totalAccessHours && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Access remaining</span><span className="font-medium">{remaining}h / {lab.totalAccessHours}h</span></div>
                <Progress value={((lab.usedAccessHours ?? 0) / lab.totalAccessHours) * 100} className="h-1.5" />
                <Button size="sm" variant="outline" className="w-full mt-3 gap-1.5"><Timer className="h-3.5 w-3.5" /> Request more hours</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Metrics / Commands / Snapshots / Logs */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="metrics">
            <TabsList>
              <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
              <TabsTrigger value="commands" className="text-xs">Commands</TabsTrigger>
              <TabsTrigger value="snapshots" className="text-xs">Snapshots</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Session Log</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="mt-4 grid gap-4 md:grid-cols-3">
              <Metric icon={Cpu} label="CPU" value={lab.cpu} data={series(lab.cpu)} color="hsl(var(--primary))" />
              <Metric icon={MemoryStick} label="RAM" value={lab.ram} data={series(lab.ram)} color="hsl(var(--warning))" />
              <Metric icon={HardDrive} label="Disk" value={lab.storage} data={series(lab.storage)} color="hsl(var(--success))" />
            </TabsContent>

            <TabsContent value="commands" className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">Common commands for this template:</p>
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  { c: `ssh ${lab.username}@${lab.ip} -p ${lab.sshPort}`, desc: "SSH into VM" },
                  { c: `scp file ${lab.username}@${lab.ip}:~/`, desc: "Copy file to VM" },
                  { c: `sudo systemctl status nginx`, desc: "Check a service" },
                  { c: `journalctl -u nginx -f`, desc: "Tail logs" },
                ].map((row) => (
                  <div key={row.c} className="p-3 rounded-lg border border-border bg-muted/40">
                    <p className="text-[10px] text-muted-foreground mb-1">{row.desc}</p>
                    <div className="flex items-center gap-2">
                      <code className="text-[11px] flex-1 truncate">{row.c}</code>
                      <button onClick={() => copy(row.c, "Command")}><Copy className="h-3 w-3 text-muted-foreground" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="snapshots" className="mt-4 space-y-2">
              {lab.snapshots.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No snapshots yet</p>}
              {lab.snapshots.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1"><p className="text-sm font-medium">{s.name}</p><p className="text-xs text-muted-foreground">{s.createdAt} · {s.size}</p></div>
                  <Button size="sm" variant="outline" onClick={() => toast.success(`Restoring ${s.name}`)}>Restore</Button>
                </div>
              ))}
              <Button size="sm" variant="outline" className="w-full gap-1.5"><Camera className="h-3.5 w-3.5" /> Take new snapshot</Button>
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <div className="bg-foreground/95 rounded-lg p-4 font-mono text-[11px] text-success space-y-1">
                <p className="text-success/60">[Mar 4 09:12] Lab started</p>
                <p className="text-success/60">[Mar 4 09:14] User logged in via SSH</p>
                <p className="text-success/60">[Mar 4 09:30] Snapshot 'Fresh start' created</p>
                <p className="text-success/60">[Mar 4 11:02] CPU spike to 85%</p>
                <p className="text-success/60">[Mar 4 11:45] Activity check OK</p>
              </div>
              <Button size="sm" variant="outline" className="mt-3 gap-1.5"><Download className="h-3.5 w-3.5" /> Download full log</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, onCopy, copied }: { label: string; value: string; onCopy?: () => void; copied?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      {onCopy ? (
        <button onClick={onCopy} className="flex items-center gap-1 font-mono">{value} {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}</button>
      ) : <span className="font-mono">{value}</span>}
    </div>
  );
}

function Metric({ icon: Icon, label, value, data, color }: { icon: any; label: string; value: number; data: any[]; color: string }) {
  return (
    <div className="p-3 rounded-lg border border-border">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="flex items-center gap-1 text-muted-foreground"><Icon className="h-3 w-3" /> {label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <ResponsiveContainer width="100%" height={80}>
        <LineChart data={data}>
          <XAxis dataKey="t" hide /><YAxis hide domain={[0, 100]} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 10 }} formatter={(v: number) => [`${v}%`]} labelFormatter={() => ""} />
          <Line type="monotone" dataKey="v" stroke={color} dot={false} strokeWidth={1.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
