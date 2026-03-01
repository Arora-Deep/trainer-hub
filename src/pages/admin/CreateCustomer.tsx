import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const steps = ["Basic Info", "Commercial Setup", "SLA & Policies", "White-label Branding"];

export default function CreateCustomer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [whiteLabel, setWhiteLabel] = useState(false);
  const [poRequired, setPoRequired] = useState(false);

  const handleSubmit = () => {
    toast({ title: "Customer created", description: "New customer onboarded. Admin invite sent. Audit log written." });
    navigate("/admin/customers");
  };

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/customers")}><ArrowLeft className="h-4 w-4" /></Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Customer</h1>
          <p className="text-muted-foreground text-sm mt-1">Onboard a new training company</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span className="w-4 text-center">{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <div className="w-6 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Company Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label className="text-xs">Company Name</Label><Input placeholder="e.g. TechSkills Academy" /></div>
              <div className="space-y-2"><Label className="text-xs">Primary Contact Name</Label><Input placeholder="Full name" /></div>
              <div className="space-y-2"><Label className="text-xs">Email</Label><Input type="email" placeholder="contact@company.com" /></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input placeholder="+91 9876543210" /></div>
              <div className="space-y-2 sm:col-span-2"><Label className="text-xs">Billing Address</Label><Input placeholder="Address line" /></div>
              <div className="space-y-2"><Label className="text-xs">GSTIN (optional)</Label><Input placeholder="22AAAAA0000A1Z5" /></div>
              <div className="space-y-2">
                <Label className="text-xs">Region Preference</Label>
                <Select><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select region" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ap-south-1">India (Mumbai)</SelectItem>
                    <SelectItem value="me-south-1">UAE</SelectItem>
                    <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                    <SelectItem value="us-east-1">US East</SelectItem>
                    <SelectItem value="us-west-2">US West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Status</Label>
                <Select defaultValue="trial"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Commercial Setup */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Commercial Setup</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs">Pricing Model</Label>
                <Select defaultValue="per-seat-month"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per-seat-month">Per seat/month</SelectItem>
                    <SelectItem value="per-seat-hour">Per seat/hour</SelectItem>
                    <SelectItem value="batch-bundle">Batch bundle pricing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Default Rate (₹)</Label><Input type="number" defaultValue={500} className="h-9 text-sm" /></div>
              <div className="space-y-2"><Label className="text-xs">Credit Wallet Starting Balance (₹)</Label><Input type="number" defaultValue={0} className="h-9 text-sm" /></div>
              <div className="space-y-2">
                <Label className="text-xs">Payment Terms</Label>
                <Select defaultValue="net-30"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net-7">Net 7</SelectItem>
                    <SelectItem value="net-15">Net 15</SelectItem>
                    <SelectItem value="net-30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch checked={poRequired} onCheckedChange={setPoRequired} />
              <Label className="text-xs">PO Required before provisioning</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: SLA & Policies */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle className="text-base">SLA & Policies</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs">SLA Tier</Label>
                <Select defaultValue="standard"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Standard</SelectItem>
                    <SelectItem value="standard">Premium</SelectItem>
                    <SelectItem value="premium">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Support Hours</Label>
                <Select defaultValue="9-6"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9-6">9 AM – 6 PM</SelectItem>
                    <SelectItem value="24-7">24/7</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Provision Priority</Label>
                <Select defaultValue="normal"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Max Concurrent Seats</Label><Input type="number" defaultValue={100} className="h-9 text-sm" /></div>
              <div className="space-y-2"><Label className="text-xs">Max Lab Hours/Month</Label><Input type="number" defaultValue={5000} className="h-9 text-sm" /></div>
              <div className="space-y-2"><Label className="text-xs">Max Storage (GB)</Label><Input type="number" defaultValue={2000} className="h-9 text-sm" /></div>
              <div className="space-y-2"><Label className="text-xs">Idle Timeout (minutes)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
              <div className="space-y-2"><Label className="text-xs">Default Lab Expiry (days)</Label><Input type="number" defaultValue={14} className="h-9 text-sm" /></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: White-label */}
      {step === 3 && (
        <Card>
          <CardHeader><CardTitle className="text-base">White-label Branding</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={whiteLabel} onCheckedChange={setWhiteLabel} />
              <Label className="text-sm">Enable white-label branding</Label>
            </div>
            {whiteLabel && (
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="space-y-2"><Label className="text-xs">Upload Logo</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
                <div className="space-y-2"><Label className="text-xs">Primary Color</Label><Input type="color" defaultValue="#3b82f6" className="h-9" /></div>
                <div className="space-y-2"><Label className="text-xs">Customer Portal Domain (optional)</Label><Input placeholder="labs.company.com" className="h-9 text-sm" /></div>
                <div className="space-y-2"><Label className="text-xs">Custom Login Background</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={step === 0 ? () => navigate("/admin/customers") : prev}>
          {step === 0 ? "Cancel" : "Previous"}
        </Button>
        {step < 3 ? (
          <Button onClick={next}>Next Step</Button>
        ) : (
          <Button onClick={handleSubmit}>Create Customer & Send Invite</Button>
        )}
      </div>
    </div>
  );
}
