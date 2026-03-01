import { Search, Bell, Sun, Moon, Command, ChevronDown, Shield, GraduationCap, Users, Plus, Wrench, CreditCard, Building2, FlaskConical, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleStore, roleLabels, roleDashboardPaths, type Role } from "@/stores/roleStore";

const roleIcons: Record<Role, typeof Shield> = { cloudadda: Shield, trainer: GraduationCap, student: Users };
const roleColors: Record<Role, string> = {
  cloudadda: "bg-destructive/10 text-destructive border-destructive/20",
  trainer: "bg-primary/10 text-primary border-primary/20",
  student: "bg-success/10 text-success border-success/20",
};

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);
  const { role, setRole } = useRoleStore();
  const navigate = useNavigate();

  useEffect(() => { setIsDark(document.documentElement.classList.contains('dark')); }, []);

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const handleRoleSwitch = (r: Role) => { setRole(r); navigate(roleDashboardPaths[r]); };
  const RoleIcon = roleIcons[role];

  const notifications = [
    { title: "GPU Capacity Exhausted", desc: "ap-south-1 GPU cluster at 100%", time: "5 min ago", type: "critical" },
    { title: "Invoice Overdue", desc: "SkillBridge Labs — ₹9,500 (14 days)", time: "2h ago", type: "warning" },
    { title: "Provision Failure", desc: "JOB-1002 failed after 2 retries", time: "1h ago", type: "error" },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={`gap-2 h-8 px-3 text-xs font-medium border ${roleColors[role]}`}>
              <RoleIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{roleLabels[role]}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Portal</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(roleLabels) as Role[]).map((r) => {
              const Icon = roleIcons[r];
              return (
                <DropdownMenuItem key={r} onClick={() => handleRoleSwitch(r)} className={`cursor-pointer gap-2.5 text-sm ${r === role ? "bg-muted font-medium" : ""}`}>
                  <Icon className="h-4 w-4" /> {roleLabels[r]}
                  {r === role && <span className="ml-auto text-[10px] text-muted-foreground">Active</span>}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search tenants, VMs, tickets, invoices..." className="pl-9 pr-14 h-9 bg-muted/50 border-0 rounded-lg text-sm" />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border">
            <Command className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] text-muted-foreground font-medium">K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Quick Actions - Admin only */}
        {role === "cloudadda" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Plus className="h-3.5 w-3.5" /> Quick Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => navigate("/admin/customers/create")} className="gap-2 cursor-pointer text-sm">
                <Building2 className="h-4 w-4" /> Create Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/catalog/blueprints")} className="gap-2 cursor-pointer text-sm">
                <FlaskConical className="h-4 w-4" /> Create Blueprint
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/billing/credits")} className="gap-2 cursor-pointer text-sm">
                <CreditCard className="h-4 w-4" /> Issue Credit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-warning">
                <Wrench className="h-4 w-4" /> Maintenance Mode
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-sm">
                <Send className="h-4 w-4" /> Broadcast Banner
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">3</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-sm">
              <span>Notifications</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n, i) => (
              <DropdownMenuItem key={i} className="flex flex-col items-start gap-0.5 py-2.5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className={cn("h-1.5 w-1.5 rounded-full", n.type === "critical" ? "bg-destructive" : n.type === "warning" ? "bg-warning" : "bg-destructive")} />
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-3.5">{n.desc}</span>
                <span className="text-[10px] text-muted-foreground pl-3.5">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-sm text-primary cursor-pointer">View all</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2.5 pl-2 pr-3 h-9 ml-1">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                <AvatarFallback className="bg-muted text-xs font-medium">SA</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">Super Admin</span>
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">admin@cloudadda.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@cloudadda.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer text-sm">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
