import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlayCircle, FileVideo, Users, Clock, Video, Repeat } from "lucide-react";
import { Meeting } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

const fmt = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

const kindLabel: Record<string, string> = {
  "batch-session": "Batch session",
  "ad-hoc": "Ad-hoc",
  "office-hours": "Office hours",
};

export function MeetingCard({ m, showBatch = true }: { m: Meeting; showBatch?: boolean }) {
  const statusKind = m.status === "live" ? "success" : m.status === "scheduled" ? "warning" : m.status === "cancelled" ? "destructive" : "default";

  const join = () => {
    toast({ title: "BBB integration pending", description: "Connect BigBlueButton secrets to enable live rooms." });
    window.open(m.bbb.joinUrlMock, "_blank");
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{kindLabel[m.kind]}</Badge>
            {m.recurrence && <Repeat className="h-3 w-3 text-muted-foreground" />}
          </div>
          <Link to={`/meetings/${m.id}`} className="text-sm font-semibold hover:underline truncate block">{m.title}</Link>
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {showBatch && (m.batchName ?? "Unassigned")} {showBatch && " • "}{m.trainerName}
          </div>
        </div>
        <StatusBadge status={statusKind as any} label={m.status} size="sm" pulse={m.status === "live"} />
      </div>

      <div className="text-xs text-muted-foreground mb-3 flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {fmt(m.scheduledAt)}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {m.durationMins} min</span>
        {m.status === "ended" && (
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {m.attendance.filter(a => a.status !== "absent").length}/{m.totalInvited}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {m.status === "live" && (
          <Button size="sm" onClick={join}><PlayCircle className="h-3.5 w-3.5 mr-1.5" /> Join now</Button>
        )}
        {m.status === "scheduled" && (
          <Button size="sm" variant="outline" onClick={join}><Video className="h-3.5 w-3.5 mr-1.5" /> Start</Button>
        )}
        {m.status === "ended" && m.recordings.length > 0 && (
          <Button size="sm" variant="outline" asChild>
            <Link to={`/meetings/${m.id}?tab=recordings`}><FileVideo className="h-3.5 w-3.5 mr-1.5" /> Recording</Link>
          </Button>
        )}
        {m.status === "ended" && (
          <Button size="sm" variant="ghost" asChild>
            <Link to={`/meetings/${m.id}?tab=report`}>View report</Link>
          </Button>
        )}
        {m.status !== "ended" && (
          <Button size="sm" variant="ghost" asChild>
            <Link to={`/meetings/${m.id}`}>Details</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
