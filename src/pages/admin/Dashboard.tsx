import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Server, DollarSign, Users, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";

export default function AdminDashboard() {
  const { customers } = useCustomerStore();
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalVMs = customers.reduce((sum, c) => sum + c.activeVMs, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.monthlyUsage, 0);
  const totalStudents = customers.reduce((sum, c) => sum + c.totalStudents, 0);

  const stats = [
    { label: "Total Customers", value: totalCustomers, icon: Building2, sub: `${activeCustomers} active`, color: "text-primary" },
    { label: "Active VMs", value: totalVMs, icon: Server, sub: "Across all customers", color: "text-success" },
    { label: "Monthly Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, sub: "+12% from last month", color: "text-warning" },
    { label: "Total Students", value: totalStudents, icon: Users, sub: "Active learners", color: "text-info" },
  ];

  const recentActivity = [
    { action: "New customer onboarded", detail: "DevOps Training Co — Starter plan", time: "2h ago", type: "success" },
    { action: "VM provisioning approved", detail: "TechSkills Academy — 10 VMs (AWS)", time: "4h ago", type: "info" },
    { action: "High CPU alert", detail: "CodeCraft Institute — us-east-1 cluster", time: "6h ago", type: "warning" },
    { action: "Billing invoice generated", detail: "SkillBridge Labs — $9,500", time: "1d ago", type: "default" },
    { action: "Customer plan upgraded", detail: "CloudLearn Pro — Starter → Professional", time: "2d ago", type: "success" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">CloudAdda infrastructure overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* VM Health */}
        <Card>
          <CardHeader><CardTitle className="text-base">VM Health Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "ap-south-1", healthy: 78, warning: 3, critical: 2 },
                { region: "us-east-1", healthy: 20, warning: 1, critical: 1 },
                { region: "eu-west-1", healthy: 14, warning: 1, critical: 0 },
                { region: "us-west-2", healthy: 5, warning: 0, critical: 0 },
              ].map((r) => (
                <div key={r.region} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{r.region}</p>
                    <p className="text-xs text-muted-foreground">{r.healthy + r.warning + r.critical} total VMs</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-success/10 text-success text-xs">{r.healthy} healthy</Badge>
                    {r.warning > 0 && <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">{r.warning} warning</Badge>}
                    {r.critical > 0 && <Badge variant="secondary" className="bg-destructive/10 text-destructive text-xs">{r.critical} critical</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-border last:border-0">
                  <div className="mt-0.5">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.detail}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
