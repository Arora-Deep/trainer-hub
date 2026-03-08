import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";
import { useLabStore } from "@/stores/labStore";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import {
  Check, ChevronRight, Building2, FileText, Server, ClipboardList,
  Users, CalendarDays, Monitor, Cpu, HardDrive, MemoryStick, Shield, Clock,
} from "lucide-react";

const steps = [
  { id: 1, label: "Customer", icon: Building2 },
  { id: 2, label: "Batch Info", icon: FileText },
  { id: 3, label: "Lab Environment", icon: Server },
  { id: 4, label: "Review", icon: ClipboardList },
];

const labTemplates = [
  { id: "tpl-1", name: "Linux DevOps Lab", os: "Ubuntu 22.04", cpu: 4, ram: 8, disk: 50 },
  { id: "tpl-2", name: "Kubernetes Lab v2", os: "Ubuntu 22.04", cpu: 8, ram: 16, disk: 100 },
  { id: "tpl-3", name: "ML GPU Lab v1", os: "Ubuntu 22.04", cpu: 16, ram: 64, disk: 200 },
  { id: "tpl-4", name: "Docker Compose", os: "Ubuntu 22.04", cpu: 4, ram: 8, disk: 40 },
  { id: "tpl-5", name: "AWS Simulation", os: "Amazon Linux", cpu: 8, ram: 16, disk: 80 },
  { id: "tpl-6", name: "Linux + Networking", os: "CentOS 9", cpu: 4, ram: 4, disk: 30 },
];

const isos = [
  { id: "iso-1", name: "Ubuntu 22.04 LTS" },
  { id: "iso-2", name: "CentOS 9 Stream" },
  { id: "iso-3", name: "Windows Server 2022" },
  { id: "iso-4", name: "Rocky Linux 9" },
];

const regions = [
  { value: "ap-south-1", label: "ap-south-1 (Mumbai)" },
  { value: "us-east-1", label: "us-east-1 (Virginia)" },
  { value: "eu-west-1", label: "eu-west-1 (Ireland)" },
  { value: "ap-southeast-1", label: "ap-southeast-1 (Singapore)" },
];

