import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, FileText, AlertTriangle, Search, Shield, Clock, UserPlus, BookOpen, Building2, Server, XCircle, AlertOctagon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  alert: string;
  source: string;
  severity: "critical" | "major" | "warning" | "minor";
  status: "active" | "investigating" | "acknowledged" | "resolved";
  created: string;
  assignee?: string;
  impactedCustomers: string[];
  impactedBatches: string[];
  relatedIncident?: string;
  timeline: { time: string; event: string }[];
  suggestedRunbook?: string;
  logs: string[];
}

const alertsData: Alert[] = [
  {
    id: "ALT-001", alert: "GPU capacity exhausted in ap-south-1", source: "Infrastructure", severity: "critical",
    status: "active", created: "2026-04-13T09:45:00Z", impactedCustomers: ["DataScience Bootcamp"],
    impactedBatches: ["ML Cohort #5"], relatedIncident: "INC-001",
    timeline: [
      { time: "09:45", event: "Alert triggered — GPU utilization reached 100%" },
      { time: "09:50", event: "Auto-notification sent to Ops Team" },
      { time: "09:55", event: "Linked to incident INC-001" },
    ],
    suggestedRunbook: "GPU Capacity Runbook: 1) Check GPU pool dashboard 2) Identify idle VMs 3) Scale up GPU nodes or redistribute workload",
    logs: ["[09:45:12] CRITICAL: GPU pool gpu-cluster-mumbai-1 at 100% capacity", "[09:45:13] No available GPU slots for new VM provisioning", "[09:45:14] Queued jobs: JOB-1002 waiting for GPU resources"],
  },
  {
    id: "ALT-002", alert: "High latency on storage pool EU-WEST-1", source: "Storage", severity: "major",
    status: "investigating", created: "2026-04-13T07:00:00Z", assignee: "Storage Team",
    impactedCustomers: ["Corporate L&D Co"], impactedBatches: ["Linux Fundamentals #8"],
    timeline: [
      { time: "07:00", event: "Latency exceeded 200ms threshold" },
      { time: "07:15", event: "Assigned to Storage Team" },
      { time: "07:30", event: "Investigation started — checking disk I/O" },
    ],
    logs: ["[07:00:01] WARNING: Storage latency 245ms (threshold: 200ms)", "[07:00:05] Disk queue depth: 128 (normal: <32)"],
  },
  {
    id: "ALT-003", alert: "Invoice INV-3003 overdue by 14 days", source: "Billing", severity: "warning",
    status: "active", created: "2026-04-12T00:00:00Z",
    impactedCustomers: ["SkillBridge Labs"], impactedBatches: [],
    timeline: [{ time: "00:00", event: "Invoice crossed 14-day overdue threshold" }],
    logs: [],
  },
  {
    id: "ALT-004", alert: "Node compute-virginia-3 heartbeat missed", source: "Infrastructure", severity: "major",
    status: "active", created: "2026-04-13T09:15:00Z",
    impactedCustomers: ["DevOps Academy"], impactedBatches: ["AWS Batch #6"],
    timeline: [
      { time: "09:15", event: "3 consecutive heartbeat checks failed" },
      { time: "09:16", event: "Auto-rerouting triggered for affected VMs" },
    ],
    logs: ["[09:15:00] ERROR: No heartbeat from compute-virginia-3 (3 failures)", "[09:15:05] Initiating VM migration for 4 affected instances"],
  },
  {
    id: "ALT-005", alert: "Intermittent DNS resolution failures", source: "Network", severity: "minor",
    status: "resolved", created: "2026-04-12T14:00:00Z", assignee: "Network Team",
    impactedCustomers: ["DevOps Academy", "SkillBridge Labs"], impactedBatches: [],
    timeline: [
      { time: "14:00", event: "DNS timeout errors detected" },
      { time: "15:30", event: "Root cause identified: upstream DNS TTL issue" },
      { time: "16:00", event: "Fix applied — local DNS cache flushed" },
    ],
    logs: ["[14:00:12] WARNING: DNS resolution timeout for internal services", "[16:00:01] INFO: DNS cache flushed, resolution restored"],
  },
  {
    id: "ALT-006", alert: "Disk usage > 85% on storage-eu-west-1", source: "Storage", severity: "warning",
    status: "active", created: "2026-04-13T06:00:00Z",
    impactedCustomers: ["Corporate L&D Co"], impactedBatches: ["Linux Fundamentals #8"],
    timeline: [{ time: "06:00", event: "Disk usage crossed 85% threshold" }],
    logs: ["[06:00:00] WARNING: Disk usage at 86.2% on storage-eu-west-1"],
  },
];

const severityColor: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  major: "bg-warning/10 text-warning",
  warning: "bg-warning/10 text-warning",
  minor: "bg-muted text-muted-foreground",
};

const severityIcon: Record<string, typeof AlertOctagon> = {
  critical: AlertOctagon,
  major: AlertTriangle,
  warning: Info,
  minor: Info,
};

