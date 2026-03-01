import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCustomerStore } from "@/stores/customerStore";
import { MoreHorizontal, RotateCcw, X, FileText, LifeBuoy, Undo2, Search, Filter, Activity, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const statusConfig: Record<string, { class: string; icon: React.ElementType }> = {
  queued: { class: "bg-muted text-muted-foreground", icon: Clock },
  running: { class: "bg-blue-500/10 text-blue-500", icon: Loader2 },
  completed: { class: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
  failed: { class: "bg-destructive/10 text-destructive", icon: XCircle },
  cancelled: { class: "bg-muted text-muted-foreground", icon: X },
};

const typeColors: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-500",
  destroy: "bg-destructive/10 text-destructive",
  extend: "bg-blue-500/10 text-blue-500",
  reset: "bg-amber-500/10 text-amber-500",
  snapshot: "bg-purple-500/10 text-purple-500",
};

export default function ProvisioningQueue() {
  const { provisionJobs } = useCustomerStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<typeof provisionJobs[0] | null>(null);

  const filtered = provisionJobs.filter(j => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (typeFilter !== "all" && j.type !== typeFilter) return false;
    if (search && !j.id.toLowerCase().includes(search.toLowerCase()) && !j.tenant.toLowerCase().includes(search.toLowerCase()) && !j.blueprint.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: provisionJobs.length,
    running: provisionJobs.filter(j => j.status === "running").length,
    failed: provisionJobs.filter(j => j.status === "failed").length,
    queued: provisionJobs.filter(j => j.status === "queued").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Provisioning Queue</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time job monitoring & intervention</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1.5 text-xs py-1 px-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live
          </Badge>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", value: counts.total, icon: Activity, color: "text-foreground" },
          { label: "Running", value: counts.running, icon: Loader2, color: "text-blue-500" },
          { label: "Queued", value: counts.queued, icon: Clock, color: "text-amber-500" },
          { label: "Failed", value: counts.failed, icon: XCircle, color: "text-destructive" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search job ID, customer, blueprint..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="destroy">Destroy</SelectItem>
            <SelectItem value="extend">Extend</SelectItem>
            <SelectItem value="reset">Reset</SelectItem>
            <SelectItem value="snapshot">Snapshot</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold">Job ID</TableHead>
                <TableHead className="text-xs font-semibold">Type</TableHead>
                <TableHead className="text-xs font-semibold">Customer</TableHead>
                <TableHead className="text-xs font-semibold">Batch</TableHead>
                <TableHead className="text-xs font-semibold">Blueprint</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Retries</TableHead>
                <TableHead className="text-xs font-semibold">Started</TableHead>
                <TableHead className="text-xs font-semibold">Failure Reason</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground text-sm">No jobs match your filters.</TableCell></TableRow>
              )}
              {filtered.map(j => (
                <TableRow key={j.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedJob(j)}>
                  <TableCell className="text-xs font-mono font-medium">{j.id}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${typeColors[j.type] || ""}`}>{j.type}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{j.tenant}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{j.batch}</TableCell>
                  <TableCell className="text-xs">{j.blueprint}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] capitalize gap-1 ${statusConfig[j.status]?.class}`}>
                      {j.status === "running" && <Loader2 className="h-3 w-3 animate-spin" />}
                      {j.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-right font-mono">{j.retries}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(j.startedAt).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-destructive max-w-[200px] truncate">{j.failureReason || "—"}</TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /> Retry</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><X className="h-3.5 w-3.5" /> Cancel</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Undo2 className="h-3.5 w-3.5" /> Force Rollback</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={() => setSelectedJob(j)}><FileText className="h-3.5 w-3.5" /> View Logs</DropdownMenuItem>
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

      {/* Logs Drawer */}
      <Sheet open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-base">
              Job Details — <span className="font-mono">{selectedJob?.id}</span>
            </SheetTitle>
          </SheetHeader>
          {selectedJob && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium capitalize">{selectedJob.type}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><Badge variant="secondary" className={`text-[10px] capitalize ${statusConfig[selectedJob.status]?.class}`}>{selectedJob.status}</Badge></div>
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selectedJob.tenant}</p></div>
                <div><p className="text-muted-foreground text-xs">Batch</p><p className="font-medium">{selectedJob.batch}</p></div>
                <div><p className="text-muted-foreground text-xs">Blueprint</p><p className="font-medium">{selectedJob.blueprint}</p></div>
                <div><p className="text-muted-foreground text-xs">Retries</p><p className="font-medium">{selectedJob.retries}</p></div>
                <div><p className="text-muted-foreground text-xs">Started</p><p className="font-medium">{new Date(selectedJob.startedAt).toLocaleString()}</p></div>
                <div><p className="text-muted-foreground text-xs">Ended</p><p className="font-medium">{selectedJob.endedAt ? new Date(selectedJob.endedAt).toLocaleString() : "—"}</p></div>
              </div>

              {selectedJob.failureReason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-destructive mb-1">Failure Reason</p>
                    <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3 text-xs text-destructive">
                      {selectedJob.failureReason}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div>
                <p className="text-xs font-semibold mb-2">Logs</p>
                <div className="rounded-md bg-muted p-3 text-xs font-mono space-y-1 max-h-60 overflow-y-auto">
                  <p className="text-muted-foreground">[{new Date(selectedJob.startedAt).toISOString()}] Job {selectedJob.id} started</p>
                  <p className="text-muted-foreground">[{new Date(selectedJob.startedAt).toISOString()}] Allocating resources for {selectedJob.blueprint}</p>
                  <p className="text-muted-foreground">[{new Date(selectedJob.startedAt).toISOString()}] Pulling base image...</p>
                  {selectedJob.status === "failed" && <p className="text-destructive">[ERROR] {selectedJob.failureReason}</p>}
                  {selectedJob.status === "completed" && <p className="text-emerald-500">[SUCCESS] Job completed successfully</p>}
                  {selectedJob.status === "running" && <p className="text-blue-500">[INFO] Provisioning in progress...</p>}
                </div>
              </div>

              <Separator />
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><RotateCcw className="h-3.5 w-3.5" /> Retry</Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Undo2 className="h-3.5 w-3.5" /> Rollback</Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><LifeBuoy className="h-3.5 w-3.5" /> Create Ticket</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
