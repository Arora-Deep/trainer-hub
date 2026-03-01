import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";

export default function Payments() {
  const { invoices } = useCustomerStore();
  const overdue = invoices.filter(i => i.status === "overdue");

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Payments / Collections</h1><p className="text-muted-foreground text-sm mt-1">Outstanding payments and follow-ups</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Overdue</p><p className="text-2xl font-bold mt-1 text-destructive">₹{overdue.reduce((s, i) => s + i.amount, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Overdue Invoices</p><p className="text-2xl font-bold mt-1">{overdue.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Avg Overdue Days</p><p className="text-2xl font-bold mt-1">{overdue.length > 0 ? Math.round(overdue.reduce((s, i) => s + i.overdueDays, 0) / overdue.length) : 0}</p></CardContent></Card>
      </div>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Overdue List</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead className="text-xs">Invoice</TableHead><TableHead className="text-xs">Tenant</TableHead><TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs text-right">Days Overdue</TableHead></TableRow></TableHeader>
            <TableBody>
              {overdue.map(i => (
                <TableRow key={i.id}><TableCell className="text-xs font-mono">{i.id}</TableCell><TableCell className="text-sm">{i.tenant}</TableCell><TableCell className="text-sm text-right font-medium">₹{i.amount.toLocaleString()}</TableCell><TableCell className="text-xs text-right text-destructive">{i.overdueDays}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
