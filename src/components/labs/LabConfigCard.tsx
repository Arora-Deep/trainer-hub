import { motion } from "framer-motion";
import {
  FlaskConical,
  Monitor,
  Users,
  Calendar,
  Server,
  Cpu,
  HardDrive,
  Network,
  Shield,
  CheckCircle2,
  Clock,
  DollarSign,
  Play,
  Loader2,
  Eye,
  Settings,
  Trash2,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LabConfig } from "@/stores/batchStore";
import type { LabTemplate } from "@/stores/labStore";

interface LabConfigCardProps {
  labConfig: LabConfig;
  templates: LabTemplate[];
  onProvision?: () => void;
  onViewInstances?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isProvisioning?: boolean;
  variant?: "compact" | "detailed";
}

const statusConfig: Record<string, { status: "success" | "warning" | "primary" | "default" | "error"; label: string; icon?: React.ReactNode }> = {
  draft: { status: "default", label: "Draft" },
  pending_approval: { status: "warning", label: "Pending Approval" },
  approved: { status: "primary", label: "Approved" },
  provisioning: { status: "warning", label: "Provisioning" },
  active: { status: "success", label: "Active" },
  completed: { status: "default", label: "Completed" },
};

export function LabConfigCard({
  labConfig,
  templates,
  onProvision,
  onViewInstances,
  onDelete,
  onEdit,
  isProvisioning = false,
  variant = "detailed",
}: LabConfigCardProps) {
  const totalVMs = (labConfig.vmType === "multi" ? labConfig.vmTemplates.length : 1) * labConfig.participantCount + labConfig.adminCount;
  const isApproved = labConfig.approval.cloudAdda === "approved" && labConfig.approval.companyAdmin === "approved";
  const runningInstances = labConfig.instances.filter(i => i.status === "running").length;
  const provisioningInstances = labConfig.instances.filter(i => i.status === "provisioning").length;

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="group relative"
      >
        <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shrink-0">
                  <FlaskConical className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate">{labConfig.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Server className="h-3 w-3" />
                      {totalVMs} VMs
                    </span>
                    <span className="text-border">•</span>
                    <span className="text-primary font-medium">${labConfig.pricing.total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={statusConfig[labConfig.status].status}
                  label={statusConfig[labConfig.status].label}
                  pulse={labConfig.status === "active" || labConfig.status === "provisioning"}
                />
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={onDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-card to-card/80">
        {/* Header with gradient accent */}
        <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
        
        <CardContent className="p-6 space-y-5">
          {/* Top Row: Title + Status + Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                {labConfig.status === "active" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success animate-pulse" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                  {labConfig.name}
                </h3>
                {labConfig.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                    {labConfig.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(labConfig.dateRange.from)} - {formatDate(labConfig.dateRange.to)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge
                status={statusConfig[labConfig.status].status}
                label={statusConfig[labConfig.status].label}
                pulse={labConfig.status === "active" || labConfig.status === "provisioning"}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  {onEdit && <DropdownMenuItem onClick={onEdit}>Edit Configuration</DropdownMenuItem>}
                  {onViewInstances && <DropdownMenuItem onClick={onViewInstances}>View All Instances</DropdownMenuItem>}
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      Delete Lab
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 group/stat hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Server className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Total VMs</span>
              </div>
              <p className="text-xl font-bold tabular-nums">{totalVMs}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Participants</span>
              </div>
              <p className="text-xl font-bold tabular-nums">{labConfig.participantCount}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">VM Type</span>
              </div>
              <p className="text-xl font-bold capitalize">{labConfig.vmType}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:border-success/40 transition-colors">
              <div className="flex items-center gap-2 text-success/80 mb-1">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wide">Total Cost</span>
              </div>
              <p className="text-xl font-bold text-success tabular-nums">${labConfig.pricing.total.toFixed(2)}</p>
            </div>
          </div>

          {/* VM Templates */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                VM Templates
              </h4>
              <span className="text-xs text-muted-foreground">
                {labConfig.vmTemplates.length} template{labConfig.vmTemplates.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {labConfig.vmTemplates.map((vm, idx) => {
                const template = templates.find(t => t.id === vm.templateId);
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-muted/60 to-muted/30 border border-border/50 text-sm hover:border-primary/30 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Monitor className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium">{vm.instanceName}</span>
                      {template && (
                        <span className="text-muted-foreground ml-1.5 text-xs">
                          ({template.vcpus} vCPU, {template.memory}GB)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Approval Status + Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-lg",
                  labConfig.approval.cloudAdda === "approved" ? "bg-success/10" : "bg-muted/50"
                )}>
                  <Shield className={cn(
                    "h-4 w-4",
                    labConfig.approval.cloudAdda === "approved" ? "text-success" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">CloudAdda</span>
                  {labConfig.approval.cloudAdda === "approved" ? (
                    <CheckCircle2 className="inline-block ml-1.5 h-4 w-4 text-success" />
                  ) : (
                    <span className="ml-1.5 text-xs text-warning font-medium">Pending</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn(
                  "p-1.5 rounded-lg",
                  labConfig.approval.companyAdmin === "approved" ? "bg-success/10" : "bg-muted/50"
                )}>
                  <Users className={cn(
                    "h-4 w-4",
                    labConfig.approval.companyAdmin === "approved" ? "text-success" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Company Admin</span>
                  {labConfig.approval.companyAdmin === "approved" ? (
                    <CheckCircle2 className="inline-block ml-1.5 h-4 w-4 text-success" />
                  ) : (
                    <span className="ml-1.5 text-xs text-warning font-medium">Pending</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {labConfig.status === "approved" && onProvision && (
                <Button
                  size="sm"
                  onClick={onProvision}
                  className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  disabled={isProvisioning}
                >
                  {isProvisioning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Provision Lab
                </Button>
              )}
              {labConfig.status === "provisioning" && (
                <Button size="sm" disabled className="gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Provisioning...
                </Button>
              )}
              {labConfig.status === "active" && onViewInstances && (
                <Button size="sm" variant="outline" onClick={onViewInstances} className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Instances
                </Button>
              )}
            </div>
          </div>

          {/* Active Instances Preview */}
          {labConfig.status === "active" && labConfig.instances.length > 0 && (
            <div className="pt-4 border-t border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-success" />
                  Running Instances
                </h4>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success font-medium">{runningInstances}</span>
                  <span className="text-muted-foreground">/ {labConfig.instances.length}</span>
                </div>
              </div>
              
              <ProgressBar 
                value={(runningInstances / labConfig.instances.length) * 100} 
                variant="success" 
                size="sm" 
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {labConfig.instances.slice(0, 8).map((instance) => (
                  <div
                    key={instance.id}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-colors",
                      instance.status === "running" 
                        ? "bg-success/5 border-success/20" 
                        : instance.status === "provisioning"
                        ? "bg-warning/5 border-warning/20"
                        : "bg-muted/30 border-border/50"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      instance.status === "running" ? "bg-success" : 
                      instance.status === "provisioning" ? "bg-warning animate-pulse" : 
                      instance.status === "error" ? "bg-destructive" : "bg-muted-foreground"
                    )} />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-xs">{instance.studentName}</p>
                      <p className="text-xs text-muted-foreground truncate">{instance.ipAddress}</p>
                    </div>
                  </div>
                ))}
                {labConfig.instances.length > 8 && (
                  <button 
                    onClick={onViewInstances}
                    className="flex items-center justify-center p-2.5 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                  >
                    +{labConfig.instances.length - 8} more
                  </button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
