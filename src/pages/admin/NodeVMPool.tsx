import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNodeVMStore, type NodeVMStatus } from "@/stores/nodeVMStore";
import { useAuditStore } from "@/stores/auditStore";
import { AssignVMDrawer } from "@/components/admin/AssignVMDrawer";
import { ExtendTimeDrawer } from "@/components/admin/ExtendTimeDrawer";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Search, Server, Clock, Link2Off, Users, History } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const statusStyle: Record<NodeVMStatus, string> = {
  running: "bg-green-500/10 text-green-600",
  stopped: "bg-amber-500/10 text-amber-600",
  error: "bg-red-500/10 text-red-600",
  provisioning: "bg-blue-500/10 text-blue-600",
};

export default function NodeVMPool() {
  const { vms, release } = useNodeVMStore();
  const auditEntries = useAuditStore((s) => s.entries);
  const log = useAuditStore((s) => s.log);
  const [params] = useSearchParams();
  const [search, setSearch] = useState("");
  const [nodeFilter, setNodeFilter] = useState(params.get("node") || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [assignOpen, setAssignOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendTarget, setExtendTarget] = useState<{ ids: string[]; label: string; scope: "vm" | "batch" }>({ ids: [], label: "", scope: "vm" });

  const addBonus = useNodeVMStore((s) => s.addBonusHours);

  const allNodes = useMemo(() => Array.from(new Set(vms.map((v) => v.node))), [vms]);
  const allCustomers = useMemo(() => Array.from(new Set(vms.map((v) => v.customerName).filter(Boolean) as string[])), [vms]);

  const filtered = vms.filter((v) => {
    if (nodeFilter !== "all" && v.node !== nodeFilter) return false;
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (customerFilter !== "all" && v.customerName !== customerFilter) return false;
    if (unassignedOnly && v.customerId) return false;
    if (search && !`${v.name} ${v.ipAddress} ${v.batchName || ""} ${v.studentName || ""}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: vms.length,
    assigned: vms.filter((v) => v.customerId).length,
    unassigned: vms.filter((v) => !v.customerId).length,
    nodes: allNodes.length,
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((v) => v.id)));
  };

  const handleRelease = () => {
    release(Array.from(selected));
    log({ action: "release_vm", target: `${selected.size} VM(s)` });
    toast({ title: "Released", description: `${selected.size} VM(s) released from assignment.` });
    setSelected(new Set());
  };

  const openExtendForSelected = () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setExtendTarget({ ids, label: `${ids.length} selected VM(s)`, scope: "vm" });
    setExtendOpen(true);
  };

  const openExtendForBatch = (batchName: string) => {
    const ids = vms.filter((v) => v.batchName === batchName).map((v) => v.id);
    setExtendTarget({ ids, label: `Batch: ${batchName} (${ids.length} VMs)`, scope: "batch" });
    setExtendOpen(true);
  };

  const allBatches = useMemo(() => Array.from(new Set(vms.map((v) => v.batchName).filter(Boolean) as string[])), [vms]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Node VM Pool</h1>
          <p className="text-muted-foreground text-sm mt-1">All VMs across every node. Assign, reassign, release, or extend time.</p>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={openExtendForBatch}>
            <SelectTrigger className="h-9 w-[220px] text-xs"><SelectValue placeholder="Extend time for entire batch…" /></SelectTrigger>
            <SelectContent>
              {allBatches.map((b) => <SelectItem key={b} value={b} className="text-xs">{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total VMs", value: stats.total, icon: Server },
          { label: "Assigned", value: stats.assigned, icon: Users, color: "text-green-600 bg-green-500/10" },
          { label: "Unassigned", value: stats.unassigned, icon: Link2Off, color: "text-amber-600 bg-amber-500/10" },
          { label: "Nodes", value: stats.nodes, icon: Server },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-4 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", s.color || "bg-primary/10 text-primary")}><s.icon className="h-4 w-4" /></div>
            <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
          </CardContent></Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search VM, IP, batch, student…" className="pl-8 h-9 text-xs" />
            </div>
            <Select value={nodeFilter} onValueChange={setNodeFilter}>
              <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All nodes</SelectItem>
                {allNodes.map((n) => <SelectItem key={n} value={n} className="text-xs">{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All status</SelectItem>
                <SelectItem value="running" className="text-xs">Running</SelectItem>
                <SelectItem value="stopped" className="text-xs">Stopped</SelectItem>
                <SelectItem value="error" className="text-xs">Error</SelectItem>
                <SelectItem value="provisioning" className="text-xs">Provisioning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[180px] h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All customers</SelectItem>
                {allCustomers.map((c) => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <label className="flex items-center gap-2 text-xs">
              <Switch checked={unassignedOnly} onCheckedChange={setUnassignedOnly} />
              Unassigned only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Sticky action bar */}
      {selected.size > 0 && (
        <div className="sticky top-2 z-10 flex items-center justify-between gap-3 rounded-lg border bg-background/95 backdrop-blur p-3 shadow-sm">
          <span className="text-sm font-medium">{selected.size} VM(s) selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={openExtendForSelected}><Clock className="h-3 w-3" /> Extend time</Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={handleRelease}>Release</Button>
            <Button size="sm" className="text-xs gap-1.5" onClick={() => setAssignOpen(true)}><Users className="h-3 w-3" /> Assign</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>VM</TableHead>
                <TableHead>Node</TableHead>
                <TableHead>Specs</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned to</TableHead>
                <TableHead>Bonus</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id} className={cn(selected.has(v.id) && "bg-muted/40")}>
                  <TableCell><Checkbox checked={selected.has(v.id)} onCheckedChange={() => toggle(v.id)} /></TableCell>
                  <TableCell>
                    <div className="text-sm font-medium font-mono">{v.name}</div>
                    <div className="text-[10px] text-muted-foreground">{v.os}</div>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{v.node}<div className="text-[10px] text-muted-foreground">{v.region}</div></TableCell>
                  <TableCell className="text-xs">{v.vcpu} vCPU · {v.ramGB}GB · {v.diskGB}GB</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{v.ipAddress}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("text-[10px] gap-1.5", statusStyle[v.status])}>
                      <span className={cn("h-1.5 w-1.5 rounded-full",
                        v.status === "running" ? "bg-green-500" : v.status === "stopped" ? "bg-amber-500" : v.status === "error" ? "bg-red-500" : "bg-blue-500")} />
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {v.customerId ? (
                      <div>
                        <div className="font-medium">{v.studentName || "Batch"}</div>
                        <div className="text-[10px] text-muted-foreground">{v.batchName} · {v.customerName}</div>
                      </div>
                    ) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs">{v.bonusHours ? <Badge variant="outline" className="text-[10px]">+{v.bonusHours}h</Badge> : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-xs h-7"
                      onClick={() => { setExtendTarget({ ids: [v.id], label: v.name, scope: "vm" }); setExtendOpen(true); }}>
                      <Clock className="h-3 w-3 mr-1" /> Extend
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-xs text-muted-foreground py-8">No VMs match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent audit */}
      {auditEntries.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><History className="h-4 w-4" /> Recent admin actions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[200px]">
              <div className="px-4 py-2 space-y-1.5">
                {auditEntries.slice(0, 20).map((e) => (
                  <div key={e.id} className="flex items-start gap-2 text-[11px] border-b pb-1.5">
                    <span className="text-muted-foreground font-mono">{new Date(e.timestamp).toLocaleTimeString()}</span>
                    <Badge variant="outline" className="text-[10px]">{e.action}</Badge>
                    <span className="flex-1">{e.target}</span>
                    {e.reason && <span className="text-muted-foreground italic truncate max-w-[200px]">"{e.reason}"</span>}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <AssignVMDrawer open={assignOpen} onOpenChange={setAssignOpen} vmIds={Array.from(selected)} />
      <ExtendTimeDrawer
        open={extendOpen}
        onOpenChange={setExtendOpen}
        targetLabel={extendTarget.label}
        scope={extendTarget.scope}
        onConfirm={(hours) => addBonus(extendTarget.ids, hours)}
      />
    </div>
  );
}
