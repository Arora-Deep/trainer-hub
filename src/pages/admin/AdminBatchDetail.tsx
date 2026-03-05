import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useLabStore } from "@/stores/labStore";
import { TemplatePickerGrid } from "@/components/labs/TemplatePickerGrid";
import { VMDaySchedule } from "@/components/batches/VMDaySchedule";
import type { DaySchedule } from "@/components/batches/VMDaySchedule";
import { cn } from "@/lib/utils";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft, Users, Server, Settings, Calendar as CalendarIcon, Plus, Upload, Trash2,
  RefreshCw, Play, Square, Eye, Monitor, Layers, DollarSign, HardDrive, Zap, Shield,
} from "lucide-react";

interface VMEntry {
  id: string;
  templateId: string;
  instanceName: string;
  vmType: "single" | "multi";
  dateRange: { from: string; to: string };
  dailySchedules: DaySchedule[];
}

const batchData: Record<string, any> = {
  "B-001": {
    id: "B-001", batch: "K8s Batch #14", customer: "DevOps Academy", template: "Kubernetes Lab v2",
    seats: 30, runningLabs: 28, start: "2026-02-15", end: "2026-03-15", status: "running",
    description: "Advanced Kubernetes training for DevOps engineers", region: "ap-south-1", medium: "online",
    resources: { cpu: 120, ram: 240, disk: 1500 },
  },
  "B-002": {
    id: "B-002", batch: "ML Cohort #5", customer: "DataScience Bootcamp", template: "ML GPU Lab v1",
    seats: 25, runningLabs: 0, start: "2026-02-20", end: "2026-03-20", status: "scheduled",
    description: "Machine learning with GPU-accelerated labs", region: "ap-south-1", medium: "online",
    resources: { cpu: 200, ram: 800, disk: 2500 },
  },
  "B-003": {
    id: "B-003", batch: "Linux Fundamentals #8", customer: "Corporate L&D Co", template: "Linux + Networking",
    seats: 40, runningLabs: 38, start: "2026-02-10", end: "2026-03-10", status: "running",
    description: "Linux and networking fundamentals for corporate teams", region: "us-east-1", medium: "hybrid",
    resources: { cpu: 80, ram: 160, disk: 1200 },
  },
  "B-004": {
    id: "B-004", batch: "Docker Batch #3", customer: "SkillBridge Labs", template: "Docker Compose",
    seats: 20, runningLabs: 0, start: "2026-01-05", end: "2026-02-05", status: "completed",
    description: "Docker containerization workshop", region: "ap-south-1", medium: "online",
    resources: { cpu: 40, ram: 80, disk: 800 },
  },
  "B-005": {
    id: "B-005", batch: "AWS Batch #6", customer: "DevOps Academy", template: "AWS Simulation",
    seats: 35, runningLabs: 32, start: "2026-02-25", end: "2026-03-25", status: "running",
    description: "AWS cloud simulation with hands-on labs", region: "us-east-1", medium: "online",
    resources: { cpu: 140, ram: 560, disk: 2800 },
  },
  "B-006": {
    id: "B-006", batch: "Terraform Batch #2", customer: "SkillBridge Labs", template: "Linux + Networking",
    seats: 15, runningLabs: 0, start: "2026-03-10", end: "2026-04-10", status: "scheduled",
    description: "Infrastructure as Code with Terraform", region: "ap-south-1", medium: "offline",
    resources: { cpu: 30, ram: 60, disk: 450 },
  },
};

const studentsList = [
  { id: "S-001", name: "Arun Verma", email: "arun@example.com", vm: "VM-1001", vmStatus: "running", lastActive: "2 min ago" },
  { id: "S-002", name: "Sneha Rao", email: "sneha@example.com", vm: "VM-1002", vmStatus: "running", lastActive: "5 min ago" },
  { id: "S-003", name: "Rahul Gupta", email: "rahul@example.com", vm: "VM-1003", vmStatus: "stopped", lastActive: "1 hour ago" },
  { id: "S-004", name: "Kavitha S", email: "kavitha@example.com", vm: "VM-1004", vmStatus: "running", lastActive: "just now" },
  { id: "S-005", name: "Vikram Joshi", email: "vikram@example.com", vm: "VM-1005", vmStatus: "running", lastActive: "10 min ago" },
  { id: "S-006", name: "Priya M", email: "priya.m@example.com", vm: "—", vmStatus: "unassigned", lastActive: "—" },
  { id: "S-007", name: "Deepak Kumar", email: "deepak@example.com", vm: "VM-1007", vmStatus: "failed", lastActive: "30 min ago" },
  { id: "S-008", name: "Anjali Singh", email: "anjali@example.com", vm: "VM-1008", vmStatus: "running", lastActive: "3 min ago" },
];

