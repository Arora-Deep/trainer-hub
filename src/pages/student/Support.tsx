import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle, MessageSquare, BookOpen, Search, ExternalLink,
  Clock, CheckCircle, AlertCircle, LifeBuoy, Send, User,
} from "lucide-react";
import { StudentPageHero } from "@/components/gamification/StudentPageHero";
import { toast } from "sonner";

type TicketStatus = "open" | "in_progress" | "resolved";
type TicketPriority = "low" | "medium" | "high";

interface TicketReply {
  author: string;
  role: "student" | "support";
  message: string;
  at: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  created: string;
  lastUpdate: string;
  replies: TicketReply[];
}

const initialTickets: Ticket[] = [
  {
    id: "TK-1042",
    title: "VPC Lab not launching",
    description: "When I try to launch the VPC lab from Module 3, the console hangs at 'Provisioning network'.",
    category: "Lab Issue",
    status: "open",
    priority: "high",
    created: "2h ago",
    lastUpdate: "1h ago",
    replies: [
      { author: "Support", role: "support", message: "Hi, we are looking into the provisioning queue. Please try again in 15 minutes.", at: "1h ago" },
    ],
  },
  {
    id: "TK-1038",
    title: "Docker lab storage full",
    description: "Got a 'no space left on device' error while pulling images.",
    category: "Lab Issue",
    status: "resolved",
    priority: "medium",
    created: "3d ago",
    lastUpdate: "2d ago",
    replies: [
      { author: "Support", role: "support", message: "We expanded the volume on your lab VM. Please reconnect.", at: "2d ago" },
    ],
  },
  {
    id: "TK-1035",
    title: "Access issue with K8s cluster",
    description: "Kubeconfig credentials seem to be expired.",
    category: "Access",
    status: "resolved",
    priority: "low",
    created: "1w ago",
    lastUpdate: "5d ago",
    replies: [],
  },
];

const faq = [
  { q: "How do I reset my lab credentials?", a: "Go to My Labs → select the lab → click 'Reset Credentials'." },
  { q: "My lab session expired. Can I get an extension?", a: "Contact your trainer or raise a support ticket requesting an extension." },
  { q: "How do I download my certificate?", a: "Go to Certificates → click 'Download' on any issued certificate." },
  { q: "I'm getting a connection error in my lab.", a: "Try refreshing. If the issue persists, raise a support ticket." },
];

const statusMeta: Record<TicketStatus, { color: string; label: string }> = {
  open: { color: "bg-warning/10 text-warning", label: "Open" },
  in_progress: { color: "bg-info/10 text-info", label: "In progress" },
  resolved: { color: "bg-success/10 text-success", label: "Resolved" },
};

const categories = ["Lab Issue", "Course Content", "Access", "Billing", "Other"];

