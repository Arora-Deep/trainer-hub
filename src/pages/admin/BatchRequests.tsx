import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, X, Eye, ClipboardList, Clock, CheckCircle2, XCircle, Search, Play, AlertTriangle, Building2, Server, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Request {
  id: string;
  customer: string;
  type: string;
  batch: string;
  requestedBy: string;
  status: "pending" | "approved" | "rejected";
  details: string;
  date: string;
  healthScore: number;
  currentUsage: { cpu: number; cpuQuota: number; ram: number; ramQuota: number };
  impact: string;
}

const requests: Request[] = [
  { id: "R-001", customer: "DevOps Academy", type: "Quota Increase", batch: "K8s Batch #14", requestedBy: "Rajesh Kumar", status: "pending", details: "Requesting CPU quota increase from 500 to 750 for upcoming AWS certification batch of 200 students", date: "2026-04-12", healthScore: 92, currentUsage: { cpu: 380, cpuQuota: 500, ram: 1500, ramQuota: 2048 }, impact: "Approving will use 51% of new CPU quota" },
  { id: "R-002", customer: "Corporate L&D Co", type: "Seat Increase", batch: "Linux Fund. #8", requestedBy: "Mike Chen", status: "pending", details: "Add 10 more seats — new hires joining mid-batch", date: "2026-04-11", healthScore: 88, currentUsage: { cpu: 520, cpuQuota: 800, ram: 2900, ramQuota: 4096 }, impact: "10 extra VMs will add ~20 vCPU, 40GB RAM" },
  { id: "R-003", customer: "DataScience Bootcamp", type: "VM Provisioning", batch: "ML Cohort #5", requestedBy: "Priya Sharma", status: "pending", details: "Customer wants CloudAdda to provision GPU VMs — they don't have infra expertise", date: "2026-04-10", healthScore: 78, currentUsage: { cpu: 140, cpuQuota: 200, ram: 800, ramQuota: 1024 }, impact: "25 GPU VMs will use 100% GPU quota in ap-south-1" },
  { id: "R-004", customer: "DevOps Academy", type: "Batch Extension", batch: "AWS Batch #6", requestedBy: "Rajesh Kumar", status: "pending", details: "Need 1 extra week for certification prep — 35 students need more lab time", date: "2026-04-13", healthScore: 92, currentUsage: { cpu: 380, cpuQuota: 500, ram: 1500, ramQuota: 2048 }, impact: "7 additional days × 35 VMs = ₹12,250 estimated cost" },
  { id: "R-005", customer: "SkillBridge Labs", type: "Lab Reset", batch: "Terraform Batch #2", requestedBy: "Amit Patel", status: "approved", details: "Student broke the Terraform environment, needs fresh reset from golden snapshot", date: "2026-04-09", healthScore: 65, currentUsage: { cpu: 200, cpuQuota: 300, ram: 1000, ramQuota: 1536 }, impact: "Single VM reset — minimal impact" },
  { id: "R-006", customer: "SkillBridge Labs", type: "Extra VM", batch: "Terraform Batch #2", requestedBy: "Amit Patel", status: "rejected", details: "Requested GPU VM for ML demo — not part of batch scope", date: "2026-04-08", healthScore: 65, currentUsage: { cpu: 200, cpuQuota: 300, ram: 1000, ramQuota: 1536 }, impact: "Out of scope — GPU not included in plan" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  pending: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
  approved: { bg: "bg-success/10", text: "text-success", icon: CheckCircle2 },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", icon: XCircle },
};

const typeConfig: Record<string, string> = {
  "Quota Increase": "bg-primary/10 text-primary",
  "Seat Increase": "bg-info/10 text-info",
  "VM Provisioning": "bg-warning/10 text-warning",
  "Batch Extension": "bg-info/10 text-info",
  "Lab Reset": "bg-muted text-muted-foreground",
  "Extra VM": "bg-success/10 text-success",
};

export default function BatchRequests() {
  const [selected, setSelected] = useState<Request | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const pending = requests.filter(r => r.status === "pending").length;
  const approvedThisMonth = requests.filter(r => r.status === "approved").length;
  const rejectedThisMonth = requests.filter(r => r.status === "rejected").length;

  const filtered = requests.filter(r => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search && !r.customer.toLowerCase().includes(search.toLowerCase()) && !r.batch.toLowerCase().includes(search.toLowerCase()) && !r.type.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApprove = () => {
    toast({ title: "Request Approved", description: `${selected?.id} approved successfully` });
    setSelected(null);
    setAdminNotes("");
  };

  const handleReject = () => {
    toast({ title: "Request Rejected", description: `${selected?.id} has been rejected` });
    setSelected(null);
    setAdminNotes("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Customer requests for batch modifications, provisioning, and resources</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pending", value: pending, icon: Clock, color: "text-warning", pulse: pending > 0 },
          { label: "Approved (Month)", value: approvedThisMonth, icon: CheckCircle2, color: "text-success" },
          { label: "Rejected (Month)", value: rejectedThisMonth, icon: XCircle, color: "text-destructive" },
          { label: "Avg Response", value: "2.4h", icon: BarChart3, color: "text-primary" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}>
                <k.icon className={`h-4 w-4 ${k.pulse ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customer, batch, type..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => {
                const sc = statusConfig[r.status];
                return (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(r)}>
                    <TableCell className="text-sm font-mono">{r.id}</TableCell>
                    <TableCell className="text-sm font-medium">{r.customer}</TableCell>
                    <TableCell><Badge variant="secondary" className={cn("text-xs", typeConfig[r.type])}>{r.type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.batch}</TableCell>
                    <TableCell className="text-sm">{r.requestedBy}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs capitalize gap-1", sc.bg, sc.text)}>
                        <sc.icon className="h-3 w-3" /> {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        {r.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm" className="gap-1 text-xs text-success" onClick={() => { setSelected(r); }}><Check className="h-3 w-3" /></Button>
                            <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive" onClick={() => { setSelected(r); }}><X className="h-3 w-3" /></Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}><Eye className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => { setSelected(null); setAdminNotes(""); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Request {selected.id}
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-5 mt-4">
                {/* Request Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selected.customer}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="secondary" className={cn("text-xs", typeConfig[selected.type])}>{selected.type}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-medium">{selected.batch}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Requested By</span><span className="font-medium">{selected.requestedBy}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selected.date}</span></div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="secondary" className={cn("text-xs capitalize gap-1", statusConfig[selected.status].bg, statusConfig[selected.status].text)}>
                      {selected.status}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Details</p>
                  <p className="text-sm">{selected.details}</p>
                </div>

                <Separator />

                {/* Customer Context */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> Customer Context
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Health Score</p>
                      <p className={`text-lg font-bold ${selected.healthScore >= 80 ? "text-success" : selected.healthScore >= 60 ? "text-warning" : "text-destructive"}`}>{selected.healthScore}%</p>
                    </div>
                    <div className="p-3 rounded-lg border">
                      <p className="text-xs text-muted-foreground">CPU Usage</p>
                      <p className="text-lg font-bold">{selected.currentUsage.cpu}/{selected.currentUsage.cpuQuota}</p>
                      <div className="h-1.5 rounded-full bg-muted mt-1">
                        <div className="h-1.5 rounded-full bg-primary" style={{ width: `${(selected.currentUsage.cpu / selected.currentUsage.cpuQuota) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis */}
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="text-xs font-semibold text-warning mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Impact Analysis
                  </p>
                  <p className="text-sm">{selected.impact}</p>
                </div>

                <Separator />

                {/* Admin Notes */}
                {selected.status === "pending" && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs">Admin Notes (Internal)</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={e => setAdminNotes(e.target.value)}
                        placeholder="Add resolution notes before approving or rejecting..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 gap-1" onClick={handleApprove}>
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      {(selected.type === "Batch Extension" || selected.type === "Seat Increase" || selected.type === "VM Provisioning") && (
                        <Button className="flex-1 gap-1 bg-success hover:bg-success/90 text-success-foreground" onClick={handleApprove}>
                          <Play className="h-4 w-4" /> Approve & Provision
                        </Button>
                      )}
                      <Button variant="outline" className="gap-1 text-destructive" onClick={handleReject}>
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
