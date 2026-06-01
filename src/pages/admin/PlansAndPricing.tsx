import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Timer, Infinity as InfinityIcon } from "lucide-react";

const plans = [
  { name: "Starter", seats: 50, hours: 500, overage: "₹15/seat/hr", regionMultiplier: "1x", sla: "Basic", features: "Basic labs, email support" },
  { name: "Professional", seats: 200, hours: 2000, overage: "₹12/seat/hr", regionMultiplier: "1.2x", sla: "Standard", features: "All labs, priority support, SSO" },
  { name: "Enterprise", seats: "Unlimited", hours: "Unlimited", overage: "₹10/seat/hr", regionMultiplier: "1x", sla: "Premium", features: "All features, dedicated support, custom templates, GPU" },
];

// Self-paced lab-hour add-on bundles
const labBundles = [
  { name: "Self-Paced Starter", hours: 10, price: "₹1,200 / student", description: "Per-student wallet for on-demand labs." },
  { name: "Self-Paced Pro", hours: 30, price: "₹3,000 / student", description: "Best for cyber-sec & networking courses." },
  { name: "Unlimited Validity Pass", hours: null, price: "₹4,500 / student", description: "No hourly metering — unlimited labs during course validity. Persistent VM eligible." },
];

export default function PlansAndPricing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Plans & Pricing</h1><p className="text-muted-foreground text-sm mt-1">Subscription plans and lab-hour bundles for self-paced training</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Plan</Button>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Subscription plans</h2>
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

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Self-paced lab-hour bundles</h2>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create bundle</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {labBundles.map((b) => (
            <Card key={b.name} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">{b.name}</CardTitle>
                {b.hours === null
                  ? <Badge className="text-[10px] bg-emerald-500/10 text-emerald-700 border-0 gap-1"><InfinityIcon className="h-2.5 w-2.5" />Unlimited</Badge>
                  : <Badge className="text-[10px] bg-amber-500/10 text-amber-700 border-0 gap-1"><Timer className="h-2.5 w-2.5" />{b.hours}h</Badge>}
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Lab hours</span><span className="font-medium">{b.hours === null ? "Unlimited within validity" : `${b.hours}h / student`}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-medium">{b.price}</span></div>
                <div className="pt-2 border-t border-border"><p className="text-xs text-muted-foreground">{b.description}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

