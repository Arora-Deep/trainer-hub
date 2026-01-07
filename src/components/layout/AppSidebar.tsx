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
  ChevronDown,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { title: "Courses", icon: BookOpen, path: "/courses" },
  { title: "Programs", icon: GraduationCap, path: "/programs", badge: null },
  { title: "Batches", icon: Users, path: "/batches" },
  { title: "Certified Participants", icon: Users, path: "/certified" },
  { title: "Jobs", icon: Hammer, path: "/jobs" },
  { title: "Statistics", icon: Home, path: "/" },
];

const otherItems = [
  { title: "Notifications", icon: null, path: "/notifications", badge: 4 },
  { title: "Quizzes", icon: null, path: "/quizzes" },
  { title: "Assignments", icon: null, path: "/assignments" },
];

const moreItems = [
  { title: "Frappe Cloud", icon: FlaskConical, path: "/cloud" },
  { title: "Terms of Certification", icon: null, path: "/terms-cert" },
  { title: "Terms of Use", icon: null, path: "/terms-use" },
  { title: "Cookie Policy", icon: null, path: "/cookies" },
  { title: "Privacy Policy", icon: null, path: "/privacy" },
];

export function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-foreground">
            <GraduationCap className="h-5 w-5 text-background" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Frappe School</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
          {/* Main Items */}
          <div className="space-y-0.5 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-sidebar-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-sidebar-border" />

          {/* Other Items */}
          <div className="space-y-0.5 px-2">
            {otherItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  isActive(item.path)
                    ? "bg-sidebar-accent font-medium text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-xs text-background">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-sidebar-border" />

          {/* More Section */}
          <div className="px-2">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
              <ChevronDown className="h-3 w-3" />
              <span>More</span>
            </div>
            <div className="space-y-0.5">
              {moreItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive(item.path)
                      ? "bg-sidebar-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border px-2 py-2">
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground">
            <ChevronDown className="h-4 w-4 -rotate-90" />
            <span>Collapse</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
