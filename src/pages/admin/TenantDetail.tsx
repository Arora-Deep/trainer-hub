import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";
import { ArrowLeft, Ban, UserCheck, Receipt, CreditCard, Activity, Shield, Clock, Users, FileText, LifeBuoy, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success", suspended: "bg-destructive/10 text-destructive",
  trial: "bg-warning/10 text-warning", expired: "bg-muted text-muted-foreground",
};

export default function TenantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, tickets, invoices } = useCustomerStore();
  const tenant = customers.find(c => c.id === id);

  if (!tenant) return <div className="p-6 text-center text-muted-foreground">Tenant not found</div>;

  const tenantTickets = tickets.filter(t => t.tenant === tenant.name);
  const tenantInvoices = invoices.filter(i => i.tenant === tenant.name);

  const admins = [
    { name: tenant.contactPerson, email: tenant.email, role: "Admin", lastLogin: "2 hours ago", mfa: tenant.mfaEnabled },
    { name: "Training Manager", email: `manager@${tenant.domain}`, role: "Manager", lastLogin: "1 day ago", mfa: false },
  ];

  const batches = [
    { name: "K8s Batch #14", template: "Kubernetes Lab v2", students: 35, start: "2026-02-25", end: "2026-03-10", status: "active" },
    { name: "Linux Fundamentals #8", template: "Linux + Networking Lab v1", students: 50, start: "2026-03-01", end: "2026-03-15", status: "active" },
    { name: "Docker Basics #3", template: "Docker Compose Lab", students: 25, start: "2026-02-10", end: "2026-02-24", status: "completed" },
  ];

  const auditLogs = [
    { action: "Quota updated", user: "admin@cloudadda.com", time: "2026-02-28 14:30", details: "CPU: 400 → 500" },
    { action: "Credits applied", user: "finance@cloudadda.com", time: "2026-02-27 10:00", details: "₹5,000 credit" },
    { action: "Plan changed", user: "sales@cloudadda.com", time: "2026-02-20 09:15", details: "Professional → Enterprise" },
    { action: "Admin invited", user: tenant.email, time: "2026-02-15 11:00", details: `manager@${tenant.domain}` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/admin/tenants")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{tenant.name}</h1>
            <Badge variant="secondary" className={`text-xs capitalize ${statusColors[tenant.status]}`}>{tenant.status}</Badge>
            <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary">{tenant.plan}</Badge>
            <Badge variant="secondary" className={`text-xs font-mono ${tenant.healthScore >= 80 ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
              Health: {tenant.healthScore}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{tenant.domain} · {tenant.contactPerson}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs text-destructive"><Ban className="h-3.5 w-3.5" /> Suspend</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><UserCheck className="h-3.5 w-3.5" /> Impersonate</Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Receipt className="h-3.5 w-3.5" /> Create Invoice</Button>
          <Button size="sm" className="gap-1.5 text-xs"><CreditCard className="h-3.5 w-3.5" /> Add Credits</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="text-xs gap-1.5"><Activity className="h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="people" className="text-xs gap-1.5"><Users className="h-3.5 w-3.5" /> People & Access</TabsTrigger>
          <TabsTrigger value="quotas" className="text-xs gap-1.5"><Shield className="h-3.5 w-3.5" /> Quotas & Policies</TabsTrigger>
          <TabsTrigger value="batches" className="text-xs gap-1.5"><Clock className="h-3.5 w-3.5" /> Batches & Labs</TabsTrigger>
          <TabsTrigger value="billing" className="text-xs gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Billing</TabsTrigger>
          <TabsTrigger value="support" className="text-xs gap-1.5"><LifeBuoy className="h-3.5 w-3.5" /> Support</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs gap-1.5"><Eye className="h-3.5 w-3.5" /> Audit</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Contract Info</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium capitalize">{tenant.plan}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Billing</span><span className="font-medium capitalize">{tenant.billingCycle}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Renewal</span><span className="font-medium">{tenant.renewalDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">SLA</span><span className="font-medium capitalize">{tenant.slaTier}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Current Usage</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Active Seats</span><span className="font-medium">{tenant.currentUsage.activeSeats}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Live Labs</span><span className="font-medium">{tenant.currentUsage.liveLabs}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Active VMs</span><span className="font-medium">{tenant.activeVMs}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Batches</span><span className="font-medium">{tenant.activeBatches}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Quota Allocation</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">CPU</span><span className="font-medium">{tenant.quota.cpu} vCPU</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">RAM</span><span className="font-medium">{tenant.quota.ram} GB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span className="font-medium">{tenant.quota.storage} GB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GPU</span><span className="font-medium">{tenant.quota.gpu}</span></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 3).map((log, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground w-32">{log.time}</span>
                    <span className="font-medium">{log.action}</span>
                    <span className="text-muted-foreground">{log.details}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: People */}
        <TabsContent value="people" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Tenant Admins</CardTitle>
              <Button size="sm" variant="outline" className="text-xs gap-1.5">Invite Admin</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Email</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Last Login</TableHead>
                    <TableHead className="text-xs text-center">MFA</TableHead>
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{a.name}</TableCell>
                      <TableCell className="text-xs">{a.email}</TableCell>
                      <TableCell className="text-xs">{a.role}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.lastLogin}</TableCell>
                      <TableCell className="text-center">{a.mfa ? <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">ON</Badge> : <Badge variant="secondary" className="text-[9px]">OFF</Badge>}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" className="text-xs h-7">Reset MFA</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">SSO Configuration</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-4">
                <Switch checked={tenant.ssoEnabled} />
                <span className="text-sm">{tenant.ssoEnabled ? "SSO Enabled" : "SSO Not Configured"}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">IP Restrictions</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">No IP restrictions configured</p></CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Quotas */}
        <TabsContent value="quotas" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Resource Quotas</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "CPU (vCPU)", value: tenant.quota.cpu },
                  { label: "RAM (GB)", value: tenant.quota.ram },
                  { label: "Storage (GB)", value: tenant.quota.storage },
                  { label: "GPU", value: tenant.quota.gpu },
                ].map(q => (
                  <div key={q.label} className="space-y-1.5">
                    <Label className="text-xs">{q.label}</Label>
                    <Input type="number" defaultValue={q.value} className="h-9 text-sm" />
                  </div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Max Concurrent Labs</Label>
                  <Input type="number" defaultValue={200} className="h-9 text-sm" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Switch defaultChecked />
                  <Label className="text-xs">Allow burst capacity</Label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Policies</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5"><Label className="text-xs">Idle Timeout (min)</Label><Input type="number" defaultValue={30} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Max Hours/Day per Student</Label><Input type="number" defaultValue={8} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Lab Expiry Default (days)</Label><Input type="number" defaultValue={14} className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Internet Policy</Label>
                  <Select defaultValue="allowlist"><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="allowlist">Allowlist</SelectItem><SelectItem value="blocked">Blocked</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Logs Retention (days)</Label><Input type="number" defaultValue={90} className="h-9 text-sm" /></div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="text-xs">Save</Button>
                <Button size="sm" variant="outline" className="text-xs">Reset</Button>
                <Button size="sm" variant="outline" className="text-xs">Apply Immediately</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Batches */}
        <TabsContent value="batches" className="mt-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Batches</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">Shutdown All Labs</Button>
                <Button variant="outline" size="sm" className="text-xs">Extend Batch</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Batch</TableHead>
                    <TableHead className="text-xs">Template</TableHead>
                    <TableHead className="text-xs">Students</TableHead>
                    <TableHead className="text-xs">Start</TableHead>
                    <TableHead className="text-xs">End</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
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
        </TabsContent>

        {/* Tab 5: Billing */}
        <TabsContent value="billing" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Wallet Balance</p><p className="text-2xl font-bold mt-1">₹{tenant.walletBalance.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Monthly Usage</p><p className="text-2xl font-bold mt-1">₹{tenant.monthlyUsage.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Overdue</p><p className={`text-2xl font-bold mt-1 ${tenant.overdueAmount > 0 ? "text-destructive" : ""}`}>₹{tenant.overdueAmount.toLocaleString()}</p></CardContent></Card>
          </div>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Invoices</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead className="text-xs">Invoice</TableHead><TableHead className="text-xs">Amount</TableHead><TableHead className="text-xs">Due Date</TableHead><TableHead className="text-xs">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {tenantInvoices.map(inv => (
                    <TableRow key={inv.id}>
                      <TableCell className="text-xs font-mono">{inv.id}</TableCell>
                      <TableCell className="text-sm font-medium">₹{inv.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-xs">{inv.dueDate}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${inv.status === "paid" ? "bg-success/10 text-success" : inv.status === "overdue" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>{inv.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: Support */}
        <TabsContent value="support" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Tickets</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead className="text-xs">Ticket</TableHead><TableHead className="text-xs">Subject</TableHead><TableHead className="text-xs">Priority</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">SLA</TableHead></TableRow></TableHeader>
                <TableBody>
                  {tenantTickets.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="text-xs font-mono">{t.id}</TableCell>
                      <TableCell className="text-sm">{t.subject}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${t.priority === "critical" ? "bg-destructive/10 text-destructive" : t.priority === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>{t.priority}</Badge></TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{t.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-xs">{t.slaMinutes}m</TableCell>
                    </TableRow>
                  ))}
                  {tenantTickets.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">No tickets</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: Audit */}
        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Audit Timeline</CardTitle>
              <Button size="sm" variant="outline" className="text-xs">Export Logs</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap w-36">{log.time}</span>
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.details}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">by {log.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
