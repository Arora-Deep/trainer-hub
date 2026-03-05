import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const logs = [
  { event: "VM provisioned", user: "System", entity: "VM-2006", time: "2 min ago" },
  { event: "Batch created", user: "Rajesh Kumar", entity: "K8s Batch #15", time: "15 min ago" },
  { event: "Node heartbeat missed", user: "System", entity: "compute-mumbai-3", time: "30 min ago" },
  { event: "Invoice generated", user: "System", entity: "INV-3007", time: "1 hour ago" },
  { event: "User login", user: "admin@cloudadda.com", entity: "Session", time: "2 hours ago" },
  { event: "Template updated", user: "Infra Ops", entity: "Kubernetes Lab v2", time: "3 hours ago" },
  { event: "Credit adjustment", user: "Finance Team", entity: "DataScience Bootcamp", time: "4 hours ago" },
  { event: "Maintenance scheduled", user: "Infra Ops", entity: "gpu-mumbai-1", time: "5 hours ago" },
];

export default function SystemLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform event logs</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{l.event}</TableCell>
                  <TableCell className="text-sm">{l.user}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{l.entity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
