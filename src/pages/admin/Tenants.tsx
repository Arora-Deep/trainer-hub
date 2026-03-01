import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, Building2, MoreHorizontal, Eye, UserCheck, Receipt, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerStore, type Tenant } from "@/stores/customerStore";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  suspended: "bg-destructive/10 text-destructive",
  trial: "bg-warning/10 text-warning",
  expired: "bg-muted text-muted-foreground",
};

const planColors: Record<string, string> = {
  starter: "bg-muted text-muted-foreground",
  professional: "bg-primary/10 text-primary",
  enterprise: "bg-info/10 text-info",
};

export default function AdminTenants() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (planFilter !== "all" && c.plan !== planFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenant Directory</h1>
          <p className="text-muted-foreground text-sm mt-1">{customers.length} tenants registered</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
          <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Add Tenant</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tenants..." className="pl-9 h-9 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Plan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Tenant</TableHead>
                <TableHead className="text-xs">Plan</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Region(s)</TableHead>
                <TableHead className="text-xs text-right">Usage</TableHead>
                <TableHead className="text-xs text-center">Health</TableHead>
                <TableHead className="text-xs text-right">Tickets</TableHead>
                <TableHead className="text-xs text-right">Overdue</TableHead>
                <TableHead className="text-xs">Last Active</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/tenants/${c.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.contactPerson}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${planColors[c.plan]}`}>{c.plan}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="text-xs">{c.regions.join(", ")}</TableCell>
                  <TableCell className="text-right text-xs">{c.currentUsage.liveLabs} labs / {c.currentUsage.activeSeats} seats</TableCell>
                  <TableCell className="text-center">
                    <HealthBadge score={c.healthScore} />
                  </TableCell>
                  <TableCell className="text-right text-xs">{c.openTickets}</TableCell>
                  <TableCell className="text-right text-xs">{c.overdueAmount > 0 ? <span className="text-destructive font-medium">₹{c.overdueAmount.toLocaleString()}</span> : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.lastActivity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer" onClick={e => { e.stopPropagation(); navigate(`/admin/tenants/${c.id}`); }}>
                          <Eye className="h-3.5 w-3.5" /> View Tenant
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><UserCheck className="h-3.5 w-3.5" /> Impersonate</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Receipt className="h-3.5 w-3.5" /> View Invoices</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

function HealthBadge({ score }: { score: number }) {
  const color = score >= 80 ? "bg-success/10 text-success" : score >= 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive";
  return <Badge variant="secondary" className={`text-[10px] font-mono ${color}`}>{score}</Badge>;
}
