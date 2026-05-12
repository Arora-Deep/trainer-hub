import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCustomerStore } from "@/stores/customerStore";
import {
  Eye, Clock, CheckCircle2, AlertTriangle, MessageSquare, Send, Search,
  LifeBuoy, ArrowUp, Timer, UserPlus, XCircle, ChevronRight, StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface TicketThread {
  id: string;
  sender: "customer" | "admin";
  senderName: string;
  message: string;
  timestamp: string;
  isInternal?: boolean;
}

interface TicketWithThread {
  id: string;
  tenant: string;
  priority: "critical" | "high" | "medium" | "low";
  slaMinutes: number;
  category: string;
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  assignee: string;
  subject: string;
  createdAt: string;
  thread: TicketThread[];
}

const ticketsData: TicketWithThread[] = [
  {
    id: "TKT-2001", tenant: "DataScience Bootcamp", priority: "critical", slaMinutes: 45, category: "VM Issue",
    status: "open", assignee: "Ops Team", subject: "GPU labs not starting for ML Cohort #5", createdAt: "2026-04-13T09:15:00Z",
    thread: [
      { id: "t1", sender: "customer", senderName: "Priya Sharma", message: "None of our GPU labs are starting. Students are waiting for ML Cohort #5. This is blocking the entire batch.", timestamp: "2026-04-13T09:15:00Z" },
      { id: "t2", sender: "admin", senderName: "Ops Team", message: "We're investigating — GPU capacity in ap-south-1 is at 100%. Checking if we can redistribute.", timestamp: "2026-04-13T09:25:00Z" },
      { id: "t3", sender: "admin", senderName: "Ravi M.", message: "Internal note: INC-001 is linked. GPU cluster needs urgent scaling.", timestamp: "2026-04-13T09:30:00Z", isInternal: true },
    ],
  },
  {
    id: "TKT-2002", tenant: "SkillBridge Labs", priority: "high", slaMinutes: 120, category: "Provisioning",
    status: "in_progress", assignee: "Ravi M.", subject: "K8s labs stuck in pending state", createdAt: "2026-04-13T04:30:00Z",
    thread: [
      { id: "t4", sender: "customer", senderName: "Amit Patel", message: "Our Kubernetes labs have been stuck in 'pending' for over 6 hours. Students can't access them.", timestamp: "2026-04-13T04:30:00Z" },
      { id: "t5", sender: "admin", senderName: "Ravi M.", message: "Looking into this now. JOB-1006 shows network timeout on cluster node provisioning. Retrying.", timestamp: "2026-04-13T05:00:00Z" },
    ],
  },
  {
    id: "TKT-2003", tenant: "Corporate L&D Co", priority: "medium", slaMinutes: 240, category: "Billing",
    status: "open", assignee: "Finance Team", subject: "Invoice discrepancy for February", createdAt: "2026-04-12T03:00:00Z",
    thread: [
      { id: "t6", sender: "customer", senderName: "Mike Chen", message: "Our February invoice shows charges for 45 VMs but we only had 40 active. Please review.", timestamp: "2026-04-12T03:00:00Z" },
    ],
  },
  {
    id: "TKT-2004", tenant: "NexGen Academy", priority: "low", slaMinutes: 480, category: "Account",
    status: "waiting", assignee: "Support", subject: "Request to reactivate suspended account", createdAt: "2026-04-11T08:00:00Z",
    thread: [
      { id: "t7", sender: "customer", senderName: "Lisa Park", message: "We'd like to reactivate our account. We've settled the overdue payment.", timestamp: "2026-04-11T08:00:00Z" },
      { id: "t8", sender: "admin", senderName: "Support", message: "We've forwarded to the Finance team for payment verification. Will update once confirmed.", timestamp: "2026-04-11T10:00:00Z" },
    ],
  },
  {
    id: "TKT-2005", tenant: "DevOps Academy", priority: "medium", slaMinutes: 240, category: "Feature Request",
    status: "open", assignee: "Product", subject: "Request for custom cloud-init templates", createdAt: "2026-04-13T05:00:00Z",
    thread: [
      { id: "t9", sender: "customer", senderName: "Rajesh Kumar", message: "We'd like the ability to upload custom cloud-init scripts during batch creation.", timestamp: "2026-04-13T05:00:00Z" },
    ],
  },
];

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive",
  high: "bg-warning/10 text-warning",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

const statusColors: Record<string, string> = {
  open: "bg-destructive/10 text-destructive",
  in_progress: "bg-warning/10 text-warning",
  waiting: "bg-muted text-muted-foreground",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

const cannedResponses = [
  "Thank you for reaching out. We're looking into this now.",
  "This has been escalated to the infrastructure team.",
  "We've applied a fix. Please verify on your end.",
  "Could you provide more details about the issue?",
];

export default function AdminTickets() {
  const presetTicketId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ticketId") : null;
  const [selected, setSelected] = useState<TicketWithThread | null>(presetTicketId ? ticketsData.find(t => t.id === presetTicketId) || null : null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const openCount = ticketsData.filter(t => t.status === "open").length;
  const inProgressCount = ticketsData.filter(t => t.status === "in_progress").length;
  const slaBreached = ticketsData.filter(t => {
    const elapsed = (Date.now() - new Date(t.createdAt).getTime()) / 60000;
    return elapsed > t.slaMinutes && t.status !== "resolved" && t.status !== "closed";
  }).length;

  const filtered = ticketsData.filter(t => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search && !t.id.toLowerCase().includes(search.toLowerCase()) && !t.tenant.toLowerCase().includes(search.toLowerCase()) && !t.subject.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getSLAStatus = (ticket: TicketWithThread) => {
    const elapsed = (Date.now() - new Date(ticket.createdAt).getTime()) / 60000;
    const remaining = ticket.slaMinutes - elapsed;
    if (ticket.status === "resolved" || ticket.status === "closed") return { label: "Resolved", color: "text-success", bg: "bg-success/10" };
    if (remaining <= 0) return { label: "BREACHED", color: "text-destructive", bg: "bg-destructive/10" };
    if (remaining <= ticket.slaMinutes * 0.25) return { label: `${Math.ceil(remaining)}m left`, color: "text-destructive", bg: "bg-destructive/10" };
    if (remaining <= ticket.slaMinutes * 0.5) return { label: `${Math.ceil(remaining)}m left`, color: "text-warning", bg: "bg-warning/10" };
    return { label: `${Math.ceil(remaining)}m left`, color: "text-success", bg: "bg-success/10" };
  };

  const handleSendReply = () => {
    if (!reply.trim()) return;
    toast({ title: isInternal ? "Internal Note Added" : "Reply Sent", description: `Message sent on ${selected?.id}` });
    setReply("");
  };

  const [createOpen, setCreateOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ tenant: "", subject: "", category: "VM Issue", priority: "medium" as TicketWithThread["priority"], message: "", assignee: "Support" });
  const { customers } = useCustomerStore();
  const handleCreate = () => {
    if (!newTicket.tenant || !newTicket.subject) { toast({ title: "Missing fields", description: "Customer and subject required" }); return; }
    toast({ title: "Ticket Created", description: `New ticket for ${newTicket.tenant}` });
    setCreateOpen(false);
    setNewTicket({ tenant: "", subject: "", category: "VM Issue", priority: "medium", message: "", assignee: "Support" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground text-sm mt-1">Support ticket management & help desk</p>
        </div>
        <Button className="gap-1.5" onClick={() => setCreateOpen(true)}><MessageSquare className="h-4 w-4" /> New Ticket</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open", value: openCount, icon: AlertTriangle, color: "text-destructive", pulse: openCount > 0 },
          { label: "In Progress", value: inProgressCount, icon: Clock, color: "text-warning" },
          { label: "Avg Resolution", value: "3.2h", icon: Timer, color: "text-primary" },
          { label: "SLA Breached", value: slaBreached, icon: XCircle, color: "text-destructive", pulse: slaBreached > 0 },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${k.color}`}>
                <k.icon className={`h-4 w-4 ${k.pulse ? "animate-pulse" : ""}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search ticket ID, customer, subject..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="waiting">Waiting</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>SLA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => {
                const sla = getSLAStatus(t);
                return (
                  <TableRow key={t.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelected(t)}>
                    <TableCell className="text-sm font-mono">{t.id}</TableCell>
                    <TableCell className="text-sm font-medium">{t.tenant}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{t.subject}</TableCell>
                    <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", priorityColors[t.priority])}>{t.priority}</Badge></TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-[10px] gap-1", sla.bg, sla.color)}>
                        <Timer className="h-3 w-3" /> {sla.label}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className={cn("text-xs capitalize", statusColors[t.status])}>{t.status.replace("_", " ")}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{t.assignee}</TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setSelected(t)}><ChevronRight className="h-3 w-3" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => { setSelected(null); setReply(""); }}>
        <SheetContent side="full" className="p-0 flex flex-col">
          {selected && (
            <>
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2 text-base">
                  <LifeBuoy className="h-4 w-4" /> {selected.id}
                </SheetTitle>
                <p className="text-sm font-medium mt-1">{selected.subject}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className={cn("text-xs capitalize", priorityColors[selected.priority])}>{selected.priority}</Badge>
                  <Badge variant="secondary" className={cn("text-xs capitalize", statusColors[selected.status])}>{selected.status.replace("_", " ")}</Badge>
                  {(() => { const sla = getSLAStatus(selected); return <Badge variant="secondary" className={cn("text-[10px] gap-1", sla.bg, sla.color)}><Timer className="h-3 w-3" /> {sla.label}</Badge>; })()}
                </div>
              </SheetHeader>

              {/* Ticket Meta */}
              <div className="px-4 py-3 border-b bg-muted/30 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">Customer:</span> <span className="font-medium">{selected.tenant}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{selected.category}</span></div>
                <div><span className="text-muted-foreground">Assignee:</span> <span className="font-medium">{selected.assignee}</span></div>
                <div><span className="text-muted-foreground">Created:</span> <span className="font-medium">{new Date(selected.createdAt).toLocaleString()}</span></div>
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 border-b flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="text-xs gap-1"><UserPlus className="h-3 w-3" /> Assign</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1"><ArrowUp className="h-3 w-3" /> Escalate</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1 text-success" onClick={() => { toast({ title: "Ticket Resolved" }); setSelected(null); }}>
                  <CheckCircle2 className="h-3 w-3" /> Resolve
                </Button>
              </div>

              {/* Conversation Thread */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {selected.thread.map(msg => (
                    <div key={msg.id} className={cn("flex gap-3", msg.isInternal && "opacity-75")}>
                      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                        <AvatarFallback className={cn("text-[10px]", msg.sender === "admin" ? "bg-primary/10 text-primary" : "bg-muted")}>
                          {msg.senderName.split(" ").map(w => w[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{msg.senderName}</span>
                          {msg.isInternal && <Badge variant="outline" className="text-[9px] px-1 py-0 h-3.5 gap-0.5"><StickyNote className="h-2.5 w-2.5" /> Internal</Badge>}
                          <span className="text-[10px] text-muted-foreground">{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        <div className={cn("mt-1 text-sm p-3 rounded-lg", msg.isInternal ? "bg-warning/10 border border-warning/20" : msg.sender === "admin" ? "bg-primary/5 border" : "bg-muted/50 border")}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Reply Composer */}
              <div className="border-t p-4 space-y-3">
                {/* Canned Responses */}
                <div className="flex gap-1.5 flex-wrap">
                  {cannedResponses.slice(0, 3).map((cr, i) => (
                    <Button key={i} variant="outline" size="sm" className="text-[10px] h-6 px-2" onClick={() => setReply(cr)}>
                      {cr.slice(0, 30)}...
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isInternal ? "secondary" : "outline"}
                    size="sm"
                    className="text-xs gap-1 shrink-0"
                    onClick={() => setIsInternal(!isInternal)}
                  >
                    <StickyNote className="h-3 w-3" /> {isInternal ? "Internal Note" : "Reply"}
                  </Button>
                </div>
                <Textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder={isInternal ? "Add an internal note (not visible to customer)..." : "Type your reply..."}
                  rows={3}
                  className={cn(isInternal && "border-warning/30 bg-warning/5")}
                />
                <div className="flex gap-2">
                  <Button className="flex-1 gap-1" disabled={!reply.trim()} onClick={handleSendReply}>
                    <Send className="h-3 w-3" /> {isInternal ? "Add Note" : "Send Reply"}
                  </Button>
                  {!isInternal && (
                    <Button variant="outline" className="gap-1" disabled={!reply.trim()} onClick={() => { handleSendReply(); toast({ title: "Ticket Resolved" }); setSelected(null); }}>
                      <CheckCircle2 className="h-3 w-3" /> Send & Close
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
