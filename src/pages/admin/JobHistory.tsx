import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";

const history = [
  { id: "JOB-0990", type: "create", tenant: "DevOps Academy", blueprint: "Kubernetes Lab v2", seats: 40, status: "completed", duration: "5m 12s", date: "2026-02-27" },
  { id: "JOB-0985", type: "create", tenant: "Corporate L&D Co", blueprint: "AWS Simulation Lab", seats: 80, status: "completed", duration: "8m 30s", date: "2026-02-26" },
  { id: "JOB-0980", type: "destroy", tenant: "SkillBridge Labs", blueprint: "Docker Compose Lab", seats: 30, status: "completed", duration: "1m 45s", date: "2026-02-25" },
  { id: "JOB-0975", type: "create", tenant: "DataScience Bootcamp", blueprint: "ML GPU Lab v1", seats: 25, status: "failed", duration: "12m", date: "2026-02-24" },
  { id: "JOB-0970", type: "extend", tenant: "DevOps Academy", blueprint: "Linux + Networking Lab v1", seats: 50, status: "completed", duration: "0m 45s", date: "2026-02-23" },
];

export default function JobHistory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job History</h1>
          <p className="text-muted-foreground text-sm mt-1">Historical provisioning jobs</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-xs">Job ID</TableHead><TableHead className="text-xs">Type</TableHead><TableHead className="text-xs">Tenant</TableHead>
              <TableHead className="text-xs">Blueprint</TableHead><TableHead className="text-xs text-right">Seats</TableHead><TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Duration</TableHead><TableHead className="text-xs">Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs font-mono">{h.id}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{h.type}</Badge></TableCell>
                  <TableCell className="text-xs">{h.tenant}</TableCell>
                  <TableCell className="text-xs">{h.blueprint}</TableCell>
                  <TableCell className="text-xs text-right">{h.seats}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${h.status === "completed" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{h.status}</Badge></TableCell>
                  <TableCell className="text-xs">{h.duration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
