import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCustomerStore } from "@/stores/customerStore";
import { MoreHorizontal, RotateCcw, X, FileText, LifeBuoy, Undo2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const statusColors: Record<string, string> = {
  queued: "bg-muted text-muted-foreground", running: "bg-info/10 text-info",
  completed: "bg-success/10 text-success", failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
};

export default function ProvisioningQueue() {
  const { provisionJobs } = useCustomerStore();
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? provisionJobs : provisionJobs.filter(j => j.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Provisioning Queue</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time job status</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Job ID</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Tenant</TableHead>
                <TableHead className="text-xs">Batch</TableHead>
                <TableHead className="text-xs">Blueprint</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Retries</TableHead>
                <TableHead className="text-xs">Started</TableHead>
                <TableHead className="text-xs">Error</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(j => (
                <TableRow key={j.id}>
                  <TableCell className="text-xs font-mono">{j.id}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{j.type}</Badge></TableCell>
                  <TableCell className="text-xs">{j.tenant}</TableCell>
                  <TableCell className="text-xs">{j.batch}</TableCell>
                  <TableCell className="text-xs">{j.blueprint}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[j.status]}`}>{j.status}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{j.retries}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(j.startedAt).toLocaleTimeString()}</TableCell>
                  <TableCell className="text-xs text-destructive max-w-[200px] truncate">{j.failureReason || "—"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /> Retry</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><X className="h-3.5 w-3.5" /> Cancel</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Undo2 className="h-3.5 w-3.5" /> Force Rollback</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><FileText className="h-3.5 w-3.5" /> View Logs</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><LifeBuoy className="h-3.5 w-3.5" /> Create Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
