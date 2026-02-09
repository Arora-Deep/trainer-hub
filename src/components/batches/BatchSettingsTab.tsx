import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Settings, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Batch } from "@/stores/batchStore";
import { useBatchStore } from "@/stores/batchStore";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

interface BatchSettingsTabProps {
  batch: Batch;
}

export function BatchSettingsTab({ batch }: BatchSettingsTabProps) {
  const { updateBatch, deleteBatch } = useBatchStore();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState(batch.name);
  const [description, setDescription] = useState(batch.description);
  const [seatCount, setSeatCount] = useState(batch.seatCount);
  const [medium, setMedium] = useState(batch.medium);
  const [additionalDetails, setAdditionalDetails] = useState(batch.additionalDetails);
  const [published, setPublished] = useState(batch.settings.published);
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(batch.settings.allowSelfEnrollment);
  const [certification, setCertification] = useState(batch.settings.certification);

  const handleSave = () => {
    updateBatch(batch.id, {
      name: name.trim(),
      description: description.trim(),
      seatCount,
      medium,
      additionalDetails: additionalDetails.trim(),
      settings: { published, allowSelfEnrollment, certification },
    });
    toast({ title: "Saved", description: "Batch settings updated successfully." });
  };

  const handleDelete = () => {
    deleteBatch(batch.id);
    toast({ title: "Deleted", description: "Batch has been deleted." });
    navigate("/batches");
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Edit batch name, description, and capacity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="batchName">Batch Name</Label>
              <Input id="batchName" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seatCount">Seat Count</Label>
              <Input id="seatCount" type="number" min={1} value={seatCount} onChange={(e) => setSeatCount(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="batchDesc">Description</Label>
            <Textarea id="batchDesc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Delivery Medium</Label>
              <Select value={medium} onValueChange={(v) => setMedium(v as typeof medium)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Additional Details</Label>
              <Textarea id="additionalDetails" value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} className="min-h-[80px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Batch Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="font-medium text-sm">Published</p><p className="text-xs text-muted-foreground">Make this batch visible to students</p></div>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="font-medium text-sm">Allow Self-Enrollment</p><p className="text-xs text-muted-foreground">Let students enroll themselves</p></div>
            <Switch checked={allowSelfEnrollment} onCheckedChange={setAllowSelfEnrollment} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div><p className="font-medium text-sm">Certification</p><p className="text-xs text-muted-foreground">Issue certificates on completion</p></div>
            <Switch checked={certification} onCheckedChange={setCertification} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Batch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Batch</DialogTitle>
              <DialogDescription>Are you sure? This action cannot be undone. All students, VMs, and announcements will be removed.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
