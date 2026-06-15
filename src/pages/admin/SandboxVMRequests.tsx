import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useSandboxStore, type SandboxStatus } from "@/stores/sandboxVMStore";
import { useLabStore } from "@/stores/labStore";
import { useAuditStore } from "@/stores/auditStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Inbox, CheckCircle2, XCircle, Camera, ExternalLink, Sparkles } from "lucide-react";

const statusStyle: Record<SandboxStatus, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  provisioning: "bg-blue-500/10 text-blue-600",
  ready: "bg-violet-500/10 text-violet-600",
  validation: "bg-cyan-500/10 text-cyan-600",
  snapshot: "bg-indigo-500/10 text-indigo-600",
  published: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

export default function SandboxVMRequests() {
  const { items, approveProvision, reject, snapshotAndPublish, startValidation } = useSandboxStore();
  const { addTemplate } = useLabStore();
  const log = useAuditStore((s) => s.log);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [snapshotOpen, setSnapshotOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const selected = items.find((i) => i.id === selectedId);

  const counts = {
    requested: items.filter((i) => i.status === "requested").length,
    inProgress: items.filter((i) => ["provisioning", "ready", "validation"].includes(i.status)).length,
    published: items.filter((i) => i.status === "published").length,
  };

  const handleApprove = (id: string) => {
    approveProvision(id);
    log({ action: "sandbox_provision", target: id, reason: "Admin approved sandbox VM request" });
    toast({ title: "Provisioning", description: "Sandbox VM is being provisioned." });
  };

  const handleReject = () => {
    if (!selectedId || !rejectReason.trim()) return;
    reject(selectedId, rejectReason);
    log({ action: "sandbox_reject", target: selectedId, reason: rejectReason });
    toast({ title: "Rejected" });
    setRejectOpen(false);
    setRejectReason("");
  };

  const handlePublish = () => {
    if (!selected || !templateName.trim()) return;
    snapshotAndPublish(selected.id, templateName);
    // Create lab template
    addTemplate({
      name: templateName,
      description: `Self-paced template from sandbox ${selected.id} (${selected.trainerName})`,
      type: selected.os.startsWith("Windows") ? "Windows" : "Linux",
      os: selected.os.split(" ")[0],
      osVersion: selected.os.split(" ").slice(1).join(" ") || "latest",
      cloudProvider: "cloudadda",
      region: selected.region,
      vcpus: selected.vcpu,
      memory: selected.ramGB,
      storage: selected.diskGB,
      runtimeLimit: 120,
      category: "Self-Paced",
      tags: ["self-paced", "trainer-built"],
      policies: { internetAccess: true, clipboardAccess: true, fileUpload: true, fileDownload: true, sshAccess: true, rdpAccess: false },
      startupScript: "",
    });
    log({ action: "sandbox_publish", target: selected.id, reason: `Promoted to template: ${templateName}` });
    toast({ title: "Published", description: `Template "${templateName}" is now available to the trainer.` });
    setSnapshotOpen(false);
    setTemplateName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sandbox VM Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Provision sandbox VMs for trainers to configure self-paced lab templates.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10"><Inbox className="h-4 w-4 text-amber-600" /></div>
          <div><p className="text-xs text-muted-foreground">Pending Requests</p><p className="text-xl font-bold">{counts.requested}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10"><Sparkles className="h-4 w-4 text-blue-600" /></div>
          <div><p className="text-xs text-muted-foreground">In Progress</p><p className="text-xl font-bold">{counts.inProgress}</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10"><CheckCircle2 className="h-4 w-4 text-green-600" /></div>
          <div><p className="text-xs text-muted-foreground">Published Templates</p><p className="text-xl font-bold">{counts.published}</p></div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Pipeline</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Origin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id} className="cursor-pointer" onClick={() => setSelectedId(it.id)}>
                  <TableCell className="text-sm">
                    <div className="font-medium">{it.trainerName}</div>
                    <div className="text-[10px] text-muted-foreground">{it.trainerEmail}</div>
                  </TableCell>
                  <TableCell className="text-xs">{it.purpose}<div className="text-[10px] text-muted-foreground">{it.targetCourse}</div></TableCell>
                  <TableCell className="text-xs">{it.customerName || "—"}</TableCell>
                  <TableCell className="text-xs">{it.os} · {it.vcpu}vCPU/{it.ramGB}GB</TableCell>
                  <TableCell className="text-xs"><Badge variant="outline" className="text-[10px]">{it.origin === "trainer_request" ? "Request" : "Admin"}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-[10px]", statusStyle[it.status])}>{it.status}</Badge></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {it.status === "requested" && (
                      <div className="flex gap-1 justify-end">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setSelectedId(it.id); setRejectOpen(true); }}><XCircle className="h-3 w-3" /></Button>
                        <Button size="sm" className="text-xs h-7" onClick={() => handleApprove(it.id)}>Approve & Provision</Button>
                      </div>
                    )}
                    {it.status === "ready" && (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { startValidation(it.id); toast({ title: "Validation started" }); }}>
                        Start Validation
                      </Button>
                    )}
                    {(it.status === "validation" || it.status === "ready") && (
                      <Button size="sm" className="text-xs h-7 ml-1" onClick={() => { setSelectedId(it.id); setTemplateName(it.purpose); setSnapshotOpen(true); }}>
                        <Camera className="h-3 w-3 mr-1" /> Snapshot & Publish
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail drawer */}
      <Sheet open={!!selectedId && !rejectOpen && !snapshotOpen} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-[480px] sm:max-w-[480px]">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.trainerName}</SheetTitle>
                <SheetDescription className="text-xs">{selected.purpose}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-[10px] text-muted-foreground">Customer</Label><p>{selected.customerName || "—"}</p></div>
                  <div><Label className="text-[10px] text-muted-foreground">Course</Label><p>{selected.targetCourse || "—"}</p></div>
                  <div><Label className="text-[10px] text-muted-foreground">OS</Label><p>{selected.os}</p></div>
                  <div><Label className="text-[10px] text-muted-foreground">Region</Label><p>{selected.region}</p></div>
                  <div><Label className="text-[10px] text-muted-foreground">Specs</Label><p>{selected.vcpu} vCPU · {selected.ramGB} GB · {selected.diskGB} GB</p></div>
                  <div><Label className="text-[10px] text-muted-foreground">IP</Label><p className="font-mono">{selected.ipAddress || "—"}</p></div>
                </div>
                {selected.notes && (
                  <div><Label className="text-[10px] text-muted-foreground">Notes</Label><p className="text-xs">{selected.notes}</p></div>
                )}
                {selected.consoleUrl && (
                  <Button size="sm" variant="outline" className="text-xs gap-1.5 w-full" asChild>
                    <a href={selected.consoleUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Open Console</a>
                  </Button>
                )}
                <Separator />
                <div>
                  <Label className="text-[10px] text-muted-foreground">Status timeline</Label>
                  <div className="mt-2 space-y-1.5">
                    {selected.history.map((h, i) => (
                      <div key={i} className="flex gap-2 text-[11px] border-l-2 border-muted pl-2">
                        <Badge variant="outline" className="text-[9px] h-4">{h.status}</Badge>
                        <span className="text-muted-foreground">{new Date(h.ts).toLocaleString()}</span>
                        {h.note && <span className="italic">— {h.note}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject sandbox request</DialogTitle></DialogHeader>
          <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason for rejection" rows={3} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snapshot dialog */}
      <Dialog open={snapshotOpen} onOpenChange={setSnapshotOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Snapshot & promote to template</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Template name</Label>
              <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1" />
            </div>
            <p className="text-[11px] text-muted-foreground">A new self-paced lab template will be added to the trainer's library.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSnapshotOpen(false)}>Cancel</Button>
            <Button onClick={handlePublish}><Camera className="h-3.5 w-3.5 mr-1.5" /> Snapshot & Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
