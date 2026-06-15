import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Radio, PlayCircle, Calendar, Clock, Users, FileVideo, Video, Mic, Camera, ExternalLink,
} from "lucide-react";
import { useMeetingStore } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function StudentMeetingRoom() {
  const { id } = useParams();
  const nav = useNavigate();
  const meeting = useMeetingStore((s) => s.getMeeting(id!));

  if (!meeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Meeting not found.</p>
        <Button onClick={() => nav(-1)}>Back</Button>
      </div>
    );
  }

  const join = () => {
    toast({ title: "BBB integration pending", description: "Live rooms will open once BigBlueButton is connected." });
    window.open(meeting.bbb.joinUrlMock, "_blank");
  };

  const statusLabel = meeting.status === "live" ? "Live now"
    : meeting.status === "scheduled" ? "Scheduled"
    : meeting.status === "ended" ? "Ended"
    : "Cancelled";

  const minsUntil = Math.round((new Date(meeting.scheduledAt).getTime() - Date.now()) / 60_000);
  const canJoin = meeting.status === "live" || (meeting.status === "scheduled" && minsUntil <= 15);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Schedule", href: "/student/schedule" }, { label: meeting.title }]}
        title={meeting.title}
        description={`${meeting.trainerName} · ${meeting.batchName ?? "Office hours"}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          <Card className={`p-6 text-center space-y-4 ${meeting.status === "live" ? "border-destructive/40 bg-destructive/5" : ""}`}>
            {meeting.status === "live" && (
              <div className="inline-flex items-center gap-2">
                <Badge className="bg-destructive text-destructive-foreground gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE NOW
                </Badge>
              </div>
            )}
            <div className="space-y-1">
              <Radio className={`h-12 w-12 mx-auto ${meeting.status === "live" ? "text-destructive animate-pulse" : "text-muted-foreground"}`} />
              <p className="text-sm text-muted-foreground">{statusLabel}</p>
            </div>

            {meeting.status === "scheduled" && (
              <p className="text-sm">
                Starts at <span className="font-semibold">{fmt(meeting.scheduledAt)}</span>
                {minsUntil > 0 && minsUntil <= 60 && <span className="block text-xs text-muted-foreground mt-1">in {minsUntil} min</span>}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              {meeting.status === "ended" && meeting.recordings.length > 0 ? (
                <Button size="lg" onClick={() => toast({ title: "Recording playback (mock)" })}>
                  <FileVideo className="h-4 w-4 mr-2" /> Watch recording
                </Button>
              ) : (
                <Button size="lg" onClick={join} disabled={!canJoin}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  {meeting.status === "live" ? "Join room" : canJoin ? "Open room" : "Not open yet"}
                  <ExternalLink className="h-3.5 w-3.5 ml-2" />
                </Button>
              )}
            </div>

            {meeting.settings.waitingRoom && meeting.status !== "ended" && (
              <p className="text-[11px] text-muted-foreground">Waiting room is on — the moderator will let you in.</p>
            )}
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold mb-3">Pre-flight check</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { Icon: Mic, label: "Microphone" },
                { Icon: Camera, label: "Camera" },
                { Icon: Video, label: "Bandwidth" },
              ].map(({ Icon, label }) => (
                <div key={label} className="p-3 rounded-lg border border-border">
                  <Icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-[11px] font-medium">{label}</div>
                  <div className="text-[10px] text-success">Ready (mock)</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <div className="text-sm font-semibold">Details</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" /> {fmt(meeting.scheduledAt)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {meeting.durationMins} min
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {meeting.totalInvited} attendees
            </div>
          </Card>

          {meeting.agenda.length > 0 && (
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Agenda</div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {meeting.agenda.map((a, i) => <li key={i}>· {a}</li>)}
              </ul>
            </Card>
          )}

          {meeting.prerequisites.length > 0 && (
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Come prepared</div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {meeting.prerequisites.map((a, i) => <li key={i}>· {a}</li>)}
              </ul>
            </Card>
          )}

          {meeting.materials.length > 0 && (
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Materials</div>
              <div className="space-y-1.5">
                {meeting.materials.map(m => (
                  <a key={m.id} href={m.url} className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" /> {m.name}
                  </a>
                ))}
              </div>
            </Card>
          )}

          {meeting.courseId && (
            <Card className="p-4">
              <div className="text-sm font-semibold mb-1">From course</div>
              <Link to={`/student/courses/${meeting.courseId}`} className="text-xs text-primary hover:underline">Open course →</Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
