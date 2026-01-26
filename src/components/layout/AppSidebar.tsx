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
  ChevronRight,
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
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
          isActive
            ? "text-primary-foreground shadow-lg"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          collapsed && "justify-center px-2.5"
        )}
        style={isActive ? { 
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-glow-sm)"
        } : undefined}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] shrink-0 transition-all duration-300",
          !isActive && "group-hover:scale-110 group-hover:text-primary"
        )} />
        {!collapsed && (
          <span className="truncate">{item.title}</span>
        )}
        {isActive && !collapsed && (
          <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white/80" />
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent 
            side="right" 
            className="font-medium bg-card border-border/50 shadow-lg"
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
          "fixed left-0 top-0 z-40 flex h-screen flex-col glass-sidebar transition-all duration-300 ease-out border-sidebar-border",
          collapsed ? "w-[76px]" : "w-[260px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-[70px] items-center border-b border-sidebar-border/50 px-4 gap-3",
          collapsed && "justify-center px-3"
        )}>
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
            style={{ 
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow-sm)"
            }}
          >
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-sidebar animate-pulse" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="font-bold text-sidebar-foreground tracking-tight block text-[15px]">
                Trainer Portal
              </span>
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
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
            <div className="mt-6 p-4 rounded-2xl border border-primary/20 relative overflow-hidden"
              style={{ background: "var(--gradient-primary-soft)" }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">Pro Features</span>
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">
                  Unlock advanced analytics, custom branding, and more.
                </p>
                <Button 
                  size="sm" 
                  className="w-full h-9 text-xs font-semibold btn-gradient rounded-xl"
                >
                  Upgrade Now
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-primary/5 blur-xl" />
            </div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border/50 p-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border/50 p-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl h-10",
                  collapsed ? "justify-center px-2" : "justify-between px-3"
                )}
              >
                {!collapsed && <span className="text-sm">Collapse</span>}
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    collapsed && "rotate-180"
                  )}
                />
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-card border-border/50">
                Expand sidebar
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
