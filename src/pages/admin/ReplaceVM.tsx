import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ArrowLeftRight } from "lucide-react";

const vmData = [
  { student: "Alice Johnson", batch: "K8s Batch #14", currentVM: "VM-2001", node: "node-mum-01", status: "running" },
  { student: "Bob Williams", batch: "K8s Batch #14", currentVM: "VM-2002", node: "node-mum-02", status: "running" },
  { student: "Eva Martinez", batch: "ML Cohort #5", currentVM: "VM-2005", node: "gpu-mum-01", status: "failed" },
  { student: "David Brown", batch: "K8s Batch #2", currentVM: "VM-2004", node: "node-mum-03", status: "stopped" },
  { student: "Deepak Kumar", batch: "K8s Batch #14", currentVM: "VM-1007", node: "node-mum-03", status: "failed" },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

export default function ReplaceVM() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Replace VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Replace faulty or stopped VMs — system creates a new VM and destroys the old one</p>
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
              {vmData.map((v, i) => {
                const sc = statusConfig[v.status];
                return (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{v.student}</TableCell>
                    <TableCell className="text-sm">{v.batch}</TableCell>
                    <TableCell className="text-sm font-mono">{v.currentVM}</TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{v.node}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => toast({ title: "Replacing VM", description: `Creating new VM for ${v.student}, destroying ${v.currentVM}...` })}
                      >
                        <ArrowLeftRight className="h-3 w-3" /> Replace VM
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
