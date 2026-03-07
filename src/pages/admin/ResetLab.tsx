import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { RotateCcw, Power } from "lucide-react";

const labData = [
  { student: "Alice Johnson", batch: "K8s Batch #14", vm: "VM-2001", status: "running" },
  { student: "Bob Williams", batch: "K8s Batch #14", vm: "VM-2002", status: "running" },
  { student: "Carol Davis", batch: "Linux Fund. #8", vm: "VM-2003", status: "running" },
  { student: "David Brown", batch: "K8s Batch #2", vm: "VM-2004", status: "stopped" },
  { student: "Eva Martinez", batch: "ML Cohort #5", vm: "VM-2005", status: "failed" },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  stopped: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Stopped" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

export default function ResetLab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">Reset student lab environments and restart VMs</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>VM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labData.map((l, i) => {
                const sc = statusConfig[l.status];
                return (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium">{l.student}</TableCell>
                    <TableCell className="text-sm">{l.batch}</TableCell>
                    <TableCell className="text-sm font-mono">{l.vm}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => toast({ title: "Lab Reset", description: `Resetting lab for ${l.student}...` })}
                        >
                          <RotateCcw className="h-3 w-3" /> Reset Lab
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() => toast({ title: "VM Restart", description: `Restarting ${l.vm}...` })}
                        >
                          <Power className="h-3 w-3" /> Restart VM
                        </Button>
                      </div>
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
