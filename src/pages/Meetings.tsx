import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Video, Plus, Calendar as CalendarIcon, FileVideo, Radio } from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import { BBB_INTEGRATION_STATUS } from "@/lib/bbbConfig";
import { MeetingScheduleSheet } from "@/components/meetings/MeetingScheduleSheet";
import { MeetingsListPanel } from "@/components/meetings/MeetingsListPanel";

export default function Meetings() {
  const meetings = useMeetingStore((s) => s.meetings);
  const [open, setOpen] = useState(false);

  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description="Schedule and run live training sessions. Powered by BigBlueButton."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status="warning" label={`BBB ${BBB_INTEGRATION_STATUS}`} size="sm" />
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Schedule Meeting
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Live Now" value={live.length} icon={Radio} size="compact" />
        <StatCard title="Upcoming" value={upcoming.length} icon={CalendarIcon} size="compact" />
        <StatCard title="Past Sessions" value={past.length} icon={Video} size="compact" />
        <StatCard title="Recordings" value={meetings.reduce((s, m) => s + m.recordings.length, 0)} icon={FileVideo} size="compact" />
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="mt-4">
          <MeetingsListPanel meetings={live} emptyText="No live meetings right now." />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <MeetingsListPanel meetings={upcoming} emptyText="Nothing scheduled." />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <MeetingsListPanel meetings={past} emptyText="No past sessions yet." />
        </TabsContent>
      </Tabs>

      <MeetingScheduleSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}
