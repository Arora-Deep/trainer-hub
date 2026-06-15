import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Megaphone, Plus, Pin, PinOff, Trash2, Globe } from "lucide-react";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { useBatchStore } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Announcements() {
  const all = useAnnouncementStore((s) => s.announcements);
  const add = useAnnouncementStore((s) => s.add);
  const remove = useAnnouncementStore((s) => s.remove);
  const togglePin = useAnnouncementStore((s) => s.togglePin);
  const batches = useBatchStore((s) => s.batches);

  const [open, setOpen] = useState(false);
  const [audience, setAudience] = useState<"global" | "batch">("batch");
  const [batchId, setBatchId] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [filter, setFilter] = useState("all");

  const sorted = useMemo(() => {
    return [...all]
      .filter((a) => {
        if (filter === "all") return true;
        if (filter === "global") return a.batchId === null;
        return a.batchId === filter;
      })
      .sort((a, b) => (+b.pinned - +a.pinned) || (+new Date(b.postedAt) - +new Date(a.postedAt)));
  }, [all, filter]);

  const handlePost = () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Missing fields", description: "Title and body are required.", variant: "destructive" });
      return;
    }
    if (audience === "batch" && !batchId) {
      toast({ title: "Choose a batch", variant: "destructive" });
      return;
    }
    const batch = batches.find((b) => b.id === batchId);
    add({
      batchId: audience === "batch" ? batchId : null,
      batchName: batch?.name,
      title: title.trim(),
      body: body.trim(),
      postedBy: "You",
      pinned: false,
      audience,
    });
    setTitle(""); setBody(""); setBatchId(""); setAudience("batch");
    setOpen(false);
    toast({ title: "Announcement posted" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <PageHeader
          title="Announcements"
          description="Post updates to a specific batch or platform-wide. All learners see these on their dashboard."
          breadcrumbs={[{ label: "Announcements" }]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> New announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Post announcement</DialogTitle>
              <DialogDescription>Choose audience and write your message.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Audience</Label>
                  <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batch">A batch</SelectItem>
                      <SelectItem value="global">Everyone (global)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {audience === "batch" && (
                  <div>
                    <Label className="text-xs">Batch</Label>
                    <Select value={batchId} onValueChange={setBatchId}>
                      <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
                      <SelectContent>
                        {batches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What's the headline?" />
              </div>
              <div>
                <Label className="text-xs">Message</Label>
                <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handlePost}>Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[260px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All announcements</SelectItem>
            <SelectItem value="global">Global only</SelectItem>
            {batches.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{sorted.length} {sorted.length === 1 ? "post" : "posts"}</span>
      </div>

      <div className="space-y-3">
        {sorted.map((a) => (
          <Card key={a.id} className={a.pinned ? "border-primary/40" : ""}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && <Badge variant="default" className="text-[10px]"><Pin className="h-2.5 w-2.5 mr-1" />Pinned</Badge>}
                    <Badge variant="outline" className="text-[10px] gap-1">
                      {a.batchId ? <Megaphone className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                      {a.batchId ? a.batchName || "Batch" : "Global"}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      by {a.postedBy} · {format(new Date(a.postedAt), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mt-1.5">{a.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{a.body}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => togglePin(a.id)}>
                    {a.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => remove(a.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {sorted.length === 0 && (
          <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No announcements yet.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
