import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import {
  Search, Plus, Download, RefreshCw, Eye, Settings, Server, CalendarDays,
  Users, Monitor, AlertTriangle, CheckCircle2, ArrowRight, Pause, Play,
} from "lucide-react";

const batchData = [
  { id: "B-001", batch: "DevOps Bootcamp Jan", customer: "Acme Training", template: "Linux DevOps Lab", seats: 30, runningLabs: 28, failedLabs: 1, assignedStudents: 29, start: "2026-01-05", end: "2026-01-20", status: "running" },
  { id: "B-002", batch: "K8s Batch #14", customer: "DevOps Academy", template: "Kubernetes Lab v2", seats: 30, runningLabs: 28, failedLabs: 0, assignedStudents: 30, start: "2026-02-15", end: "2026-03-15", status: "running" },
  { id: "B-003", batch: "ML Cohort #5", customer: "DataScience Bootcamp", template: "ML GPU Lab v1", seats: 25, runningLabs: 0, failedLabs: 0, assignedStudents: 18, start: "2026-03-20", end: "2026-04-20", status: "scheduled" },
  { id: "B-004", batch: "Linux Fundamentals #8", customer: "Corporate L&D Co", template: "Linux + Networking", seats: 40, runningLabs: 38, failedLabs: 2, assignedStudents: 40, start: "2026-02-10", end: "2026-03-10", status: "running" },
  { id: "B-005", batch: "Docker Batch #3", customer: "SkillBridge Labs", template: "Docker Compose", seats: 20, runningLabs: 0, failedLabs: 0, assignedStudents: 20, start: "2026-01-05", end: "2026-02-05", status: "completed" },
  { id: "B-006", batch: "AWS Batch #6", customer: "DevOps Academy", template: "AWS Simulation", seats: 35, runningLabs: 32, failedLabs: 1, assignedStudents: 34, start: "2026-02-25", end: "2026-03-25", status: "running" },
  { id: "B-007", batch: "Terraform Batch #2", customer: "SkillBridge Labs", template: "Linux + Networking", seats: 15, runningLabs: 0, failedLabs: 0, assignedStudents: 8, start: "2026-03-10", end: "2026-04-10", status: "scheduled" },
  { id: "B-008", batch: "Python ML #4", customer: "DataScience Bootcamp", template: "ML GPU Lab v1", seats: 25, runningLabs: 0, failedLabs: 0, assignedStudents: 25, start: "2025-12-01", end: "2026-01-15", status: "completed" },
];

