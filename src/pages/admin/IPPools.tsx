import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const pools = [
  { name: "Mumbai Primary", cidr: "10.100.0.0/16", total: 65534, assigned: 1240, available: 64294, status: "active" },
  { name: "Virginia Primary", cidr: "10.200.0.0/16", total: 65534, assigned: 580, available: 64954, status: "active" },
  { name: "Ireland Primary", cidr: "10.150.0.0/18", total: 16382, assigned: 320, available: 16062, status: "active" },
];

export default function IPPools() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">IP Pools</h1><p className="text-muted-foreground text-sm mt-1">IP address management</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Pool</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Pool Name</TableHead><TableHead className="text-xs">CIDR</TableHead>
            <TableHead className="text-xs text-right">Total IPs</TableHead><TableHead className="text-xs text-right">Assigned</TableHead>
            <TableHead className="text-xs text-right">Available</TableHead><TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {pools.map(p => (
              <TableRow key={p.name}>
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell className="text-xs font-mono">{p.cidr}</TableCell>
                <TableCell className="text-xs text-right">{p.total.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-right">{p.assigned.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-right">{p.available.toLocaleString()}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px] bg-success/10 text-success capitalize">{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
