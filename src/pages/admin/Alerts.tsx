import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, FileText } from "lucide-react";

const alerts = [
  { alert: "GPU capacity exhausted in ap-south-1", source: "Infrastructure", severity: "critical", status: "active", created: "15 min ago" },
  { alert: "High latency on storage pool EU-WEST-1", source: "Storage", severity: "major", status: "investigating", created: "2 hours ago" },
  { alert: "Invoice INV-3003 overdue by 14 days", source: "Billing", severity: "warning", status: "active", created: "1 day ago" },
  { alert: "Node compute-virginia-3 heartbeat missed", source: "Infrastructure", severity: "major", status: "active", created: "45 min ago" },
  { alert: "Intermittent DNS resolution failures", source: "Network", severity: "minor", status: "resolved", created: "1 day ago" },
  { alert: "Disk usage > 85% on storage-eu-west-1", source: "Storage", severity: "warning", status: "active", created: "3 hours ago" },
];

const severityColor: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  major: "bg-warning/10 text-warning",
  warning: "bg-warning/10 text-warning",
  minor: "bg-muted text-muted-foreground",
};

const statusColor: Record<string, string> = {
  active: "bg-destructive/10 text-destructive",
  investigating: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
};

export default function AdminAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform alerts and incidents</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{a.alert}</TableCell>
                  <TableCell className="text-sm">{a.source}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${severityColor[a.severity]}`}>{a.severity}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColor[a.status]}`}>{a.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {a.status !== "resolved" && (
                        <Button variant="outline" size="sm" className="gap-1 text-xs"><CheckCircle className="h-3 w-3" /> Resolve</Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1 text-xs"><FileText className="h-3 w-3" /> View logs</Button>
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
