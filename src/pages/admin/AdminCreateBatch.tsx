import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";

export default function AdminCreateBatch() {
  const navigate = useNavigate();
  const { customers, blueprints } = useCustomerStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    customerId: "", batchName: "", startDate: "", endDate: "", seatCount: "20",
    templateId: "", iso: "", region: "ap-south-1",
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const selectedCustomer = customers.find(c => c.id === form.customerId);
  const selectedTemplate = blueprints.find(b => b.id === form.templateId);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Batch</h1>
        <p className="text-muted-foreground text-sm mt-1">Step {step} of 4</p>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Step 1: Select Customer</CardTitle></CardHeader>
          <CardContent className="space-y-4">
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
            <Button onClick={() => setStep(2)} disabled={!form.customerId}>Next</Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Step 2: Batch Info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Batch Name</Label><Input value={form.batchName} onChange={e => update("batchName", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => update("startDate", e.target.value)} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Seat Count</Label><Input type="number" value={form.seatCount} onChange={e => update("seatCount", e.target.value)} /></div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!form.batchName}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Step 3: Environment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Lab Template</Label>
              <Select value={form.templateId} onValueChange={v => update("templateId", v)}>
                <SelectTrigger><SelectValue placeholder="Select template..." /></SelectTrigger>
                <SelectContent>
                  {blueprints.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>ISO (optional)</Label><Input value={form.iso} onChange={e => update("iso", e.target.value)} placeholder="Select ISO..." /></div>
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)} disabled={!form.templateId}>Next</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Step 4: Review</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selectedCustomer?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-medium">{form.batchName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span className="font-medium">{form.seatCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Template</span><span className="font-medium">{selectedTemplate?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Region</span><span className="font-medium">{form.region}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Est. Resources</span><span className="font-medium">{selectedTemplate ? `${Number(form.seatCount) * selectedTemplate.defaultResources.cpu} vCPU, ${Number(form.seatCount) * selectedTemplate.defaultResources.ram} GB RAM` : "—"}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => navigate("/admin/batches")}>Create Batch</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
