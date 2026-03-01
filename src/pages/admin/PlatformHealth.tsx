import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerStore } from "@/stores/customerStore";
import { Activity, CheckCircle, Clock, HardDrive, AlertTriangle } from "lucide-react";

export default function PlatformHealth() {
  const { incidents, provisionJobs } = useCustomerStore();
  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const successRate = Math.round((provisionJobs.filter(j => j.status === "completed").length / provisionJobs.length) * 100);

  const metrics = [
    { label: "Provision Success Rate", value: `${successRate}%`, icon: CheckCircle, status: successRate >= 90 ? "healthy" : "degraded" },
    { label: "API Response Time", value: "45ms", icon: Clock, status: "healthy" },
    { label: "Cluster Health", value: "4/5 healthy", icon: Activity, status: "degraded" },
    { label: "Storage Latency", value: "1.2ms avg", icon: HardDrive, status: "healthy" },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Platform Health</h1><p className="text-muted-foreground text-sm mt-1">System-wide health overview</p></div>

      {activeIncidents.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="font-semibold text-sm">Active Incidents</span></div>
            {activeIncidents.map(inc => (
              <div key={inc.id} className="flex items-center justify-between py-1.5 text-sm">
                <span>{inc.title}</span>
                <Badge variant="secondary" className={`text-[10px] capitalize ${inc.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{inc.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map(m => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <m.icon className={`h-4 w-4 ${m.status === "healthy" ? "text-success" : "text-warning"}`} />
                <Badge variant="secondary" className={`text-[10px] capitalize ${m.status === "healthy" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{m.status}</Badge>
              </div>
              <p className="text-xl font-bold">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
