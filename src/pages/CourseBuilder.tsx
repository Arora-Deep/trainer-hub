import { PageHeader } from "@/components/ui/PageHeader";
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
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, Search, MoreHorizontal, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const courses = [
  { id: 1, name: "AWS Solutions Architect Professional", modules: 12, lessons: 48, lastUpdated: "Jan 12, 2024", status: "published" },
  { id: 2, name: "Kubernetes Fundamentals", modules: 8, lessons: 32, lastUpdated: "Jan 10, 2024", status: "published" },
  { id: 3, name: "Docker Masterclass", modules: 10, lessons: 40, lastUpdated: "Jan 8, 2024", status: "published" },
  { id: 4, name: "Terraform for AWS", modules: 6, lessons: 24, lastUpdated: "Jan 5, 2024", status: "draft" },
  { id: 5, name: "Azure DevOps Pipeline", modules: 7, lessons: 28, lastUpdated: "Dec 28, 2023", status: "draft" },
];

export default function CourseBuilder() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Course Builder"
        description="Create and manage course content and structure"
        breadcrumbs={[{ label: "Course Builder" }]}
        actions={
          <Button asChild>
            <Link to="/course-builder/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
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
                <TableHead className="text-center">Modules</TableHead>
                <TableHead className="text-center">Lessons</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Link to={`/course-builder/${course.id}`} className="flex items-center gap-3 font-medium text-primary hover:underline">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{course.modules}</TableCell>
                  <TableCell className="text-center">{course.lessons}</TableCell>
                  <TableCell className="text-muted-foreground">{course.lastUpdated}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={course.status === "published" ? "success" : "warning"}
                      label={course.status === "published" ? "Published" : "Draft"}
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