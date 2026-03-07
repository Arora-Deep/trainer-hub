import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomerStore } from "@/stores/customerStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Monitor, Zap, Users, CheckCircle2 } from "lucide-react";

const batchOptions = [
  { id: "b1", name: "K8s Batch #14", customer: "DevOps Academy" },
  { id: "b2", name: "ML Cohort #5", customer: "DataScience Bootcamp" },
  { id: "b3", name: "Linux Fund. #8", customer: "Corporate L&D Co" },
];

const students = [
  { name: "Alice Johnson", assignedVM: "VM-2001", node: "node-mum-01", status: "running" },
  { name: "Bob Williams", assignedVM: "VM-2002", node: "node-mum-02", status: "running" },
  { name: "Carol Davis", assignedVM: "—", node: "—", status: "not_assigned" },
  { name: "David Brown", assignedVM: "—", node: "—", status: "not_assigned" },
  { name: "Eva Martinez", assignedVM: "VM-2005", node: "gpu-mum-01", status: "failed" },
  { name: "Frank Lee", assignedVM: "—", node: "—", status: "not_assigned" },
  { name: "Grace Kim", assignedVM: "VM-2007", node: "node-mum-03", status: "running" },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  not_assigned: { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", label: "Not Assigned" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

export default function AssignVM() {
  const { customers } = useCustomerStore();
  const [customer, setCustomer] = useState("");
  const [batch, setBatch] = useState("");

  const assigned = students.filter(s => s.status === "running").length;
  const unassigned = students.filter(s => s.status === "not_assigned").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Assign VMs to students by batch — supports bulk assignment</p>
      </div>

      {/* Step 1: Select Customer & Batch */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Select Customer & Batch</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Customer" /></SelectTrigger>
              <SelectContent>
                {customers.filter(c => c.status === "active").map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={batch} onValueChange={setBatch}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select Batch" /></SelectTrigger>
              <SelectContent>
                {batchOptions.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {batch && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><Users className="h-4 w-4 text-primary" /></div>
              <div><p className="text-xs text-muted-foreground">Total Students</p><p className="text-xl font-bold">{students.length}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="h-4 w-4 text-green-600" /></div>
              <div><p className="text-xs text-muted-foreground">Assigned</p><p className="text-xl font-bold">{assigned}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10"><Monitor className="h-4 w-4 text-amber-600" /></div>
              <div><p className="text-xs text-muted-foreground">Unassigned</p><p className="text-xl font-bold">{unassigned}</p></div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Table */}
      {batch && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Students</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast({ title: "Auto Assign", description: "System will pick nodes with free capacity." })}>
                  <Zap className="h-3 w-3" /> Auto Assign
                </Button>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Monitor className="h-3 w-3" /> Bulk Assign
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Assigned VM</TableHead>
                  <TableHead>Node</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s, i) => {
                  const sc = statusConfig[s.status];
                  return (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm font-mono">{s.assignedVM}</TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">{s.node}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                          {sc.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {s.status === "not_assigned" && (
                          <Button size="sm" className="text-xs" onClick={() => toast({ title: "VM Assigned", description: `VM assigned to ${s.name}` })}>
                            Assign VM
                          </Button>
                        )}
                        {s.status === "failed" && (
                          <Button variant="outline" size="sm" className="text-xs text-red-600">Replace</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
