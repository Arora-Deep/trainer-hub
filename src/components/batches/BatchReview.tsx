import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLabStore } from "@/stores/labStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DollarSign,
  Eye,
  Shield,
  Cloud,
  Building2,
  Send,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  FileText,
  Server,
  Users,
} from "lucide-react";

interface VMTemplate {
  templateId: string;
  instanceName: string;
}

interface PricingInfo {
  vmCost: number;
  storageCost: number;
  networkCost: number;
  supportCost: number;
  totalVMs: number;
  days: number;
  total: number;
}

interface BatchReviewProps {
  // Batch info
  batchName: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  medium: string;
  seatCount: number;
  instructors: string[];
  // VM info
  vmType: "single" | "multi";
  vmTemplates: VMTemplate[];
  participantCount: number;
  adminCount: number;
  vmStartDate: Date | undefined;
  vmEndDate: Date | undefined;
  // Pricing
  pricing: PricingInfo;
  // Approval
  approvalRequested: boolean;
  cloudAddaApproval: "pending" | "approved" | "rejected";
  companyAdminApproval: "pending" | "approved" | "rejected";
  onRequestApproval: () => void;
  isFormValid: boolean;
  isApproved: boolean;
  isSubmitting: boolean;
}

export function BatchReview({
  batchName, description, startDate, endDate, medium, seatCount, instructors,
  vmType, vmTemplates, participantCount, adminCount, vmStartDate, vmEndDate,
  pricing,
  approvalRequested, cloudAddaApproval, companyAdminApproval,
  onRequestApproval, isFormValid, isApproved, isSubmitting,
}: BatchReviewProps) {
  const { getTemplateById } = useLabStore();

  const getApprovalStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved": return <StatusBadge status="success" label="Approved" pulse />;
      case "rejected": return <StatusBadge status="error" label="Rejected" />;
      default: return <StatusBadge status="warning" label="Pending" pulse={approvalRequested} />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Review Summary */}
      <div className="lg:col-span-2 space-y-6">
        {/* Batch Summary */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              Batch Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch Name</p>
                <p className="font-medium">{batchName || "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Medium</p>
                <p className="font-medium capitalize">{medium}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch Start</p>
                <p className="font-medium">{startDate ? format(startDate, "PPP") : "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch End</p>
                <p className="font-medium">{endDate ? format(endDate, "PPP") : "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Seat Count</p>
                <p className="font-medium">{seatCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Instructors</p>
                <p className="font-medium">{instructors.filter(i => i.trim()).join(", ") || "None"}</p>
              </div>
              {description && (
                <div className="col-span-2 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* VM Configuration Summary */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-info/5">
                <Server className="h-5 w-5 text-info" />
              </div>
              VM Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">VM Type</p>
                <p className="font-medium capitalize">{vmType} VM</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total VMs</p>
                <p className="font-medium">{pricing.totalVMs}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">VM Start</p>
                <p className="font-medium">{vmStartDate ? format(vmStartDate, "PPP") : "Not set"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">VM End</p>
                <p className="font-medium">{vmEndDate ? format(vmEndDate, "PPP") : "Not set"}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {vmTemplates.map((vm, index) => {
                const template = vm.templateId ? getTemplateById(vm.templateId) : null;
                return (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border/50 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{vm.instanceName || `VM ${index + 1}`}</p>
                      <p className="text-sm text-muted-foreground">
                        {template ? `${template.name} • ${template.vcpus} vCPU • ${template.memory}GB RAM` : "No template selected"}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      × {participantCount + (index === 0 ? adminCount : 0)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="font-semibold text-lg">{participantCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Admin Instances</p>
                <p className="font-semibold text-lg">{adminCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Pricing & Approval */}
      <div className="space-y-6">
        {/* Pricing Summary */}
        <Card className="glass-card border-white/10 sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              Pricing Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">{pricing.days > 0 ? `${pricing.days} days` : "Not set"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total VMs</span>
                <span className="font-medium">{pricing.totalVMs}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VMs per Participant</span>
                <span className="font-medium">{vmType === "multi" ? vmTemplates.length : 1}</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Compute</span>
                <span className="font-medium">${pricing.vmCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">${pricing.storageCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Network</span>
                <span className="font-medium">${pricing.networkCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Support</span>
                <span className="font-medium">${pricing.supportCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-2xl font-bold text-primary">${pricing.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">* Final pricing may vary based on actual usage</p>
            </div>

            {/* View Details Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details & Breakdown
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Full Pricing Breakdown</DialogTitle>
                  <DialogDescription>Detailed breakdown of all costs and configuration</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><FileText className="h-4 w-4" /> Configuration</h4>
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                      <div><p className="text-xs text-muted-foreground">Batch Name</p><p className="font-medium">{batchName || "Not set"}</p></div>
                      <div><p className="text-xs text-muted-foreground">VM Duration</p><p className="font-medium">{pricing.days > 0 ? `${pricing.days} days` : "Not set"}</p></div>
                      <div><p className="text-xs text-muted-foreground">VM Start</p><p className="font-medium">{vmStartDate ? format(vmStartDate, "PPP") : "Not set"}</p></div>
                      <div><p className="text-xs text-muted-foreground">VM End</p><p className="font-medium">{vmEndDate ? format(vmEndDate, "PPP") : "Not set"}</p></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><Server className="h-4 w-4" /> VM Templates</h4>
                    <div className="space-y-2">
                      {vmTemplates.map((vm, index) => {
                        const template = vm.templateId ? getTemplateById(vm.templateId) : null;
                        return (
                          <div key={index} className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
                            <div>
                              <p className="font-medium">{vm.instanceName || `VM ${index + 1}`}</p>
                              <p className="text-sm text-muted-foreground">
                                {template ? `${template.name} • ${template.vcpus} vCPU • ${template.memory}GB RAM` : "No template"}
                              </p>
                            </div>
                            <span className="text-sm font-medium">× {participantCount + (index === 0 ? adminCount : 0)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4" /> Instances</h4>
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                      <div><p className="text-xs text-muted-foreground">Participant VMs</p><p className="font-medium">{participantCount * (vmType === "multi" ? vmTemplates.length : 1)}</p></div>
                      <div><p className="text-xs text-muted-foreground">Admin VMs</p><p className="font-medium">{adminCount}</p></div>
                      <div><p className="text-xs text-muted-foreground">VMs per Participant</p><p className="font-medium">{vmType === "multi" ? vmTemplates.length : 1}</p></div>
                      <div><p className="text-xs text-muted-foreground">Total VMs</p><p className="font-medium">{pricing.totalVMs}</p></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Cost Breakdown</h4>
                    <div className="space-y-2">
                      {[
                        { label: "Compute Cost", desc: `${pricing.totalVMs} VMs × $50/day × ${pricing.days} days`, value: pricing.vmCost },
                        { label: "Storage Cost", desc: `${pricing.totalVMs} VMs × $5/day × ${pricing.days} days`, value: pricing.storageCost },
                        { label: "Network Cost", desc: `${pricing.totalVMs} VMs × $2/day × ${pricing.days} days`, value: pricing.networkCost },
                        { label: "Support Cost", desc: `$10/day × ${pricing.days} days`, value: pricing.supportCost },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between p-3 rounded-lg bg-muted/50">
                          <div><p className="font-medium">{item.label}</p><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                          <span className="font-semibold">${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Estimated Total</span>
                      <span className="text-3xl font-bold text-primary">${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Approval Status */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              Approval Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CloudAdda</span>
                </div>
                {getApprovalStatusBadge(cloudAddaApproval)}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Company Admin</span>
                </div>
                {getApprovalStatusBadge(companyAdminApproval)}
              </div>
            </div>

            {!approvalRequested && (
              <Button type="button" variant="outline" className="w-full" onClick={onRequestApproval} disabled={!isFormValid}>
                <Send className="mr-2 h-4 w-4" />
                Get Approval
              </Button>
            )}

            {approvalRequested && !isApproved && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-warning/10 border border-warning/20">
                <Clock className="h-4 w-4 text-warning" />
                <span>Waiting for approval...</span>
              </div>
            )}

            {isApproved && (
              <div className="flex items-center gap-2 text-sm text-success p-3 rounded-lg bg-success/10 border border-success/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>All approvals received!</span>
              </div>
            )}

            <Button
              type="submit"
              className={cn("w-full", isApproved ? "btn-gradient" : "")}
              disabled={!isApproved || isSubmitting}
            >
              {isApproved ? (
                <>
                  <Unlock className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating Batch..." : "Create Batch"}
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Approval Required
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}