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
  ExternalLink,
  LayoutDashboard,
  Monitor,
  Headphones,
  Cog,
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
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Batches", icon: Users, path: "/batches" },
  { title: "Labs", icon: Monitor, path: "/labs" },
  { title: "LMS", icon: BookOpen, path: "https://lms.cloudadda.com", external: true },
];

const bottomNavItems = [
  { title: "Support", icon: Headphones, path: "/support" },
  { title: "Settings", icon: Cog, path: "/settings" },
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
            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
            "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed && "justify-center px-2.5"
          )}
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && (
            <>
              <span className="truncate flex-1">{item.title}</span>
              <ExternalLink className="h-3 w-3 opacity-40" />
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
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
          isActive
            ? "bg-coral text-coral-foreground shadow-md shadow-coral/20"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar transition-all duration-200",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center px-4 gap-3",
          collapsed && "justify-center px-3"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral shrink-0 shadow-lg shadow-coral/20">
            <span className="text-coral-foreground font-bold text-sm">CA</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-accent-foreground text-sm tracking-tight">
                CloudAdda
              </span>
              <span className="text-[10px] text-sidebar-foreground/50 font-medium">
                Trainer Portal
              </span>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto scrollbar-thin">
          <p className={cn(
            "text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 mb-3",
            collapsed && "text-center"
          )}>
            {collapsed ? "•" : "Menu"}
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 pb-2 space-y-1">
          <p className={cn(
            "text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 mb-3",
            collapsed && "text-center"
          )}>
            {collapsed ? "•" : "System"}
          </p>
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Button */}
        <div className="px-3 py-3">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full text-sidebar-foreground/40 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent h-8 rounded-xl",
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
