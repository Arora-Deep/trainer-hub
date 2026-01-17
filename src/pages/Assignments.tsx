import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ClipboardList, 
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download,
  AlertCircle
} from "lucide-react";

const assignments = [
  {
    id: "1",
    title: "Build a REST API",
    course: "Node.js Backend Development",
    submissions: 45,
    pending: 12,
    dueDate: "2024-01-20",
    maxScore: 100,
    status: "active",
    type: "project",
  },
  {
    id: "2",
    title: "React Dashboard Component",
    course: "Advanced React",
    submissions: 38,
    pending: 8,
    dueDate: "2024-01-18",
    maxScore: 50,
    status: "active",
    type: "practical",
  },
  {
    id: "3",
    title: "Database Schema Design",
    course: "SQL Masterclass",
    submissions: 52,
    pending: 0,
    dueDate: "2024-01-10",
    maxScore: 75,
    status: "completed",
    type: "practical",
  },
  {
    id: "4",
    title: "Machine Learning Model",
    course: "Data Science Fundamentals",
    submissions: 23,
    pending: 15,
    dueDate: "2024-01-25",
    maxScore: 100,
    status: "active",
    type: "project",
  },
  {
    id: "5",
    title: "CI/CD Pipeline Setup",
    course: "DevOps Fundamentals",
    submissions: 0,
    pending: 0,
    dueDate: "2024-02-01",
    maxScore: 80,
    status: "draft",
    type: "practical",
  },
  {
    id: "6",
    title: "Security Audit Report",
    course: "Cybersecurity Essentials",
    submissions: 18,
    pending: 5,
    dueDate: "2024-01-22",
    maxScore: 100,
    status: "active",
    type: "report",
  },
];

const Assignments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || assignment.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => a.status === "active").length,
    totalSubmissions: assignments.reduce((sum, a) => sum + a.submissions, 0),
    pendingReview: assignments.reduce((sum, a) => sum + a.pending, 0),
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project": return "bg-purple-100 text-purple-700";
      case "practical": return "bg-blue-100 text-blue-700";
      case "report": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "primary";
      case "completed": return "success";
      case "draft": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        description="Create and manage course assignments and track submissions"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Assignments"
          value={stats.total}
          icon={ClipboardList}
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Submissions"
          value={stats.totalSubmissions}
          icon={FileText}
          variant="info"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {["all", "active", "completed", "draft"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assignment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssignments.map((assignment) => (
                <TableRow key={assignment.id} className="table-row-premium">
                  <TableCell>
                    <div>
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-xs text-muted-foreground">Max: {assignment.maxScore} pts</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{assignment.course}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getTypeColor(assignment.type)}`}>
                      {assignment.type}
                    </span>
                  </TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      {assignment.submissions}
                    </span>
                  </TableCell>
                  <TableCell>
                    {assignment.pending > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        {assignment.pending}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={getStatusVariant(assignment.status) as any}
                      label={assignment.status}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Submissions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Assignment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export Grades
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assignments;
