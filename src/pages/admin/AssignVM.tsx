import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerStore } from "@/stores/customerStore";
import { Monitor, Zap } from "lucide-react";

const students = [
  { name: "Alice Johnson", assignedVM: "VM-2001", status: "running" },
  { name: "Bob Williams", assignedVM: "VM-2002", status: "running" },
  { name: "Carol Davis", assignedVM: "—", status: "not_assigned" },
  { name: "David Brown", assignedVM: "—", status: "not_assigned" },
  { name: "Eva Martinez", assignedVM: "VM-2005", status: "failed" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  not_assigned: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export default function AssignVM() {
  const { customers } = useCustomerStore();
  const [customer, setCustomer] = useState("");
  const [batch, setBatch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Assign VMs to students by batch</p>
      </div>

      <Tabs defaultValue="batch">
        <TabsList><TabsTrigger value="batch">Assign by Batch</TabsTrigger></TabsList>
        <TabsContent value="batch" className="space-y-4 mt-4">
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
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select Batch" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="b1">K8s Batch #14</SelectItem>
                <SelectItem value="b2">ML Cohort #5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Students</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1 text-xs"><Zap className="h-3 w-3" /> Auto Assign</Button>
                  <Button size="sm" className="gap-1 text-xs"><Monitor className="h-3 w-3" /> Bulk Assign</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assigned VM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm font-mono">{s.assignedVM}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[s.status]}`}>{s.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-right">
                        {s.status === "not_assigned" && <Button size="sm" className="text-xs">Assign VM</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
