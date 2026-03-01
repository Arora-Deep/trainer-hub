import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, RotateCcw } from "lucide-react";

const runs = [
  { id: "VAL-001", blueprint: "Kubernetes Lab v2", version: "2.1.0", status: "passed", tests: 12, passed: 12, failed: 0, duration: "4m 32s", ranAt: "2026-02-28 14:00" },
  { id: "VAL-002", blueprint: "Docker Compose Lab", version: "1.1.0", status: "running", tests: 8, passed: 5, failed: 0, duration: "—", ranAt: "2026-02-28 16:30" },
  { id: "VAL-003", blueprint: "ML GPU Lab v1", version: "1.0.0", status: "passed", tests: 10, passed: 10, failed: 0, duration: "6m 15s", ranAt: "2026-02-28 12:00" },
  { id: "VAL-004", blueprint: "Ubuntu 24.04 LTS", version: "24.04.1", status: "failed", tests: 6, passed: 4, failed: 2, duration: "3m 10s", ranAt: "2026-02-27 18:00" },
];

export default function ValidationRuns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Validation Runs</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated test results for images and blueprints</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs"><Play className="h-3.5 w-3.5" /> Run New Validation</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Run ID</TableHead>
                <TableHead className="text-xs">Blueprint / Image</TableHead>
                <TableHead className="text-xs">Version</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Tests</TableHead>
                <TableHead className="text-xs text-right">Passed</TableHead>
                <TableHead className="text-xs text-right">Failed</TableHead>
                <TableHead className="text-xs">Duration</TableHead>
                <TableHead className="text-xs">Ran At</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs font-mono">{r.id}</TableCell>
                  <TableCell className="text-sm font-medium">{r.blueprint}</TableCell>
                  <TableCell className="text-xs font-mono">{r.version}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${r.status === "passed" ? "bg-success/10 text-success" : r.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-info/10 text-info"}`}>{r.status}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{r.tests}</TableCell>
                  <TableCell className="text-xs text-right text-success">{r.passed}</TableCell>
                  <TableCell className="text-xs text-right text-destructive">{r.failed}</TableCell>
                  <TableCell className="text-xs">{r.duration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.ranAt}</TableCell>
                  <TableCell><Button variant="ghost" size="icon" className="h-7 w-7"><RotateCcw className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
