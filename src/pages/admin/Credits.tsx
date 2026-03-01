import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus } from "lucide-react";

const credits = [
  { id: "CR-001", tenant: "DataScience Bootcamp", amount: 5000, reason: "GPU provisioning failures", status: "pending_approval", requestedBy: "Finance Team", date: "2026-02-28" },
  { id: "CR-002", tenant: "DevOps Academy", amount: 2000, reason: "Goodwill credit — renewal incentive", status: "approved", requestedBy: "Sales Team", date: "2026-02-25" },
  { id: "CR-003", tenant: "SkillBridge Labs", amount: 1500, reason: "Network downtime compensation", status: "approved", requestedBy: "Support", date: "2026-02-20" },
];

export default function Credits() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Credits & Adjustments</h1><p className="text-muted-foreground text-sm mt-1">Credit management</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Issue Credit</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">ID</TableHead><TableHead className="text-xs">Tenant</TableHead>
            <TableHead className="text-xs text-right">Amount</TableHead><TableHead className="text-xs">Reason</TableHead>
            <TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">By</TableHead><TableHead className="text-xs">Date</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {credits.map(c => (
              <TableRow key={c.id}>
                <TableCell className="text-xs font-mono">{c.id}</TableCell><TableCell className="text-sm">{c.tenant}</TableCell>
                <TableCell className="text-sm font-medium text-right">₹{c.amount.toLocaleString()}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{c.reason}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${c.status === "approved" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{c.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-xs">{c.requestedBy}</TableCell><TableCell className="text-xs text-muted-foreground">{c.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
