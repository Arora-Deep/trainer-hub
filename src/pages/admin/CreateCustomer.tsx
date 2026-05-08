import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

export default function CreateCustomer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "", companyAlias: "", domain: "", website: "",
    ownerName: "", ownerEmail: "", ownerPhone: "",
    status: "active", defaultRegion: "ap-south-1", maxConcurrentLabs: "50", defaultLabExpiry: "24",
    primaryColor: "#3b82f6", portalName: "",
  });

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Customer</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new training company client</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Company Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Company Name</Label><Input value={form.companyName} onChange={e => update("companyName", e.target.value)} /></div>
            <div className="space-y-2"><Label>Company Alias</Label><Input value={form.companyAlias} onChange={e => update("companyAlias", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Domain</Label><Input value={form.domain} onChange={e => update("domain", e.target.value)} placeholder="company.com" /></div>
            <div className="space-y-2"><Label>Website</Label><Input value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://..." /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Owner Name</Label><Input value={form.ownerName} onChange={e => update("ownerName", e.target.value)} /></div>
            <div className="space-y-2"><Label>Owner Email</Label><Input type="email" value={form.ownerEmail} onChange={e => update("ownerEmail", e.target.value)} /></div>
            <div className="space-y-2"><Label>Owner Phone</Label><Input value={form.ownerPhone} onChange={e => update("ownerPhone", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Access Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => update("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Region</Label>
              <Select value={form.defaultRegion} onValueChange={v => update("defaultRegion", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ap-south-1">ap-south-1 (Mumbai)</SelectItem>
                  <SelectItem value="us-east-1">us-east-1 (Virginia)</SelectItem>
                  <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                  <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Max Concurrent Labs</Label><Input type="number" value={form.maxConcurrentLabs} onChange={e => update("maxConcurrentLabs", e.target.value)} /></div>
            <div className="space-y-2"><Label>Default Lab Expiry (hours)</Label><Input type="number" value={form.defaultLabExpiry} onChange={e => update("defaultLabExpiry", e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Branding (Optional)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Logo Upload</Label><Input type="file" accept="image/*" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Primary Color</Label><Input type="color" value={form.primaryColor} onChange={e => update("primaryColor", e.target.value)} className="h-10 w-20" /></div>
            <div className="space-y-2"><Label>Portal Name</Label><Input value={form.portalName} onChange={e => update("portalName", e.target.value)} placeholder="Custom portal name" /></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button className="gap-2">Create Customer</Button>
        <Button variant="outline" onClick={() => navigate("/admin/customers")}>Cancel</Button>
      </div>
    </div>
  );
}
