import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCustomerStore } from "@/stores/customerStore";
import { CheckCircle, X } from "lucide-react";

const typeColors: Record<string, string> = {
  quota_increase: "bg-primary/10 text-primary",
  credit_request: "bg-warning/10 text-warning",
  po_approval: "bg-info/10 text-info",
  template_publish: "bg-success/10 text-success",
};

const typeLabels: Record<string, string> = {
  quota_increase: "Quota Increase",
  credit_request: "Credit Request",
  po_approval: "PO Approval",
  template_publish: "Template Publish",
};

export default function TenantRequests() {
  const { tenantRequests } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tenant Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">{tenantRequests.filter(r => r.status === "pending").length} pending approvals</p>
      </div>
      <div className="space-y-4">
        {tenantRequests.map(req => (
          <Card key={req.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={`text-[10px] ${typeColors[req.type]}`}>{typeLabels[req.type]}</Badge>
                    <span className="text-xs text-muted-foreground">{req.id}</span>
                    <Badge variant="secondary" className={`text-[10px] capitalize ${req.status === "pending" ? "bg-warning/10 text-warning" : req.status === "approved" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{req.status}</Badge>
                  </div>
                  <p className="font-medium text-sm">{req.tenant}</p>
                  <p className="text-sm text-muted-foreground mt-1">{req.details}</p>
                  <p className="text-[11px] text-muted-foreground mt-2">Requested by {req.requestedBy} · {new Date(req.requestedAt).toLocaleString()}</p>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" className="gap-1.5 text-xs"><CheckCircle className="h-3.5 w-3.5" /> Approve</Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs text-destructive"><X className="h-3.5 w-3.5" /> Deny</Button>
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
