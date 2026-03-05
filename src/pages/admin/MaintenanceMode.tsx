import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MaintenanceMode() {
  const [form, setForm] = useState({ node: "", startTime: "", endTime: "", reason: "" });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maintenance Mode</h1>
        <p className="text-muted-foreground text-sm mt-1">Schedule maintenance for nodes or clusters</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Schedule Maintenance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Node</Label>
            <Select value={form.node} onValueChange={v => update("node", v)}>
              <SelectTrigger><SelectValue placeholder="Select node..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compute-mumbai-1">compute-mumbai-1</SelectItem>
                <SelectItem value="compute-mumbai-2">compute-mumbai-2</SelectItem>
                <SelectItem value="compute-mumbai-3">compute-mumbai-3</SelectItem>
                <SelectItem value="compute-virginia-1">compute-virginia-1</SelectItem>
                <SelectItem value="gpu-mumbai-1">gpu-mumbai-1</SelectItem>
                <SelectItem value="storage-eu-west-1">storage-eu-west-1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Time</Label><Input type="datetime-local" value={form.startTime} onChange={e => update("startTime", e.target.value)} /></div>
            <div className="space-y-2"><Label>End Time</Label><Input type="datetime-local" value={form.endTime} onChange={e => update("endTime", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Textarea value={form.reason} onChange={e => update("reason", e.target.value)} placeholder="Describe the maintenance activity..." /></div>
          <Button>Enable Maintenance Mode</Button>
        </CardContent>
      </Card>
    </div>
  );
}
