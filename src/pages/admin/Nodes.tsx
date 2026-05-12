import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Wrench, RotateCcw, Eye, Plus, Cpu, MemoryStick, HardDrive, Activity, Network,
  Server, Layers, Boxes, Sparkles, AlertTriangle, Zap, Search, Database, Settings as Cog,
} from "lucide-react";

type NodeStatus = "healthy" | "warning" | "critical" | "maintenance";

interface DiskInfo {
  id: string;
  name: string;
  type: "NVMe" | "SSD" | "HDD";
  sizeGB: number;
  usedGB: number;
  iops: number;
  health: "healthy" | "degraded" | "failed";
}

interface NodeInfo {
  id: string;
  name: string;
  cluster: string;
  region: string;
  cpuCores: number;
  cpuUsed: number;
  ramGB: number;
  ramUsed: number;
  storageGB: number;
  storageUsed: number;
  vms: number;
  status: NodeStatus;
  lastHeartbeat: string;
  role: "compute" | "gpu" | "storage";
  taint?: string;
  disks: DiskInfo[];
}

const initialClusters = [
  { id: "cls-mum", name: "ap-south-1 / Mumbai", region: "Mumbai", nodes: 4, totalVCPU: 256, totalRAM: 1024, status: "healthy" as const },
  { id: "cls-vir", name: "us-east-1 / Virginia", region: "Virginia", nodes: 2, totalVCPU: 128, totalRAM: 512, status: "healthy" as const },
  { id: "cls-gpu", name: "ap-south-1 / GPU Pool", region: "Mumbai", nodes: 1, totalVCPU: 64, totalRAM: 256, status: "warning" as const },
  { id: "cls-eu", name: "eu-west-1 / Ireland", region: "Ireland", nodes: 1, totalVCPU: 32, totalRAM: 128, status: "warning" as const },
];

const initialNodes: NodeInfo[] = [
  {
    id: "n1", name: "compute-mumbai-1", cluster: "cls-mum", region: "Mumbai",
    cpuCores: 64, cpuUsed: 70, ramGB: 256, ramUsed: 75, storageGB: 4000, storageUsed: 60,
    vms: 45, status: "healthy", lastHeartbeat: "30 sec ago", role: "compute",
    disks: [
      { id: "d1", name: "nvme0", type: "NVMe", sizeGB: 2000, usedGB: 1200, iops: 120000, health: "healthy" },
      { id: "d2", name: "ssd-pool-a", type: "SSD", sizeGB: 2000, usedGB: 1200, iops: 45000, health: "healthy" },
    ],
  },
  {
    id: "n2", name: "compute-mumbai-2", cluster: "cls-mum", region: "Mumbai",
    cpuCores: 64, cpuUsed: 55, ramGB: 256, ramUsed: 62, storageGB: 4000, storageUsed: 48,
    vms: 38, status: "healthy", lastHeartbeat: "25 sec ago", role: "compute",
    disks: [
      { id: "d3", name: "nvme0", type: "NVMe", sizeGB: 2000, usedGB: 980, iops: 120000, health: "healthy" },
      { id: "d4", name: "ssd-pool-a", type: "SSD", sizeGB: 2000, usedGB: 950, iops: 45000, health: "healthy" },
    ],
  },
  {
    id: "n3", name: "compute-mumbai-3", cluster: "cls-mum", region: "Mumbai",
    cpuCores: 64, cpuUsed: 82, ramGB: 256, ramUsed: 88, storageGB: 4000, storageUsed: 72,
    vms: 52, status: "warning", lastHeartbeat: "1 min ago", role: "compute",
    disks: [{ id: "d5", name: "ssd-pool-a", type: "SSD", sizeGB: 4000, usedGB: 2880, iops: 45000, health: "healthy" }],
  },
  {
    id: "n4", name: "compute-virginia-1", cluster: "cls-vir", region: "Virginia",
    cpuCores: 64, cpuUsed: 45, ramGB: 256, ramUsed: 50, storageGB: 4000, storageUsed: 40,
    vms: 28, status: "healthy", lastHeartbeat: "20 sec ago", role: "compute",
    disks: [{ id: "d6", name: "ssd-pool-b", type: "SSD", sizeGB: 4000, usedGB: 1600, iops: 50000, health: "healthy" }],
  },
  {
    id: "n5", name: "gpu-mumbai-1", cluster: "cls-gpu", region: "Mumbai",
    cpuCores: 64, cpuUsed: 90, ramGB: 256, ramUsed: 92, storageGB: 4000, storageUsed: 65,
    vms: 15, status: "critical", lastHeartbeat: "45 sec ago", role: "gpu",
    disks: [{ id: "d7", name: "nvme-gpu", type: "NVMe", sizeGB: 4000, usedGB: 2600, iops: 150000, health: "degraded" }],
  },
  {
    id: "n6", name: "storage-eu-west-1", cluster: "cls-eu", region: "Ireland",
    cpuCores: 32, cpuUsed: 30, ramGB: 128, ramUsed: 65, storageGB: 20000, storageUsed: 82,
    vms: 18, status: "warning", lastHeartbeat: "40 sec ago", role: "storage",
    disks: [
      { id: "d8", name: "hdd-bulk-1", type: "HDD", sizeGB: 10000, usedGB: 8200, iops: 8000, health: "degraded" },
      { id: "d9", name: "hdd-bulk-2", type: "HDD", sizeGB: 10000, usedGB: 8200, iops: 8000, health: "healthy" },
    ],
  },
];

