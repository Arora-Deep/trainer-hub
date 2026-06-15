import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home, Users, FlaskConical, BookOpen, HelpCircle, Settings, ChevronLeft, ChevronDown,
  GraduationCap, Award, ClipboardList, FileQuestion, Code2, Layers,
  Shield, Building2, Server, CreditCard, BarChart3, UserCog,
  Monitor, FileText, Trophy, Image, Boxes, CheckCircle, ListOrdered,
  Cpu, HardDrive, Network, Activity, LifeBuoy, Receipt, Lock, FileBarChart,
  Gauge, AlertTriangle, Clock, Wrench, BookMarked, Zap, Globe, Eye,
  DollarSign, Scale, Key, Database, Send, Flag, Workflow, Container,
  Video, Calendar, Radio, MessageSquarePlus, ClipboardCheck, Brain, GraduationCap as ExamIcon, Gamepad2, Megaphone, CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRoleStore, type Role } from "@/stores/roleStore";
import { useNotificationCounts } from "@/stores/notificationStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NavItemDef {
  title: string;
  icon: typeof Home;
  path: string;
}

interface NavGroup {
  label: string;
  icon: typeof Home;
  items: NavItemDef[];
}

interface NavConfig {
  label: string;
  icon: typeof Home;
  groups: NavGroup[];
  bottom: NavItemDef[];
}

const adminNav: NavConfig = {
  label: "CloudAdda",
  icon: Shield,
  groups: [
    { label: "Dashboard", icon: Home, items: [
      { title: "Overview", icon: Gauge, path: "/admin/dashboard" },
      { title: "Activity Feed", icon: Activity, path: "/admin/activity-feed" },
      { title: "Alerts", icon: AlertTriangle, path: "/admin/alerts" },
    ]},
    { label: "Customers", icon: Building2, items: [
      { title: "Customer List", icon: Building2, path: "/admin/customers" },
      { title: "Add Customer", icon: Users, path: "/admin/customers/create" },
      { title: "Customer Health", icon: Activity, path: "/admin/customers/health" },
      { title: "Customer Usage", icon: BarChart3, path: "/admin/customers/usage" },
    ]},
    { label: "Batches", icon: Layers, items: [
      { title: "All Batches", icon: Layers, path: "/admin/batches" },
      { title: "Create Batch", icon: Container, path: "/admin/batches/create" },
      { title: "Modify Batch", icon: Wrench, path: "/admin/batches/modify" },
      { title: "Completed Batches", icon: CheckCircle, path: "/admin/batches/completed" },
      { title: "Batch Requests", icon: ClipboardList, path: "/admin/batches/requests" },
    ]},
    { label: "Labs", icon: FlaskConical, items: [
      { title: "Assign VM", icon: Monitor, path: "/admin/labs/assign" },
      { title: "Lab Instances", icon: Server, path: "/admin/labs/instances" },
      { title: "Replace VM", icon: Workflow, path: "/admin/labs/replace" },
      { title: "Reset Lab", icon: Zap, path: "/admin/labs/reset" },
      { title: "Lab Templates", icon: Boxes, path: "/admin/labs/templates" },
      { title: "ISO Library", icon: Image, path: "/admin/labs/iso" },
    ]},
    { label: "Catalog", icon: BookMarked, items: [
      { title: "Course Moderation", icon: ClipboardCheck, path: "/admin/catalog/moderation" },
      { title: "Plans & Bundles", icon: CreditCard, path: "/admin/billing/plans" },
    ]},
    { label: "Users", icon: Users, items: [
      { title: "Platform Users", icon: UserCog, path: "/admin/users/platform" },
      { title: "Customer Users", icon: Building2, path: "/admin/users/customer" },
      { title: "Participants", icon: GraduationCap, path: "/admin/users/students" },
      { title: "Roles", icon: Key, path: "/admin/users/roles" },
      { title: "Reset Password", icon: Lock, path: "/admin/users/reset-password" },
    ]},
    { label: "Infrastructure", icon: Server, items: [
      { title: "Nodes", icon: Cpu, path: "/admin/infra/nodes" },
      { title: "Resource Usage", icon: Boxes, path: "/admin/infra/resource-usage" },
      { title: "Capacity Planning", icon: BarChart3, path: "/admin/infra/capacity" },
      { title: "Maintenance Mode", icon: Wrench, path: "/admin/infra/maintenance" },
    ]},
    { label: "Support", icon: LifeBuoy, items: [
      { title: "Tickets", icon: LifeBuoy, path: "/admin/support/tickets" },
      { title: "Support Logs", icon: FileText, path: "/admin/support/logs" },
    ]},
    { label: "Billing", icon: CreditCard, items: [
      { title: "Invoices", icon: Receipt, path: "/admin/billing/invoices" },
      { title: "Payments", icon: DollarSign, path: "/admin/billing/payments" },
      { title: "Credits", icon: Scale, path: "/admin/billing/credits" },
      { title: "Usage Reports", icon: BarChart3, path: "/admin/billing/usage" },
    ]},
    { label: "Reports", icon: BarChart3, items: [
      { title: "Usage Reports", icon: BarChart3, path: "/admin/reports/usage" },
      { title: "Revenue Reports", icon: DollarSign, path: "/admin/reports/revenue" },
      { title: "Batch Reports", icon: FileText, path: "/admin/reports/batches" },
    ]},
    { label: "System", icon: Settings, items: [
      { title: "Logs", icon: FileText, path: "/admin/system/logs" },
      { title: "Audit Logs", icon: FileBarChart, path: "/admin/system/audit" },
      { title: "Settings", icon: Settings, path: "/admin/settings" },
    ]},
  ],
  bottom: [],
};

