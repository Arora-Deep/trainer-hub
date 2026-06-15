import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Calendar as CalendarIcon, PlayCircle, FileVideo, Clock, Users,
  Activity, BarChart3, Video as VideoIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Meeting } from "@/stores/meetingStore";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

interface Props {
  meetings: Meeting[];
  /** Routing prefix — student portal uses /student/meetings, others use /meetings */
  basePath?: string;
  /** When true, hides Start/Join controls and shows view-only actions (student) */
  viewer?: boolean;
  emptyText?: string;
}

export function MeetingsListPanel({ meetings, basePath = "/meetings", viewer = false, emptyText = "No meetings yet." }: Props) {
  if (meetings.length === 0) {
    return (
      <Card className="p-10 text-center">
        <VideoIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {meetings.map((m) => {
        const eng = m.analytics?.engagementScore;
        const att = m.analytics?.attendanceRate;
        return (
          <Card key={m.id} className="p-4 hover:border-primary/40 transition-colors">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <Link to={`${basePath}/${m.id}`} className="text-sm font-semibold hover:underline truncate block">{m.title}</Link>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {m.batchName ?? "—"} · {m.trainerName ?? "—"}
                </div>
              </div>
              <StatusBadge
                status={m.status === "live" ? "success" : m.status === "scheduled" ? "warning" : "default"}
                label={m.status}
                size="sm"
                pulse={m.status === "live"}
              />
            </div>
            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /> {fmt(m.scheduledAt)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.durationMins}m</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.attendees.length}/{m.maxAttendees}</span>
              {m.status === "ended" && eng !== undefined && (
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {eng}% engagement</span>
              )}
              {m.status === "ended" && att !== undefined && (
                <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {att}% attended</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {m.status === "ended" && m.recordings.length > 0 ? (
                <Button size="sm" variant="outline" asChild>
                  <Link to={`${basePath}/${m.id}`}><FileVideo className="h-3.5 w-3.5 mr-1.5" /> Recording</Link>
                </Button>
              ) : !viewer ? (
                <Button
                  size="sm"
                  onClick={() => {
                    toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
                    window.open(m.joinUrl, "_blank");
                  }}
                >
                  <PlayCircle className="h-3.5 w-3.5 mr-1.5" />
                  {m.status === "live" ? "Start Room" : "Open Room"}
                </Button>
              ) : m.status === "live" ? (
                <Button
                  size="sm"
                  onClick={() => {
                    toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
                    window.open(m.joinUrl, "_blank");
                  }}
                >
                  <PlayCircle className="h-3.5 w-3.5 mr-1.5" /> Join Now
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  <Clock className="h-3.5 w-3.5 mr-1.5" /> Starts {fmt(m.scheduledAt).split(",")[0]}
                </Button>
              )}
              <Button size="sm" variant="ghost" asChild>
                <Link to={`${basePath}/${m.id}`}>Details</Link>
              </Button>
              {m.bbb?.record && <Badge variant="secondary" className="text-[10px]">REC</Badge>}
              {m.bbb?.waitingRoom || m.waitingRoom ? <Badge variant="secondary" className="text-[10px]">Lobby</Badge> : null}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
