import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSandboxStore } from "@/stores/sandboxVMStore";
import { toast } from "@/hooks/use-toast";
import { Sparkles, ArrowLeft } from "lucide-react";

const OS_OPTIONS = ["Ubuntu 22.04", "Ubuntu 20.04", "CentOS 8", "Windows Server 2022", "Alpine 3.18"];
const REGIONS = ["ap-south-1", "us-east-1", "us-west-2", "eu-west-1"];

export default function RequestSandboxVM() {
  const navigate = useNavigate();
  const request = useSandboxStore((s) => s.request);
  const [form, setForm] = useState({
    purpose: "",
    os: "Ubuntu 22.04",
    vcpu: 2,
    ramGB: 4,
    diskGB: 40,
    region: "ap-south-1",
    targetCourse: "",
    notes: "",
  });

  const submit = () => {
    if (!form.purpose.trim()) {
      toast({ title: "Purpose required", variant: "destructive" });
      return;
    }
    request({
      ...form,
      trainerName: "John Smith",
      trainerEmail: "john@techskills.com",
      customerId: "cust-1",
      customerName: "TechSkills Academy",
    });
    toast({ title: "Request submitted", description: "Admin will provision the sandbox VM for you." });
    navigate("/sandbox-vms");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={() => navigate(-1)}><ArrowLeft className="h-3.5 w-3.5" /> Back</Button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Request Sandbox VM</h1>
        <p className="text-muted-foreground text-sm mt-1">Get a sandbox VM to configure and turn into a self-paced lab template.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">VM Configuration</CardTitle><CardDescription className="text-xs">Tell us what you need.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs">Purpose / Template name</Label>
            <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. AWS S3 self-paced lab" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Target self-paced course (optional)</Label>
            <Input value={form.targetCourse} onChange={(e) => setForm({ ...form, targetCourse: e.target.value })} placeholder="e.g. AWS S3 Deep Dive" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Operating System</Label>
              <Select value={form.os} onValueChange={(v) => setForm({ ...form, os: v })}>
                <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{OS_OPTIONS.map((o) => <SelectItem key={o} value={o} className="text-xs">{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Region</Label>
              <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{REGIONS.map((r) => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">vCPU</Label>
              <Select value={String(form.vcpu)} onValueChange={(v) => setForm({ ...form, vcpu: Number(v) })}>
                <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{[2, 4, 8, 16].map((n) => <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">RAM (GB)</Label>
              <Select value={String(form.ramGB)} onValueChange={(v) => setForm({ ...form, ramGB: Number(v) })}>
                <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{[2, 4, 8, 16, 32].map((n) => <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Disk (GB)</Label>
              <Select value={String(form.diskGB)} onValueChange={(v) => setForm({ ...form, diskGB: Number(v) })}>
                <SelectTrigger className="mt-1 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{[40, 80, 120, 240].map((n) => <SelectItem key={n} value={String(n)} className="text-xs">{n}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Software / setup notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} className="mt-1 text-xs" placeholder="e.g. pre-install awscli, sample data, etc." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button onClick={submit}><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Submit Request</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
