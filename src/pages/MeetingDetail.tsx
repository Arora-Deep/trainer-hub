import { useSearchParams, useNavigate, useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMeetingStore } from "@/stores/meetingStore";
import { useBatchStore } from "@/stores/batchStore";
import {
  PlayCircle, ExternalLink, Trash2, FileVideo, Download, Calendar, Clock, Users, Video, Ban, Link2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AttendanceTable } from "@/components/meetings/AttendanceTable";
import { EngagementPanel } from "@/components/meetings/EngagementPanel";
import { useState } from "react";

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function MeetingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const meeting = useMeetingStore((s) => s.getMeeting(id!));
  const del = useMeetingStore((s) => s.deleteMeeting);
  const cancel = useMeetingStore((s) => s.cancelMeeting);
  const attach = useMeetingStore((s) => s.attachToBatch);
  const update = useMeetingStore((s) => s.updateMeeting);
  const batches = useBatchStore((s) => s.batches);

  const [attachBatchId, setAttachBatchId] = useState("");

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Meeting not found.</p>
        <Button onClick={() => nav("/meetings")}>Back</Button>
      </div>
    );
  }

  const join = () => {
    toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
    window.open(meeting.bbb.joinUrlMock, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `/student/meeting/${meeting.id}`);
    toast({ title: "Student link copied" });
  };

  const handleAttach = () => {
    if (!attachBatchId) return;
    const b = batches.find(x => x.id === attachBatchId)!;
    attach(meeting.id, b.id, b.name);
    toast({ title: "Attached to batch", description: b.name });
    setAttachBatchId("");
  };

  const statusKind = meeting.status === "live" ? "success" : meeting.status === "scheduled" ? "warning" : meeting.status === "cancelled" ? "destructive" : "default";
  const isEnded = meeting.status === "ended";
  const defaultTab = params.get("tab") || (isEnded ? "report" : "overview");

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Meetings", href: "/meetings" }, { label: meeting.title }]}
        title={meeting.title}
        description={`${meeting.batchName ?? "Unassigned"} • ${meeting.trainerName}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLink}><Link2 className="h-4 w-4 mr-1.5" /> Copy link</Button>
            {meeting.status !== "ended" && meeting.status !== "cancelled" && (
              <Button variant="outline" size="sm" onClick={() => { cancel(meeting.id); toast({ title: "Meeting cancelled" }); }}>
                <Ban className="h-4 w-4 mr-1.5" /> Cancel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => { del(meeting.id); nav("/meetings"); }}>
              <Trash2 className="h-4 w-4 mr-1.5" /> Delete
            </Button>
            {meeting.status !== "ended" && meeting.status !== "cancelled" && (
              <Button onClick={join}>
                <PlayCircle className="h-4 w-4 mr-1.5" />
                {meeting.status === "live" ? "Join now" : "Start"}
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            )}
          </div>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <StatusBadge status={statusKind as any} label={meeting.status} size="sm" pulse={meeting.status === "live"} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> When</div>
            <div className="font-medium">{fmt(meeting.scheduledAt)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="h-3 w-3" /> Duration</div>
            <div className="font-medium">{meeting.durationMins} min</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Users className="h-3 w-3" /> Capacity</div>
            <div className="font-medium">{meeting.totalInvited} / {meeting.settings.maxAttendees}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Kind</div>
            <Badge variant="outline" className="text-[10px] capitalize">{meeting.kind.replace("-", " ")}</Badge>
          </div>
        </div>
        {meeting.description && (
          <div className="mt-4 pt-4 border-t text-sm">
            <div className="text-xs text-muted-foreground mb-1">Description</div>
            <p>{meeting.description}</p>
          </div>
        )}
        {!meeting.batchId && meeting.kind !== "office-hours" && (
          <div className="mt-4 pt-4 border-t flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Attach to a batch:</span>
            <Select value={attachBatchId} onValueChange={setAttachBatchId}>
              <SelectTrigger className="h-8 w-[240px]"><SelectValue placeholder="Pick a batch" /></SelectTrigger>
              <SelectContent>
                {batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" disabled={!attachBatchId} onClick={handleAttach}>Attach</Button>
          </div>
        )}
      </Card>

      <Tabs value={defaultTab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isEnded && <TabsTrigger value="report">Report</TabsTrigger>}
          <TabsTrigger value="recordings">Recordings ({meeting.recordings.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Agenda</div>
              {meeting.agenda.length === 0
                ? <p className="text-xs text-muted-foreground">No agenda set.</p>
                : <ul className="text-sm space-y-1">{meeting.agenda.map((a, i) => <li key={i} className="text-muted-foreground">· {a}</li>)}</ul>}
            </Card>
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Prerequisites</div>
              {meeting.prerequisites.length === 0
                ? <p className="text-xs text-muted-foreground">None.</p>
                : <ul className="text-sm space-y-1">{meeting.prerequisites.map((a, i) => <li key={i} className="text-muted-foreground">· {a}</li>)}</ul>}
            </Card>
          </div>
          {meeting.status === "live" && meeting.attendance.length > 0 && (
            <Card className="p-4">
              <div className="text-sm font-semibold mb-3 flex items-center gap-2"><Users className="h-4 w-4" /> In the room now ({meeting.attendance.filter(a => a.status !== "absent").length})</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {meeting.attendance.filter(a => a.status !== "absent").map(a => (
                  <div key={a.studentId} className="flex items-center gap-2 text-xs p-2 rounded border border-border">
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-medium">{a.name.split(" ").map(n => n[0]).slice(0, 2).join("")}</div>
                    <span className="truncate">{a.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {isEnded && (
          <TabsContent value="report" className="space-y-6 mt-4">
            <AttendanceTable meeting={meeting} />
            <div>
              <div className="text-sm font-semibold mb-2">Engagement</div>
              <EngagementPanel meeting={meeting} />
            </div>
          </TabsContent>
        )}

        <TabsContent value="recordings" className="space-y-2 mt-4">
          {meeting.recordings.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">
              <FileVideo className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No recordings available.
            </Card>
          )}
          {meeting.recordings.map((r) => (
            <Card key={r.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.durationMins} min • {r.sizeMb} MB • {fmt(r.recordedAt)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><PlayCircle className="h-3.5 w-3.5 mr-1.5" /> Play</Button>
                <Button size="sm" variant="ghost"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card className="p-5 space-y-3">
            {[
              { k: "record", label: "Record session" },
              { k: "muteOnJoin", label: "Mute on join" },
              { k: "waitingRoom", label: "Waiting room" },
              { k: "allowChat", label: "Allow chat" },
              { k: "allowScreenShare", label: "Allow screen share" },
              { k: "raiseHand", label: "Allow raise hand" },
            ].map((s) => (
              <div key={s.k} className="flex items-center justify-between py-1">
                <Label>{s.label}</Label>
                <Switch
                  checked={(meeting.settings as any)[s.k]}
                  onCheckedChange={(v) => update(meeting.id, { settings: { ...meeting.settings, [s.k]: v } })}
                />
              </div>
            ))}
            <div className="pt-3 border-t text-xs text-muted-foreground">
              BBB-specific options (breakout rooms, layouts) will surface once BigBlueButton is connected.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
