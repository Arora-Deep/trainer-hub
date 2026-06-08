import { Search, Bell, Sun, Moon, Command, ChevronDown, Shield, GraduationCap, Users, Plus, Wrench, CreditCard, Building2, FlaskConical, Send, X, CheckCheck } from "lucide-react";
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
import { useNotificationStore, useNotificationCounts } from "@/stores/notificationStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LevelChip } from "@/components/gamification/LevelChip";

const roleIcons: Record<Role, typeof Shield> = { platform: Shield, trainer: GraduationCap, student: Users };
const roleColors: Record<Role, string> = {
  platform: "bg-destructive/10 text-destructive border-destructive/20",
  trainer: "bg-primary/10 text-primary border-primary/20",
  student: "bg-success/10 text-success border-success/20",
};

const severityDot: Record<string, string> = {
  critical: "bg-destructive",
  high: "bg-warning",
  medium: "bg-primary",
  low: "bg-muted-foreground",
};

const typeLabels: Record<string, string> = {
  batch_request: "Request",
  ticket: "Ticket",
  alert: "Alert",
  provision_failure: "Provision",
  billing: "Billing",
  system: "System",
};

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState("all");
  const { role, setRole } = useRoleStore();
  const navigate = useNavigate();
  const { notifications, markRead, markAllRead, dismiss } = useNotificationStore();
  const counts = useNotificationCounts();

  useEffect(() => { setIsDark(document.documentElement.classList.contains('dark')); }, []);

  const toggleTheme = () => { document.documentElement.classList.toggle('dark'); setIsDark(!isDark); };
  const handleRoleSwitch = (r: Role) => { setRole(r); navigate(roleDashboardPaths[r]); };
  const RoleIcon = roleIcons[role];

  const filteredNotifs = notifTab === "all"
    ? notifications
    : notifications.filter(n => {
        if (notifTab === "requests") return n.type === "batch_request";
        if (notifTab === "tickets") return n.type === "ticket";
        if (notifTab === "alerts") return n.type === "alert" || n.type === "provision_failure";
        if (notifTab === "billing") return n.type === "billing";
        return true;
      });

  const handleNotifClick = (n: typeof notifications[0]) => {
    markRead(n.id);
    setNotifOpen(false);
    navigate(n.link);
  };

  const timeAgo = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-6">
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
        {role === "platform" && (
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
        {role === "student" && <LevelChip />}


        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              {counts.total > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {counts.total > 9 ? "9+" : counts.total}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[400px] p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">Notifications</span>
                {counts.total > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded">{counts.total} new</Badge>}
              </div>
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7" onClick={markAllRead}>
                <CheckCheck className="h-3 w-3" /> Mark all read
              </Button>
            </div>
            <Tabs value={notifTab} onValueChange={setNotifTab}>
              <TabsList className="w-full rounded-none border-b bg-transparent h-9 px-2">
                <TabsTrigger value="all" className="text-xs h-7 data-[state=active]:bg-muted">All</TabsTrigger>
                <TabsTrigger value="requests" className="text-xs h-7 data-[state=active]:bg-muted gap-1">
                  Requests {counts.requests > 0 && <span className="text-[9px] bg-primary/20 text-primary px-1 rounded">{counts.requests}</span>}
                </TabsTrigger>
                <TabsTrigger value="tickets" className="text-xs h-7 data-[state=active]:bg-muted gap-1">
                  Tickets {counts.tickets > 0 && <span className="text-[9px] bg-destructive/20 text-destructive px-1 rounded">{counts.tickets}</span>}
                </TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs h-7 data-[state=active]:bg-muted gap-1">
                  Alerts {counts.alerts > 0 && <span className="text-[9px] bg-warning/20 text-warning px-1 rounded">{counts.alerts}</span>}
                </TabsTrigger>
                <TabsTrigger value="billing" className="text-xs h-7 data-[state=active]:bg-muted gap-1">
                  Billing {counts.billing > 0 && <span className="text-[9px] bg-warning/20 text-warning px-1 rounded">{counts.billing}</span>}
                </TabsTrigger>
              </TabsList>
              <TabsContent value={notifTab} className="m-0">
                <ScrollArea className="h-[360px]">
                  {filteredNotifs.length === 0 ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : (
                    filteredNotifs.map(n => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-primary/[0.03]" : ""}`}
                        onClick={() => handleNotifClick(n)}
                      >
                        <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${severityDot[n.severity || "low"]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</span>
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 shrink-0">{typeLabels[n.type]}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{n.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.timestamp)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

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
                <span className="text-[10px] text-muted-foreground leading-none mt-0.5">admin@platform.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@platform.com</p>
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
