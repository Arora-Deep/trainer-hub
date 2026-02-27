import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FlaskConical, Cpu, HardDrive, MemoryStick } from "lucide-react";

const templates = [
  { id: "1", name: "AWS Cloud Practitioner Lab", os: "Ubuntu 22.04", cpu: 2, ram: 4, storage: 50, category: "AWS", usedBy: 12, status: "active" },
  { id: "2", name: "Kubernetes Cluster Setup", os: "CentOS 8", cpu: 4, ram: 8, storage: 100, category: "DevOps", usedBy: 8, status: "active" },
  { id: "3", name: "Azure Fundamentals", os: "Windows Server 2022", cpu: 2, ram: 4, storage: 80, category: "Azure", usedBy: 5, status: "active" },
  { id: "4", name: "Docker Essentials", os: "Ubuntu 20.04", cpu: 2, ram: 2, storage: 30, category: "DevOps", usedBy: 15, status: "active" },
  { id: "5", name: "Terraform Lab", os: "Amazon Linux 2", cpu: 2, ram: 4, storage: 40, category: "IaC", usedBy: 6, status: "draft" },
  { id: "6", name: "Python ML Environment", os: "Ubuntu 22.04", cpu: 4, ram: 16, storage: 120, category: "ML/AI", usedBy: 3, status: "active" },
];

export default function AdminTemplates() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lab Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Global template library for all customers</p>
        </div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Create Template</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates..." className="pl-9" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className={`text-xs ${t.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {t.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm">{t.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t.os}</p>
              <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Cpu className="h-3 w-3" />{t.cpu} vCPU</span>
                <span className="flex items-center gap-1"><MemoryStick className="h-3 w-3" />{t.ram}GB</span>
                <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{t.storage}GB</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <Badge variant="outline" className="text-[11px]">{t.category}</Badge>
                <span className="text-xs text-muted-foreground">Used by {t.usedBy} customers</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
