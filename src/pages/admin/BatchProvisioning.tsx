import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { Check, ChevronRight, Rocket, Server, Users, MapPin, Eye, Zap } from "lucide-react";

const steps = [
  { label: "Customer", icon: Users },
  { label: "Blueprint & Seats", icon: Server },
  { label: "Region & Options", icon: MapPin },
  { label: "Review & Launch", icon: Eye },
];

export default function BatchProvisioning() {
  const { customers, blueprints } = useCustomerStore();
  const [step, setStep] = useState(0);
  const [provisioning, setProvisioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState("");
  const [seats, setSeats] = useState(50);
  const [region, setRegion] = useState("ap-south-1");
  const [preWarm, setPreWarm] = useState(false);

  const customer = customers.find(c => c.id === selectedCustomer);
  const blueprint = blueprints.find(b => b.id === selectedBlueprint);

  const startProvisioning = () => {
    setProvisioning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return Math.min(100, p + Math.random() * 4 + 1);
      });
    }, 250);
  };

  const canNext = () => {
    if (step === 0) return !!selectedCustomer;
    if (step === 1) return !!selectedBlueprint && seats > 0;
    return true;
  };

  if (provisioning) {
    const provisioned = Math.min(Math.round((progress / 100) * seats), seats);
    const done = progress >= 100;
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Batch Provisioning</h1>
          <p className="text-muted-foreground text-sm mt-1">Provisioning in progress</p>
        </div>
        <Card>
          <CardContent className="py-10 space-y-6">
            <div className="text-center space-y-2">
              <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full mx-auto ${done ? "bg-emerald-500/10" : "bg-blue-500/10"}`}>
                {done ? <Check className="h-8 w-8 text-emerald-500" /> : <Rocket className="h-8 w-8 text-blue-500 animate-pulse" />}
              </div>
              <p className="text-3xl font-bold">{provisioned} / {seats}</p>
              <p className="text-sm text-muted-foreground">
                {done ? "All seats provisioned successfully!" : "Allocating resources and spinning up labs..."}
              </p>
            </div>
            <Progress value={progress} className="h-2.5 max-w-md mx-auto" />
            <div className="flex justify-center gap-6 text-xs text-muted-foreground">
              <span>Customer: <span className="text-foreground font-medium">{customer?.name}</span></span>
              <span>Blueprint: <span className="text-foreground font-medium">{blueprint?.name}</span></span>
              <span>Region: <span className="text-foreground font-medium">{region}</span></span>
            </div>
            {done && (
              <div className="flex justify-center gap-3 pt-2">
                <Button size="sm" variant="outline" onClick={() => { setProvisioning(false); setStep(0); setProgress(0); }}>Provision Another</Button>
                <Button size="sm">View Jobs</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Provisioning</h1>
        <p className="text-muted-foreground text-sm mt-1">Provision labs for a customer batch</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                i === step ? "bg-primary text-primary-foreground" :
                i < step ? "bg-emerald-500/10 text-emerald-600 cursor-pointer" :
                "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
              {s.label}
            </button>
            {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6 space-y-5">
          {step === 0 && (
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Select Customer</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choose a customer..." /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          {c.name}
                          <Badge variant="secondary" className="text-[9px] capitalize">{c.status}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {customer && (
                <div className="rounded-lg border p-4 space-y-2 text-sm bg-muted/30">
                  <p className="font-medium">{customer.name}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Plan: <span className="text-foreground">{customer.plan}</span></span>
                    <span>Region: <span className="text-foreground">{customer.regions.join(", ")}</span></span>
                    <span>SLA: <span className="text-foreground">{customer.slaTier || "standard"}</span></span>
                    <span>Seats: <span className="text-foreground">{customer.currentUsage.activeSeats}</span></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 max-w-lg">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Blueprint / Template</Label>
                <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select blueprint..." /></SelectTrigger>
                  <SelectContent>
                    {blueprints.map(b => (
                      <SelectItem key={b.id} value={b.id}>{b.name} v{b.version}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Number of Seats</Label>
                  <Input type="number" value={seats} onChange={e => setSeats(Number(e.target.value))} className="h-9 text-sm" min={1} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Schedule Start</Label>
                  <Input type="datetime-local" className="h-9 text-sm" />
                </div>
              </div>
              {blueprint && (
                <div className="rounded-lg border p-4 text-xs space-y-1 bg-muted/30">
                  <p className="font-medium text-sm">{blueprint.name}</p>
                  <p className="text-muted-foreground">Type: {blueprint.type} · Resources: {blueprint.defaultResources.cpu}vCPU / {blueprint.defaultResources.ram}GB · Internet: {blueprint.internetPolicy}</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Region / Cluster Preference</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                    <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
                    <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                    <SelectItem value="me-south-1">me-south-1 (UAE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> Pre-warm Capacity</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Reserve resources before scheduled start for faster spin-up</p>
                </div>
                <Switch checked={preWarm} onCheckedChange={setPreWarm} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold">Review Provisioning Request</p>
              <div className="rounded-lg border p-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm bg-muted/30">
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{customer?.name || "—"}</p></div>
                <div><p className="text-muted-foreground text-xs">Blueprint</p><p className="font-medium">{blueprint?.name || "—"} v{blueprint?.version}</p></div>

                <div><p className="text-muted-foreground text-xs">Seats</p><p className="font-medium">{seats}</p></div>
                <div><p className="text-muted-foreground text-xs">Region</p><p className="font-medium">{region}</p></div>
                <div><p className="text-muted-foreground text-xs">Pre-warm</p><p className="font-medium">{preWarm ? "Yes" : "No"}</p></div>
                <div><p className="text-muted-foreground text-xs">Priority</p><p className="font-medium">{customer?.slaTier === "premium" ? "High" : "Normal"}</p></div>
              </div>
              <Separator />
              <div className="rounded-lg border p-5 grid grid-cols-3 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">Estimated Cost</p><p className="font-bold text-lg">₹{(seats * 250).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground text-xs">Expected Time</p><p className="font-bold text-lg">~{Math.max(3, Math.ceil(seats / 8))} min</p></div>
                <div><p className="text-muted-foreground text-xs">Resources Required</p><p className="font-bold text-lg">{seats * 2} vCPU / {seats * 4} GB</p></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <Separator />
          <div className="flex justify-between">
            <Button size="sm" variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              Back
            </Button>
            {step < 3 ? (
              <Button size="sm" onClick={() => setStep(step + 1)} disabled={!canNext()}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button size="sm" onClick={startProvisioning} className="gap-1.5">
                <Rocket className="h-4 w-4" /> Launch Provisioning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