const statusColor: Record<string, string> = {
  active: "bg-destructive/10 text-destructive",
  investigating: "bg-warning/10 text-warning",
  acknowledged: "bg-primary/10 text-primary",
  resolved: "bg-success/10 text-success",
};

export default function AdminAlerts() {
  const [selected, setSelected] = useState<Alert | null>(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");

  const criticalCount = alertsData.filter(a => a.severity === "critical" && a.status !== "resolved").length;
  const majorCount = alertsData.filter(a => a.severity === "major" && a.status !== "resolved").length;
  const warningCount = alertsData.filter(a => a.severity === "warning" && a.status !== "resolved").length;
  const resolvedCount = alertsData.filter(a => a.status === "resolved").length;

  const filtered = alertsData.filter(a => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (search && !a.alert.toLowerCase().includes(search.toLowerCase()) && !a.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform alerts, incidents, and error tracking</p>
      </div>

      {/* Severity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Critical", value: criticalCount, color: "text-destructive", bg: "bg-destructive/10", pulse: criticalCount > 0 },
          { label: "Major", value: majorCount, color: "text-warning", bg: "bg-warning/10" },
          { label: "Warning", value: warningCount, color: "text-warning", bg: "bg-warning/10" },
          { label: "Resolved", value: resolvedCount, color: "text-success", bg: "bg-success/10" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${k.bg} ${k.color}`}>
                <AlertTriangle className={`h-4 w-4 ${k.pulse ? "animate-pulse" : ""}`} />
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
          <Input placeholder="Search alerts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(a)}>
                  <TableCell className="text-sm font-medium max-w-[250px]">{a.alert}</TableCell>
                  <TableCell className="text-sm">{a.source}</TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", severityColor[a.severity])}>{a.severity}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", statusColor[a.status])}>{a.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.assignee || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.created.includes("T") ? new Date(a.created).toLocaleString() : a.created}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      {a.status !== "resolved" && (
                        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast({ title: "Alert Resolved", description: a.id })}>
                          <CheckCircle className="h-3 w-3" /> Resolve
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={() => setSelected(a)}>
                        <FileText className="h-3 w-3" /> Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => { setSelected(null); setNotes(""); }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4" /> {selected.id}
                </SheetTitle>
                <p className="text-sm font-medium mt-1">{selected.alert}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className={cn("text-xs capitalize", severityColor[selected.severity])}>{selected.severity}</Badge>
                  <Badge variant="secondary" className={cn("text-xs capitalize", statusColor[selected.status])}>{selected.status}</Badge>
                  {selected.relatedIncident && <Badge variant="outline" className="text-xs gap-1"><Shield className="h-3 w-3" /> {selected.relatedIncident}</Badge>}
                </div>
              </SheetHeader>

              <div className="space-y-5 mt-4">
                {/* Meta */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Source</p><p className="font-medium">{selected.source}</p></div>
                  <div><p className="text-xs text-muted-foreground">Assignee</p><p className="font-medium">{selected.assignee || "Unassigned"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Created</p><p className="font-medium">{new Date(selected.created).toLocaleString()}</p></div>
                </div>

                {/* Impacted */}
                {(selected.impactedCustomers.length > 0 || selected.impactedBatches.length > 0) && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> Impact
                      </p>
                      <div className="space-y-2 text-sm">
                        {selected.impactedCustomers.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-muted-foreground text-xs">Customers:</span>
                            {selected.impactedCustomers.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                          </div>
                        )}
                        {selected.impactedBatches.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-muted-foreground text-xs">Batches:</span>
                            {selected.impactedBatches.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Runbook */}
                {selected.suggestedRunbook && (
                  <>
                    <Separator />
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs font-semibold text-primary mb-1 flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Suggested Runbook</p>
                      <p className="text-sm whitespace-pre-line">{selected.suggestedRunbook}</p>
                    </div>
                  </>
                )}

                {/* Timeline */}
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Timeline</p>
                  <div className="space-y-2">
                    {selected.timeline.map((t, i) => (
                      <div key={i} className="flex gap-3 text-sm">
                        <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">{t.time}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            <span>{t.event}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logs */}
                {selected.logs.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> Error Logs</p>
                      <div className="rounded-md bg-muted p-3 text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
                        {selected.logs.map((l, i) => (
                          <p key={i} className={l.includes("CRITICAL") || l.includes("ERROR") ? "text-destructive" : l.includes("WARNING") ? "text-warning" : "text-muted-foreground"}>{l}</p>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                {selected.status !== "resolved" && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Investigation Notes</Label>
                        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add investigation notes..." rows={2} />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1 text-xs"><UserPlus className="h-3 w-3" /> Assign</Button>
                        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast({ title: "Alert Acknowledged" })}>
                          <CheckCircle className="h-3 w-3" /> Acknowledge
                        </Button>
                        <Button size="sm" className="gap-1 text-xs" onClick={() => { toast({ title: "Alert Resolved" }); setSelected(null); }}>
                          <CheckCircle className="h-3 w-3" /> Resolve
                        </Button>
                      </div>
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
