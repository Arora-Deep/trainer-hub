import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const requests = [
  { id: "R-001", customer: "DevOps Academy", type: "Extend Batch", batch: "K8s Batch #14", requestedBy: "Admin (John)", status: "pending", details: "Extend batch by 2 weeks for additional training modules", date: "2026-03-05" },
  { id: "R-002", customer: "Corporate L&D Co", type: "Increase Seats", batch: "Linux Fund. #8", requestedBy: "Manager (Lisa)", status: "pending", details: "Add 10 more seats — new hires joining", date: "2026-03-04" },
  { id: "R-003", customer: "DataScience Bootcamp", type: "Reset Lab", batch: "ML Cohort #5", requestedBy: "Student (Eva)", status: "approved", details: "Student broke the ML environment, needs fresh reset", date: "2026-03-03" },
  { id: "R-004", customer: "SkillBridge Labs", type: "Extra VM", batch: "Terraform Batch #2", requestedBy: "Trainer (Mike)", status: "rejected", details: "Requested GPU VM for ML demo — not part of batch scope", date: "2026-03-02" },
  { id: "R-005", customer: "DevOps Academy", type: "Extend Batch", batch: "AWS Batch #6", requestedBy: "Admin (John)", status: "pending", details: "Need 1 extra week for certification prep", date: "2026-03-06" },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-500/10", text: "text-amber-600" },
  approved: { bg: "bg-green-500/10", text: "text-green-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
};

const typeConfig: Record<string, string> = {
  "Extend Batch": "bg-blue-500/10 text-blue-600",
  "Increase Seats": "bg-purple-500/10 text-purple-600",
  "Reset Lab": "bg-amber-500/10 text-amber-600",
  "Extra VM": "bg-teal-500/10 text-teal-600",
};

export default function BatchRequests() {
  const [selected, setSelected] = useState<typeof requests[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Batch Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">Customer requests for batch modifications and resources</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(r => {
                const sc = statusConfig[r.status];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="text-sm font-medium">{r.customer}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", typeConfig[r.type])}>{r.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.batch}</TableCell>
                    <TableCell className="text-sm">{r.requestedBy}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs capitalize", sc.bg, sc.text)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {r.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm" className="gap-1 text-xs text-green-600"><Check className="h-3 w-3" /> Approve</Button>
                            <Button variant="outline" size="sm" className="gap-1 text-xs text-red-600"><X className="h-3 w-3" /> Reject</Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}><Eye className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Request Details</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="font-medium">{selected.customer}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Request Type</span><Badge variant="secondary" className={cn("text-xs", typeConfig[selected.type])}>{selected.type}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Batch</span><span className="font-medium">{selected.batch}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Requested By</span><span className="font-medium">{selected.requestedBy}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{selected.date}</span></div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Details</p>
                  <p className="text-sm">{selected.details}</p>
                </div>
                {selected.status === "pending" && (
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-1"><Check className="h-4 w-4" /> Approve</Button>
                    <Button variant="outline" className="flex-1 gap-1 text-red-600"><X className="h-4 w-4" /> Reject</Button>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
