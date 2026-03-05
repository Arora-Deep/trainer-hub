import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Eye } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  approved: "bg-success/10 text-success",
  denied: "bg-destructive/10 text-destructive",
};

export default function BatchRequests() {
  const { tenantRequests } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Customer requests for batches and resources</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantRequests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-sm font-medium">{r.tenant}</TableCell>
                  <TableCell className="text-sm max-w-[250px] truncate">{r.details}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.type.replace(/_/g, " ")}</TableCell>
                  <TableCell className="text-sm">{r.requestedBy}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[r.status]}`}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" className="gap-1 text-xs text-success"><Check className="h-3 w-3" /> Approve</Button>
                          <Button variant="outline" size="sm" className="gap-1 text-xs text-destructive"><X className="h-3 w-3" /> Reject</Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
