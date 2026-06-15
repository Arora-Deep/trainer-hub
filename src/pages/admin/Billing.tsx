import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, CreditCard, Receipt, UserPlus, UserMinus, ArrowRight } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";

// Mock participant-adjustment events (additive billing impact across batches)
const participantAdjustments = [
  { id: "pa-1", batch: "AWS Solutions Architect — Aug Cohort", date: "Jun 12, 2026", change: "added", count: 4, delta: 6400, by: "Rajesh Kumar" },
  { id: "pa-2", batch: "DevOps Bootcamp — Jun Cohort", date: "Jun 10, 2026", change: "removed", count: 2, delta: -2800, by: "Priya Sharma" },
  { id: "pa-3", batch: "Kubernetes Advanced", date: "Jun 08, 2026", change: "added", count: 1, delta: 1700, by: "Amit Patel" },
  { id: "pa-4", batch: "Data Engineering — May Cohort", date: "Jun 02, 2026", change: "removed", count: 3, delta: -4500, by: "Mike Chen" },
  { id: "pa-5", batch: "Cloud Security Fundamentals", date: "May 28, 2026", change: "added", count: 8, delta: 12800, by: "Neha Desai" },
];

export default function AdminBilling() {
  const { customers } = useCustomerStore();
  const totalRevenue = customers.reduce((s, c) => s + c.monthlyUsage, 0);
  const adjustmentsTotal = participantAdjustments.reduce((s, a) => s + a.delta, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue, participant adjustments, and usage tracking</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><DollarSign className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Monthly Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">+12%</p><p className="text-sm text-muted-foreground">Growth MoM</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-warning" /><div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Overdue Invoices</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Receipt className="h-5 w-5 text-info" /><div><p className="text-2xl font-bold">18</p><p className="text-sm text-muted-foreground">Invoices This Month</p></div></div></CardContent></Card>
      </div>

      {/* Participant Adjustments Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Participant Adjustments</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Prorated billing changes from participants added or removed mid-batch</p>
          </div>
          <Badge variant="secondary" className={`text-xs ${adjustmentsTotal >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            Net ${adjustmentsTotal >= 0 ? "+" : ""}{adjustmentsTotal.toLocaleString()}
          </Badge>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-border ml-2 space-y-4">
            {participantAdjustments.map((a) => {
              const positive = a.change === "added";
              const Icon = positive ? UserPlus : UserMinus;
              return (
                <li key={a.id} className="ml-4">
                  <span className={`absolute -left-2 mt-1.5 h-4 w-4 rounded-full flex items-center justify-center ${positive ? "bg-success/15" : "bg-destructive/15"}`}>
                    <Icon className={`h-2.5 w-2.5 ${positive ? "text-success" : "text-destructive"}`} />
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{a.batch}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.date} · {positive ? "Added" : "Removed"} {a.count} participant{a.count > 1 ? "s" : ""} · by {a.by}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold tabular-nums flex items-center gap-1 ${positive ? "text-success" : "text-destructive"}`}>
                      <ArrowRight className="h-3 w-3" />
                      {positive ? "+" : ""}${a.delta.toLocaleString()}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Customer Billing</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Active VMs</TableHead>
                <TableHead className="text-right">Monthly Usage</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.filter(c => c.status !== "suspended").map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-sm">{c.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs capitalize">{c.plan}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{c.activeVMs}</TableCell>
                  <TableCell className="text-right text-sm font-medium">${c.monthlyUsage.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs bg-success/10 text-success">Paid</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
