import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Upload, Trash2, Archive, Link2, Search, RefreshCw, CheckCircle2 } from "lucide-react";

type ISO = {
  id: string;
  name: string;
  version: string;
  family: string;
  arch: string;
  sizeGB: number;
  source: "uploaded" | "url-pull";
  url?: string;
  checksum?: string;
  uploaded: string;
  usedBy: number;
  status: "ready" | "pulling" | "verifying" | "failed" | "archived";
  progress?: number;
};

const initialIsos: ISO[] = [
  { id: "iso-1", name: "Ubuntu 22.04 LTS", version: "22.04.4", family: "Linux", arch: "x86_64", sizeGB: 2.1, source: "uploaded", uploaded: "2026-01-15", usedBy: 12, status: "ready", checksum: "sha256:b1f7…e92a" },
  { id: "iso-2", name: "CentOS 9 Stream", version: "9.0", family: "Linux", arch: "x86_64", sizeGB: 1.8, source: "url-pull", url: "https://mirror.centos.org/...", uploaded: "2026-01-10", usedBy: 5, status: "ready" },
  { id: "iso-3", name: "Windows Server 2022", version: "2022 DC", family: "Windows", arch: "x86_64", sizeGB: 5.6, source: "uploaded", uploaded: "2025-12-20", usedBy: 3, status: "ready" },
  { id: "iso-4", name: "Rocky Linux 9", version: "9.3", family: "Linux", arch: "x86_64", sizeGB: 2.0, source: "url-pull", url: "https://download.rockylinux.org/...", uploaded: "2026-02-01", usedBy: 2, status: "ready" },
  { id: "iso-5", name: "Ubuntu 24.04 LTS", version: "24.04.1", family: "Linux", arch: "arm64", sizeGB: 2.3, source: "url-pull", uploaded: "2026-02-25", usedBy: 0, status: "ready" },
];

