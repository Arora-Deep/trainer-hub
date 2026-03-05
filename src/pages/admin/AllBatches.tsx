import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Edit, CheckCircle, Server } from "lucide-react";

const batchData = [
  { id: "B-001", batch: "K8s Batch #14", customer: "DevOps Academy", template: "Kubernetes Lab v2", seats: 30, runningLabs: 28, start: "2026-02-15", end: "2026-03-15", status: "running" },
  { id: "B-002", batch: "ML Cohort #5", customer: "DataScience Bootcamp", template: "ML GPU Lab v1", seats: 25, runningLabs: 0, start: "2026-02-20", end: "2026-03-20", status: "scheduled" },
  { id: "B-003", batch: "Linux Fundamentals #8", customer: "Corporate L&D Co", template: "Linux + Networking", seats: 40, runningLabs: 38, start: "2026-02-10", end: "2026-03-10", status: "running" },
  { id: "B-004", batch: "Docker Batch #3", customer: "SkillBridge Labs", template: "Docker Compose", seats: 20, runningLabs: 0, start: "2026-01-05", end: "2026-02-05", status: "completed" },
  { id: "B-005", batch: "AWS Batch #6", customer: "DevOps Academy", template: "AWS Simulation", seats: 35, runningLabs: 32, start: "2026-02-25", end: "2026-03-25", status: "running" },
  { id: "B-006", batch: "Terraform Batch #2", customer: "SkillBridge Labs", template: "Linux + Networking", seats: 15, runningLabs: 0, start: "2026-03-10", end: "2026-04-10", status: "scheduled" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  scheduled: "bg-info/10 text-info",
  completed: "bg-muted text-muted-foreground",
};

export default function AllBatches() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = batchData.filter(b => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search && !b.batch.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Batches</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage all training batches</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search batches..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-right">Seats</TableHead>
                <TableHead className="text-right">Running Labs</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm font-medium">{b.batch}</TableCell>
                  <TableCell className="text-sm">{b.customer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.template}</TableCell>
                  <TableCell className="text-sm text-right">{b.seats}</TableCell>
                  <TableCell className="text-sm text-right">{b.runningLabs}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.start}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.end}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[b.status]}`}>{b.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                      {b.status === "running" && <Button variant="ghost" size="sm"><CheckCircle className="h-3 w-3" /></Button>}
                      <Button variant="ghost" size="sm"><Server className="h-3 w-3" /></Button>
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
