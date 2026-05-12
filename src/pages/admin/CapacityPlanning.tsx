import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useBatchStore } from "@/stores/batchStore";
import { TrendingUp, AlertTriangle, Plus, Cpu, MemoryStick, HardDrive, Sparkles, Zap, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const chartStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 };

const nodeCapacity = [
  { node: "compute-mumbai-1", cpuTotal: 64, cpuUsed: 45, ramTotal: 256, ramUsed: 192, stress: 70 },
  { node: "compute-mumbai-2", cpuTotal: 64, cpuUsed: 35, ramTotal: 256, ramUsed: 160, stress: 55 },
  { node: "compute-mumbai-3", cpuTotal: 64, cpuUsed: 52, ramTotal: 256, ramUsed: 225, stress: 82 },
  { node: "compute-virginia-1", cpuTotal: 64, cpuUsed: 29, ramTotal: 256, ramUsed: 128, stress: 45 },
  { node: "gpu-mumbai-1", cpuTotal: 64, cpuUsed: 58, ramTotal: 256, ramUsed: 236, stress: 90 },
];

const projectedData = [
  { week: "W1", current: 218, projected: 218, capacity: 400 },
  { week: "W2", current: 225, projected: 230, capacity: 400 },
  { week: "W3", current: 0, projected: 245, capacity: 400 },
  { week: "W4", current: 0, projected: 285, capacity: 400 },
  { week: "W5", current: 0, projected: 340, capacity: 400 },
  { week: "W6", current: 0, projected: 410, capacity: 400 },
];

