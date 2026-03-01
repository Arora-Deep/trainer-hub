import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const pools = [
  { name: "Enterprise Pool", type: "Compute", cpu: 400, ram: 2048, tenants: 2, templates: 5, status: "active" },
  { name: "GPU Pool", type: "GPU", cpu: 50, ram: 512, tenants: 1, templates: 2, status: "active" },
  { name: "India Budget Pool", type: "Compute", cpu: 200, ram: 1024, tenants: 3, templates: 8, status: "active" },
  { name: "Trial Pool", type: "Compute", cpu: 50, ram: 256, tenants: 1, templates: 3, status: "limited" },
];

export default function ResourcePools() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Resource Pools</h1><p className="text-muted-foreground text-sm mt-1">Logical resource groupings</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Pool</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Pool Name</TableHead><TableHead className="text-xs">Type</TableHead>
            <TableHead className="text-xs text-right">CPU</TableHead><TableHead className="text-xs text-right">RAM (GB)</TableHead>
            <TableHead className="text-xs text-right">Tenants</TableHead><TableHead className="text-xs text-right">Templates</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {pools.map(p => (
              <TableRow key={p.name} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px]">{p.type}</Badge></TableCell>
                <TableCell className="text-xs text-right">{p.cpu}</TableCell>
                <TableCell className="text-xs text-right">{p.ram}</TableCell>
                <TableCell className="text-xs text-right">{p.tenants}</TableCell>
                <TableCell className="text-xs text-right">{p.templates}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${p.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
