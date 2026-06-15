import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useBatchStore } from "@/stores/batchStore";
import { useTrainerStore } from "@/stores/trainerStore";
import { useMeetingStore, MeetingKind, MeetingVisibility } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBatchId?: string;
  defaultBatchName?: string;
  onCreated?: (id: string) => void;
}

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";

export function ScheduleMeetingDrawer({ open, onOpenChange, defaultBatchId, defaultBatchName, onCreated }: Props) {
  const batches = useBatchStore((s) => s.batches);
  const trainers = useTrainerStore((s) => s.trainers);
  const addMeeting = useMeetingStore((s) => s.addMeeting);

  const [form, setForm] = useState({
    title: "",
    description: "",
    kind: "batch-session" as MeetingKind,
    date: "",
    time: "10:00",
    durationMins: 60,
    timezone: tz,
    batchId: defaultBatchId || "",
    trainerId: "",
    coHostIds: [] as string[],
    visibility: "batch" as MeetingVisibility,
    inviteeIds: [] as string[],
    agendaText: "",
    prerequisitesText: "",
    record: true,
    muteOnJoin: true,
    waitingRoom: false,
    allowChat: true,
    allowScreenShare: true,
    raiseHand: true,
    maxAttendees: 50,
    recurring: false,
    recurrenceUntil: "",
    recurrenceDays: [] as number[],
  });

  const reset = () => setForm((f) => ({
    ...f, title: "", description: "", date: "", agendaText: "", prerequisitesText: "",
    recurring: false, recurrenceDays: [], recurrenceUntil: "",
  }));

  const submit = () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (!form.date) { toast({ title: "Date required", variant: "destructive" }); return; }
    if (!form.trainerId) { toast({ title: "Pick a trainer", variant: "destructive" }); return; }
    const batch = batches.find((b) => b.id === form.batchId);
    const trainer = trainers.find((t) => t.id === form.trainerId);
    const iso = new Date(`${form.date}T${form.time}:00`).toISOString();
    const id = addMeeting({
      title: form.title,
      description: form.description || undefined,
      kind: form.kind,
      batchId: form.batchId || undefined,
      batchName: batch?.name ?? defaultBatchName,
      trainerId: form.trainerId,
      trainerName: trainer?.name ?? "Unknown",
      coHostIds: form.coHostIds,
      scheduledAt: iso,
      durationMins: Number(form.durationMins),
      timezone: form.timezone,
      visibility: form.kind === "office-hours" ? "invitees" : form.visibility,
      inviteeIds: form.inviteeIds,
      recurrence: form.recurring && form.recurrenceUntil
        ? { freq: "weekly", byDay: form.recurrenceDays, until: form.recurrenceUntil }
        : undefined,
      settings: {
        record: form.record, muteOnJoin: form.muteOnJoin, waitingRoom: form.waitingRoom,
        allowChat: form.allowChat, allowScreenShare: form.allowScreenShare,
        raiseHand: form.raiseHand, maxAttendees: Number(form.maxAttendees), lockSettings: false,
      },
      agenda: form.agendaText.split("\n").map((s) => s.trim()).filter(Boolean),
      prerequisites: form.prerequisitesText.split("\n").map((s) => s.trim()).filter(Boolean),
      materials: [],
      totalInvited: batch ? (batch.participants?.length || 12) : (form.inviteeIds.length || 8),
    });
    toast({ title: "Meeting scheduled", description: form.title });
    reset();
    onOpenChange(false);
    onCreated?.(id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Schedule meeting</SheetTitle>
          <SheetDescription>Create a live session. You can attach a batch now or later.</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="basics" className="mt-5">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basics" className="text-xs">Basics</TabsTrigger>
            <TabsTrigger value="when" className="text-xs">When</TabsTrigger>
            <TabsTrigger value="who" className="text-xs">Who</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4 mt-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. AWS VPC Deep Dive — Day 14" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Kind</Label>
              <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v as MeetingKind })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="batch-session">Batch session (recurring class)</SelectItem>
                  <SelectItem value="ad-hoc">Ad-hoc (one-off)</SelectItem>
                  <SelectItem value="office-hours">Office hours (1:1 / small group)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agenda (one per line)</Label>
              <Textarea rows={3} value={form.agendaText} onChange={(e) => setForm({ ...form, agendaText: e.target.value })} placeholder={"Topic 1\nTopic 2"} />
            </div>
            <div>
              <Label>Prerequisites (one per line)</Label>
              <Textarea rows={2} value={form.prerequisitesText} onChange={(e) => setForm({ ...form, prerequisitesText: e.target.value })} />
            </div>
          </TabsContent>

          <TabsContent value="when" className="space-y-4 mt-4">
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
                <Label>Timezone</Label>
                <Input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="cursor-pointer">Recurring weekly</Label>
                <p className="text-xs text-muted-foreground">Repeat on selected days until a date.</p>
              </div>
              <Switch checked={form.recurring} onCheckedChange={(v) => setForm({ ...form, recurring: v })} />
            </div>
            {form.recurring && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div>
                  <Label className="text-xs">Days</Label>
                  <div className="flex gap-1 mt-1.5">
                    {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => {
                      const active = form.recurrenceDays.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({
                            ...form,
                            recurrenceDays: active
                              ? form.recurrenceDays.filter((x) => x !== i)
                              : [...form.recurrenceDays, i],
                          })}
                          className={`h-8 w-8 rounded-md border text-xs font-medium transition ${active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                        >{d}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Repeat until</Label>
                  <Input type="date" value={form.recurrenceUntil} onChange={(e) => setForm({ ...form, recurrenceUntil: e.target.value })} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="who" className="space-y-4 mt-4">
            <div>
              <Label>Trainer (host) *</Label>
              <Select value={form.trainerId} onValueChange={(v) => setForm({ ...form, trainerId: v })}>
                <SelectTrigger><SelectValue placeholder="Pick a trainer" /></SelectTrigger>
                <SelectContent>
                  {trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Batch {form.kind === "office-hours" ? "(optional)" : ""}</Label>
              <Select value={form.batchId || "__none__"} onValueChange={(v) => setForm({ ...form, batchId: v === "__none__" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Attach to a batch (or leave unassigned)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— No batch (attach later) —</SelectItem>
                  {batches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {!form.batchId && (
                <p className="text-[11px] text-muted-foreground mt-1.5">Unassigned meetings show in the Meetings list and can be attached from Batch Details later.</p>
              )}
            </div>
            {form.kind === "office-hours" && (
              <div>
                <Label>Invitees</Label>
                <div className="rounded-lg border border-border p-2 mt-1.5 space-y-1.5">
                  {form.inviteeIds.length === 0 && <p className="text-xs text-muted-foreground p-2">No invitees yet.</p>}
                  {form.inviteeIds.map((id) => (
                    <div key={id} className="flex items-center justify-between bg-muted/50 rounded px-2 py-1.5">
                      <span className="text-xs">{id}</span>
                      <button onClick={() => setForm({ ...form, inviteeIds: form.inviteeIds.filter((x) => x !== id) })}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-1">
                    <Input
                      placeholder="student-id"
                      className="h-8 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const v = (e.target as HTMLInputElement).value.trim();
                          if (v) setForm({ ...form, inviteeIds: [...form.inviteeIds, v] });
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Press Enter to add. Use student IDs from your batch.</p>
              </div>
            )}
            <div>
              <Label>Visibility</Label>
              <Select value={form.visibility} onValueChange={(v) => setForm({ ...form, visibility: v as MeetingVisibility })} disabled={form.kind === "office-hours"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="batch">Batch members only</SelectItem>
                  <SelectItem value="invitees">Specific invitees</SelectItem>
                  <SelectItem value="public-in-company">All trainers & students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-3 mt-4">
            {[
              { k: "record", label: "Record session", hint: "Save to cloud recordings." },
              { k: "muteOnJoin", label: "Mute on join", hint: "Attendees join muted." },
              { k: "waitingRoom", label: "Waiting room", hint: "Moderator approves each entrant." },
              { k: "allowChat", label: "Allow chat", hint: "Show the room chat panel." },
              { k: "allowScreenShare", label: "Allow attendee screen share", hint: "" },
              { k: "raiseHand", label: "Allow raise hand", hint: "" },
            ].map((s) => (
              <div key={s.k} className="flex items-center justify-between py-1">
                <div>
                  <Label className="cursor-pointer">{s.label}</Label>
                  {s.hint && <p className="text-[11px] text-muted-foreground">{s.hint}</p>}
                </div>
                <Switch
                  checked={(form as any)[s.k]}
                  onCheckedChange={(v) => setForm({ ...form, [s.k]: v } as any)}
                />
              </div>
            ))}
            <div>
              <Label>Max attendees</Label>
              <Input type="number" value={form.maxAttendees} onChange={(e) => setForm({ ...form, maxAttendees: +e.target.value })} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between gap-2 pt-6 mt-4 border-t">
          <Badge variant="outline" className="text-[10px]">BBB integration pending</Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={submit}><Plus className="h-4 w-4 mr-1.5" />Schedule</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
