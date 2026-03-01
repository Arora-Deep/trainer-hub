import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Wrench, RotateCcw, Bookmark } from "lucide-react";

const regions = [
  { name: "ap-south-1", location: "Mumbai, India", clusters: 3, status: "healthy" },
  { name: "us-east-1", location: "Virginia, USA", clusters: 2, status: "healthy" },
  { name: "eu-west-1", location: "Ireland", clusters: 1, status: "degraded" },
  { name: "us-west-2", location: "Oregon, USA", clusters: 1, status: "healthy" },
];

const clusters = [
  { name: "k8s-prod-mumbai-1", region: "ap-south-1", status: "active", cpu: { used: 280, total: 400 }, ram: { used: 1200, total: 1536 }, nodes: 12, alerts: 0, maintenance: false },
  { name: "k8s-prod-mumbai-2", region: "ap-south-1", status: "active", cpu: { used: 100, total: 150 }, ram: { used: 400, total: 512 }, nodes: 6, alerts: 1, maintenance: false },
  { name: "gpu-cluster-mumbai-1", region: "ap-south-1", status: "degraded", cpu: { used: 40, total: 50 }, ram: { used: 200, total: 512 }, nodes: 4, alerts: 2, maintenance: false },
  { name: "k8s-prod-virginia-1", region: "us-east-1", status: "active", cpu: { used: 120, total: 300 }, ram: { used: 500, total: 1024 }, nodes: 8, alerts: 0, maintenance: false },
  { name: "k8s-prod-ireland-1", region: "eu-west-1", status: "maintenance", cpu: { used: 60, total: 200 }, ram: { used: 300, total: 1024 }, nodes: 5, alerts: 0, maintenance: true },
];

const clusterStatusColors: Record<string, string> = {
  active: "bg-success/10 text-success", degraded: "bg-warning/10 text-warning", maintenance: "bg-info/10 text-info",
};

export default function RegionsClusters() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Regions & Clusters</h1>
        <p className="text-muted-foreground text-sm mt-1">Global infrastructure topology</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {regions.map(r => (
          <Card key={r.name} className={r.status === "degraded" ? "border-warning/50" : ""}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">{r.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.location}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs">{r.clusters} clusters</span>
                <Badge variant="secondary" className={`text-[10px] capitalize ${r.status === "healthy" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{r.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">All Clusters</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-xs">Cluster</TableHead><TableHead className="text-xs">Region</TableHead><TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">CPU</TableHead><TableHead className="text-xs">RAM</TableHead>
              <TableHead className="text-xs text-right">Nodes</TableHead><TableHead className="text-xs text-right">Alerts</TableHead>
              <TableHead className="text-xs w-10"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {clusters.map(c => (
                <TableRow key={c.name}>
                  <TableCell className="font-medium text-sm font-mono">{c.name}</TableCell>
                  <TableCell className="text-xs">{c.region}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${clusterStatusColors[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="text-xs">{c.cpu.used}/{c.cpu.total} vCPU</TableCell>
                  <TableCell className="text-xs">{c.ram.used}/{c.ram.total} GB</TableCell>
                  <TableCell className="text-xs text-right">{c.nodes}</TableCell>
                  <TableCell className="text-xs text-right">{c.alerts > 0 ? <span className="text-destructive font-medium">{c.alerts}</span> : "0"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Wrench className="h-3.5 w-3.5" /></Button>
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
