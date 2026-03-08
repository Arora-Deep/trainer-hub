import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Search, RotateCcw, ArrowLeftRight, Key, FileText, Cpu, MemoryStick, Globe, HardDrive, Shield, Monitor, Camera, Users } from "lucide-react";

const adminVMs = [
  { vmId: "VM-ADM-01", customer: "DevOps Academy", batch: "K8s Batch #14", student: "— Admin", node: "node-mum-01", status: "running", cpu: 12, ram: 28, lastSeen: "just now", ip: "10.0.1.10", os: "Ubuntu 22.04", disk: 22, role: "admin" as const },
  { vmId: "VM-ADM-02", customer: "Corporate L&D Co", batch: "Linux Fund. #8", student: "— Admin", node: "node-vir-01", status: "running", cpu: 8, ram: 18, lastSeen: "1 min ago", ip: "10.0.2.10", os: "CentOS 9", disk: 15, role: "admin" as const },
  { vmId: "VM-ADM-03", customer: "DevOps Academy", batch: "AWS Batch #6", student: "— Admin", node: "node-vir-01", status: "stopped", cpu: 0, ram: 0, lastSeen: "3 hours ago", ip: "10.0.2.20", os: "Amazon Linux", disk: 18, role: "admin" as const },
];

const vmInstances = [
  { vmId: "VM-2001", customer: "DevOps Academy", batch: "K8s Batch #14", student: "Alice Johnson", node: "node-mum-01", status: "running", cpu: 45, ram: 62, lastSeen: "1 min ago", ip: "10.0.1.21", os: "Ubuntu 22.04", disk: 38, role: "student" as const },
  { vmId: "VM-2002", customer: "DevOps Academy", batch: "K8s Batch #14", student: "Bob Williams", node: "node-mum-02", status: "running", cpu: 32, ram: 48, lastSeen: "2 min ago", ip: "10.0.1.22", os: "Ubuntu 22.04", disk: 25, role: "student" as const },
  { vmId: "VM-2003", customer: "Corporate L&D Co", batch: "Linux Fund. #8", student: "Carol Davis", node: "node-vir-01", status: "running", cpu: 78, ram: 85, lastSeen: "30 sec ago", ip: "10.0.2.11", os: "CentOS 9", disk: 65, role: "student" as const },
  { vmId: "VM-2004", customer: "SkillBridge Labs", batch: "K8s Batch #2", student: "David Brown", node: "node-mum-03", status: "stopped", cpu: 0, ram: 0, lastSeen: "2 hours ago", ip: "10.0.1.24", os: "Ubuntu 22.04", disk: 20, role: "student" as const },
  { vmId: "VM-2005", customer: "DataScience Bootcamp", batch: "ML Cohort #5", student: "Eva Martinez", node: "gpu-mum-01", status: "failed", cpu: 0, ram: 0, lastSeen: "1 hour ago", ip: "10.0.3.15", os: "Ubuntu 22.04", disk: 42, role: "student" as const },
  { vmId: "VM-2006", customer: "Corporate L&D Co", batch: "Linux Fund. #8", student: "Frank Lee", node: "node-vir-02", status: "running", cpu: 55, ram: 70, lastSeen: "45 sec ago", ip: "10.0.2.12", os: "CentOS 9", disk: 48, role: "student" as const },
  { vmId: "VM-2007", customer: "DevOps Academy", batch: "AWS Batch #6", student: "Grace Kim", node: "node-vir-01", status: "running", cpu: 22, ram: 40, lastSeen: "3 min ago", ip: "10.0.2.21", os: "Amazon Linux", disk: 30, role: "student" as const },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

const customers = [...new Set(vmInstances.map(v => v.customer))];
const batches = [...new Set(vmInstances.map(v => v.batch))];
const nodes = [...new Set(vmInstances.map(v => v.node))];

export default function LabInstances() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [nodeFilter, setNodeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedVM, setSelectedVM] = useState<(typeof vmInstances[0] | typeof adminVMs[0]) | null>(null);

  const applyFilters = (v: { vmId: string; customer: string; batch: string; student: string; node: string; status: string }) => {
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (customerFilter !== "all" && v.customer !== customerFilter) return false;
    if (batchFilter !== "all" && v.batch !== batchFilter) return false;
    if (nodeFilter !== "all" && v.node !== nodeFilter) return false;
    if (search && !v.vmId.toLowerCase().includes(search.toLowerCase()) && !v.student.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  };

  const filteredAdmin = adminVMs.filter(applyFilters);
  const filtered = vmInstances.filter(applyFilters);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lab Instances</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time VM monitoring and management</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search VM ID / Student..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">🟢 Running</SelectItem>
                <SelectItem value="stopped">🟡 Stopped</SelectItem>
                <SelectItem value="failed">🔴 Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Customer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={nodeFilter} onValueChange={setNodeFilter}>
              <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Node" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Nodes</SelectItem>
                {nodes.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admin VMs Section */}
      {filteredAdmin.length > 0 && (
        <Card className="border-primary/30 bg-primary/[0.02]">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Admin VMs
              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">{filteredAdmin.length} Master</Badge>
            </CardTitle>
            <CardDescription className="text-xs">Golden image VMs used for snapshotting and cloning to students</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/[0.03]">
                  <TableHead>VM ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead className="text-right">CPU</TableHead>
                  <TableHead className="text-right">RAM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdmin.map(v => {
                  const sc = statusConfig[v.status] || statusConfig.stopped;
                  return (
                    <TableRow key={v.vmId} className="group bg-primary/[0.02]">
                      <TableCell>
                        <button className="text-sm font-mono font-semibold text-primary hover:underline" onClick={() => setSelectedVM(v)}>{v.vmId}</button>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] gap-1 border-primary/30 text-primary">
                          <Shield className="h-2.5 w-2.5" /> Admin
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.batch}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.customer}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{v.node}</TableCell>
                      <TableCell className="text-sm text-right">{v.cpu}%</TableCell>
                      <TableCell className="text-sm text-right">{v.ram}%</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" title="Open Console"><Monitor className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Take Snapshot"><Camera className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Restart"><RotateCcw className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="View Logs"><FileText className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Student VMs Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          Student VMs ({filtered.length})
        </h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>VM ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead className="text-right">CPU</TableHead>
                  <TableHead className="text-right">RAM</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-12">No VMs match your filters</TableCell></TableRow>
                )}
                {filtered.map(v => {
                  const sc = statusConfig[v.status];
                  return (
                    <TableRow key={v.vmId} className="group">
                      <TableCell>
                        <button className="text-sm font-mono text-primary hover:underline" onClick={() => setSelectedVM(v)}>{v.vmId}</button>
                      </TableCell>
                      <TableCell className="text-sm">{v.student}</TableCell>
                      <TableCell className="text-sm">{v.batch}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.customer}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{v.node}</TableCell>
                      <TableCell className="text-sm text-right">{v.cpu}%</TableCell>
                      <TableCell className="text-sm text-right">{v.ram}%</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.lastSeen}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" title="Restart"><RotateCcw className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Replace"><ArrowLeftRight className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="Reset Credentials"><Key className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" title="View Logs"><FileText className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* VM Detail Drawer */}
      <Sheet open={!!selectedVM} onOpenChange={() => setSelectedVM(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedVM && (() => {
            const v = selectedVM;
            const sc = statusConfig[v.status];
            return (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="font-mono">{v.vmId}</SheetTitle>
                    <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{v.student} · {v.batch}</p>
                </SheetHeader>

                <div className="space-y-5">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Node</p>
                      <p className="font-mono font-medium">{v.node}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">IP Address</p>
                      <p className="font-mono font-medium">{v.ip}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">OS</p>
                      <p className="font-medium">{v.os}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Last Seen</p>
                      <p className="font-medium">{v.lastSeen}</p>
                    </div>
                  </div>

                  {/* Resource Charts */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resources</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-primary" /> CPU Usage</span>
                          <span className="font-medium">{v.cpu}%</span>
                        </div>
                        <Progress value={v.cpu} className="h-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1.5"><MemoryStick className="h-3.5 w-3.5 text-primary" /> RAM Usage</span>
                          <span className="font-medium">{v.ram}%</span>
                        </div>
                        <Progress value={v.ram} className="h-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5 text-primary" /> Disk Usage</span>
                          <span className="font-medium">{v.disk}%</span>
                        </div>
                        <Progress value={v.disk} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button variant="outline" className="w-full justify-start gap-2"><RotateCcw className="h-4 w-4" /> Restart VM</Button>
                      <Button variant="outline" className="w-full justify-start gap-2"><ArrowLeftRight className="h-4 w-4" /> Replace VM</Button>
                      <Button variant="outline" className="w-full justify-start gap-2"><Key className="h-4 w-4" /> Reset Credentials</Button>
                      <Button variant="outline" className="w-full justify-start gap-2"><FileText className="h-4 w-4" /> View Logs</Button>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
