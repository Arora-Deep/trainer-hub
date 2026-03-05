import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const logs = [
  { action: "Reset VM credentials", customer: "DevOps Academy", vm: "VM-2001", operator: "Ravi M.", time: "10 min ago" },
  { action: "Restarted VM", customer: "Corporate L&D Co", vm: "VM-2003", operator: "Infra Ops", time: "30 min ago" },
  { action: "Replaced VM", customer: "DataScience Bootcamp", vm: "VM-2005", operator: "Ravi M.", time: "1 hour ago" },
  { action: "Resolved ticket TKT-2002", customer: "SkillBridge Labs", vm: "—", operator: "Ravi M.", time: "2 hours ago" },
  { action: "Escalated ticket TKT-2001", customer: "DataScience Bootcamp", vm: "—", operator: "Support", time: "3 hours ago" },
  { action: "Reset lab environment", customer: "DevOps Academy", vm: "VM-2002", operator: "Infra Ops", time: "4 hours ago" },
];

export default function SupportLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">Logs of support actions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>VM</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{l.action}</TableCell>
                  <TableCell className="text-sm">{l.customer}</TableCell>
                  <TableCell className="text-sm font-mono">{l.vm}</TableCell>
                  <TableCell className="text-sm">{l.operator}</TableCell>
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