const statusConfig: Record<string, { dot: string; bg: string; text: string; label: string }> = {
  running: { dot: "bg-green-500", bg: "bg-green-500/10", text: "text-green-600", label: "Running" },
  scheduled: { dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-600", label: "Scheduled" },
  completed: { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", label: "Completed" },
  failed: { dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-600", label: "Failed" },
};

export default function AllBatches() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedBatch, setSelectedBatch] = useState<typeof batchData[0] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const customers = [...new Set(batchData.map(b => b.customer))];
  const templates = [...new Set(batchData.map(b => b.template))];

  const filtered = batchData.filter(b => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (customerFilter !== "all" && b.customer !== customerFilter) return false;
    if (templateFilter !== "all" && b.template !== templateFilter) return false;
    if (search && !b.batch.toLowerCase().includes(search.toLowerCase()) && !b.customer.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateRange?.from && new Date(b.start) < dateRange.from) return false;
    if (dateRange?.to && new Date(b.end) > dateRange.to) return false;
    return true;
  });

  const openDrawer = (batch: typeof batchData[0]) => {
    setSelectedBatch(batch);
    setDrawerOpen(true);
  };

  const completion = (b: typeof batchData[0]) => b.seats > 0 ? Math.round((b.assignedStudents / b.seats) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Batches</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all running and scheduled training batches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/admin/batches/create")}>
            <Plus className="h-3.5 w-3.5" /> Create Batch
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search batch / customer..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">🟢 Running</SelectItem>
                <SelectItem value="scheduled">🟡 Scheduled</SelectItem>
                <SelectItem value="completed">⚪ Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerFilter} onValueChange={setCustomerFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Customer" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {templates.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-9">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {dateRange?.from ? `${format(dateRange.from, "MMM d")} – ${dateRange.to ? format(dateRange.to, "MMM d") : "..."}` : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
            {(statusFilter !== "all" || customerFilter !== "all" || templateFilter !== "all" || dateRange || search) && (
              <Button variant="ghost" size="sm" className="text-xs h-9" onClick={() => { setStatusFilter("all"); setCustomerFilter("all"); setTemplateFilter("all"); setDateRange(undefined); setSearch(""); }}>
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Template</TableHead>
                <TableHead className="text-center">Seats</TableHead>
                <TableHead className="text-center">Running Labs</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-12">No batches match your filters</TableCell></TableRow>
              )}
              {filtered.map(b => {
                const sc = statusConfig[b.status];
                return (
                  <TableRow key={b.id} className="group">
                    <TableCell>
                      <button className="text-sm font-medium text-primary hover:underline text-left" onClick={() => openDrawer(b)}>
                        {b.batch}
                      </button>
                    </TableCell>
                    <TableCell className="text-sm">{b.customer}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.template}</TableCell>
                    <TableCell className="text-sm text-center">{b.seats}</TableCell>
                    <TableCell className="text-sm text-center font-mono">{b.runningLabs}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.start}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.end}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => openDrawer(b)}>
                          <Eye className="h-3 w-3" /> View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate(`/admin/batches/${b.id}`)}>
                          <Settings className="h-3 w-3" /> Manage
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => navigate("/admin/labs/instances")}>
                          <Server className="h-3 w-3" /> Labs
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

      {/* Batch Control Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedBatch && (() => {
            const b = selectedBatch;
            const sc = statusConfig[b.status];
            const comp = completion(b);
            return (
              <>
                <SheetHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-lg">{b.batch}</SheetTitle>
                    <Badge variant="secondary" className={cn("text-xs gap-1.5", sc.bg, sc.text)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                      {sc.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.customer}</p>
                </SheetHeader>

                {/* Info Section */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batch Info</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Customer</p>
                        <p className="font-medium">{b.customer}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Template</p>
                        <p className="font-medium">{b.template}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Seats</p>
                        <p className="font-medium">{b.seats}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-medium">{b.start} → {b.end}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Monitor className="h-3.5 w-3.5 text-green-500" />
                          <p className="text-xs text-muted-foreground">Running Labs</p>
                        </div>
                        <p className="text-xl font-bold">{b.runningLabs}</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                          <p className="text-xs text-muted-foreground">Failed Labs</p>
                        </div>
                        <p className="text-xl font-bold">{b.failedLabs}</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">Assigned Students</p>
                        </div>
                        <p className="text-xl font-bold">{b.assignedStudents}</p>
                      </div>
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <p className="text-xs text-muted-foreground">Completion</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold">{comp}%</p>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted mt-1.5">
                          <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${comp}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <Button className="w-full justify-between" onClick={() => { setDrawerOpen(false); navigate(`/admin/batches/${b.id}`); }}>
                        Manage Batch <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="w-full justify-between" onClick={() => { setDrawerOpen(false); navigate("/admin/labs/assign"); }}>
                        Assign Labs <Server className="h-4 w-4" />
                      </Button>
                      {b.status === "running" && (
                        <>
                          <Button variant="outline" className="w-full justify-between">
                            Extend Batch <CalendarDays className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="w-full justify-between">
                            Pause Batch <Pause className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" className="w-full justify-between text-destructive hover:text-destructive">
                            Complete Batch <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {b.status === "scheduled" && (
                        <Button variant="outline" className="w-full justify-between">
                          Start Batch <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
