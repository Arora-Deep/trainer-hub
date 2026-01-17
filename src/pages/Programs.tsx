import { useState } from "react";
import { Link } from "react-router-dom";
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
import { Plus, Search, MoreHorizontal, GraduationCap, Users, Clock, ChevronRight } from "lucide-react";

const programs = [
  { id: "1", name: "Full Stack Development Bootcamp", courses: 8, duration: "16 weeks", enrolled: 156, status: "active" },
  { id: "2", name: "Data Science Fundamentals", courses: 6, duration: "12 weeks", enrolled: 89, status: "active" },
  { id: "3", name: "Cloud Architecture Certificate", courses: 5, duration: "10 weeks", enrolled: 45, status: "draft" },
  { id: "4", name: "DevOps Engineering Path", courses: 7, duration: "14 weeks", enrolled: 72, status: "active" },
  { id: "5", name: "Cybersecurity Essentials", courses: 4, duration: "8 weeks", enrolled: 0, status: "archived" },
];

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || program.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: programs.length,
    active: programs.filter(p => p.status === "active").length,
    draft: programs.filter(p => p.status === "draft").length,
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "archived": return "default";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Programs"
        description="Learning paths combining multiple courses"
        breadcrumbs={[{ label: "Programs" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Program
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Draft ({counts.draft})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="hover:border-border/80 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Program</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <Link to={`/programs/${program.id}`} className="block group/link">
                <h3 className="font-medium text-sm mb-2 group-hover/link:text-primary transition-colors">
                  {program.name}
                </h3>
              </Link>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>{program.courses} courses</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {program.duration}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{program.enrolled} enrolled</span>
                </div>
                <StatusBadge
                  status={getStatusVariant(program.status) as any}
                  label={program.status}
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
