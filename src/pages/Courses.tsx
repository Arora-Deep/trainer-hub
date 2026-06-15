import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, MoreHorizontal, BookOpen, Users, Plus, ArrowUpRight, Upload, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCourseStore } from "@/stores/courseStore";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const statusConfig: Record<string, { status: "success" | "warning" | "default"; label: string }> = {
  active: { status: "success", label: "Active" },
  draft: { status: "warning", label: "Draft" },
  archived: { status: "default", label: "Archived" },
};

export default function Courses() {
  const navigate = useNavigate();
  const courses = useCourseStore((state) => state.courses);
  const [filter, setFilter] = useState<"all" | "active" | "draft" | "archived">("all");
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const filtered = courses.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Courses"
        description="Browse and manage all available courses"
        breadcrumbs={[{ label: "Courses" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" /> Import Course
            </Button>
            <Button onClick={() => navigate("/courses/create")} className="btn-gradient">
              <Plus className="h-4 w-4" />
              Create Course
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            {(["all", "active", "draft", "archived"] as const).map((f) => (
              <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">
                {f === "all" ? "All courses" : f}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-64 bg-muted/40 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Course Name</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Delivery Type</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-center">Batches</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Last Updated</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((course) => (
                <TableRow key={course.id} className="table-row-premium group border-b border-border/30 last:border-0">
                  <TableCell>
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center gap-3 font-medium text-foreground hover:text-primary transition-colors group/link"
                    >
                      <div className="rounded-xl p-2.5" style={{ background: "var(--gradient-primary-soft)" }}>
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="flex items-center gap-1">
                        {course.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const dt = course.deliveryType;
                      const isLive = dt === "instructor-led" || dt === "live" || dt === "live-online";
                      const isHybrid = dt === "hybrid";
                      const label = isHybrid ? "Hybrid" : isLive ? "Live" : "Self-paced";
                      const status: "primary" | "info" | "warning" = isHybrid ? "warning" : isLive ? "primary" : "info";
                      return <StatusBadge status={status} label={label} dot={false} />;
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{course.batches}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{course.lastUpdated}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={statusConfig[course.status]?.status || "default"}
                      label={statusConfig[course.status]?.label || course.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No courses match your filter.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Course Content</DialogTitle>
            <DialogDescription>Upload a SCORM/Common Cartridge zip, course JSON or CSV outline.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs">Course File</Label>
            <Input type="file" accept=".json,.csv,.xlsx,.zip,.imscc" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
            <p className="text-[11px] text-muted-foreground">Supports SCORM 1.2/2004, IMS Common Cartridge, CloudAdda JSON and CSV outlines.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button disabled={!importFile} onClick={() => {
              toast({ title: "Course imported", description: `${importFile?.name} queued — chapters will appear shortly.` });
              setImportFile(null);
              setImportOpen(false);
            }}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
