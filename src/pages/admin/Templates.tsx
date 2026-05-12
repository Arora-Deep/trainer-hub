import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLabStore, type LabTemplate } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Copy, Archive, Cpu, MemoryStick, HardDrive, Search } from "lucide-react";

export default function AdminTemplates() {
  const navigate = useNavigate();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useLabStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LabTemplate>>({});

  const selected = templates.find((t) => t.id === selectedId);

  const openEdit = (t: LabTemplate) => {
    setSelectedId(t.id);
    setDraft({ name: t.name, os: t.os, vcpus: t.vcpus, memory: t.memory, storage: t.storage, startupScript: t.startupScript });
  };

  const handleSave = () => {
    if (!selected) return;
    updateTemplate(selected.id, draft);
    toast({ title: "Template Updated", description: `${draft.name || selected.name} saved.` });
    setSelectedId(null);
  };

  const handleDuplicate = (t: LabTemplate) => {
    const { id, createdAt, lastUpdated, ...rest } = t;
    addTemplate({ ...rest, name: `${t.name} (Copy)` });
    toast({ title: "Template Duplicated", description: `${t.name} cloned.` });
  };

  const handleDeprecate = (t: LabTemplate) => {
    deleteTemplate(t.id);
    toast({ title: "Template Removed", description: `${t.name} has been deprecated.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Define and manage lab environments</p>
        </div>
        <Button className="gap-2" onClick={() => navigate("/labs/create-template?returnTo=/admin/labs/templates")}>
          <Plus className="h-4 w-4" /> Create Template
        </Button>
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
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell>
                    <button className="text-sm font-medium text-primary hover:underline" onClick={() => openEdit(t)}>{t.name}</button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.os} {t.osVersion}</TableCell>
                  <TableCell className="text-sm text-center">{t.vcpus} vCPU</TableCell>
                  <TableCell className="text-sm text-center">{t.memory} GB</TableCell>
                  <TableCell className="text-sm text-center">{t.storage} GB</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{t.category}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(t)}><Edit className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Duplicate" onClick={() => handleDuplicate(t)}><Copy className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Deprecate" onClick={() => handleDeprecate(t)}><Archive className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
        <SheetContent side="full" className="overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4">
                <SheetTitle>{selected.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selected.os} {selected.osVersion}</p>
              </SheetHeader>
              <div className="space-y-5 max-w-2xl">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg border">
                    <Cpu className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{draft.vcpus ?? selected.vcpus}</p>
                    <p className="text-xs text-muted-foreground">vCPU</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <MemoryStick className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{draft.memory ?? selected.memory}</p>
                    <p className="text-xs text-muted-foreground">GB RAM</p>
                  </div>
                  <div className="text-center p-3 rounded-lg border">
                    <HardDrive className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <p className="text-lg font-bold">{draft.storage ?? selected.storage}</p>
                    <p className="text-xs text-muted-foreground">GB Disk</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Template Name</Label>
                    <Input value={draft.name ?? selected.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">OS</Label>
                    <Input value={draft.os ?? selected.os} onChange={(e) => setDraft({ ...draft, os: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs">CPU</Label><Input type="number" value={draft.vcpus ?? selected.vcpus} onChange={(e) => setDraft({ ...draft, vcpus: parseInt(e.target.value) || 1 })} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">RAM (GB)</Label><Input type="number" value={draft.memory ?? selected.memory} onChange={(e) => setDraft({ ...draft, memory: parseInt(e.target.value) || 1 })} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Disk (GB)</Label><Input type="number" value={draft.storage ?? selected.storage} onChange={(e) => setDraft({ ...draft, storage: parseInt(e.target.value) || 10 })} /></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Startup Script</Label>
                  <Textarea value={draft.startupScript ?? selected.startupScript} onChange={(e) => setDraft({ ...draft, startupScript: e.target.value })} rows={6} className="font-mono text-xs" placeholder="#!/bin/bash" />
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedId(null)}>Cancel</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
