import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCustomerStore } from "@/stores/customerStore";
import { Plus, MoreHorizontal, Shield, CheckCircle, AlertTriangle, Ban } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground", tested: "bg-info/10 text-info",
  approved: "bg-success/10 text-success", deprecated: "bg-destructive/10 text-destructive",
};
const scanColors: Record<string, string> = {
  passed: "bg-success/10 text-success", failed: "bg-destructive/10 text-destructive",
  pending: "bg-warning/10 text-warning", not_scanned: "bg-muted text-muted-foreground",
};

export default function GoldenImages() {
  const { goldenImages } = useCustomerStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Golden Images</h1>
          <p className="text-muted-foreground text-sm mt-1">Base OS images for lab blueprints</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Create Image</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Image Name</TableHead>
                <TableHead className="text-xs">OS</TableHead>
                <TableHead className="text-xs">Version</TableHead>
                <TableHead className="text-xs">Last Patched</TableHead>
                <TableHead className="text-xs">Security</TableHead>
                <TableHead className="text-xs">Validation</TableHead>
                <TableHead className="text-xs text-right">Templates</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goldenImages.map(img => (
                <TableRow key={img.id}>
                  <TableCell className="font-medium text-sm">{img.name}</TableCell>
                  <TableCell className="text-xs">{img.os}</TableCell>
                  <TableCell className="text-xs font-mono">{img.version}</TableCell>
                  <TableCell className="text-xs">{img.lastPatched}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${scanColors[img.securityScan]}`}>{img.securityScan.replace("_", " ")}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${img.validationStatus === "validated" ? "bg-success/10 text-success" : img.validationStatus === "pending" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{img.validationStatus}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{img.usedByTemplates}</TableCell>
                  <TableCell><Badge variant="secondary" className={`text-[10px] capitalize ${statusColors[img.status]}`}>{img.status}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Shield className="h-3.5 w-3.5" /> Run Security Scan</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><CheckCircle className="h-3.5 w-3.5" /> Run Validation</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><CheckCircle className="h-3.5 w-3.5" /> Promote to Approved</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer text-destructive"><Ban className="h-3.5 w-3.5" /> Deprecate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
