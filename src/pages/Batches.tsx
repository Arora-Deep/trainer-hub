import { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Search, Users, Calendar, MoreHorizontal, ArrowUpRight,
  LayoutGrid, List, ChevronLeft, ChevronRight, Download, Monitor,
  GraduationCap, Zap, Clock, TrendingUp, Filter,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useBatchStore } from "@/stores/batchStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

const mediumIcons: Record<string, React.ReactNode> = {
  online: <Monitor className="h-3.5 w-3.5" />,
  offline: <GraduationCap className="h-3.5 w-3.5" />,
  hybrid: <Zap className="h-3.5 w-3.5" />,
};

export default function Batches() {
  const navigate = useNavigate();
  const { batches } = useBatchStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "name" | "students">("newest");

  const filterCounts = useMemo(() => ({
    all: batches.length,
    upcoming: batches.filter((b) => b.status === "upcoming").length,
    live: batches.filter((b) => b.status === "live").length,
    completed: batches.filter((b) => b.status === "completed").length,
  }), [batches]);

  const filteredBatches = useMemo(() => {
    let result = batches.filter((batch) => {
      const matchesFilter = filter === "all" || batch.status === filter;
      const matchesSearch =
        batch.name.toLowerCase().includes(search.toLowerCase()) ||
        batch.courseName?.toLowerCase().includes(search.toLowerCase()) ||
        batch.instructors.some((i) => i.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

    // Sort
    switch (sortBy) {
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "students": result.sort((a, b) => b.students.length - a.students.length); break;
      case "newest": default: result.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); break;
    }
    return result;
  }, [batches, filter, search, sortBy]);

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "MMM d, yyyy"); } catch { return dateStr; }
  };

  const formatDateShort = (dateStr: string) => {
    try { return format(new Date(dateStr), "MMM d"); } catch { return dateStr; }
  };

  const totalStudents = useMemo(() => batches.reduce((sum, b) => sum + b.students.length, 0), [batches]);

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
            <Button size="sm" onClick={() => navigate("/batches/create")}>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Batch
            </Button>
          </div>
        }
      />

      {/* Enhanced Summary Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Batches", value: batches.length, icon: GraduationCap, desc: `${totalStudents} total students` },
          { label: "Live Now", value: filterCounts.live, icon: Zap, live: true, desc: "Currently running" },
          { label: "Upcoming", value: filterCounts.upcoming, icon: Calendar, desc: "Scheduled to start" },
          { label: "Completed", value: filterCounts.completed, icon: TrendingUp, desc: "Successfully finished" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all hover:border-primary/20 group",
                filter === (i === 0 ? "all" : i === 1 ? "live" : i === 2 ? "upcoming" : "completed") && "border-primary/30 bg-primary/[0.02]"
              )}
              onClick={() => setFilter(i === 0 ? "all" : i === 1 ? "live" : i === 2 ? "upcoming" : "completed")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold tabular-nums tracking-tight">{stat.value}</p>
                      {stat.live && stat.value > 0 && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{stat.desc}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                    <stat.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs gap-1.5">
              All
              <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-[10px] h-4 rounded">
                {filterCounts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="live" className="text-xs gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs">Upcoming</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-56 h-9 bg-muted/50 border-0 text-sm"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="students">Most Students</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
            <Button variant={viewMode === "table" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("table")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="rounded-none h-9 w-9" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredBatches.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="py-20">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <GraduationCap className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold">No batches found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    {search ? "Try adjusting your search or filters" : "Create your first batch to get started"}
                  </p>
                  {!search && (
                    <Button className="mt-4" size="sm" onClick={() => navigate("/batches/create")}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Create Batch
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : viewMode === "table" ? (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Batch</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Trainer</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Duration</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Medium</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground text-center">Students</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id} className="group cursor-pointer" onClick={() => navigate(`/batches/${batch.id}`)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <GraduationCap className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-1">
                                {batch.name}
                                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </span>
                              <p className="text-xs text-muted-foreground">{batch.courseName || "No course"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-muted">{batch.instructors[0]?.charAt(0) || "?"}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{batch.instructors[0] || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground tabular-nums">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                            <span>{formatDateShort(batch.startDate)} — {formatDateShort(batch.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                            {mediumIcons[batch.medium]}
                            {batch.medium}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-semibold tabular-nums">{batch.students.length}</span>
                            <span className="text-xs text-muted-foreground">/ {batch.seatCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={statusMap[batch.status].status}
                            label={statusMap[batch.status].label}
                            pulse={batch.status === "live"}
                          />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}`)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBatches.map((batch, i) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <Card
                    className="cursor-pointer group hover:border-primary/20 transition-all duration-200"
                    onClick={() => navigate(`/batches/${batch.id}`)}
                  >
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {batch.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 truncate">{batch.courseName || "No course assigned"}</p>
                          </div>
                        </div>
                        <StatusBadge
                          status={statusMap[batch.status].status}
                          label={statusMap[batch.status].label}
                          pulse={batch.status === "live"}
                          size="sm"
                        />
                      </div>

                      {/* Meta Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Students</p>
                          <p className="text-sm font-bold tabular-nums mt-0.5">{batch.students.length}<span className="text-xs font-normal text-muted-foreground">/{batch.seatCount}</span></p>
                        </div>
                        <div className="rounded-lg bg-muted/40 px-3 py-2">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Medium</p>
                          <p className="text-sm font-semibold capitalize mt-0.5 flex items-center gap-1">{mediumIcons[batch.medium]} {batch.medium}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span className="tabular-nums">{formatDateShort(batch.startDate)} — {formatDateShort(batch.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {batch.instructors.slice(0, 2).map((inst, idx) => (
                            <Avatar key={idx} className="h-5 w-5 border border-background">
                              <AvatarFallback className="text-[8px] bg-muted">{inst.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {batch.instructors.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{batch.instructors.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {filteredBatches.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing <span className="font-medium text-foreground">{filteredBatches.length}</span> of{" "}
            <span className="font-medium text-foreground">{batches.length}</span> batches
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {[1].map((page) => (
              <Button key={page} variant={page === 1 ? "default" : "ghost"} size="sm" className="h-8 w-8 p-0">
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" disabled className="gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
