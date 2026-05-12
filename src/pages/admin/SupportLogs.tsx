import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LogEntry {
  id: string;
  action: string;
  category: "vm" | "ticket" | "billing" | "auth" | "lab";
  customer: string;
  vm: string;
  operator: string;
  time: string;
  date: string;
  outcome: "success" | "failed";
}

const logs: LogEntry[] = [
  { id: "L-1", action: "Reset VM credentials", category: "vm", customer: "DevOps Academy", vm: "VM-2001", operator: "Ravi M.", time: "10 min ago", date: "2026-05-12", outcome: "success" },
  { id: "L-2", action: "Restarted VM", category: "vm", customer: "Corporate L&D Co", vm: "VM-2003", operator: "Infra Ops", time: "30 min ago", date: "2026-05-12", outcome: "success" },
  { id: "L-3", action: "Replaced VM", category: "vm", customer: "DataScience Bootcamp", vm: "VM-2005", operator: "Ravi M.", time: "1 hour ago", date: "2026-05-12", outcome: "success" },
  { id: "L-4", action: "Resolved ticket TKT-2002", category: "ticket", customer: "SkillBridge Labs", vm: "—", operator: "Ravi M.", time: "2 hours ago", date: "2026-05-12", outcome: "success" },
  { id: "L-5", action: "Escalated ticket TKT-2001", category: "ticket", customer: "DataScience Bootcamp", vm: "—", operator: "Support", time: "3 hours ago", date: "2026-05-12", outcome: "success" },
  { id: "L-6", action: "Reset lab environment", category: "lab", customer: "DevOps Academy", vm: "VM-2002", operator: "Infra Ops", time: "4 hours ago", date: "2026-05-12", outcome: "success" },
  { id: "L-7", action: "Issued credit note ₹5,000", category: "billing", customer: "NexGen Academy", vm: "—", operator: "Finance Team", time: "1 day ago", date: "2026-05-11", outcome: "success" },
  { id: "L-8", action: "Force-unlock account", category: "auth", customer: "CloudLearn Pro", vm: "—", operator: "Super Admin", time: "2 days ago", date: "2026-05-10", outcome: "failed" },
];

const catColors: Record<string, string> = {
  vm: "bg-primary/10 text-primary",
  ticket: "bg-info/10 text-info",
  billing: "bg-warning/10 text-warning",
  auth: "bg-destructive/10 text-destructive",
  lab: "bg-success/10 text-success",
};

export default function SupportLogs() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [operator, setOperator] = useState("all");
  const [outcome, setOutcome] = useState("all");
  const [date, setDate] = useState("all");

  const customers = useMemo(() => [...new Set(logs.map((l) => l.customer))], []);
  const operators = useMemo(() => [...new Set(logs.map((l) => l.operator))], []);

  const filtered = logs.filter((l) => {
    if (category !== "all" && l.category !== category) return false;
    if (customer !== "all" && l.customer !== customer) return false;
    if (operator !== "all" && l.operator !== operator) return false;
    if (outcome !== "all" && l.outcome !== outcome) return false;
    if (date !== "all" && l.date !== date) return false;
    if (search && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.vm.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const rows = [["Action", "Category", "Customer", "VM", "Operator", "Time", "Outcome"]];
    filtered.forEach((l) => rows.push([l.action, l.category, l.customer, l.vm, l.operator, l.time, l.outcome]));
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "support-logs.csv"; a.click();
    toast({ title: "Exported", description: `${filtered.length} rows` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">Audit trail of every support and ops action</p>
        </div>
        <Button variant="outline" className="gap-1.5" onClick={exportCSV}><Download className="h-4 w-4" /> Export CSV</Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search action or VM..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="vm">VM</SelectItem>
              <SelectItem value="ticket">Ticket</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="auth">Auth</SelectItem>
              <SelectItem value="lab">Lab</SelectItem>
            </SelectContent>
          </Select>
          <Select value={customer} onValueChange={setCustomer}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Customer" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              {customers.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={operator} onValueChange={setOperator}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Operator" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operators</SelectItem>
              {operators.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={outcome} onValueChange={setOutcome}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Outcome" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={date === "all" ? "" : date} onChange={(e) => setDate(e.target.value || "all")} className="w-[150px] h-9" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>VM</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-sm text-muted-foreground">No logs match your filters</TableCell></TableRow>
              ) : filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="text-sm font-medium">{l.action}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${catColors[l.category]}`}>{l.category}</Badge></TableCell>
                  <TableCell className="text-sm">{l.customer}</TableCell>
                  <TableCell className="text-sm font-mono">{l.vm}</TableCell>
                  <TableCell className="text-sm">{l.operator}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${l.outcome === "success" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{l.outcome}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
