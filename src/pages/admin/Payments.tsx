import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, ExternalLink, Receipt } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Payment {
  id: string;
  customer: string;
  amount: number;
  method: "Bank Transfer" | "Wire Transfer" | "Credit Card" | "UPI" | "Cheque";
  reference: string;
  date: string;
  invoiceId: string;
  status: "received" | "pending" | "failed";
}

const initial: Payment[] = [
  { id: "PE-001", customer: "DevOps Academy", amount: 45000, method: "Bank Transfer", reference: "NEFT8901", date: "2026-02-28", invoiceId: "INV-2002", status: "received" },
  { id: "PE-002", customer: "Corporate L&D Co", amount: 72000, method: "Wire Transfer", reference: "SWFTAB123", date: "2026-02-01", invoiceId: "INV-2001", status: "received" },
  { id: "PE-003", customer: "DataScience Bootcamp", amount: 15000, method: "Credit Card", reference: "STR-pi_x12", date: "2026-01-15", invoiceId: "INV-2005", status: "received" },
  { id: "PE-004", customer: "CloudLearn Pro", amount: 800, method: "Credit Card", reference: "STR-pi_y43", date: "2026-02-20", invoiceId: "INV-2007", status: "received" },
  { id: "PE-005", customer: "SkillBridge Labs", amount: 8000, method: "Bank Transfer", reference: "NEFT7720", date: "2025-12-15", invoiceId: "INV-1998", status: "pending" },
];

export default function AdminPayments() {
  const [payments, setPayments] = useState(initial);
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => payments.filter((p) => {
    if (method !== "all" && p.method !== method) return false;
    if (status !== "all" && p.status !== status) return false;
    if (search && !p.customer.toLowerCase().includes(search.toLowerCase()) && !p.reference.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [payments, search, method, status]);

  const totals = {
    received: payments.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0),
    pending: payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">Payment Entries — auto-reconciled with ERPNext invoices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5"><ExternalLink className="h-4 w-4" /> Sync from ERPNext</Button>
          <Button className="gap-1.5" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Record Payment</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Received (YTD)</p><p className="text-2xl font-bold text-success">${totals.received.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Pending Reconciliation</p><p className="text-2xl font-bold text-warning">${totals.pending.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-xs text-muted-foreground">Total Entries</p><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search customer or ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="Cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entry</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-sm font-mono">{p.id}</TableCell>
                  <TableCell className="text-sm font-medium">{p.customer}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{p.invoiceId}</TableCell>
                  <TableCell className="text-xs font-mono">{p.reference}</TableCell>
                  <TableCell className="text-sm">{p.method}</TableCell>
                  <TableCell className="text-sm text-right font-medium">${p.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.date}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${p.status === "received" ? "bg-success/10 text-success" : p.status === "pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment Entry</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2"><Label className="text-xs">Customer</Label><Input placeholder="DevOps Academy" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Against Invoice</Label><Input placeholder="INV-2010" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Amount</Label><Input type="number" placeholder="0.00" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Method</Label><Select defaultValue="Bank Transfer"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="UPI">UPI</SelectItem><SelectItem value="Credit Card">Credit Card</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Reference No.</Label><Input placeholder="NEFT-..." /></div>
            <div className="space-y-1.5 col-span-2"><Label className="text-xs">Date</Label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => { setOpen(false); toast({ title: "Payment Recorded", description: "Synced to ERPNext" }); }}>Save & Sync</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
