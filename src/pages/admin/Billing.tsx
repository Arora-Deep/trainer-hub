import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";

export default function AdminBilling() {
  const { customers } = useCustomerStore();
  const totalRevenue = customers.reduce((s, c) => s + c.monthlyUsage, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground text-sm mt-1">Revenue and usage tracking per customer</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><DollarSign className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p><p className="text-sm text-muted-foreground">Monthly Revenue</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">+12%</p><p className="text-sm text-muted-foreground">Growth MoM</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-warning" /><div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Overdue Invoices</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><Receipt className="h-5 w-5 text-info" /><div><p className="text-2xl font-bold">18</p><p className="text-sm text-muted-foreground">Invoices This Month</p></div></div></CardContent></Card>
      </div>

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
