import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ResourceMeter } from "@/components/ui/ResourceMeter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Play,
  Square,
  AlertCircle,
  Clock,
  Terminal,
  RefreshCw,
  Cpu,
  HardDrive,
  Server,
  Users,
  Settings,
  Globe,
} from "lucide-react";

const statusConfig: Record<string, { status: "success" | "warning" | "error" | "default" | "info"; label: string }> = {
  running: { status: "success", label: "Running" },
  stopped: { status: "default", label: "Stopped" },
  error: { status: "error", label: "Error" },
  provisioning: { status: "info", label: "Provisioning" },
  active: { status: "success", label: "Active" },
  inactive: { status: "default", label: "Inactive" },
  scheduled: { status: "info", label: "Scheduled" },
};

export default function LabDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLabById, getTemplateById } = useLabStore();

  const lab = getLabById(id || "");
  const template = lab ? getTemplateById(lab.templateId) : undefined;

  if (!lab) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Lab not found</h2>
          <Button variant="outline" onClick={() => navigate("/labs")}>
            Back to Labs
          </Button>
        </div>
      </div>
    );
  }

  const runningInstances = lab.instances.filter((i) => i.status === "running").length;
  const stoppedInstances = lab.instances.filter((i) => i.status === "stopped").length;
  const errorInstances = lab.instances.filter((i) => i.status === "error").length;
  const avgCpu = runningInstances > 0
    ? Math.round(lab.instances.filter((i) => i.status === "running").reduce((acc, i) => acc + i.cpu, 0) / runningInstances)
    : 0;

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-in-up">
        <PageHeader
          title={lab.name}
          description={lab.description}
          breadcrumbs={[
            { label: "Labs", href: "/labs" },
            { label: lab.name },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
              <Button>
                <Play className="mr-2 h-4 w-4" />
                Start All
              </Button>
            </div>
          }
        />

        {/* Lab Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Running" value={runningInstances} icon={Play} variant="success" size="compact" />
          <StatCard title="Stopped" value={stoppedInstances} icon={Square} variant="default" size="compact" />
          <StatCard title="Errors" value={errorInstances} icon={AlertCircle} variant="warning" size="compact" />
          <StatCard title="Avg CPU" value={`${avgCpu}%`} icon={Cpu} variant="info" size="compact" />
        </div>

        {/* Template Info */}
        {template && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Template Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Template</p>
                  <p className="font-medium">{template.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">OS</p>
                  <p className="font-medium">{template.os} {template.osVersion}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Resources</p>
                  <p className="font-medium">{template.vcpus} vCPUs, {template.memory}GB RAM, {template.storage}GB</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Cloud Provider</p>
                  <p className="font-medium capitalize">{template.cloudProvider} ({template.region})</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {template.policies.internetAccess && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    <Globe className="h-3 w-3" /> Internet Access
                  </span>
                )}
                {template.policies.sshAccess && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2.5 py-1 text-xs font-medium text-info">
                    <Terminal className="h-3 w-3" /> SSH Access
                  </span>
                )}
                {template.policies.rdpAccess && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2.5 py-1 text-xs font-medium text-info">
                    <Server className="h-3 w-3" /> RDP Access
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lab Details */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Lab Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Status</p>
                <StatusBadge
                  status={statusConfig[lab.status].status}
                  label={statusConfig[lab.status].label}
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Batch</p>
                <p className="font-medium">{lab.batchName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="font-medium">{lab.createdAt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Instances</p>
                <p className="font-medium">{lab.instances.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Instances Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                VM Instances
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-lg">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh</TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="p-0">
              {lab.instances.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No instances running in this lab
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-medium">Student</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">IP Address</TableHead>
                      <TableHead className="font-medium">Time Left</TableHead>
                      <TableHead className="font-medium">CPU</TableHead>
                      <TableHead className="font-medium">Memory</TableHead>
                      <TableHead className="font-medium text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lab.instances.map((instance) => (
                      <TableRow key={instance.id} className="table-row-premium group">
                        <TableCell>
                          <div>
                            <p className="font-medium">{instance.studentName}</p>
                            <p className="text-xs text-muted-foreground">{instance.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={statusConfig[instance.status].status}
                            label={statusConfig[instance.status].label}
                            pulse={instance.status === "running"}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {instance.ipAddress}
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {instance.timeRemaining}
                          </span>
                        </TableCell>
                        <TableCell><ResourceMeter value={instance.cpu} size="sm" /></TableCell>
                        <TableCell><ResourceMeter value={instance.memory} size="sm" /></TableCell>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
