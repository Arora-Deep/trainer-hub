import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, ClipboardList, Sparkles, XCircle, DollarSign, Timer,
  LifeBuoy, ChevronRight, Flame, Server, Clock, Zap,
} from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { useBatchStore } from "@/stores/batchStore";
import { useSandboxStore } from "@/stores/sandboxVMStore";

type Priority = "critical" | "high" | "medium";

interface Task {
  id: string;
  category: "batch_request" | "sandbox_vm" | "provision_failure" | "critical_ticket" | "sla_breach" | "overdue_invoice" | "batch_starting";
  title: string;
  subtitle: string;
  meta?: string;
  priority: Priority;
  ageMinutes?: number;
  action: () => void;
  actionLabel?: string;
}

const priorityStyles: Record<Priority, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-primary/10 text-primary border-primary/30",
};

const categoryIcon = {
  batch_request: ClipboardList,
  sandbox_vm: Sparkles,
  provision_failure: XCircle,
  critical_ticket: LifeBuoy,
  sla_breach: Timer,
  overdue_invoice: DollarSign,
  batch_starting: Zap,
} as const;

const categoryLabel = {
  batch_request: "Batch Request",
  sandbox_vm: "Sandbox VM",
  provision_failure: "Provision Failure",
  critical_ticket: "Critical Ticket",
  sla_breach: "SLA Breach",
  overdue_invoice: "Overdue Invoice",
  batch_starting: "Batch Starting",
} as const;

