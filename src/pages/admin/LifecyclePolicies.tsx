import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const policies = [
  { id: 1, name: "Default Lab Policy", idleTimeout: 30, autoDestroy: 14, examLock: false, trainerApproval: false, snapshot: true, scope: "Global" },
  { id: 2, name: "Enterprise Policy", idleTimeout: 60, autoDestroy: 30, examLock: true, trainerApproval: true, snapshot: true, scope: "Enterprise tenants" },
  { id: 3, name: "Trial Policy", idleTimeout: 15, autoDestroy: 7, examLock: false, trainerApproval: false, snapshot: false, scope: "Trial tenants" },
];

export default function LifecyclePolicies() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lifecycle Policies</h1>
          <p className="text-muted-foreground text-sm mt-1">Automated lab lifecycle rules</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Policy</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Policy Name</TableHead>
                <TableHead className="text-xs text-right">Idle Timeout</TableHead>
                <TableHead className="text-xs text-right">Auto Destroy</TableHead>
                <TableHead className="text-xs text-center">Exam Lock</TableHead>
                <TableHead className="text-xs text-center">Trainer Approval</TableHead>
                <TableHead className="text-xs text-center">Weekly Snapshot</TableHead>
                <TableHead className="text-xs">Scope</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium text-sm">{p.name}</TableCell>
                  <TableCell className="text-xs text-right">{p.idleTimeout} min</TableCell>
                  <TableCell className="text-xs text-right">{p.autoDestroy} days</TableCell>
                  <TableCell className="text-center">{p.examLock ? <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">ON</Badge> : <Badge variant="secondary" className="text-[9px]">OFF</Badge>}</TableCell>
                  <TableCell className="text-center">{p.trainerApproval ? <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">ON</Badge> : <Badge variant="secondary" className="text-[9px]">OFF</Badge>}</TableCell>
                  <TableCell className="text-center">{p.snapshot ? <Badge variant="secondary" className="text-[9px] bg-success/10 text-success">ON</Badge> : <Badge variant="secondary" className="text-[9px]">OFF</Badge>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.scope}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
