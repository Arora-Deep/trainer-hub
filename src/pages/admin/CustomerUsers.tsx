import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { name: "Rajesh Kumar", company: "DevOps Academy", role: "Admin", lastLogin: "2 min ago", status: "active" },
  { name: "Priya Sharma", company: "DataScience Bootcamp", role: "Admin", lastLogin: "15 min ago", status: "active" },
  { name: "Mike Chen", company: "Corporate L&D Co", role: "Manager", lastLogin: "5 min ago", status: "active" },
  { name: "Sarah Wilson", company: "CloudLearn Pro", role: "Admin", lastLogin: "1 hour ago", status: "active" },
  { name: "Amit Patel", company: "SkillBridge Labs", role: "Admin", lastLogin: "30 min ago", status: "active" },
  { name: "Lisa Park", company: "NexGen Academy", role: "Admin", lastLogin: "2 weeks ago", status: "suspended" },
];

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  suspended: "bg-destructive/10 text-destructive",
};

export default function CustomerUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Users from training companies</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm">{u.company}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{u.role}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastLogin}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-xs capitalize ${statusColors[u.status]}`}>{u.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