const trainerNav: NavConfig = {
  label: "Trainer Portal",
  icon: GraduationCap,
  groups: [
    { label: "Main", icon: Home, items: [
      { title: "Dashboard", icon: Home, path: "/" },
      { title: "Schedule", icon: Calendar, path: "/schedule" },
      { title: "Live Training", icon: Radio, path: "/live-training" },
      { title: "Meetings", icon: Video, path: "/meetings" },
      { title: "Batches", icon: Users, path: "/batches" },
      { title: "Trainers", icon: UserCog, path: "/trainers" },
      { title: "Lab Templates", icon: FlaskConical, path: "/labs" },
      { title: "Courses", icon: BookOpen, path: "/courses" },
      { title: "Programs", icon: Layers, path: "/programs" },
    ]},
    { label: "Assessments", icon: ClipboardCheck, items: [
      { title: "Library", icon: BookMarked, path: "/assessments" },
      { title: "Assignments", icon: ClipboardList, path: "/assignments" },
      { title: "Quizzes", icon: FileQuestion, path: "/quizzes" },
      { title: "Exercises", icon: Code2, path: "/exercises" },
      { title: "Exams", icon: ExamIcon, path: "/exams" },
      { title: "AI Reasoning Eval", icon: Brain, path: "/insight-questions" },
      { title: "Game-based Learning", icon: Gamepad2, path: "/game-based-learning" },
    ]},
    { label: "More", icon: Award, items: [
      { title: "Certifications", icon: Award, path: "/certifications" },
      { title: "Announcements", icon: MessageSquarePlus, path: "/announcements" },
      { title: "Engagement", icon: Zap, path: "/engagement" },
      { title: "Request Lab / Quote", icon: MessageSquarePlus, path: "/request-lab" },
    ]},
  ],
  bottom: [
    { title: "Support", icon: HelpCircle, path: "/support" },
    { title: "Settings", icon: Settings, path: "/settings" },
  ],
};

const studentNav: NavConfig = {
  label: "Student Portal",
  icon: GraduationCap,
  groups: [
    { label: "Main", icon: Home, items: [
      { title: "My Dashboard", icon: Home, path: "/student/dashboard" },
      { title: "Learning Centre", icon: Video, path: "/student/live-class" },
      { title: "Active Labs", icon: Monitor, path: "/student/labs" },
      { title: "My Courses", icon: BookOpen, path: "/student/courses" },
      { title: "Schedule", icon: Calendar, path: "/student/schedule" },
      { title: "Office Hours", icon: CalendarClock, path: "/student/office-hours" },
      { title: "Announcements", icon: Megaphone, path: "/student/announcements" },
    ]},
    { label: "Progression", icon: Zap, items: [
      { title: "Portfolio", icon: UserCog, path: "/student/portfolio" },
      { title: "My Progress", icon: Activity, path: "/student/progress" },
      { title: "Learning Paths", icon: Workflow, path: "/student/paths" },
      { title: "Challenges", icon: Flag, path: "/student/challenges" },
      { title: "Leaderboard", icon: Trophy, path: "/student/leaderboard" },
      { title: "Certificates", icon: Award, path: "/student/certificates" },
    ]},
  ],
  bottom: [
    { title: "Support", icon: HelpCircle, path: "/student/support" },
  ],
};

