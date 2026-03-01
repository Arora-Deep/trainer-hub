import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const runbooks = [
  { title: "Lab Not Starting", symptoms: "Student reports lab stuck in 'provisioning'", checks: "Check VM status, node health, image availability", actions: "Retry provision, replace VM, escalate if cluster-wide", rollback: "Revert to previous snapshot" },
  { title: "GPU Capacity Exhausted", symptoms: "GPU labs failing to provision", checks: "Check GPU pool utilization, quarantined GPUs", actions: "Free unused GPUs, schedule tenant, add capacity", rollback: "Redirect to non-GPU template" },
  { title: "Network Connectivity Issues", symptoms: "Students can't reach internet from labs", checks: "Check firewall rules, DNS resolution, NAT gateway", actions: "Reset network stack, verify IP pool, restart NAT", rollback: "Switch to backup gateway" },
  { title: "High Storage Latency", symptoms: "Labs running slow, IO timeouts", checks: "Check storage pool IOPS and error rate", actions: "Migrate volumes, investigate disk errors", rollback: "Failover to secondary storage" },
];

export default function Runbooks() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Runbooks</h1><p className="text-muted-foreground text-sm mt-1">Standard operating procedures</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Runbook</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {runbooks.map((r, i) => (
          <Card key={i} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2"><CardTitle className="text-sm">{r.title}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div><span className="text-[10px] font-semibold uppercase text-muted-foreground">Symptoms</span><p className="text-xs mt-0.5">{r.symptoms}</p></div>
              <div><span className="text-[10px] font-semibold uppercase text-muted-foreground">Checks</span><p className="text-xs mt-0.5">{r.checks}</p></div>
              <div><span className="text-[10px] font-semibold uppercase text-muted-foreground">Actions</span><p className="text-xs mt-0.5">{r.actions}</p></div>
              <div><span className="text-[10px] font-semibold uppercase text-muted-foreground">Rollback</span><p className="text-xs mt-0.5">{r.rollback}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
