import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Archive } from "lucide-react";

const isos = [
  { name: "Ubuntu 22.04 LTS", version: "22.04.4", uploaded: "2026-01-15", usedBy: "12 templates" },
  { name: "CentOS 9 Stream", version: "9.0", uploaded: "2026-01-10", usedBy: "5 templates" },
  { name: "Windows Server 2022", version: "2022 DC", uploaded: "2025-12-20", usedBy: "3 templates" },
  { name: "Rocky Linux 9", version: "9.3", uploaded: "2026-02-01", usedBy: "2 templates" },
  { name: "Ubuntu 24.04 LTS", version: "24.04.1", uploaded: "2026-02-25", usedBy: "0 templates" },
  { name: "Amazon Linux 2023", version: "2023.4", uploaded: "2026-03-01", usedBy: "4 templates" },
];

export default function ISOLibrary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ISO Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Repository of uploaded OS images</p>
        </div>
        <Button className="gap-2"><Upload className="h-4 w-4" /> Upload ISO</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISO</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isos.map((iso, i) => (
                <TableRow key={i} className="group">
                  <TableCell className="text-sm font-medium">{iso.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{iso.version}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{iso.uploaded}</TableCell>
                  <TableCell className="text-sm">{iso.usedBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => toast({ title: "Deleted", description: `${iso.name} removed.` })}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Deprecate">
                        <Archive className="h-3 w-3" />
                      </Button>
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
