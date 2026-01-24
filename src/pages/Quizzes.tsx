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
  HelpCircle, 
  CheckCircle,
  Clock,
  FileQuestion,
  Edit,
  Copy,
  Trash2,
  Eye,
  BarChart3
} from "lucide-react";
import { useQuizStore } from "@/stores/quizStore";

const Quizzes = () => {
  const navigate = useNavigate();
  const { quizzes } = useQuizStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || quiz.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: quizzes.length,
    published: quizzes.filter(q => q.status === "published").length,
    totalQuestions: quizzes.reduce((sum, q) => sum + q.questions.length, 0),
    totalAttempts: quizzes.reduce((sum, q) => sum + q.attempts, 0),
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
        title="Quizzes"
        description="Create and manage course quizzes and assessments"
        actions={
          <Button onClick={() => navigate("/quizzes/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Quizzes"
          value={stats.total}
          icon={HelpCircle}
        />
        <StatCard
          title="Published"
          value={stats.published}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Total Questions"
          value={stats.totalQuestions}
          icon={FileQuestion}
          variant="info"
        />
        <StatCard
          title="Total Attempts"
          value={stats.totalAttempts}
          icon={Clock}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
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
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id} className="table-row-premium">
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell className="text-muted-foreground">{quiz.course}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.duration} min</TableCell>
                  <TableCell>{quiz.attempts}</TableCell>
                  <TableCell>
                    {quiz.avgScore > 0 ? (
                      <span className={`font-medium ${quiz.avgScore >= 75 ? 'text-green-600' : quiz.avgScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                        {quiz.avgScore}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={getStatusVariant(quiz.status) as any}
                      label={quiz.status}
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
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Quiz
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Questions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          View Analytics
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

export default Quizzes;