export default function ImportantTasks() {
  const navigate = useNavigate();
  const { provisionJobs, tickets, invoices } = useCustomerStore();
  const { batches } = useBatchStore();
  const { items: sandboxItems } = useSandboxStore();

  const tasks: Task[] = useMemo(() => {
    const list: Task[] = [];

    // Pending sandbox VM requests
    sandboxItems.filter((s) => s.status === "requested").forEach((s) => {
      list.push({
        id: `sbx-${s.id}`,
        category: "sandbox_vm",
        title: `Sandbox VM: ${s.templateName || s.id}`,
        subtitle: `Requested by ${s.trainerName || "trainer"}`,
        meta: s.customerName,
        priority: "high",
        action: () => navigate("/admin/labs/sandbox-requests"),
      });
    });

    // Pending batch requests — mocked count of 4 to match sidebar badge
    Array.from({ length: 4 }).forEach((_, i) => {
      const samples = [
        { title: "Quota Increase — DevOps Academy", subtitle: "K8s Batch #14 · +250 CPU quota", meta: "Rajesh Kumar" },
        { title: "Seat Increase — Corporate L&D Co", subtitle: "Linux Fund. #8 · +10 seats", meta: "Mike Chen" },
        { title: "VM Provisioning — DataScience Bootcamp", subtitle: "ML Cohort #5 · 25 GPU VMs", meta: "Priya Sharma" },
        { title: "Batch Extension — DevOps Academy", subtitle: "AWS Batch #6 · +7 days", meta: "Rajesh Kumar" },
      ];
      const s = samples[i];
      list.push({
        id: `br-${i}`,
        category: "batch_request",
        title: s.title,
        subtitle: s.subtitle,
        meta: s.meta,
        priority: i === 2 ? "critical" : "high",
        action: () => navigate("/admin/batches/requests"),
      });
    });

    // Failed provisioning jobs
    provisionJobs.filter((j) => j.status === "failed").forEach((j) => {
      list.push({
        id: `pj-${j.id}`,
        category: "provision_failure",
        title: `${j.id} failed`,
        subtitle: j.failureReason || "Unknown failure",
        meta: `${j.tenant} · ${j.batch}`,
        priority: "critical",
        action: () => navigate("/admin/labs/instances"),
        actionLabel: "Retry",
      });
    });

    // Critical & SLA-breached tickets
    tickets.forEach((t) => {
      if (t.status === "resolved" || t.status === "closed") return;
      const elapsed = (Date.now() - new Date(t.createdAt).getTime()) / 60000;
      const slaBreached = elapsed > t.slaMinutes;
      if (t.priority === "critical") {
        list.push({
          id: `tk-${t.id}`,
          category: "critical_ticket",
          title: t.subject,
          subtitle: `${t.tenant} · Critical priority`,
          meta: `Open ${Math.round(elapsed)}m`,
          priority: "critical",
          action: () => navigate("/admin/support/tickets"),
        });
      } else if (slaBreached) {
        list.push({
          id: `sla-${t.id}`,
          category: "sla_breach",
          title: `SLA breached: ${t.subject}`,
          subtitle: `${t.tenant} · SLA ${t.slaMinutes}m, elapsed ${Math.round(elapsed)}m`,
          priority: "high",
          action: () => navigate("/admin/support/tickets"),
        });
      }
    });

    // Overdue invoices
    invoices.filter((i) => i.status === "overdue").forEach((inv) => {
      list.push({
        id: `inv-${inv.id}`,
        category: "overdue_invoice",
        title: `${inv.id} overdue`,
        subtitle: `${inv.tenant} · ₹${inv.amount.toLocaleString()}`,
        priority: "high",
        action: () => navigate("/admin/billing/invoices"),
      });
    });

    // Batches starting in next 48h without VMs
    const now = Date.now();
    batches.forEach((b) => {
      const start = new Date(b.startDate).getTime();
      const hoursUntil = (start - now) / 3600000;
      if (hoursUntil > 0 && hoursUntil < 48 && b.status === "upcoming") {
        list.push({
          id: `bs-${b.id}`,
          category: "batch_starting",
          title: `${b.name} starts in ${Math.round(hoursUntil)}h`,
          subtitle: `${b.seatCount} seats · verify VMs are ready`,
          priority: hoursUntil < 24 ? "critical" : "high",
          action: () => navigate(`/admin/batches/${b.id}`),
        });
      }
    });

    // Sort by priority
    const order: Record<Priority, number> = { critical: 0, high: 1, medium: 2 };
    return list.sort((a, b) => order[a.priority] - order[b.priority]);
  }, [sandboxItems, provisionJobs, tickets, invoices, batches, navigate]);

  const byCategory = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!map[t.category]) map[t.category] = [];
      map[t.category].push(t);
    });
    return map;
  }, [tasks]);

  const counts = {
    total: tasks.length,
    critical: tasks.filter((t) => t.priority === "critical").length,
    high: tasks.filter((t) => t.priority === "high").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Flame className="h-6 w-6 text-destructive" /> Important Tasks
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Time-critical items across requests, provisioning, support, billing and upcoming batches.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">{counts.critical} critical</Badge>
          <Badge variant="secondary" className="text-xs bg-warning/10 text-warning">{counts.high} high</Badge>
          <Badge variant="secondary" className="text-xs">{counts.total} total</Badge>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Batch Requests", count: byCategory.batch_request?.length || 0, icon: ClipboardList, path: "/admin/batches/requests", color: "text-primary" },
          { label: "Sandbox VMs", count: byCategory.sandbox_vm?.length || 0, icon: Sparkles, path: "/admin/labs/sandbox-requests", color: "text-violet-600" },
          { label: "Provision Failures", count: byCategory.provision_failure?.length || 0, icon: XCircle, path: "/admin/labs/instances", color: "text-destructive" },
          { label: "Critical Tickets", count: byCategory.critical_ticket?.length || 0, icon: LifeBuoy, path: "/admin/support/tickets", color: "text-destructive" },
        ].map((k) => (
          <Card key={k.label} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => navigate(k.path)}>
            <CardContent className="pt-4 pb-3 px-4">
              <k.icon className={`h-4 w-4 ${k.color} mb-2`} />
              <p className="text-2xl font-bold">{k.count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Server className="h-6 w-6 text-success" />
            </div>
            <p className="text-sm font-medium">All clear</p>
            <p className="text-xs text-muted-foreground mt-1">No time-critical tasks right now.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Action Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {tasks.map((t) => {
              const Icon = categoryIcon[t.category];
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${priorityStyles[t.priority]} bg-card hover:bg-muted/30 transition-colors cursor-pointer`}
                  onClick={t.action}
                >
                  <div className={`p-2 rounded-md ${priorityStyles[t.priority]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{categoryLabel[t.category]}</Badge>
                      <Badge variant="secondary" className={`text-[9px] px-1 py-0 h-4 capitalize ${priorityStyles[t.priority]}`}>{t.priority}</Badge>
                      <span className="text-sm font-medium truncate">{t.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subtitle}</p>
                    {t.meta && <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {t.meta}</p>}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 shrink-0">
                    {t.actionLabel || "Review"} <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
