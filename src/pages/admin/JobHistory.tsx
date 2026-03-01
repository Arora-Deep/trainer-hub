import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Download, Search, TrendingUp, CheckCircle2, XCircle, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface HistoryJob {
  id: string;
  type: string;
  customer: string;
  blueprint: string;
  seats: number;
  status: "completed" | "failed" | "cancelled";
  duration: string;
  date: string;
  region: string;
  cost: number;
  failureReason?: string;
}

const history: HistoryJob[] = [
  { id: "JOB-1050", type: "create", customer: "DevOps Academy", blueprint: "Kubernetes Lab v2", seats: 120, status: "completed", duration: "6m 30s", date: "2026-02-28", region: "ap-south-1", cost: 30000 },
  { id: "JOB-1045", type: "create", customer: "Corporate L&D Co", blueprint: "AWS Simulation Lab", seats: 80, status: "completed", duration: "8m 12s", date: "2026-02-28", region: "us-east-1", cost: 24000 },
  { id: "JOB-1040", type: "destroy", customer: "SkillBridge Labs", blueprint: "Docker Compose Lab", seats: 30, status: "completed", duration: "1m 45s", date: "2026-02-27", region: "ap-south-1", cost: 0 },
  { id: "JOB-1035", type: "create", customer: "DataScience Bootcamp", blueprint: "ML GPU Lab v1", seats: 25, status: "failed", duration: "12m", date: "2026-02-27", region: "ap-south-1", cost: 0, failureReason: "GPU pool exhausted — no A100 available" },
  { id: "JOB-1030", type: "extend", customer: "DevOps Academy", blueprint: "Linux + Networking Lab v1", seats: 50, status: "completed", duration: "0m 45s", date: "2026-02-26", region: "ap-south-1", cost: 2500 },
  { id: "JOB-1025", type: "snapshot", customer: "Corporate L&D Co", blueprint: "Windows Server Lab", seats: 60, status: "completed", duration: "3m 20s", date: "2026-02-26", region: "eu-west-1", cost: 1200 },
  { id: "JOB-1020", type: "create", customer: "DevOps Academy", blueprint: "Kubernetes Lab v2", seats: 100, status: "completed", duration: "5m 50s", date: "2026-02-25", region: "ap-south-1", cost: 25000 },
  { id: "JOB-1015", type: "reset", customer: "DataScience Bootcamp", blueprint: "Python Data Lab", seats: 40, status: "completed", duration: "2m 10s", date: "2026-02-25", region: "ap-south-1", cost: 800 },
  { id: "JOB-1010", type: "create", customer: "SkillBridge Labs", blueprint: "Ansible Automation Lab", seats: 35, status: "failed", duration: "9m", date: "2026-02-24", region: "us-east-1", cost: 0, failureReason: "Image validation failed" },
  { id: "JOB-1005", type: "destroy", customer: "Corporate L&D Co", blueprint: "AWS Simulation Lab", seats: 80, status: "completed", duration: "2m 30s", date: "2026-02-24", region: "us-east-1", cost: 0 },
];

const trendData = [
  { day: "Feb 22", jobs: 8, failures: 0 }, { day: "Feb 23", jobs: 12, failures: 1 },
  { day: "Feb 24", jobs: 15, failures: 2 }, { day: "Feb 25", jobs: 18, failures: 0 },
  { day: "Feb 26", jobs: 14, failures: 0 }, { day: "Feb 27", jobs: 20, failures: 1 },
  { day: "Feb 28", jobs: 22, failures: 0 },
];

const typeBreakdown = [
  { name: "Create", value: 6, color: "#10b981" },
  { name: "Destroy", value: 2, color: "#ef4444" },
  { name: "Extend", value: 1, color: "#3b82f6" },
  { name: "Reset", value: 1, color: "#f59e0b" },
  { name: "Snapshot", value: 1, color: "#8b5cf6" },
];

const typeColors: Record<string, string> = {
  create: "bg-emerald-500/10 text-emerald-500", destroy: "bg-destructive/10 text-destructive",
  extend: "bg-blue-500/10 text-blue-500", reset: "bg-amber-500/10 text-amber-500", snapshot: "bg-purple-500/10 text-purple-500",
};

