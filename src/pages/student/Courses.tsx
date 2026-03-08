import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen, Play, CheckCircle, Clock, Search, ChevronRight,
  Video, FileText, FlaskConical, Award, BarChart3, Lock,
  Bookmark, BookmarkCheck, Star, Timer, User, ChevronDown,
  PartyPopper, ExternalLink,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

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
  instructorBio: string;
  modules: number;
  completed: number;
  totalHours: number;
  status: "in_progress" | "completed" | "not_started";
  category: string;
  nextModule: string;
  lastAccessed: string;
  rating: number;
  studyTime: string;
  studyData: { day: string; hours: number }[];
  batch: string;
  prerequisites: string[];
  description: string;
  moduleList: CourseModule[];
}

const courses: Course[] = [
  {
    id: "1", name: "AWS Cloud Practitioner", instructor: "James Wilson",
    instructorBio: "15+ years cloud architecture experience. AWS Solutions Architect Professional.",
    modules: 12, completed: 8, totalHours: 24, status: "in_progress", category: "Cloud",
    nextModule: "Module 9: VPC Deep Dive", lastAccessed: "2h ago", rating: 4.8,
    studyTime: "8h 20m", batch: "Batch 12",
    prerequisites: [],
    description: "Master the fundamentals of Amazon Web Services. Covers EC2, S3, VPC, IAM, and more. Prepares you for the AWS Cloud Practitioner certification exam.",
    studyData: [
      { day: "Mon", hours: 1.5 }, { day: "Tue", hours: 2 }, { day: "Wed", hours: 0.5 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 1.5 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 0.8 },
    ],
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
    id: "2", name: "Kubernetes Fundamentals", instructor: "Sarah Chen",
    instructorBio: "CNCF Ambassador. 10 years container orchestration. K8s contributor.",
    modules: 8, completed: 2, totalHours: 16, status: "in_progress", category: "DevOps",
    nextModule: "Module 3: Pods & Deployments", lastAccessed: "1d ago", rating: 4.6,
    studyTime: "3h 10m", batch: "Batch 5",
    prerequisites: ["Docker Essentials"],
    description: "Deep dive into Kubernetes architecture, pods, services, deployments, and Helm. Hands-on cluster management and troubleshooting.",
    studyData: [
      { day: "Mon", hours: 0.5 }, { day: "Tue", hours: 1 }, { day: "Wed", hours: 0 },
      { day: "Thu", hours: 0.5 }, { day: "Fri", hours: 0.5 }, { day: "Sat", hours: 0.5 }, { day: "Sun", hours: 0.2 },
    ],
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
    id: "3", name: "Docker Essentials", instructor: "Mark Davis",
    instructorBio: "DevOps engineer at scale. Built CI/CD for Fortune 500 companies.",
    modules: 6, completed: 6, totalHours: 10, status: "completed", category: "DevOps",
    nextModule: "—", lastAccessed: "1w ago", rating: 4.9,
    studyTime: "11h 45m", batch: "Batch 8",
    prerequisites: [],
    description: "Everything you need to know about Docker — from building images to multi-container applications with Docker Compose.",
    studyData: [
      { day: "Mon", hours: 2 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 2 },
      { day: "Thu", hours: 1.5 }, { day: "Fri", hours: 2 }, { day: "Sat", hours: 1.5 }, { day: "Sun", hours: 1.25 },
    ],
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
    id: "4", name: "Terraform Basics", instructor: "Alex Kumar",
    instructorBio: "HashiCorp Ambassador. Infrastructure automation specialist.",
    modules: 10, completed: 0, totalHours: 18, status: "not_started", category: "IaC",
    nextModule: "Module 1: Intro to IaC", lastAccessed: "—", rating: 4.5,
    studyTime: "0h", batch: "Batch 12",
    prerequisites: ["AWS Cloud Practitioner"],
    description: "Learn Infrastructure as Code with Terraform. Provision and manage cloud resources declaratively across AWS, Azure, and GCP.",
    studyData: [],
    moduleList: [],
  },
];

