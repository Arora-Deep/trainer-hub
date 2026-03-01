import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const roles = [
  { name: "Super Admin", users: 2, permissions: "Full access to all features", color: "bg-destructive/10 text-destructive" },
  { name: "Ops Admin", users: 4, permissions: "Infra, provisioning, tenants, monitoring", color: "bg-primary/10 text-primary" },
  { name: "Support Agent", users: 6, permissions: "Tickets, basic tenant lookup", color: "bg-info/10 text-info" },
  { name: "Finance Admin", users: 2, permissions: "Billing, invoices, payments, credits", color: "bg-warning/10 text-warning" },
  { name: "Sales Admin", users: 3, permissions: "Tenant creation, plan assignment", color: "bg-success/10 text-success" },
  { name: "Read-only Auditor", users: 1, permissions: "View-only everything + exports", color: "bg-muted text-muted-foreground" },
];

const users = [
  { name: "Rahul Verma", email: "rahul@cloudadda.com", role: "Super Admin", lastLogin: "2 min ago", mfa: true },
  { name: "Sneha Gupta", email: "sneha@cloudadda.com", role: "Ops Admin", lastLogin: "15 min ago", mfa: true },
  { name: "Arun Kumar", email: "arun@cloudadda.com", role: "Support Agent", lastLogin: "1 hour ago", mfa: true },
  { name: "Meera Patel", email: "meera@cloudadda.com", role: "Finance Admin", lastLogin: "3 hours ago", mfa: false },
  { name: "Vikram Singh", email: "vikram@cloudadda.com", role: "Sales Admin", lastLogin: "1 day ago", mfa: true },
];

export default function StaffRBAC() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Staff RBAC</h1><p className="text-muted-foreground text-sm mt-1">Role-based access control</p></div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {roles.map(r => (
          <Card key={r.name}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="secondary" className={`text-[10px] ${r.color}`}>{r.name}</Badge>
                <span className="text-xs text-muted-foreground">{r.users} users</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{r.permissions}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm">Staff Users</CardTitle><Button size="sm" className="text-xs">Invite User</Button></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead className="text-xs">Name</TableHead><TableHead className="text-xs">Email</TableHead><TableHead className="text-xs">Role</TableHead><TableHead className="text-xs">Last Login</TableHead><TableHead className="text-xs text-center">MFA</TableHead></TableRow></TableHeader>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.email}><TableCell className="text-sm font-medium">{u.name}</TableCell><TableCell className="text-xs">{u.email}</TableCell><TableCell className="text-xs">{u.role}</TableCell><TableCell className="text-xs text-muted-foreground">{u.lastLogin}</TableCell><TableCell className="text-center">{u.mfa ? <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">ON</Badge> : <Badge variant="secondary" className="text-[9px]">OFF</Badge>}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