export default function AdminCreateBatch() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerId: "",
    batchName: "",
    description: "",
    seatCount: "20",
    envType: "template" as "template" | "iso",
    templateId: "",
    isoId: "",
    region: "ap-south-1",
    vmCpu: "4",
    vmRam: "8",
    vmDisk: "50",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const selectedCustomer = customers.find(c => c.id === form.customerId);
  const selectedTemplate = labTemplates.find(t => t.id === form.templateId);

  const canNext = () => {
    if (step === 1) return !!form.customerId;
    if (step === 2) return !!form.batchName && !!dateRange?.from && !!dateRange?.to;
    if (step === 3) return form.envType === "template" ? !!form.templateId : !!form.isoId;
    return true;
  };

  const handleCreate = () => {
    toast({ title: "Batch Created", description: `${form.batchName} has been created successfully.` });
    navigate("/admin/batches");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Set up a new training batch step by step</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => isDone && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive && "bg-primary text-primary-foreground",
                  isDone && "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20",
                  !isActive && !isDone && "text-muted-foreground"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                {s.label}
              </button>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground/40" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Customer */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" /> Select Customer</CardTitle>
                <CardDescription>Choose the customer for this training batch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select value={form.customerId} onValueChange={v => update("customerId", v)}>
                    <SelectTrigger><SelectValue placeholder="Search and select customer..." /></SelectTrigger>
                    <SelectContent>
                      {customers.filter(c => c.status === "active" || c.status === "trial").map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            {c.name}
                            <Badge variant="secondary" className="text-[10px] ml-1 capitalize">{c.status}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCustomer && (
                  <div className="p-4 rounded-xl border bg-muted/30 space-y-2 text-sm">
                    <p className="font-semibold">{selectedCustomer.name}</p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div><span className="text-muted-foreground">Region:</span> <span className="font-medium">{selectedCustomer.regions?.[0] || "—"}</span></div>
                      <div><span className="text-muted-foreground">SLA:</span> <span className="font-medium capitalize">{selectedCustomer.slaTier}</span></div>
                      <div><span className="text-muted-foreground">Quota CPU:</span> <span className="font-medium">{selectedCustomer.quota.cpu} vCPU</span></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Batch Info */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Batch Information</CardTitle>
                  <CardDescription>Configure batch name, seats, and schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Batch Name *</Label>
                      <Input value={form.batchName} onChange={e => update("batchName", e.target.value)} placeholder="e.g. K8s Batch #15" />
                    </div>
                    <div className="space-y-2">
                      <Label>Seat Count *</Label>
                      <Input type="number" value={form.seatCount} onChange={e => update("seatCount", e.target.value)} min={1} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Brief description of this batch..." rows={2} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Schedule</CardTitle>
                  <CardDescription>Select start and end dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-muted-foreground">
                          Start: {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "Select"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary/50" />
                        <span className="text-muted-foreground">
                          End: {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "Select"}
                        </span>
                      </div>
                      {dateRange?.from && dateRange?.to && (
                        <Badge variant="secondary">
                          {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
                        </Badge>
                      )}
                    </div>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Lab Environment */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4" /> Lab Environment</CardTitle>
                  <CardDescription>Select template or ISO for lab environments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Template vs ISO toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => update("envType", "template")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        form.envType === "template" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <Monitor className="h-5 w-5 mb-2 text-primary" />
                      <h4 className="font-semibold text-sm">Lab Template</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Pre-configured environment</p>
                    </button>
                    <button
                      onClick={() => update("envType", "iso")}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        form.envType === "iso" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      )}
                    >
                      <HardDrive className="h-5 w-5 mb-2 text-primary" />
                      <h4 className="font-semibold text-sm">ISO Image</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Boot from custom ISO</p>
                    </button>
                  </div>

                  {/* Template Selection */}
                  {form.envType === "template" && (
                    <div className="space-y-3">
                      <Label>Select Template</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {labTemplates.map(t => (
                          <button
                            key={t.id}
                            onClick={() => {
                              update("templateId", t.id);
                              update("vmCpu", String(t.cpu));
                              update("vmRam", String(t.ram));
                              update("vmDisk", String(t.disk));
                            }}
                            className={cn(
                              "p-4 rounded-xl border-2 text-left transition-all",
                              form.templateId === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                            )}
                          >
                            <p className="font-semibold text-sm">{t.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t.os}</p>
                            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                              <span>{t.cpu} vCPU</span>
                              <span>{t.ram} GB RAM</span>
                              <span>{t.disk} GB</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ISO Selection */}
                  {form.envType === "iso" && (
                    <div className="space-y-2">
                      <Label>Select ISO</Label>
                      <Select value={form.isoId} onValueChange={v => update("isoId", v)}>
                        <SelectTrigger><SelectValue placeholder="Choose an ISO..." /></SelectTrigger>
                        <SelectContent>
                          {isos.map(iso => <SelectItem key={iso.id} value={iso.id}>{iso.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Region & VM Specs */}
                  <div className="border-t pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Region</Label>
                      <Select value={form.region} onValueChange={v => update("region", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {regions.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground mb-2 block">Default VM Specs</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">CPU (vCPU)</Label>
                          <Input type="number" value={form.vmCpu} onChange={e => update("vmCpu", e.target.value)} min={1} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">RAM (GB)</Label>
                          <Input type="number" value={form.vmRam} onChange={e => update("vmRam", e.target.value)} min={1} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Disk (GB)</Label>
                          <Input type="number" value={form.vmDisk} onChange={e => update("vmDisk", e.target.value)} min={10} />
                        </div>
                      </div>
                    </div>

                    {/* Prep Period Note */}
                    {dateRange?.from && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5">
                        <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-amber-700">Admin VM Prep Period</p>
                          <p className="text-xs text-amber-600 mt-0.5">
                            The Admin/Trainer VM can be provisioned from <strong>{format(subDays(dateRange.from, 2), "MMM dd, yyyy")}</strong> — 2 days before batch start. Use this time to configure the environment before cloning to students.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview Card */}
                  {(selectedTemplate || form.envType === "iso") && (
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">VM Preview</p>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="text-center p-3 rounded-lg bg-background border">
                          <Cpu className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-lg font-bold">{form.vmCpu}</p>
                          <p className="text-xs text-muted-foreground">vCPU</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background border">
                          <MemoryStick className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-lg font-bold">{form.vmRam}</p>
                          <p className="text-xs text-muted-foreground">GB RAM</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background border">
                          <HardDrive className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-lg font-bold">{form.vmDisk}</p>
                          <p className="text-xs text-muted-foreground">GB Disk</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-background border">
                          <Monitor className="h-4 w-4 mx-auto mb-1 text-primary" />
                          <p className="text-sm font-bold">{selectedTemplate?.os || "Custom"}</p>
                          <p className="text-xs text-muted-foreground">OS</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Review & Create</CardTitle>
                <CardDescription>Confirm all details before creating the batch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Customer */}
                <div className="rounded-xl border p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</h4>
                  <p className="font-semibold">{selectedCustomer?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer?.regions?.[0] || "—"} · {selectedCustomer?.slaTier}</p>
                </div>

                {/* Batch */}
                <div className="rounded-xl border p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batch Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{form.batchName}</span></div>
                    <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-muted-foreground" /><span className="font-medium">{form.seatCount} seats</span></div>
                    <div><span className="text-muted-foreground">Start:</span> <span className="font-medium">{dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "—"}</span></div>
                    <div><span className="text-muted-foreground">End:</span> <span className="font-medium">{dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "—"}</span></div>
                  </div>
                  {form.description && <p className="text-xs text-muted-foreground">{form.description}</p>}
                </div>

                {/* Environment */}
                <div className="rounded-xl border p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Environment</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Template:</span> <span className="font-medium">{selectedTemplate?.name || isos.find(i => i.id === form.isoId)?.name || "—"}</span></div>
                    <div><span className="text-muted-foreground">Region:</span> <span className="font-medium">{form.region}</span></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm mt-2">
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">{form.vmCpu}</p>
                      <p className="text-xs text-muted-foreground">vCPU</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">{form.vmRam}</p>
                      <p className="text-xs text-muted-foreground">GB RAM</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <p className="text-lg font-bold">{form.vmDisk}</p>
                      <p className="text-xs text-muted-foreground">GB Disk</p>
                    </div>
                  </div>
                </div>

                {/* Resource Estimate */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Resource Estimate</h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Total CPU</p>
                      <p className="font-bold">{parseInt(form.vmCpu) * parseInt(form.seatCount)} vCPU</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total RAM</p>
                      <p className="font-bold">{parseInt(form.vmRam) * parseInt(form.seatCount)} GB</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Total Disk</p>
                      <p className="font-bold">{parseInt(form.vmDisk) * parseInt(form.seatCount)} GB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selectedCustomer?.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-medium">{form.batchName || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span className="font-medium">{form.seatCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Start</span><span className="font-medium">{dateRange?.from ? format(dateRange.from, "MMM dd") : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">End</span><span className="font-medium">{dateRange?.to ? format(dateRange.to, "MMM dd") : "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Template</span><span className="font-medium">{selectedTemplate?.name || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Region</span><span className="font-medium">{form.region}</span></div>

              <div className="border-t pt-3 space-y-2">
                {/* Navigation */}
                <div className="flex gap-2">
                  {step > 1 && (
                    <Button variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>Back</Button>
                  )}
                  {step < 4 ? (
                    <Button className="flex-1" disabled={!canNext()} onClick={() => setStep(step + 1)}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button className="flex-1" onClick={handleCreate}>
                      Create Batch
                    </Button>
                  )}
                </div>
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("/admin/batches")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
