import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FlaskConical,
  Hammer,
  BookOpen,
  HelpCircle,
  Settings,
  ChevronLeft,
  GraduationCap,
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
  { title: "Course Builder", icon: Hammer, path: "/course-builder" },
  { title: "Courses", icon: BookOpen, path: "/courses" },
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
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-primary/10 text-primary shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-primary")} />
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
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed && "justify-center px-2"
        )}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-semibold text-sidebar-foreground tracking-tight">
                Trainer Portal
              </span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-sidebar-border p-3 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3">
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
                "h-4 w-4 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
            {!collapsed && <span className="ml-2 text-sm">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}
