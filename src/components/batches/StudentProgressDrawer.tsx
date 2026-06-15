import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { useProgressStore } from "@/stores/progressStore";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  not_started: "bg-muted text-muted-foreground",
  in_progress: "bg-amber-500/10 text-amber-600",
  submitted: "bg-blue-500/10 text-blue-600",
  graded: "bg-green-500/10 text-green-600",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batchId: string;
  studentId?: string;
  studentName?: string;
}

export function StudentProgressDrawer({ open, onOpenChange, batchId, studentId, studentName }: Props) {
  const items = useProgressStore((s) =>
    studentId ? s.forStudent(batchId, studentId) : []
  );
  const completion = useProgressStore((s) =>
    studentId ? s.studentCompletion(batchId, studentId) : 0
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{studentName || "Student"}</SheetTitle>
          <SheetDescription>Item-by-item progress for this batch.</SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall completion</span>
                <span className="text-2xl font-bold tabular-nums">{completion}%</span>
              </div>
              <Progress value={completion} className="h-2" />
            </CardContent>
          </Card>

          <div className="space-y-2">
            {items.map((i) => (
              <Card key={i.id}>
                <CardContent className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{i.itemTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] capitalize">{i.itemType}</Badge>
                      {i.dueAt && (
                        <span className="text-[11px] text-muted-foreground">
                          Due {format(new Date(i.dueAt), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {i.score !== undefined && i.maxScore && (
                      <span className="text-sm font-semibold tabular-nums">
                        {i.score}/{i.maxScore}
                      </span>
                    )}
                    <Badge variant="secondary" className={`text-[10px] capitalize ${statusColor[i.status]}`}>
                      {i.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No items yet.</CardContent></Card>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
