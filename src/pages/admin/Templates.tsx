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
import { Plus, Edit, Copy, Archive, Cpu, MemoryStick, HardDrive, Search, KeyRound, Eye, EyeOff, Copy as CopyIcon, User, Tag as TagIcon, Calendar, Clock } from "lucide-react";

export default function AdminTemplates() {
  const navigate = useNavigate();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useLabStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<LabTemplate>>({});
  const [search, setSearch] = useState("");
  const [osFilter, setOsFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showPassword, setShowPassword] = useState(false);

  const osList = useMemo(() => Array.from(new Set(templates.map((t) => t.os).filter(Boolean))), [templates]);
  const categoryList = useMemo(() => Array.from(new Set(templates.map((t) => t.category).filter(Boolean))), [templates]);

  const filtered = useMemo(() => templates.filter((t) =>
    (osFilter === "all" || t.os === osFilter) &&
    (categoryFilter === "all" || t.category === categoryFilter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || (t.category || "").toLowerCase().includes(search.toLowerCase()))
  ), [templates, search, osFilter, categoryFilter]);

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
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search templates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={osFilter} onValueChange={setOsFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="All OS" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All OS</SelectItem>
                {osList.map((os) => <SelectItem key={os} value={os}>{os}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categoryList.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground ml-auto">{filtered.length} of {templates.length}</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>OS</TableHead>
                <TableHead className="text-center">Resources</TableHead>
                <TableHead>Category / Tags</TableHead>
                <TableHead>Built for</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id} className="group">
                  <TableCell className="max-w-[240px]">
                    <button className="text-sm font-medium text-primary hover:underline text-left" onClick={() => openEdit(t)}>{t.name}</button>
                    {t.description && <p className="text-[11px] text-muted-foreground truncate">{t.description}</p>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.os} {t.osVersion}</TableCell>
                  <TableCell className="text-xs text-center whitespace-nowrap">{t.vcpus}C · {t.memory}G · {t.storage}G</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {t.tags?.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0">{tag}</Badge>
                      ))}
                      {t.tags && t.tags.length > 3 && <span className="text-[9px] text-muted-foreground">+{t.tags.length - 3}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{t.builtFor || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">{t.requestedBy || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{t.createdAt}</TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{t.lastUsedAt || "—"}</TableCell>
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

                {/* About this template */}
                <div className="rounded-lg border p-3 space-y-2 bg-muted/20">
                  <div className="flex items-center gap-1.5 text-xs font-semibold"><TagIcon className="h-3.5 w-3.5" /> About this template</div>
                  {selected.description && <p className="text-xs text-muted-foreground">{selected.description}</p>}
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div><span className="text-muted-foreground">Built for:</span> <span className="font-medium">{selected.builtFor || "—"}</span></div>
                    <div><span className="text-muted-foreground">Requested by:</span> <span className="font-medium">{selected.requestedBy || "—"}</span></div>
                    <div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground">Created:</span> <span className="font-medium">{selected.createdAt}</span></div>
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" /><span className="text-muted-foreground">Last used:</span> <span className="font-medium">{selected.lastUsedAt || "—"}</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">Category:</span> <Badge variant="secondary" className="text-[10px] ml-1">{selected.category}</Badge></div>
                  </div>
                  {selected.tags?.length > 0 && (
                    <div className="flex gap-1 flex-wrap pt-1">
                      {selected.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                    </div>
                  )}
                </div>

                {/* Default login credentials */}
                {selected.credentials && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold"><KeyRound className="h-3.5 w-3.5" /> Default login credentials</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Username</Label>
                        <div className="flex items-center gap-1">
                          <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded font-mono">{selected.credentials.username}</code>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { navigator.clipboard.writeText(selected.credentials!.username); toast({ title: "Copied" }); }}><CopyIcon className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Password</Label>
                        <div className="flex items-center gap-1">
                          <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded font-mono">{showPassword ? selected.credentials.password : "••••••••••"}</code>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { navigator.clipboard.writeText(selected.credentials!.password); toast({ title: "Copied" }); }}><CopyIcon className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
