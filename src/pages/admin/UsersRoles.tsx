import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, UserCog } from "lucide-react";

const users = [
  { id: "1", name: "Admin User", email: "admin@cloudadda.com", role: "Super Admin", status: "active", lastLogin: "Just now" },
  { id: "2", name: "Ops Manager", email: "ops@cloudadda.com", role: "Operations", status: "active", lastLogin: "2h ago" },
  { id: "3", name: "Support Agent", email: "support@cloudadda.com", role: "Support", status: "active", lastLogin: "1d ago" },
  { id: "4", name: "Billing Admin", email: "billing@cloudadda.com", role: "Billing", status: "active", lastLogin: "3h ago" },
  { id: "5", name: "Dev Ops", email: "devops@cloudadda.com", role: "Operations", status: "inactive", lastLogin: "2w ago" },
];

const roleColors: Record<string, string> = {
  "Super Admin": "bg-destructive/10 text-destructive",
  Operations: "bg-primary/10 text-primary",
  Support: "bg-success/10 text-success",
  Billing: "bg-warning/10 text-warning",
};

export default function AdminUsersRoles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users & Roles</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage internal CloudAdda team members</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8"><AvatarFallback className="text-xs bg-muted">{u.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs ${roleColors[u.role] || "bg-muted text-muted-foreground"}`}>{u.role}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs ${u.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{u.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm"><UserCog className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
