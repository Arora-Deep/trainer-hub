import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";

export default function CostMargin() {
  const { customers } = useCustomerStore();
  const data = customers.filter(c => c.monthlyUsage > 0).map(c => ({
    ...c,
    estimatedCost: Math.round(c.monthlyUsage * 0.55),
    margin: Math.round(((c.monthlyUsage - c.monthlyUsage * 0.55) / c.monthlyUsage) * 100),
  }));

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Cost & Margin</h1><p className="text-muted-foreground text-sm mt-1">Internal cost analysis</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Tenant</TableHead><TableHead className="text-xs text-right">Revenue</TableHead>
            <TableHead className="text-xs text-right">Est. Cost</TableHead><TableHead className="text-xs text-right">Margin</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {data.map(d => (
              <TableRow key={d.id}>
                <TableCell className="font-medium text-sm">{d.name}</TableCell>
                <TableCell className="text-sm text-right">₹{d.monthlyUsage.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-right">₹{d.estimatedCost.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-right font-medium">{d.margin}%</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] ${d.margin >= 40 ? "bg-success/10 text-success" : d.margin >= 25 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{d.margin >= 40 ? "Healthy" : d.margin >= 25 ? "Watch" : "Alert"}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
