import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSandboxStore } from "@/stores/sandboxVMStore";
import { toast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const OS_OPTIONS = ["Ubuntu 22.04", "Ubuntu 20.04", "CentOS 8", "Windows Server 2022", "Alpine 3.18"];
const REGIONS = ["ap-south-1", "us-east-1", "us-west-2", "eu-west-1"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPurpose?: string;
  defaultCourse?: string;
  contextLabel?: string;
  onSubmitted?: (id: string) => void;
}

export function RequestTemplateSheet({ open, onOpenChange, defaultPurpose = "", defaultCourse = "", contextLabel, onSubmitted }: Props) {
  const request = useSandboxStore((s) => s.request);
  const [form, setForm] = useState({
    purpose: defaultPurpose,
    os: "Ubuntu 22.04",
    vcpu: 2,
    ramGB: 4,
    diskGB: 40,
    region: "ap-south-1",
    targetCourse: defaultCourse,
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, purpose: defaultPurpose || f.purpose, targetCourse: defaultCourse || f.targetCourse }));
    }
  }, [open, defaultPurpose, defaultCourse]);

  const submit = () => {
    if (!form.purpose.trim()) {
      toast({ title: "Purpose required", variant: "destructive" });
      return;
    }
    const id = request({
      ...form,
      trainerName: "John Smith",
      trainerEmail: "john@techskills.com",
      customerId: "cust-1",
      customerName: "TechSkills Academy",
    });
    toast({ title: "Request submitted", description: "Admin will provision the sandbox VM for you." });
    onOpenChange(false);
    onSubmitted?.(id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Request a lab template
          </SheetTitle>
          <SheetDescription className="text-xs">
            {contextLabel ? `For: ${contextLabel}. ` : ""}
            Admin will provision a sandbox VM so you can configure it. Once you submit it for snapshot, the CloudAdda team publishes it as a reusable lab template.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-xs">Template name / purpose</Label>
            <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. AWS S3 self-paced lab" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Target course (optional)</Label>
            <Input value={form.targetCourse} onChange={(e) => setForm({ ...form, targetCourse: e.target.value })} placeholder="e.g. AWS S3 Deep Dive" className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Operating system</Label>
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
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Submit request</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
