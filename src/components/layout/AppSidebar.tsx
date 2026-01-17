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
  Sparkles,
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
  { title: "Home", icon: Home, path: "/" },
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
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2.5"
        )}
        style={isActive ? { boxShadow: "0 2px 8px -2px hsl(var(--primary) / 0.4)" } : undefined}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] shrink-0 transition-transform duration-200",
          !isActive && "group-hover:scale-110"
        )} />
        {!collapsed && <span>{item.title}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium">
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
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-out",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4 gap-3",
          collapsed && "justify-center px-2"
        )}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shrink-0">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-sidebar" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-semibold text-sidebar-foreground tracking-tight block">
                Trainer Portal
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Enterprise Edition
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
          
          {/* Pro Feature Promo (when not collapsed) */}
          {!collapsed && (
            <div className="mt-6 p-3 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Pro Features</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Unlock advanced analytics, custom branding, and more.
              </p>
              <Button size="sm" variant="outline" className="w-full mt-3 h-8 text-xs">
                Upgrade Now
              </Button>
            </div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full text-muted-foreground hover:text-foreground hover:bg-muted",
                  collapsed ? "justify-center px-2" : "justify-start"
                )}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    collapsed && "rotate-180"
                  )}
                />
                {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
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
