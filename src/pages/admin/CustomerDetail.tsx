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
} from "lucide-react";
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
    { name: "K8s Batch #14", template: "Kubernetes Lab v2", students: 35, start: "2026-02-25", end: "2026-03-10", status: "active" },
    { name: "Linux Fundamentals #8", template: "Linux + Networking Lab v1", students: 50, start: "2026-03-01", end: "2026-03-15", status: "active" },
    { name: "Docker Basics #3", template: "Docker Compose Lab", students: 25, start: "2026-02-10", end: "2026-02-24", status: "completed" },
  ];

  const seats = [
    { vmId: "VM-4501", student: "student01@devops.in", status: "running", lastSeen: "2 min ago", node: "node-ap-3", ip: "10.0.1.51", cpu: "45%", ram: "62%" },
    { vmId: "VM-4502", student: "student02@devops.in", status: "running", lastSeen: "5 min ago", node: "node-ap-3", ip: "10.0.1.52", cpu: "32%", ram: "48%" },
    { vmId: "VM-4503", student: "student03@devops.in", status: "stopped", lastSeen: "2 hrs ago", node: "node-ap-1", ip: "10.0.1.53", cpu: "0%", ram: "0%" },
  ];

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
          <TabsTrigger value="provisioning" className="text-xs gap-1.5"><FlaskConical className="h-3.5 w-3.5" /> Provisioning & Labs</TabsTrigger>
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

        {/* Tab B: Provisioning & Labs */}
        <TabsContent value="provisioning" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Batches</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("All labs shutdown")}><Power className="h-3.5 w-3.5" /> Shutdown All</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Batch extended")}><Clock className="h-3.5 w-3.5" /> Extend Batch</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">Batch</TableHead><TableHead className="text-xs">Template</TableHead>
                  <TableHead className="text-xs">Students</TableHead><TableHead className="text-xs">Start</TableHead>
                  <TableHead className="text-xs">End</TableHead><TableHead className="text-xs">Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {batches.map((b, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{b.name}</TableCell>
                      <TableCell className="text-xs">{b.template}</TableCell>
                      <TableCell className="text-xs">{b.students}</TableCell>
                      <TableCell className="text-xs">{b.start}</TableCell>
                      <TableCell className="text-xs">{b.end}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${b.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{b.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Seat / Lab Instances</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Labs replaced")}><RotateCcw className="h-3.5 w-3.5" /> Replace Broken</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Credentials reset")}><Key className="h-3.5 w-3.5" /> Reset Creds</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> Download Logs</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead className="text-xs">VM ID</TableHead><TableHead className="text-xs">Student</TableHead>
                  <TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Last Seen</TableHead>
                  <TableHead className="text-xs">Node</TableHead><TableHead className="text-xs">IP</TableHead>
                  <TableHead className="text-xs">CPU</TableHead><TableHead className="text-xs">RAM</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {seats.map(s => (
                    <TableRow key={s.vmId}>
                      <TableCell className="text-xs font-mono">{s.vmId}</TableCell>
                      <TableCell className="text-xs">{s.student}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] ${s.status === "running" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{s.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.lastSeen}</TableCell>
                      <TableCell className="text-xs font-mono">{s.node}</TableCell>
                      <TableCell className="text-xs font-mono">{s.ip}</TableCell>
                      <TableCell className="text-xs">{s.cpu}</TableCell>
                      <TableCell className="text-xs">{s.ram}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Wallet / Credits</p><p className="text-2xl font-bold mt-1">₹{customer.walletBalance.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Monthly Usage</p><p className="text-2xl font-bold mt-1">₹{customer.monthlyUsage.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Overdue</p><p className={`text-2xl font-bold mt-1 ${customer.overdueAmount > 0 ? "text-destructive" : ""}`}>₹{customer.overdueAmount.toLocaleString()}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Invoices</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Invoice created")}><Receipt className="h-3.5 w-3.5" /> Create Invoice</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => action("Credit applied")}><CreditCard className="h-3.5 w-3.5" /> Apply Credit</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead className="text-xs">Invoice</TableHead><TableHead className="text-xs">Amount</TableHead><TableHead className="text-xs">Due Date</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">Overdue</TableHead></TableRow></TableHeader>
                <TableBody>
                  {custInvoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                      <TableCell className="text-sm font-medium">₹{inv.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{inv.dueDate}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${inv.status === "paid" ? "bg-success/10 text-success" : inv.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{inv.status}</Badge></TableCell>
                      <TableCell className="text-xs">{inv.overdueDays > 0 ? `${inv.overdueDays}d` : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex items-center gap-3">
            <Switch />
            <Label className="text-xs">Lock provisioning until payment/PO received</Label>
          </div>
        </TabsContent>

        {/* Tab E: Settings */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          {/* Branding */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Branding (White-label)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3"><Switch /><Label className="text-xs">Enable white-label</Label></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><Label className="text-xs">Logo</Label><Input type="file" accept="image/*" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Theme Color</Label><Input type="color" defaultValue="#3b82f6" className="h-9" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Custom Domain</Label><Input placeholder="labs.company.com" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Login Page Text</Label><Input placeholder="Welcome to Company Labs" className="h-9 text-sm" /></div>
              </div>
            </CardContent>
          </Card>
          {/* Commercial */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Commercial</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Pricing Model</Label>
                  <Select defaultValue="per-seat-month"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="per-seat-month">Per seat/month</SelectItem><SelectItem value="per-seat-hour">Per seat/hour</SelectItem><SelectItem value="batch-bundle">Batch bundle</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Default Rate (₹)</Label><Input type="number" defaultValue={500} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Minimum Commitment (₹)</Label><Input type="number" defaultValue={10000} className="h-9 text-sm" /></div>
              </div>
            </CardContent>
          </Card>
          {/* Feature Toggles */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Feature Toggles</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Student self-reset", defaultOn: true },
                  { label: "Batch cloning", defaultOn: true },
                  { label: "Exam mode", defaultOn: false },
                  { label: "Internet allowlist mode", defaultOn: true },
                  { label: "Usage exports", defaultOn: true },
                  { label: "SSO enablement", defaultOn: customer.ssoEnabled },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <Switch defaultChecked={f.defaultOn} />
                    <Label className="text-xs">{f.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Policies */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Policies</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Idle Timeout (min)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Hours/Day per Student</Label><Input type="number" defaultValue={8} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Default Lab Expiry (days)</Label><Input type="number" defaultValue={14} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Internet Policy</Label>
                  <Select defaultValue="allowlist"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="allowlist">Allowlist</SelectItem><SelectItem value="blocked">Blocked</SelectItem></SelectContent></Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="text-xs">Save & Apply Now</Button>
                <Button size="sm" variant="outline" className="text-xs">Apply Next Batch</Button>
              </div>
            </CardContent>
          </Card>
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
