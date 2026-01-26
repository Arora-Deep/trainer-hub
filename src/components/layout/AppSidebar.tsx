import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Settings,
  HelpCircle,
  FlaskConical,
  BookOpen,
  Layers,
  Award,
  FileQuestion,
  ClipboardList,
  Code2,
  Users,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Batches", icon: Users, path: "/batches" },
  { title: "Labs", icon: FlaskConical, path: "/labs" },
  { title: "Courses", icon: BookOpen, path: "/courses" },
  { title: "Programs", icon: Layers, path: "/programs" },
  { title: "Certifications", icon: Award, path: "/certifications" },
  { title: "Quizzes", icon: FileQuestion, path: "/quizzes" },
  { title: "Assignments", icon: ClipboardList, path: "/assignments" },
  { title: "Exercises", icon: Code2, path: "/exercises" },
];

const bottomNavItems = [
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Help", icon: HelpCircle, path: "/support" },
];

export function AppSidebar() {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path || 
      (item.path !== "/" && location.pathname.startsWith(item.path));
    
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={item.path}
            className={cn(
              "nav-item-soft",
              isActive && "nav-item-soft-active"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        </TooltipTrigger>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-[240px] flex-col sidebar-soft">
        {/* Logo */}
        <div className="flex h-[80px] items-center px-5 gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-white text-lg font-bold">T</span>
          </div>
          <div>
            <span className="font-bold text-foreground text-lg tracking-tight block">
              Trainer
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Portal Dashboard
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-4 py-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Add New Project Button */}
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            className="w-full justify-start gap-3 h-12 rounded-2xl font-semibold"
            style={{ background: "var(--gradient-orange)", boxShadow: "var(--shadow-glow-orange)" }}
          >
            <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
            Add New Batch
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