export default function ISOLibrary() {
  const [isos, setIsos] = useState<ISO[]>(initialIsos);
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState<string>("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pullOpen, setPullOpen] = useState(false);
  const [pullForm, setPullForm] = useState({ name: "", url: "", checksum: "", family: "Linux", arch: "x86_64" });

  const filtered = isos.filter((i) =>
    (familyFilter === "all" || i.family === familyFilter) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.version.toLowerCase().includes(search.toLowerCase()))
  );

  const startPull = () => {
    if (!pullForm.name || !pullForm.url) { toast({ title: "Name and URL required", variant: "destructive" }); return; }
    const id = `iso-${Date.now()}`;
    const newIso: ISO = {
      id, name: pullForm.name, version: "—", family: pullForm.family, arch: pullForm.arch, sizeGB: 0,
      source: "url-pull", url: pullForm.url, checksum: pullForm.checksum || undefined,
      uploaded: new Date().toISOString().slice(0, 10), usedBy: 0, status: "pulling", progress: 0,
    };
    setIsos((prev) => [newIso, ...prev]);
    setPullOpen(false);
    setPullForm({ name: "", url: "", checksum: "", family: "Linux", arch: "x86_64" });
    toast({ title: "Pull Started", description: `Fetching ${newIso.name} from URL…` });

    // simulate progress
    let p = 0;
    const tick = setInterval(() => {
      p += 12 + Math.random() * 14;
      if (p >= 100) {
        clearInterval(tick);
        setIsos((prev) => prev.map((x) => x.id === id ? { ...x, status: "verifying", progress: 100 } : x));
        setTimeout(() => {
          setIsos((prev) => prev.map((x) => x.id === id ? { ...x, status: "ready", sizeGB: 2.4, version: "latest" } : x));
          toast({ title: "ISO Ready", description: `${newIso.name} verified and added.` });
        }, 1200);
      } else {
        setIsos((prev) => prev.map((x) => x.id === id ? { ...x, progress: Math.round(p) } : x));
      }
    }, 700);
  };

  const handleDelete = (iso: ISO) => {
    if (iso.usedBy > 0) { toast({ title: "Cannot Delete", description: `${iso.name} is used by ${iso.usedBy} templates.`, variant: "destructive" }); return; }
    setIsos(isos.filter((i) => i.id !== iso.id));
    toast({ title: "ISO Deleted", description: `${iso.name} removed.` });
  };

  const handleArchive = (iso: ISO) => {
    setIsos(isos.map((i) => i.id === iso.id ? { ...i, status: "archived" } : i));
    toast({ title: "ISO Deprecated", description: `${iso.name} marked archived.` });
  };

  const handleUpload = () => { setUploadOpen(false); toast({ title: "Upload Started", description: "Backend storage required to complete upload." }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ISO Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Repository of OS images. Upload locally or pull from a URL.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setPullOpen(true)}><Link2 className="h-4 w-4" /> Pull from URL</Button>
          <Button className="gap-2" onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4" /> Upload ISO</Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total ISOs</p><p className="text-xl font-bold">{isos.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Ready</p><p className="text-xl font-bold text-success">{isos.filter((i) => i.status === "ready").length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Pulling</p><p className="text-xl font-bold text-warning">{isos.filter((i) => i.status === "pulling" || i.status === "verifying").length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-muted-foreground">Total Size</p><p className="text-xl font-bold">{isos.reduce((s, i) => s + i.sizeGB, 0).toFixed(1)} GB</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search ISOs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All families</SelectItem>
                <SelectItem value="Linux">Linux</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
                <SelectItem value="BSD">BSD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISO</TableHead>
                <TableHead>Family / Arch</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((iso) => (
                <TableRow key={iso.id} className="group">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{iso.name}</p>
                      <p className="text-xs text-muted-foreground">{iso.version} · {iso.uploaded}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{iso.family} · {iso.arch}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs gap-1">
                      {iso.source === "url-pull" ? <Link2 className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
                      {iso.source === "url-pull" ? "URL" : "Uploaded"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{iso.sizeGB ? `${iso.sizeGB} GB` : "—"}</TableCell>
                  <TableCell>
                    {iso.status === "pulling" || iso.status === "verifying" ? (
                      <div className="space-y-1 min-w-[120px]">
                        <p className="text-xs text-muted-foreground capitalize">{iso.status} {iso.progress ?? 0}%</p>
                        <Progress value={iso.progress ?? 0} className="h-1" />
                      </div>
                    ) : iso.status === "ready" ? (
                      <Badge variant="secondary" className="text-xs bg-success/10 text-success gap-1"><CheckCircle2 className="h-3 w-3" /> Ready</Badge>
                    ) : iso.status === "archived" ? (
                      <Badge variant="secondary" className="text-xs">Archived</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-destructive/10 text-destructive">Failed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{iso.usedBy} templates</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      {iso.source === "url-pull" && iso.status === "ready" && (
                        <Button variant="ghost" size="sm" title="Re-sync" onClick={() => toast({ title: "Re-sync queued", description: `${iso.name} will refresh from URL` })}>
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" title="Archive" onClick={() => handleArchive(iso)}><Archive className="h-3 w-3" /></Button>
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => handleDelete(iso)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pull from URL */}
      <Dialog open={pullOpen} onOpenChange={setPullOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pull ISO from URL</DialogTitle>
            <DialogDescription>Fetch directly to platform storage. Faster than uploading and supports vendor mirrors.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Display name</Label>
              <Input placeholder="e.g. Debian 12 Bookworm" value={pullForm.name} onChange={(e) => setPullForm({ ...pullForm, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs">Source URL</Label>
              <Input placeholder="https://cdimage.debian.org/.../debian-12.5.0-amd64-netinst.iso" value={pullForm.url} onChange={(e) => setPullForm({ ...pullForm, url: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Family</Label>
                <Select value={pullForm.family} onValueChange={(v) => setPullForm({ ...pullForm, family: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Linux">Linux</SelectItem><SelectItem value="Windows">Windows</SelectItem><SelectItem value="BSD">BSD</SelectItem></SelectContent>
                </Select></div>
              <div className="space-y-1.5"><Label className="text-xs">Arch</Label>
                <Select value={pullForm.arch} onValueChange={(v) => setPullForm({ ...pullForm, arch: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="x86_64">x86_64</SelectItem><SelectItem value="arm64">arm64</SelectItem></SelectContent>
                </Select></div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">SHA-256 checksum (optional)</Label>
              <Input placeholder="Verify integrity after download" value={pullForm.checksum} onChange={(e) => setPullForm({ ...pullForm, checksum: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPullOpen(false)}>Cancel</Button>
            <Button onClick={startPull}>Start Pull</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload ISO</DialogTitle>
            <DialogDescription>Drag a local .iso file. Large uploads are resumable.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-sm text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Drop ISO file here, or click to browse
            <p className="text-xs mt-2">Backend storage required for actual upload.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
