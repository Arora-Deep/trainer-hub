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
import {
  Plus,
  Search,
  Users,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useBatchStore } from "@/stores/batchStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Batches"
        description="Manage your training batches and sessions"
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Download className="mr-1.5 h-4 w-4" />
              Export
            </Button>
            <Button variant="coral" size="sm" onClick={() => navigate("/batches/create")}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Batch
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Batches", value: batches.length, icon: Users },
          { label: "Live", value: filterCounts.live, live: true, icon: TrendingUp },
          { label: "Upcoming", value: filterCounts.upcoming, icon: Calendar },
          { label: "Completed", value: filterCounts.completed, icon: Calendar },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="p-4 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{stat.value}</p>
              </div>
              {stat.live && stat.value > 0 ? (
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                </span>
              ) : (
                <div className="icon-container p-2">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9 bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="all" className="text-xs gap-1.5 rounded-lg">
              All
              <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-[10px] h-4 rounded-full font-semibold">
                {filterCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs rounded-lg">Upcoming</TabsTrigger>
            <TabsTrigger value="live" className="text-xs gap-1.5 rounded-lg">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs rounded-lg">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-56 h-9 bg-muted/40 border-border/50 text-sm rounded-xl focus:bg-card transition-all"
            />
          </div>
          <div className="hidden sm:flex border border-border/50 rounded-xl overflow-hidden">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-9 w-9"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "table" ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batch Name</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trainer</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Students</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow key={batch.id} className="group table-row-premium border-b border-border/30">
                    <TableCell>
                      <Link
                        to={`/batches/${batch.id}`}
                        className="text-sm font-semibold text-foreground hover:text-coral transition-colors inline-flex items-center gap-1"
                      >
                        {batch.name}
                        <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {batch.courseName || "Not assigned"}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {batch.instructors.join(", ") || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      <div>
                        <div className="text-xs font-medium">{formatDate(batch.startDate)}</div>
                        <div className="text-[10px] text-muted-foreground/60">to {formatDate(batch.endDate)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold tabular-nums">{batch.students.length}</span>
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
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}`)} className="rounded-lg">
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg">Edit</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg">Duplicate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive rounded-lg">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBatches.map((batch) => (
            <Card
              key={batch.id}
              className="cursor-pointer hover:shadow-[var(--shadow-card-hover)] hover:border-border transition-all duration-300"
              onClick={() => navigate(`/batches/${batch.id}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-foreground">{batch.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{batch.courseName || "No course"}</p>
                  </div>
                  <StatusBadge
                    status={statusMap[batch.status].status}
                    label={statusMap[batch.status].label}
                    pulse={batch.status === "live"}
                    size="sm"
                  />
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(batch.startDate)} — {formatDate(batch.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    <span>{batch.students.length} students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-foreground">{filteredBatches.length}</span> of{" "}
          <span className="font-semibold text-foreground">{batches.length}</span> batches
        </span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled className="gap-1 rounded-lg">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0 rounded-lg"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="gap-1 rounded-lg">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
