import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCustomerStore } from "@/stores/customerStore";
import { useBatchStore } from "@/stores/batchStore";
import { useNodeVMStore } from "@/stores/nodeVMStore";
import { useAuditStore } from "@/stores/auditStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Monitor, X, AlertTriangle, CheckCircle2, Users, Server, Plus } from "lucide-react";

type Mode = "batch" | "students" | "single";

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  error: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
  provisioning: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", label: "Provisioning" },
};

export default function AssignVM() {
  const { customers } = useCustomerStore();
  const { batches } = useBatchStore();
  const { vms, assign } = useNodeVMStore();
  const log = useAuditStore((s) => s.log);

  
  const [vmInput, setVmInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [selectedVMs, setSelectedVMs] = useState<string[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [mode, setMode] = useState<Mode>("batch");
  const [studentIds, setStudentIds] = useState<Set<string>>(new Set());
  const [singleStudent, setSingleStudent] = useState("");
  const [reason, setReason] = useState("");

  const batch = batches.find((b) => b.id === batchId);
  const customer = customers.find((c) => c.id === customerId);
  const participants = batch?.participants || [];

  const selectedVMObjects = useMemo(() => vms.filter((v) => selectedVMs.includes(v.id)), [vms, selectedVMs]);

  const resolveVM = (token: string) => {
    const q = token.trim().toLowerCase();
    if (!q) return null;
    return vms.find((v) => v.id.toLowerCase() === q || v.name.toLowerCase() === q || v.ipAddress === q) || null;
  };

  const addVMs = (tokens: string[]) => {
    const added: string[] = [];
    const notFound: string[] = [];
    const dupes: string[] = [];
    tokens.map((t) => t.trim()).filter(Boolean).forEach((t) => {
      const v = resolveVM(t);
      if (!v) return notFound.push(t);
      if (selectedVMs.includes(v.id) || added.includes(v.id)) return dupes.push(t);
      added.push(v.id);
    });
    if (added.length) setSelectedVMs((prev) => [...prev, ...added]);
    if (notFound.length) toast({ title: "VM not found", description: notFound.join(", "), variant: "destructive" });
    if (added.length) toast({ title: `Added ${added.length} VM(s)`, description: dupes.length ? `${dupes.length} duplicate(s) skipped` : undefined });
  };

  const handleAddSingle = () => {
    if (!vmInput.trim()) return;
    addVMs([vmInput]);
    setVmInput("");
  };

  const handleAddBulk = () => {
    if (!bulkInput.trim()) return;
    addVMs(bulkInput.split(/[\s,;\n]+/));
    setBulkInput("");
  };

  const removeVM = (id: string) => setSelectedVMs((prev) => prev.filter((x) => x !== id));


  const toggleStudent = (id: string) => {
    const next = new Set(studentIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setStudentIds(next);
  };

  const targetCount = mode === "batch" ? participants.length : mode === "students" ? studentIds.size : singleStudent ? 1 : 0;
  const mismatch = targetCount > 0 && selectedVMs.length !== targetCount;

  const reset = () => {
    setSelectedVMs([]);
    setStudentIds(new Set());
    setSingleStudent("");
    setReason("");
  };

  const handleAssign = () => {
    if (selectedVMs.length === 0) return toast({ title: "Add at least one VM", variant: "destructive" });
    if (!batchId) return toast({ title: "Select a batch", variant: "destructive" });
    if (mode === "students" && studentIds.size === 0) return toast({ title: "Select students", variant: "destructive" });
    if (mode === "single" && !singleStudent) return toast({ title: "Select a student", variant: "destructive" });

    const base = { customerId, customerName: customer?.name, batchId, batchName: batch?.name };

    if (mode === "batch") {
      assign(selectedVMs, base);
    } else {
      const ids = mode === "single" ? [singleStudent] : Array.from(studentIds);
      selectedVMs.slice(0, ids.length).forEach((vmId, i) => {
        const p = participants.find((x) => x.id === ids[i]);
        assign([vmId], { ...base, studentId: p?.id, studentName: p?.name });
      });
      if (selectedVMs.length > ids.length) {
        assign(selectedVMs.slice(ids.length), base);
      }
    }

    log({
      action: "assign_vm",
      target: mode === "batch"
        ? `Batch ${batch?.name}`
        : mode === "single"
          ? `Student ${participants.find((p) => p.id === singleStudent)?.name}`
          : `${studentIds.size} students in ${batch?.name}`,
      reason: reason || undefined,
      meta: { vmIds: selectedVMs, mode },
    });

    toast({ title: "VMs assigned", description: `${selectedVMs.length} VM(s) assigned successfully.` });
    reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Pick VMs by ID or name, then assign them to a student, multiple students, or an entire batch.</p>
      </div>

      {/* Step 1 — Pick VMs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Monitor className="h-4 w-4" /> 1. Pick VMs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={vmQuery}
              onChange={(e) => setVmQuery(e.target.value)}
              placeholder="Search VM by ID, name, or IP (e.g. nvm-001, vm-mum-01, 10.10.1.5)"
              className="pl-9"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-64 overflow-auto">
                {searchResults.map((v) => {
                  const sc = statusConfig[v.status];
                  return (
                    <button
                      key={v.id}
                      onClick={() => addVM(v.id)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                        <div>
                          <div className="text-xs font-mono">{v.id} · {v.name}</div>
                          <div className="text-[10px] text-muted-foreground">{v.node} · {v.ipAddress} · {v.os}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {v.batchName && <Badge variant="outline" className="text-[10px]">{v.batchName}</Badge>}
                        <Badge variant="secondary" className={cn("text-[10px] gap-1", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {selectedVMObjects.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">VM ID</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Node</TableHead>
                    <TableHead className="text-xs">IP</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Current assignment</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedVMObjects.map((v) => {
                    const sc = statusConfig[v.status];
                    return (
                      <TableRow key={v.id}>
                        <TableCell className="text-xs font-mono">{v.id}</TableCell>
                        <TableCell className="text-xs font-mono">{v.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{v.node}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{v.ipAddress}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("text-[10px] gap-1", sc.bg, sc.text)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {v.batchName ? `${v.batchName}${v.studentName ? ` · ${v.studentName}` : ""}` : "—"}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeVM(v.id)}><X className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Server className="h-3.5 w-3.5" />
            {selectedVMs.length} VM{selectedVMs.length === 1 ? "" : "s"} selected
            {selectedVMObjects.some((v) => v.batchName) && (
              <span className="text-amber-600">· Some VMs are already assigned and will be reassigned.</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2 — Target */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Users className="h-4 w-4" /> 2. Pick target</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Customer</Label>
              <Select value={customerId} onValueChange={(v) => { setCustomerId(v); setBatchId(""); }}>
                <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Batch</Label>
              <Select value={batchId} onValueChange={setBatchId}>
                <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((b) => <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {batch && (
            <>
              <div>
                <Label className="text-xs">Assignment mode</Label>
                <div className="flex gap-2 mt-1.5">
                  <Button type="button" size="sm" variant={mode === "batch" ? "default" : "outline"} className="text-xs flex-1" onClick={() => setMode("batch")}>
                    Entire batch ({participants.length})
                  </Button>
                  <Button type="button" size="sm" variant={mode === "students" ? "default" : "outline"} className="text-xs flex-1" onClick={() => setMode("students")}>
                    Multiple students
                  </Button>
                  <Button type="button" size="sm" variant={mode === "single" ? "default" : "outline"} className="text-xs flex-1" onClick={() => setMode("single")}>
                    Single student
                  </Button>
                </div>
              </div>

              {mode === "single" && (
                <div>
                  <Label className="text-xs">Student</Label>
                  <Select value={singleStudent} onValueChange={setSingleStudent}>
                    <SelectTrigger className="h-9 text-xs mt-1"><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {participants.map((p) => <SelectItem key={p.id} value={p.id} className="text-xs">{p.name} — {p.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {mode === "students" && (
                <div>
                  <Label className="text-xs">Students ({studentIds.size} selected)</Label>
                  <ScrollArea className="h-[200px] rounded-md border mt-1.5">
                    <div className="p-2 space-y-1">
                      {participants.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 text-xs px-2 py-1.5 rounded hover:bg-muted cursor-pointer">
                          <Checkbox checked={studentIds.has(p.id)} onCheckedChange={() => toggleStudent(p.id)} />
                          <span className="flex-1">{p.name}</span>
                          <span className="text-muted-foreground text-[10px]">{p.email}</span>
                        </label>
                      ))}
                      {participants.length === 0 && <p className="text-xs text-muted-foreground px-2 py-3">No participants in this batch.</p>}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </>
          )}

          <div>
            <Label className="text-xs">Reason / note (optional)</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="mt-1.5 text-xs" placeholder="Recorded in the audit log" />
          </div>
        </CardContent>
      </Card>

      {/* Step 3 — Review & assign */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 text-sm">
            {mismatch ? (
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">VM count ({selectedVMs.length}) ≠ target count ({targetCount}). Extra VMs assign to the batch only; missing VMs leave students unassigned.</span>
              </div>
            ) : selectedVMs.length > 0 && targetCount > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs">Ready to assign {selectedVMs.length} VM(s) to {mode === "batch" ? `entire batch (${targetCount})` : `${targetCount} student(s)`}.</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Pick VMs and a target to continue.</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
            <Button size="sm" onClick={handleAssign} disabled={selectedVMs.length === 0 || !batchId}>
              Assign VM{selectedVMs.length === 1 ? "" : "s"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
