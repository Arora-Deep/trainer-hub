import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerStore } from "@/stores/customerStore";

export default function RevenueReports() {
  const { customers, invoices } = useCustomerStore();
  const mrr = customers.reduce((s, c) => s + c.monthlyUsage, 0);
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const unpaid = invoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Revenue Reports</h1><p className="text-muted-foreground text-sm mt-1">Revenue and financial health</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p><p className="text-2xl font-bold mt-1">₹{mrr.toLocaleString()}</p><p className="text-xs text-success mt-1">+8% MoM</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Paid This Period</p><p className="text-2xl font-bold mt-1 text-success">₹{paid.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Unpaid / Outstanding</p><p className="text-2xl font-bold mt-1 text-destructive">₹{unpaid.toLocaleString()}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Churn Signals</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {customers.filter(c => c.healthScore < 50 || c.status === "suspended").map(c => (
              <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0 text-sm">
                <span className="font-medium">{c.name}</span>
                <span className="text-xs text-destructive">{c.status === "suspended" ? "Suspended" : `Health: ${c.healthScore}`}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
