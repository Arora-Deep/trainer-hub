import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search } from "lucide-react";
import { useState } from "react";

const logs = [
  { timestamp: "2026-02-28 16:45:12", user: "rahul@cloudadda.com", action: "Tenant quota updated", target: "DevOps Academy", details: "CPU: 400 → 500", ip: "103.42.56.80" },
  { timestamp: "2026-02-28 16:30:00", user: "sneha@cloudadda.com", action: "Maintenance scheduled", target: "k8s-prod-ireland-1", details: "Window: 2026-03-02 02:00-06:00", ip: "192.168.1.50" },
  { timestamp: "2026-02-28 15:30:00", user: "meera@cloudadda.com", action: "Credit issued", target: "DataScience Bootcamp", details: "₹5,000 — GPU failure compensation", ip: "10.0.0.15" },
  { timestamp: "2026-02-28 14:00:00", user: "arun@cloudadda.com", action: "Ticket assigned", target: "TKT-2001", details: "Assigned to Ops Team", ip: "10.0.0.22" },
  { timestamp: "2026-02-28 10:00:00", user: "vikram@cloudadda.com", action: "Tenant created", target: "CloudLearn Pro", details: "Starter plan, us-west-2", ip: "72.14.225.100" },
  { timestamp: "2026-02-27 18:00:00", user: "rahul@cloudadda.com", action: "Blueprint approved", target: "Docker Compose Lab v1.1.0", details: "Promoted from tested", ip: "103.42.56.80" },
];

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const filtered = logs.filter(l => !search || Object.values(l).some(v => v.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1><p className="text-muted-foreground text-sm mt-1">Complete audit trail</p></div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search audit logs..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Timestamp</TableHead><TableHead className="text-xs">User</TableHead>
            <TableHead className="text-xs">Action</TableHead><TableHead className="text-xs">Target</TableHead>
            <TableHead className="text-xs">Details</TableHead><TableHead className="text-xs">IP</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map((l, i) => (
              <TableRow key={i}><TableCell className="text-xs text-muted-foreground whitespace-nowrap">{l.timestamp}</TableCell><TableCell className="text-xs">{l.user}</TableCell><TableCell className="text-sm font-medium">{l.action}</TableCell><TableCell className="text-xs">{l.target}</TableCell><TableCell className="text-xs text-muted-foreground">{l.details}</TableCell><TableCell className="text-xs font-mono">{l.ip}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
