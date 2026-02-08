import { useState, useEffect } from "react";
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
  Filter,
  Users,
  Calendar,
  MoreHorizontal,
  ArrowUpRight,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
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
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string; color: string }> = {
  upcoming: { status: "primary", label: "Upcoming", color: "bg-primary/10 text-primary" },
  live: { status: "success", label: "Live", color: "bg-success/10 text-success" },
  completed: { status: "default", label: "Completed", color: "bg-muted text-muted-foreground" },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.03,
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  }),
  exit: { opacity: 0, x: 20 },
};

export default function Batches() {
  const navigate = useNavigate();
  const { batches } = useBatchStore();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Header with animated entrance */}
      <motion.div variants={itemVariants}>
        <PageHeader
          title="Batches"
          description="Manage all your training batches and sessions"
          breadcrumbs={[{ label: "Batches" }]}
          actions={
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="rounded-xl hidden sm:flex">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button className="btn-gradient" onClick={() => navigate("/batches/create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Batch
                </Button>
              </motion.div>
            </div>
          }
        />
      </motion.div>

      {/* Stats Summary Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Total Batches", value: batches.length, color: "from-primary/20 to-primary/5" },
            { label: "Live Now", value: filterCounts.live, color: "from-success/20 to-success/5", pulse: true },
            { label: "Upcoming", value: filterCounts.upcoming, color: "from-info/20 to-info/5" },
            { label: "Completed", value: filterCounts.completed, color: "from-muted to-muted/50" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl border border-border/50 p-4 bg-gradient-to-br ${stat.color}`}
              style={{ boxShadow: "var(--shadow-card)" }}
              whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                {stat.pulse && stat.value > 0 && (
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="all" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                    All
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-5">
                      {filterCounts.all}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                    Upcoming
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-5">
                      {filterCounts.upcoming}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="live" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                    Live
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-5">
                      {filterCounts.live}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="gap-1.5 data-[state=active]:shadow-sm rounded-lg">
                    Completed
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-5">
                      {filterCounts.completed}
                    </Badge>
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
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
                <div className="hidden sm:flex border rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-10"
                    onClick={() => setViewMode("table")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-10"
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Batches Table/Grid */}
      <motion.div variants={itemVariants}>
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
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
                        <AnimatePresence>
                          {filteredBatches.map((batch, index) => (
                            <motion.tr
                              key={batch.id}
                              custom={index}
                              variants={tableRowVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="table-row-premium group border-b border-border/30 last:border-0"
                              whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
                            >
                              <TableCell>
                                <Link
                                  to={`/batches/${batch.id}`}
                                  className="font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 group/link"
                                >
                                  <motion.span whileHover={{ x: 2 }}>
                                    {batch.name}
                                  </motion.span>
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
                                <motion.span
                                  className="inline-flex items-center justify-center min-w-[2rem] font-semibold tabular-nums text-foreground"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {batch.students.length}
                                </motion.span>
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
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="glass-card-static border-border/50 w-48">
                                    <DropdownMenuItem onClick={() => navigate(`/batches/${batch.id}`)}>
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Edit Batch</DropdownMenuItem>
                                    <DropdownMenuItem>Manage Students</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {filteredBatches.map((batch, index) => (
                <motion.div
                  key={batch.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "var(--shadow-card-hover)" }}
                >
                  <Card className="overflow-hidden group cursor-pointer" onClick={() => navigate(`/batches/${batch.id}`)}>
                    <div className={`h-2 ${statusMap[batch.status].color.split(' ')[0].replace('/10', '')}`} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {batch.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {batch.courseName || "No course"}
                          </p>
                        </div>
                        <StatusBadge
                          status={statusMap[batch.status].status}
                          label={statusMap[batch.status].label}
                          pulse={batch.status === "live"}
                        />
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {formatDate(batch.startDate)} - {formatDate(batch.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-3.5 w-3.5" />
                          <span className="text-xs">{batch.students.length} students enrolled</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium"
                            >
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                          {batch.students.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[10px] font-medium text-primary">
                              +{batch.students.length - 3}
                            </div>
                          )}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing <span className="font-semibold text-foreground">{filteredBatches.length}</span> of{" "}
            <span className="font-semibold text-foreground">{batches.length}</span> batches
          </span>
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" disabled className="rounded-lg gap-1">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </motion.div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <motion.div key={page} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={page === 1 ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 rounded-lg ${page === 1 ? "btn-gradient" : ""}`}
                  >
                    {page}
                  </Button>
                </motion.div>
              ))}
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" size="sm" className="rounded-lg gap-1">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
