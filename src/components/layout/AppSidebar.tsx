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
  Sparkles,
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
            "text-white/60 hover:text-white hover:bg-white/10",
            collapsed && "justify-center px-2.5"
          )}
        >
          <item.icon className="h-[18px] w-[18px] shrink-0" />
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
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
          isActive
            ? "bg-white/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_3px_rgba(0,0,0,0.2)] backdrop-blur-sm"
            : "text-white/60 hover:text-white hover:bg-white/8",
          collapsed && "justify-center px-2.5"
        )}
      >
        <item.icon className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors",
          isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
        )} />
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
          "fixed left-3 top-3 bottom-3 z-40 flex flex-col rounded-2xl transition-all duration-300 overflow-hidden",
          "sidebar-floating",
          collapsed ? "w-[68px]" : "w-[230px]"
        )}
      >
        {/* Logo Area */}
        <div className={cn(
          "flex items-center px-4 py-5 gap-3",
          collapsed && "justify-center px-3"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            <GraduationCap className="h-[18px] w-[18px] text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-white text-sm tracking-tight leading-tight">
                Trainer Portal
              </span>
              <span className="text-[10px] text-white/40 font-medium tracking-wide uppercase">
                CloudAdda
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-3 h-px bg-white/10" />

        {/* Main Navigation */}
        <nav className="flex-1 p-2.5 overflow-y-auto scrollbar-hidden">
          <div className="space-y-1 mt-1">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="mx-3 h-px bg-white/10" />
        <div className="p-2.5 space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        {/* Collapse Toggle */}
        <div className="p-2.5 pt-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(
                  "w-full h-8 text-white/40 hover:text-white hover:bg-white/8 rounded-xl border-0",
                  collapsed ? "justify-center px-2" : "justify-between px-3"
                )}
              >
                {!collapsed && <span className="text-[11px] font-medium">Collapse</span>}
                <ChevronLeft
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
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
