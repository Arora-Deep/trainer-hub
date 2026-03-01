import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const gpus = [
  { type: "NVIDIA A100", count: 4, allocated: 3, available: 1, region: "ap-south-1", status: "healthy" },
  { type: "NVIDIA A100", count: 4, allocated: 3, available: 1, region: "ap-south-1", status: "quarantined" },
  { type: "NVIDIA T4", count: 8, allocated: 5, available: 3, region: "us-east-1", status: "healthy" },
  { type: "NVIDIA V100", count: 2, allocated: 0, available: 2, region: "eu-west-1", status: "healthy" },
];

export default function GPUPools() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">GPU Pools</h1><p className="text-muted-foreground text-sm mt-1">GPU inventory and allocation</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">GPU Type</TableHead><TableHead className="text-xs text-right">Total</TableHead>
            <TableHead className="text-xs text-right">Allocated</TableHead><TableHead className="text-xs text-right">Available</TableHead>
            <TableHead className="text-xs">Region</TableHead><TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {gpus.map((g, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-sm">{g.type}</TableCell>
                <TableCell className="text-xs text-right">{g.count}</TableCell>
                <TableCell className="text-xs text-right">{g.allocated}</TableCell>
                <TableCell className="text-xs text-right">{g.available}</TableCell>
                <TableCell className="text-xs">{g.region}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${g.status === "healthy" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{g.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
