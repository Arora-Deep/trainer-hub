import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, Calendar, Megaphone, Users, AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCustomerStore } from "@/stores/customerStore";

interface MaintenanceWindow {
  id: string;
  scope: string;
  start: string;
  end: string;
  reason: string;
  announcement: string;
  targets: string;
  status: "scheduled" | "active" | "completed";
}

const initialWindows: MaintenanceWindow[] = [
  { id: "MW-001", scope: "gpu-mumbai-1", start: "2026-05-18 02:00", end: "2026-05-18 06:00", reason: "Firmware upgrade on GPU drivers", announcement: "Scheduled maintenance, GPU labs unavailable", targets: "ML Cohort #5", status: "scheduled" },
  { id: "MW-002", scope: "storage-eu-west-1", start: "2026-05-12 23:00", end: "2026-05-13 01:00", reason: "Disk replacement", announcement: "EU customers may see brief lab unavailability", targets: "All EU tenants", status: "active" },
];

export default function MaintenanceMode() {
  const { customers } = useCustomerStore();
  const [windows, setWindows] = useState(initialWindows);
  const [form, setForm] = useState({
    scope: "",
    startDate: "",
    startTime: "02:00",
    endDate: "",
    endTime: "06:00",
    reason: "",
    announcement: "",
    notifyAll: true,
    notifyCustomers: [] as string[],
    notifyTrainers: true,
    notifyStudents: true,
    notifyAdmins: true,
    severity: "info" as "info" | "warning" | "critical",
    autoStartMaintenance: false,
  });

  const update = (k: keyof typeof form, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const toggleCust = (id: string) => setForm((f) => ({
    ...f,
    notifyCustomers: f.notifyCustomers.includes(id) ? f.notifyCustomers.filter((x) => x !== id) : [...f.notifyCustomers, id],
  }));

  const handleSchedule = () => {
    if (!form.scope || !form.startDate || !form.endDate) {
      toast({ title: "Missing fields", description: "Scope, start and end are required" });
      return;
    }
    const w: MaintenanceWindow = {
      id: `MW-${String(windows.length + 1).padStart(3, "0")}`,
      scope: form.scope,
      start: `${form.startDate} ${form.startTime}`,
      end: `${form.endDate} ${form.endTime}`,
      reason: form.reason,
      announcement: form.announcement,
      targets: form.notifyAll ? "All customers" : `${form.notifyCustomers.length} customers`,
      status: "scheduled",
    };
    setWindows((ws) => [w, ...ws]);
    toast({ title: "Maintenance Scheduled", description: `${w.id} for ${form.scope}` });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Maintenance Mode</h1>
        <p className="text-muted-foreground text-sm mt-1">Schedule maintenance, send announcements, and control portal-wide downtime</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Wrench className="h-4 w-4" /> Schedule Maintenance</CardTitle>
            <CardDescription className="text-xs">Define scope, time window, reason and announcement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs">Scope</Label>
              <Select value={form.scope} onValueChange={(v) => update("scope", v)}>
                <SelectTrigger><SelectValue placeholder="Select node / cluster / region..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">⚠ Entire Platform</SelectItem>
                  <SelectItem value="cls-mum">Cluster: ap-south-1 / Mumbai</SelectItem>
                  <SelectItem value="cls-vir">Cluster: us-east-1 / Virginia</SelectItem>
                  <SelectItem value="cls-gpu">Cluster: GPU Pool</SelectItem>
                  <SelectItem value="compute-mumbai-1">Node: compute-mumbai-1</SelectItem>
                  <SelectItem value="compute-mumbai-2">Node: compute-mumbai-2</SelectItem>
                  <SelectItem value="gpu-mumbai-1">Node: gpu-mumbai-1</SelectItem>
                  <SelectItem value="storage-eu-west-1">Node: storage-eu-west-1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Window</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">Start</Label>
                  <div className="flex gap-2">
                    <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
                    <Input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} className="w-32" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">End</Label>
                  <div className="flex gap-2">
                    <Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
                    <Input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} className="w-32" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Internal Reason / Description</Label>
              <Textarea value={form.reason} onChange={(e) => update("reason", e.target.value)} placeholder="Firmware upgrade, kernel patch, hardware replacement, etc." rows={2} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5"><Megaphone className="h-3 w-3" /> Announcement Message (sent to portals)</Label>
              <Textarea value={form.announcement} onChange={(e) => update("announcement", e.target.value)} placeholder="We will be performing scheduled maintenance on... Your labs may be temporarily unavailable." rows={3} />
              <div className="flex items-center gap-2">
                <Label className="text-[10px] text-muted-foreground">Severity:</Label>
                {(["info", "warning", "critical"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => update("severity", s)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${form.severity === s ? (s === "critical" ? "bg-destructive/10 text-destructive border-destructive/30" : s === "warning" ? "bg-warning/10 text-warning border-warning/30" : "bg-primary/10 text-primary border-primary/30") : "text-muted-foreground"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 p-3 rounded-lg border bg-muted/30">
              <Label className="text-xs flex items-center gap-1.5"><Users className="h-3 w-3" /> Notify</Label>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <label className="flex items-center gap-2"><Checkbox checked={form.notifyAdmins} onCheckedChange={(v) => update("notifyAdmins", !!v)} /> Admins</label>
                <label className="flex items-center gap-2"><Checkbox checked={form.notifyTrainers} onCheckedChange={(v) => update("notifyTrainers", !!v)} /> Trainers</label>
                <label className="flex items-center gap-2"><Checkbox checked={form.notifyStudents} onCheckedChange={(v) => update("notifyStudents", !!v)} /> Students</label>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Notify all customers</Label>
                <Switch checked={form.notifyAll} onCheckedChange={(v) => update("notifyAll", v)} />
              </div>
              {!form.notifyAll && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto border rounded p-2 bg-background">
                  {customers.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={form.notifyCustomers.includes(c.id)} onCheckedChange={() => toggleCust(c.id)} />
                      {c.name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <Label className="text-sm">Auto-enter maintenance at start time</Label>
                <p className="text-[10px] text-muted-foreground">VMs on scope will be paused and console disabled</p>
              </div>
              <Switch checked={form.autoStartMaintenance} onCheckedChange={(v) => update("autoStartMaintenance", v)} />
            </div>

            <Button className="w-full gap-2" onClick={handleSchedule}><Wrench className="h-4 w-4" /> Schedule Maintenance Window</Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Active & Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {windows.map((w) => (
              <div key={w.id} className="p-2.5 rounded-lg border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono">{w.id}</span>
                  <Badge variant="secondary" className={`text-[10px] capitalize ${w.status === "active" ? "bg-destructive/10 text-destructive" : w.status === "scheduled" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{w.status}</Badge>
                </div>
                <div className="text-sm font-medium">{w.scope}</div>
                <div className="text-[11px] text-muted-foreground">{w.start} → {w.end}</div>
                <div className="text-[11px]">{w.reason}</div>
                <div className="flex justify-end">
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={() => setWindows((ws) => ws.filter((x) => x.id !== w.id))}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
