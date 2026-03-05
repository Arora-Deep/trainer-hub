import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Ban } from "lucide-react";

const users = [
  { name: "Super Admin", email: "admin@cloudadda.com", role: "Admin", lastLogin: "5 min ago", status: "active" },
  { name: "Ravi M.", email: "ravi@cloudadda.com", role: "Support", lastLogin: "30 min ago", status: "active" },
  { name: "Finance Team", email: "finance@cloudadda.com", role: "Billing", lastLogin: "2 hours ago", status: "active" },
  { name: "Infra Ops", email: "infra@cloudadda.com", role: "Infra", lastLogin: "1 hour ago", status: "active" },
  { name: "Old Admin", email: "old@cloudadda.com", role: "Admin", lastLogin: "3 months ago", status: "disabled" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  disabled: "bg-muted text-muted-foreground",
};

export default function PlatformUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Users</h1>
        <p className="text-muted-foreground text-sm mt-1">CloudAdda admin users</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{u.role}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[u.status]}`}>{u.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm"><Ban className="h-3 w-3" /></Button>
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
