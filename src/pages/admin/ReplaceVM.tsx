import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight } from "lucide-react";

const vmData = [
  { student: "Alice Johnson", batch: "K8s Batch #14", currentVM: "VM-2001", node: "compute-mumbai-1", status: "running" },
  { student: "Bob Williams", batch: "K8s Batch #14", currentVM: "VM-2002", node: "compute-mumbai-2", status: "running" },
  { student: "Eva Martinez", batch: "ML Cohort #5", currentVM: "VM-2005", node: "gpu-mumbai-1", status: "failed" },
  { student: "David Brown", batch: "K8s Batch #2", currentVM: "VM-2004", node: "compute-mumbai-3", status: "stopped" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export default function ReplaceVM() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Replace VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Replace faulty or stopped VMs</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Current VM</TableHead>
                <TableHead>Node</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vmData.map((v, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{v.student}</TableCell>
                  <TableCell className="text-sm">{v.batch}</TableCell>
                  <TableCell className="text-sm font-mono">{v.currentVM}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{v.node}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[v.status]}`}>{v.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="gap-1 text-xs"><ArrowLeftRight className="h-3 w-3" /> Replace VM</Button>
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