export default function CapacityPlanning() {
  const { batches } = useBatchStore();

  const pendingProvisions = useMemo(() => {
    const list: { batchId: string; batchName: string; status: string; participants: number; vcpu: number; ram: number; storage: number; suggestedNode: string }[] = [];
    batches.forEach((b) => {
      const vmsNeeded = b.participants.length;
      if (vmsNeeded === 0) return;
      const cpu = 2;
      const ram = 4;
      const disk = 30;
      list.push({
        batchId: b.id,
        batchName: b.name,
        status: b.status,
        participants: vmsNeeded,
        vcpu: vmsNeeded * cpu,
        ram: vmsNeeded * ram,
        storage: vmsNeeded * disk,
        suggestedNode: nodeCapacity.slice().sort((a, b) => a.stress - b.stress)[0].node,
      });
    });
    return list;
  }, [batches]);

  const totals = pendingProvisions.reduce((acc, p) => ({
    vcpu: acc.vcpu + p.vcpu, ram: acc.ram + p.ram, storage: acc.storage + p.storage, vms: acc.vms + p.participants,
  }), { vcpu: 0, ram: 0, storage: 0, vms: 0 });

  const totalAvailable = { vcpu: 320, ram: 1280, storage: 20000 };
  const headroom = {
    vcpu: Math.max(0, totalAvailable.vcpu - totals.vcpu),
    ram: Math.max(0, totalAvailable.ram - totals.ram),
    storage: Math.max(0, totalAvailable.storage - totals.storage),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Capacity Planning</h1>
        <p className="text-muted-foreground text-sm mt-1">Forecast, plan, and orchestrate platform capacity</p>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending VMs to Provision", value: totals.vms, icon: Server, color: "text-primary" },
          { label: "vCPU Demand", value: `${totals.vcpu}`, icon: Cpu, color: "text-primary", sub: `${totalAvailable.vcpu} available` },
          { label: "RAM Demand", value: `${totals.ram} GB`, icon: MemoryStick, color: "text-primary", sub: `${totalAvailable.ram} GB available` },
          { label: "Capacity Health", value: headroom.vcpu > 50 ? "Healthy" : headroom.vcpu > 0 ? "Tight" : "Critical", icon: Sparkles, color: headroom.vcpu > 50 ? "text-success" : headroom.vcpu > 0 ? "text-warning" : "text-destructive" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}><k.icon className="h-4 w-4" /></div>
              <div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                {k.sub && <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Forecast vs Capacity */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4" /> 6-Week Forecast vs Capacity Ceiling</CardTitle>
          <CardDescription className="text-xs">Projected VM count crosses capacity in W6 — plan node additions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={projectedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" />
              <Line type="monotone" dataKey="projected" stroke="hsl(var(--chart-3))" strokeWidth={2} strokeDasharray="5 5" name="Projected" />
              <Line type="monotone" dataKey="capacity" stroke="hsl(var(--destructive))" strokeWidth={1.5} strokeDasharray="3 3" name="Ceiling" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Planned Provisioning Allocation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Planned Provisioning Allocation</CardTitle>
          <CardDescription className="text-xs">Where the next batch VMs will land based on least-stressed strategy</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Batch</TableHead><TableHead className="text-right">VMs</TableHead>
              <TableHead className="text-right">vCPU</TableHead><TableHead className="text-right">RAM</TableHead>
              <TableHead className="text-right">Storage</TableHead><TableHead>Status</TableHead>
              <TableHead>Suggested Node</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {pendingProvisions.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No pending provisioning</TableCell></TableRow>
              ) : pendingProvisions.map((p) => (
                <TableRow key={p.batchId}>
                  <TableCell className="text-sm font-medium">{p.batchName}</TableCell>
                  <TableCell className="text-sm text-right">{p.participants}</TableCell>
                  <TableCell className="text-sm text-right">{p.vcpu}</TableCell>
                  <TableCell className="text-sm text-right">{p.ram} GB</TableCell>
                  <TableCell className="text-sm text-right">{p.storage} GB</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs capitalize">{p.status}</Badge></TableCell>
                  <TableCell className="text-xs font-mono">{p.suggestedNode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Node Stress Bar */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Node Stress Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={nodeCapacity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="node" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartStyle} />
              <Bar dataKey="stress" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Stress %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-warning/30 bg-warning/[0.03]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Planning Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {headroom.vcpu < 50 && (
            <div className="flex items-start gap-2"><Plus className="h-4 w-4 text-warning mt-0.5" /> <span>vCPU headroom is below 50. Provision <b>1 additional compute node</b> in ap-south-1 before W5.</span></div>
          )}
          {nodeCapacity.some((n) => n.stress > 85) && (
            <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-destructive mt-0.5" /> <span>Node <b>gpu-mumbai-1</b> at 90% stress — migrate 3 VMs to compute-virginia-1.</span></div>
          )}
          <div className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-primary mt-0.5" /> <span>Use bin-pack strategy for short-lived batches to free up nodes for upcoming large cohorts.</span></div>
        </CardContent>
      </Card>

      {/* Resource Totals */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Resource</TableHead><TableHead className="text-right">Demand</TableHead>
              <TableHead className="text-right">Available</TableHead><TableHead className="text-right">Headroom</TableHead>
              <TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {[
                { res: "vCPU", demand: totals.vcpu, avail: totalAvailable.vcpu, head: headroom.vcpu },
                { res: "RAM (GB)", demand: totals.ram, avail: totalAvailable.ram, head: headroom.ram },
                { res: "Storage (GB)", demand: totals.storage, avail: totalAvailable.storage, head: headroom.storage },
              ].map((r) => {
                const pct = (r.demand / r.avail) * 100;
                return (
                  <TableRow key={r.res}>
                    <TableCell className="text-sm font-medium">{r.res}</TableCell>
                    <TableCell className="text-sm text-right">{r.demand.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right">{r.avail.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-right">{r.head.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", pct > 90 ? "bg-destructive/10 text-destructive" : pct > 70 ? "bg-warning/10 text-warning" : "bg-success/10 text-success")}>
                        {pct > 90 ? "Critical" : pct > 70 ? "Tight" : "Healthy"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
