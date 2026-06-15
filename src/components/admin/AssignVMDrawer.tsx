import { useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/stores/customerStore";
import { useBatchStore } from "@/stores/batchStore";
import { useAuditStore } from "@/stores/auditStore";
import { useNodeVMStore } from "@/stores/nodeVMStore";
import { Users, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  vmIds: string[];
}

export function AssignVMDrawer({ open, onOpenChange, vmIds }: Props) {
  const { customers } = useCustomerStore();
  const { batches } = useBatchStore();
  const assign = useNodeVMStore((s) => s.assign);
  const log = useAuditStore((s) => s.log);
  const [customerId, setCustomerId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [mode, setMode] = useState<"batch" | "students">("batch");
  const [studentIds, setStudentIds] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState("");

  const batch = batches.find((b) => b.id === batchId);
  const participants = batch?.participants || [];
  const customer = customers.find((c) => c.id === customerId);

  const targetCount = mode === "batch" ? participants.length : studentIds.size;
  const mismatch = useMemo(() => {
    if (mode === "students") return vmIds.length !== studentIds.size && studentIds.size > 0;
    return targetCount > 0 && vmIds.length !== targetCount;
  }, [vmIds.length, targetCount, mode, studentIds.size]);

  const toggleStudent = (id: string) => {
    const next = new Set(studentIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setStudentIds(next);
  };

  const handle = () => {
    if (!batchId) { toast({ title: "Select a batch", variant: "destructive" }); return; }
    if (mode === "students" && studentIds.size === 0) { toast({ title: "Select students", variant: "destructive" }); return; }
    if (mode === "students") {
      const ids = Array.from(studentIds);
      vmIds.slice(0, ids.length).forEach((vmId, i) => {
        const p = participants.find((x) => x.id === ids[i]);
        assign([vmId], {
          customerId, customerName: customer?.name,
          batchId, batchName: batch?.name,
          studentId: p?.id, studentName: p?.name,
        });
      });
    } else {
      assign(vmIds, {
        customerId, customerName: customer?.name,
        batchId, batchName: batch?.name,
      });
    }
    log({
      action: "assign_vm",
      target: mode === "batch" ? `Batch ${batch?.name}` : `${studentIds.size} student(s) in ${batch?.name}`,
      reason: reason || undefined,
      meta: { vmCount: vmIds.length, mode },
    });
    toast({ title: "VMs assigned", description: `${vmIds.length} VM(s) assigned to ${batch?.name}.` });
    onOpenChange(false);
    setStudentIds(new Set());
    setReason("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[460px] sm:max-w-[460px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Users className="h-4 w-4" /> Assign {vmIds.length} VM(s)</SheetTitle>
          <SheetDescription className="text-xs">Pick a customer, batch and target.</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
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

          {batch && (
            <div>
              <Label className="text-xs">Assignment mode</Label>
              <div className="flex gap-2 mt-1.5">
                <Button type="button" size="sm" variant={mode === "batch" ? "default" : "outline"} className="text-xs flex-1" onClick={() => setMode("batch")}>
                  Entire batch ({participants.length})
                </Button>
                <Button type="button" size="sm" variant={mode === "students" ? "default" : "outline"} className="text-xs flex-1" onClick={() => setMode("students")}>
                  Pick students
                </Button>
              </div>
            </div>
          )}

          {batch && mode === "students" && (
            <div>
              <Label className="text-xs">Students ({studentIds.size} selected)</Label>
              <ScrollArea className="h-[180px] rounded-md border mt-1.5">
                <div className="p-2 space-y-1">
                  {participants.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-xs px-2 py-1 rounded hover:bg-muted cursor-pointer">
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

          {mismatch && (
            <div className="flex gap-2 rounded-md bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>VM count ({vmIds.length}) doesn't match target count ({targetCount}). Extra VMs will remain unassigned or selected students without a VM will be skipped.</span>
            </div>
          )}

          <div>
            <Label className="text-xs">Reason / note</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="mt-1.5 text-xs" placeholder="Optional — recorded in audit log" />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button size="sm" onClick={handle}>Assign</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
