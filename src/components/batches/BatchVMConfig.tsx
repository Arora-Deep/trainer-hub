import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLabStore } from "@/stores/labStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Server,
  Monitor,
  Layers,
  Users,
  Plus,
  Trash2,
  Cpu,
  HardDrive,
  Timer,
} from "lucide-react";

interface VMTemplate {
  templateId: string;
  instanceName: string;
}

interface BatchVMConfigProps {
  vmType: "single" | "multi";
  setVmType: (v: "single" | "multi") => void;
  vmTemplates: VMTemplate[];
  setVmTemplates: (v: VMTemplate[]) => void;
  participantCount: number;
  setParticipantCount: (v: number) => void;
  adminCount: number;
  setAdminCount: (v: number) => void;
  vmStartDate: Date | undefined;
  setVmStartDate: (v: Date | undefined) => void;
  vmEndDate: Date | undefined;
  setVmEndDate: (v: Date | undefined) => void;
}

export function BatchVMConfig({
  vmType, setVmType,
  vmTemplates, setVmTemplates,
  participantCount, setParticipantCount,
  adminCount, setAdminCount,
  vmStartDate, setVmStartDate,
  vmEndDate, setVmEndDate,
}: BatchVMConfigProps) {
  const { templates, getTemplateById } = useLabStore();

  const handleAddTemplate = () => {
    if (vmTemplates.length < 3) {
      setVmTemplates([...vmTemplates, { templateId: "", instanceName: "" }]);
    }
  };

  const handleRemoveTemplate = (index: number) => {
    if (vmTemplates.length > 1) {
      setVmTemplates(vmTemplates.filter((_, i) => i !== index));
    }
  };

  const handleTemplateChange = (index: number, field: keyof VMTemplate, value: string) => {
    const updated = [...vmTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setVmTemplates(updated);
  };

  const totalVMs = (vmType === "multi" ? vmTemplates.length : 1) * participantCount + adminCount;

  return (
    <div className="space-y-6">
      {/* VM Schedule */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            VM Schedule
          </CardTitle>
          <CardDescription>Set the start and end dates for VM provisioning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>VM Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !vmStartDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vmStartDate ? format(vmStartDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                  <Calendar mode="single" selected={vmStartDate} onSelect={setVmStartDate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>VM End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !vmEndDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {vmEndDate ? format(vmEndDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                  <Calendar mode="single" selected={vmEndDate} onSelect={setVmEndDate} disabled={(d) => d < (vmStartDate || new Date())} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {vmStartDate && vmEndDate && (
            <p className="text-sm text-muted-foreground mt-3">
              Duration: {Math.ceil((vmEndDate.getTime() - vmStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
            </p>
          )}
        </CardContent>
      </Card>

      {/* VM Type Selection */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-info/5">
              <Monitor className="h-5 w-5 text-info" />
            </div>
            VM Configuration
          </CardTitle>
          <CardDescription>Choose between single or multiple VMs per participant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setVmType("single");
                setVmTemplates([{ templateId: vmTemplates[0]?.templateId || "", instanceName: vmTemplates[0]?.instanceName || "" }]);
              }}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                vmType === "single" ? "border-primary bg-primary/10" : "border-border/50 hover:border-border"
              )}
            >
              <Monitor className="h-8 w-8 mb-2 text-primary" />
              <h4 className="font-semibold">Single VM</h4>
              <p className="text-sm text-muted-foreground">One VM per participant</p>
            </button>
            <button
              type="button"
              onClick={() => setVmType("multi")}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                vmType === "multi" ? "border-primary bg-primary/10" : "border-border/50 hover:border-border"
              )}
            >
              <Layers className="h-8 w-8 mb-2 text-primary" />
              <h4 className="font-semibold">Multi VM</h4>
              <p className="text-sm text-muted-foreground">2-3 VMs per participant</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
                  <Server className="h-5 w-5 text-success" />
                </div>
                Template Selection
              </CardTitle>
              <CardDescription>Select templates and define instance names</CardDescription>
            </div>
            {vmType === "multi" && vmTemplates.length < 3 && (
              <Button type="button" variant="outline" size="sm" onClick={handleAddTemplate}>
                <Plus className="mr-2 h-4 w-4" />
                Add VM
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {vmTemplates.map((vm, index) => {
            const selectedTemplate = vm.templateId ? getTemplateById(vm.templateId) : null;
            return (
              <div key={index} className="p-4 rounded-xl border border-border/50 bg-background/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    VM {index + 1} {vmType === "multi" && `of ${vmTemplates.length}`}
                  </span>
                  {vmType === "multi" && vmTemplates.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTemplate(index)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Template *</Label>
                    <Select value={vm.templateId} onValueChange={(value) => handleTemplateChange(index, "templateId", value)}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select template..." />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Instance Name *</Label>
                    <Input
                      placeholder="e.g., Web Server, Database..."
                      value={vm.instanceName}
                      onChange={(e) => handleTemplateChange(index, "instanceName", e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>
                {selectedTemplate && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
                      <Cpu className="h-3 w-3" /> {selectedTemplate.vcpus} vCPU
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
                      <HardDrive className="h-3 w-3" /> {selectedTemplate.memory}GB RAM
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs">
                      <Timer className="h-3 w-3" /> {selectedTemplate.runtimeLimit}min
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Instance Allocation */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5">
              <Users className="h-5 w-5 text-warning" />
            </div>
            Instance Allocation
          </CardTitle>
          <CardDescription>Specify the number of participant and admin instances</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>Number of Participants</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" onClick={() => setParticipantCount(Math.max(1, participantCount - 1))} className="shrink-0">-</Button>
                <Input type="number" min={1} max={500} value={participantCount} onChange={(e) => setParticipantCount(parseInt(e.target.value) || 1)} className="text-center bg-background/50" />
                <Button type="button" variant="outline" size="icon" onClick={() => setParticipantCount(Math.min(500, participantCount + 1))} className="shrink-0">+</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {participantCount * (vmType === "multi" ? vmTemplates.length : 1)} VMs for participants
              </p>
            </div>
            <div className="space-y-3">
              <Label>Number of Admin Instances</Label>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" onClick={() => setAdminCount(Math.max(0, adminCount - 1))} className="shrink-0">-</Button>
                <Input type="number" min={0} max={10} value={adminCount} onChange={(e) => setAdminCount(parseInt(e.target.value) || 0)} className="text-center bg-background/50" />
                <Button type="button" variant="outline" size="icon" onClick={() => setAdminCount(Math.min(10, adminCount + 1))} className="shrink-0">+</Button>
              </div>
              <p className="text-sm text-muted-foreground">For instructors and support staff</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Instances</span>
              <span className="text-lg font-bold text-primary">{totalVMs} VMs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}