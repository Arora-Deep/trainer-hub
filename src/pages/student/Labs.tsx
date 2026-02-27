import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Clock, ExternalLink, Power } from "lucide-react";

const labs = [
  { id: "1", name: "AWS VPC Lab", template: "AWS Cloud Practitioner", status: "running", timeRemaining: "1h 45m", ip: "10.0.1.42" },
  { id: "2", name: "K8s Cluster Lab", template: "Kubernetes Fundamentals", status: "running", timeRemaining: "2h 30m", ip: "10.0.2.18" },
  { id: "3", name: "Docker Lab", template: "Docker Essentials", status: "stopped", timeRemaining: "-", ip: "-" },
  { id: "4", name: "Terraform Lab", template: "Terraform Basics", status: "completed", timeRemaining: "-", ip: "-" },
];

const statusColors: Record<string, string> = {
  running: "bg-success/10 text-success",
  stopped: "bg-muted text-muted-foreground",
  completed: "bg-primary/10 text-primary",
};

export default function StudentLabs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Labs</h1>
        <p className="text-muted-foreground text-sm mt-1">Access your lab environments</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {labs.map((lab) => (
          <Card key={lab.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Monitor className="h-5 w-5 text-muted-foreground" /></div>
                  <div>
                    <h3 className="font-semibold text-sm">{lab.name}</h3>
                    <p className="text-xs text-muted-foreground">{lab.template}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={`text-xs capitalize ${statusColors[lab.status]}`}>{lab.status}</Badge>
              </div>
              {lab.status === "running" && (
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{lab.timeRemaining} left</span>
                    <span>IP: {lab.ip}</span>
                  </div>
                  <Button size="sm" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> Launch Console</Button>
                </div>
              )}
              {lab.status === "stopped" && (
                <div className="flex justify-end mt-4">
                  <Button size="sm" variant="outline" className="gap-1.5"><Power className="h-3.5 w-3.5" /> Start Lab</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
