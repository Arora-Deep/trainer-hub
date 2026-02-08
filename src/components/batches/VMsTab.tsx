import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useLabStore } from "@/stores/labStore";
import { useBatchStore, type Batch } from "@/stores/batchStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Server,
  Monitor,
  Terminal,
  Copy,
  CheckCircle2,
  Clock,
  Cpu,
  HardDrive,
  Layers,
  Play,
} from "lucide-react";

interface VMsTabProps {
  batch: Batch;
}

export function VMsTab({ batch }: VMsTabProps) {
  const { getTemplateById } = useLabStore();
  const { updateVMConfig } = useBatchStore();
  const [provisioningAdmin, setProvisioningAdmin] = useState(false);
  const [cloningVMs, setCloningVMs] = useState(false);

  const vmConfig = batch.vmConfig;

  const handleProvisionAdmin = () => {
    setProvisioningAdmin(true);
    toast({ title: "Provisioning Admin VM", description: "Setting up the admin VM for trainer configuration..." });
    setTimeout(() => {
      setProvisioningAdmin(false);
      updateVMConfig(batch.id, { adminVmProvisioned: true });
      toast({ title: "Admin VM Ready", description: "Admin VM has been provisioned. You can now launch the console." });
    }, 3000);
  };

  const handleLaunchConsole = () => {
    toast({ title: "Launching Console", description: "Opening VM console in a new window..." });
  };

  const handleCloneForBatch = () => {
    setCloningVMs(true);
    toast({ title: "Cloning VMs", description: "Cloning trainer VM configuration for all participants..." });
    setTimeout(() => {
      setCloningVMs(false);
      updateVMConfig(batch.id, { adminVmCloned: true });
      toast({ title: "VMs Cloned", description: "All participant VMs have been created from the trainer VM." });
    }, 4000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (!vmConfig) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Server className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold">No VM Configuration</h3>
            <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
              This batch was created without VM provisioning. Edit the batch to add VM configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVMs = (vmConfig.vmType === "multi" ? vmConfig.templates.length : 1) * vmConfig.participantCount + vmConfig.adminCount;

  return (
    <div className="space-y-6">
      {/* VM Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVMs}</p>
              <p className="text-xs text-muted-foreground">Total VMs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Layers className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold capitalize">{vmConfig.vmType}</p>
              <p className="text-xs text-muted-foreground">VM Type</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Clock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold">{formatDate(vmConfig.vmStartDate)}</p>
              <p className="text-xs text-muted-foreground">VM Start Date</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold">{formatDate(vmConfig.vmEndDate)}</p>
              <p className="text-xs text-muted-foreground">VM End Date</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            VM Templates
          </CardTitle>
          <CardDescription>Templates assigned to this batch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {vmConfig.templates.map((vm, index) => {
            const template = vm.templateId ? getTemplateById(vm.templateId) : null;
            return (
              <div key={index} className="p-4 rounded-xl border border-border/50 bg-muted/20 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold">{vm.instanceName || `VM ${index + 1}`}</p>
                  <p className="text-sm text-muted-foreground">
                    {template ? template.name : "Unknown template"}
                  </p>
                  {template && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-xs">
                        <Cpu className="h-3 w-3" /> {template.vcpus} vCPU
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-xs">
                        <HardDrive className="h-3 w-3" /> {template.memory}GB RAM
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    × {vmConfig.participantCount + (index === 0 ? vmConfig.adminCount : 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">instances</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Admin VM Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            Admin VM Workflow
          </CardTitle>
          <CardDescription>Provision, configure, and clone VMs for the batch</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Provision Admin VM */}
          <div className="flex items-start gap-4 p-4 rounded-xl border border-border/50">
            <div className={`p-2 rounded-full ${vmConfig.adminVmProvisioned ? "bg-success/20" : "bg-muted"}`}>
              {vmConfig.adminVmProvisioned ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center text-sm font-bold text-muted-foreground">1</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Provision Admin VM</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Spin up an admin VM using the selected template so the trainer can configure it.
              </p>
              {vmConfig.adminVmProvisioned ? (
                <StatusBadge status="success" label="Provisioned" className="mt-2" />
              ) : (
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={handleProvisionAdmin}
                  disabled={provisioningAdmin}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {provisioningAdmin ? "Provisioning..." : "Provision Admin VM"}
                </Button>
              )}
            </div>
          </div>

          {/* Step 2: Launch Console & Configure */}
          <div className={`flex items-start gap-4 p-4 rounded-xl border border-border/50 ${!vmConfig.adminVmProvisioned ? "opacity-50" : ""}`}>
            <div className={`p-2 rounded-full ${vmConfig.adminVmProvisioned && vmConfig.adminVmCloned ? "bg-success/20" : vmConfig.adminVmProvisioned ? "bg-primary/20" : "bg-muted"}`}>
              {vmConfig.adminVmCloned ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center text-sm font-bold text-muted-foreground">2</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Configure via Console</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Launch the VM console to install software, configure settings, and prepare the environment for students.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={handleLaunchConsole}
                disabled={!vmConfig.adminVmProvisioned}
              >
                <Terminal className="mr-2 h-4 w-4" />
                Launch Console
              </Button>
            </div>
          </div>

          {/* Step 3: Clone for Batch */}
          <div className={`flex items-start gap-4 p-4 rounded-xl border border-border/50 ${!vmConfig.adminVmProvisioned ? "opacity-50" : ""}`}>
            <div className={`p-2 rounded-full ${vmConfig.adminVmCloned ? "bg-success/20" : "bg-muted"}`}>
              {vmConfig.adminVmCloned ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <span className="flex h-5 w-5 items-center justify-center text-sm font-bold text-muted-foreground">3</span>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Clone Trainer VM for Batch</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Once the admin VM is configured, clone it for all {vmConfig.participantCount} participants.
                This creates identical VMs with the trainer's configuration.
              </p>
              {vmConfig.adminVmCloned ? (
                <div className="mt-2">
                  <StatusBadge status="success" label={`${vmConfig.participantCount} VMs Cloned`} />
                </div>
              ) : (
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={handleCloneForBatch}
                  disabled={!vmConfig.adminVmProvisioned || cloningVMs}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {cloningVMs ? "Cloning VMs..." : "Clone for Batch"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}