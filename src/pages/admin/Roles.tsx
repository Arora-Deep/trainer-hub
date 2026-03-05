import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roles = ["Admin", "Support", "Billing", "Infra"];
const permissions = ["Create Customer", "Modify Batch", "Assign VM", "Billing Access", "Infra Access"];

const rolePermissions: Record<string, string[]> = {
  Admin: permissions,
  Support: ["Modify Batch", "Assign VM"],
  Billing: ["Billing Access"],
  Infra: ["Assign VM", "Infra Access"],
};

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">Role configuration and permissions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {roles.map(r => <TableHead key={r} className="text-center">{r}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((p) => (
                <TableRow key={p}>
                  <TableCell className="text-sm font-medium">{p}</TableCell>
                  {roles.map(r => (
                    <TableCell key={r} className="text-center">
                      <Checkbox checked={rolePermissions[r]?.includes(p)} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
