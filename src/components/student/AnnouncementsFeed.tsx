import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Pin } from "lucide-react";
import { useAnnouncementStore } from "@/stores/announcementStore";
import { CURRENT_STUDENT_BATCH_ID } from "@/stores/meetingStore";
import { Link } from "react-router-dom";

interface Props {
  limit?: number;
  showViewAll?: boolean;
}

export function AnnouncementsFeed({ limit = 3, showViewAll = true }: Props) {
  const announcements = useAnnouncementStore((s) => s.announcements);

  const combined = useMemo(
    () =>
      announcements
        .filter((a) => a.batchId === CURRENT_STUDENT_BATCH_ID || a.batchId === null)
        .sort(
          (a, b) =>
            +b.pinned - +a.pinned ||
            +new Date(b.postedAt) - +new Date(a.postedAt)
        )
        .slice(0, limit),
    [announcements, limit]
  );

  if (combined.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-end justify-between">
        <h2 className="text-sm font-semibold tracking-tight flex items-center gap-1.5">
          <Megaphone className="h-3.5 w-3.5 text-primary" /> Announcements
        </h2>
        {showViewAll && (
          <Link to="/student/announcements" className="text-xs font-medium text-primary">
            View all
          </Link>
        )}
      </div>
      <Card>
        <CardContent className="p-0">
          {combined.map((a, i) => (
            <div
              key={a.id}
              className={`p-3 flex items-start gap-3 ${i !== combined.length - 1 ? "border-b" : ""}`}
            >
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                {a.pinned ? <Pin className="h-3.5 w-3.5 text-primary" /> : <Megaphone className="h-3.5 w-3.5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-sm font-medium truncate">{a.title}</p>
                  {a.audience === "global" && (
                    <Badge variant="outline" className="text-[9px] h-4">Platform</Badge>
                  )}
                  {a.audience === "batch" && a.batchName && (
                    <Badge variant="outline" className="text-[9px] h-4 truncate max-w-[160px]">{a.batchName}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{a.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {a.postedBy} · {new Date(a.postedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
