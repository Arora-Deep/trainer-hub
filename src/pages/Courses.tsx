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
import { Search, MoreHorizontal, BookOpen, Users, Plus, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCourseStore } from "@/stores/courseStore";

const statusConfig: Record<string, { status: "success" | "warning" | "default"; label: string }> = {
  active: { status: "success", label: "Active" },
  draft: { status: "warning", label: "Draft" },
  archived: { status: "default", label: "Archived" },
};

export default function Courses() {
  const navigate = useNavigate();
  const courses = useCourseStore((state) => state.courses);

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Courses"
        description="Browse and manage all available courses"
        breadcrumbs={[{ label: "Courses" }]}
        actions={
          <Button onClick={() => navigate("/courses/create")} className="btn-orange">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        }
      />

      <Card className="card-soft overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold">All Courses</CardTitle>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10 w-64 bg-muted/40 border-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-primary/20" 
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
              {courses.map((course) => (
                <TableRow key={course.id} className="table-row-soft group border-b border-border/30 last:border-0">
                  <TableCell>
                    <Link 
                      to={`/courses/${course.id}`} 
                      className="flex items-center gap-3 font-medium text-foreground hover:text-primary transition-colors group/link"
                    >
                      <div className="rounded-2xl p-2.5 bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <span className="flex items-center gap-1">
                        {course.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={course.deliveryType === "instructor-led" ? "primary" : "info"}
                      label={course.deliveryType === "instructor-led" ? "Instructor-led" : "Self-paced"}
                      dot={false}
                    />
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
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
