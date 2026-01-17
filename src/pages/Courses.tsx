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
import { Search, MoreHorizontal, BookOpen, Users, Plus } from "lucide-react";
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
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Browse and manage all available courses"
        breadcrumbs={[{ label: "Courses" }]}
        actions={
          <Button onClick={() => navigate("/courses/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">All Courses</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Delivery Type</TableHead>
                <TableHead className="text-center">Batches</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id} className="table-row-premium">
                  <TableCell>
                    <Link to={`/courses/${course.id}`} className="flex items-center gap-3 font-medium text-primary hover:underline">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={course.deliveryType === "instructor-led" ? "primary" : "info"}
                      label={course.deliveryType === "instructor-led" ? "Instructor-led" : "Self-paced"}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {course.batches}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{course.lastUpdated}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={statusConfig[course.status]?.status || "default"}
                      label={statusConfig[course.status]?.label || course.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
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
