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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRoleStore, type Role } from "@/stores/roleStore";
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
    { label: "Overview", icon: Home, items: [
      { title: "Dashboard", icon: Gauge, path: "/admin/dashboard" },
    ]},
    { label: "Customers", icon: Building2, items: [
      { title: "Customer Directory", icon: Building2, path: "/admin/customers" },
      { title: "Customer Health", icon: Activity, path: "/admin/customers/health" },
      { title: "Customer Requests", icon: ClipboardList, path: "/admin/customers/requests" },
    ]},
    { label: "Catalog", icon: Boxes, items: [
      { title: "Golden Images", icon: Image, path: "/admin/catalog/images" },
      { title: "Lab Blueprints", icon: FlaskConical, path: "/admin/catalog/blueprints" },
      { title: "Validation Runs", icon: CheckCircle, path: "/admin/catalog/validations" },
    ]},
    { label: "Provisioning", icon: Workflow, items: [
      { title: "Provisioning Queue", icon: ListOrdered, path: "/admin/provisioning/queue" },
      { title: "Batch Provisioning", icon: Container, path: "/admin/provisioning/batch" },
      { title: "Lifecycle Policies", icon: Clock, path: "/admin/provisioning/lifecycle" },
      { title: "Job History", icon: FileText, path: "/admin/provisioning/history" },
    ]},
    { label: "Infrastructure", icon: Server, items: [
      { title: "Regions & Clusters", icon: Globe, path: "/admin/infra/regions" },
      { title: "Hosts / Nodes", icon: Cpu, path: "/admin/infra/hosts" },
      { title: "Resource Pools", icon: Boxes, path: "/admin/infra/resources" },
      { title: "Storage Pools", icon: HardDrive, path: "/admin/infra/storage" },
      { title: "GPU Pools", icon: Cpu, path: "/admin/infra/gpu" },
    ]},
    { label: "Networking", icon: Network, items: [
      { title: "IP Pools", icon: Network, path: "/admin/network/ip-pools" },
      { title: "Firewall Policies", icon: Shield, path: "/admin/network/firewall" },
      { title: "Internet Policies", icon: Globe, path: "/admin/network/internet" },
      { title: "Session Access Logs", icon: Eye, path: "/admin/network/sessions" },
    ]},
    { label: "Monitoring", icon: Activity, items: [
      { title: "Platform Health", icon: Activity, path: "/admin/monitoring/health" },
      { title: "Alerts & Rules", icon: AlertTriangle, path: "/admin/monitoring/alerts" },
      { title: "Incidents", icon: AlertTriangle, path: "/admin/monitoring/incidents" },
      { title: "Maintenance Windows", icon: Wrench, path: "/admin/monitoring/maintenance" },
    ]},
    { label: "Support", icon: LifeBuoy, items: [
      { title: "Ticket Inbox", icon: LifeBuoy, path: "/admin/support/tickets" },
      { title: "Runbooks", icon: BookMarked, path: "/admin/support/runbooks" },
      { title: "Macros", icon: Zap, path: "/admin/support/macros" },
    ]},
    { label: "Billing & Finance", icon: CreditCard, items: [
      { title: "Plans & Pricing", icon: CreditCard, path: "/admin/billing/plans" },
      { title: "Invoices", icon: Receipt, path: "/admin/billing/invoices" },
      { title: "Payments", icon: DollarSign, path: "/admin/billing/payments" },
      { title: "Credits", icon: Scale, path: "/admin/billing/credits" },
      { title: "Cost & Margin", icon: BarChart3, path: "/admin/billing/cost" },
    ]},
    { label: "Security", icon: Lock, items: [
      { title: "Staff RBAC", icon: UserCog, path: "/admin/security/rbac" },
      { title: "Audit Logs", icon: FileBarChart, path: "/admin/security/audit" },
      { title: "SSO / MFA", icon: Key, path: "/admin/security/sso" },
      { title: "Data Retention", icon: Database, path: "/admin/security/retention" },
    ]},
    { label: "Reports", icon: BarChart3, items: [
      { title: "Daily Ops Report", icon: FileText, path: "/admin/reports/daily" },
      { title: "Usage Reports", icon: BarChart3, path: "/admin/reports/usage" },
      { title: "Revenue Reports", icon: DollarSign, path: "/admin/reports/revenue" },
      { title: "Export Center", icon: Send, path: "/admin/reports/exports" },
    ]},
  ],
  bottom: [
    { title: "Settings", icon: Settings, path: "/admin/settings" },
  ],
};

const trainerNav: NavConfig = {
  label: "Trainer Portal",
  icon: GraduationCap,
  groups: [
    { label: "Main", icon: Home, items: [
      { title: "Dashboard", icon: Home, path: "/" },
      { title: "Batches", icon: Users, path: "/batches" },
      { title: "Labs", icon: FlaskConical, path: "/labs" },
      { title: "Courses", icon: BookOpen, path: "/courses" },
      { title: "Programs", icon: Layers, path: "/programs" },
      { title: "Assignments", icon: ClipboardList, path: "/assignments" },
      { title: "Quizzes", icon: FileQuestion, path: "/quizzes" },
      { title: "Exercises", icon: Code2, path: "/exercises" },
      { title: "Certifications", icon: Award, path: "/certifications" },
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
      { title: "My Labs", icon: Monitor, path: "/student/labs" },
      { title: "My Courses", icon: BookOpen, path: "/student/courses" },
      { title: "Assessments", icon: FileText, path: "/student/assessments" },
      { title: "Certificates", icon: Trophy, path: "/student/certificates" },
    ]},
  ],
  bottom: [
    { title: "Support", icon: HelpCircle, path: "/support" },
  ],
};

const navConfigs: Record<Role, NavConfig> = {
  cloudadda: adminNav,
  trainer: trainerNav,
  student: studentNav,
};

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useRoleStore();
  const config = navConfigs[role];

  const isItemActive = (path: string) => {
    if (path === "/" || path === "/admin/dashboard" || path === "/student/dashboard") {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const isGroupActive = (group: NavGroup) => group.items.some(i => isItemActive(i.path));

  const NavItem = ({ item }: { item: NavItemDef }) => {
    const active = isItemActive(item.path);
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
        {!collapsed && <span className="truncate">{item.title}</span>}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-xs">{item.title}</TooltipContent>
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