const labInstances = [
  { id: "VM-1001", student: "Arun Verma", node: "node-mum-01", cpu: "45%", ram: "62%", status: "running", uptime: "3d 4h" },
  { id: "VM-1002", student: "Sneha Rao", node: "node-mum-01", cpu: "32%", ram: "55%", status: "running", uptime: "3d 4h" },
  { id: "VM-1003", student: "Rahul Gupta", node: "node-mum-02", cpu: "0%", ram: "0%", status: "stopped", uptime: "—" },
  { id: "VM-1004", student: "Kavitha S", node: "node-mum-02", cpu: "78%", ram: "81%", status: "running", uptime: "2d 12h" },
  { id: "VM-1005", student: "Vikram Joshi", node: "node-mum-03", cpu: "22%", ram: "40%", status: "running", uptime: "3d 4h" },
  { id: "VM-1007", student: "Deepak Kumar", node: "node-mum-03", cpu: "0%", ram: "0%", status: "failed", uptime: "—" },
  { id: "VM-1008", student: "Anjali Singh", node: "node-mum-01", cpu: "55%", ram: "68%", status: "running", uptime: "1d 8h" },
];

const statusColor: Record<string, string> = {
  running: "bg-green-500/10 text-green-600",
  scheduled: "bg-blue-500/10 text-blue-600",
  completed: "bg-muted text-muted-foreground",
  stopped: "bg-yellow-500/10 text-yellow-600",
  failed: "bg-destructive/10 text-destructive",
  unassigned: "bg-muted text-muted-foreground",
};

