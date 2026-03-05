import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw, ArrowLeftRight, Key, FileText } from "lucide-react";

const vmInstances = [
  { vmId: "VM-2001", customer: "DevOps Academy", batch: "K8s Batch #14", student: "Alice Johnson", node: "compute-mumbai-1", status: "running", cpu: "45%", ram: "62%", lastSeen: "1 min ago" },
  { vmId: "VM-2002", customer: "DevOps Academy", batch: "K8s Batch #14", student: "Bob Williams", node: "compute-mumbai-2", status: "running", cpu: "32%", ram: "48%", lastSeen: "2 min ago" },
  { vmId: "VM-2003", customer: "Corporate L&D Co", batch: "Linux Fund. #8", student: "Carol Davis", node: "compute-virginia-1", status: "running", cpu: "78%", ram: "85%", lastSeen: "30 sec ago" },
  { vmId: "VM-2004", customer: "SkillBridge Labs", batch: "K8s Batch #2", student: "David Brown", node: "compute-mumbai-3", status: "stopped", cpu: "0%", ram: "0%", lastSeen: "2 hours ago" },
  { vmId: "VM-2005", customer: "DataScience Bootcamp", batch: "ML Cohort #5", student: "Eva Martinez", node: "gpu-mumbai-1", status: "failed", cpu: "0%", ram: "0%", lastSeen: "1 hour ago" },
  { vmId: "VM-2006", customer: "Corporate L&D Co", batch: "Linux Fund. #8", student: "Frank Lee", node: "compute-virginia-2", status: "running", cpu: "55%", ram: "70%", lastSeen: "45 sec ago" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export default function LabInstances() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = vmInstances.filter(v => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search && !v.vmId.toLowerCase().includes(search.toLowerCase()) && !v.student.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lab Instances</h1>
        <p className="text-muted-foreground text-sm mt-1">VM monitoring and management</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search VM ID or student..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VM ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Node</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">CPU</TableHead>
                <TableHead className="text-right">RAM</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.vmId}>
                  <TableCell className="text-sm font-mono">{v.vmId}</TableCell>
                  <TableCell className="text-sm">{v.customer}</TableCell>
                  <TableCell className="text-sm">{v.batch}</TableCell>
                  <TableCell className="text-sm">{v.student}</TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{v.node}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[v.status]}`}>{v.status}</Badge></TableCell>
                  <TableCell className="text-sm text-right">{v.cpu}</TableCell>
                  <TableCell className="text-sm text-right">{v.ram}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.lastSeen}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" title="Restart"><RotateCcw className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Replace"><ArrowLeftRight className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Reset Credentials"><Key className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="View Logs"><FileText className="h-3 w-3" /></Button>
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
