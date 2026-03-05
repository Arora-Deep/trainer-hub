import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Server, Monitor, Wrench, FileText, User } from "lucide-react";

const feedItems = [
  { user: "Rajesh Kumar", action: "created", entity: "Customer: DevOps Academy", time: "2 min ago", type: "customer" },
  { user: "System", action: "provisioned", entity: "Batch: K8s Batch #14 (30 VMs)", time: "5 min ago", type: "batch" },
  { user: "Ops Team", action: "assigned VM", entity: "VM-2045 → Student Alice Johnson", time: "12 min ago", type: "vm" },
  { user: "Admin", action: "scheduled maintenance", entity: "Node: compute-virginia-3", time: "30 min ago", type: "maintenance" },
  { user: "System", action: "generated invoice", entity: "INV-3007 for SkillBridge Labs", time: "1 hour ago", type: "invoice" },
  { user: "Priya Sharma", action: "created", entity: "Batch: ML Cohort #6", time: "1.5 hours ago", type: "batch" },
  { user: "System", action: "assigned VM", entity: "VM-2050 → Student Bob Williams", time: "2 hours ago", type: "vm" },
  { user: "Admin", action: "created", entity: "Customer: CloudLearn Pro", time: "3 hours ago", type: "customer" },
  { user: "Ravi M.", action: "resolved ticket", entity: "TKT-2002: K8s labs stuck", time: "4 hours ago", type: "maintenance" },
  { user: "System", action: "generated invoice", entity: "INV-3006 for CloudLearn Pro", time: "5 hours ago", type: "invoice" },
];

const typeIcons: Record<string, typeof Building2> = {
  customer: Building2,
  batch: Server,
  vm: Monitor,
  maintenance: Wrench,
  invoice: FileText,
};

const typeColors: Record<string, string> = {
  customer: "bg-primary/10 text-primary",
  batch: "bg-info/10 text-info",
  vm: "bg-success/10 text-success",
  maintenance: "bg-warning/10 text-warning",
  invoice: "bg-muted text-muted-foreground",
};

export default function ActivityFeed() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activity Feed</h1>
        <p className="text-muted-foreground text-sm mt-1">Track everything happening on the platform</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {feedItems.map((item, i) => {
              const Icon = typeIcons[item.type] || User;
              return (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                  <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${typeColors[item.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{item.user}</span>
                      <span className="text-muted-foreground"> {item.action} </span>
                      <span className="font-medium">{item.entity}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
