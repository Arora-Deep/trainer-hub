import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBatchStore } from "@/stores/batchStore";
import { useCustomerStore } from "@/stores/customerStore";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Camera, Star, AlertTriangle, CheckCircle2, Plus, Trash2, Square, Play, RotateCw, ChevronDown, Building2, Layers } from "lucide-react";

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  error: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
  provisioning: { dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-600", label: "Provisioning" },
};

export default function ResetLab() {
  const {
    batches,
    recloneParticipantVM,
    restartParticipantVM, stopParticipantVM, startParticipantVM,
    createSnapshot, setGoldenSnapshot, deleteSnapshot,
  } = useBatchStore();
  const { customers } = useCustomerStore();

  const [customerId, setCustomerId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSnapshot, setBulkSnapshot] = useState("");
  const [snapDialogOpen, setSnapDialogOpen] = useState(false);
  const [snapName, setSnapName] = useState("");

  // Batches only have a courseName, not a customer link — so we show all batches
  // once a customer is picked (matches the pattern used in Assign VM).
  const availableBatches = useMemo(
    () => batches.filter((b) => b.vmConfig),
    [batches],
  );

  const batch = availableBatches.find((b) => b.id === selectedBatchId);
  const customer = customers.find((c) => c.id === customerId);
  const snapshots = batch?.vmConfig?.snapshots || [];
  const vms = batch?.vmConfig?.participantVMs || [];
  const goldenSnap = snapshots.find((s) => s.isGolden);

  const doReclone = (vmId: string, student: string, snapId: string) => {
    if (!batch) return;
    const snap = snapshots.find((s) => s.id === snapId);
    recloneParticipantVM(batch.id, vmId);
    toast({ title: "Re-cloning VM", description: `${student}'s VM is being re-cloned from "${snap?.name}".` });
  };

  const doRecloneAll = () => {
    if (!batch || !bulkSnapshot) return;
    const snap = snapshots.find((s) => s.id === bulkSnapshot);
    vms.forEach((vm) => recloneParticipantVM(batch.id, vm.id));
    toast({ title: "Re-cloning All VMs", description: `${vms.length} VM(s) re-cloning from "${snap?.name}".` });
    setBulkOpen(false);
    setBulkSnapshot("");
  };

  const handleCreateSnapshot = () => {
    if (!batch || !snapName.trim()) return;
    createSnapshot(batch.id, snapName.trim(), `Created from Reclone Lab page`);
    toast({ title: "Snapshot Created", description: `${snapName} is being saved...` });
    setSnapName("");
    setSnapDialogOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reclone Lab</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Pick a customer and batch, then re-clone student VMs from any saved snapshot.
          </p>
        </div>

        {/* Customer + Batch selectors */}
        <Card>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Customer</Label>
                <Select value={customerId} onValueChange={(v) => { setCustomerId(v); setSelectedBatchId(""); }}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select customer..." /></SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Batch</Label>
                <Select value={selectedBatchId} onValueChange={setSelectedBatchId} disabled={!customerId}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder={customerId ? "Select batch..." : "Pick a customer first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                        {b.courseName && <span className="text-muted-foreground ml-1.5 text-xs">· {b.courseName}</span>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {batch && customer && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-[10px] gap-1"><Building2 className="h-3 w-3" />{customer.name}</Badge>
                <span>/</span>
                <Badge variant="secondary" className="text-[10px] gap-1"><Layers className="h-3 w-3" />{batch.name}</Badge>
                <span>·</span>
                <span>{vms.length} participant VM{vms.length === 1 ? "" : "s"}</span>
                <span>·</span>
                <span>{snapshots.length} snapshot{snapshots.length === 1 ? "" : "s"}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Snapshots panel */}
        {batch && (
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" /> Snapshots ({snapshots.length})
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Saved states of the master VM. The <Star className="inline h-2.5 w-2.5 text-primary" /> golden snapshot is used by default when cloning new VMs.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => setSnapDialogOpen(true)}>
                  <Plus className="h-3 w-3" /> New Snapshot
                </Button>
                <Button size="sm" className="gap-1.5 text-xs" disabled={snapshots.length === 0 || vms.length === 0} onClick={() => setBulkOpen(true)}>
                  <RefreshCw className="h-3 w-3" /> Reclone All VMs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-2">
              {snapshots.length === 0 && <p className="text-xs text-muted-foreground col-span-2">No snapshots yet. Create one from the master VM.</p>}
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
                      <Tooltip><TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setGoldenSnapshot(batch.id, snap.id); toast({ title: "Golden Set", description: `${snap.name} is now the golden snapshot.` }); }}>
                          <Star className="h-3 w-3" />
                        </Button>
                      </TooltipTrigger><TooltipContent side="top" className="text-xs">Mark as golden</TooltipContent></Tooltip>
                    )}
                    <Tooltip><TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive" onClick={() => { deleteSnapshot(batch.id, snap.id); toast({ title: "Deleted", description: `${snap.name} removed.` }); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger><TooltipContent side="top" className="text-xs">Delete snapshot</TooltipContent></Tooltip>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Participant VM list */}
        {batch && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Participant VMs</CardTitle>
              <p className="text-[11px] text-muted-foreground">
                Use <span className="font-medium">Reclone</span> to wipe a VM and rebuild it from any snapshot. Power actions restart or stop the VM without touching its disk.
              </p>
            </CardHeader>
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
                            {/* Reclone with snapshot picker */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1 text-xs" disabled={snapshots.length === 0}>
                                  <RefreshCw className="h-3 w-3" /> Reclone
                                  <ChevronDown className="h-3 w-3 opacity-60" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-64 p-2">
                                <p className="text-[11px] font-medium px-2 py-1 text-muted-foreground">Reclone from snapshot</p>
                                <div className="space-y-0.5 max-h-64 overflow-y-auto">
                                  {snapshots.map((snap) => (
                                    <button
                                      key={snap.id}
                                      className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-muted text-xs text-left"
                                      onClick={() => doReclone(vm.id, vm.assignedTo, snap.id)}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        {snap.isGolden && <Star className="h-3 w-3 text-primary shrink-0" />}
                                        <span className="truncate">{snap.name}</span>
                                        {snap.isGolden && <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary px-1 py-0 h-3.5">golden</Badge>}
                                      </div>
                                      <span className="text-[10px] text-muted-foreground shrink-0">{snap.size}</span>
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>

                            {/* Power actions */}
                            {vm.status === "running" ? (
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { stopParticipantVM(batch.id, vm.id); toast({ title: "Stopping VM", description: vm.vmName }); }}>
                                  <Square className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent side="top" className="text-xs">Shut down (keeps disk)</TooltipContent></Tooltip>
                            ) : (
                              <Tooltip><TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { startParticipantVM(batch.id, vm.id); toast({ title: "Starting VM", description: vm.vmName }); }}>
                                  <Play className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger><TooltipContent side="top" className="text-xs">Power on</TooltipContent></Tooltip>
                            )}
                            <Tooltip><TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { restartParticipantVM(batch.id, vm.id); toast({ title: "Restarting VM", description: vm.vmName }); }}>
                                <RotateCw className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger><TooltipContent side="top" className="text-xs">Reboot (keeps disk)</TooltipContent></Tooltip>
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
              <RefreshCw className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">
                {customerId ? "Select a batch to manage lab reclones" : "Select a customer to get started"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reclone All dialog */}
        <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Reclone All Participant VMs
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Every participant VM in <span className="font-medium">{batch?.name}</span> will be wiped and rebuilt from the snapshot you pick. Students will lose all unsaved work.
              </p>
              <div className="space-y-2">
                <Label>Reclone from snapshot</Label>
                <Select value={bulkSnapshot} onValueChange={setBulkSnapshot}>
                  <SelectTrigger><SelectValue placeholder={goldenSnap ? `Default: ${goldenSnap.name}` : "Choose a snapshot..."} /></SelectTrigger>
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
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>This will re-clone {vms.length} VM(s). Any student progress not saved to a shared drive will be lost.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
              <Button variant="destructive" disabled={!bulkSnapshot} onClick={doRecloneAll}>
                <RefreshCw className="h-3 w-3 mr-1" /> Reclone All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create snapshot dialog */}
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
    </TooltipProvider>
  );
}
