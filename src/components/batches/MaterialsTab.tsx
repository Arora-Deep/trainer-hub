import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Video, FileText, Link as LinkIcon, Presentation, Image as ImageIcon, File,
  Plus, Search, Trash2, ExternalLink, Download, Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useBatchStore, type Material, type MaterialType } from "@/stores/batchStore";

const typeMeta: Record<MaterialType, { icon: any; label: string; color: string }> = {
  video: { icon: Video, label: "Video", color: "text-rose-600 bg-rose-50" },
  document: { icon: FileText, label: "Document", color: "text-blue-600 bg-blue-50" },
  link: { icon: LinkIcon, label: "Link", color: "text-violet-600 bg-violet-50" },
  slide: { icon: Presentation, label: "Slides", color: "text-amber-600 bg-amber-50" },
  image: { icon: ImageIcon, label: "Image", color: "text-emerald-600 bg-emerald-50" },
  other: { icon: File, label: "File", color: "text-slate-600 bg-slate-100" },
};

export function MaterialsTab({ batchId, batchName }: { batchId: string; batchName: string }) {
  const batch = useBatchStore((s) => s.batches.find((b) => b.id === batchId));
  const addMaterial = useBatchStore((s) => s.addMaterial);
  const removeMaterial = useBatchStore((s) => s.removeMaterial);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ name: string; type: MaterialType; url: string; description: string }>({
    name: "", type: "document", url: "", description: "",
  });

  const materials = batch?.materials ?? [];
  const filtered = useMemo(
    () => materials.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())),
    [materials, query],
  );

  const onSubmit = () => {
    if (!form.name.trim() || !form.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    addMaterial(batchId, { ...form, uploadedBy: "Trainer" });
    setForm({ name: "", type: "document", url: "", description: "" });
    setOpen(false);
    toast.success("Material shared with participants");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base">Material</CardTitle>
          <CardDescription>Share videos, documents, slides, and links with {batchName}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search material…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 w-56 h-9"
            />
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add material</Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add material</SheetTitle>
                <SheetDescription>Upload a file or paste a link. Participants will see it instantly.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as MaterialType }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(typeMeta) as MaterialType[]).map((t) => (
                        <SelectItem key={t} value={t}>{typeMeta[t].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g. Week 1 — Slides"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{form.type === "link" ? "URL" : "File URL"}</Label>
                  <Input
                    placeholder={form.type === "link" ? "https://…" : "Paste file URL or upload"}
                    value={form.url}
                    onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  />
                  {form.type !== "link" && (
                    <Button
                      variant="outline" size="sm" className="w-full mt-1 gap-1.5"
                      onClick={() => {
                        // Demo-only: simulate a file pick
                        const fake = `https://cdn.example.com/uploads/${(form.name || "file").replace(/\s+/g, "-").toLowerCase()}`;
                        setForm((f) => ({ ...f, url: fake }));
                        toast.success("File attached (demo)");
                      }}
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload from device
                    </Button>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Description (optional)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Short note for participants"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onSubmit}>Share material</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-14 border border-dashed rounded-lg">
            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No material yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Add reference videos, slide decks, PDFs, or links. Participants can access them during live sessions and self-paced learning.
            </p>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {filtered.map((m) => <MaterialRow key={m.id} m={m} onRemove={() => { removeMaterial(batchId, m.id); toast.success("Removed"); }} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MaterialRow({ m, onRemove }: { m: Material; onRemove: () => void }) {
  const meta = typeMeta[m.type];
  const Icon = meta.icon;
  const isLink = m.type === "link";
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5">
      <div className={`h-9 w-9 rounded-md flex items-center justify-center shrink-0 ${meta.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">{m.name}</p>
          <Badge variant="outline" className="text-[10px] uppercase">{meta.label}</Badge>
        </div>
        {m.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>}
        <p className="text-[10px] text-muted-foreground mt-1">Added {m.uploadedAt}{m.uploadedBy ? ` · ${m.uploadedBy}` : ""}</p>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
          <a href={m.url} target="_blank" rel="noreferrer" title={isLink ? "Open" : "Download"}>
            {isLink ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRemove} title="Remove">
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
