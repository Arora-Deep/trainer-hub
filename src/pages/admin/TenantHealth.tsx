import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { AlertTriangle } from "lucide-react";

export default function TenantHealth() {
  const { customers } = useCustomerStore();
  const sorted = [...customers].sort((a, b) => a.healthScore - b.healthScore);

  const getAction = (t: typeof customers[0]) => {
    if (t.healthScore < 40) return "Immediate review required";
    if (t.overdueAmount > 0) return "Follow up on overdue payments";
    if (t.openTickets > 3) return "Review open ticket backlog";
    if (t.healthScore < 70) return "Monitor closely";
    return "No action needed";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tenant Health</h1>
        <p className="text-muted-foreground text-sm mt-1">Risk-based portfolio view</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Tenant</TableHead>
                <TableHead className="text-xs text-center">Health Score</TableHead>
                <TableHead className="text-xs text-right">Overdue</TableHead>
                <TableHead className="text-xs text-right">Tickets</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Suggested Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(t => (
                <TableRow key={t.id} className={t.healthScore < 40 ? "bg-destructive/5" : ""}>
                  <TableCell className="font-medium text-sm">{t.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className={`text-[10px] font-mono ${t.healthScore >= 80 ? "bg-success/10 text-success" : t.healthScore >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{t.healthScore}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs">{t.overdueAmount > 0 ? <span className="text-destructive">₹{t.overdueAmount.toLocaleString()}</span> : "—"}</TableCell>
                  <TableCell className="text-right text-xs">{t.openTickets}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{t.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground flex items-center gap-1.5">
                    {t.healthScore < 70 && <AlertTriangle className="h-3 w-3 text-warning" />}
                    {getAction(t)}
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
