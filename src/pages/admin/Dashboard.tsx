import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Server, AlertTriangle, DollarSign, FlaskConical, TicketCheck, FileText, RotateCcw } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { useBatchStore } from "@/stores/batchStore";

export default function AdminDashboard() {
  const { customers, provisionJobs, incidents, invoices, tickets } = useCustomerStore();
  const { batches } = useBatchStore();

  const activeCustomers = customers.filter(c => c.status === "active").length;
  const activeBatches = customers.reduce((s, c) => s + c.activeBatches, 0);
  const runningLabs = customers.reduce((s, c) => s + c.currentUsage.liveLabs, 0);
  const completedJobs = provisionJobs.filter(j => j.status === "completed").length;
  const successRate = provisionJobs.length > 0 ? Math.round((completedJobs / provisionJobs.length) * 100) : 0;
  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const overdueInvoices = invoices.filter(i => i.status === "overdue");

  const kpis = [
    { label: "Active Customers", value: activeCustomers, icon: Building2, color: "text-primary" },
    { label: "Active Batches", value: activeBatches, icon: Server, color: "text-info" },
    { label: "Running Labs", value: runningLabs, icon: FlaskConical, color: "text-success" },
    { label: "Provision Success (24h)", value: `${successRate}%`, icon: Server, color: successRate >= 80 ? "text-success" : "text-warning" },
    { label: "Open Tickets", value: openTickets, icon: TicketCheck, color: openTickets > 0 ? "text-warning" : "text-success" },
    { label: "Outstanding Invoices", value: overdueInvoices.length, icon: DollarSign, color: overdueInvoices.length > 0 ? "text-destructive" : "text-success" },
  ];

  const clusterData = [
    { cluster: "gpu-cluster-mumbai-1", nodes: 8, cpuUsed: "70%", ramUsed: "75%", storageUsed: "60%", status: "healthy" },
    { cluster: "compute-virginia-1", nodes: 12, cpuUsed: "45%", ramUsed: "50%", storageUsed: "40%", status: "healthy" },
    { cluster: "storage-eu-west-1", nodes: 6, cpuUsed: "30%", ramUsed: "65%", storageUsed: "82%", status: "warning" },
    { cluster: "net-ap-south-1", nodes: 4, cpuUsed: "55%", ramUsed: "40%", storageUsed: "35%", status: "healthy" },
  ];

  const recentBatches = batches.slice(0, 5);
  const failedJobs = provisionJobs.filter(j => j.status === "failed");

  const alerts = [
    { alert: "GPU capacity exhausted in ap-south-1", severity: "critical", source: "Infrastructure", time: "15 min ago" },
    { alert: "High latency on storage pool EU-WEST-1", severity: "major", source: "Storage", time: "2 hours ago" },
    { alert: "Invoice INV-3003 overdue by 14 days", severity: "warning", source: "Billing", time: "1 day ago" },
    { alert: "Node maintenance scheduled", severity: "info", source: "Ops", time: "3 hours ago" },
  ];

  const severityColor: Record<string, string> = {
    critical: "bg-destructive/10 text-destructive",
    major: "bg-warning/10 text-warning",
    warning: "bg-warning/10 text-warning",
    info: "bg-info/10 text-info",
  };

  const statusColor: Record<string, string> = {
    healthy: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    critical: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">System health, activity, and key metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <k.icon className={`h-4 w-4 ${k.color} mb-2`} />
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infrastructure Snapshot */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Infrastructure Snapshot</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster</TableHead>
                <TableHead className="text-right">Nodes</TableHead>
                <TableHead className="text-right">CPU Used</TableHead>
                <TableHead className="text-right">RAM Used</TableHead>
                <TableHead className="text-right">Storage Used</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clusterData.map((c) => (
                <TableRow key={c.cluster}>
                  <TableCell className="text-sm font-mono">{c.cluster}</TableCell>
                  <TableCell className="text-sm text-right">{c.nodes}</TableCell>
                  <TableCell className="text-sm text-right">{c.cpuUsed}</TableCell>
                  <TableCell className="text-sm text-right">{c.ramUsed}</TableCell>
                  <TableCell className="text-sm text-right">{c.storageUsed}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColor[c.status]}`}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Batch Activity */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Recent Batch Activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBatches.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm">{b.courseName || "—"}</TableCell>
                  <TableCell className="text-sm text-right">{b.seatCount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-xs capitalize ${b.status === "live" ? "bg-success/10 text-success" : b.status === "upcoming" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.startDate}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.endDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Failed Jobs */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Failed Jobs (Last 24h)</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Error</TableHead>
                <TableHead className="text-right">Retry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failedJobs.map((j) => (
                <TableRow key={j.id}>
                  <TableCell className="text-sm font-mono">{j.id}</TableCell>
                  <TableCell className="text-sm">{j.tenant}</TableCell>
                  <TableCell className="text-sm">{j.batch}</TableCell>
                  <TableCell className="text-sm text-destructive max-w-[250px] truncate">{j.failureReason}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-1 text-xs"><RotateCcw className="h-3 w-3" /> Retry</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">System Alerts</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm">{a.alert}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${severityColor[a.severity]}`}>{a.severity}</Badge></TableCell>
                  <TableCell className="text-sm">{a.source}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
