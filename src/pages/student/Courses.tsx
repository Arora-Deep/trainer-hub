import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BookOpen, Play, CheckCircle, Clock, Search, ChevronRight,
  Video, FileText, FlaskConical, Award, BarChart3, Lock,
} from "lucide-react";

interface CourseModule {
  name: string;
  type: "video" | "reading" | "lab" | "quiz";
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  modules: number;
  completed: number;
  totalHours: number;
  status: "in_progress" | "completed" | "not_started";
  category: string;
  nextModule: string;
  lastAccessed: string;
  rating: number;
  moduleList: CourseModule[];
}

const courses: Course[] = [
  {
    id: "1", name: "AWS Cloud Practitioner", instructor: "James Wilson", modules: 12, completed: 8,
    totalHours: 24, status: "in_progress", category: "Cloud", nextModule: "Module 9: VPC Deep Dive",
    lastAccessed: "2h ago", rating: 4.8,
    moduleList: [
      { name: "Introduction to AWS", type: "video", duration: "45m", completed: true, locked: false },
      { name: "IAM & Security", type: "video", duration: "1h 15m", completed: true, locked: false },
      { name: "EC2 Fundamentals", type: "video", duration: "2h", completed: true, locked: false },
      { name: "EC2 Hands-on Lab", type: "lab", duration: "1h", completed: true, locked: false },
      { name: "S3 & Storage", type: "video", duration: "1h 30m", completed: true, locked: false },
      { name: "S3 Quiz", type: "quiz", duration: "20m", completed: true, locked: false },
      { name: "Networking Basics", type: "reading", duration: "30m", completed: true, locked: false },
      { name: "VPC Overview", type: "video", duration: "1h", completed: true, locked: false },
      { name: "VPC Deep Dive", type: "video", duration: "1h 30m", completed: false, locked: false },
      { name: "VPC Lab", type: "lab", duration: "1h 30m", completed: false, locked: false },
      { name: "Route 53 & CDN", type: "video", duration: "1h", completed: false, locked: true },
      { name: "Final Assessment", type: "quiz", duration: "45m", completed: false, locked: true },
    ],
  },
  {
    id: "2", name: "Kubernetes Fundamentals", instructor: "Sarah Chen", modules: 8, completed: 2,
    totalHours: 16, status: "in_progress", category: "DevOps", nextModule: "Module 3: Pods & Deployments",
    lastAccessed: "1d ago", rating: 4.6,
    moduleList: [
      { name: "Intro to Container Orchestration", type: "video", duration: "30m", completed: true, locked: false },
      { name: "K8s Architecture", type: "video", duration: "1h", completed: true, locked: false },
      { name: "Pods & Deployments", type: "video", duration: "1h 30m", completed: false, locked: false },
      { name: "K8s Lab: First Cluster", type: "lab", duration: "2h", completed: false, locked: false },
      { name: "Services & Networking", type: "video", duration: "1h 15m", completed: false, locked: true },
      { name: "ConfigMaps & Secrets", type: "reading", duration: "30m", completed: false, locked: true },
      { name: "Helm Charts", type: "video", duration: "1h", completed: false, locked: true },
      { name: "K8s Final Quiz", type: "quiz", duration: "30m", completed: false, locked: true },
    ],
  },
  {
    id: "3", name: "Docker Essentials", instructor: "Mark Davis", modules: 6, completed: 6,
    totalHours: 10, status: "completed", category: "DevOps", nextModule: "—",
    lastAccessed: "1w ago", rating: 4.9,
    moduleList: [
      { name: "What is Docker?", type: "video", duration: "30m", completed: true, locked: false },
      { name: "Images & Containers", type: "video", duration: "1h", completed: true, locked: false },
      { name: "Dockerfile & Build", type: "lab", duration: "1h 30m", completed: true, locked: false },
      { name: "Docker Compose", type: "video", duration: "1h", completed: true, locked: false },
      { name: "Networking & Volumes", type: "reading", duration: "45m", completed: true, locked: false },
      { name: "Docker Final Quiz", type: "quiz", duration: "30m", completed: true, locked: false },
    ],
  },
  {
    id: "4", name: "Terraform Basics", instructor: "Alex Kumar", modules: 10, completed: 0,
    totalHours: 18, status: "not_started", category: "IaC", nextModule: "Module 1: Intro to IaC",
    lastAccessed: "—", rating: 4.5,
    moduleList: [],
  },
];

const moduleIcons = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award };

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [tab, setTab] = useState("all");

  const filtered = courses.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (tab === "all") return matchSearch;
    return matchSearch && c.status === tab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your learning journey across all enrolled courses</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BarChart3 className="h-4 w-4" />
          <span>{courses.filter(c => c.status === "completed").length}/{courses.length} completed</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search courses..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all" className="text-xs">All ({courses.length})</TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs">In Progress ({courses.filter(c => c.status === "in_progress").length})</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">Completed ({courses.filter(c => c.status === "completed").length})</TabsTrigger>
            <TabsTrigger value="not_started" className="text-xs">Not Started ({courses.filter(c => c.status === "not_started").length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Course Cards */}
      <div className="space-y-4">
        {filtered.map((c) => {
          const pct = c.modules > 0 ? Math.round((c.completed / c.modules) * 100) : 0;
          const isExpanded = expandedCourse === c.id;

          return (
            <Card key={c.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${
                      c.status === "completed" ? "bg-success/10" : c.status === "in_progress" ? "bg-primary/10" : "bg-muted"
                    }`}>
                      {c.status === "completed" ? <CheckCircle className="h-5 w-5 text-success" /> : <BookOpen className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{c.name}</h3>
                        <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                        <span className="text-[11px] text-muted-foreground">⭐ {c.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">By {c.instructor} · {c.completed}/{c.modules} modules · {c.totalHours}h total</p>
                      {c.status === "in_progress" && (
                        <p className="text-xs text-primary mt-1 flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" /> Next: {c.nextModule}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                      </div>
                      {c.lastAccessed !== "—" && (
                        <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Last accessed: {c.lastAccessed}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {c.moduleList.length > 0 && (
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setExpandedCourse(isExpanded ? null : c.id)}>
                        {isExpanded ? "Hide" : "Modules"}
                      </Button>
                    )}
                    <Button size="sm" variant={c.status === "completed" ? "outline" : "default"} className="gap-1.5">
                      <Play className="h-3.5 w-3.5" /> {c.status === "completed" ? "Review" : c.status === "not_started" ? "Start" : "Continue"}
                    </Button>
                  </div>
                </div>

                {/* Expanded Module List */}
                {isExpanded && c.moduleList.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <div className="space-y-1">
                      {c.moduleList.map((m, mi) => {
                        const Icon = moduleIcons[m.type];
                        return (
                          <div key={mi} className={`flex items-center gap-3 py-2 px-3 rounded-md text-sm ${
                            m.completed ? "text-muted-foreground" : m.locked ? "opacity-50" : "hover:bg-muted/50 cursor-pointer"
                          }`}>
                            <div className={`h-6 w-6 rounded flex items-center justify-center ${
                              m.completed ? "bg-success/10" : m.locked ? "bg-muted" : "bg-primary/10"
                            }`}>
                              {m.completed ? <CheckCircle className="h-3.5 w-3.5 text-success" /> :
                               m.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> :
                               <Icon className="h-3.5 w-3.5 text-primary" />}
                            </div>
                            <span className={`flex-1 text-xs ${m.completed ? "line-through" : ""}`}>{m.name}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{m.type}</Badge>
                            <span className="text-[11px] text-muted-foreground">{m.duration}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
