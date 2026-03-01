import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const storagePools = [
  { name: "ssd-pool-mumbai", capacity: "10 TB", used: "7.2 TB", iops: "45K", latency: "0.8ms", errorRate: "0.01%", status: "healthy" },
  { name: "ssd-pool-virginia", capacity: "5 TB", used: "2.8 TB", iops: "32K", latency: "0.6ms", errorRate: "0%", status: "healthy" },
  { name: "hdd-pool-ireland", capacity: "20 TB", used: "12 TB", iops: "8K", latency: "4.2ms", errorRate: "0.03%", status: "degraded" },
  { name: "nvme-pool-mumbai", capacity: "2 TB", used: "1.8 TB", iops: "120K", latency: "0.2ms", errorRate: "0%", status: "warning" },
];

export default function StoragePools() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Storage Pools</h1><p className="text-muted-foreground text-sm mt-1">Storage health and capacity</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Pool</TableHead><TableHead className="text-xs">Capacity</TableHead><TableHead className="text-xs">Used</TableHead>
            <TableHead className="text-xs">IOPS</TableHead><TableHead className="text-xs">Latency</TableHead><TableHead className="text-xs">Error Rate</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {storagePools.map(s => (
              <TableRow key={s.name}>
                <TableCell className="font-mono text-sm">{s.name}</TableCell>
                <TableCell className="text-xs">{s.capacity}</TableCell><TableCell className="text-xs">{s.used}</TableCell>
                <TableCell className="text-xs">{s.iops}</TableCell><TableCell className="text-xs">{s.latency}</TableCell>
                <TableCell className="text-xs">{s.errorRate}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${s.status === "healthy" ? "bg-success/10 text-success" : s.status === "degraded" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{s.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
