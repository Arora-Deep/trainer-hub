import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Cpu,
  HardDrive,
  Activity,
  AlertCircle,
  MoreHorizontal,
  Play,
} from "lucide-react";

// Mock data
const labTemplates = [
  { id: 1, name: "AWS EC2 Linux Instance", type: "Linux", os: "Ubuntu 22.04", runtime: "120 min", lastUpdated: "Jan 10, 2024" },
  { id: 2, name: "Windows Server 2022", type: "Windows", os: "Windows Server 2022", runtime: "180 min", lastUpdated: "Jan 8, 2024" },
  { id: 3, name: "Kubernetes Cluster", type: "Linux", os: "Alpine Linux", runtime: "90 min", lastUpdated: "Jan 5, 2024" },
  { id: 4, name: "Docker Environment", type: "Linux", os: "Ubuntu 20.04", runtime: "60 min", lastUpdated: "Dec 28, 2023" },
  { id: 5, name: "Terraform Sandbox", type: "Linux", os: "CentOS 8", runtime: "120 min", lastUpdated: "Jan 12, 2024" },
];

const labInstances = [
  { id: 1, student: "Alice Johnson", batch: "AWS SA - Batch 12", lab: "AWS EC2 Setup", status: "running", timeRemaining: "45 min", cpu: 32, memory: 48 },
  { id: 2, student: "Bob Williams", batch: "K8s - Batch 8", lab: "Kubernetes Pod", status: "running", timeRemaining: "30 min", cpu: 45, memory: 62 },
  { id: 3, student: "Carol Davis", batch: "Docker - Batch 15", lab: "Docker Compose", status: "error", timeRemaining: "15 min", cpu: 0, memory: 0 },
  { id: 4, student: "David Brown", batch: "Terraform - Batch 5", lab: "Terraform Basics", status: "running", timeRemaining: "60 min", cpu: 28, memory: 35 },
  { id: 5, student: "Eva Martinez", batch: "AWS SA - Batch 12", lab: "S3 Configuration", status: "stopped", timeRemaining: "0 min", cpu: 0, memory: 0 },
  { id: 6, student: "Frank Lee", batch: "K8s - Batch 8", lab: "Service Mesh", status: "running", timeRemaining: "85 min", cpu: 55, memory: 70 },
];

const statusConfig: Record<string, { status: "success" | "warning" | "error" | "default"; label: string }> = {
  running: { status: "success", label: "Running" },
  stopped: { status: "default", label: "Stopped" },
  error: { status: "error", label: "Error" },
};

export default function Labs() {
  const [search, setSearch] = useState("");
  
  const runningCount = labInstances.filter(l => l.status === "running").length;
  const stoppedCount = labInstances.filter(l => l.status === "stopped").length;
  const errorCount = labInstances.filter(l => l.status === "error").length;
  const avgCpu = Math.round(labInstances.filter(l => l.status === "running").reduce((acc, l) => acc + l.cpu, 0) / runningCount);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader
          title="Labs"
          description="Manage lab templates and monitor active lab instances"
          breadcrumbs={[{ label: "Labs" }]}
          actions={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Lab Template
            </Button>
          }
        />

        <Tabs defaultValue="instances" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="instances" className="gap-2">
              <Activity className="h-4 w-4" />
              Lab Instances
              <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-xs font-medium text-success">
                {runningCount} live
              </span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              Templates
              <span className="text-muted-foreground/70 text-xs">{labTemplates.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* Lab Instances (Live) */}
          <TabsContent value="instances" className="space-y-6 mt-0">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Running"
                value={runningCount}
                icon={Play}
                variant="success"
              />
              <StatCard
                title="Stopped"
                value={stoppedCount}
                icon={Square}
                variant="default"
              />
              <StatCard
                title="Errors"
                value={errorCount}
                icon={AlertCircle}
                variant="warning"
              />
              <StatCard
                title="Avg CPU Usage"
                value={`${avgCpu}%`}
                icon={Cpu}
                variant="info"
              />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Live Lab Instances</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                    <Input
                      placeholder="Search instances..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 w-64 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-medium">Student</TableHead>
                        <TableHead className="font-medium">Batch</TableHead>
                        <TableHead className="font-medium">Lab</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Time Left
                          </span>
                        </TableHead>
                        <TableHead className="font-medium">
                          <span className="inline-flex items-center gap-1">
                            <Cpu className="h-3.5 w-3.5" />
                            CPU
                          </span>
                        </TableHead>
                        <TableHead className="font-medium">
                          <span className="inline-flex items-center gap-1">
                            <HardDrive className="h-3.5 w-3.5" />
                            Memory
                          </span>
                        </TableHead>
                        <TableHead className="font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labInstances.map((instance) => (
                        <TableRow key={instance.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{instance.student}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                              {instance.batch}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{instance.lab}</TableCell>
                          <TableCell>
                            <StatusBadge
                              status={statusConfig[instance.status].status}
                              label={statusConfig[instance.status].label}
                            />
                          </TableCell>
                          <TableCell className="tabular-nums text-muted-foreground">{instance.timeRemaining}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-primary transition-all"
                                  style={{ width: `${instance.cpu}%` }}
                                />
                              </div>
                              <span className="text-xs tabular-nums text-muted-foreground w-8">{instance.cpu}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-info transition-all"
                                  style={{ width: `${instance.memory}%` }}
                                />
                              </div>
                              <span className="text-xs tabular-nums text-muted-foreground w-8">{instance.memory}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-0.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <RefreshCw className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset Lab</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Square className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Stop Lab</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Clock className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Extend Time</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Terminal className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Open Console</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lab Templates */}
          <TabsContent value="templates" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">All Templates</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-10 w-64 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30" 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-medium">Template Name</TableHead>
                        <TableHead className="font-medium">Type</TableHead>
                        <TableHead className="font-medium">OS Version</TableHead>
                        <TableHead className="font-medium">Runtime Limit</TableHead>
                        <TableHead className="font-medium">Last Updated</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labTemplates.map((template) => (
                        <TableRow key={template.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>
                            <StatusBadge
                              status={template.type === "Linux" ? "success" : "info"}
                              label={template.type}
                            />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{template.os}</TableCell>
                          <TableCell className="tabular-nums text-muted-foreground">{template.runtime}</TableCell>
                          <TableCell className="text-muted-foreground">{template.lastUpdated}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
