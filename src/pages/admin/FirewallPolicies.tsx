import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const policies = [
  { name: "Default Lab Firewall", direction: "inbound", ports: "22, 80, 443, 3389", templates: 5, status: "active" },
  { name: "GPU Lab Firewall", direction: "both", ports: "22, 80, 443, 8888, 6006", templates: 2, status: "active" },
  { name: "Exam Lockdown", direction: "outbound", ports: "None (blocked)", templates: 3, status: "active" },
  { name: "K8s Lab Policy", direction: "both", ports: "22, 80, 443, 6443, 30000-32767", templates: 2, status: "active" },
];

export default function FirewallPolicies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Firewall Policies</h1><p className="text-muted-foreground text-sm mt-1">Network security rules</p></div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Policy</Button>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="text-xs">Policy Name</TableHead><TableHead className="text-xs">Direction</TableHead>
            <TableHead className="text-xs">Ports</TableHead><TableHead className="text-xs text-right">Templates</TableHead>
            <TableHead className="text-xs">Status</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {policies.map(p => (
              <TableRow key={p.name} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium text-sm">{p.name}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{p.direction}</Badge></TableCell>
                <TableCell className="text-xs font-mono max-w-[250px] truncate">{p.ports}</TableCell>
                <TableCell className="text-xs text-right">{p.templates}</TableCell>
                <TableCell><Badge variant="secondary" className="text-[10px] bg-success/10 text-success capitalize">{p.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
