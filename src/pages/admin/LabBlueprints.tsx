import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus } from "lucide-react";

export default function LabBlueprints() {
  const { blueprints } = useCustomerStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Blueprints</h1>
          <p className="text-muted-foreground text-sm mt-1">Lab template catalog</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Blueprint</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Name</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Version</TableHead>
                <TableHead className="text-xs">Resources</TableHead>
                <TableHead className="text-xs">Internet</TableHead>
                <TableHead className="text-xs">Validation</TableHead>
                <TableHead className="text-xs text-right">Published To</TableHead>
                <TableHead className="text-xs">Tags</TableHead>
                <TableHead className="text-xs">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blueprints.map(bp => (
                <TableRow key={bp.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <p className="font-medium text-sm">{bp.name}</p>
                    <p className="text-[10px] text-muted-foreground">{bp.description}</p>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] capitalize">{bp.type}</Badge></TableCell>
                  <TableCell className="text-xs font-mono">{bp.version}</TableCell>
                  <TableCell className="text-xs">{bp.defaultResources.cpu}C / {bp.defaultResources.ram}G / {bp.defaultResources.disk}G{bp.defaultResources.gpu ? ` / ${bp.defaultResources.gpu}GPU` : ""}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${bp.internetPolicy === "open" ? "bg-success/10 text-success" : bp.internetPolicy === "allowlist" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{bp.internetPolicy}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${bp.validationStatus === "validated" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{bp.validationStatus}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{bp.publishedTo} tenants</TableCell>
                  <TableCell><div className="flex gap-1 flex-wrap">{bp.tags.map(t => <Badge key={t} variant="secondary" className="text-[9px]">{t}</Badge>)}</div></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{bp.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
