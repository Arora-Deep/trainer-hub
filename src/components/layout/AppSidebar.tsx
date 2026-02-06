import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Settings,
  ChevronLeft,
  GraduationCap,
  Layers,
  Award,
  FileQuestion,
  ClipboardList,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { title: "Dashboard", icon: Home, path: "/" },
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
  { title: "Support", icon: HelpCircle, path: "/support" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path || 
      (item.path !== "/" && location.pathname.startsWith(item.path));
    
    const link = (
      <NavLink
        to={item.path}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2.5"
        )}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && (
          <span className="truncate">{item.title}</span>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="font-medium"
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-4 gap-3",
          collapsed && "justify-center px-3"
        )}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground text-sm tracking-tight">
              Trainer Portal
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border p-2 space-y-0.5">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full text-muted-foreground hover:text-foreground h-8",
                  collapsed ? "justify-center px-2" : "justify-between px-3"
                )}
              >
                {!collapsed && <span className="text-xs">Collapse</span>}
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    collapsed && "rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
