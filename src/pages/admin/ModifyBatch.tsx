import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ModifyBatch() {
  const [form, setForm] = useState({
    batchName: "K8s Batch #14", endDate: "2026-03-15", seatCount: "30", template: "Kubernetes Lab v2",
  });
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modify Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Edit batch configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Editable Fields</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Batch Name</Label><Input value={form.batchName} onChange={e => update("batchName", e.target.value)} /></div>
          <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)} /></div>
          <div className="space-y-2"><Label>Seat Count</Label><Input type="number" value={form.seatCount} onChange={e => update("seatCount", e.target.value)} /></div>
          <div className="space-y-2"><Label>Template</Label><Input value={form.template} onChange={e => update("template", e.target.value)} /></div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button>Save</Button>
        <Button variant="outline">Extend Batch</Button>
        <Button variant="outline" className="text-warning">Pause Batch</Button>
      </div>
    </div>
  );
}
