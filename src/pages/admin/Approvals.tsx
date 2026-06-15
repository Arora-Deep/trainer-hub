import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBatchStore } from "@/stores/batchStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Static, legacy provisioning requests (kept for context — VM/Template/Upgrade requests)
const staticApprovals = [
  { id: "1", customer: "TechSkills Academy", requestedBy: "Rajesh Kumar", type: "VM Provisioning", details: "10x Ubuntu 22.04 (2 vCPU, 4GB RAM)", region: "ap-south-1", requested: "2h ago", status: "pending" },
  { id: "2", customer: "CodeCraft Institute", requestedBy: "Priya Sharma", type: "Template Clone", details: "Kubernetes Cluster Setup template", region: "us-east-1", requested: "5h ago", status: "pending" },
  { id: "4", customer: "CloudLearn Pro", requestedBy: "Mike Chen", type: "Resource Upgrade", details: "Increase RAM from 4GB to 8GB on 15 VMs", region: "eu-west-1", requested: "2d ago", status: "approved" },
];

export default function AdminApprovals() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { batches, updateBatch } = useBatchStore();
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  // Batches awaiting approval (drafts created by trainers + explicitly pending)
  const pendingBatches = batches.filter(
    (b) => (b.status === "draft" || b.status === "pending_approval") && !rejectedIds.has(b.id)
  );

  const handleApprove = (id: string, name: string) => {
    updateBatch(id, { status: "upcoming" });
    toast({ title: "Batch Approved", description: `${name} is now active and ready for provisioning.` });
  };

  const handleReject = (id: string, name: string) => {
    setRejectedIds((prev) => new Set(prev).add(id));
    toast({ title: "Batch Rejected", description: `${name} returned to the trainer for revisions.` });
  };

  const pendingCount = pendingBatches.length + staticApprovals.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review draft batches and pending provisioning requests</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-5 w-5 text-warning" /><div><p className="text-2xl font-bold">{pendingCount}</p><p className="text-sm text-muted-foreground">Pending</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">24</p><p className="text-sm text-muted-foreground">Approved this month</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><XCircle className="h-5 w-5 text-destructive" /><div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Rejected this month</p></div></CardContent></Card>
      </div>

      {/* Draft / Pending Batches Section */}
      {pendingBatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">Draft Batches Awaiting Approval ({pendingBatches.length})</h2>
          </div>
          {pendingBatches.map((b) => (
            <Card key={b.id} className="border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{b.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-700 capitalize">
                        {b.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Trainer: <span className="text-foreground">{b.instructors[0] || "—"}</span></span>
                      <span>Seats: <span className="text-foreground">{b.seatCount}</span></span>
                      <span>Medium: <span className="text-foreground capitalize">{b.medium}</span></span>
                      <span>Created: <span className="text-foreground">{b.createdAt}</span></span>
                      {b.vmConfig && <span>VMs: <span className="text-foreground">{b.vmConfig.vmEntries?.length || 0}</span></span>}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/batches/${b.id}`)}>
                      <FileText className="mr-1.5 h-3.5 w-3.5" /> Review
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleReject(b.id, b.name)}>Reject</Button>
                    <Button size="sm" onClick={() => handleApprove(b.id, b.name)}>
                      <Send className="mr-1.5 h-3.5 w-3.5" /> Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Legacy Provisioning Requests */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Provisioning Requests</h2>
        {staticApprovals.map((a) => (
          <Card key={a.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{a.type}</h3>
                    <Badge variant="secondary" className={`text-xs ${a.status === "pending" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{a.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.details}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Customer: <span className="text-foreground">{a.customer}</span></span>
                    <span>By: {a.requestedBy}</span>
                    <span>Region: {a.region}</span>
                    <span>{a.requested}</span>
                  </div>
                </div>
                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => toast({ title: "Request rejected" })}>Reject</Button>
                    <Button size="sm" onClick={() => toast({ title: "Request approved" })}>Approve</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
