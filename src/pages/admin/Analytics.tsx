import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Server } from "lucide-react";

const monthlyData = [
  { month: "Sep", customers: 3, vms: 45, revenue: 15000 },
  { month: "Oct", customers: 4, vms: 62, revenue: 21000 },
  { month: "Nov", customers: 4, vms: 78, revenue: 26000 },
  { month: "Dec", customers: 5, vms: 95, revenue: 30000 },
  { month: "Jan", customers: 6, vms: 110, revenue: 33000 },
  { month: "Feb", customers: 6, vms: 125, revenue: 33800 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Usage trends and growth metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">+100%</p><p className="text-sm text-muted-foreground">Customer Growth (6mo)</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Server className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">178%</p><p className="text-sm text-muted-foreground">VM Growth (6mo)</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-info" /><div><p className="text-2xl font-bold">690</p><p className="text-sm text-muted-foreground">Total Students Served</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><BarChart3 className="h-5 w-5 text-warning" /><div><p className="text-2xl font-bold">68%</p><p className="text-sm text-muted-foreground">Avg VM Utilization</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Monthly Growth</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((d) => (
              <div key={d.month} className="grid grid-cols-4 gap-4 items-center py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium">{d.month} 2025</span>
                <span className="text-sm text-muted-foreground">{d.customers} customers</span>
                <span className="text-sm text-muted-foreground">{d.vms} VMs</span>
                <span className="text-sm font-medium text-right">${d.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