export default function AdminBatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates } = useLabStore();
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  // VM Configuration state for Labs tab
  const [showVMConfig, setShowVMConfig] = useState(false);
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [vmDateRange, setVmDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [vmDailySchedules, setVmDailySchedules] = useState<DaySchedule[]>([]);
  const [addedVMs, setAddedVMs] = useState<VMEntry[]>([]);

  const batch = batchData[id || ""] || batchData["B-001"];

  const handleAddVM = () => {
    if (!vmDateRange.from || !vmDateRange.to || !selectedTemplateId) return;
    const days = eachDayOfInterval({ start: vmDateRange.from, end: vmDateRange.to });
    const finalSchedules = days.map((day: Date) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const existing = vmDailySchedules.find(s => s.date === dateStr);
      return existing || { date: dateStr, startTime: "09:00", endTime: "18:00" };
    });
    const newVM: VMEntry = {
      id: `vme-${Date.now()}`,
      templateId: selectedTemplateId,
      instanceName: instanceName || "Unnamed VM",
      vmType,
      dateRange: { from: vmDateRange.from.toISOString(), to: vmDateRange.to.toISOString() },
      dailySchedules: finalSchedules,
    };
    setAddedVMs([...addedVMs, newVM]);
    setSelectedTemplateId("");
    setInstanceName("");
    setVmDateRange({ from: undefined, to: undefined });
    setVmDailySchedules([]);
    setShowVMConfig(false);
    toast({ title: "VM Added", description: `${newVM.instanceName} has been configured.` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/batches")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{batch.batch}</h1>
              <Badge className={`capitalize ${statusColor[batch.status]}`}>{batch.status}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">{batch.customer} · {batch.template} · {batch.region}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {batch.status === "running" && (
            <>
              <Button variant="outline" size="sm"><Square className="h-3 w-3 mr-1" /> Pause</Button>
              <Button variant="destructive" size="sm">End Batch</Button>
            </>
          )}
          {batch.status === "scheduled" && (
            <Button size="sm"><Play className="h-3 w-3 mr-1" /> Start Batch</Button>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Seats", value: batch.seats },
          { label: "Running Labs", value: batch.runningLabs },
          { label: "CPU Allocated", value: `${batch.resources.cpu} vCPU` },
          { label: "RAM Allocated", value: `${batch.resources.ram} GB` },
          { label: "Storage", value: `${batch.resources.disk} GB` },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="labs">Labs & VMs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Batch Details</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Description</span><span className="text-right max-w-[200px]">{batch.description}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span>{batch.start}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">End Date</span><span>{batch.end}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Medium</span><span className="capitalize">{batch.medium}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Region</span><span>{batch.region}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Resource Utilization</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "CPU", used: Math.round(batch.resources.cpu * 0.65), total: batch.resources.cpu, unit: "vCPU" },
                  { label: "RAM", used: Math.round(batch.resources.ram * 0.72), total: batch.resources.ram, unit: "GB" },
                  { label: "Disk", used: Math.round(batch.resources.disk * 0.45), total: batch.resources.disk, unit: "GB" },
                ].map(r => (
                  <div key={r.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{r.label}</span>
                      <span className="text-muted-foreground">{r.used} / {r.total} {r.unit}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(r.used / r.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{studentsList.length} students enrolled</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Upload className="h-3 w-3 mr-1" /> Import CSV</Button>
              <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-3 w-3 mr-1" /> Add Student</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2"><Label>Full Name</Label><Input placeholder="Student name..." /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="student@example.com" /></div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setAddStudentOpen(false)}>Cancel</Button>
                      <Button onClick={() => setAddStudentOpen(false)}>Add Student</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>VM</TableHead>
                    <TableHead>VM Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsList.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                      <TableCell className="text-sm font-mono">{s.vm}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs capitalize ${statusColor[s.vmStatus]}`}>{s.vmStatus}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {s.vmStatus === "unassigned" && <Button variant="outline" size="sm" className="text-xs">Assign VM</Button>}
                          {s.vmStatus === "failed" && <Button variant="outline" size="sm" className="text-xs"><RefreshCw className="h-3 w-3 mr-1" />Replace</Button>}
                          {s.vmStatus === "running" && <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>}
                          <Button variant="ghost" size="sm"><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labs & VMs Tab - with VM Configuration */}
        <TabsContent value="labs" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{labInstances.length} lab instances</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><RefreshCw className="h-3 w-3 mr-1" /> Refresh</Button>
              <Button variant="outline" size="sm" onClick={() => setShowVMConfig(!showVMConfig)}>
                <Plus className="h-3 w-3 mr-1" /> Configure VM
              </Button>
              <Button size="sm">Auto Assign All</Button>
            </div>
          </div>

          {/* Active Lab Instances Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VM ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Node</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>RAM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labInstances.map(l => (
                    <TableRow key={l.id}>
                      <TableCell className="text-sm font-mono">{l.id}</TableCell>
                      <TableCell className="text-sm">{l.student}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.node}</TableCell>
                      <TableCell className="text-sm">{l.cpu}</TableCell>
                      <TableCell className="text-sm">{l.ram}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs capitalize ${statusColor[l.status]}`}>{l.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{l.uptime}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm"><RefreshCw className="h-3 w-3" /></Button>
                          {l.status === "failed" && <Button variant="outline" size="sm" className="text-xs">Replace</Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Added VMs List */}
          {addedVMs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Configured VMs ({addedVMs.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {addedVMs.map((vm, index) => {
                  const tpl = templates.find(t => t.id === vm.templateId);
                  return (
                    <div key={vm.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{vm.instanceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {tpl?.name || "No template"} · {format(new Date(vm.dateRange.from), "MMM d")} – {format(new Date(vm.dateRange.to), "MMM d, yyyy")} · {vm.dailySchedules.length} day(s) · {vm.vmType}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setAddedVMs(addedVMs.filter((_, i) => i !== index))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                <Button size="sm" className="w-full">
                  <Play className="h-3 w-3 mr-1" /> Provision All VMs
                </Button>
              </CardContent>
            </Card>
          )}

          {/* VM Configuration Panel */}
          {showVMConfig && (
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Add VM Configuration</h3>
                  <p className="text-sm text-muted-foreground">Configure a new VM environment for this batch</p>
                </div>
              </div>

              {/* VM Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    VM Type
                  </CardTitle>
                  <CardDescription>Choose how many VMs each participant gets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setVmType("single")}
                      className={cn(
                        "p-5 rounded-xl border-2 text-left transition-all",
                        vmType === "single" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <Monitor className="h-6 w-6 mb-2 text-primary" />
                      <h4 className="font-semibold">Single VM</h4>
                      <p className="text-xs text-muted-foreground mt-1">One VM per participant</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVmType("multi")}
                      className={cn(
                        "p-5 rounded-xl border-2 text-left transition-all",
                        vmType === "multi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <Layers className="h-6 w-6 mb-2 text-primary" />
                      <h4 className="font-semibold">Multi VM</h4>
                      <p className="text-xs text-muted-foreground mt-1">2-3 VMs per participant</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    VM Template
                  </CardTitle>
                  <CardDescription>Select template and name your instance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border bg-muted/10 space-y-4">
                    <div className="space-y-3">
                      <Label className="text-xs">Select Template</Label>
                      <TemplatePickerGrid
                        templates={templates}
                        selectedId={selectedTemplateId}
                        onSelect={(template) => setSelectedTemplateId(template.id)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Instance Name</Label>
                      <Input
                        placeholder="e.g., Web Server, Database, etc."
                        value={instanceName}
                        onChange={(e) => setInstanceName(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VM Date Range Calendar */}
              <Card>
                <CardContent className="pt-8 pb-6 flex flex-col items-center">
                  <div className="text-center mb-6">
                    <h2 className="text-lg font-semibold">Choose VM availability dates</h2>
                    {vmDateRange.from && vmDateRange.to ? (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">
                          {format(vmDateRange.from, "MMM d, yyyy")} — {format(vmDateRange.to, "MMM d, yyyy")} ({differenceInDays(vmDateRange.to, vmDateRange.from) + 1} days)
                        </p>
                        <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto py-0.5 px-1.5" onClick={() => setVmDateRange({ from: undefined, to: undefined })}>
                          Clear
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">Select a start date, then an end date</p>
                    )}
                  </div>
                  <Calendar
                    mode="range"
                    selected={vmDateRange as DateRange}
                    onSelect={(range) => setVmDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    className="p-4 pointer-events-auto"
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </CardContent>
              </Card>

              {/* Per-Day Timings */}
              {vmDateRange.from && vmDateRange.to && (
                <VMDaySchedule
                  dateRange={{ from: vmDateRange.from, to: vmDateRange.to }}
                  dailySchedules={vmDailySchedules}
                  onChange={setVmDailySchedules}
                />
              )}

              {/* Add VM Button */}
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!vmDateRange.from || !vmDateRange.to || !selectedTemplateId}
                  onClick={handleAddVM}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add VM
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowVMConfig(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Batch Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span>{batch.start}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">End Date</span><span>{batch.end}</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{Math.ceil((new Date(batch.end).getTime() - new Date(batch.start).getTime()) / (1000 * 60 * 60 * 24))} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Remaining</span>
                <span>{Math.max(0, Math.ceil((new Date(batch.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days</span>
              </div>
              <div className="pt-3 border-t">
                <div className="h-3 rounded-full bg-muted relative">
                  <div
                    className="h-3 rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((Date.now() - new Date(batch.start).getTime()) / (new Date(batch.end).getTime() - new Date(batch.start).getTime())) * 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{batch.start}</span>
                  <span>{batch.end}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Batch Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Batch Name</Label><Input defaultValue={batch.batch} /></div>
                <div className="space-y-2"><Label>Seat Count</Label><Input type="number" defaultValue={batch.seats} /></div>
                <div className="space-y-2"><Label>End Date</Label><Input type="date" defaultValue={batch.end} /></div>
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select defaultValue={batch.template}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={batch.template}>{batch.template}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button>Save Changes</Button>
                <Button variant="outline">Extend Batch</Button>
                <Button variant="outline">Pause Batch</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm text-destructive">Danger Zone</CardTitle></CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="destructive" size="sm">Terminate All Labs</Button>
              <Button variant="destructive" size="sm">Delete Batch</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
