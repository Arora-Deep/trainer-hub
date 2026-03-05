import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const auditLogs = [
  { admin: "Super Admin", action: "Suspended customer", entity: "NexGen Academy", before: "active", after: "suspended", time: "1 hour ago" },
  { admin: "Finance Team", action: "Credit adjustment", entity: "DataScience Bootcamp", before: "₹3,200", after: "₹8,200", time: "2 hours ago" },
  { admin: "Infra Ops", action: "Changed node status", entity: "gpu-mumbai-1", before: "healthy", after: "maintenance", time: "3 hours ago" },
  { admin: "Super Admin", action: "Updated pricing", entity: "Professional Plan", before: "₹15,000/q", after: "₹16,500/q", time: "1 day ago" },
  { admin: "Ravi M.", action: "Impersonated customer", entity: "DevOps Academy", before: "—", after: "Session started", time: "1 day ago" },
  { admin: "Super Admin", action: "Approved quota increase", entity: "DevOps Academy", before: "500 vCPU", after: "750 vCPU", time: "2 days ago" },
];

export default function AdminAuditLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all admin actions with before/after diffs</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Before</TableHead>
                <TableHead>After</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{l.admin}</TableCell>
                  <TableCell className="text-sm">{l.action}</TableCell>
                  <TableCell className="text-sm">{l.entity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.before}</TableCell>
                  <TableCell className="text-sm font-medium">{l.after}</TableCell>
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
