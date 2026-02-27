import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const approvals = [
  { id: "1", customer: "TechSkills Academy", requestedBy: "Rajesh Kumar", type: "VM Provisioning", details: "10x Ubuntu 22.04 (2 vCPU, 4GB RAM)", region: "ap-south-1", requested: "2h ago", status: "pending" },
  { id: "2", customer: "CodeCraft Institute", requestedBy: "Priya Sharma", type: "Template Clone", details: "Kubernetes Cluster Setup template", region: "us-east-1", requested: "5h ago", status: "pending" },
  { id: "3", customer: "SkillBridge Labs", requestedBy: "Amit Patel", type: "VM Provisioning", details: "5x Windows Server 2022 (4 vCPU, 8GB RAM)", region: "ap-south-1", requested: "1d ago", status: "pending" },
  { id: "4", customer: "CloudLearn Pro", requestedBy: "Mike Chen", type: "Resource Upgrade", details: "Increase RAM from 4GB to 8GB on 15 VMs", region: "eu-west-1", requested: "2d ago", status: "approved" },
];

export default function AdminApprovals() {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review pending provisioning requests</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="pt-6 flex items-center gap-3"><Clock className="h-5 w-5 text-warning" /><div><p className="text-2xl font-bold">3</p><p className="text-sm text-muted-foreground">Pending</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success" /><div><p className="text-2xl font-bold">24</p><p className="text-sm text-muted-foreground">Approved this month</p></div></CardContent></Card>
        <Card><CardContent className="pt-6 flex items-center gap-3"><XCircle className="h-5 w-5 text-destructive" /><div><p className="text-2xl font-bold">2</p><p className="text-sm text-muted-foreground">Rejected this month</p></div></CardContent></Card>
      </div>

      <div className="space-y-3">
        {approvals.map((a) => (
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
