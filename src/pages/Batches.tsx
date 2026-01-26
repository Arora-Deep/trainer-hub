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
import { Plus, Search, Filter, Users, Calendar, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBatchStore } from "@/stores/batchStore";
import { format } from "date-fns";

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

export default function Batches() {
  const navigate = useNavigate();
  const { batches } = useBatchStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filterCounts = {
    all: batches.length,
    upcoming: batches.filter((b) => b.status === "upcoming").length,
    live: batches.filter((b) => b.status === "live").length,
    completed: batches.filter((b) => b.status === "completed").length,
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesFilter = filter === "all" || batch.status === filter;
    const matchesSearch =
      batch.name.toLowerCase().includes(search.toLowerCase()) ||
      batch.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      batch.instructors.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Batches"
        description="Manage all your training batches and sessions"
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <Button className="btn-gradient" onClick={() => navigate("/batches/create")}>
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
              <TabsList className="bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="all" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                  All <span className="text-muted-foreground text-xs ml-1">{filterCounts.all}</span>
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                  Upcoming <span className="text-muted-foreground text-xs ml-1">{filterCounts.upcoming}</span>
                </TabsTrigger>
                <TabsTrigger value="live" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live <span className="text-muted-foreground text-xs ml-1">{filterCounts.live}</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                  Completed <span className="text-muted-foreground text-xs ml-1">{filterCounts.completed}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  placeholder="Search batches..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64 bg-muted/40 border-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 rounded-xl">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardContent className="p-0">
          <div className="rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Batch Name</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Course</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Trainer</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Duration
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground text-center">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Students
                    </span>
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="table-row-premium group border-b border-border/30 last:border-0">
                    <TableCell>
                      <Link
                        to={`/batches/${batch.id}`}
                        className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
                      >
                        {batch.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-lg bg-muted/60 px-2.5 py-1 text-xs font-medium">
                        {batch.courseName || "Not assigned"}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {batch.instructors.join(", ") || "No instructor"}
                    </TableCell>
                    <TableCell className="text-muted-foreground tabular-nums">
                      <div className="space-y-0.5">
                        <div className="text-xs font-medium">{formatDate(batch.startDate)}</div>
                        <div className="text-[10px] text-muted-foreground/70">
                          to {formatDate(batch.endDate)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] font-semibold tabular-nums text-foreground">
                        {batch.students.length}
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
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card-static border-border/50">
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Batch</DropdownMenuItem>
                          <DropdownMenuItem>Manage Students</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
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
        <span>
          Showing <span className="font-semibold text-foreground">{filteredBatches.length}</span> of {batches.length} batches
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="rounded-lg">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
