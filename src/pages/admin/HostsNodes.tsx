import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ShieldOff, RotateCcw, Stethoscope, Ban } from "lucide-react";

const nodes = [
  { hostname: "node-mumbai-001", status: "active", cpu: "78%", ram: "82%", vms: 24, storageLatency: "1.2ms", networkThroughput: "8.5 Gbps", notes: "" },
  { hostname: "node-mumbai-002", status: "active", cpu: "65%", ram: "71%", vms: 18, storageLatency: "0.9ms", networkThroughput: "9.1 Gbps", notes: "" },
  { hostname: "node-mumbai-003", status: "cordoned", cpu: "92%", ram: "95%", vms: 30, storageLatency: "3.8ms", networkThroughput: "6.2 Gbps", notes: "High load — cordoned" },
  { hostname: "gpu-node-001", status: "active", cpu: "88%", ram: "90%", vms: 8, storageLatency: "1.5ms", networkThroughput: "10.0 Gbps", notes: "GPU node" },
  { hostname: "node-virginia-001", status: "active", cpu: "45%", ram: "52%", vms: 12, storageLatency: "0.8ms", networkThroughput: "9.8 Gbps", notes: "" },
  { hostname: "node-ireland-001", status: "maintenance", cpu: "0%", ram: "0%", vms: 0, storageLatency: "—", networkThroughput: "—", notes: "Scheduled maintenance" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success", cordoned: "bg-warning/10 text-warning", maintenance: "bg-info/10 text-info", quarantined: "bg-destructive/10 text-destructive",
};

export default function HostsNodes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hosts / Nodes</h1>
        <p className="text-muted-foreground text-sm mt-1">Physical and virtual host management</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-xs">Hostname</TableHead><TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs text-right">CPU</TableHead><TableHead className="text-xs text-right">RAM</TableHead>
              <TableHead className="text-xs text-right">VMs</TableHead><TableHead className="text-xs text-right">Storage Latency</TableHead>
              <TableHead className="text-xs text-right">Network</TableHead><TableHead className="text-xs">Notes</TableHead><TableHead className="text-xs w-10"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {nodes.map(n => (
                <TableRow key={n.hostname}>
                  <TableCell className="font-mono text-sm">{n.hostname}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[n.status]}`}>{n.status}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{n.cpu}</TableCell>
                  <TableCell className="text-xs text-right">{n.ram}</TableCell>
                  <TableCell className="text-xs text-right">{n.vms}</TableCell>
                  <TableCell className="text-xs text-right">{n.storageLatency}</TableCell>
                  <TableCell className="text-xs text-right">{n.networkThroughput}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{n.notes}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><ShieldOff className="h-3.5 w-3.5" /> Cordon/Drain</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /> Reboot</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Stethoscope className="h-3.5 w-3.5" /> Run Diagnostics</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer text-destructive"><Ban className="h-3.5 w-3.5" /> Quarantine</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
