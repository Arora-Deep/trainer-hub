import { useState } from "react";
import { format } from "date-fns";
import { 
  Users, 
  ChevronRight, 
  TrendingUp,
  Calendar,
  MessageSquare,
  MoreHorizontal,
  ArrowUpRight,
  Briefcase,
  Target,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircularProgress } from "@/components/ui/CircularProgress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Mock data
const activityData = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 35 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 80 },
  { day: "Sat", value: 65 },
  { day: "Sun", value: 40 },
];

const todayTasks = [
  { id: 1, title: "Review Course Content", subtitle: "AWS Solutions Architect", icon: Target, color: "text-primary" },
  { id: 2, title: "Prepare Lab Environment", subtitle: "Kubernetes Batch", icon: Briefcase, color: "text-orange-500" },
  { id: 3, title: "Update Quiz Questions", subtitle: "Docker Fundamentals", icon: Star, color: "text-primary" },
];

const teamMembers = [
  { id: 1, name: "Sarah Miller", role: "Co-Trainer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", online: true },
  { id: 2, name: "James Wilson", role: "Lab Assistant", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", online: true },
  { id: 3, name: "Emily Chen", role: "Content Creator", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily", online: false },
];

const projects = [
  { id: 1, name: "AWS Certification", category: "Cloud", color: "bg-orange-500", progress: 75 },
  { id: 2, name: "Kubernetes Mastery", category: "DevOps", color: "bg-primary", progress: 45 },
  { id: 3, name: "Docker Workshop", category: "Containers", color: "bg-success", progress: 90 },
];

export default function Dashboard() {
  const currentDate = format(new Date(), "EEEE, dd MMMM yyyy");

  return (
    <div className="animate-in-up">
      {/* Three-column layout */}
      <div className="flex gap-6">
        {/* Main Content - Left & Center */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-sm text-muted-foreground">{currentDate}</p>
            </div>
            <Button className="btn-orange gap-2 h-10">
              <Calendar className="h-4 w-4" />
              Aug - Dec 2024
            </Button>
          </div>

          {/* Hero Banner */}
          <div className="hero-banner p-8 flex items-center gap-8">
            <div className="flex-1 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">Welcome back!</span>
              </div>
              <h2 className="text-3xl font-bold mb-3">Hello, John Doe 👋</h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-md">
                You have 3 upcoming batches this week. Among them are 2 AWS sessions, 
                1 Kubernetes workshop. Your progress is looking great at 70%!
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl font-bold">70%</div>
                    <div className="text-sm opacity-90">Overall</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Progress Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <div className="card-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Activity</h3>
                <select className="text-sm bg-muted rounded-lg px-3 py-1.5 border-0 font-medium text-muted-foreground">
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262, 60%, 65%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(262, 60%, 65%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-lg)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(262, 60%, 65%)" 
                      strokeWidth={3}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress & Stats */}
            <div className="card-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Progress</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-8">
                <CircularProgress value={70} size={130} strokeWidth={12} color="orange" />
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">5</div>
                      <div className="text-xs text-muted-foreground">Active Batches</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl icon-box-orange flex items-center justify-center">
                      <Target className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">142+</div>
                      <div className="text-xs text-muted-foreground">Students Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Active Courses</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">2 Design</span>
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">3 DevOps</span>
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">2 Cloud</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link to="/courses" key={project.id}>
                  <div className="project-card group">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", project.color)}>
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {project.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{project.category}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Track progress and manage all training materials in one place.
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full rounded-full", project.color)}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{project.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] shrink-0 space-y-6">
          {/* Profile Card */}
          <div className="card-soft p-6 text-center">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">My Profile</h3>
            <p className="text-xs text-muted-foreground mb-4">70% Complete</p>
            <div className="profile-avatar-ring w-24 h-24 mx-auto mb-4">
              <Avatar className="w-full h-full">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
                <AvatarFallback className="text-lg font-bold">JD</AvatarFallback>
              </Avatar>
            </div>
            <h4 className="font-bold text-foreground">John Doe</h4>
            <p className="text-xs text-muted-foreground">Senior Trainer</p>
          </div>

          {/* Today's Tasks */}
          <div className="card-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Today</h3>
              <Link to="/batches" className="text-xs text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div key={task.id} className="task-item group">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", 
                    task.color === "text-primary" ? "bg-primary/10" : "bg-orange-500/10"
                  )}>
                    <task.icon className={cn("h-5 w-5", task.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{task.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{task.subtitle}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="card-soft p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Team</h3>
              <Link to="/settings" className="text-xs text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {member.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