const statusColors: Record<NodeStatus, string> = {
  healthy: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
  maintenance: "bg-muted text-muted-foreground",
};

const diskHealthColors: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  degraded: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

// Auto-provisioning scoring (lower = better)
const stressScore = (n: NodeInfo) =>
  Math.round(n.cpuUsed * 0.4 + n.ramUsed * 0.4 + n.storageUsed * 0.2);

export default function AdminNodes() {
  const [nodes, setNodes] = useState<NodeInfo[]>(initialNodes);
  const [clusters, setClusters] = useState(initialClusters);
  const [search, setSearch] = useState("");
  const [clusterFilter, setClusterFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<NodeInfo | null>(null);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [addClusterOpen, setAddClusterOpen] = useState(false);

  const [autoProvision, setAutoProvision] = useState(true);
  const [strategy, setStrategy] = useState<"least-stressed" | "round-robin" | "pack-bin">("least-stressed");
  const [overrideNodeId, setOverrideNodeId] = useState("");

  const sortedByStress = useMemo(() => [...nodes].sort((a, b) => stressScore(a) - stressScore(b)), [nodes]);
  const recommendedNode = sortedByStress[0];

  const filtered = useMemo(() => nodes.filter((n) => {
    if (clusterFilter !== "all" && n.cluster !== clusterFilter) return false;
    if (statusFilter !== "all" && n.status !== statusFilter) return false;
    if (search && !n.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [nodes, search, clusterFilter, statusFilter]);

  const handleReboot = (n: NodeInfo) => toast({ title: "Reboot Initiated", description: `${n.name} restarting` });
  const handleMaintenance = (n: NodeInfo) => {
    setNodes((ns) => ns.map((x) => x.id === n.id ? { ...x, status: x.status === "maintenance" ? "healthy" : "maintenance" } : x));
    toast({ title: n.status === "maintenance" ? "Exited Maintenance" : "Entered Maintenance", description: n.name });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Infrastructure / Nodes</h1>
          <p className="text-muted-foreground text-sm mt-1">Clusters, nodes, storage disks and provisioning policy</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5" onClick={() => setAddClusterOpen(true)}><Layers className="h-4 w-4" /> Add Cluster</Button>
          <Button className="gap-1.5" onClick={() => setAddNodeOpen(true)}><Plus className="h-4 w-4" /> Add Node</Button>
        </div>
      </div>

      {/* Provisioning Policy */}
      <Card className="border-primary/20 bg-primary/[0.02]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Auto-Provisioning Policy</CardTitle>
          <CardDescription className="text-xs">How new labs are placed onto nodes and disks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Auto-place new VMs</Label>
              <div className="flex items-center justify-between border rounded-md px-3 py-2 bg-background">
                <span className="text-sm">{autoProvision ? "Enabled" : "Disabled"}</span>
                <Switch checked={autoProvision} onCheckedChange={setAutoProvision} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Placement Strategy</Label>
              <Select value={strategy} onValueChange={(v) => setStrategy(v as typeof strategy)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="least-stressed">Least-Stressed Node (recommended)</SelectItem>
                  <SelectItem value="round-robin">Round Robin</SelectItem>
                  <SelectItem value="pack-bin">Bin-Pack (cost optimal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Manual Override (force node)</Label>
              <Select value={overrideNodeId || "none"} onValueChange={(v) => setOverrideNodeId(v === "none" ? "" : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No override</SelectItem>
                  {nodes.map((n) => <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          {autoProvision && !overrideNodeId && recommendedNode && (
            <div className="rounded-lg border bg-background p-3 flex items-center justify-between flex-wrap gap-2">
              <div className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Next VM will land on <span className="font-mono font-semibold">{recommendedNode.name}</span>
                <span className="text-muted-foreground">(stress {stressScore(recommendedNode)}%)</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">Strategy: {strategy}</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="nodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nodes" className="gap-1.5"><Server className="h-3.5 w-3.5" /> Nodes</TabsTrigger>
          <TabsTrigger value="clusters" className="gap-1.5"><Layers className="h-3.5 w-3.5" /> Clusters</TabsTrigger>
          <TabsTrigger value="disks" className="gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Storage Disks</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search node..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <Select value={clusterFilter} onValueChange={setClusterFilter}>
              <SelectTrigger className="w-[200px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clusters</SelectItem>
                {clusters.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Node</TableHead>
                    <TableHead>Cluster</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">CPU</TableHead>
                    <TableHead className="text-right">RAM</TableHead>
                    <TableHead className="text-right">Storage</TableHead>
                    <TableHead className="text-right">Stress</TableHead>
                    <TableHead className="text-right">VMs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((n) => (
                    <TableRow key={n.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(n)}>
                      <TableCell className="font-mono text-sm font-medium">{n.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{clusters.find(c => c.id === n.cluster)?.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px] capitalize">{n.role}</Badge></TableCell>
                      <TableCell className="text-sm text-right">{n.cpuUsed}%</TableCell>
                      <TableCell className="text-sm text-right">{n.ramUsed}%</TableCell>
                      <TableCell className="text-sm text-right">{n.storageUsed}%</TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-xs font-semibold", stressScore(n) > 80 ? "text-destructive" : stressScore(n) > 60 ? "text-warning" : "text-success")}>
                          {stressScore(n)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-right">{n.vms}</TableCell>
                      <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", statusColors[n.status])}>{n.status}</Badge></TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" title="Maintenance" onClick={() => handleMaintenance(n)}><Wrench className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Reboot" onClick={() => handleReboot(n)}><RotateCcw className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Details" onClick={() => setSelected(n)}><Eye className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cluster</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Nodes</TableHead>
                    <TableHead className="text-right">Total vCPU</TableHead>
                    <TableHead className="text-right">Total RAM</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clusters.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium text-sm">{c.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.region}</TableCell>
                      <TableCell className="text-sm text-right">{c.nodes}</TableCell>
                      <TableCell className="text-sm text-right">{c.totalVCPU}</TableCell>
                      <TableCell className="text-sm text-right">{c.totalRAM} GB</TableCell>
                      <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", statusColors[c.status as NodeStatus])}>{c.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disks" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disk</TableHead>
                    <TableHead>Node</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Used</TableHead>
                    <TableHead className="text-right">IOPS</TableHead>
                    <TableHead>Health</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodes.flatMap((n) => n.disks.map((d) => (
                    <TableRow key={`${n.id}-${d.id}`}>
                      <TableCell className="font-mono text-sm">{d.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{n.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{d.type}</Badge></TableCell>
                      <TableCell className="text-sm text-right">{(d.sizeGB / 1000).toFixed(1)} TB</TableCell>
                      <TableCell className="text-sm text-right">{Math.round((d.usedGB / d.sizeGB) * 100)}%</TableCell>
                      <TableCell className="text-sm text-right">{(d.iops / 1000).toFixed(0)}K</TableCell>
                      <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", diskHealthColors[d.health])}>{d.health}</Badge></TableCell>
                    </TableRow>
                  )))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Node Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent side="full" className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-mono">
                  <Server className="h-4 w-4" /> {selected.name}
                </SheetTitle>
                <SheetDescription className="text-xs">
                  {clusters.find(c => c.id === selected.cluster)?.name} · {selected.region}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-4 max-w-3xl">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Cpu, label: "CPU", value: `${selected.cpuUsed}%`, sub: `${selected.cpuCores} cores`, val: selected.cpuUsed },
                    { icon: MemoryStick, label: "RAM", value: `${selected.ramUsed}%`, sub: `${selected.ramGB} GB`, val: selected.ramUsed },
                    { icon: HardDrive, label: "Storage", value: `${selected.storageUsed}%`, sub: `${(selected.storageGB / 1000).toFixed(0)} TB`, val: selected.storageUsed },
                  ].map((m) => (
                    <div key={m.label} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground"><m.icon className="h-3.5 w-3.5" /> {m.label}</div>
                      <div className="text-2xl font-bold">{m.value}</div>
                      <Progress value={m.val} className="h-1.5 mt-2" />
                      <div className="text-[10px] text-muted-foreground mt-1">{m.sub}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Storage Disks</h3>
                  <Card><CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow>
                        <TableHead>Disk</TableHead><TableHead>Type</TableHead>
                        <TableHead className="text-right">Size</TableHead><TableHead className="text-right">Used</TableHead>
                        <TableHead className="text-right">IOPS</TableHead><TableHead>Health</TableHead>
                      </TableRow></TableHeader>
                      <TableBody>
                        {selected.disks.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-mono text-xs">{d.name}</TableCell>
                            <TableCell><Badge variant="outline" className="text-[10px]">{d.type}</Badge></TableCell>
                            <TableCell className="text-xs text-right">{(d.sizeGB / 1000).toFixed(1)} TB</TableCell>
                            <TableCell className="text-xs text-right">{Math.round((d.usedGB / d.sizeGB) * 100)}%</TableCell>
                            <TableCell className="text-xs text-right">{(d.iops / 1000).toFixed(0)}K</TableCell>
                            <TableCell><Badge variant="secondary" className={cn("text-[10px] capitalize", diskHealthColors[d.health])}>{d.health}</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent></Card>
                </div>

                <Separator />

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleReboot(selected)}><RotateCcw className="h-3 w-3" /> Reboot</Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleMaintenance(selected)}><Wrench className="h-3 w-3" /> Toggle Maintenance</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><Plus className="h-3 w-3" /> Attach Disk</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><Cog className="h-3 w-3" /> Edit Taint/Label</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Node Dialog */}
      <Dialog open={addNodeOpen} onOpenChange={setAddNodeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Node</DialogTitle>
            <DialogDescription>Register a new compute / GPU / storage node</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Node Name</Label><Input placeholder="compute-mumbai-5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Cluster</Label>
                <Select defaultValue={clusters[0].id}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{clusters.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Select defaultValue="compute">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compute">Compute</SelectItem>
                    <SelectItem value="gpu">GPU</SelectItem>
                    <SelectItem value="storage">Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">vCPUs</Label><Input type="number" defaultValue={64} /></div>
              <div className="space-y-1.5"><Label className="text-xs">RAM (GB)</Label><Input type="number" defaultValue={256} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Disk (TB)</Label><Input type="number" defaultValue={4} /></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Management IP</Label><Input placeholder="10.0.0.50" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNodeOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddNodeOpen(false); toast({ title: "Node Registered", description: "Bootstrapping..." }); }}>Add Node</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Cluster Dialog */}
      <Dialog open={addClusterOpen} onOpenChange={setAddClusterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cluster</DialogTitle>
            <DialogDescription>Define a new region / cluster scope</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Cluster Name</Label><Input placeholder="ap-south-1 / Hyderabad" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Region</Label><Input placeholder="Hyderabad" /></div>
            <div className="space-y-1.5">
              <Label className="text-xs">Default Storage Pool</Label>
              <Select defaultValue="ssd">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nvme">NVMe Pool</SelectItem>
                  <SelectItem value="ssd">SSD Pool</SelectItem>
                  <SelectItem value="hdd">HDD Pool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClusterOpen(false)}>Cancel</Button>
            <Button onClick={() => { setAddClusterOpen(false); toast({ title: "Cluster Created" }); }}>Add Cluster</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
