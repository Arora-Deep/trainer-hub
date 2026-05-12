import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useCustomerStore } from "@/stores/customerStore";
import { Bell, CheckCircle, Plus, Download, Search, FileText, ExternalLink, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusColors: Record<string, string> = {
  paid: "bg-success/10 text-success",
  due: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
  draft: "bg-muted text-muted-foreground",
  cancelled: "bg-muted text-muted-foreground",
};

// ERPNext / Frappe-style invoice extras
interface ErpExtras {
  series: string;          // INV-2026-
  poNumber: string;        // Customer PO
  costCenter: string;      // ERPNext cost center
  project: string;         // Project link
  taxTemplate: string;     // GST / VAT
  paymentTerms: string;    // Net 30, Net 15, etc.
  currency: string;
  exchangeRate: number;
  hsnSac: string;          // HSN/SAC code
  placeOfSupply: string;
  isExport: boolean;
}

export default function AdminInvoices() {
  const { invoices } = useCustomerStore();
  const [selected, setSelected] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => invoices.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (search && !inv.id.toLowerCase().includes(search.toLowerCase()) && !inv.tenant.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [invoices, search, statusFilter]);

  const totals = {
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
    due: invoices.filter((i) => i.status === "due").reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0),
  };

  const exportToErp = () => {
    toast({ title: "Sync to ERPNext queued", description: `${filtered.length} invoices` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground text-sm mt-1">ERPNext-style invoice ledger with GST, cost centers, and PO tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5" onClick={exportToErp}><ExternalLink className="h-4 w-4" /> Sync to ERPNext</Button>
          <Button className="gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="space-y-1"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-2xl font-bold text-success">${totals.paid.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="space-y-1"><p className="text-xs text-muted-foreground">Outstanding</p><p className="text-2xl font-bold text-warning">${totals.due.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="space-y-1"><p className="text-xs text-muted-foreground">Overdue</p><p className="text-2xl font-bold text-destructive">${totals.overdue.toLocaleString()}</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="space-y-1"><p className="text-xs text-muted-foreground">Total Invoices</p><p className="text-2xl font-bold">{invoices.length}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search invoice or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="due">Due</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>PO #</TableHead>
                <TableHead>GST/HSN</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => (
                <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(inv)}>
                  <TableCell className="text-sm font-mono">{inv.id}</TableCell>
                  <TableCell className="text-sm">{inv.tenant}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">PO-{inv.id.slice(-4)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">998314 / 18%</TableCell>
                  <TableCell className="text-sm text-right font-medium">${inv.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[inv.status]}`}>{inv.status}</Badge></TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      {(inv.status === "due" || inv.status === "overdue") && (
                        <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toast({ title: "Reminder Sent" })}><Bell className="h-3 w-3" /></Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Downloading PDF..." })}><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice Detail */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent side="full" className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono flex items-center gap-2"><FileText className="h-4 w-4" /> {selected.id}</SheetTitle>
                <SheetDescription>{selected.tenant} · {selected.dueDate}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-4 max-w-3xl">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Series", "INV-2026-"],
                    ["PO Number", `PO-${selected.id.slice(-4)}`],
                    ["Cost Center", "Main - CloudAdda"],
                    ["Project", selected.tenant],
                    ["Tax Template", "Output GST 18%"],
                    ["Payment Terms", "Net 30"],
                    ["Currency", "USD"],
                    ["Place of Supply", "Maharashtra (27)"],
                    ["HSN/SAC", "998314 (IT services)"],
                    ["Export Invoice", "No"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between p-2 rounded border">
                      <span className="text-muted-foreground text-xs">{k}</span>
                      <span className="font-medium text-xs">{v}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-2">Line Items</h3>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Total</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      <TableRow><TableCell className="text-sm">VM Hours (2 vCPU/4GB)</TableCell><TableCell className="text-right text-sm">3,200</TableCell><TableCell className="text-right text-sm">$0.18</TableCell><TableCell className="text-right text-sm">${(3200 * 0.18).toFixed(2)}</TableCell></TableRow>
                      <TableRow><TableCell className="text-sm">GPU Hours (T4)</TableCell><TableCell className="text-right text-sm">120</TableCell><TableCell className="text-right text-sm">$1.40</TableCell><TableCell className="text-right text-sm">${(120 * 1.4).toFixed(2)}</TableCell></TableRow>
                      <TableRow><TableCell className="text-sm">Storage (GB-month)</TableCell><TableCell className="text-right text-sm">450</TableCell><TableCell className="text-right text-sm">$0.10</TableCell><TableCell className="text-right text-sm">${(450 * 0.10).toFixed(2)}</TableCell></TableRow>
                    </TableBody>
                  </Table>
                </div>
                <Separator />
                <div className="space-y-1 ml-auto max-w-xs text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${(selected.amount / 1.18).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST 18%</span><span>${(selected.amount - selected.amount / 1.18).toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold pt-1 border-t"><span>Total</span><span>${selected.amount.toFixed(2)}</span></div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline" className="gap-1.5"><Download className="h-3 w-3" /> Download PDF</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><Send className="h-3 w-3" /> Email Customer</Button>
                  <Button size="sm" variant="outline" className="gap-1.5"><ExternalLink className="h-3 w-3" /> Open in ERPNext</Button>
                  {selected.status !== "paid" && <Button size="sm" className="gap-1.5"><CheckCircle className="h-3 w-3" /> Mark Paid</Button>}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Invoice Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
            <DialogDescription>ERPNext-compatible fields (synced via API)</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs">Customer</Label><Input placeholder="DevOps Academy" /></div>
            <div className="space-y-1.5"><Label className="text-xs">PO Number</Label><Input placeholder="PO-2026-0123" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Cost Center</Label><Input defaultValue="Main - CloudAdda" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Project</Label><Input placeholder="Project link" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Tax Template</Label><Select defaultValue="gst18"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="gst18">Output GST 18%</SelectItem><SelectItem value="gst5">Output GST 5%</SelectItem><SelectItem value="export">Export (Zero rated)</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Payment Terms</Label><Select defaultValue="net30"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="net15">Net 15</SelectItem><SelectItem value="net30">Net 30</SelectItem><SelectItem value="net45">Net 45</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Currency</Label><Select defaultValue="USD"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD</SelectItem><SelectItem value="INR">INR</SelectItem><SelectItem value="EUR">EUR</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label className="text-xs">Due Date</Label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { setCreateOpen(false); toast({ title: "Invoice Drafted", description: "Synced to ERPNext as draft" }); }}>Create & Sync</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
