import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Copy, Archive, Cpu, MemoryStick, HardDrive } from "lucide-react";

const templates = [
  { id: "t1", name: "Linux DevOps Lab", os: "Ubuntu 22.04", cpu: 4, ram: 8, disk: 50, version: "v2.1", usedBy: 12, startupScript: "#!/bin/bash\napt update && apt install -y docker.io" },
  { id: "t2", name: "Kubernetes Lab v2", os: "Ubuntu 22.04", cpu: 8, ram: 16, disk: 100, version: "v2.0", usedBy: 8, startupScript: "#!/bin/bash\ncurl -sfL https://get.k3s.io | sh -" },
  { id: "t3", name: "ML GPU Lab v1", os: "Ubuntu 22.04", cpu: 16, ram: 64, disk: 200, version: "v1.3", usedBy: 5, startupScript: "#!/bin/bash\npip install torch tensorflow" },
  { id: "t4", name: "Docker Compose", os: "Ubuntu 22.04", cpu: 4, ram: 8, disk: 40, version: "v1.0", usedBy: 6, startupScript: "" },
  { id: "t5", name: "AWS Simulation", os: "Amazon Linux", cpu: 8, ram: 16, disk: 80, version: "v1.2", usedBy: 4, startupScript: "#!/bin/bash\nyum install -y aws-cli" },
  { id: "t6", name: "Linux + Networking", os: "CentOS 9", cpu: 4, ram: 4, disk: 30, version: "v3.0", usedBy: 15, startupScript: "" },
];

export default function AdminTemplates() {
  const [selected, setSelected] = useState<typeof templates[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Define and manage lab environments</p>
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
                <TableHead className="text-center">CPU</TableHead>
                <TableHead className="text-center">RAM</TableHead>
                <TableHead className="text-center">Disk</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-center">Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map(t => (
                <TableRow key={t.id} className="group">
                  <TableCell>
                    <button className="text-sm font-medium text-primary hover:underline" onClick={() => setSelected(t)}>{t.name}</button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.os}</TableCell>
                  <TableCell className="text-sm text-center">{t.cpu} vCPU</TableCell>
                  <TableCell className="text-sm text-center">{t.ram} GB</TableCell>
                  <TableCell className="text-sm text-center">{t.disk} GB</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{t.version}</Badge></TableCell>
                  <TableCell className="text-sm text-center">{t.usedBy} batches</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => setSelected(t)}><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Duplicate"><Copy className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Deprecate"><Archive className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Template Detail Drawer */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle>{selected.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selected.os} · {selected.version}</p>
              </SheetHeader>
              <div className="space-y-5">
                {/* Resource Preview */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg border">
                    <Cpu className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{selected.cpu}</p>
                    <p className="text-xs text-muted-foreground">vCPU</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <MemoryStick className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{selected.ram}</p>
                    <p className="text-xs text-muted-foreground">GB RAM</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <HardDrive className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{selected.disk}</p>
                    <p className="text-xs text-muted-foreground">GB Disk</p>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Template Name</Label>
                    <Input defaultValue={selected.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">OS</Label>
                    <Input defaultValue={selected.os} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs">CPU</Label><Input type="number" defaultValue={selected.cpu} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">RAM (GB)</Label><Input type="number" defaultValue={selected.ram} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Disk (GB)</Label><Input type="number" defaultValue={selected.disk} /></div>
                  </div>
                </div>

                {/* Startup Script */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Startup Script</Label>
                  <Textarea defaultValue={selected.startupScript} rows={5} className="font-mono text-xs" placeholder="#!/bin/bash" />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Save Changes</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
