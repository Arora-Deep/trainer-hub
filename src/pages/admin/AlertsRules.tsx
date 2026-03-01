import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const rules = [
  { name: "High CPU Usage", type: "threshold", condition: "CPU > 90% for 5 min", routing: "Email + SMS", muted: false, status: "active" },
  { name: "Provision Failure Spike", type: "anomaly", condition: "Failures > 3x avg in 1h", routing: "Webhook + Email", muted: false, status: "active" },
  { name: "Storage Latency", type: "threshold", condition: "Latency > 5ms for 2 min", routing: "Email", muted: false, status: "active" },
  { name: "GPU Temperature", type: "threshold", condition: "Temp > 85°C", routing: "SMS", muted: true, status: "muted" },
];

export default function AlertsRules() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Alerts & Rules</h1><p className="text-muted-foreground text-sm mt-1">Alert configuration and routing</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Rule</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Rule Name</TableHead><TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs">Condition</TableHead><TableHead className="text-xs">Routing</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {rules.map(r => (
              <TableRow key={r.name}>
                <TableCell className="font-medium text-sm">{r.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{r.type}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.condition}</TableCell>
                <TableCell className="text-xs">{r.routing}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${r.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{r.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
