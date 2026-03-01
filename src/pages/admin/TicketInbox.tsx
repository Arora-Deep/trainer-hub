import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive", high: "bg-warning/10 text-warning",
  medium: "bg-info/10 text-info", low: "bg-muted text-muted-foreground",
};
const statusColors: Record<string, string> = {
  open: "bg-destructive/10 text-destructive", in_progress: "bg-info/10 text-info",
  waiting: "bg-warning/10 text-warning", resolved: "bg-success/10 text-success", closed: "bg-muted text-muted-foreground",
};

export default function TicketInbox() {
  const { tickets } = useCustomerStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = statusFilter === "all" ? tickets : tickets.filter(t => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Ticket Inbox</h1><p className="text-muted-foreground text-sm mt-1">{tickets.filter(t => t.status === "open").length} open tickets</p></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem><SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Ticket</TableHead><TableHead className="text-xs">Tenant</TableHead>
            <TableHead className="text-xs">Subject</TableHead><TableHead className="text-xs">Priority</TableHead>
            <TableHead className="text-xs">SLA</TableHead><TableHead className="text-xs">Category</TableHead>
            <TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Assignee</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(t => (
              <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="text-xs font-mono">{t.id}</TableCell>
                <TableCell className="text-xs">{t.tenant}</TableCell>
                <TableCell className="text-sm font-medium max-w-[250px] truncate">{t.subject}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${priorityColors[t.priority]}`}>{t.priority}</Badge></TableCell>
                <TableCell className="text-xs">{t.slaMinutes}m</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[t.status]}`}>{t.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-xs">{t.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
