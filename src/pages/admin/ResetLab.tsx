import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Power, Camera, Star, AlertTriangle, CheckCircle2 } from "lucide-react";

const batches = [
  { id: "B-001", name: "K8s Batch #14" },
  { id: "B-002", name: "ML Cohort #5" },
  { id: "B-003", name: "Linux Fundamentals #8" },
];

const snapshotsMap: Record<string, { id: string; name: string; size: string; isGolden: boolean }[]> = {
  "B-001": [
    { id: "snap-1", name: "Initial Setup", size: "4.2 GB", isGolden: true },
    { id: "snap-2", name: "Post Lab 1", size: "5.1 GB", isGolden: false },
    { id: "snap-3", name: "Mid-course Checkpoint", size: "5.8 GB", isGolden: false },
  ],
  "B-002": [
    { id: "snap-4", name: "Base ML Environment", size: "12.3 GB", isGolden: true },
  ],
  "B-003": [
    { id: "snap-5", name: "Linux Baseline", size: "2.1 GB", isGolden: true },
    { id: "snap-6", name: "Networking Module Done", size: "2.8 GB", isGolden: false },
  ],
};

const labData: Record<string, { student: string; vm: string; status: string; currentSnapshot: string }[]> = {
  "B-001": [
    { student: "Arun Verma", vm: "VM-2001", status: "running", currentSnapshot: "Initial Setup" },
    { student: "Sneha Rao", vm: "VM-2002", status: "running", currentSnapshot: "Post Lab 1" },
    { student: "Rahul Gupta", vm: "VM-2003", status: "stopped", currentSnapshot: "Initial Setup" },
    { student: "Kavitha S", vm: "VM-2004", status: "running", currentSnapshot: "Initial Setup" },
    { student: "Deepak Kumar", vm: "VM-2005", status: "failed", currentSnapshot: "Initial Setup" },
  ],
  "B-002": [
    { student: "Alice Johnson", vm: "VM-3001", status: "running", currentSnapshot: "Base ML Environment" },
    { student: "Bob Williams", vm: "VM-3002", status: "running", currentSnapshot: "Base ML Environment" },
  ],
  "B-003": [
    { student: "Carol Davis", vm: "VM-4001", status: "running", currentSnapshot: "Linux Baseline" },
    { student: "David Brown", vm: "VM-4002", status: "stopped", currentSnapshot: "Networking Module Done" },
    { student: "Eva Martinez", vm: "VM-4003", status: "failed", currentSnapshot: "Linux Baseline" },
  ],
};

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

export default function ResetLab() {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<{ type: "single" | "all"; student?: string; vm?: string }>({ type: "all" });
  const [selectedSnapshot, setSelectedSnapshot] = useState("");

  const currentLabs = selectedBatch ? (labData[selectedBatch] || []) : [];
  const currentSnapshots = selectedBatch ? (snapshotsMap[selectedBatch] || []) : [];

  const handleReset = () => {
    const snap = currentSnapshots.find(s => s.id === selectedSnapshot);
    if (resetTarget.type === "all") {
      toast({ title: "Resetting All Labs", description: `All VMs are being reset to "${snap?.name}"...` });
    } else {
      toast({ title: "Resetting Lab", description: `${resetTarget.student}'s VM is being reset to "${snap?.name}"...` });
    }
    setResetDialogOpen(false);
    setSelectedSnapshot("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">Reset student lab environments to a saved snapshot state</p>
      </div>

      {/* Batch & Snapshot Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Batch</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedBatch} onValueChange={v => { setSelectedBatch(v); setSelectedSnapshot(""); }}>
              <SelectTrigger><SelectValue placeholder="Choose a batch..." /></SelectTrigger>
              <SelectContent>
                {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedBatch && currentSnapshots.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Available Snapshots ({currentSnapshots.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentSnapshots.map(snap => (
                <div key={snap.id} className={cn("flex items-center justify-between p-2.5 rounded-lg border text-sm", snap.isGolden && "border-primary/30 bg-primary/5")}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="font-medium">{snap.name}</span>
                    {snap.isGolden && (
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary gap-1">
                        <Star className="h-2.5 w-2.5" /> Golden
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{snap.size}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk Reset */}
      {selectedBatch && currentSnapshots.length > 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setResetTarget({ type: "all" });
              setResetDialogOpen(true);
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset All Labs to Snapshot
          </Button>
        </div>
      )}

      {/* Lab Table */}
      {selectedBatch && (
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
                {currentLabs.map((l, i) => {
                  const sc = statusConfig[l.status];
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{l.student}</TableCell>
                      <TableCell className="text-sm font-mono">{l.vm}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Camera className="h-2.5 w-2.5" />
                          {l.currentSnapshot}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => {
                              setResetTarget({ type: "single", student: l.student, vm: l.vm });
                              setResetDialogOpen(true);
                            }}
                          >
                            <RotateCcw className="h-3 w-3" /> Reset to Snapshot
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={() => toast({ title: "VM Restart", description: `Restarting ${l.vm}...` })}
                          >
                            <Power className="h-3 w-3" /> Restart
                          </Button>
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

      {!selectedBatch && (
        <Card>
          <CardContent className="py-12 text-center">
            <RotateCcw className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Select a batch to manage lab resets</p>
            <p className="text-xs text-muted-foreground mt-1">You can reset individual or all student VMs to any saved snapshot</p>
          </CardContent>
        </Card>
      )}

      {/* Reset Dialog */}
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
                : `This will reset ${resetTarget.student}'s VM (${resetTarget.vm}) to the selected snapshot state.`
              }
            </p>
            <div className="space-y-2">
              <Label>Restore to Snapshot</Label>
              <Select value={selectedSnapshot} onValueChange={setSelectedSnapshot}>
                <SelectTrigger><SelectValue placeholder="Choose a snapshot..." /></SelectTrigger>
                <SelectContent>
                  {currentSnapshots.map(snap => (
                    <SelectItem key={snap.id} value={snap.id}>
                      <div className="flex items-center gap-2">
                        {snap.isGolden && <Star className="h-3 w-3 text-primary" />}
                        {snap.name}
                        <span className="text-muted-foreground text-xs">({snap.size})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {resetTarget.type === "all" && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                <p>This action will affect all student VMs. Make sure students have saved their progress.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" disabled={!selectedSnapshot} onClick={handleReset}>
              <RotateCcw className="h-3 w-3 mr-1" /> {resetTarget.type === "all" ? "Reset All Labs" : "Reset Lab"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}