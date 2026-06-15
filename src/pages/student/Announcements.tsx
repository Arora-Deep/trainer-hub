import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Pin, Search } from "lucide-react";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";

export default function StudentAnnouncements() {
  const byBatch = useAnnouncementStore((s) => s.byBatch);
  const global = useAnnouncementStore((s) => s.global);
  const [tab, setTab] = useState<"all" | "batch" | "platform">("all");
  const [q, setQ] = useState("");

  const batchOnes = byBatch(CURRENT_STUDENT_BATCH_ID);
  const platformOnes = global();
  let list =
    tab === "batch" ? batchOnes :
    tab === "platform" ? platformOnes :
    [...batchOnes, ...platformOnes].sort(
      (a, b) => (+b.pinned - +a.pinned) || (+new Date(b.postedAt) - +new Date(a.postedAt))
    );

  if (q) {
    const qq = q.toLowerCase();
    list = list.filter((a) => a.title.toLowerCase().includes(qq) || a.body.toLowerCase().includes(qq));
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Updates from your trainers and the platform team." />

      <div className="flex items-center gap-2 flex-wrap">
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="batch">My Batch ({batchOnes.length})</TabsTrigger>
            <TabsTrigger value="platform">Platform ({platformOnes.length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 min-w-[200px] max-w-md ml-auto">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search announcements…" className="pl-8 h-9" />
        </div>
      </div>

      {list.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No announcements.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <Card key={a.id} className={a.pinned ? "border-primary/40" : ""}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  {a.pinned ? <Pin className="h-4 w-4 text-primary" /> : <Megaphone className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{a.title}</h3>
                    {a.audience === "global" && <Badge variant="outline" className="text-[10px] h-4">Platform</Badge>}
                    {a.audience === "batch" && a.batchName && <Badge variant="outline" className="text-[10px] h-4">{a.batchName}</Badge>}
                    {a.pinned && <Badge className="text-[10px] h-4 bg-primary/10 text-primary border-0">Pinned</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-wrap">{a.body}</p>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    {a.postedBy} · {new Date(a.postedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
