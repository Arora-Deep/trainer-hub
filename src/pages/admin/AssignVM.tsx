import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCustomerStore } from "@/stores/customerStore";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Monitor, Zap, Users, CheckCircle2, Server } from "lucide-react";

const NODE_OPTIONS = [
  { value: "auto", label: "Auto-balance (recommended)" },
  { value: "node-a-01", label: "node-a-01 · Mumbai · 38% load" },
  { value: "node-a-02", label: "node-a-02 · Mumbai · 62% load" },
  { value: "node-b-01", label: "node-b-01 · Bangalore · 24% load" },
  { value: "node-b-02", label: "node-b-02 · Bangalore · 71% load" },
  { value: "node-c-01", label: "node-c-01 · Singapore · 19% load" },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  not_assigned: { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", label: "Not Assigned" },
  error: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
};

export default function AssignVM() {
  const { customers } = useCustomerStore();
  const { batches, assignParticipantVM, recloneParticipantVM } = useBatchStore();
  const [customerId, setCustomerId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetNode, setTargetNode] = useState("auto");

  const batch = batches.find((b) => b.id === batchId);
  const filteredBatches = useMemo(() => batches, [batches]);
  const participants = batch?.participants || [];
  const vms = batch?.vmConfig?.participantVMs || [];

  const findVM = (email: string) => vms.find((v) => v.assignedEmail === email);
  const assignedCount = participants.filter((p) => findVM(p.email)).length;
  const unassignedCount = participants.length - assignedCount;

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleAssign = (participantId: string, name: string) => {
    if (!batch) return;
    assignParticipantVM(batch.id, participantId);
    toast({ title: "VM Assigned", description: `Provisioning a VM for ${name}...` });
  };

  const handleAutoAssign = () => {
    if (!batch) return;
    let count = 0;
    participants.forEach((p) => {
      if (!findVM(p.email)) {
        assignParticipantVM(batch.id, p.id);
        count++;
      }
    });
    toast({ title: "Auto Assign", description: `Assigning VMs to ${count} unassigned participants.` });
  };

  const handleBulkAssign = () => {
    if (!batch) return;
    selected.forEach((id) => {
      const p = participants.find((x) => x.id === id);
      if (p && !findVM(p.email)) assignParticipantVM(batch.id, id);
    });
    toast({ title: "Bulk Assign", description: `Assigning ${selected.size} VMs.` });
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Assign VMs to participants by batch — supports bulk assignment</p>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Select Customer & Batch</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="All Customers" /></SelectTrigger>
              <SelectContent>
                {customers.filter((c) => c.status === "active").map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={batchId} onValueChange={setBatchId}>
              <SelectTrigger className="w-[260px]"><SelectValue placeholder="Select Batch" /></SelectTrigger>
              <SelectContent>
                {filteredBatches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {batch && (
        <div className="grid grid-cols-3 gap-4">
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
            <div><p className="text-xs text-muted-foreground">Total Participants</p><p className="text-xl font-bold">{participants.length}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="h-4 w-4 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Assigned</p><p className="text-xl font-bold">{assignedCount}</p></div>
          </CardContent></Card>
          <Card><CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Monitor className="h-4 w-4 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Unassigned</p><p className="text-xl font-bold">{unassignedCount}</p></div>
          </CardContent></Card>
        </div>
      )}

      {batch && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-sm">Participants</CardTitle>
              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-muted-foreground" />
                  <Select value={targetNode} onValueChange={setTargetNode}>
                    <SelectTrigger className="h-8 w-[240px] text-xs">
                      <SelectValue placeholder="Target node" />
                    </SelectTrigger>
                    <SelectContent>
                      {NODE_OPTIONS.map((n) => (
                        <SelectItem key={n.value} value={n.value} className="text-xs">{n.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleAutoAssign} disabled={unassignedCount === 0}>
                  <Zap className="h-3 w-3" /> Auto Assign
                </Button>
                <Button size="sm" className="gap-1.5 text-xs" onClick={handleBulkAssign} disabled={selected.size === 0}>
                  <Monitor className="h-3 w-3" /> Bulk Assign ({selected.size})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Assigned VM</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants.map((p) => {
                  const vm = findVM(p.email);
                  const status = vm ? vm.status : "not_assigned";
                  const sc = statusConfig[status] || statusConfig.not_assigned;
                  return (
                    <TableRow key={p.id}>
                      <TableCell><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} disabled={!!vm} /></TableCell>
                      <TableCell className="text-sm font-medium">{p.name}<div className="text-xs text-muted-foreground">{p.email}</div></TableCell>
                      <TableCell className="text-sm font-mono">{vm?.vmName || "—"}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{vm?.ipAddress || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!vm && (
                          <Button size="sm" className="text-xs" onClick={() => handleAssign(p.id, p.name)}>Assign VM</Button>
                        )}
                        {vm && vm.status === "error" && (
                          <Button variant="outline" size="sm" className="text-xs text-red-600" onClick={() => { recloneParticipantVM(batch.id, vm.id); toast({ title: "Replacing", description: `New VM for ${p.name}` }); }}>Replace</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
