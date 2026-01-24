import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  GraduationCap, 
  BookOpen,
  Users,
  Clock,
  Edit,
  Copy,
  Trash2,
  Eye
} from "lucide-react";
import { useProgramStore } from "@/stores/programStore";

const Programs = () => {
  const navigate = useNavigate();
  const programs = useProgramStore((state) => state.programs);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || program.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === "active").length,
    totalEnrolled: programs.reduce((sum, p) => sum + p.enrolled, 0),
    totalCourses: programs.reduce((sum, p) => sum + p.courses.length, 0),
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "archived": return "neutral";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        description="Create and manage learning programs combining multiple courses"
        actions={
          <Button className="gap-2" onClick={() => navigate("/programs/create")}>
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Programs"
          value={stats.total}
          icon={GraduationCap}
        />
        <StatCard
          title="Active Programs"
          value={stats.active}
          icon={BookOpen}
          variant="success"
        />
        <StatCard
          title="Total Enrolled"
          value={stats.totalEnrolled}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {["all", "active", "draft", "archived"].map((filter) => (
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
                placeholder="Search programs..."
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
                <TableHead>Program Name</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id} className="table-row-premium">
                  <TableCell>
                    <Link 
                      to={`/programs/${program.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {program.name}
                    </Link>
                  </TableCell>
                  <TableCell>{program.courses.length} courses</TableCell>
                  <TableCell>{program.duration}</TableCell>
                  <TableCell>{program.enrolled}</TableCell>
                  <TableCell>
                    <StatusBadge
                      status={getStatusVariant(program.status) as any}
                      label={program.status}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {program.lastUpdated}
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Program
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

export default Programs;
