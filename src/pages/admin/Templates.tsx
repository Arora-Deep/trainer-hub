import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus, Edit, Archive } from "lucide-react";

export default function AdminTemplates() {
  const { blueprints } = useCustomerStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage lab environment templates</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Template</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>OS</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead className="text-right">Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blueprints.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="text-sm font-medium">{b.name}</TableCell>
                  <TableCell className="text-sm">{b.type === "multi" ? "Multi-VM" : "Single"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.version}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{b.defaultResources.cpu} vCPU, {b.defaultResources.ram} GB RAM, {b.defaultResources.disk} GB Disk</TableCell>
                  <TableCell className="text-sm text-right">{b.publishedTo} customers</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm"><Archive className="h-3 w-3" /></Button>
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
