import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Plus, PlayCircle, Calendar as CalendarIcon, FileVideo, ExternalLink, Radio } from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import { useBatchStore } from "@/stores/batchStore";
import { useTrainerStore } from "@/stores/trainerStore";
import { toast } from "@/hooks/use-toast";
import { BBB_INTEGRATION_STATUS } from "@/lib/bbbConfig";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function Meetings() {
  const meetings = useMeetingStore((s) => s.meetings);
  const addMeeting = useMeetingStore((s) => s.addMeeting);
  const batches = useBatchStore((s) => s.batches);
  const trainers = useTrainerStore((s) => s.trainers);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", batchId: "", trainerId: "", date: "", time: "10:00", durationMins: 60,
    welcome: "", record: true, muteOnJoin: true, waitingRoom: false, maxAttendees: 50,
  });

  const live = meetings.filter((m) => m.status === "live");
  const upcoming = meetings.filter((m) => m.status === "scheduled").sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
  const past = meetings.filter((m) => m.status === "ended").sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt));

  const submit = () => {
    if (!form.title || !form.date) {
      toast({ title: "Title and date are required", variant: "destructive" });
      return;
    }
    const batch = batches.find((b) => b.id === form.batchId);
    const trainer = trainers.find((t) => t.id === form.trainerId);
    const iso = new Date(`${form.date}T${form.time}:00`).toISOString();
    addMeeting({
      title: form.title,
      batchId: form.batchId || undefined, batchName: batch?.name,
      trainerId: form.trainerId || undefined, trainerName: trainer?.name,
      scheduledAt: iso,
      durationMins: Number(form.durationMins),
      welcome: form.welcome,
      record: form.record, muteOnJoin: form.muteOnJoin, waitingRoom: form.waitingRoom,
      maxAttendees: Number(form.maxAttendees),
    });
    toast({ title: "Meeting scheduled" });
    setOpen(false);
    setForm({ ...form, title: "", batchId: "", trainerId: "", date: "", welcome: "" });
  };

  const Card1 = ({ m }: { m: typeof meetings[number] }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <Link to={`/meetings/${m.id}`} className="text-sm font-semibold hover:underline truncate block">{m.title}</Link>
          <div className="text-xs text-muted-foreground mt-0.5">
            {m.batchName ?? "—"} • {m.trainerName ?? "—"}
          </div>
        </div>
        <StatusBadge
          status={m.status === "live" ? "success" : m.status === "scheduled" ? "warning" : "default"}
          label={m.status}
          size="sm"
          pulse={m.status === "live"}
        />
      </div>
      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <CalendarIcon className="h-3 w-3" /> {fmt(m.scheduledAt)} • {m.durationMins} min
      </div>
      <div className="flex items-center gap-2">
        {m.status === "ended" && m.recordings.length > 0 ? (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/meetings/${m.id}`}><FileVideo className="h-3.5 w-3.5 mr-1.5" /> Recording</Link>
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
              window.open(m.joinUrl, "_blank");
            }}
          >
            <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
            {m.status === "live" ? "Join Now" : "Start"}
          </Button>
        )}
        <Button size="sm" variant="ghost" asChild>
          <Link to={`/meetings/${m.id}`}>Details</Link>
        </Button>
      </div>
    </Card>
  );

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
          <TabsTrigger value="live">Live Now ({live.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {live.map((m) => <Card1 key={m.id} m={m} />)}
          {!live.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">No live meetings right now.</Card>}
        </TabsContent>
        <TabsContent value="upcoming" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {upcoming.map((m) => <Card1 key={m.id} m={m} />)}
          {!upcoming.length && <Card className="p-8 text-sm text-muted-foreground text-center md:col-span-2">Nothing scheduled.</Card>}
        </TabsContent>
        <TabsContent value="past" className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {past.map((m) => <Card1 key={m.id} m={m} />)}
        </TabsContent>
      </Tabs>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[480px] overflow-y-auto">
          <SheetHeader><SheetTitle>Schedule Meeting</SheetTitle></SheetHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date *</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: +e.target.value })} />
              </div>
              <div>
                <Label>Max Attendees</Label>
                <Input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: +e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Batch</Label>
              <Select value={form.batchId} onValueChange={(v) => setForm({ ...form, batchId: v })}>
                <SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Trainer</Label>
              <Select value={form.trainerId} onValueChange={(v) => setForm({ ...form, trainerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select trainer" /></SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Welcome Message</Label>
              <Textarea rows={2} value={form.welcome} onChange={(e) => setForm({ ...form, welcome: e.target.value })} />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Record session</Label>
                <Switch checked={form.record} onCheckedChange={(v) => setForm({ ...form, record: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Mute on join</Label>
                <Switch checked={form.muteOnJoin} onCheckedChange={(v) => setForm({ ...form, muteOnJoin: v })} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="cursor-pointer">Waiting room</Label>
                <Switch checked={form.waitingRoom} onCheckedChange={(v) => setForm({ ...form, waitingRoom: v })} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit}>Schedule</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
