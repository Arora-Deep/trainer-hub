import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  HelpCircle, MessageSquare, BookOpen, Search, ExternalLink,
  Clock, CheckCircle, AlertCircle,
} from "lucide-react";

const tickets = [
  { id: "TK-1042", title: "VPC Lab not launching", status: "open", priority: "high", created: "2h ago", lastUpdate: "1h ago" },
  { id: "TK-1038", title: "Docker lab storage full", status: "resolved", priority: "medium", created: "3d ago", lastUpdate: "2d ago" },
  { id: "TK-1035", title: "Access issue with K8s cluster", status: "resolved", priority: "low", created: "1w ago", lastUpdate: "5d ago" },
];

const faq = [
  { q: "How do I reset my lab credentials?", a: "Go to My Labs → select the lab → click 'Reset Credentials'." },
  { q: "My lab session expired. Can I get an extension?", a: "Contact your trainer or raise a support ticket requesting an extension." },
  { q: "How do I download my certificate?", a: "Go to Certificates → click 'Download' on any issued certificate." },
  { q: "I'm getting a connection error in my lab.", a: "Try refreshing. If the issue persists, raise a support ticket." },
];

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
  open: { color: "bg-warning/10 text-warning", icon: Clock },
  resolved: { color: "bg-success/10 text-success", icon: CheckCircle },
};

export default function StudentSupport() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground text-sm mt-1">Get help with labs, courses, and account issues</p>
        </div>
        <Button size="sm" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> New Ticket</Button>
      </div>

      {/* Quick Search */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search help articles, FAQs, or describe your issue..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tickets */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-4">My Tickets</h3>
              <div className="space-y-3">
                {tickets.map((t) => {
                  const cfg = statusConfig[t.status];
                  return (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${t.status === "open" ? "bg-warning/10" : "bg-success/10"}`}>
                        {t.status === "open" ? <AlertCircle className="h-4 w-4 text-warning" /> : <CheckCircle className="h-4 w-4 text-success" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                          <p className="text-sm font-medium truncate">{t.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Created {t.created} · Updated {t.lastUpdate}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize">{t.priority}</Badge>
                        <Badge variant="secondary" className={`text-xs capitalize ${cfg.color}`}>{t.status}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
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
    </div>
  );
}
