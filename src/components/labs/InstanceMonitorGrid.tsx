import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Play,
  Square,
  RotateCcw,
  ExternalLink,
  MoreHorizontal,
  Search,
  Filter,
  ChevronDown,
  Terminal,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ResourceMeter } from "@/components/ui/ResourceMeter";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { LabInstance } from "@/stores/batchStore";

interface InstanceMonitorGridProps {
  instances: LabInstance[];
  labName: string;
  onStartInstance?: (instanceId: string) => void;
  onStopInstance?: (instanceId: string) => void;
  onRestartInstance?: (instanceId: string) => void;
  onConnectInstance?: (instanceId: string) => void;
}

const statusConfig = {
  running: { status: "success" as const, label: "Running" },
  stopped: { status: "default" as const, label: "Stopped" },
  error: { status: "error" as const, label: "Error" },
  provisioning: { status: "warning" as const, label: "Provisioning" },
};

export function InstanceMonitorGrid({
  instances,
  labName,
  onStartInstance,
  onStopInstance,
  onRestartInstance,
  onConnectInstance,
}: InstanceMonitorGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedInstances, setExpandedInstances] = useState<Set<string>>(new Set());

  const filteredInstances = instances.filter(instance => {
    const matchesSearch = instance.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         instance.ipAddress.includes(searchQuery) ||
                         instance.vmName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || instance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    running: instances.filter(i => i.status === "running").length,
    stopped: instances.filter(i => i.status === "stopped").length,
    error: instances.filter(i => i.status === "error").length,
    provisioning: instances.filter(i => i.status === "provisioning").length,
  };

  const toggleExpanded = (id: string) => {
    setExpandedInstances(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
        >
          <div className="flex items-center gap-2 text-success mb-1">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Running</span>
          </div>
          <p className="text-3xl font-bold text-success">{stats.running}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Square className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Stopped</span>
          </div>
          <p className="text-3xl font-bold">{stats.stopped}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20"
        >
          <div className="flex items-center gap-2 text-warning mb-1">
            <RotateCcw className="h-4 w-4 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wide">Provisioning</span>
          </div>
          <p className="text-3xl font-bold text-warning">{stats.provisioning}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
        >
          <div className="flex items-center gap-2 text-destructive mb-1">
            <Monitor className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wide">Error</span>
          </div>
          <p className="text-3xl font-bold text-destructive">{stats.error}</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, IP, or VM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {statusFilter === "all" ? "All Status" : statusConfig[statusFilter as keyof typeof statusConfig]?.label}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("running")}>Running</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("stopped")}>Stopped</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("provisioning")}>Provisioning</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("error")}>Error</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Instances Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredInstances.map((instance, index) => (
            <motion.div
              key={instance.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.02 }}
              layout
            >
              <Collapsible
                open={expandedInstances.has(instance.id)}
                onOpenChange={() => toggleExpanded(instance.id)}
              >
                <Card className={cn(
                  "overflow-hidden transition-all duration-300",
                  instance.status === "running" && "border-success/30 hover:border-success/50",
                  instance.status === "error" && "border-destructive/30",
                  instance.status === "provisioning" && "border-warning/30",
                )}>
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          instance.status === "running" ? "bg-success/10" : 
                          instance.status === "error" ? "bg-destructive/10" :
                          instance.status === "provisioning" ? "bg-warning/10" : "bg-muted/50"
                        )}>
                          <Monitor className={cn(
                            "h-5 w-5",
                            instance.status === "running" ? "text-success" : 
                            instance.status === "error" ? "text-destructive" :
                            instance.status === "provisioning" ? "text-warning" : "text-muted-foreground"
                          )} />
                          {instance.status === "running" && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold truncate">{instance.studentName}</h4>
                          <p className="text-xs text-muted-foreground truncate">{instance.vmName}</p>
                        </div>
                      </div>
                      <StatusBadge
                        status={statusConfig[instance.status].status}
                        label={statusConfig[instance.status].label}
                        pulse={instance.status === "running" || instance.status === "provisioning"}
                      />
                    </div>

                    {/* IP Address */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Network className="h-3.5 w-3.5 text-muted-foreground" />
                        <code className="font-mono text-xs">{instance.ipAddress}</code>
                      </div>
                      {instance.status === "running" && onConnectInstance && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs"
                          onClick={() => onConnectInstance(instance.id)}
                        >
                          <Terminal className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      {instance.status === "stopped" && onStartInstance && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs"
                          onClick={() => onStartInstance(instance.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                      {instance.status === "running" && (
                        <>
                          {onStopInstance && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs"
                              onClick={() => onStopInstance(instance.id)}
                            >
                              <Square className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          )}
                          {onRestartInstance && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-8 text-xs"
                              onClick={() => onRestartInstance(instance.id)}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restart
                            </Button>
                          )}
                        </>
                      )}
                      <CollapsibleTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform",
                            expandedInstances.has(instance.id) && "rotate-180"
                          )} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    {/* Expanded Details */}
                    <CollapsibleContent>
                      <div className="pt-4 mt-3 border-t border-border/50 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Email</p>
                            <p className="text-sm truncate">{instance.studentEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Started</p>
                            <p className="text-sm">{new Date(instance.startedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        {instance.status === "running" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Cpu className="h-3 w-3" /> CPU Usage
                              </span>
                              <span className="font-medium">{Math.floor(Math.random() * 60 + 20)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <HardDrive className="h-3 w-3" /> Memory
                              </span>
                              <span className="font-medium">{Math.floor(Math.random() * 50 + 30)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </CardContent>
                </Card>
              </Collapsible>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredInstances.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <h3 className="font-semibold">No instances found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters" 
              : "No instances have been provisioned yet"}
          </p>
        </div>
      )}
    </div>
  );
}
