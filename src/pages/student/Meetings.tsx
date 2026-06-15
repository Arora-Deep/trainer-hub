import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/StatCard";
import { Video, Calendar as CalendarIcon, FileVideo, Radio } from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import { MeetingsListPanel } from "@/components/meetings/MeetingsListPanel";

/**
 * Student Meetings — read-only view of all meetings attached to batches
 * the student belongs to. In the mock we just show every meeting; in
 * production this filters by the student's enrollments.
 */
export default function StudentMeetings() {
  const meetings = useMeetingStore((s) => s.meetings);

  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        description="All live sessions and recordings from your batches."
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Live Now" value={live.length} icon={Radio} size="compact" />
        <StatCard title="Upcoming" value={upcoming.length} icon={CalendarIcon} size="compact" />
        <StatCard title="Past Sessions" value={past.length} icon={Video} size="compact" />
        <StatCard title="Recordings" value={meetings.reduce((s, m) => s + m.recordings.length, 0)} icon={FileVideo} size="compact" />
      </div>

      <Tabs defaultValue={live.length > 0 ? "live" : "upcoming"}>
        <TabsList>
          <TabsTrigger value="live">Live ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="mt-4">
          <MeetingsListPanel meetings={live} basePath="/student/meetings" viewer emptyText="Nothing live right now — check back at the scheduled time." />
        </TabsContent>
        <TabsContent value="upcoming" className="mt-4">
          <MeetingsListPanel meetings={upcoming} basePath="/student/meetings" viewer emptyText="No upcoming meetings." />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <MeetingsListPanel meetings={past} basePath="/student/meetings" viewer emptyText="No past meetings yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}
