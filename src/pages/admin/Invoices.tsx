import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus, Download, Send } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success", due: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive", draft: "bg-muted text-muted-foreground",
};

export default function InvoicesPage() {
  const { invoices } = useCustomerStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Invoices</h1><p className="text-muted-foreground text-sm mt-1">{invoices.length} invoices</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Invoice</Button>
        </div>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Invoice</TableHead><TableHead className="text-xs">Tenant</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Due Date</TableHead><TableHead className="text-xs text-right">Overdue Days</TableHead>
            <TableHead className="text-xs w-10"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {invoices.map(inv => (
              <TableRow key={inv.id}>
                <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                <TableCell className="text-sm">{inv.tenant}</TableCell>
                <TableCell className="text-sm font-medium text-right">₹{inv.amount.toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[inv.status]}`}>{inv.status}</Badge></TableCell>
                <TableCell className="text-xs">{inv.dueDate}</TableCell>
                <TableCell className="text-xs text-right">{inv.overdueDays > 0 ? <span className="text-destructive">{inv.overdueDays}</span> : "—"}</TableCell>
                <TableCell>{inv.status === "overdue" && <Button variant="ghost" size="icon" className="h-7 w-7" title="Send Reminder"><Send className="h-3.5 w-3.5" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
