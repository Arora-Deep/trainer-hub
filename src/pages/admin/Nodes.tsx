import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, RotateCcw, Eye } from "lucide-react";

const nodes = [
  { node: "compute-mumbai-1", cpu: "70%", ram: "75%", storage: "60%", vms: 45, status: "healthy", lastHeartbeat: "30 sec ago" },
  { node: "compute-mumbai-2", cpu: "55%", ram: "62%", storage: "48%", vms: 38, status: "healthy", lastHeartbeat: "25 sec ago" },
  { node: "compute-mumbai-3", cpu: "82%", ram: "88%", storage: "72%", vms: 52, status: "warning", lastHeartbeat: "1 min ago" },
  { node: "compute-virginia-1", cpu: "45%", ram: "50%", storage: "40%", vms: 28, status: "healthy", lastHeartbeat: "20 sec ago" },
  { node: "compute-virginia-2", cpu: "38%", ram: "42%", storage: "35%", vms: 22, status: "healthy", lastHeartbeat: "30 sec ago" },
  { node: "gpu-mumbai-1", cpu: "90%", ram: "92%", storage: "65%", vms: 15, status: "critical", lastHeartbeat: "45 sec ago" },
  { node: "storage-eu-west-1", cpu: "30%", ram: "65%", storage: "82%", vms: 18, status: "warning", lastHeartbeat: "40 sec ago" },
];

const statusColors: Record<string, string> = {
  healthy: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
  maintenance: "bg-muted text-muted-foreground",
};

export default function AdminNodes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nodes</h1>
        <p className="text-muted-foreground text-sm mt-1">Infrastructure node management</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">RAM</TableHead>
                <TableHead className="text-right">Storage</TableHead>
                <TableHead className="text-right">VMs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Heartbeat</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((n) => (
                <TableRow key={n.node}>
                  <TableCell className="text-sm font-mono font-medium">{n.node}</TableCell>
                  <TableCell className="text-sm text-right">{n.cpu}</TableCell>
                  <TableCell className="text-sm text-right">{n.ram}</TableCell>
                  <TableCell className="text-sm text-right">{n.storage}</TableCell>
                  <TableCell className="text-sm text-right">{n.vms}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[n.status]}`}>{n.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{n.lastHeartbeat}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" title="Maintenance"><Wrench className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Reboot"><RotateCcw className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Details"><Eye className="h-3 w-3" /></Button>
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
