import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import {
  Save, CalendarDays, Pause, Play, CheckCircle2, Users, Monitor,
  AlertTriangle, RotateCcw, Camera, Star, Trash2, RefreshCw, ArrowLeft,
  CalendarPlus, Clock,
} from "lucide-react";

export default function ModifyBatch() {
  const navigate = useNavigate();
  const {
    batches, updateBatch, deleteBatch,
    resetAllVMs, recloneAllVMs, createSnapshot, setGoldenSnapshot,
  } = useBatchStore();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const presetBatchId = params.get("batchId") || "";

  const [selectedId, setSelectedId] = useState(presetBatchId);
  const batch = batches.find((b) => b.id === selectedId);

  const [form, setForm] = useState({
    name: "", description: "", endDate: "", seatCount: 0, additionalDetails: "",
    published: false, certification: false, allowSelfEnrollment: false,
    instructors: "",
  });

  useEffect(() => {
    if (batch) {
      setForm({
        name: batch.name,
        description: batch.description,
        endDate: batch.endDate?.slice(0, 10) || "",
        seatCount: batch.seatCount,
        additionalDetails: batch.additionalDetails,
        published: batch.settings.published,
        certification: batch.settings.certification,
        allowSelfEnrollment: batch.settings.allowSelfEnrollment,
        instructors: batch.instructors.join(", "),
      });
    }
  }, [selectedId]); // eslint-disable-line

  const [confirmAction, setConfirmAction] = useState<null | "delete" | "complete" | "pause" | "resume" | "resetAll" | "recloneAll">(null);
  const [snapName, setSnapName] = useState("");
  const [snapOpen, setSnapOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(7);
  const [prepOpen, setPrepOpen] = useState(false);
  const [prepDays, setPrepDays] = useState(2);
  const [freeDays, setFreeDays] = useState(0);

  const snapshots = batch?.vmConfig?.snapshots || [];
  const goldenId = batch?.vmConfig?.goldenSnapshotId;

  const handleSave = () => {
    if (!batch) return;
    updateBatch(batch.id, {
      name: form.name,
      description: form.description,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : batch.endDate,
      seatCount: Number(form.seatCount) || batch.seatCount,
      additionalDetails: form.additionalDetails,
      instructors: form.instructors.split(",").map((s) => s.trim()).filter(Boolean),
      settings: {
        published: form.published,
        certification: form.certification,
        allowSelfEnrollment: form.allowSelfEnrollment,
      },
    });
    toast({ title: "Saved", description: "Batch updated successfully." });
  };

  const runConfirm = () => {
    if (!batch) return;
    switch (confirmAction) {
      case "delete":
        deleteBatch(batch.id);
        toast({ title: "Batch Deleted" });
        navigate("/admin/batches");
        break;
      case "complete":
        updateBatch(batch.id, { status: "completed" });
        toast({ title: "Batch Completed" });
        break;
      case "pause":
        updateBatch(batch.id, { status: "upcoming" });
        toast({ title: "Batch Paused" });
        break;
      case "resume":
        updateBatch(batch.id, { status: "live" });
        toast({ title: "Batch Resumed" });
        break;
      case "resetAll":
        if (goldenId) { resetAllVMs(batch.id, goldenId); toast({ title: "Resetting All VMs" }); }
        break;
      case "recloneAll":
        recloneAllVMs(batch.id); toast({ title: "Re-cloning All VMs" });
        break;
    }
    setConfirmAction(null);
  };

  const handleSnapshot = () => {
    if (!batch || !snapName.trim()) return;
    createSnapshot(batch.id, snapName.trim(), "Created from Modify Batch page");
    toast({ title: "Snapshot Created", description: snapName });
    setSnapName("");
    setSnapOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Back</Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Modify Batch</h1>
          <p className="text-muted-foreground text-sm mt-1">Adjust configuration and lifecycle for a batch</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Select Batch</CardTitle></CardHeader>
        <CardContent>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger><SelectValue placeholder="Choose a batch to modify..." /></SelectTrigger>
            <SelectContent>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${b.status === "live" ? "bg-green-500" : b.status === "upcoming" ? "bg-amber-500" : "bg-muted-foreground"}`} />
                    {b.name}
                    <Badge variant="secondary" className="text-[10px] capitalize">{b.status}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {batch && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Participants</p><p className="text-xl font-bold">{batch.participants.length}</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><Monitor className="h-4 w-4 text-green-600" /></div>
              <div><p className="text-xs text-muted-foreground">Running VMs</p><p className="text-xl font-bold">{batch.vmConfig?.participantVMs.filter(v => v.status === "running").length ?? 0}</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10"><AlertTriangle className="h-4 w-4 text-red-600" /></div>
              <div><p className="text-xs text-muted-foreground">Failed VMs</p><p className="text-xl font-bold">{batch.vmConfig?.participantVMs.filter(v => v.status === "error").length ?? 0}</p></div>
            </CardContent></Card>
            <Card><CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted"><Camera className="h-4 w-4 text-muted-foreground" /></div>
              <div><p className="text-xs text-muted-foreground">Snapshots</p><p className="text-xl font-bold">{snapshots.length}</p></div>
            </CardContent></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Editable Fields</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Batch Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Seat Count</Label><Input type="number" value={form.seatCount} onChange={(e) => setForm({ ...form, seatCount: parseInt(e.target.value) || 0 })} min={1} /></div>
                    <div className="space-y-2"><Label>Instructors (comma-separated)</Label><Input value={form.instructors} onChange={(e) => setForm({ ...form, instructors: e.target.value })} /></div>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Additional Details</Label><Textarea rows={2} value={form.additionalDetails} onChange={(e) => setForm({ ...form, additionalDetails: e.target.value })} /></div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Published</Label><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /></div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Certification</Label><Switch checked={form.certification} onCheckedChange={(v) => setForm({ ...form, certification: v })} /></div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Self Enroll</Label><Switch checked={form.allowSelfEnrollment} onCheckedChange={(v) => setForm({ ...form, allowSelfEnrollment: v })} /></div>
                  </div>
                </CardContent>
              </Card>

              {snapshots.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Camera className="h-4 w-4" /> Snapshots</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {snapshots.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg border">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{s.name}</span>
                          {s.id === goldenId && <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary gap-1"><Star className="h-2.5 w-2.5" /> Golden</Badge>}
                          <span className="text-xs text-muted-foreground">{s.size}</span>
                        </div>
                        {s.id !== goldenId && (
                          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setGoldenSnapshot(batch.id, s.id); toast({ title: "Golden Set", description: s.name }); }}>
                            <Star className="h-3 w-3" /> Set Golden
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="h-fit">
              <CardHeader><CardTitle className="text-sm">Batch Controls</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" onClick={handleSave}><Save className="h-4 w-4" /> Save Changes</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setSnapOpen(true)}><Camera className="h-4 w-4" /> Take Snapshot</Button>
                {batch.status === "live" && (
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("pause")}><Pause className="h-4 w-4" /> Pause Batch</Button>
                )}
                {batch.status === "upcoming" && (
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("resume")}><Play className="h-4 w-4" /> Mark Live</Button>
                )}
                <Button variant="outline" className="w-full justify-start gap-2" disabled={!goldenId} onClick={() => setConfirmAction("resetAll")}><RotateCcw className="h-4 w-4" /> Reset All Labs</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("recloneAll")}><RefreshCw className="h-4 w-4" /> Reclone All VMs</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setConfirmAction("complete")}><CheckCircle2 className="h-4 w-4" /> Complete Batch</Button>
                <div className="border-t my-2" />
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" onClick={() => setConfirmAction("delete")}><Trash2 className="h-4 w-4" /> Delete Batch</Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Confirm action
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {confirmAction === "delete" && "This will permanently delete the batch and all its data."}
            {confirmAction === "complete" && "Mark this batch as completed? Students will lose VM access."}
            {confirmAction === "pause" && "Pause the batch? Status will change to upcoming."}
            {confirmAction === "resume" && "Mark this batch as live?"}
            {confirmAction === "resetAll" && "Reset every participant VM to the golden snapshot. Unsaved work will be lost."}
            {confirmAction === "recloneAll" && "Re-clone every participant VM from the golden snapshot."}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button variant={confirmAction === "delete" ? "destructive" : "default"} onClick={runConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={snapOpen} onOpenChange={setSnapOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Take Snapshot</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Snapshot Name</Label>
            <Input value={snapName} onChange={(e) => setSnapName(e.target.value)} placeholder="e.g. Pre-exam baseline" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSnapOpen(false)}>Cancel</Button>
            <Button disabled={!snapName.trim()} onClick={handleSnapshot}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
