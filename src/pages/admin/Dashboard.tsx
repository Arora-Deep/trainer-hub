import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Server, Activity, AlertTriangle, DollarSign, Clock, Gauge, FlaskConical, Wrench, CreditCard, Send, Plus } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const failureData = [
  { category: "Capacity", count: 8 },
  { category: "Config", count: 3 },
  { category: "Network", count: 5 },
  { category: "Image", count: 2 },
];

const barColors = ["hsl(0, 84%, 60%)", "hsl(38, 92%, 50%)", "hsl(211, 100%, 50%)", "hsl(142, 71%, 45%)"];

export default function AdminDashboard() {
  const { customers, provisionJobs, incidents, invoices } = useCustomerStore();

  const activeTenants = customers.filter(c => c.status === "active").length;
  const totalLiveLabs = customers.reduce((s, c) => s + c.currentUsage.liveLabs, 0);
  const totalVMs = customers.reduce((s, c) => s + c.activeVMs, 0);
  const completedJobs = provisionJobs.filter(j => j.status === "completed").length;
  const totalJobs = provisionJobs.length;
  const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const activeIncidents = incidents.filter(i => i.status === "active" || i.status === "investigating").length;
  const overdueInvoices = invoices.filter(i => i.status === "overdue");
  const overdueTotal = overdueInvoices.reduce((s, i) => s + i.amount, 0);
  const mrr = customers.reduce((s, c) => s + c.monthlyUsage, 0);
  const failedJobs = provisionJobs.filter(j => j.status === "failed");

  const kpis = [
    { label: "Active Tenants", value: activeTenants, icon: Building2, sub: `${customers.length} total`, color: "text-primary" },
    { label: "Live Labs", value: totalLiveLabs, icon: FlaskConical, sub: `${totalVMs} VMs`, color: "text-success" },
    { label: "Provision Success", value: `${successRate}%`, icon: Gauge, sub: "Last 24h", color: successRate >= 80 ? "text-success" : "text-warning" },
    { label: "Avg Provision Time", value: "4.2m", icon: Clock, sub: "-0.3m from avg", color: "text-info" },
    { label: "Open Incidents", value: activeIncidents, icon: AlertTriangle, sub: `${incidents.length} total`, color: activeIncidents > 0 ? "text-destructive" : "text-success" },
    { label: "Overdue Amount", value: `₹${overdueTotal.toLocaleString()}`, icon: DollarSign, sub: `${overdueInvoices.length} invoices`, color: overdueTotal > 0 ? "text-destructive" : "text-success" },
    { label: "MRR Estimate", value: `₹${mrr.toLocaleString()}`, icon: DollarSign, sub: "+8% MoM", color: "text-primary" },
  ];

  const regions = [
    { name: "ap-south-1 (Mumbai)", cpu: { used: 420, total: 600 }, ram: { used: 1800, total: 2560 }, storage: { used: 15000, total: 25000 }, gpu: { used: 6, total: 8 }, hot: true },
    { name: "us-east-1 (Virginia)", cpu: { used: 180, total: 400 }, ram: { used: 800, total: 1536 }, storage: { used: 8000, total: 15000 }, gpu: { used: 0, total: 4 }, hot: false },
    { name: "eu-west-1 (Ireland)", cpu: { used: 95, total: 200 }, ram: { used: 450, total: 1024 }, storage: { used: 4000, total: 10000 }, gpu: { used: 0, total: 0 }, hot: false },
    { name: "us-west-2 (Oregon)", cpu: { used: 30, total: 200 }, ram: { used: 120, total: 512 }, storage: { used: 1500, total: 5000 }, gpu: { used: 0, total: 0 }, hot: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform-wide overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Tenant</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><FlaskConical className="h-3.5 w-3.5" /> Create Blueprint</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-warning"><Wrench className="h-3.5 w-3.5" /> Maintenance</Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        {kpis.map((k) => (
          <Card key={k.label} className="bg-card">
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between mb-2">
                <k.icon className={`h-4 w-4 ${k.color}`} />
              </div>
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
              <p className="text-[10px] text-muted-foreground">{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Failures by Category */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Failures by Category (24h)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={failureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {failureData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latest Failed Jobs */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Latest Failed Provision Jobs</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Job ID</TableHead>
                  <TableHead className="text-xs">Tenant</TableHead>
                  <TableHead className="text-xs">Blueprint</TableHead>
                  <TableHead className="text-xs">Error</TableHead>
                  <TableHead className="text-xs text-right">Retries</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {failedJobs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="text-xs font-mono">{j.id}</TableCell>
                    <TableCell className="text-xs">{j.tenant}</TableCell>
                    <TableCell className="text-xs">{j.blueprint}</TableCell>
                    <TableCell className="text-xs text-destructive max-w-[200px] truncate">{j.failureReason}</TableCell>
                    <TableCell className="text-xs text-right">{j.retries}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Capacity Snapshot */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Capacity Snapshot</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {regions.map((r) => (
              <div key={r.name} className={`rounded-lg border p-3 ${r.hot ? "border-warning/50 bg-warning/5" : "border-border"}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold">{r.name}</p>
                  {r.hot && <Badge variant="secondary" className="text-[9px] bg-warning/10 text-warning">HOT</Badge>}
                </div>
                {[
                  { label: "CPU", used: r.cpu.used, total: r.cpu.total, unit: "vCPU" },
                  { label: "RAM", used: r.ram.used, total: r.ram.total, unit: "GB" },
                  { label: "Storage", used: r.storage.used, total: r.storage.total, unit: "GB" },
                  { label: "GPU", used: r.gpu.used, total: r.gpu.total, unit: "" },
                ].map((m) => {
                  const pct = m.total > 0 ? (m.used / m.total) * 100 : 0;
                  return (
                    <div key={m.label} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-muted-foreground w-10">{m.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct > 85 ? "bg-destructive" : pct > 65 ? "bg-warning" : "bg-success"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-16 text-right">{m.used}/{m.total}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Snapshot */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Monthly Revenue (MRR)</p>
            <p className="text-2xl font-bold mt-1">₹{mrr.toLocaleString()}</p>
            <p className="text-xs text-success mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Invoices Due This Week</p>
            <p className="text-2xl font-bold mt-1">₹{invoices.filter(i => i.status === "due").reduce((s, i) => s + i.amount, 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{invoices.filter(i => i.status === "due").length} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Collections Status</p>
            <p className="text-2xl font-bold mt-1 text-destructive">₹{overdueTotal.toLocaleString()}</p>
            <p className="text-xs text-destructive mt-1">{overdueInvoices.length} overdue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
