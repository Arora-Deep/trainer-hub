import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Code2, 
  CheckCircle,
  Zap,
  Terminal,
  Edit,
  Copy,
  Trash2,
  Eye,
  Play,
  BarChart3
} from "lucide-react";
import { useExerciseStore } from "@/stores/exerciseStore";

const Exercises = () => {
  const navigate = useNavigate();
  const { exercises } = useExerciseStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.language.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === "all" || exercise.status === activeFilter;
    const matchesDifficulty = difficultyFilter === "all" || exercise.difficulty === difficultyFilter;
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const stats = {
    total: exercises.length,
    published: exercises.filter(e => e.status === "published").length,
    totalSubmissions: exercises.reduce((sum, e) => sum + e.submissions, 0),
    avgSuccessRate: exercises.length > 0 
      ? Math.round(exercises.reduce((sum, e) => sum + e.successRate, 0) / exercises.length)
      : 0,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
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
    <div className="space-y-6">
      <PageHeader
        title="Programming Exercises"
        description="Create and manage coding challenges with automated test cases"
        actions={
          <Button onClick={() => navigate("/exercises/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Exercise
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Exercises"
          value={stats.total}
          icon={Code2}
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Total Submissions"
          value={stats.totalSubmissions.toLocaleString()}
          icon={Terminal}
          variant="info"
        />
        <StatCard
          title="Avg Success Rate"
          value={`${stats.avgSuccessRate}%`}
          icon={Zap}
          variant="warning"
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2 flex-wrap">
                {["all", "published", "draft"].map((filter) => (
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
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-muted-foreground self-center">Difficulty:</span>
              {["all", "easy", "medium", "hard"].map((diff) => (
                <Button
                  key={diff}
                  variant={difficultyFilter === diff ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setDifficultyFilter(diff)}
                  className="capitalize text-xs"
                >
                  {diff}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exercise</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Test Cases</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExercises.map((exercise) => (
                <TableRow key={exercise.id} className="table-row-premium">
                  <TableCell className="font-medium">{exercise.title}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs">
                      {exercise.topic}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Code2 className="h-3.5 w-3.5" />
                      {exercise.language}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>{exercise.testCases.length}</TableCell>
                  <TableCell>{exercise.submissions}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${exercise.successRate >= 80 ? 'text-green-600' : exercise.successRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {exercise.successRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={getStatusVariant(exercise.status) as any}
                      label={exercise.status}
                    />
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
                          <Play className="mr-2 h-4 w-4" />
                          Try Exercise
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Submissions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Exercise
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
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

export default Exercises;
