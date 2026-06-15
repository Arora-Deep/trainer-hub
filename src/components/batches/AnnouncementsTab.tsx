import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pin, PinOff, Trash2, Megaphone, Globe, Plus } from "lucide-react";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface AnnouncementsTabProps {
  batchId: string;
  batchName: string;
}

export function AnnouncementsTab({ batchId, batchName }: AnnouncementsTabProps) {
  const list = useAnnouncementStore((s) => s.byBatch(batchId));
  const add = useAnnouncementStore((s) => s.add);
  const remove = useAnnouncementStore((s) => s.remove);
  const togglePin = useAnnouncementStore((s) => s.togglePin);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState<"batch" | "global">("batch");

  const post = () => {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }
    add({
      batchId: audience === "batch" ? batchId : null,
      batchName: audience === "batch" ? batchName : undefined,
      title: title.trim(),
      body: body.trim(),
      postedBy: "You",
      pinned: false,
      audience,
    });
    setTitle(""); setBody("");
    toast({ title: "Announcement posted" });
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-1 h-fit">
        <CardContent className="py-4 space-y-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">New announcement</h3>
          </div>
          <div>
            <Label className="text-xs">Audience</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="batch">This batch only</SelectItem>
                <SelectItem value="global">Everyone (global)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline" />
          </div>
          <div>
            <Label className="text-xs">Message</Label>
            <Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details..." />
          </div>
          <Button onClick={post} className="w-full" size="sm"><Plus className="h-3.5 w-3.5 mr-1.5" /> Post</Button>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {list.map((a) => (
          <Card key={a.id} className={a.pinned ? "border-primary/40" : ""}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {a.pinned && <Badge className="text-[10px]"><Pin className="h-2.5 w-2.5 mr-1" />Pinned</Badge>}
                    <span className="text-[11px] text-muted-foreground">
                      by {a.postedBy} · {format(new Date(a.postedAt), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm mt-1">{a.title}</h4>
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
        {list.length === 0 && (
          <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No announcements yet for this batch.</CardContent></Card>
        )}
      </div>
    </div>
  );
}
