import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ResourceMeter } from "@/components/ui/ResourceMeter";
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
import { useLabStore } from "@/stores/labStore";
import {
  Plus,
  Search,
  RefreshCw,
  Square,
  Clock,
  Terminal,
  Cpu,
  Activity,
  AlertCircle,
  MoreHorizontal,
  Play,
  Server,
  Users,
} from "lucide-react";

const statusConfig: Record<string, { status: "success" | "warning" | "error" | "default" | "info"; label: string }> = {
  running: { status: "success", label: "Running" },
  stopped: { status: "default", label: "Stopped" },
  error: { status: "error", label: "Error" },
  active: { status: "success", label: "Active" },
  inactive: { status: "default", label: "Inactive" },
  scheduled: { status: "info", label: "Scheduled" },
};

export default function Labs() {
  const navigate = useNavigate();
  const { labs, templates } = useLabStore();
  const [search, setSearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");

  // Get all instances across all labs
  const allInstances = labs.flatMap((lab) =>
    lab.instances.map((instance) => ({
      ...instance,
      labId: lab.id,
      labName: lab.name,
      batchName: lab.batchName,
    }))
  );

  const filteredInstances = allInstances.filter(
    (instance) =>
      instance.studentName.toLowerCase().includes(search.toLowerCase()) ||
      instance.labName.toLowerCase().includes(search.toLowerCase()) ||
      instance.batchName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
      template.category.toLowerCase().includes(templateSearch.toLowerCase())
  );

  const runningCount = allInstances.filter((i) => i.status === "running").length;
  const stoppedCount = allInstances.filter((i) => i.status === "stopped").length;
  const errorCount = allInstances.filter((i) => i.status === "error").length;
  const runningInstances = allInstances.filter((i) => i.status === "running");
  const avgCpu = runningInstances.length > 0
    ? Math.round(runningInstances.reduce((acc, i) => acc + i.cpu, 0) / runningInstances.length)
    : 0;

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in-up">
        <PageHeader
          title="Labs"
          description="Manage lab templates and monitor active lab instances"
          breadcrumbs={[{ label: "Labs" }]}
          actions={
            <Button className="shadow-md" onClick={() => navigate("/labs/create-template")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Lab Template
            </Button>
          }
        />

        <Tabs defaultValue="labs" className="space-y-6">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="labs" className="gap-2 data-[state=active]:shadow-sm">
              <Server className="h-4 w-4" />
              Labs
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {labs.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="instances" className="gap-2 data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4" />
              Live Instances
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                {runningCount} live
              </span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2 data-[state=active]:shadow-sm">
              Templates
              <span className="text-muted-foreground text-xs">{templates.length}</span>
            </TabsTrigger>
          </TabsList>

          {/* Labs Tab */}
          <TabsContent value="labs" className="space-y-6 mt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total Labs" value={labs.length} icon={Server} variant="info" size="compact" />
              <StatCard
                title="Active Labs"
                value={labs.filter((l) => l.status === "active").length}
                icon={Play}
                variant="success"
                size="compact"
              />
              <StatCard title="Total Instances" value={allInstances.length} icon={Users} variant="default" size="compact" />
              <StatCard title="Running" value={runningCount} icon={Activity} variant="success" size="compact" />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">All Labs</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    placeholder="Search labs..."
                    className="pl-10 w-64 bg-muted/40 border-0 rounded-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-medium">Lab Name</TableHead>
                      <TableHead className="font-medium">Template</TableHead>
                      <TableHead className="font-medium">Batch</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Instances</TableHead>
                      <TableHead className="font-medium">Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labs.map((lab) => {
                      const labRunning = lab.instances.filter((i) => i.status === "running").length;
                      return (
                        <TableRow
                          key={lab.id}
                          className="table-row-premium group cursor-pointer"
                          onClick={() => navigate(`/labs/${lab.id}`)}
                        >
                          <TableCell className="font-medium">{lab.name}</TableCell>
                          <TableCell className="text-muted-foreground">{lab.templateName}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium">
                              {lab.batchName}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge
                              status={statusConfig[lab.status].status}
                              label={statusConfig[lab.status].label}
                              pulse={lab.status === "active"}
                            />
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1.5 text-sm">
                              <span className="font-medium text-success">{labRunning}</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-muted-foreground">{lab.instances.length}</span>
                              <span className="text-xs text-muted-foreground">running</span>
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{lab.createdAt}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Instances Tab */}
          <TabsContent value="instances" className="space-y-6 mt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Running" value={runningCount} icon={Play} variant="success" size="compact" />
              <StatCard title="Stopped" value={stoppedCount} icon={Square} variant="default" size="compact" />
              <StatCard title="Errors" value={errorCount} icon={AlertCircle} variant="warning" size="compact" />
              <StatCard title="Avg CPU Usage" value={`${avgCpu}%`} icon={Cpu} variant="info" size="compact" />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Live Lab Instances</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      placeholder="Search instances..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 w-64 bg-muted/40 border-0 rounded-lg"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-lg">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh</TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-medium">Student</TableHead>
                      <TableHead className="font-medium">Batch</TableHead>
                      <TableHead className="font-medium">Lab</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Time Left</TableHead>
                      <TableHead className="font-medium">CPU</TableHead>
                      <TableHead className="font-medium">Memory</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstances.map((instance) => (
                      <TableRow key={instance.id} className="table-row-premium group">
                        <TableCell className="font-medium">{instance.studentName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-lg bg-muted/80 px-2.5 py-1 text-xs font-medium">
                            {instance.batchName}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-muted-foreground cursor-pointer hover:text-primary hover:underline"
                          onClick={() => navigate(`/labs/${instance.labId}`)}
                        >
                          {instance.labName}
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={statusConfig[instance.status].status}
                            label={statusConfig[instance.status].label}
                            pulse={instance.status === "running"}
                          />
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {instance.timeRemaining}
                          </span>
                        </TableCell>
                        <TableCell>
                          <ResourceMeter value={instance.cpu} size="sm" />
                        </TableCell>
                        <TableCell>
                          <ResourceMeter value={instance.memory} size="sm" />
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reset</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Square className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Stop</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                  <Terminal className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Console</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">All Templates</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                  <Input
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="pl-10 w-64 bg-muted/40 border-0 rounded-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-medium">Template Name</TableHead>
                      <TableHead className="font-medium">Type</TableHead>
                      <TableHead className="font-medium">OS Version</TableHead>
                      <TableHead className="font-medium">Resources</TableHead>
                      <TableHead className="font-medium">Runtime Limit</TableHead>
                      <TableHead className="font-medium">Last Updated</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow key={template.id} className="table-row-premium group">
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>
                          <StatusBadge
                            status={template.type === "Linux" ? "success" : "info"}
                            label={template.type}
                            dot={false}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.os} {template.osVersion}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {template.vcpus} vCPU, {template.memory}GB RAM
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {template.runtimeLimit} min
                        </TableCell>
                        <TableCell className="text-muted-foreground">{template.lastUpdated}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}
