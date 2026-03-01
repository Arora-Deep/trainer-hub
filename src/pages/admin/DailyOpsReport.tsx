import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerStore } from "@/stores/customerStore";

export default function DailyOpsReport() {
  const { incidents, provisionJobs, customers } = useCustomerStore();
  const failedJobs = provisionJobs.filter(j => j.status === "failed");
  const activeIncidents = incidents.filter(i => i.status !== "resolved");
  const topTenants = [...customers].sort((a, b) => b.currentUsage.liveLabs - a.currentUsage.liveLabs).slice(0, 5);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Daily Ops Report</h1><p className="text-muted-foreground text-sm mt-1">Auto-generated summary — {new Date().toLocaleDateString()}</p></div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Active Incidents</p><p className="text-2xl font-bold mt-1">{activeIncidents.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Failed Jobs (24h)</p><p className="text-2xl font-bold mt-1 text-destructive">{failedJobs.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Live Labs</p><p className="text-2xl font-bold mt-1">{customers.reduce((s, c) => s + c.currentUsage.liveLabs, 0)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Top Tenants by Usage</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topTenants.map(t => (
              <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-sm font-medium">{t.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{t.currentUsage.liveLabs} labs</span>
                  <span className="text-xs text-muted-foreground">{t.currentUsage.activeSeats} seats</span>
                  <Badge variant="secondary" className={`text-[10px] font-mono ${t.healthScore >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{t.healthScore}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
