import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Eye, Building2, GraduationCap, Sparkles } from "lucide-react";
import { useCourseStore, type CourseModerationStatus } from "@/stores/courseStore";
import { toast } from "sonner";

const tabs: { value: CourseModerationStatus | "all"; label: string }[] = [
  { value: "pending-review", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function CourseModeration() {
  const { courses, setModeration } = useCourseStore();
  const marketplace = courses.filter((c) => c.settings?.visibility === "marketplace");
  const [tab, setTab] = useState<CourseModerationStatus | "all">("pending-review");
  const [preview, setPreview] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const filtered = marketplace.filter((c) => (tab === "all" ? true : (c.moderation ?? "draft") === tab));
  const previewCourse = preview ? courses.find((c) => c.id === preview) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Moderation"
        description="Review marketplace submissions from trainers and customers before they go public."
        breadcrumbs={[{ label: "Catalog" }, { label: "Course Moderation" }]}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Pending" value={marketplace.filter((c) => c.moderation === "pending-review").length} tone="warning" />
        <Stat label="Approved" value={marketplace.filter((c) => c.moderation === "approved").length} tone="success" />
        <Stat label="Rejected" value={marketplace.filter((c) => c.moderation === "rejected").length} tone="danger" />
        <Stat label="Total submissions" value={marketplace.length} tone="default" />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          {tabs.map((t) => <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">Nothing here.</CardContent></Card>
        )}
        {filtered.map((c) => {
          const lessons = c.chapters.reduce((s, ch) => s + ch.lessons.length, 0);
          const ownerIcon = c.owner?.type === "customer" ? Building2 : GraduationCap;
          const OwnerIcon = ownerIcon;
          return (
            <Card key={c.id}>
              <CardContent className="pt-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{c.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{c.category ?? "Uncategorized"}</Badge>
                      {c.moderation === "pending-review" && <StatusBadge status="warning" label="Pending review" />}
                      {c.moderation === "approved" && <StatusBadge status="success" label="Approved" />}
                      {c.moderation === "rejected" && <StatusBadge status="danger" label="Rejected" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.description ?? "No description provided."}</p>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><OwnerIcon className="h-3 w-3" /> {c.owner?.name ?? "—"} ({c.owner?.type})</span>
                      <span>{c.chapters.length} modules · {lessons} lessons</span>
                      <span>Updated {c.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setPreview(c.id)}><Eye className="h-3.5 w-3.5 mr-1.5" /> Review</Button>
                    {c.moderation !== "approved" && (
                      <Button size="sm" className="gap-1.5" onClick={() => { setModeration(c.id, "approved"); toast.success("Course approved"); }}>
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </Button>
                    )}
                    {c.moderation !== "rejected" && (
                      <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => { setModeration(c.id, "rejected"); toast.message("Course rejected"); }}>
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Sheet open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{previewCourse?.name}</SheetTitle>
            <SheetDescription>{previewCourse?.owner?.name} · {previewCourse?.owner?.type}</SheetDescription>
          </SheetHeader>
          {previewCourse && (
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Description</p>
                <p>{previewCourse.description ?? "—"}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <KV label="Delivery" value={previewCourse.settings?.deliveryType ?? "—"} />
                <KV label="Lab policy" value={previewCourse.settings?.labPolicy ?? "—"} />
                <KV label="Validity" value={`${previewCourse.settings?.validityDays ?? "—"} days`} />
                <KV label="Modules" value={`${previewCourse.chapters.length}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Outline</p>
                <ul className="space-y-1 text-xs">
                  {previewCourse.chapters.map((ch, i) => (
                    <li key={ch.id} className="border-l-2 border-primary/30 pl-2">
                      <span className="font-medium">{i + 1}. {ch.title}</span>
                      <span className="text-muted-foreground"> · {ch.lessons.length} lessons</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reviewer notes (sent to author on rejection)</p>
                <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1.5" />
              </div>
            </div>
          )}
          <SheetFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => { if (previewCourse) { setModeration(previewCourse.id, "rejected"); toast.message("Course rejected"); setPreview(null); } }}>Reject</Button>
            <Button onClick={() => { if (previewCourse) { setModeration(previewCourse.id, "approved"); toast.success("Course approved"); setPreview(null); } }}>Approve</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: "warning" | "success" | "danger" | "default" }) {
  const toneClass = {
    warning: "text-warning",
    success: "text-success",
    danger: "text-destructive",
    default: "text-foreground",
  }[tone];
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 rounded-md bg-muted/40">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium capitalize mt-0.5">{value}</p>
    </div>
  );
}
