import { Link, useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMeetingStore } from "@/stores/meetingStore";
import { PlayCircle, ExternalLink, Trash2, FileVideo, Download, Users, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export default function MeetingDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const meeting = useMeetingStore((s) => s.getMeeting(id!));
  const del = useMeetingStore((s) => s.deleteMeeting);

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Meeting not found.</p>
        <Button onClick={() => nav("/meetings")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Meetings", href: "/meetings" }, { label: meeting.title }]}
        title={meeting.title}
        description={`${meeting.batchName ?? "No batch"} • ${meeting.trainerName ?? "No trainer"}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { del(meeting.id); nav("/meetings"); }}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
            <Button
              onClick={() => {
                toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
                window.open(meeting.joinUrl, "_blank");
              }}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              {meeting.status === "live" ? "Join Now" : meeting.status === "scheduled" ? "Open BBB Room" : "Review"}
              <ExternalLink className="h-3.5 w-3.5 ml-2" />
            </Button>
          </div>
        }
      />

      <Card className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <StatusBadge
              status={meeting.status === "live" ? "success" : meeting.status === "scheduled" ? "warning" : "default"}
              label={meeting.status}
              size="sm"
              pulse={meeting.status === "live"}
            />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">When</div>
            <div className="font-medium">{fmt(meeting.scheduledAt)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Duration</div>
            <div className="font-medium">{meeting.durationMins} min</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Capacity</div>
            <div className="font-medium">{meeting.attendees.length} / {meeting.maxAttendees}</div>
          </div>
        </div>
        {meeting.welcome && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-muted-foreground mb-1">Welcome message</div>
            <p className="text-sm">{meeting.welcome}</p>
          </div>
        )}
      </Card>

      <Tabs defaultValue="attendees">
        <TabsList>
          <TabsTrigger value="attendees">Attendees ({meeting.attendees.length})</TabsTrigger>
          <TabsTrigger value="recordings">Recordings ({meeting.recordings.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="attendees" className="space-y-2 mt-4">
          {meeting.attendees.length === 0 && (
            <Card className="p-8 text-sm text-muted-foreground text-center">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              No attendees recorded yet.
            </Card>
          )}
          {meeting.attendees.map((a) => (
            <Card key={a.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback>{initials(a.name)}</AvatarFallback></Avatar>
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={a.role === "moderator" ? "default" : "secondary"} className="text-[10px]">{a.role}</Badge>
                {a.joinedAt && <span className="text-xs text-muted-foreground">Joined {a.joinedAt}</span>}
              </div>
            </Card>
          ))}
        </TabsContent>

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
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Record session</Label>
                <p className="text-xs text-muted-foreground">Save the session to cloud recordings.</p>
              </div>
              <Switch checked={meeting.record} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mute on join</Label>
                <p className="text-xs text-muted-foreground">All attendees join muted.</p>
              </div>
              <Switch checked={meeting.muteOnJoin} disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Waiting room</Label>
                <p className="text-xs text-muted-foreground">Moderator must approve each guest.</p>
              </div>
              <Switch checked={meeting.waitingRoom} disabled />
            </div>
            <div className="pt-3 border-t text-xs text-muted-foreground">
              BBB-specific options (camera lock, layout, breakout rooms) will be editable once BigBlueButton integration is connected.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
