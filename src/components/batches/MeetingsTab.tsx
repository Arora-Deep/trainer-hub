import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Plus, Link2, Video, Radio, FileVideo } from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import { MeetingCard } from "@/components/meetings/MeetingCard";
import { ScheduleMeetingDrawer } from "@/components/meetings/ScheduleMeetingDrawer";
import { toast } from "@/hooks/use-toast";

interface MeetingsTabProps {
  batchId: string;
  batchName: string;
}

export function MeetingsTab({ batchId, batchName }: MeetingsTabProps) {
  const meetings = useMeetingStore((s) => s.getMeetingsByBatch(batchId));
  const unassigned = useMeetingStore((s) => s.getUnassignedMeetings());
  const attach = useMeetingStore((s) => s.attachToBatch);

  const [open, setOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);

  const live = meetings.filter(m => m.status === "live");
  const upcoming = meetings.filter(m => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter(m => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Video className="h-4 w-4 text-primary" /> Meetings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live sessions, office hours and recordings for this batch.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setAttachOpen(true)}>
            <Link2 className="h-4 w-4 mr-1.5" /> Attach existing
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Schedule meeting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Live now", value: live.length, Icon: Radio, tone: "text-destructive" },
          { label: "Upcoming", value: upcoming.length, Icon: Video, tone: "text-primary" },
          { label: "Past", value: past.length, Icon: Video, tone: "text-muted-foreground" },
          { label: "Recordings", value: meetings.reduce((s, m) => s + m.recordings.length, 0), Icon: FileVideo, tone: "text-amber-600" },
        ].map(s => (
          <Card key={s.label} className="p-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
              <s.Icon className={`h-3.5 w-3.5 ${s.tone}`} />
            </div>
            <div className="text-2xl font-semibold mt-1">{s.value}</div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={live.length ? "live" : "upcoming"}>
        <TabsList>
          <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {live.map(m => <MeetingCard key={m.id} m={m} showBatch={false} />)}
          {!live.length && <Card className="p-8 text-center text-sm text-muted-foreground md:col-span-2">No live meetings.</Card>}
        </TabsContent>
        <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {upcoming.map(m => <MeetingCard key={m.id} m={m} showBatch={false} />)}
          {!upcoming.length && (
            <Card className="p-8 text-center md:col-span-2">
              <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No upcoming sessions.</p>
              <Button size="sm" className="mt-3" onClick={() => setOpen(true)}>
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Schedule meeting
              </Button>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="past" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {past.map(m => <MeetingCard key={m.id} m={m} showBatch={false} />)}
          {!past.length && <Card className="p-8 text-center text-sm text-muted-foreground md:col-span-2">No past sessions yet.</Card>}
        </TabsContent>
      </Tabs>

      <ScheduleMeetingDrawer
        open={open}
        onOpenChange={setOpen}
        defaultBatchId={batchId}
        defaultBatchName={batchName}
      />

      <Dialog open={attachOpen} onOpenChange={setAttachOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Attach existing meeting</DialogTitle>
            <DialogDescription>Pick an unassigned meeting to attach to {batchName}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {unassigned.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No unassigned meetings.</p>
            )}
            {unassigned.map(m => (
              <Card key={m.id} className="p-3 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{m.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(m.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} · {m.trainerName}
                  </div>
                </div>
                <Button size="sm" onClick={() => {
                  attach(m.id, batchId, batchName);
                  toast({ title: "Meeting attached", description: m.title });
                  setAttachOpen(false);
                }}>Attach</Button>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
