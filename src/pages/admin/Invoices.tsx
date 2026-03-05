import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Bell, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  due: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
  draft: "bg-muted text-muted-foreground",
};

export default function AdminInvoices() {
  const { invoices } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground text-sm mt-1">Invoice management</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="text-sm font-mono">{inv.id}</TableCell>
                  <TableCell className="text-sm">{inv.tenant}</TableCell>
                  <TableCell className="text-sm text-right font-medium">${inv.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[inv.status]}`}>{inv.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {(inv.status === "due" || inv.status === "overdue") && (
                        <Button variant="outline" size="sm" className="gap-1 text-xs"><Bell className="h-3 w-3" /> Remind</Button>
                      )}
                      {inv.status !== "paid" && (
                        <Button variant="outline" size="sm" className="gap-1 text-xs"><CheckCircle className="h-3 w-3" /> Mark Paid</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
