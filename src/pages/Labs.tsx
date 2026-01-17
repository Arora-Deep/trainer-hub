import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ResourceMeter } from "@/components/ui/ResourceMeter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Search,
  RefreshCw,
  Square,
  Clock,
  Terminal,
  Activity,
  MoreHorizontal,
} from "lucide-react";

const labInstances = [
  { id: 1, student: "Alice Johnson", batch: "AWS SA - Batch 12", lab: "AWS EC2 Setup", status: "running", timeRemaining: "45 min", cpu: 32, memory: 48 },
  { id: 2, student: "Bob Williams", batch: "K8s - Batch 8", lab: "Kubernetes Pod", status: "running", timeRemaining: "30 min", cpu: 45, memory: 62 },
  { id: 3, student: "Carol Davis", batch: "Docker - Batch 15", lab: "Docker Compose", status: "error", timeRemaining: "15 min", cpu: 0, memory: 0 },
  { id: 4, student: "David Brown", batch: "Terraform - Batch 5", lab: "Terraform Basics", status: "running", timeRemaining: "60 min", cpu: 28, memory: 35 },
  { id: 5, student: "Eva Martinez", batch: "AWS SA - Batch 12", lab: "S3 Configuration", status: "stopped", timeRemaining: "0 min", cpu: 0, memory: 0 },
];

const labTemplates = [
  { id: 1, name: "AWS EC2 Linux Instance", os: "Ubuntu 22.04", runtime: "120 min" },
  { id: 2, name: "Windows Server 2022", os: "Windows Server", runtime: "180 min" },
  { id: 3, name: "Kubernetes Cluster", os: "Alpine Linux", runtime: "90 min" },
  { id: 4, name: "Docker Environment", os: "Ubuntu 20.04", runtime: "60 min" },
];

const statusConfig: Record<string, { status: "success" | "warning" | "error" | "default"; label: string }> = {
  running: { status: "success", label: "Running" },
  stopped: { status: "default", label: "Stopped" },
  error: { status: "error", label: "Error" },
};

export default function Labs() {
  const [search, setSearch] = useState("");
  
  const runningCount = labInstances.filter(l => l.status === "running").length;
  const filteredInstances = labInstances.filter(l => 
    l.student.toLowerCase().includes(search.toLowerCase()) ||
    l.lab.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in-up">
        <PageHeader
          title="Labs"
          description="Manage lab templates and monitor instances"
          breadcrumbs={[{ label: "Labs" }]}
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          }
        />

        <Tabs defaultValue="instances" className="space-y-6">
          <TabsList className="h-9">
            <TabsTrigger value="instances" className="text-xs gap-2">
              <Activity className="h-3.5 w-3.5" />
              Live Instances
              <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                {runningCount}
              </span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">
              Templates ({labTemplates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instances" className="space-y-4 mt-0">
            {/* Search & Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search instances..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
            </div>

            {/* Instances List */}
            <div className="space-y-2">
              {filteredInstances.map((instance) => (
                <Card key={instance.id} className="hover:border-border/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-sm">{instance.student}</span>
                          <StatusBadge
                            status={statusConfig[instance.status].status}
                            label={statusConfig[instance.status].label}
                            size="sm"
                            pulse={instance.status === "running"}
                          />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{instance.lab}</span>
                          <span>•</span>
                          <span>{instance.batch}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {instance.timeRemaining}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 shrink-0">
                        {instance.status === "running" && (
                          <div className="hidden sm:flex items-center gap-4">
                            <div className="w-20">
                              <p className="text-[10px] text-muted-foreground mb-1">CPU</p>
                              <ResourceMeter value={instance.cpu} size="sm" />
                            </div>
                            <div className="w-20">
                              <p className="text-[10px] text-muted-foreground mb-1">Memory</p>
                              <ResourceMeter value={instance.memory} size="sm" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Terminal className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Console</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Square className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Stop</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4 mt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {labTemplates.map((template) => (
                <Card key={template.id} className="hover:border-border/80 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {template.os} • {template.runtime}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
