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
  ExternalLink,
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
  { title: "LMS", icon: BookOpen, path: "https://lms.cloudadda.com", external: true },
];

const bottomNavItems = [
  { title: "Support", icon: HelpCircle, path: "/support" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isExternal = 'external' in item && item.external;
    const isActive = !isExternal && (location.pathname === item.path || 
      (item.path !== "/" && location.pathname.startsWith(item.path)));
    
    if (isExternal) {
      const link = (
        <a
          href={item.path}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
            "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed && "justify-center px-2.5"
          )}
        >
          <item.icon className="h-[18px] w-[18px] shrink-0 transition-colors" />
          {!collapsed && (
            <>
              <span className="truncate flex-1">{item.title}</span>
              <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity" />
            </>
          )}
        </a>
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
    }

    const link = (
      <NavLink
        to={item.path}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 relative",
          isActive
            ? "text-white"
            : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground",
          collapsed && "justify-center px-2.5"
        )}
        style={isActive ? { background: "var(--gradient-teal)" } : undefined}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0 transition-colors" />
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
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
        style={{ background: "var(--gradient-sidebar)" }}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-[60px] items-center border-b border-sidebar-border/50 px-4 gap-3",
          collapsed && "justify-center px-3"
        )}>
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0 shadow-lg"
            style={{ background: "var(--gradient-teal)" }}
          >
            <GraduationCap className="h-[18px] w-[18px] text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-white text-sm tracking-tight">
              Trainer Portal
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
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
                  "w-full text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent h-8 rounded-xl",
                  collapsed ? "justify-center px-2" : "justify-between px-3"
                )}
              >
                {!collapsed && <span className="text-xs">Collapse</span>}
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
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