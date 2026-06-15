import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, PlayCircle, Clock, Calendar } from "lucide-react";
import { useMeetingStore, CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";
import { toast } from "@/hooks/use-toast";

const minutesUntil = (iso: string) => Math.round((new Date(iso).getTime() - Date.now()) / 60_000);

export function LiveNowBanner() {
  const live = useMeetingStore((s) => s.getLiveNowForStudent(CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID));
  const next = useMeetingStore((s) => s.getUpNextForStudent(CURRENT_STUDENT_ID, CURRENT_STUDENT_BATCH_ID));

  const join = (joinUrl: string) => {
    toast({ title: "BBB integration pending", description: "Live rooms will open once BigBlueButton is connected." });
    window.open(joinUrl, "_blank");
  };

  if (live) {
    const elapsed = Math.max(0, Math.round((Date.now() - new Date(live.scheduledAt).getTime()) / 60_000));
    return (
      <Card className="p-4 border-destructive/30 bg-gradient-to-r from-destructive/10 via-destructive/5 to-transparent">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
              <Radio className="h-4 w-4 text-destructive animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge className="bg-destructive text-destructive-foreground text-[10px] gap-1"><span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />LIVE NOW</Badge>
                <span className="text-xs text-muted-foreground">In progress · {elapsed} min</span>
              </div>
              <div className="font-semibold text-sm truncate mt-0.5">{live.title}</div>
              <div className="text-xs text-muted-foreground truncate">{live.trainerName} · {live.batchName}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild><Link to={`/student/meeting/${live.id}`}>Details</Link></Button>
            <Button size="sm" onClick={() => join(live.bbb.joinUrlMock)}><PlayCircle className="h-3.5 w-3.5 mr-1.5" />Join now</Button>
          </div>
        </div>
      </Card>
    );
  }

  if (next) {
    const mins = minutesUntil(next.scheduledAt);
    const soon = mins <= 15;
    return (
      <Card className={`p-4 ${soon ? "border-amber-500/30 bg-amber-500/5" : ""}`}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${soon ? "bg-amber-500/20" : "bg-muted"}`}>
              {soon ? <Clock className="h-4 w-4 text-amber-600" /> : <Calendar className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">{soon ? "Starting soon" : "Up next"}</Badge>
                <span className="text-xs text-muted-foreground">
                  {soon ? `${mins} min away` : new Date(next.scheduledAt).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="font-semibold text-sm truncate mt-0.5">{next.title}</div>
              <div className="text-xs text-muted-foreground truncate">{next.trainerName} · {next.batchName ?? "Office hours"}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild><Link to={`/student/meeting/${next.id}`}>Details</Link></Button>
            {soon && <Button size="sm" onClick={() => join(next.bbb.joinUrlMock)}><PlayCircle className="h-3.5 w-3.5 mr-1.5" />Join</Button>}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
