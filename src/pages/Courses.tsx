import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MoreHorizontal, BookOpen, Users, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const courses = [
  { id: 1, name: "AWS Solutions Architect Professional", deliveryType: "instructor-led", batches: 5, students: 120, status: "active" },
  { id: 2, name: "Kubernetes Fundamentals", deliveryType: "self-paced", batches: 3, students: 89, status: "active" },
  { id: 3, name: "Docker Masterclass", deliveryType: "instructor-led", batches: 4, students: 145, status: "active" },
  { id: 4, name: "Terraform for AWS", deliveryType: "self-paced", batches: 2, students: 67, status: "draft" },
  { id: 5, name: "Azure DevOps Pipeline", deliveryType: "instructor-led", batches: 1, students: 34, status: "archived" },
  { id: 6, name: "Linux Administration", deliveryType: "self-paced", batches: 6, students: 198, status: "active" },
];

const statusConfig: Record<string, { status: "success" | "warning" | "default"; label: string }> = {
  active: { status: "success", label: "Active" },
  draft: { status: "warning", label: "Draft" },
  archived: { status: "default", label: "Archived" },
};

export default function Courses() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) => {
    const matchesFilter = filter === "all" || course.status === filter;
    const matchesSearch = course.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: courses.length,
    active: courses.filter(c => c.status === "active").length,
    draft: courses.filter(c => c.status === "draft").length,
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Courses"
        description="Manage course content and curriculum"
        breadcrumbs={[{ label: "Courses" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Draft ({counts.draft})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:border-border/80 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Course</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Link to={`/courses/${course.id}`} className="block group/link">
                <h3 className="font-medium text-sm mb-2 group-hover/link:text-primary transition-colors">
                  {course.name}
                </h3>
              </Link>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span className="capitalize">{course.deliveryType.replace("-", " ")}</span>
                <span>•</span>
                <span>{course.batches} batches</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{course.students} students</span>
                </div>
                <StatusBadge
                  status={statusConfig[course.status].status}
                  label={statusConfig[course.status].label}
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
