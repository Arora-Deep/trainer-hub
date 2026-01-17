import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, ClipboardList, CheckCircle, Clock, Calendar } from "lucide-react";

const assignments = [
  { id: "1", title: "Build a REST API", course: "Node.js Backend", submissions: 45, pending: 12, dueDate: "Jan 20, 2024", maxScore: 100, status: "active", type: "project" },
  { id: "2", title: "React Dashboard Component", course: "Advanced React", submissions: 38, pending: 8, dueDate: "Jan 18, 2024", maxScore: 50, status: "active", type: "practical" },
  { id: "3", title: "Database Schema Design", course: "SQL Masterclass", submissions: 52, pending: 0, dueDate: "Jan 10, 2024", maxScore: 75, status: "completed", type: "practical" },
  { id: "4", title: "Machine Learning Model", course: "Data Science", submissions: 23, pending: 15, dueDate: "Jan 25, 2024", maxScore: 100, status: "active", type: "project" },
  { id: "5", title: "CI/CD Pipeline Setup", course: "DevOps", submissions: 0, pending: 0, dueDate: "Feb 1, 2024", maxScore: 80, status: "draft", type: "practical" },
  { id: "6", title: "Security Audit Report", course: "Cybersecurity", submissions: 18, pending: 5, dueDate: "Jan 22, 2024", maxScore: 100, status: "active", type: "report" },
];

export default function Assignments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || assignment.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: assignments.length,
    active: assignments.filter(a => a.status === "active").length,
    completed: assignments.filter(a => a.status === "completed").length,
    draft: assignments.filter(a => a.status === "draft").length,
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "primary";
      case "completed": return "success";
      case "draft": return "warning";
      default: return "default";
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "project": return "bg-primary/10 text-primary";
      case "practical": return "bg-info/10 text-info";
      case "report": return "bg-success/10 text-success";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Assignments"
        description="Create and track course assignments"
        breadcrumbs={[{ label: "Assignments" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed ({counts.completed})</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Draft ({counts.draft})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-2">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:border-border/80 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm truncate">{assignment.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${getTypeStyle(assignment.type)}`}>
                        {assignment.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{assignment.course}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {assignment.dueDate}
                      </span>
                      <span>•</span>
                      <span>{assignment.maxScore} pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 shrink-0">
                  <div className="hidden sm:flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                      {assignment.submissions}
                    </span>
                    {assignment.pending > 0 && (
                      <span className="flex items-center gap-1 text-warning">
                        <Clock className="h-3.5 w-3.5" />
                        {assignment.pending}
                      </span>
                    )}
                  </div>
                  
                  <StatusBadge
                    status={getStatusVariant(assignment.status) as any}
                    label={assignment.status}
                    size="sm"
                  />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Submissions</DropdownMenuItem>
                      <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                      <DropdownMenuItem>Export Grades</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
