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
import { Plus, Search, MoreHorizontal, HelpCircle, Clock, Users, BarChart3 } from "lucide-react";

const quizzes = [
  { id: "1", title: "JavaScript Fundamentals Quiz", course: "JavaScript Essentials", questions: 25, duration: "30 min", attempts: 234, avgScore: 78, status: "published" },
  { id: "2", title: "React Hooks Assessment", course: "Advanced React", questions: 20, duration: "25 min", attempts: 156, avgScore: 72, status: "published" },
  { id: "3", title: "Python Basics Test", course: "Python for Beginners", questions: 30, duration: "45 min", attempts: 312, avgScore: 81, status: "published" },
  { id: "4", title: "Database Design Quiz", course: "SQL Masterclass", questions: 15, duration: "20 min", attempts: 89, avgScore: 75, status: "draft" },
  { id: "5", title: "Docker & Kubernetes Test", course: "DevOps Fundamentals", questions: 35, duration: "50 min", attempts: 0, avgScore: 0, status: "draft" },
  { id: "6", title: "AWS Services Overview", course: "Cloud Computing", questions: 40, duration: "60 min", attempts: 67, avgScore: 68, status: "published" },
];

export default function Quizzes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || quiz.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: quizzes.length,
    published: quizzes.filter(q => q.status === "published").length,
    draft: quizzes.filter(q => q.status === "draft").length,
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
        title="Quizzes"
        description="Create and manage assessments"
        breadcrumbs={[{ label: "Quizzes" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        }
      />

      {/* Filters */}
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
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:border-border/80 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Preview Quiz</DropdownMenuItem>
                    <DropdownMenuItem>Edit Questions</DropdownMenuItem>
                    <DropdownMenuItem>View Analytics</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <h3 className="font-medium text-sm mb-1">{quiz.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{quiz.course}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>{quiz.questions} questions</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {quiz.duration}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {quiz.attempts}
                  </span>
                  {quiz.avgScore > 0 && (
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={quiz.avgScore >= 75 ? 'text-success' : quiz.avgScore >= 60 ? 'text-warning' : 'text-destructive'}>
                        {quiz.avgScore}%
                      </span>
                    </span>
                  )}
                </div>
                <StatusBadge
                  status={getStatusVariant(quiz.status) as any}
                  label={quiz.status}
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
