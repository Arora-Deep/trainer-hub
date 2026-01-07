import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const courses = [
  { id: 1, name: "AWS Solutions Architect Professional", deliveryType: "instructor-led", batches: 5, lastUpdated: "Jan 12, 2024", status: "active" },
  { id: 2, name: "Kubernetes Fundamentals", deliveryType: "self-paced", batches: 3, lastUpdated: "Jan 10, 2024", status: "active" },
  { id: 3, name: "Docker Masterclass", deliveryType: "instructor-led", batches: 4, lastUpdated: "Jan 8, 2024", status: "active" },
  { id: 4, name: "Terraform for AWS", deliveryType: "self-paced", batches: 2, lastUpdated: "Jan 5, 2024", status: "draft" },
  { id: 5, name: "Azure DevOps Pipeline", deliveryType: "instructor-led", batches: 1, lastUpdated: "Dec 28, 2023", status: "archived" },
  { id: 6, name: "Linux Administration", deliveryType: "self-paced", batches: 6, lastUpdated: "Dec 20, 2023", status: "active" },
];

const statusConfig: Record<string, { status: "success" | "warning" | "default"; label: string }> = {
  active: { status: "success", label: "Active" },
  draft: { status: "warning", label: "Draft" },
  archived: { status: "default", label: "Archived" },
};

export default function Courses() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Browse and manage all available courses"
        breadcrumbs={[{ label: "Courses" }]}
      />

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-10" />
        </div>
        <Button>Create Course</Button>
      </div>

      {/* Courses Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Course Name</TableHead>
              <TableHead className="font-medium">Delivery Type</TableHead>
              <TableHead className="font-medium text-center">Batches</TableHead>
              <TableHead className="font-medium">Last Updated</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link to={`/courses/${course.id}`} className="flex items-center gap-3 font-medium text-foreground hover:text-foreground/80">
                    <div className="rounded bg-muted p-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {course.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">
                    {course.deliveryType === "instructor-led" ? "Instructor-led" : "Self-paced"}
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {course.batches}
                </TableCell>
                <TableCell className="text-muted-foreground">{course.lastUpdated}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusConfig[course.status].status}
                    label={statusConfig[course.status].label}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
