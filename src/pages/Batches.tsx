import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

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
    <div className="space-y-6">
      <PageHeader
        title="Batches"
        description="Manage all your training batches and sessions"
        breadcrumbs={[{ label: "Batches" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Batch
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All Batches</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Batches Table */}
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Batch Name</TableHead>
              <TableHead className="font-medium">Course</TableHead>
              <TableHead className="font-medium">Trainer</TableHead>
              <TableHead className="font-medium">Start Date</TableHead>
              <TableHead className="font-medium">End Date</TableHead>
              <TableHead className="font-medium text-center">Students</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBatches.map((batch) => (
              <TableRow key={batch.id} className="hover:bg-muted/50">
                <TableCell>
                  <Link to={`/batches/${batch.id}`} className="font-medium text-foreground hover:text-foreground/80">
                    {batch.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{batch.course}</TableCell>
                <TableCell className="text-muted-foreground">{batch.trainer}</TableCell>
                <TableCell className="text-muted-foreground">{batch.startDate}</TableCell>
                <TableCell className="text-muted-foreground">{batch.endDate}</TableCell>
                <TableCell className="text-center">{batch.students}</TableCell>
                <TableCell>
                  <StatusBadge
                    status={statusMap[batch.status].status}
                    label={statusMap[batch.status].label}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
