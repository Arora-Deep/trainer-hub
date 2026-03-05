import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RotateCcw, Key } from "lucide-react";

const students = [
  { student: "Alice Johnson", customer: "DevOps Academy", batch: "K8s Batch #14", vm: "VM-2001", status: "active" },
  { student: "Bob Williams", customer: "DevOps Academy", batch: "K8s Batch #14", vm: "VM-2002", status: "active" },
  { student: "Carol Davis", customer: "Corporate L&D Co", batch: "Linux Fund. #8", vm: "VM-2003", status: "active" },
  { student: "David Brown", customer: "SkillBridge Labs", batch: "K8s Batch #2", vm: "VM-2004", status: "inactive" },
  { student: "Eva Martinez", customer: "DataScience Bootcamp", batch: "ML Cohort #5", vm: "VM-2005", status: "active" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
};

export default function AdminStudents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground text-sm mt-1">All registered students across customers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>VM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{s.student}</TableCell>
                  <TableCell className="text-sm">{s.customer}</TableCell>
                  <TableCell className="text-sm">{s.batch}</TableCell>
                  <TableCell className="text-sm font-mono">{s.vm}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[s.status]}`}>{s.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" title="Reset Lab"><RotateCcw className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Reset Password"><Key className="h-3 w-3" /></Button>
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
