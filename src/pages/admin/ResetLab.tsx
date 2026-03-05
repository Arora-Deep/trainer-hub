import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcw, Power } from "lucide-react";

const labData = [
  { student: "Alice Johnson", batch: "K8s Batch #14", vm: "VM-2001", status: "running" },
  { student: "Bob Williams", batch: "K8s Batch #14", vm: "VM-2002", status: "running" },
  { student: "Carol Davis", batch: "Linux Fund. #8", vm: "VM-2003", status: "running" },
  { student: "David Brown", batch: "K8s Batch #2", vm: "VM-2004", status: "stopped" },
  { student: "Eva Martinez", batch: "ML Cohort #5", vm: "VM-2005", status: "failed" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export default function ResetLab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reset Lab</h1>
        <p className="text-muted-foreground text-sm mt-1">Reset student labs and restart VMs</p>
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
              {labData.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{l.student}</TableCell>
                  <TableCell className="text-sm">{l.batch}</TableCell>
                  <TableCell className="text-sm font-mono">{l.vm}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[l.status]}`}>{l.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" className="gap-1 text-xs"><RotateCcw className="h-3 w-3" /> Reset Lab</Button>
                      <Button variant="outline" size="sm" className="gap-1 text-xs"><Power className="h-3 w-3" /> Restart VM</Button>
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
