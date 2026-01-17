import { useState } from "react";
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
import { Plus, Search, MoreHorizontal, Code2, Play, Terminal, BarChart3 } from "lucide-react";

const exercises = [
  { id: "1", title: "Two Sum Problem", language: "Python", difficulty: "easy", submissions: 456, successRate: 89, testCases: 12, status: "published", topic: "Arrays" },
  { id: "2", title: "Binary Search Tree", language: "JavaScript", difficulty: "medium", submissions: 234, successRate: 72, testCases: 18, status: "published", topic: "Trees" },
  { id: "3", title: "Graph Traversal (BFS/DFS)", language: "Python", difficulty: "hard", submissions: 123, successRate: 58, testCases: 25, status: "published", topic: "Graphs" },
  { id: "4", title: "REST API Implementation", language: "Node.js", difficulty: "medium", submissions: 189, successRate: 76, testCases: 15, status: "published", topic: "APIs" },
  { id: "5", title: "React Component Testing", language: "TypeScript", difficulty: "medium", submissions: 145, successRate: 81, testCases: 10, status: "published", topic: "Testing" },
  { id: "6", title: "Dynamic Programming - Knapsack", language: "Python", difficulty: "hard", submissions: 67, successRate: 45, testCases: 20, status: "draft", topic: "DP" },
  { id: "7", title: "SQL Query Optimization", language: "SQL", difficulty: "medium", submissions: 198, successRate: 83, testCases: 8, status: "published", topic: "Database" },
  { id: "8", title: "Linked List Reversal", language: "Java", difficulty: "easy", submissions: 312, successRate: 92, testCases: 6, status: "published", topic: "Linked Lists" },
];

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === "all" || exercise.status === activeFilter;
    const matchesDifficulty = difficultyFilter === "all" || exercise.difficulty === difficultyFilter;
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const counts = {
    all: exercises.length,
    published: exercises.filter(e => e.status === "published").length,
    draft: exercises.filter(e => e.status === "draft").length,
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success";
      case "medium": return "bg-warning/10 text-warning";
      case "hard": return "bg-destructive/10 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "published": return "success";
      case "draft": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Programming Exercises"
        description="Coding challenges with automated testing"
        breadcrumbs={[{ label: "Exercises" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Exercise
          </Button>
        }
      />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeFilter} onValueChange={setActiveFilter}>
            <TabsList className="h-9">
              <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
              <TabsTrigger value="published" className="text-xs">Published ({counts.published})</TabsTrigger>
              <TabsTrigger value="draft" className="text-xs">Draft ({counts.draft})</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>
        
        {/* Difficulty Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Difficulty:</span>
          {["all", "easy", "medium", "hard"].map((diff) => (
            <Button
              key={diff}
              variant={difficultyFilter === diff ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDifficultyFilter(diff)}
              className="h-7 text-xs capitalize"
            >
              {diff}
            </Button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExercises.map((exercise) => (
          <Card key={exercise.id} className="hover:border-border/80 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${getDifficultyStyle(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="h-4 w-4 mr-2" />
                        Try Exercise
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Exercise</DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <h3 className="font-medium text-sm mb-1">{exercise.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-0.5 rounded bg-muted">{exercise.topic}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Terminal className="h-3 w-3" />
                  {exercise.language}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{exercise.submissions} attempts</span>
                  <span className={exercise.successRate >= 80 ? 'text-success' : exercise.successRate >= 60 ? 'text-warning' : 'text-destructive'}>
                    {exercise.successRate}% pass
                  </span>
                </div>
                <StatusBadge
                  status={getStatusVariant(exercise.status) as any}
                  label={exercise.status}
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
