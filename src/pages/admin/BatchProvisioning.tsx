import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { Progress } from "@/components/ui/progress";

export default function BatchProvisioning() {
  const { customers, blueprints } = useCustomerStore();
  const [step, setStep] = useState(1);
  const [provisioning, setProvisioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startProvisioning = () => {
    setProvisioning(true);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 5;
      });
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Provisioning</h1>
        <p className="text-muted-foreground text-sm mt-1">Provision labs for a batch</p>
      </div>

      {!provisioning ? (
        <Card>
          <CardHeader><CardTitle className="text-sm">Step {step} of 4</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5"><Label className="text-xs">Tenant</Label>
                  <Select><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select tenant" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                </div>
                <Button size="sm" onClick={() => setStep(2)}>Next</Button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5"><Label className="text-xs">Blueprint</Label>
                  <Select><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select blueprint" /></SelectTrigger>
                    <SelectContent>{blueprints.map(b => <SelectItem key={b.id} value={b.id}>{b.name} v{b.version}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs">Seats</Label><Input type="number" defaultValue={50} className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Schedule Start</Label><Input type="datetime-local" className="h-9 text-sm" /></div>
                </div>
                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setStep(1)}>Back</Button><Button size="sm" onClick={() => setStep(3)}>Next</Button></div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1.5"><Label className="text-xs">Region / Cluster Preference</Label>
                  <Select defaultValue="ap-south-1"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem><SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem><SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem></SelectContent></Select>
                </div>
                <div className="flex items-center gap-3"><Switch /><Label className="text-xs">Pre-warm capacity</Label></div>
                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setStep(2)}>Back</Button><Button size="sm" onClick={() => setStep(4)}>Review</Button></div>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Estimated Cost:</span> <span className="font-medium">₹12,500</span></p>
                  <p><span className="text-muted-foreground">Expected Time:</span> <span className="font-medium">~8 minutes</span></p>
                  <p><span className="text-muted-foreground">Seats:</span> <span className="font-medium">50</span></p>
                </div>
                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setStep(3)}>Back</Button><Button size="sm" onClick={startProvisioning}>Launch Provisioning</Button></div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center">
              <p className="text-lg font-bold">{Math.min(Math.round(progress / 2), 50)} / 50 provisioned</p>
              <p className="text-sm text-muted-foreground mt-1">Provisioning in progress...</p>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">{progress >= 100 ? "Completed!" : "Allocating resources..."}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
