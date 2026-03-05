import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";

export default function CustomerHealth() {
  const { customers, tickets } = useCustomerStore();

  const healthData = customers.map(c => {
    const failures = Math.floor(Math.random() * 5);
    const openTix = tickets.filter(t => t.tenant === c.name && (t.status === "open" || t.status === "in_progress")).length;
    const overdue = c.overdueAmount > 0 ? 1 : 0;
    const score = Math.max(0, 100 - (failures * 2) - (openTix * 3) - (overdue * 10));
    return { ...c, failures, openTix, overdue, score };
  }).sort((a, b) => a.score - b.score);

  const scoreColor = (s: number) => s >= 80 ? "bg-success/10 text-success" : s >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Health</h1>
        <p className="text-muted-foreground text-sm mt-1">Health scores based on failures, tickets, and billing</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Provision Failures</TableHead>
                <TableHead className="text-right">Open Tickets</TableHead>
                <TableHead className="text-right">Overdue Billing</TableHead>
                <TableHead className="text-right">Health Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthData.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm font-medium">{c.name}</TableCell>
                  <TableCell className="text-sm text-right">{c.failures}</TableCell>
                  <TableCell className="text-sm text-right">{c.openTix}</TableCell>
                  <TableCell className="text-sm text-right">{c.overdueAmount > 0 ? `$${c.overdueAmount.toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className={`text-xs ${scoreColor(c.score)}`}>{c.score}</Badge>
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
