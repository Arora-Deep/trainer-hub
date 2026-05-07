import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Power, Camera, Star, AlertTriangle, CheckCircle2, Plus, Trash2, Square, Play, RefreshCw } from "lucide-react";

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  error: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
  provisioning: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", label: "Provisioning" },
};

export default function ResetLab() {
  const {
    batches,
    resetParticipantVM, resetAllVMs, recloneParticipantVM,
    restartParticipantVM, stopParticipantVM, startParticipantVM,
    createSnapshot, setGoldenSnapshot, deleteSnapshot,
  } = useBatchStore();

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<{ type: "single" | "all"; vmId?: string; student?: string }>({ type: "all" });
  const [selectedSnapshot, setSelectedSnapshot] = useState("");
  const [snapDialogOpen, setSnapDialogOpen] = useState(false);
  const [snapName, setSnapName] = useState("");

  const batch = batches.find((b) => b.id === selectedBatchId);
  const snapshots = batch?.vmConfig?.snapshots || [];
  const vms = batch?.vmConfig?.participantVMs || [];

  const handleReset = () => {
    const snap = snapshots.find((s) => s.id === selectedSnapshot);
    if (!batch || !snap) return;
    if (resetTarget.type === "all") {
      resetAllVMs(batch.id, snap.id);
      toast({ title: "Resetting All Labs", description: `All VMs are being reset to "${snap.name}"...` });
    } else if (resetTarget.vmId) {
      resetParticipantVM(batch.id, resetTarget.vmId, snap.id);
      toast({ title: "Resetting Lab", description: `${resetTarget.student}'s VM is being reset to "${snap.name}"...` });
    }
    setResetDialogOpen(false);
    setSelectedSnapshot("");
  };

  const handleCreateSnapshot = () => {
    if (!batch || !snapName.trim()) return;
    createSnapshot(batch.id, snapName.trim(), `Created from Reset Lab page`);
    toast({ title: "Snapshot Created", description: `${snapName} is being saved...` });
    setSnapName("");
    setSnapDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage snapshots and reset student VMs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Select Batch</CardTitle></CardHeader>
          <CardContent>
            <Select value={selectedBatchId} onValueChange={(v) => { setSelectedBatchId(v); setSelectedSnapshot(""); }}>
              <SelectTrigger><SelectValue placeholder="Choose a batch..." /></SelectTrigger>
              <SelectContent>
                {batches.filter(b => b.vmConfig).map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {batch && (
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" /> Snapshots ({snapshots.length})
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setSnapDialogOpen(true)}>
                <Plus className="h-3 w-3" /> New
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {snapshots.length === 0 && <p className="text-xs text-muted-foreground">No snapshots yet.</p>}
              {snapshots.map((snap) => (
                <div key={snap.id} className={cn("flex items-center justify-between p-2.5 rounded-lg border text-sm", snap.isGolden && "border-primary/30 bg-primary/5")}>
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                    <span className="font-medium truncate">{snap.name}</span>
                    {snap.isGolden && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary gap-1">
                        <Star className="h-2.5 w-2.5" /> Golden
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-2">{snap.size}</span>
                    {!snap.isGolden && (
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Set as Golden" onClick={() => { setGoldenSnapshot(batch.id, snap.id); toast({ title: "Golden Set", description: `${snap.name} is now the golden snapshot.` }); }}>
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" title="Delete" onClick={() => { deleteSnapshot(batch.id, snap.id); toast({ title: "Deleted", description: `${snap.name} removed.` }); }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {batch && snapshots.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setResetTarget({ type: "all" }); setResetDialogOpen(true); }}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset All Labs to Snapshot
          </Button>
        </div>
      )}

      {batch && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>VM</TableHead>
                  <TableHead>Current Snapshot</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vms.map((vm) => {
                  const sc = statusConfig[vm.status] || statusConfig.stopped;
                  const currentSnap = snapshots.find((s) => s.id === vm.currentSnapshotId);
                  return (
                    <TableRow key={vm.id}>
                      <TableCell className="text-sm font-medium">{vm.assignedTo}</TableCell>
                      <TableCell className="text-sm font-mono">{vm.vmName}</TableCell>
                      <TableCell>
                        {currentSnap ? (
                          <Badge variant="secondary" className="text-xs gap-1"><Camera className="h-2.5 w-2.5" />{currentSnap.name}</Badge>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />{sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" className="gap-1 text-xs" disabled={snapshots.length === 0}
                            onClick={() => { setResetTarget({ type: "single", vmId: vm.id, student: vm.assignedTo }); setResetDialogOpen(true); }}>
                            <RotateCcw className="h-3 w-3" /> Reset
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 text-xs"
                            onClick={() => { recloneParticipantVM(batch.id, vm.id); toast({ title: "Re-cloning", description: `${vm.assignedTo}'s VM is being re-cloned from golden.` }); }}>
                            <RefreshCw className="h-3 w-3" /> Reclone
                          </Button>
                          {vm.status === "running" ? (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Stop" onClick={() => { stopParticipantVM(batch.id, vm.id); toast({ title: "Stopping", description: `${vm.vmName}` }); }}><Square className="h-3 w-3" /></Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Start" onClick={() => { startParticipantVM(batch.id, vm.id); toast({ title: "Starting", description: `${vm.vmName}` }); }}><Play className="h-3 w-3" /></Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Restart" onClick={() => { restartParticipantVM(batch.id, vm.id); toast({ title: "Restarting", description: `${vm.vmName}` }); }}><Power className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {vms.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-sm text-muted-foreground">No participant VMs in this batch.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {!batch && (
        <Card>
          <CardContent className="py-12 text-center">
            <RotateCcw className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Select a batch to manage lab resets</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              {resetTarget.type === "all" ? "Reset All Labs" : `Reset ${resetTarget.student}'s Lab`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {resetTarget.type === "all"
                ? "This will reset ALL student VMs in this batch to the selected snapshot. Students will lose unsaved work."
                : `Reset this VM to a previous snapshot state.`}
            </p>
            <div className="space-y-2">
              <Label>Restore to Snapshot</Label>
              <Select value={selectedSnapshot} onValueChange={setSelectedSnapshot}>
                <SelectTrigger><SelectValue placeholder="Choose a snapshot..." /></SelectTrigger>
                <SelectContent>
                  {snapshots.map((snap) => (
                    <SelectItem key={snap.id} value={snap.id}>
                      <div className="flex items-center gap-2">
                        {snap.isGolden && <Star className="h-3 w-3 text-primary" />}
                        {snap.name}<span className="text-muted-foreground text-xs">({snap.size})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {resetTarget.type === "all" && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>This action will affect all student VMs.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={!selectedSnapshot} onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" /> {resetTarget.type === "all" ? "Reset All" : "Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={snapDialogOpen} onOpenChange={setSnapDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Snapshot</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Snapshot Name</Label>
            <Input value={snapName} onChange={(e) => setSnapName(e.target.value)} placeholder="e.g. After Module 3" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSnapDialogOpen(false)}>Cancel</Button>
            <Button disabled={!snapName.trim()} onClick={handleCreateSnapshot}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
