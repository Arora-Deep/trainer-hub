import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Save, CalendarDays, Pause, Play, CheckCircle2, Users, Monitor,
  AlertTriangle, Clock, ArrowRight,
} from "lucide-react";

const batches = [
  { id: "B-001", name: "K8s Batch #14", customer: "DevOps Academy", seats: 30, template: "Kubernetes Lab v2", endDate: "2026-03-15", status: "running", runningLabs: 28, failedLabs: 1, students: 30, lastActivity: "2 min ago" },
  { id: "B-002", name: "ML Cohort #5", customer: "DataScience Bootcamp", seats: 25, template: "ML GPU Lab v1", endDate: "2026-04-20", status: "scheduled", runningLabs: 0, failedLabs: 0, students: 18, lastActivity: "1 hour ago" },
  { id: "B-003", name: "Linux Fundamentals #8", customer: "Corporate L&D Co", seats: 40, template: "Linux + Networking", endDate: "2026-03-10", status: "running", runningLabs: 38, failedLabs: 2, students: 40, lastActivity: "30 sec ago" },
  { id: "B-004", name: "AWS Batch #6", customer: "DevOps Academy", seats: 35, template: "AWS Simulation", endDate: "2026-03-25", status: "running", runningLabs: 32, failedLabs: 1, students: 34, lastActivity: "5 min ago" },
];

export default function ModifyBatch() {
  const [selectedId, setSelectedId] = useState("");
  const batch = batches.find(b => b.id === selectedId);
  const [form, setForm] = useState({ batchName: "", endDate: "", seatCount: "", template: "" });

  const selectBatch = (id: string) => {
    const b = batches.find(x => x.id === id);
    if (b) {
      setSelectedId(id);
      setForm({ batchName: b.name, endDate: b.endDate, seatCount: String(b.seats), template: b.template });
    }
  };

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Modify Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Adjust configuration for running batches</p>
      </div>

      {/* Batch Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Select Batch</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedId} onValueChange={selectBatch}>
            <SelectTrigger><SelectValue placeholder="Choose a batch to modify..." /></SelectTrigger>
            <SelectContent>
              {batches.map(b => (
                <SelectItem key={b.id} value={b.id}>
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${b.status === "running" ? "bg-green-500" : "bg-amber-500"}`} />
                    {b.name} — {b.customer}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {batch && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="text-xl font-bold">{batch.students}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10"><Monitor className="h-4 w-4 text-green-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Running Labs</p>
                  <p className="text-xl font-bold">{batch.runningLabs}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10"><AlertTriangle className="h-4 w-4 text-red-600" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Failed Labs</p>
                  <p className="text-xl font-bold">{batch.failedLabs}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted"><Clock className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Activity</p>
                  <p className="text-sm font-bold">{batch.lastActivity}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editable Fields */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader><CardTitle className="text-base">Editable Fields</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Batch Name</Label>
                      <Input value={form.batchName} onChange={e => update("batchName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Seat Count</Label>
                      <Input type="number" value={form.seatCount} onChange={e => update("seatCount", e.target.value)} min={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Template</Label>
                      <Input value={form.template} onChange={e => update("template", e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Batch Controls */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Batch Controls</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start gap-2" onClick={() => toast({ title: "Saved", description: "Batch updated." })}>
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CalendarDays className="h-4 w-4" /> Extend Batch
                </Button>
                {batch.status === "running" && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Pause className="h-4 w-4" /> Pause Batch
                  </Button>
                )}
                {batch.status === "scheduled" && (
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Play className="h-4 w-4" /> Resume Batch
                  </Button>
                )}
                <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                  <CheckCircle2 className="h-4 w-4" /> Complete Batch
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
