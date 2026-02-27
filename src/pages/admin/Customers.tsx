import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerStore } from "@/stores/customerStore";

const statusColors = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  trial: "bg-warning/10 text-warning",
};

const planColors = {
  starter: "bg-muted text-muted-foreground",
  professional: "bg-primary/10 text-primary",
  enterprise: "bg-info/10 text-info",
};

export default function AdminCustomers() {
  const navigate = useNavigate();
  const { customers } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage training company clients</p>
        </div>
        <Button onClick={() => navigate("/admin/customers/create")} className="gap-2">
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers..." className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Batches</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Active VMs</TableHead>
                <TableHead className="text-right">Monthly Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/customers/${c.id}`)}>
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
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${planColors[c.plan]}`}>{c.plan}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="text-right text-sm">{c.activeBatches}</TableCell>
                  <TableCell className="text-right text-sm">{c.totalStudents}</TableCell>
                  <TableCell className="text-right text-sm">{c.activeVMs}</TableCell>
                  <TableCell className="text-right text-sm font-medium">${c.monthlyUsage.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
