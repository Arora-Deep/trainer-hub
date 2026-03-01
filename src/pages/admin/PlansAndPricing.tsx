import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const plans = [
  { name: "Starter", seats: 50, hours: 500, overage: "₹15/seat/hr", regionMultiplier: "1x", sla: "Basic", features: "Basic labs, email support" },
  { name: "Professional", seats: 200, hours: 2000, overage: "₹12/seat/hr", regionMultiplier: "1.2x", sla: "Standard", features: "All labs, priority support, SSO" },
  { name: "Enterprise", seats: "Unlimited", hours: "Unlimited", overage: "₹10/seat/hr", regionMultiplier: "1x", sla: "Premium", features: "All features, dedicated support, custom templates, GPU" },
];

export default function PlansAndPricing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Plans & Pricing</h1><p className="text-muted-foreground text-sm mt-1">Subscription plan configuration</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Plan</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map(p => (
          <Card key={p.name} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2"><CardTitle className="text-base">{p.name}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Included Seats</span><span className="font-medium">{p.seats}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Included Hours</span><span className="font-medium">{p.hours}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Overage</span><span className="font-medium">{p.overage}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Region Multiplier</span><span className="font-medium">{p.regionMultiplier}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">SLA Tier</span><Badge variant="secondary" className="text-[10px]">{p.sla}</Badge></div>
              <div className="pt-2 border-t border-border"><p className="text-xs text-muted-foreground">{p.features}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