const navConfigs: Record<Role, NavConfig> = {
  cloudadda: adminNav,
  trainer: trainerNav,
  student: studentNav,
};

// Badge counts for specific nav items
const badgeCountMap: Record<string, number> = {
  "/admin/batches/requests": 4,
  "/admin/support/tickets": 3,
  "/admin/alerts": 2,
};

export function AppSidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);
  const location = useLocation();
  const { role } = useRoleStore();
  const config = navConfigs[role];
  const notifCounts = useNotificationCounts();

  // Dynamic badge counts from notification store for admin
  const getBadgeCount = (path: string): number => {
    if (role !== "cloudadda") return 0;
    if (path === "/admin/batches/requests") return notifCounts.requests;
    if (path === "/admin/support/tickets") return notifCounts.tickets;
    if (path === "/admin/alerts") return notifCounts.alerts;
    return 0;
  };

  const isItemActive = (path: string) => {
    if (path === "/" || path === "/admin/dashboard" || path === "/student/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isGroupActive = (group: NavGroup) => group.items.some(i => isItemActive(i.path));

  const NavItem = ({ item }: { item: NavItemDef }) => {
    const active = isItemActive(item.path);
    const badgeCount = getBadgeCount(item.path);
    const link = (
      <NavLink
        to={item.path}
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate flex-1">{item.title}</span>
            {badgeCount > 0 && (
              <Badge variant="secondary" className="h-4 min-w-[16px] px-1 text-[9px] font-bold bg-destructive text-destructive-foreground rounded-full">
                {badgeCount}
              </Badge>
            )}
          </>
        )}
        {collapsed && badgeCount > 0 && (
          <span className="absolute right-1 top-0.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild><div className="relative">{link}</div></TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-xs">
            {item.title} {badgeCount > 0 && `(${badgeCount})`}
          </TooltipContent>
        </Tooltip>
      );
    }
    return link;
  };

  return (
    <TooltipProvider>
      <aside className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200",
        collapsed ? "w-[60px]" : "w-[230px]"
      )}>
        {/* Logo */}
        <div className={cn("flex h-14 items-center border-b border-sidebar-border px-3 gap-2.5", collapsed && "justify-center px-2")}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shrink-0">
            <config.icon className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground text-sm tracking-tight">{config.label}</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-1.5 overflow-y-auto scrollbar-thin">
          <div className="space-y-0.5">
            {config.groups.map((group) => {
              if (collapsed) {
                return (
                  <div key={group.label} className="space-y-0.5 py-1">
                    {group.items.map((item) => <NavItem key={item.path} item={item} />)}
                  </div>
                );
              }
              if (group.items.length === 1) {
                return <NavItem key={group.label} item={group.items[0]} />;
              }
              return (
                <Collapsible key={group.label} defaultOpen={isGroupActive(group)}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                    <span>{group.label}</span>
                    <ChevronDown className="h-3 w-3 transition-transform duration-200 [[data-state=open]>&]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-0.5 pl-1 mt-0.5">
                      {group.items.map((item) => <NavItem key={item.path} item={item} />)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-sidebar-border p-1.5 space-y-0.5">
          {config.bottom.map((item) => <NavItem key={item.path} item={item} />)}
        </div>

        {/* Collapse */}
        <div className="border-t border-sidebar-border p-1.5">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className={cn("w-full text-muted-foreground hover:text-foreground h-7", collapsed ? "justify-center px-2" : "justify-between px-2.5")}
              >
                {!collapsed && <span className="text-[11px]">Collapse</span>}
                <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-200", collapsed && "rotate-180")} />
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right" className="text-xs">Expand</TooltipContent>}
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
