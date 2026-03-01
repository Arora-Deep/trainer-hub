import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const logs = [
  { user: "student1@devopsacademy.in", type: "SSH", tenant: "DevOps Academy", batch: "K8s Batch #14", when: "2026-02-28 16:45", duration: "45m", sourceIP: "103.42.56.78" },
  { user: "student2@dsbootcamp.com", type: "VNC", tenant: "DataScience Bootcamp", batch: "ML Cohort #5", when: "2026-02-28 16:30", duration: "1h 20m", sourceIP: "122.15.33.90" },
  { user: "student3@corpld.com", type: "RDP", tenant: "Corporate L&D Co", batch: "Linux Fundamentals #8", when: "2026-02-28 16:15", duration: "30m", sourceIP: "72.14.225.100" },
  { user: "trainer@devopsacademy.in", type: "SSH", tenant: "DevOps Academy", batch: "K8s Batch #14", when: "2026-02-28 15:00", duration: "2h 10m", sourceIP: "103.42.56.80" },
  { user: "student4@skillbridge.in", type: "SSH", tenant: "SkillBridge Labs", batch: "Docker Batch #3", when: "2026-02-28 14:00", duration: "55m", sourceIP: "49.37.12.45" },
];

export default function SessionAccessLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Session Access Logs</h1><p className="text-muted-foreground text-sm mt-1">RDP/VNC/SSH session history</p></div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">User</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Tenant</TableHead>
            <TableHead className="text-xs">Batch</TableHead><TableHead className="text-xs">When</TableHead>
            <TableHead className="text-xs">Duration</TableHead><TableHead className="text-xs">Source IP</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {logs.map((l, i) => (
              <TableRow key={i}>
                <TableCell className="text-xs">{l.user}</TableCell>
                <TableCell className="text-xs font-mono">{l.type}</TableCell>
                <TableCell className="text-xs">{l.tenant}</TableCell>
                <TableCell className="text-xs">{l.batch}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{l.when}</TableCell>
                <TableCell className="text-xs">{l.duration}</TableCell>
                <TableCell className="text-xs font-mono">{l.sourceIP}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
