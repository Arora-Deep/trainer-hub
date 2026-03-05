import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";
import { useLabStore } from "@/stores/labStore";
import { TemplatePickerGrid } from "@/components/labs/TemplatePickerGrid";
import { VMDaySchedule } from "@/components/batches/VMDaySchedule";
import type { DaySchedule } from "@/components/batches/VMDaySchedule";
import { cn } from "@/lib/utils";
import { format, differenceInDays, eachDayOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import {
  CalendarDays, Users, Server, Info, Monitor, Layers, Plus, Trash2,
  DollarSign, HardDrive, Zap, Shield, Clock,
} from "lucide-react";

interface VMEntry {
  id: string;
  templateId: string;
  instanceName: string;
  vmType: "single" | "multi";
  dateRange: { from: string; to: string };
  dailySchedules: DaySchedule[];
}

export default function AdminCreateBatch() {
  const navigate = useNavigate();
  const { customers, blueprints } = useCustomerStore();
  const { templates } = useLabStore();

  const [form, setForm] = useState({
    customerId: "",
    batchName: "",
    description: "",
    seatCount: "20",
    region: "ap-south-1",
    medium: "online",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // VM Configuration
  const [enableVMs, setEnableVMs] = useState(false);
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [vmDateRange, setVmDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [vmDailySchedules, setVmDailySchedules] = useState<DaySchedule[]>([]);
  const [addedVMs, setAddedVMs] = useState<VMEntry[]>([]);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const selectedCustomer = customers.find(c => c.id === form.customerId);
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const canCreate = form.customerId && form.batchName && dateRange?.from && dateRange?.to;

  // Pricing calculation
  const calculatePricing = () => {
    if (!enableVMs || addedVMs.length === 0) return { compute: 0, storage: 0, network: 0, support: 0, total: 0, totalVMs: 0, days: 0 };
    const seatCount = parseInt(form.seatCount) || 20;
    const basePrice = 50;
    const totalVMs = addedVMs.length * seatCount + 1;
    const totalDays = addedVMs.reduce((sum, vm) => {
      const from = new Date(vm.dateRange.from);
      const to = new Date(vm.dateRange.to);
      return sum + Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);
    const compute = totalVMs * basePrice * totalDays;
    const storage = totalVMs * 5 * totalDays;
    const network = totalVMs * 2 * totalDays;
    const support = totalDays * 10;
    return { compute, storage, network, support, total: compute + storage + network + support, totalVMs, days: totalDays };
  };
  const pricing = calculatePricing();

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
    toast({ title: "VM Added", description: `${newVM.instanceName} added to the batch.` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure and provision a new training batch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Basic Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Info className="h-4 w-4" /> Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select value={form.customerId} onValueChange={v => update("customerId", v)}>
                    <SelectTrigger><SelectValue placeholder="Select customer..." /></SelectTrigger>
                    <SelectContent>
                      {customers.filter(c => c.status === "active" || c.status === "trial").map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Batch Name</Label>
                  <Input value={form.batchName} onChange={e => update("batchName", e.target.value)} placeholder="e.g. K8s Batch #15" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Batch description..." rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Seat Count</Label>
                  <Input type="number" value={form.seatCount} onChange={e => update("seatCount", e.target.value)} min={1} />
                </div>
                <div className="space-y-2">
                  <Label>Delivery Medium</Label>
                  <Select value={form.medium} onValueChange={v => update("medium", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={form.region} onValueChange={v => update("region", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                      <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
                      <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Range Calendar */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Batch Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">
                      Start: {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "Select start date"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary/50" />
                    <span className="text-muted-foreground">
                      End: {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "Select end date"}
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

          {/* VM Configuration Section */}
          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Virtual Machines</h3>
                    <p className="text-sm text-muted-foreground">Enable VM environments for this batch</p>
                  </div>
                </div>
                <Switch checked={enableVMs} onCheckedChange={setEnableVMs} />
              </div>
            </CardContent>
          </Card>

          {enableVMs && (
            <>
              {/* Added VMs List */}
              {addedVMs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      Added VMs ({addedVMs.length})
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setAddedVMs(addedVMs.filter((_, i) => i !== index))}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

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
              <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!vmDateRange.from || !vmDateRange.to || !selectedTemplateId}
                onClick={handleAddVM}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add VM
              </Button>
            </>
          )}
        </div>

        {/* Right: Summary & Cost Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Batch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-medium">{selectedCustomer?.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch</span>
                  <span className="font-medium">{form.batchName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">{form.seatCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medium</span>
                  <span className="font-medium capitalize">{form.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">{form.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start</span>
                  <span className="font-medium">{dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End</span>
                  <span className="font-medium">{dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VMs</span>
                  <span className="font-medium">{enableVMs ? `${addedVMs.length} configured` : "Disabled"}</span>
                </div>
              </div>

              {/* Cost Estimate */}
              {enableVMs && addedVMs.length > 0 && (
                <>
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" /> Cost Estimate
                    </p>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 mb-3">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <p className="text-xs text-muted-foreground">VMs</p>
                          <p className="text-lg font-bold">{addedVMs.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Days</p>
                          <p className="text-lg font-bold">{pricing.days}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="text-lg font-bold capitalize">{vmType}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                        <span className="text-muted-foreground flex items-center gap-2"><Server className="h-3.5 w-3.5" /> Compute</span>
                        <span className="font-medium">${pricing.compute.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                        <span className="text-muted-foreground flex items-center gap-2"><HardDrive className="h-3.5 w-3.5" /> Storage</span>
                        <span className="font-medium">${pricing.storage.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                        <span className="text-muted-foreground flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Network</span>
                        <span className="font-medium">${pricing.network.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                        <span className="text-muted-foreground flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Support</span>
                        <span className="font-medium">${pricing.support.toFixed(0)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">${pricing.total.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Quota Check */}
              {enableVMs && addedVMs.length > 0 && selectedCustomer && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Customer Quota Check</p>
                  <div className="space-y-1.5 text-sm">
                    {(() => {
                      const totalCpu = addedVMs.reduce((s, vm) => {
                        const t = templates.find(tpl => tpl.id === vm.templateId);
                        return s + (t?.vcpus || 0) * parseInt(form.seatCount);
                      }, 0);
                      const totalRam = addedVMs.reduce((s, vm) => {
                        const t = templates.find(tpl => tpl.id === vm.templateId);
                        return s + (t?.memory || 0) * parseInt(form.seatCount);
                      }, 0);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CPU</span>
                            <span className={`font-medium ${totalCpu > selectedCustomer.quota.cpu ? "text-destructive" : "text-green-600"}`}>
                              {selectedCustomer.quota.cpu - totalCpu} / {selectedCustomer.quota.cpu} vCPU
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">RAM</span>
                            <span className={`font-medium ${totalRam > selectedCustomer.quota.ram ? "text-destructive" : "text-green-600"}`}>
                              {selectedCustomer.quota.ram - totalRam} / {selectedCustomer.quota.ram} GB
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={() => {
                    toast({ title: "Batch Created", description: `${form.batchName} has been created successfully.` });
                    navigate("/admin/batches");
                  }}
                  disabled={!canCreate}
                  className="w-full"
                >
                  Create Batch
                </Button>
                <Button variant="outline" onClick={() => navigate("/admin/batches")} className="w-full">
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
