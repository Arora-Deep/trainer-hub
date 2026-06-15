import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSandboxStore, type SandboxStatus } from "@/stores/sandboxVMStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Plus, ExternalLink, CheckCircle2, Sparkles } from "lucide-react";

const statusStyle: Record<SandboxStatus, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  provisioning: "bg-blue-500/10 text-blue-600",
  ready: "bg-violet-500/10 text-violet-600",
  validation: "bg-cyan-500/10 text-cyan-600",
  snapshot: "bg-indigo-500/10 text-indigo-600",
  published: "bg-green-500/10 text-green-600",
  rejected: "bg-red-500/10 text-red-600",
};

export default function SandboxVMs() {
  const navigate = useNavigate();
  const { items, markReady } = useSandboxStore();
  // Filter to current trainer (mock)
  const mine = items.filter((i) => i.trainerEmail === "john@techskills.com" || i.trainerName === "John Smith");

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> My Sandbox VMs</h1>
          <p className="text-muted-foreground text-sm mt-1">Configure VMs and turn them into self-paced lab templates.</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/request-sandbox-vm")}>
          <Plus className="h-3.5 w-3.5" /> Request Sandbox VM
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">All Sandbox VMs</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Purpose</TableHead>
              <TableHead>OS / Specs</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Template</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {mine.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="text-sm">
                    <div className="font-medium">{it.purpose}</div>
                    <div className="text-[10px] text-muted-foreground">{it.targetCourse}</div>
                  </TableCell>
                  <TableCell className="text-xs">{it.os}<div className="text-[10px] text-muted-foreground">{it.vcpu}vCPU · {it.ramGB}GB · {it.diskGB}GB</div></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{it.ipAddress || "—"}</TableCell>
                  <TableCell><Badge variant="secondary" className={cn("text-[10px]", statusStyle[it.status])}>{it.status}</Badge></TableCell>
                  <TableCell className="text-xs">{it.templateName ? <Badge variant="outline" className="text-[10px]">{it.templateName}</Badge> : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {it.consoleUrl && (it.status === "ready" || it.status === "provisioning" || it.status === "validation") && (
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1" asChild>
                          <a href={it.consoleUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /> Console</a>
                        </Button>
                      )}
                      {it.status === "provisioning" && (
                        <Button size="sm" className="text-xs h-7" onClick={() => { markReady(it.id); toast({ title: "Marked ready", description: "Admin will snapshot & publish." }); }}>
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Ready
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {mine.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">No sandbox VMs yet. Request one to build a self-paced template.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