export default function JobHistory() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<HistoryJob | null>(null);

  const filtered = history.filter(h => {
    if (statusFilter !== "all" && h.status !== statusFilter) return false;
    if (typeFilter !== "all" && h.type !== typeFilter) return false;
    if (search && !h.id.toLowerCase().includes(search.toLowerCase()) && !h.customer.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalJobs = history.length;
  const successRate = Math.round((history.filter(h => h.status === "completed").length / totalJobs) * 100);
  const totalCost = history.reduce((a, h) => a + h.cost, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Job History</h1>
          <p className="text-muted-foreground text-sm mt-1">Historical provisioning with trends & export</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export CSV</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Jobs (7d)", value: totalJobs, icon: BarChart3, color: "text-foreground" },
          { label: "Success Rate", value: `${successRate}%`, icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Failed", value: history.filter(h => h.status === "failed").length, icon: XCircle, color: "text-destructive" },
          { label: "Total Cost", value: `₹${totalCost.toLocaleString()}`, icon: TrendingUp, color: "text-blue-500" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Jobs Trend (7 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Jobs" />
                <Bar dataKey="failures" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Failures" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">By Type</CardTitle></CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={typeBreakdown} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {typeBreakdown.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center mt-1">
              {typeBreakdown.map(t => (
                <span key={t.name} className="text-[10px] flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} /> {t.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search job ID, customer..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
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
                <TableHead className="text-xs font-semibold">Blueprint</TableHead>
                <TableHead className="text-xs font-semibold text-right">Seats</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">Duration</TableHead>
                <TableHead className="text-xs font-semibold">Region</TableHead>
                <TableHead className="text-xs font-semibold text-right">Cost</TableHead>
                <TableHead className="text-xs font-semibold">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground text-sm">No jobs found.</TableCell></TableRow>
              )}
              {filtered.map(h => (
                <TableRow key={h.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedJob(h)}>
                  <TableCell className="text-xs font-mono font-medium">{h.id}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${typeColors[h.type]}`}>{h.type}</Badge></TableCell>
                  <TableCell className="text-xs font-medium">{h.customer}</TableCell>
                  <TableCell className="text-xs">{h.blueprint}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{h.seats}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${h.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : h.status === "failed" ? "bg-destructive/10 text-destructive" : ""}`}>
                      {h.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{h.duration}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.region}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{h.cost > 0 ? `₹${h.cost.toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{h.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Drawer */}
      <Sheet open={!!selectedJob} onOpenChange={open => !open && setSelectedJob(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">Job Details — <span className="font-mono">{selectedJob?.id}</span></SheetTitle>
          </SheetHeader>
          {selectedJob && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium capitalize">{selectedJob.type}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><Badge variant="secondary" className={`text-[10px] capitalize ${selectedJob.status === "completed" ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>{selectedJob.status}</Badge></div>
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{selectedJob.customer}</p></div>
                <div><p className="text-muted-foreground text-xs">Blueprint</p><p className="font-medium">{selectedJob.blueprint}</p></div>
                <div><p className="text-muted-foreground text-xs">Seats</p><p className="font-medium">{selectedJob.seats}</p></div>
                <div><p className="text-muted-foreground text-xs">Duration</p><p className="font-medium">{selectedJob.duration}</p></div>
                <div><p className="text-muted-foreground text-xs">Region</p><p className="font-medium">{selectedJob.region}</p></div>
                <div><p className="text-muted-foreground text-xs">Cost</p><p className="font-medium">{selectedJob.cost > 0 ? `₹${selectedJob.cost.toLocaleString()}` : "N/A"}</p></div>
                <div><p className="text-muted-foreground text-xs">Date</p><p className="font-medium">{selectedJob.date}</p></div>
              </div>
              {selectedJob.failureReason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-semibold text-destructive mb-1">Failure Reason</p>
                    <div className="rounded-md bg-destructive/5 border border-destructive/20 p-3 text-xs text-destructive">{selectedJob.failureReason}</div>
                  </div>
                </>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
