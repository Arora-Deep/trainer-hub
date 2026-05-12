import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Building2, Lock, Bell, CreditCard, Server, Webhook, Mail, ShieldCheck,
  Save, ExternalLink, Globe, Brush, Key, Database, Cpu,
} from "lucide-react";

export default function AdminSettings() {
  const [s, setS] = useState({
    // Org
    orgName: "CloudAdda",
    legalName: "CloudAdda Technologies Pvt Ltd",
    gstin: "27AABCU9603R1ZX",
    address: "WeWork, Mumbai 400070",
    supportEmail: "support@cloudadda.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
    // Defaults
    defaultLabExpiry: "24",
    defaultCPU: "2", defaultRAM: "4", defaultDisk: "30",
    prepDays: 2,
    // Provisioning
    placementStrategy: "least-stressed",
    autoSnapshot: true, snapshotRetention: 7,
    // Billing
    invoicePrefix: "INV-2026-",
    paymentTerms: "30",
    erpnextEnabled: true, erpnextUrl: "https://erp.cloudadda.com",
    erpnextApiKey: "•••••••••",
    stripeEnabled: false,
    // Notifications
    emailNotifications: true, slackNotifications: true, slackWebhook: "https://hooks.slack.com/...",
    smsAlerts: false, whatsappAlerts: false,
    // Security
    enforce2FA: true, ssoEnabled: false, sessionTimeout: 60,
    passwordPolicy: "strong",
    // Branding
    primaryColor: "#3B82F6",
    logoUrl: "",
  });

  const u = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => setS((p) => ({ ...p, [k]: v }));
  const save = () => toast({ title: "Settings saved", description: "Changes applied platform-wide" });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure organization, billing, security, and integrations</p>
        </div>
        <Button onClick={save} className="gap-1.5"><Save className="h-4 w-4" /> Save All</Button>
      </div>

      <Tabs defaultValue="org" className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="org" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Organization</TabsTrigger>
          <TabsTrigger value="provisioning" className="gap-1.5"><Server className="h-3.5 w-3.5" /> Provisioning</TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" /> Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5"><Lock className="h-3.5 w-3.5" /> Security</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-1.5"><Webhook className="h-3.5 w-3.5" /> Integrations</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5"><Brush className="h-3.5 w-3.5" /> Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Organization Profile</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Display Name</Label><Input value={s.orgName} onChange={(e) => u("orgName", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Legal Name</Label><Input value={s.legalName} onChange={(e) => u("legalName", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">GSTIN / Tax ID</Label><Input value={s.gstin} onChange={(e) => u("gstin", e.target.value)} className="font-mono" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Support Email</Label><Input value={s.supportEmail} onChange={(e) => u("supportEmail", e.target.value)} /></div>
              <div className="space-y-1.5 col-span-2"><Label className="text-xs">Registered Address</Label><Textarea rows={2} value={s.address} onChange={(e) => u("address", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Timezone</Label>
                <Select value={s.timezone} onValueChange={(v) => u("timezone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New York</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Default Currency</Label>
                <Select value={s.currency} onValueChange={(v) => u("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="INR">INR ₹</SelectItem><SelectItem value="USD">USD $</SelectItem><SelectItem value="EUR">EUR €</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="provisioning" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Cpu className="h-4 w-4" /> Default VM Spec & Placement</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">vCPU</Label><Input type="number" value={s.defaultCPU} onChange={(e) => u("defaultCPU", e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">RAM (GB)</Label><Input type="number" value={s.defaultRAM} onChange={(e) => u("defaultRAM", e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Disk (GB)</Label><Input type="number" value={s.defaultDisk} onChange={(e) => u("defaultDisk", e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Lab Expiry (hours of inactivity)</Label><Input type="number" value={s.defaultLabExpiry} onChange={(e) => u("defaultLabExpiry", e.target.value)} /></div>
                <div className="space-y-1.5"><Label className="text-xs">Trainer Prep Days (before batch starts)</Label><Input type="number" value={s.prepDays} onChange={(e) => u("prepDays", parseInt(e.target.value) || 0)} /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Placement Strategy</Label>
                <Select value={s.placementStrategy} onValueChange={(v) => u("placementStrategy", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="least-stressed">Least-stressed node</SelectItem>
                    <SelectItem value="round-robin">Round robin</SelectItem>
                    <SelectItem value="pack-bin">Bin-pack (cost optimal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between"><div><Label>Auto-snapshot golden VMs nightly</Label><p className="text-xs text-muted-foreground">Creates a snapshot at 02:00 local time</p></div><Switch checked={s.autoSnapshot} onCheckedChange={(v) => u("autoSnapshot", v)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Snapshot retention (days)</Label><Input type="number" value={s.snapshotRetention} onChange={(e) => u("snapshotRetention", parseInt(e.target.value) || 0)} className="max-w-[200px]" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Invoicing Defaults</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Invoice Series / Prefix</Label><Input value={s.invoicePrefix} onChange={(e) => u("invoicePrefix", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Default Payment Terms (days)</Label><Input type="number" value={s.paymentTerms} onChange={(e) => u("paymentTerms", e.target.value)} /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ExternalLink className="h-4 w-4" /> ERPNext / Frappe Connection</CardTitle><CardDescription className="text-xs">Sync invoices, payments, customers</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between"><Label>Enabled</Label><Switch checked={s.erpnextEnabled} onCheckedChange={(v) => u("erpnextEnabled", v)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">ERPNext URL</Label><Input value={s.erpnextUrl} onChange={(e) => u("erpnextUrl", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">API Key</Label><Input type="password" value={s.erpnextApiKey} onChange={(e) => u("erpnextApiKey", e.target.value)} /></div>
              <Button variant="outline" size="sm" onClick={() => toast({ title: "Connection OK", description: "ERPNext reachable" })}>Test Connection</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Stripe Card Payments</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div><Label>Enable Stripe</Label><p className="text-xs text-muted-foreground">Accept credit card via Stripe Checkout</p></div>
              <Switch checked={s.stripeEnabled} onCheckedChange={(v) => u("stripeEnabled", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Channels</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                ["emailNotifications", "Email Notifications", "Transactional + alerts"],
                ["slackNotifications", "Slack Notifications", "Ops + tickets"],
                ["smsAlerts", "SMS Alerts (Twilio)", "Critical alerts only"],
                ["whatsappAlerts", "WhatsApp Alerts", "Customer billing reminders"],
              ].map(([k, t, d]) => (
                <div key={k} className="flex items-center justify-between">
                  <div><Label>{t}</Label><p className="text-xs text-muted-foreground">{d}</p></div>
                  <Switch checked={(s as any)[k]} onCheckedChange={(v) => u(k as any, v)} />
                </div>
              ))}
              <div className="space-y-1.5 pt-2"><Label className="text-xs">Slack Webhook URL</Label><Input value={s.slackWebhook} onChange={(e) => u("slackWebhook", e.target.value)} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Access Controls</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between"><div><Label>Enforce 2FA for admins</Label><p className="text-xs text-muted-foreground">TOTP or hardware key</p></div><Switch checked={s.enforce2FA} onCheckedChange={(v) => u("enforce2FA", v)} /></div>
              <div className="flex items-center justify-between"><div><Label>Single Sign-On (SAML / OIDC)</Label><p className="text-xs text-muted-foreground">Google Workspace, Okta, Azure AD</p></div><Switch checked={s.ssoEnabled} onCheckedChange={(v) => u("ssoEnabled", v)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Session Timeout (minutes)</Label><Input type="number" value={s.sessionTimeout} onChange={(e) => u("sessionTimeout", parseInt(e.target.value) || 30)} className="max-w-[200px]" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Password Policy</Label>
                <Select value={s.passwordPolicy} onValueChange={(v) => u("passwordPolicy", v)}>
                  <SelectTrigger className="max-w-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ chars)</SelectItem>
                    <SelectItem value="strong">Strong (12+, mixed case, symbol)</SelectItem>
                    <SelectItem value="paranoid">Paranoid (16+, all classes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" /> API Tokens</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded border">
                <div className="text-sm"><p className="font-medium">CI Runner Token</p><p className="text-xs text-muted-foreground font-mono">ca_••••••••f7c1 · Created 2026-02-10</p></div>
                <Button variant="outline" size="sm">Rotate</Button>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5"><Key className="h-3 w-3" /> Generate New Token</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Integrations</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["ERPNext / Frappe", "Connected", "billing sync", true],
                ["Slack", "Connected", "ops alerts", true],
                ["Google Workspace SSO", "Not configured", "auth", false],
                ["Microsoft Teams", "Not configured", "chat notifications", false],
                ["PagerDuty", "Not configured", "incident escalation", false],
                ["Datadog", "Not configured", "metrics + APM", false],
                ["Stripe", "Not configured", "card payments", false],
                ["Jira / Linear", "Connected", "issue sync", true],
              ].map(([name, status, scope, connected]) => (
                <div key={name as string} className="p-3 rounded border flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{scope}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={`text-[10px] ${connected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{status as string}</Badge>
                    <Button variant="outline" size="sm">{connected ? "Manage" : "Connect"}</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Branding</CardTitle><CardDescription className="text-xs">Logo, colors, custom domain (white-label for enterprise tenants)</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">Logo URL</Label><Input placeholder="https://..." value={s.logoUrl} onChange={(e) => u("logoUrl", e.target.value)} /></div>
              <div className="space-y-1.5"><Label className="text-xs">Primary Brand Color</Label><Input value={s.primaryColor} onChange={(e) => u("primaryColor", e.target.value)} className="max-w-[200px] font-mono" /></div>
              <div className="space-y-1.5"><Label className="text-xs flex items-center gap-1.5"><Globe className="h-3 w-3" /> Custom Domain</Label><Input placeholder="labs.yourcompany.com" /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
