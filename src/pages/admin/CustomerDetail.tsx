import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";
import {
  ArrowLeft, Ban, UserCheck, Receipt, CreditCard, Activity, Shield, Clock, Users,
  LifeBuoy, Settings, BarChart3, FlaskConical, Download, RotateCcw, Key, Power, FileText,
  ChevronRight, Server, Calendar, Mail, Eye,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success", suspended: "bg-destructive/10 text-destructive",
  trial: "bg-warning/10 text-warning", expired: "bg-muted text-muted-foreground",
};

const usageTrend = [
  { day: "Mon", hours: 320, seats: 85 }, { day: "Tue", hours: 410, seats: 120 },
  { day: "Wed", hours: 380, seats: 105 }, { day: "Thu", hours: 450, seats: 130 },
  { day: "Fri", hours: 520, seats: 145 }, { day: "Sat", hours: 180, seats: 40 },
  { day: "Sun", hours: 90, seats: 20 },
];

const billingTrend = [
  { month: "Oct", spend: 32000 }, { month: "Nov", spend: 35000 }, { month: "Dec", spend: 38000 },
  { month: "Jan", spend: 41000 }, { month: "Feb", spend: 45000 },
];

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, tickets, invoices } = useCustomerStore();
  const customer = customers.find(c => c.id === id);

  if (!customer) return <div className="p-6 text-center text-muted-foreground">Customer not found</div>;

  const custTickets = tickets.filter(t => t.tenant === customer.name);
  const custInvoices = invoices.filter(i => i.tenant === customer.name);

  const admins = [
    { name: customer.contactPerson, email: customer.email, role: "Admin", lastLogin: "2 hours ago", mfa: customer.mfaEnabled },
    { name: "Training Manager", email: `manager@${customer.domain}`, role: "Manager", lastLogin: "1 day ago", mfa: false },
  ];

  const batches = [
    {
      id: "B-1014", name: "K8s Batch #14", template: "Kubernetes Lab v2",
      trainer: "Rajesh Kumar", seatCount: 35, start: "2026-02-25", end: "2026-03-10",
      status: "active", vmSpec: "4 vCPU · 8 GB · 60 GB", region: "ap-south-1",
      participants: Array.from({ length: 35 }, (_, i) => ({
        name: `Participant ${i + 1}`, email: `p${i + 1}@devops.in`,
        vmId: `VM-45${(i + 1).toString().padStart(2, "0")}`,
        vmStatus: i % 7 === 0 ? "stopped" : "running",
        cpu: `${20 + (i * 7) % 60}%`, ram: `${30 + (i * 11) % 50}%`,
        node: `node-ap-${(i % 4) + 1}`, ip: `10.0.1.${50 + i}`,
      })),
    },
    {
      id: "B-1008", name: "Linux Fundamentals #8", template: "Linux + Networking Lab v1",
      trainer: "Priya Sharma", seatCount: 50, start: "2026-03-01", end: "2026-03-15",
      status: "active", vmSpec: "2 vCPU · 4 GB · 40 GB", region: "ap-south-1",
      participants: Array.from({ length: 50 }, (_, i) => ({
        name: `Participant ${i + 1}`, email: `linux${i + 1}@devops.in`,
        vmId: `VM-46${(i + 1).toString().padStart(2, "0")}`,
        vmStatus: i % 9 === 0 ? "stopped" : "running",
        cpu: `${15 + (i * 5) % 50}%`, ram: `${25 + (i * 9) % 45}%`,
        node: `node-ap-${(i % 4) + 1}`, ip: `10.0.2.${50 + i}`,
      })),
    },
    {
      id: "B-1003", name: "Docker Basics #3", template: "Docker Compose Lab",
      trainer: "Amit Patel", seatCount: 25, start: "2026-02-10", end: "2026-02-24",
      status: "completed", vmSpec: "2 vCPU · 4 GB · 30 GB", region: "ap-south-1",
      participants: Array.from({ length: 25 }, (_, i) => ({
        name: `Participant ${i + 1}`, email: `docker${i + 1}@devops.in`,
        vmId: `VM-47${(i + 1).toString().padStart(2, "0")}`,
        vmStatus: "stopped",
        cpu: "0%", ram: "0%",
        node: `node-ap-${(i % 4) + 1}`, ip: `10.0.3.${50 + i}`,
      })),
    },
  ];

  type Batch = typeof batches[number];
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  // Invoice line items per batch (for breakdown)
  const invoiceLineItems: Record<string, Array<{ batchId: string; batchName: string; seats: number; days: number; ratePerSeat: number; amount: number }>> = {};
  custInvoices.forEach((inv, idx) => {
    invoiceLineItems[inv.id] = batches.slice(0, idx === 0 ? 3 : 2).map(b => {
      const days = 14;
      const rate = b.template.includes("Kubernetes") ? 800 : b.template.includes("Linux") ? 500 : 400;
      return {
        batchId: b.id, batchName: b.name, seats: b.seatCount, days,
        ratePerSeat: rate, amount: b.seatCount * rate,
      };
    });
  });

  const auditLogs = [
    { action: "Quota updated", user: "admin@cloudadda.com", time: "2026-02-28 14:30", details: "CPU: 400 → 500" },
    { action: "Credits applied", user: "finance@cloudadda.com", time: "2026-02-27 10:00", details: "₹5,000 credit" },
    { action: "Plan changed", user: "sales@cloudadda.com", time: "2026-02-20 09:15", details: "Professional → Enterprise" },
    { action: "Admin invited", user: customer.email, time: "2026-02-15 11:00", details: `manager@${customer.domain}` },
  ];

  const action = (msg: string) => toast({ title: msg });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/admin/customers")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{customer.name}</h1>
            <Badge variant="secondary" className={`text-xs capitalize ${statusColors[customer.status]}`}>{customer.status}</Badge>
            <Badge variant="outline" className="text-xs capitalize">{customer.slaTier} SLA</Badge>
            <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary">{customer.plan}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{customer.domain} · {customer.contactPerson}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><FlaskConical className="h-3.5 w-3.5" /> Provision Labs</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><CreditCard className="h-3.5 w-3.5" /> Add Credits</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive"><Ban className="h-3.5 w-3.5" /> Suspend</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><UserCheck className="h-3.5 w-3.5" /> Impersonate</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50 flex-wrap h-auto gap-0.5 p-1">
          <TabsTrigger value="overview" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="provisioning" className="text-xs gap-1.5"><FlaskConical className="h-3.5 w-3.5" /> Batches</TabsTrigger>
          <TabsTrigger value="support" className="text-xs gap-1.5"><LifeBuoy className="h-3.5 w-3.5" /> Support</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Billing</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs gap-1.5"><Settings className="h-3.5 w-3.5" /> Settings</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
        </TabsList>

        {/* Tab A: Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Active Seats</p><p className="text-2xl font-bold mt-1">{customer.currentUsage.activeSeats}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Live Labs</p><p className="text-2xl font-bold mt-1">{customer.currentUsage.liveLabs}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Storage Used</p><p className="text-2xl font-bold mt-1">{Math.round(customer.quota.storage * 0.6)} GB</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Health Score</p><p className={`text-2xl font-bold mt-1 ${customer.healthScore >= 80 ? "text-success" : customer.healthScore >= 50 ? "text-warning" : "text-destructive"}`}>{customer.healthScore}</p></CardContent></Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Provisioning Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {auditLogs.slice(0, 4).map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border last:border-0">
                      <span className="text-[11px] text-muted-foreground w-32 shrink-0">{log.time}</span>
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground text-xs">{log.details}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Top Templates Used</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Kubernetes Lab v2", "Linux + Networking Lab v1", "Docker Compose Lab"].map((t, i) => (
                    <div key={t} className="flex items-center justify-between text-sm">
                      <span>{t}</span>
                      <Badge variant="secondary" className="text-[10px]">{[45, 32, 18][i]} sessions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab B: Batches */}
        <TabsContent value="provisioning" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Batches</p><p className="text-2xl font-bold mt-1">{batches.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Active Batches</p><p className="text-2xl font-bold mt-1 text-success">{batches.filter(b => b.status === "active").length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Participants</p><p className="text-2xl font-bold mt-1">{batches.reduce((s, b) => s + b.seatCount, 0)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Running VMs</p><p className="text-2xl font-bold mt-1 text-success">{batches.reduce((s, b) => s + b.participants.filter(p => p.vmStatus === "running").length, 0)}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">All Batches</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("All labs shutdown")}><Power className="h-3.5 w-3.5" /> Shutdown All</Button>
                <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/admin/batches/new")}><FlaskConical className="h-3.5 w-3.5" /> Provision Batch</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Batch</TableHead>
                  <TableHead className="text-xs">Template</TableHead>
                  <TableHead className="text-xs">Trainer</TableHead>
                  <TableHead className="text-xs">Participants</TableHead>
                  <TableHead className="text-xs">VM Spec</TableHead>
                  <TableHead className="text-xs">Period</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs"></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {batches.map((b) => {
                    const running = b.participants.filter(p => p.vmStatus === "running").length;
                    return (
                      <TableRow key={b.id} className="cursor-pointer hover:bg-muted/40" onClick={() => setSelectedBatch(b)}>
                        <TableCell className="text-sm font-medium">{b.name}<div className="text-[10px] text-muted-foreground font-mono">{b.id}</div></TableCell>
                        <TableCell className="text-xs">{b.template}</TableCell>
                        <TableCell className="text-xs">{b.trainer}</TableCell>
                        <TableCell className="text-xs">{b.seatCount} <span className="text-muted-foreground">({running} running)</span></TableCell>
                        <TableCell className="text-xs font-mono">{b.vmSpec}</TableCell>
                        <TableCell className="text-xs">{b.start} → {b.end}</TableCell>
                        <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${b.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{b.status}</Badge></TableCell>
                        <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Batch Detail Sheet */}
          <Sheet open={!!selectedBatch} onOpenChange={(o) => !o && setSelectedBatch(null)}>
            <SheetContent side="right" className="w-full sm:max-w-3xl overflow-y-auto">
              {selectedBatch && (
                <>
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      {selectedBatch.name}
                      <Badge variant="secondary" className={`text-[10px] capitalize ${selectedBatch.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{selectedBatch.status}</Badge>
                    </SheetTitle>
                    <SheetDescription>{selectedBatch.template} · {selectedBatch.trainer}</SheetDescription>
                  </SheetHeader>

                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      <Card><CardContent className="pt-3"><p className="text-[10px] text-muted-foreground">Participants</p><p className="text-lg font-bold">{selectedBatch.seatCount}</p></CardContent></Card>
                      <Card><CardContent className="pt-3"><p className="text-[10px] text-muted-foreground">Running</p><p className="text-lg font-bold text-success">{selectedBatch.participants.filter(p => p.vmStatus === "running").length}</p></CardContent></Card>
                      <Card><CardContent className="pt-3"><p className="text-[10px] text-muted-foreground">Stopped</p><p className="text-lg font-bold text-muted-foreground">{selectedBatch.participants.filter(p => p.vmStatus === "stopped").length}</p></CardContent></Card>
                      <Card><CardContent className="pt-3"><p className="text-[10px] text-muted-foreground">VM Spec</p><p className="text-xs font-mono mt-1">{selectedBatch.vmSpec}</p></CardContent></Card>
                    </div>

                    <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-xs">Batch Info</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-2 gap-3 text-xs">
                        <div><span className="text-muted-foreground">Batch ID:</span> <span className="font-mono">{selectedBatch.id}</span></div>
                        <div><span className="text-muted-foreground">Region:</span> {selectedBatch.region}</div>
                        <div><span className="text-muted-foreground">Start:</span> {selectedBatch.start}</div>
                        <div><span className="text-muted-foreground">End:</span> {selectedBatch.end}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs">Participants & VMs</CardTitle>
                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1" onClick={() => action("Broken VMs replaced")}><RotateCcw className="h-3 w-3" /> Replace Broken</Button>
                          <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1" onClick={() => action("Credentials reset")}><Key className="h-3 w-3" /> Reset Creds</Button>
                          <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1"><Download className="h-3 w-3" /> Logs</Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
                        <Table>
                          <TableHeader><TableRow>
                            <TableHead className="text-[10px]">Participant</TableHead>
                            <TableHead className="text-[10px]">VM</TableHead>
                            <TableHead className="text-[10px]">Status</TableHead>
                            <TableHead className="text-[10px]">CPU</TableHead>
                            <TableHead className="text-[10px]">RAM</TableHead>
                            <TableHead className="text-[10px]">IP</TableHead>
                          </TableRow></TableHeader>
                          <TableBody>
                            {selectedBatch.participants.map(p => (
                              <TableRow key={p.vmId}>
                                <TableCell className="text-[11px]"><div className="font-medium">{p.name}</div><div className="text-muted-foreground">{p.email}</div></TableCell>
                                <TableCell className="text-[11px] font-mono">{p.vmId}</TableCell>
                                <TableCell><Badge variant="secondary" className={`text-[9px] ${p.vmStatus === "running" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{p.vmStatus}</Badge></TableCell>
                                <TableCell className="text-[11px]">{p.cpu}</TableCell>
                                <TableCell className="text-[11px]">{p.ram}</TableCell>
                                <TableCell className="text-[11px] font-mono">{p.ip}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* Tab C: Support */}
        <TabsContent value="support" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Tickets</h3>
            <Button size="sm" className="text-xs gap-1.5" onClick={() => action("Ticket created")}>Create Ticket</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Ticket</TableHead><TableHead className="text-xs">Subject</TableHead>
                  <TableHead className="text-xs">Priority</TableHead><TableHead className="text-xs">SLA</TableHead>
                  <TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Last Update</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {custTickets.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs font-mono">{t.id}</TableCell>
                      <TableCell className="text-sm">{t.subject}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${t.priority === "critical" ? "bg-destructive/10 text-destructive" : t.priority === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{t.priority}</Badge></TableCell>
                      <TableCell className="text-xs">{t.slaMinutes}m</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{t.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                  {custTickets.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No tickets</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Fixes</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Retrying failed provision")}><RotateCcw className="h-3.5 w-3.5" /> Retry Failed Provision</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("VM restarted")}><Power className="h-3.5 w-3.5" /> Restart VM</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Lab expiry extended")}><Clock className="h-3.5 w-3.5" /> Extend Lab Expiry</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab D: Billing */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Wallet / Credits</p><p className="text-2xl font-bold mt-1">₹{customer.walletBalance.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Monthly Usage</p><p className="text-2xl font-bold mt-1">₹{customer.monthlyUsage.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-2xl font-bold mt-1">₹{custInvoices.filter(i => i.status !== "paid").reduce((s, i) => s + i.amount, 0).toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Overdue</p><p className={`text-2xl font-bold mt-1 ${customer.overdueAmount > 0 ? "text-destructive" : ""}`}>₹{customer.overdueAmount.toLocaleString()}</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Invoices</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Invoice generated from current usage")}><Receipt className="h-3.5 w-3.5" /> Generate Invoice</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Credit applied to wallet")}><CreditCard className="h-3.5 w-3.5" /> Apply Credit</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> Export All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Invoice</TableHead>
                  <TableHead className="text-xs">Period</TableHead>
                  <TableHead className="text-xs">Batches Billed</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs">Due Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {custInvoices.map(inv => {
                    const items = invoiceLineItems[inv.id] || [];
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                        <TableCell className="text-xs">Feb 2026</TableCell>
                        <TableCell className="text-xs">{items.length} batches</TableCell>
                        <TableCell className="text-sm font-medium text-right">₹{inv.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">{inv.dueDate}{inv.overdueDays > 0 && <span className="text-destructive ml-1">({inv.overdueDays}d late)</span>}</TableCell>
                        <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${inv.status === "paid" ? "bg-success/10 text-success" : inv.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{inv.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setSelectedInvoiceId(inv.id)}><Eye className="h-3 w-3" /> Breakdown</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Download className="h-3 w-3" /> PDF</Button>
                            {inv.status !== "paid" && <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => action(`Reminder sent for ${inv.id}`)}><Mail className="h-3 w-3" /> Remind</Button>}
                            {inv.status !== "paid" && <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => action(`${inv.id} marked paid`)}>Mark Paid</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {custInvoices.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">No invoices yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Current Cycle — Usage by Batch</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Batch</TableHead>
                  <TableHead className="text-xs">Template</TableHead>
                  <TableHead className="text-xs text-right">Seats</TableHead>
                  <TableHead className="text-xs text-right">Days</TableHead>
                  <TableHead className="text-xs text-right">Rate / seat</TableHead>
                  <TableHead className="text-xs text-right">Subtotal</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {batches.map(b => {
                    const rate = b.template.includes("Kubernetes") ? 800 : b.template.includes("Linux") ? 500 : 400;
                    const days = 14;
                    const subtotal = b.seatCount * rate;
                    return (
                      <TableRow key={b.id}>
                        <TableCell className="text-xs font-medium">{b.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{b.template}</TableCell>
                        <TableCell className="text-xs text-right">{b.seatCount}</TableCell>
                        <TableCell className="text-xs text-right">{days}</TableCell>
                        <TableCell className="text-xs text-right">₹{rate}</TableCell>
                        <TableCell className="text-sm text-right font-medium">₹{subtotal.toLocaleString()}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow className="bg-muted/30">
                    <TableCell colSpan={5} className="text-xs font-medium text-right">Total (current cycle)</TableCell>
                    <TableCell className="text-sm font-bold text-right">₹{batches.reduce((s, b) => {
                      const rate = b.template.includes("Kubernetes") ? 800 : b.template.includes("Linux") ? 500 : 400;
                      return s + b.seatCount * rate;
                    }, 0).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex items-center gap-3">
            <Switch />
            <Label className="text-xs">Lock provisioning until payment/PO received</Label>
          </div>

          {/* Invoice Breakdown Dialog */}
          <Dialog open={!!selectedInvoiceId} onOpenChange={(o) => !o && setSelectedInvoiceId(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Invoice Breakdown — {selectedInvoiceId}</DialogTitle>
              </DialogHeader>
              {selectedInvoiceId && (
                <div className="space-y-3">
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead className="text-xs">Batch</TableHead>
                      <TableHead className="text-xs text-right">Seats</TableHead>
                      <TableHead className="text-xs text-right">Days</TableHead>
                      <TableHead className="text-xs text-right">Rate</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {(invoiceLineItems[selectedInvoiceId] || []).map(li => (
                        <TableRow key={li.batchId}>
                          <TableCell className="text-xs font-medium">{li.batchName}<div className="text-[10px] text-muted-foreground font-mono">{li.batchId}</div></TableCell>
                          <TableCell className="text-xs text-right">{li.seats}</TableCell>
                          <TableCell className="text-xs text-right">{li.days}</TableCell>
                          <TableCell className="text-xs text-right">₹{li.ratePerSeat}</TableCell>
                          <TableCell className="text-sm text-right font-medium">₹{li.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={4} className="text-xs font-medium text-right">Total</TableCell>
                        <TableCell className="text-sm font-bold text-right">₹{(invoiceLineItems[selectedInvoiceId] || []).reduce((s, li) => s + li.amount, 0).toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> Download PDF</Button>
                    <Button variant="outline" size="sm" className="text-xs gap-1.5"><Mail className="h-3.5 w-3.5" /> Email to Customer</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Tab E: Settings */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          {/* Branding & White-Label */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Branding & White-Label</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Switch defaultChecked /><Label className="text-xs">Enable white-label portal</Label></div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Company Logo</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Favicon</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Portal Name</Label><Input placeholder="DevOps Academy" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Primary Color</Label><Input type="color" defaultValue="#3b82f6" className="h-9 w-20" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Secondary Color</Label><Input type="color" defaultValue="#8b5cf6" className="h-9 w-20" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Accent Color</Label><Input type="color" defaultValue="#06b6d4" className="h-9 w-20" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Custom Domain</Label><Input placeholder="labs.company.com" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Login Page Heading</Label><Input placeholder="Welcome to Company Labs" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Login Page Subtext</Label><Input placeholder="Sign in to access your labs" className="h-9 text-sm" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label className="text-xs">Footer Text</Label><Input placeholder="© 2026 Company. All rights reserved." className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Support Email (shown in portal)</Label><Input placeholder="support@company.com" className="h-9 text-sm" /></div>
              </div>
              <div className="flex items-center gap-3"><Switch defaultChecked={false} /><Label className="text-xs">Hide "Powered by CloudAdda" branding</Label></div>
              <div className="flex items-center gap-3"><Switch defaultChecked /><Label className="text-xs">Use custom email templates with company branding</Label></div>
            </CardContent>
          </Card>

          {/* Course & Content Settings (incl. Assessment & Certification — Frappe LMS) */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Course & Content Settings</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-medium mb-2">Authoring & Content</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Allow trainers to create courses", defaultOn: true },
                    { label: "Allow trainers to upload videos", defaultOn: true },
                    { label: "Allow trainers to upload documents", defaultOn: true },
                    { label: "Allow course cloning from templates", defaultOn: true },
                    { label: "Sync courses with Frappe LMS", defaultOn: true },
                    { label: "Auto-publish courses on save", defaultOn: false },
                    { label: "Allow embedded YouTube/Vimeo lessons", defaultOn: true },
                    { label: "Enable course discussions / Q&A", defaultOn: true },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <Switch defaultChecked={f.defaultOn} />
                      <Label className="text-xs">{f.label}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-3">
                  <div className="space-y-1.5"><Label className="text-xs">Max Upload Size (MB)</Label><Input type="number" defaultValue={500} className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Allowed File Formats</Label><Input defaultValue="pdf,mp4,pptx,docx,zip" className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Storage Quota (GB)</Label><Input type="number" defaultValue={50} className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Frappe LMS Site URL</Label><Input placeholder="lms.company.com" className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Frappe API Key</Label><Input type="password" placeholder="key_..." className="h-9 text-sm" /></div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Default Course Visibility</Label>
                    <Select defaultValue="batch"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="batch">Batch only</SelectItem><SelectItem value="org">Whole organisation</SelectItem><SelectItem value="public">Public</SelectItem></SelectContent></Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-medium mb-2">Assessments</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Enable quizzes", defaultOn: true },
                    { label: "Enable assignments", defaultOn: true },
                    { label: "Enable coding exercises (Judge0)", defaultOn: true },
                    { label: "Enable proctored exam mode", defaultOn: false },
                    { label: "Lock browser during exams", defaultOn: false },
                    { label: "Allow retakes on failed assessments", defaultOn: true },
                    { label: "Show leaderboard to participants", defaultOn: false },
                    { label: "Enable peer review assignments", defaultOn: false },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <Switch defaultChecked={f.defaultOn} />
                      <Label className="text-xs">{f.label}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-3">
                  <div className="space-y-1.5"><Label className="text-xs">Default Pass Percentage</Label><Input type="number" defaultValue={70} className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Max Retakes Allowed</Label><Input type="number" defaultValue={3} className="h-9 text-sm" /></div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-medium mb-2">Certification</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Auto-issue certificates on completion", defaultOn: true },
                    { label: "Include trainer signature", defaultOn: true },
                    { label: "Include verification QR code", defaultOn: true },
                    { label: "Allow public certificate verification URL", defaultOn: true },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <Switch defaultChecked={f.defaultOn} />
                      <Label className="text-xs">{f.label}</Label>
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Certificate Template</Label>
                    <Select defaultValue="default"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="default">Default Template</SelectItem><SelectItem value="modern">Modern</SelectItem><SelectItem value="classic">Classic</SelectItem><SelectItem value="custom">Custom Upload</SelectItem></SelectContent></Select>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">Certificate Signatory Name</Label><Input placeholder="John Doe, CTO" className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Certificate Signatory Title</Label><Input placeholder="Chief Technology Officer" className="h-9 text-sm" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Certificate Logo</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lab Environment Defaults */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Lab Environment Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5"><Label className="text-xs">Default vCPU</Label><Input type="number" defaultValue={2} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Default RAM (GB)</Label><Input type="number" defaultValue={4} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Default Disk (GB)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max vCPU Allowed</Label><Input type="number" defaultValue={8} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max RAM Allowed (GB)</Label><Input type="number" defaultValue={16} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Disk Allowed (GB)</Label><Input type="number" defaultValue={100} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Concurrent Labs</Label><Input type="number" defaultValue={50} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Lab Expiry (hours)</Label><Input type="number" defaultValue={24} className="h-9 text-sm" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Auto-Shutdown Policy</Label>
                  <Select defaultValue="idle-30"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="never">Never</SelectItem><SelectItem value="idle-15">After 15 min idle</SelectItem><SelectItem value="idle-30">After 30 min idle</SelectItem><SelectItem value="idle-60">After 60 min idle</SelectItem><SelectItem value="scheduled">Scheduled (end of day)</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Snapshot Policy</Label>
                  <Select defaultValue="manual"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="disabled">Disabled</SelectItem><SelectItem value="manual">Manual only</SelectItem><SelectItem value="daily">Daily auto-snapshot</SelectItem><SelectItem value="on-shutdown">On shutdown</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Default Region</Label>
                  <Select defaultValue="ap-south-1"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem><SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem><SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem><SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Allow GPU-enabled labs", defaultOn: false },
                  { label: "Allow nested virtualization", defaultOn: false },
                  { label: "Enable lab warm pool (pre-provisioned VMs)", defaultOn: true },
                  { label: "Allow trainers to select custom templates", defaultOn: true },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Experience Controls */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Student Experience Controls</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Student self-registration", defaultOn: false },
                  { label: "Student self-reset labs", defaultOn: true },
                  { label: "Allow clipboard copy/paste in labs", defaultOn: true },
                  { label: "Allow file upload to lab VMs", defaultOn: false },
                  { label: "Allow file download from lab VMs", defaultOn: false },
                  { label: "Enable session recording", defaultOn: false },
                  { label: "Show resource usage to students", defaultOn: true },
                  { label: "Allow students to request lab extensions", defaultOn: true },
                  { label: "Enable in-lab chat support", defaultOn: false },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Max Self-Resets per Day</Label><Input type="number" defaultValue={3} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Extension Requests per Lab</Label><Input type="number" defaultValue={2} className="h-9 text-sm" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Student Password Policy</Label>
                  <Select defaultValue="strong"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="basic">Basic (6+ chars)</SelectItem><SelectItem value="moderate">Moderate (8+ mixed)</SelectItem><SelectItem value="strong">Strong (10+ mixed + symbol)</SelectItem></SelectContent></Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication & Notifications */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Communication & Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Email notifications to trainers", defaultOn: true },
                  { label: "Email notifications to participants", defaultOn: true },
                  { label: "In-portal announcement banners", defaultOn: true },
                  { label: "SMS notifications (if configured)", defaultOn: false },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Digest Email Frequency</Label>
                  <Select defaultValue="daily"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="realtime">Real-time</SelectItem><SelectItem value="hourly">Hourly</SelectItem><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">From Email Name</Label><Input placeholder="Company Labs" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Reply-To Address</Label><Input placeholder="noreply@company.com" className="h-9 text-sm" /></div>
              </div>
            </CardContent>
          </Card>

          {/* Security & Access Control */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Security & Access Control</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Enforce SSO login", defaultOn: customer.ssoEnabled },
                  { label: "Enforce MFA for trainers", defaultOn: customer.mfaEnabled },
                  { label: "Enforce MFA for students", defaultOn: false },
                  { label: "Enable IP whitelisting", defaultOn: false },
                  { label: "Allow API access", defaultOn: false },
                  { label: "Restrict portal access to office hours", defaultOn: false },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Session Timeout (min)</Label><Input type="number" defaultValue={60} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Concurrent Sessions per User</Label><Input type="number" defaultValue={2} className="h-9 text-sm" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">SSO Provider</Label>
                  <Select defaultValue="none"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="google">Google Workspace</SelectItem><SelectItem value="azure">Azure AD / Entra ID</SelectItem><SelectItem value="okta">Okta</SelectItem><SelectItem value="saml">Custom SAML</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">SSO Entity ID / Tenant</Label><Input placeholder="tenant-id or entity-id" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Whitelisted IP Ranges</Label><Input placeholder="192.168.1.0/24, 10.0.0.0/8" className="h-9 text-sm" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Internet Policy</Label>
                  <Select defaultValue="allowlist"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="allowlist">Allowlist</SelectItem><SelectItem value="blocked">Blocked</SelectItem></SelectContent></Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheduling & Calendar */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Scheduling & Calendar</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Portal Timezone</Label>
                  <Select defaultValue="asia-kolkata"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem><SelectItem value="us-eastern">US/Eastern (EST)</SelectItem><SelectItem value="us-pacific">US/Pacific (PST)</SelectItem><SelectItem value="europe-london">Europe/London (GMT)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Business Hours Start</Label><Input type="time" defaultValue="09:00" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Business Hours End</Label><Input type="time" defaultValue="18:00" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Hours/Day per Student</Label><Input type="number" defaultValue={8} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Idle Timeout (min)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Enable Google Calendar sync", defaultOn: false },
                  { label: "Enable iCal export for students", defaultOn: true },
                  { label: "Auto-schedule labs for batch start", defaultOn: true },
                  { label: "Allow trainers to set custom schedules", defaultOn: true },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commercial & Billing */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Commercial & Billing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Pricing Model</Label>
                  <Select defaultValue="per-seat-month"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="per-seat-month">Per seat/month</SelectItem><SelectItem value="per-seat-hour">Per seat/hour</SelectItem><SelectItem value="batch-bundle">Batch bundle</SelectItem><SelectItem value="unlimited">Unlimited (flat fee)</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Default Rate (₹)</Label><Input type="number" defaultValue={500} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Minimum Commitment (₹)</Label><Input type="number" defaultValue={10000} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Payment Terms (days)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Billing Currency</Label>
                  <Select defaultValue="INR"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="INR">INR (₹)</SelectItem><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="EUR">EUR (€)</SelectItem><SelectItem value="GBP">GBP (£)</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Invoice Prefix</Label><Input defaultValue="INV" className="h-9 text-sm" /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Auto-generate invoices on billing cycle", defaultOn: true },
                  { label: "Lock provisioning if payment overdue", defaultOn: false },
                  { label: "Send invoice reminders", defaultOn: true },
                  { label: "Allow prepaid credit top-up", defaultOn: true },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data & Compliance */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Data & Compliance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Data Retention Policy</Label>
                  <Select defaultValue="1-year"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="90-days">90 Days</SelectItem><SelectItem value="6-months">6 Months</SelectItem><SelectItem value="1-year">1 Year</SelectItem><SelectItem value="3-years">3 Years</SelectItem><SelectItem value="indefinite">Indefinite</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Audit Log Retention (days)</Label><Input type="number" defaultValue={365} className="h-9 text-sm" /></div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Data Residency</Label>
                  <Select defaultValue="india"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="india">India</SelectItem><SelectItem value="us">United States</SelectItem><SelectItem value="eu">European Union</SelectItem><SelectItem value="any">No Preference</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Enable GDPR compliance mode", defaultOn: false },
                  { label: "Allow trainers to export student data", defaultOn: true },
                  { label: "Allow trainers to bulk delete student data", defaultOn: false },
                  { label: "Enable anonymized analytics sharing", defaultOn: true },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">API & Integrations</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Enable REST API access", defaultOn: false },
                  { label: "Enable Webhook notifications", defaultOn: false },
                  { label: "Enable LTI integration (LMS)", defaultOn: false },
                  { label: "Enable CRM sync (Salesforce/HubSpot)", defaultOn: false },
                  { label: "Enable Zoom integration for live classes", defaultOn: true },
                  { label: "Enable Google Meet integration", defaultOn: false },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label className="text-xs">Webhook Endpoint URL</Label><Input placeholder="https://company.com/webhooks/cloudadda" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Webhook Secret Key</Label><Input placeholder="whsec_..." type="password" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">LTI Consumer Key</Label><Input placeholder="lti-consumer-key" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">LTI Shared Secret</Label><Input placeholder="lti-shared-secret" type="password" className="h-9 text-sm" /></div>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex gap-3 pt-2">
            <Button size="sm" className="text-xs gap-1.5" onClick={() => action("Settings saved and applied")}><Shield className="h-3.5 w-3.5" /> Save & Apply Now</Button>
            <Button size="sm" variant="outline" className="text-xs" onClick={() => action("Settings saved for next batch")}>Apply to Next Batch</Button>
            <Button size="sm" variant="outline" className="text-xs text-destructive" onClick={() => action("Settings reset to defaults")}>Reset to Defaults</Button>
          </div>
        </TabsContent>

        {/* Tab F: Analytics */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Lab Hours Trend (Weekly)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={usageTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" className="fill-primary/20 stroke-primary" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Peak Concurrency (Seats)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={usageTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="seats" className="fill-primary" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Provision Success Rate</CardTitle></CardHeader>
              <CardContent className="text-center py-4">
                <p className="text-4xl font-bold text-success">96.8%</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Support Stats</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Tickets (30d)</span><span className="font-medium">{customer.openTickets + 3}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Avg Resolution</span><span className="font-medium">4.2 hrs</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Billing Trend</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={100}>
                  <AreaChart data={billingTrend}>
                    <Area type="monotone" dataKey="spend" className="fill-primary/10 stroke-primary" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-1 text-center">Last 5 months</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
