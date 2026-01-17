import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Users, Calendar, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const batchesData = [
  { id: 1, name: "AWS Solutions Architect - Batch 12", course: "AWS SA Pro", trainer: "John Smith", startDate: "Jan 15, 2024", endDate: "Feb 15, 2024", students: 24, status: "upcoming" },
  { id: 2, name: "Kubernetes Fundamentals - Batch 8", course: "K8s Basics", trainer: "Jane Doe", startDate: "Jan 10, 2024", endDate: "Feb 10, 2024", students: 18, status: "live" },
  { id: 3, name: "Docker Masterclass - Batch 15", course: "Docker Pro", trainer: "Mike Johnson", startDate: "Dec 1, 2023", endDate: "Jan 1, 2024", students: 30, status: "completed" },
  { id: 4, name: "Terraform Advanced - Batch 5", course: "Terraform Pro", trainer: "Sarah Wilson", startDate: "Jan 20, 2024", endDate: "Feb 20, 2024", students: 15, status: "upcoming" },
  { id: 5, name: "Azure DevOps - Batch 3", course: "Azure DevOps", trainer: "Tom Brown", startDate: "Jan 8, 2024", endDate: "Feb 8, 2024", students: 22, status: "live" },
  { id: 6, name: "Linux Administration - Batch 20", course: "Linux Admin", trainer: "Emily Chen", startDate: "Nov 15, 2023", endDate: "Dec 15, 2023", students: 28, status: "completed" },
];

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

const filterCounts = {
  all: batchesData.length,
  upcoming: batchesData.filter(b => b.status === "upcoming").length,
  live: batchesData.filter(b => b.status === "live").length,
  completed: batchesData.filter(b => b.status === "completed").length,
};

export default function Batches() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredBatches = batchesData.filter((batch) => {
    const matchesFilter = filter === "all" || batch.status === filter;
    const matchesSearch = batch.name.toLowerCase().includes(search.toLowerCase()) ||
      batch.course.toLowerCase().includes(search.toLowerCase()) ||
      batch.trainer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Batches"
        description="Manage all your training batches and sessions"
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <Button className="shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            Create Batch
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="all" className="gap-1.5 data-[state=active]:shadow-sm">
                  All <span className="text-muted-foreground text-xs ml-1">{filterCounts.all}</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-1.5 data-[state=active]:shadow-sm">
                  Upcoming <span className="text-muted-foreground text-xs ml-1">{filterCounts.upcoming}</span>
                </TabsTrigger>
                <TabsTrigger value="live" className="gap-1.5 data-[state=active]:shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Live <span className="text-muted-foreground text-xs ml-1">{filterCounts.live}</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-1.5 data-[state=active]:shadow-sm">
                  Completed <span className="text-muted-foreground text-xs ml-1">{filterCounts.completed}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  placeholder="Search batches..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64 bg-muted/40 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-primary/30"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 rounded-lg">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-medium">Batch Name</TableHead>
                  <TableHead className="font-medium">Course</TableHead>
                  <TableHead className="font-medium">Trainer</TableHead>
                  <TableHead className="font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Duration
                    </span>
                  </TableHead>
                  <TableHead className="font-medium text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Students
                    </span>
                  </TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="table-row-premium group">
                    <TableCell>
                      <Link 
                        to={`/batches/${batch.id}`} 
                        className="font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {batch.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium">
                        {batch.course}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      <div className="space-y-0.5">
                        <div className="text-xs">{batch.startDate}</div>
                        <div className="text-[10px] text-muted-foreground/70">to {batch.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] font-semibold tabular-nums text-foreground">
                        {batch.students}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={statusMap[batch.status].status}
                        label={statusMap[batch.status].label}
                        pulse={batch.status === "live"}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Batch</DropdownMenuItem>
                          <DropdownMenuItem>Manage Students</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredBatches.length} of {batchesData.length} batches</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
