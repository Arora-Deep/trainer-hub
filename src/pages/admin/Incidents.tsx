import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";

const severityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive", major: "bg-warning/10 text-warning",
  minor: "bg-info/10 text-info", info: "bg-muted text-muted-foreground",
};
const statusColors: Record<string, string> = {
  active: "bg-destructive/10 text-destructive", investigating: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success", postmortem: "bg-muted text-muted-foreground",
};

export default function Incidents() {
  const { incidents } = useCustomerStore();
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Incidents</h1><p className="text-muted-foreground text-sm mt-1">Platform incident management</p></div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">ID</TableHead><TableHead className="text-xs">Severity</TableHead><TableHead className="text-xs">Title</TableHead>
            <TableHead className="text-xs">Impacted</TableHead><TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Owner</TableHead><TableHead className="text-xs">Created</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {incidents.map(inc => (
              <TableRow key={inc.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="text-xs font-mono">{inc.id}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${severityColors[inc.severity]}`}>{inc.severity}</Badge></TableCell>
                <TableCell className="text-sm font-medium max-w-[300px] truncate">{inc.title}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{inc.impactedTenants.join(", ")}</TableCell>
                <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[inc.status]}`}>{inc.status}</Badge></TableCell>
                <TableCell className="text-xs">{inc.owner}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(inc.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
