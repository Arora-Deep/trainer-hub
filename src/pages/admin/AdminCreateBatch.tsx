import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";
import { CalendarDays, Users, Server, MapPin, Info } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function AdminCreateBatch() {
  const navigate = useNavigate();
  const { customers, blueprints } = useCustomerStore();
  const [form, setForm] = useState({
    customerId: "",
    batchName: "",
    description: "",
    seatCount: "20",
    templateId: "",
    iso: "",
    region: "ap-south-1",
    medium: "online",
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const selectedCustomer = customers.find(c => c.id === form.customerId);
  const selectedTemplate = blueprints.find(b => b.id === form.templateId);

  const canCreate = form.customerId && form.batchName && dateRange?.from && dateRange?.to && form.templateId;

  const estimatedCpu = selectedTemplate ? Number(form.seatCount) * selectedTemplate.defaultResources.cpu : 0;
  const estimatedRam = selectedTemplate ? Number(form.seatCount) * selectedTemplate.defaultResources.ram : 0;
  const estimatedDisk = selectedTemplate ? Number(form.seatCount) * selectedTemplate.defaultResources.disk : 0;

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

          {/* Environment Config */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4" /> Environment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lab Template</Label>
                  <Select value={form.templateId} onValueChange={v => update("templateId", v)}>
                    <SelectTrigger><SelectValue placeholder="Select template..." /></SelectTrigger>
                    <SelectContent>
                      {blueprints.map(b => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplate && (
                    <p className="text-xs text-muted-foreground">{selectedTemplate.description}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>ISO (optional)</Label>
                  <Input value={form.iso} onChange={e => update("iso", e.target.value)} placeholder="Select ISO image..." />
                </div>
              </div>
              {selectedTemplate && (
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs font-medium mb-2">Per-VM Resources</p>
                  <div className="flex gap-6 text-sm">
                    <span>{selectedTemplate.defaultResources.cpu} vCPU</span>
                    <span>{selectedTemplate.defaultResources.ram} GB RAM</span>
                    <span>{selectedTemplate.defaultResources.disk} GB Disk</span>
                    {selectedTemplate.defaultResources.gpu && <span>{selectedTemplate.defaultResources.gpu} GPU</span>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Summary */}
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
                  <span className="text-muted-foreground">Template</span>
                  <span className="font-medium">{selectedTemplate?.name || "—"}</span>
                </div>
              </div>

              {selectedTemplate && (
                <>
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Estimated Total Resources</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPU</span>
                        <span className="font-medium">{estimatedCpu} vCPU</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RAM</span>
                        <span className="font-medium">{estimatedRam} GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Disk</span>
                        <span className="font-medium">{estimatedDisk} GB</span>
                      </div>
                    </div>
                  </div>

                  {selectedCustomer && (
                    <div className="border-t pt-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Customer Quota Check</p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPU Available</span>
                          <span className={`font-medium ${estimatedCpu > selectedCustomer.quota.cpu ? "text-destructive" : "text-green-600"}`}>
                            {selectedCustomer.quota.cpu - estimatedCpu} / {selectedCustomer.quota.cpu}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">RAM Available</span>
                          <span className={`font-medium ${estimatedRam > selectedCustomer.quota.ram ? "text-destructive" : "text-green-600"}`}>
                            {selectedCustomer.quota.ram - estimatedRam} / {selectedCustomer.quota.ram}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={() => navigate("/admin/batches")} disabled={!canCreate} className="w-full">
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
