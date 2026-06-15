import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useMeetingStore } from "@/stores/meetingStore";
import { useBatchStore } from "@/stores/batchStore";
import { useTrainerStore } from "@/stores/trainerStore";
import { toast } from "@/hooks/use-toast";
import { Video } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, the batch is pre-selected and locked */
  lockedBatchId?: string;
  /** When set, the trainer is pre-selected */
  defaultTrainerId?: string;
  onCreated?: (meetingId: string) => void;
}

/**
 * Single source-of-truth scheduler used from Meetings page, BatchDetails MeetingsTab,
 * LiveTraining and LiveClass. The form mirrors fields that BigBlueButton's /create
 * endpoint expects so the edge function can forward them verbatim later.
 */
export function MeetingScheduleSheet({ open, onOpenChange, lockedBatchId, defaultTrainerId, onCreated }: Props) {
  const addMeeting = useMeetingStore((s) => s.addMeeting);
  const batches = useBatchStore((s) => s.batches);
  const trainers = useTrainerStore((s) => s.trainers);

  const [form, setForm] = useState({
    title: "",
    description: "",
    batchId: lockedBatchId ?? "",
    trainerId: defaultTrainerId ?? "",
    date: "",
    time: "10:00",
    durationMins: 60,
    maxAttendees: 50,
    welcome: "Welcome! Your trainer will start shortly.",
    // BBB knobs
    record: true,
    autoStartRecording: false,
    allowStartStopRecording: true,
    muteOnStart: true,
    allowModsToUnmuteUsers: true,
    webcamsOnlyForModerator: false,
    waitingRoom: false,
    guestPolicy: "ALWAYS_ACCEPT" as "ALWAYS_ACCEPT" | "ASK_MODERATOR" | "ALWAYS_DENY",
    layout: "CUSTOM_LAYOUT" as "CUSTOM_LAYOUT" | "PRESENTATION_FOCUS" | "VIDEO_FOCUS",
    breakoutRoomsEnabled: false,
    lockSettingsDisableCam: false,
    lockSettingsDisableMic: false,
    lockSettingsDisablePrivateChat: false,
    lockSettingsDisablePublicChat: false,
    lockSettingsDisableNote: false,
  });

  useEffect(() => {
    if (lockedBatchId) setForm((f) => ({ ...f, batchId: lockedBatchId }));
  }, [lockedBatchId]);

  const submit = () => {
    if (!form.title.trim() || !form.date) {
      toast({ title: "Title and date are required", variant: "destructive" });
      return;
    }
    const batch = batches.find((b) => b.id === form.batchId);
    const trainer = trainers.find((t) => t.id === form.trainerId);
    const iso = new Date(`${form.date}T${form.time}:00`).toISOString();
    const id = addMeeting({
      title: form.title.trim(),
      description: form.description.trim(),
      batchId: form.batchId || undefined,
      batchName: batch?.name,
      trainerId: form.trainerId || undefined,
      trainerName: trainer?.name,
      scheduledAt: iso,
      durationMins: Number(form.durationMins),
      welcome: form.welcome,
      record: form.record,
      muteOnJoin: form.muteOnStart,
      waitingRoom: form.waitingRoom || form.guestPolicy === "ASK_MODERATOR",
      maxAttendees: Number(form.maxAttendees),
      invitedCount: batch?.participants.length,
    });
    // Persist BBB-shaped config so the edge function can pick it up later
    useMeetingStore.getState().updateMeeting(id, {
      bbb: {
        meetingID: `bbb-${id}`,
        attendeePW: `ap-${Math.random().toString(36).slice(2, 10)}`,
        moderatorPW: `mp-${Math.random().toString(36).slice(2, 10)}`,
        record: form.record,
        autoStartRecording: form.autoStartRecording,
        allowStartStopRecording: form.allowStartStopRecording,
        muteOnStart: form.muteOnStart,
        allowModsToUnmuteUsers: form.allowModsToUnmuteUsers,
        webcamsOnlyForModerator: form.webcamsOnlyForModerator,
        guestPolicy: form.guestPolicy,
        layout: form.layout,
        breakoutRoomsEnabled: form.breakoutRoomsEnabled,
        lockSettingsDisableCam: form.lockSettingsDisableCam,
        lockSettingsDisableMic: form.lockSettingsDisableMic,
        lockSettingsDisablePrivateChat: form.lockSettingsDisablePrivateChat,
        lockSettingsDisablePublicChat: form.lockSettingsDisablePublicChat,
        lockSettingsDisableNote: form.lockSettingsDisableNote,
        meta: { batchId: form.batchId, trainerId: form.trainerId, source: "cloudadda" },
      },
    });
    toast({ title: "Meeting scheduled", description: batch ? `Attached to ${batch.name}.` : "Saved." });
    onOpenChange(false);
    onCreated?.(id);
    setForm({ ...form, title: "", description: "", date: "", welcome: form.welcome });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[520px] sm:max-w-[520px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Video className="h-4 w-4 text-primary" /> Schedule Meeting
          </SheetTitle>
          <SheetDescription>
            Saved as a BigBlueButton room template. Live join opens once the BBB integration is wired.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Day 14 — Collections Deep Dive" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will you cover?" />
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
              <Input type="number" min={5} value={form.durationMins} onChange={(e) => setForm({ ...form, durationMins: +e.target.value })} />
            </div>
            <div>
              <Label>Max Attendees</Label>
              <Input type="number" min={1} value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: +e.target.value })} />
            </div>
          </div>

          <div>
            <Label>Batch {lockedBatchId && <Badge variant="secondary" className="ml-2 text-[10px]">locked</Badge>}</Label>
            <Select value={form.batchId} disabled={!!lockedBatchId} onValueChange={(v) => setForm({ ...form, batchId: v })}>
              <SelectTrigger><SelectValue placeholder="Attach to a batch" /></SelectTrigger>
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

          <Accordion type="single" collapsible defaultValue="basic">
            <AccordionItem value="basic">
              <AccordionTrigger className="text-sm">Recording & Audio</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <ToggleRow label="Record session" desc="Saves the meeting to cloud recordings." checked={form.record} onChange={(v) => setForm({ ...form, record: v })} />
                <ToggleRow label="Auto-start recording" desc="Begin recording when the moderator joins." checked={form.autoStartRecording} onChange={(v) => setForm({ ...form, autoStartRecording: v })} disabled={!form.record} />
                <ToggleRow label="Allow start/stop recording" desc="Moderators can pause and resume the recording." checked={form.allowStartStopRecording} onChange={(v) => setForm({ ...form, allowStartStopRecording: v })} disabled={!form.record} />
                <ToggleRow label="Mute everyone on join" desc="All viewers join with their mic muted." checked={form.muteOnStart} onChange={(v) => setForm({ ...form, muteOnStart: v })} />
                <ToggleRow label="Allow mods to unmute users" desc="Moderators can unmute viewers without consent." checked={form.allowModsToUnmuteUsers} onChange={(v) => setForm({ ...form, allowModsToUnmuteUsers: v })} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="lobby">
              <AccordionTrigger className="text-sm">Lobby & Access</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <ToggleRow label="Waiting room" desc="Moderator must admit each guest." checked={form.waitingRoom} onChange={(v) => setForm({ ...form, waitingRoom: v })} />
                <div>
                  <Label className="text-xs">Guest Policy</Label>
                  <Select value={form.guestPolicy} onValueChange={(v: any) => setForm({ ...form, guestPolicy: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALWAYS_ACCEPT">Always accept</SelectItem>
                      <SelectItem value="ASK_MODERATOR">Ask moderator</SelectItem>
                      <SelectItem value="ALWAYS_DENY">Always deny</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Default Layout</Label>
                  <Select value={form.layout} onValueChange={(v: any) => setForm({ ...form, layout: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOM_LAYOUT">Custom</SelectItem>
                      <SelectItem value="PRESENTATION_FOCUS">Presentation focus</SelectItem>
                      <SelectItem value="VIDEO_FOCUS">Video focus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="locks">
              <AccordionTrigger className="text-sm">Lock Settings</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <ToggleRow label="Webcams only for moderator" desc="Viewers can't share webcam." checked={form.webcamsOnlyForModerator} onChange={(v) => setForm({ ...form, webcamsOnlyForModerator: v })} />
                <ToggleRow label="Disable viewer cam" checked={form.lockSettingsDisableCam} onChange={(v) => setForm({ ...form, lockSettingsDisableCam: v })} />
                <ToggleRow label="Disable viewer mic" checked={form.lockSettingsDisableMic} onChange={(v) => setForm({ ...form, lockSettingsDisableMic: v })} />
                <ToggleRow label="Disable public chat" checked={form.lockSettingsDisablePublicChat} onChange={(v) => setForm({ ...form, lockSettingsDisablePublicChat: v })} />
                <ToggleRow label="Disable private chat" checked={form.lockSettingsDisablePrivateChat} onChange={(v) => setForm({ ...form, lockSettingsDisablePrivateChat: v })} />
                <ToggleRow label="Disable shared notes" checked={form.lockSettingsDisableNote} onChange={(v) => setForm({ ...form, lockSettingsDisableNote: v })} />
                <ToggleRow label="Enable breakout rooms" checked={form.breakoutRoomsEnabled} onChange={(v) => setForm({ ...form, breakoutRoomsEnabled: v })} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background pb-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={submit}>Schedule</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ToggleRow({ label, desc, checked, onChange, disabled }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${disabled ? "opacity-50" : ""}`}>
      <div className="min-w-0">
        <Label className="cursor-pointer text-sm">{label}</Label>
        {desc && <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
