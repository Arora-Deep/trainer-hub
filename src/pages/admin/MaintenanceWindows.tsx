import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const windows = [
  { id: "MW-001", clusters: "k8s-prod-ireland-1", start: "2026-03-02 02:00", end: "2026-03-02 06:00", status: "scheduled", muting: true, banner: true },
  { id: "MW-002", clusters: "gpu-cluster-mumbai-1", start: "2026-03-05 00:00", end: "2026-03-05 04:00", status: "planned", muting: true, banner: false },
  { id: "MW-003", clusters: "k8s-prod-mumbai-1, k8s-prod-mumbai-2", start: "2026-02-25 01:00", end: "2026-02-25 05:00", status: "completed", muting: true, banner: true },
];

export default function MaintenanceWindows() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Maintenance Windows</h1><p className="text-muted-foreground text-sm mt-1">Scheduled maintenance</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Schedule Maintenance</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">ID</TableHead><TableHead className="text-xs">Clusters</TableHead>
            <TableHead className="text-xs">Start</TableHead><TableHead className="text-xs">End</TableHead>
            <TableHead className="text-xs">Status</TableHead><TableHead className="text-xs text-center">Muting</TableHead>
            <TableHead className="text-xs text-center">Banner</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {windows.map(w => (
              <TableRow key={w.id}>
                <TableCell className="text-xs font-mono">{w.id}</TableCell>
                <TableCell className="text-xs max-w-[200px] truncate">{w.clusters}</TableCell>
                <TableCell className="text-xs">{w.start}</TableCell>
                <TableCell className="text-xs">{w.end}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${w.status === "scheduled" ? "bg-warning/10 text-warning" : w.status === "completed" ? "bg-success/10 text-success" : "bg-info/10 text-info"}`}>{w.status}</Badge></TableCell>
                <TableCell className="text-center">{w.muting ? "✓" : "—"}</TableCell>
                <TableCell className="text-center">{w.banner ? "✓" : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
