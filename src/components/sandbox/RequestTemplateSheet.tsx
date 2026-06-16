import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSandboxStore } from "@/stores/sandboxVMStore";
import { toast } from "@/hooks/use-toast";
import { Sparkles, HelpCircle, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const OS_OPTIONS = ["Ubuntu 22.04", "Ubuntu 20.04", "CentOS 8", "Windows Server 2022", "Alpine 3.18", "Other"];
const REGIONS = ["ap-south-1", "us-east-1", "us-west-2", "eu-west-1"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPurpose?: string;
  defaultCourse?: string;
  contextLabel?: string;
  onSubmitted?: (id: string) => void;
}

type Mode = "guided" | "describe";

export function RequestTemplateSheet({ open, onOpenChange, defaultPurpose = "", defaultCourse = "", contextLabel, onSubmitted }: Props) {
  const request = useSandboxStore((s) => s.request);
  const [mode, setMode] = useState<Mode>("guided");
  const [form, setForm] = useState({
    purpose: defaultPurpose,
    os: "Ubuntu 22.04",
    osOther: "",
    vcpu: 2,
    ramGB: 4,
    diskGB: 40,
    region: "ap-south-1",
    targetCourse: defaultCourse,
    notes: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...f, purpose: defaultPurpose || f.purpose, targetCourse: defaultCourse || f.targetCourse }));
    }
  }, [open, defaultPurpose, defaultCourse]);

  const submit = () => {
    if (!form.purpose.trim()) {
      toast({ title: "Template name required", variant: "destructive" });
      return;
    }
    if (mode === "describe" && !form.description.trim()) {
      toast({ title: "Please describe what you need", variant: "destructive" });
      return;
    }
    const isOther = form.os === "Other";
    const payload =
      mode === "describe"
        ? {
            purpose: form.purpose,
            os: "Not specified",
            vcpu: 0,
            ramGB: 0,
            diskGB: 0,
            region: form.region,
            targetCourse: form.targetCourse,
            notes: `[Free-form request — admin to recommend specs]\n\n${form.description}`,
          }
        : {
            purpose: form.purpose,
            os: isOther ? `Other (${form.osOther || "see notes"})` : form.os,
            vcpu: form.vcpu,
            ramGB: form.ramGB,
            diskGB: form.diskGB,
            region: form.region,
            targetCourse: form.targetCourse,
            notes: isOther && form.osOther ? `OS: ${form.osOther}\n\n${form.notes}` : form.notes,
          };
    const id = request({
      ...payload,
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
      <SheetContent className="w-[520px] sm:max-w-[520px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Request a lab template
          </SheetTitle>
          <SheetDescription className="text-xs">
            {contextLabel ? `For: ${contextLabel}. ` : ""}
            Admin will provision a sandbox VM so you can configure it. Once you submit it for snapshot, the CloudAdda team publishes it as a reusable lab template.
          </SheetDescription>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setMode("guided")}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              mode === "guided" ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
            )}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Settings2 className="h-3.5 w-3.5" /> I know what I need
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Pick OS, CPU, RAM, disk yourself.</p>
          </button>
          <button
            type="button"
            onClick={() => setMode("describe")}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors",
              mode === "describe" ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
            )}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <HelpCircle className="h-3.5 w-3.5" /> Not sure — just describe it
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Admin will recommend the right specs.</p>
          </button>
        </div>

        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-xs">Template name / purpose</Label>
            <Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. AWS S3 self-paced lab" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Target course (optional)</Label>
            <Input value={form.targetCourse} onChange={(e) => setForm({ ...form, targetCourse: e.target.value })} placeholder="e.g. AWS S3 Deep Dive" className="mt-1" />
          </div>

          {mode === "describe" ? (
            <div>
              <Label className="text-xs">Describe what you need</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={8}
                className="mt-1 text-xs"
                placeholder={"e.g. I want a Linux machine for students to practice Python data science with Jupyter, pandas, and a few sample datasets. Not sure how much RAM is needed — please suggest."}
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">Mention the tools, OS preference (if any), and roughly how heavy the workload is.</p>
            </div>
          ) : (
            <>
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

              {form.os === "Other" && (
                <div>
                  <Label className="text-xs">Specify OS</Label>
                  <Input
                    value={form.osOther}
                    onChange={(e) => setForm({ ...form, osOther: e.target.value })}
                    placeholder="e.g. Debian 12, Rocky Linux 9, Kali Linux"
                    className="mt-1"
                  />
                </div>
              )}

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
            </>
          )}
        </div>

        <SheetFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Submit request</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
