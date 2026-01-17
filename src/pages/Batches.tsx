import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, MoreHorizontal, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const batchesData = [
  { id: 1, name: "AWS Solutions Architect - Batch 12", course: "AWS SA Pro", trainer: "John Smith", startDate: "Jan 15, 2024", students: 24, status: "upcoming" },
  { id: 2, name: "Kubernetes Fundamentals - Batch 8", course: "K8s Basics", trainer: "Jane Doe", startDate: "Jan 10, 2024", students: 18, status: "live" },
  { id: 3, name: "Docker Masterclass - Batch 15", course: "Docker Pro", trainer: "Mike Johnson", startDate: "Dec 1, 2023", students: 30, status: "completed" },
  { id: 4, name: "Terraform Advanced - Batch 5", course: "Terraform Pro", trainer: "Sarah Wilson", startDate: "Jan 20, 2024", students: 15, status: "upcoming" },
  { id: 5, name: "Azure DevOps - Batch 3", course: "Azure DevOps", trainer: "Tom Brown", startDate: "Jan 8, 2024", students: 22, status: "live" },
  { id: 6, name: "Linux Administration - Batch 20", course: "Linux Admin", trainer: "Emily Chen", startDate: "Nov 15, 2023", students: 28, status: "completed" },
];

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

export default function Batches() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredBatches = batchesData.filter((batch) => {
    const matchesFilter = filter === "all" || batch.status === filter;
    const matchesSearch = batch.name.toLowerCase().includes(search.toLowerCase()) ||
      batch.trainer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: batchesData.length,
    live: batchesData.filter(b => b.status === "live").length,
    upcoming: batchesData.filter(b => b.status === "upcoming").length,
    completed: batchesData.filter(b => b.status === "completed").length,
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Batches"
        description="Manage your training batches and sessions"
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Batch
          </Button>
        }
      />

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="live" className="text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5" />
              Live ({counts.live})
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="text-xs">Upcoming ({counts.upcoming})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed ({counts.completed})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Batch List */}
      <div className="space-y-2">
        {filteredBatches.map((batch) => (
          <Card key={batch.id} className="hover:border-border/80 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Link 
                        to={`/batches/${batch.id}`} 
                        className="font-medium text-sm hover:text-primary transition-colors truncate"
                      >
                        {batch.name}
                      </Link>
                      <StatusBadge
                        status={statusMap[batch.status].status}
                        label={statusMap[batch.status].label}
                        size="sm"
                        pulse={batch.status === "live"}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{batch.course}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{batch.trainer}</span>
                      <span>•</span>
                      <span>{batch.startDate}</span>
                      <span>•</span>
                      <span>{batch.students} students</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Batch</DropdownMenuItem>
                      <DropdownMenuItem>Manage Students</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/batches/${batch.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <span>Showing {filteredBatches.length} of {batchesData.length} batches</span>
      </div>
    </div>
  );
}
