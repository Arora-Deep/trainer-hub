import { useState } from "react";
import { useBatchStore } from "@/stores/batchStore";
import { useMeetingStore } from "@/stores/meetingStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Radio, CalendarDays, FileVideo, BarChart3 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { MeetingScheduleSheet } from "@/components/meetings/MeetingScheduleSheet";
import { MeetingsListPanel } from "@/components/meetings/MeetingsListPanel";

interface MeetingsTabProps {
  /** Legacy prop kept for backward-compat — actual scoping uses the store. */
  batchName?: string;
  batchId?: string;
}

/**
 * Batch-scoped meetings tab. Reads from `meetingStore`, filtered to this batch.
 * Trainer can schedule a new meeting that is auto-attached to the current batch.
 */
export function MeetingsTab({ batchId }: MeetingsTabProps) {
  const batches = useBatchStore((s) => s.batches);
  const allMeetings = useMeetingStore((s) => s.meetings);
  const [open, setOpen] = useState(false);

  // Resolve the batch — fall back to the first batch if not provided (legacy usage)
  const batch = batchId ? batches.find((b) => b.id === batchId) : batches[0];
  if (!batch) {
    return <Card className="p-8 text-sm text-muted-foreground text-center">Batch not found.</Card>;
  }

  const meetings = allMeetings.filter((m) => m.batchId === batch.id);
  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold">Meetings for {batch.name}</h3>
          <p className="text-xs text-muted-foreground">All sessions attached to this batch — schedule, track and review.</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="warning" label="BBB pending" size="sm" />
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SmallStat label="Live" value={live.length} icon={<Radio className="h-3.5 w-3.5 text-success" />} />
        <SmallStat label="Upcoming" value={upcoming.length} icon={<CalendarDays className="h-3.5 w-3.5 text-amber-500" />} />
        <SmallStat label="Past" value={past.length} icon={<FileVideo className="h-3.5 w-3.5 text-muted-foreground" />} />
        <SmallStat label="Avg engagement" value={`${avg(past.map((p) => p.analytics?.engagementScore ?? 0))}%`} icon={<BarChart3 className="h-3.5 w-3.5 text-primary" />} />
      </div>

      <Tabs defaultValue={live.length > 0 ? "live" : "upcoming"}>
        <TabsList>
          <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="mt-4">
          <MeetingsListPanel meetings={live} emptyText="No live meeting right now." />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <MeetingsListPanel meetings={upcoming} emptyText="Nothing scheduled for this batch yet." />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <MeetingsListPanel meetings={past} emptyText="No past sessions yet." />
        </TabsContent>
      </Tabs>

      <MeetingScheduleSheet open={open} onOpenChange={setOpen} lockedBatchId={batch.id} />
    </div>
  );
}

function SmallStat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <Card className="p-3 flex items-center gap-3">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function avg(nums: number[]) {
  const valid = nums.filter((n) => n > 0);
  if (!valid.length) return 0;
  return Math.round(valid.reduce((s, n) => s + n, 0) / valid.length);
}
