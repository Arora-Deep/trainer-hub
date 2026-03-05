import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    defaultLabExpiry: "24",
    defaultCPU: "2",
    defaultRAM: "4",
    defaultDisk: "30",
    invoicePrefix: "INV",
    paymentTerms: "30",
    enableEmailNotifications: true,
    enableSlackNotifications: false,
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform configuration</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Default Lab Expiry</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Expiry Duration (hours)</Label>
            <Input type="number" value={settings.defaultLabExpiry} onChange={e => setSettings(s => ({ ...s, defaultLabExpiry: e.target.value }))} className="max-w-[200px]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Default VM Resources</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>CPU (vCPU)</Label><Input type="number" value={settings.defaultCPU} onChange={e => setSettings(s => ({ ...s, defaultCPU: e.target.value }))} /></div>
            <div className="space-y-2"><Label>RAM (GB)</Label><Input type="number" value={settings.defaultRAM} onChange={e => setSettings(s => ({ ...s, defaultRAM: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Disk (GB)</Label><Input type="number" value={settings.defaultDisk} onChange={e => setSettings(s => ({ ...s, defaultDisk: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Billing Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Invoice Prefix</Label><Input value={settings.invoicePrefix} onChange={e => setSettings(s => ({ ...s, invoicePrefix: e.target.value }))} /></div>
            <div className="space-y-2"><Label>Payment Terms (days)</Label><Input type="number" value={settings.paymentTerms} onChange={e => setSettings(s => ({ ...s, paymentTerms: e.target.value }))} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Email Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <Switch checked={settings.enableEmailNotifications} onCheckedChange={v => setSettings(s => ({ ...s, enableEmailNotifications: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Slack Notifications</Label>
            <Switch checked={settings.enableSlackNotifications} onCheckedChange={v => setSettings(s => ({ ...s, enableSlackNotifications: v }))} />
          </div>
        </CardContent>
      </Card>

      <Button>Save Settings</Button>
    </div>
  );
}