export default function StudentSupport() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", category: "", priority: "medium" as TicketPriority, description: "" });
  const [reply, setReply] = useState("");

  const selected = tickets.find((t) => t.id === selectedId) ?? null;
  const filtered = tickets.filter((t) =>
    !query ? true : (t.title + t.id + t.description).toLowerCase().includes(query.toLowerCase()),
  );

  const submitTicket = () => {
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      toast.error("Please fill in title, category, and description.");
      return;
    }
    const newTicket: Ticket = {
      id: `TK-${1043 + tickets.length}`,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      status: "open",
      priority: form.priority,
      created: "just now",
      lastUpdate: "just now",
      replies: [],
    };
    setTickets([newTicket, ...tickets]);
    setForm({ title: "", category: "", priority: "medium", description: "" });
    setCreateOpen(false);
    toast.success(`Ticket ${newTicket.id} created`);
  };

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    const updated = tickets.map((t) =>
      t.id === selected.id
        ? {
            ...t,
            lastUpdate: "just now",
            status: t.status === "resolved" ? ("open" as TicketStatus) : t.status,
            replies: [...t.replies, { author: "You", role: "student" as const, message: reply.trim(), at: "just now" }],
          }
        : t,
    );
    setTickets(updated);
    setReply("");
    toast.success("Reply sent");
  };

  const closeTicket = () => {
    if (!selected) return;
    setTickets(tickets.map((t) => (t.id === selected.id ? { ...t, status: "resolved", lastUpdate: "just now" } : t)));
    toast.success("Ticket marked resolved");
  };

  const openCounts = {
    open: tickets.filter((t) => t.status === "open").length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      <StudentPageHero
        variant="cyan"
        eyebrow="Support"
        icon={LifeBuoy}
        title={<>Stuck? <span className="text-white/95">We've got you.</span></>}
        description="Raise a ticket and our team will get back to you."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 bg-white text-foreground hover:bg-white/90">
            <MessageSquare className="h-3.5 w-3.5" /> New Ticket
          </Button>
        }
      />

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your tickets..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">My Tickets</h3>
                <div className="flex gap-2 text-[11px]">
                  <Badge variant="secondary" className="bg-warning/10 text-warning">{openCounts.open} open</Badge>
                  <Badge variant="secondary" className="bg-success/10 text-success">{openCounts.resolved} resolved</Badge>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  No tickets match your search.
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors text-left"
                    >
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${t.status === "resolved" ? "bg-success/10" : "bg-warning/10"}`}>
                        {t.status === "resolved" ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                          <p className="text-sm font-medium truncate">{t.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.category} · Created {t.created} · Updated {t.lastUpdate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-[10px] capitalize">{t.priority}</Badge>
                        <Badge variant="secondary" className={`text-xs ${statusMeta[t.status].color}`}>
                          {statusMeta[t.status].label}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> FAQs
            </h3>
            <div className="space-y-4">
              {faq.map((f, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{f.q}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.a}</p>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs mt-4 w-full">
              <BookOpen className="h-3.5 w-3.5" /> View All Help Articles <ExternalLink className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Create ticket dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>New Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we'll get back to you shortly.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="t-title">Subject</Label>
              <Input
                id="t-title"
                placeholder="Brief summary of the issue"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v: TicketPriority) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-desc">Description</Label>
              <Textarea
                id="t-desc"
                rows={5}
                placeholder="Include steps to reproduce, error messages, and what you expected."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={submitTicket} className="gap-1.5"><Send className="h-3.5 w-3.5" /> Submit ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-xl flex flex-col">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{selected.id}</span>
                  <Badge variant="secondary" className={`text-xs ${statusMeta[selected.status].color}`}>
                    {statusMeta[selected.status].label}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] capitalize">{selected.priority}</Badge>
                </div>
                <SheetTitle className="text-left">{selected.title}</SheetTitle>
                <SheetDescription className="text-left">
                  {selected.category} · Created {selected.created} · Updated {selected.lastUpdate}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
                <div className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <User className="h-3 w-3" /> You · {selected.created}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{selected.description}</p>
                </div>

                {selected.replies.map((r, i) => (
                  <div
                    key={i}
                    className={`rounded-lg border p-3 ${r.role === "support" ? "border-primary/30 bg-primary/5" : "border-border"}`}
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <User className="h-3 w-3" /> {r.author} · {r.at}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                  </div>
                ))}
              </div>

              {selected.status !== "resolved" ? (
                <div className="border-t border-border pt-3 mt-3 space-y-2">
                  <Textarea
                    rows={3}
                    placeholder="Write a reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <div className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={closeTicket}>
                      <CheckCircle className="h-3.5 w-3.5" /> Mark resolved
                    </Button>
                    <Button size="sm" onClick={sendReply} disabled={!reply.trim()} className="gap-1.5">
                      <Send className="h-3.5 w-3.5" /> Send reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border pt-3 mt-3 text-center text-xs text-muted-foreground">
                  This ticket is resolved. Reply to reopen it.
                  <div className="mt-2">
                    <Textarea
                      rows={2}
                      placeholder="Reopen with a message..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    />
                    <Button size="sm" onClick={sendReply} disabled={!reply.trim()} className="gap-1.5 mt-2">
                      <Send className="h-3.5 w-3.5" /> Reopen ticket
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
