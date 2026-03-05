import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Building2, Download, Eye, Server, Pause, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  trial: "bg-warning/10 text-warning",
  suspended: "bg-destructive/10 text-destructive",
  expired: "bg-muted text-muted-foreground",
};

export default function AdminCustomers() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = customers.filter(c => {
    if (filter === "active" && c.status !== "active") return false;
    if (filter === "trial" && c.status !== "trial") return false;
    if (filter === "overdue" && c.overdueAmount <= 0) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer List</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage training company clients</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-sm"><Download className="h-4 w-4" /> Export CSV</Button>
          <Button onClick={() => navigate("/admin/customers/create")} className="gap-2"><Plus className="h-4 w-4" /> Add Customer</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="overdue">Overdue Billing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Active Batches</TableHead>
                <TableHead className="text-right">Running Labs</TableHead>
                <TableHead className="text-right">Usage (Month)</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.contactPerson}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{c.domain}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{c.activeBatches}</TableCell>
                  <TableCell className="text-right text-sm">{c.currentUsage.liveLabs}</TableCell>
                  <TableCell className="text-right text-sm font-medium">${c.monthlyUsage.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-destructive">{c.overdueAmount > 0 ? `$${c.overdueAmount.toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate(`/admin/customers/${c.id}`)}><Eye className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-xs"><Server className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-xs"><Pause className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-xs"><DollarSign className="h-3 w-3" /></Button>
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