const moduleIcons = { video: Video, reading: FileText, lab: FlaskConical, quiz: Award };

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(["1-3", "2-0"]));
  const [showBookmarks, setShowBookmarks] = useState(false);

  const toggleBookmark = (key: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

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
        <div className="flex items-center gap-2">
          <Button
            variant={showBookmarks ? "default" : "outline"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setShowBookmarks(!showBookmarks)}
          >
            <BookmarkCheck className="h-3.5 w-3.5" /> Saved ({bookmarked.size})
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>{courses.filter(c => c.status === "completed").length}/{courses.length} completed</span>
          </div>
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
          const isCompleted = c.status === "completed";

          return (
            <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`overflow-hidden transition-all hover:shadow-md ${isCompleted ? "border-success/20" : ""}`}>
                <CardContent className="pt-6">
                  {/* Completion celebration */}
                  {isCompleted && (
                    <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-success/5 border border-success/20">
                      <PartyPopper className="h-4 w-4 text-success" />
                      <span className="text-xs font-medium text-success">Course completed! 🎉</span>
                      <Button variant="ghost" size="sm" className="ml-auto text-xs gap-1 text-success">
                        <ExternalLink className="h-3 w-3" /> View Certificate
                      </Button>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 cursor-pointer" onClick={() => setSelectedCourse(c)}>
                      <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${
                        isCompleted ? "bg-success/10" : c.status === "in_progress" ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {isCompleted ? <CheckCircle className="h-5 w-5 text-success" /> : <BookOpen className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm">{c.name}</h3>
                          <Badge variant="outline" className="text-[10px]">{c.category}</Badge>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><Star className="h-3 w-3 text-warning fill-warning" /> {c.rating}</span>
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
                        <div className="flex items-center gap-4 mt-1.5">
                          {c.lastAccessed !== "—" && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Last: {c.lastAccessed}
                            </p>
                          )}
                          {c.studyTime !== "0h" && (
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Timer className="h-3 w-3" /> Study time: {c.studyTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant={isCompleted ? "outline" : "default"} className="gap-1.5">
                        <Play className="h-3.5 w-3.5" /> {isCompleted ? "Review" : c.status === "not_started" ? "Start" : "Continue"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Course Detail Drawer */}
      <Sheet open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCourse && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{selectedCourse.category}</Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-warning fill-warning" /> {selectedCourse.rating}
                  </span>
                </div>
                <SheetTitle className="text-lg">{selectedCourse.name}</SheetTitle>
              </SheetHeader>

              <div className="mt-4 space-y-6">
                {/* Description */}
                <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedCourse.instructor}</p>
                    <p className="text-xs text-muted-foreground">{selectedCourse.instructorBio}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{selectedCourse.modules}</p>
                    <p className="text-[10px] text-muted-foreground">Modules</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{selectedCourse.totalHours}h</p>
                    <p className="text-[10px] text-muted-foreground">Total Time</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-lg font-bold">{selectedCourse.studyTime}</p>
                    <p className="text-[10px] text-muted-foreground">Your Time</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{selectedCourse.completed}/{selectedCourse.modules} modules</span>
                  </div>
                  <Progress value={(selectedCourse.completed / selectedCourse.modules) * 100} className="h-2" />
                </div>

                {/* Study Time Chart */}
                {selectedCourse.studyData.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold mb-2">Study Time This Week</h4>
                    <ResponsiveContainer width="100%" height={80}>
                      <AreaChart data={selectedCourse.studyData}>
                        <defs>
                          <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }}
                          formatter={(value: number) => [`${value}h`, "Study"]}
                        />
                        <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fill="url(#studyGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Prerequisites */}
                {selectedCourse.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold mb-2">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.prerequisites.map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs gap-1">
                          <CheckCircle className="h-3 w-3 text-success" /> {p}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Module Timeline */}
                <div>
                  <h4 className="text-xs font-semibold mb-3">Course Modules</h4>
                  <div className="space-y-0">
                    {selectedCourse.moduleList.map((m, mi) => {
                      const Icon = moduleIcons[m.type];
                      const isCurrentModule = !m.completed && !m.locked && (mi === 0 || selectedCourse.moduleList[mi - 1]?.completed);
                      const bookmarkKey = `${selectedCourse.id}-${mi}`;
                      const isBookmarked = bookmarked.has(bookmarkKey);

                      return (
                        <div key={mi} className="flex gap-3">
                          {/* Timeline connector */}
                          <div className="flex flex-col items-center">
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                              m.completed ? "bg-success/10 border-success" :
                              isCurrentModule ? "bg-primary border-primary animate-pulse" :
                              m.locked ? "bg-muted border-border" : "bg-background border-border"
                            }`}>
                              {m.completed ? <CheckCircle className="h-3.5 w-3.5 text-success" /> :
                               m.locked ? <Lock className="h-3 w-3 text-muted-foreground" /> :
                               isCurrentModule ? <Play className="h-3 w-3 text-primary-foreground" /> :
                               <Icon className="h-3 w-3 text-muted-foreground" />}
                            </div>
                            {mi < selectedCourse.moduleList.length - 1 && (
                              <div className={`w-0.5 flex-1 min-h-[24px] ${m.completed ? "bg-success/30" : "bg-border"}`} />
                            )}
                          </div>

                          {/* Content */}
                          <div className={`flex-1 pb-4 ${m.locked ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${isCurrentModule ? "text-primary" : m.completed ? "text-muted-foreground line-through" : ""}`}>
                                {m.name}
                              </span>
                              {isCurrentModule && <Badge className="text-[9px] bg-primary/20 text-primary h-4">Current</Badge>}
                              {!m.locked && (
                                <button onClick={() => toggleBookmark(bookmarkKey)} className="ml-auto">
                                  {isBookmarked ?
                                    <BookmarkCheck className="h-3.5 w-3.5 text-primary" /> :
                                    <Bookmark className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                                  }
                                </button>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[9px] capitalize">{m.type}</Badge>
                              <span className="text-[10px] text-muted-foreground">{m.duration}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
