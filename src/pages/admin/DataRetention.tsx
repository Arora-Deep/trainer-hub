import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const policies = [
  { dataType: "Session Access Logs", retention: 90, unit: "days", deletionFlow: "Auto-purge" },
  { dataType: "Audit Logs", retention: 365, unit: "days", deletionFlow: "Archive + purge" },
  { dataType: "VM Snapshots", retention: 30, unit: "days", deletionFlow: "Auto-delete" },
  { dataType: "Ticket History", retention: 180, unit: "days", deletionFlow: "Archive" },
  { dataType: "Terminated Tenant Data", retention: 60, unit: "days", deletionFlow: "Manual review + delete" },
];

export default function DataRetention() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Data Retention</h1><p className="text-muted-foreground text-sm mt-1">Data lifecycle and deletion policies</p></div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow>
              <TableHead className="text-xs">Data Type</TableHead><TableHead className="text-xs text-right">Retention</TableHead>
              <TableHead className="text-xs">Unit</TableHead><TableHead className="text-xs">Deletion Flow</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {policies.map(p => (
                <TableRow key={p.dataType}>
                  <TableCell className="font-medium text-sm">{p.dataType}</TableCell>
                  <TableCell className="text-right"><Input type="number" defaultValue={p.retention} className="h-8 w-20 text-sm text-right" /></TableCell>
                  <TableCell className="text-xs">{p.unit}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.deletionFlow}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button size="sm" className="text-xs">Save Retention Policies</Button>
    </div>
  );
}
