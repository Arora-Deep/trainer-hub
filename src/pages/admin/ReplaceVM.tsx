import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Search } from "lucide-react";

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  error: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
  provisioning: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", label: "Provisioning" },
};

export default function ReplaceVM() {
  const { batches, recloneParticipantVM } = useBatchStore();
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [snapshotMode, setSnapshotMode] = useState<"latest" | "golden" | "specific">("latest");
  const [snapshotId, setSnapshotId] = useState<string>("");

  const availableSnapshots = useMemo(() => {
    const list: { batchId: string; batchName: string; id: string; name: string }[] = [];
    batches.forEach((b) => b.vmConfig?.snapshots.forEach((s) => list.push({ batchId: b.id, batchName: b.name, id: s.id, name: s.name })));
    return list;
  }, [batches]);

  const rows = useMemo(() => {
    const list: { batchId: string; batchName: string; vmId: string; student: string; vmName: string; ip: string; status: string }[] = [];
    batches.forEach((b) => {
      b.vmConfig?.participantVMs.forEach((vm) => {
        list.push({ batchId: b.id, batchName: b.name, vmId: vm.id, student: vm.assignedTo, vmName: vm.vmName, ip: vm.ipAddress, status: vm.status });
      });
    });
    return list
      .filter((r) => batchFilter === "all" || r.batchId === batchFilter)
      .filter((r) => statusFilter === "all" || r.status === statusFilter)
      .filter((r) => !search || r.student.toLowerCase().includes(search.toLowerCase()) || r.vmName.toLowerCase().includes(search.toLowerCase()));
  }, [batches, batchFilter, statusFilter, search]);

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((r) => `${r.batchId}:${r.vmId}`)));
  };

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  };

  const replaceOne = (batchId: string, vmId: string, name: string) => {
    recloneParticipantVM(batchId, vmId);
    toast({ title: "Replacing VM", description: `Creating new VM for ${name}...` });
  };

  const replaceBulk = () => {
    selected.forEach((key) => {
      const [batchId, vmId] = key.split(":");
      recloneParticipantVM(batchId, vmId);
    });
    toast({ title: "Bulk Replace", description: `Replacing ${selected.size} VMs...` });
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Replace VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Replace faulty or stopped VMs — system creates a new VM and destroys the old one</p>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search student or VM..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={batchFilter} onValueChange={setBatchFilter}>
            <SelectTrigger className="w-[220px] h-9"><SelectValue placeholder="All Batches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Batches</SelectItem>
              {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="error">Failed</SelectItem>
              <SelectItem value="provisioning">Provisioning</SelectItem>
            </SelectContent>
          </Select>
          {selected.size > 0 && (
            <Button size="sm" onClick={replaceBulk} className="gap-1.5">
              <ArrowLeftRight className="h-3 w-3" /> Replace {selected.size} selected
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={rows.length > 0 && selected.size === rows.length} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>VM</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const sc = statusConfig[r.status] || statusConfig.stopped;
                const key = `${r.batchId}:${r.vmId}`;
                return (
                  <TableRow key={key}>
                    <TableCell><Checkbox checked={selected.has(key)} onCheckedChange={() => toggle(key)} /></TableCell>
                    <TableCell className="text-sm font-medium">{r.student}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.batchName}</TableCell>
                    <TableCell className="text-sm font-mono">{r.vmName}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{r.ip}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => replaceOne(r.batchId, r.vmId, r.student)} disabled={r.status === "provisioning"}>
                        <ArrowLeftRight className="h-3 w-3" /> Replace
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-sm text-muted-foreground">No VMs match the current filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
