import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLabStore } from "@/stores/labStore";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Server, 
  Monitor, 
  Layers, 
  Users, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText,
  Plus,
  Trash2,
  Eye,
  Send,
  Lock,
  Unlock,
  Building2,
  Cloud,
  DollarSign,
  Cpu,
  HardDrive,
  Timer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface VMTemplate {
  templateId: string;
  instanceName: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export default function CreateLab() {
  const navigate = useNavigate();
  const { templates, addLab, getTemplateById } = useLabStore();
  const { toast } = useToast();

  // Form State
  const [labName, setLabName] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [vmTemplates, setVmTemplates] = useState<VMTemplate[]>([{ templateId: "", instanceName: "" }]);
  const [participantCount, setParticipantCount] = useState(10);
  const [adminCount, setAdminCount] = useState(1);
  
  // Approval State
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [cloudAddaApproval, setCloudAddaApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [companyAdminApproval, setCompanyAdminApproval] = useState<"pending" | "approved" | "rejected">("pending");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Handlers
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

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    toast({
      title: "Approval Requested",
      description: "Your lab request has been sent for approval to CloudAdda and your Company Admin.",
    });
    
    // Simulate approval process (in reality, this would be an API call)
    setTimeout(() => {
      setCloudAddaApproval("approved");
      toast({
        title: "CloudAdda Approved",
        description: "CloudAdda has approved your lab request.",
      });
    }, 3000);
    
    setTimeout(() => {
      setCompanyAdminApproval("approved");
      toast({
        title: "Company Admin Approved",
        description: "Your Company Admin has approved the lab request.",
      });
    }, 5000);
  };

  const isFormValid = labName && dateRange.from && dateRange.to && vmTemplates.every(t => t.templateId && t.instanceName);
  const isApproved = cloudAddaApproval === "approved" && companyAdminApproval === "approved";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isApproved) {
      toast({
        title: "Approval Required",
        description: "Please wait for approval from both CloudAdda and Company Admin.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const primaryTemplate = getTemplateById(vmTemplates[0].templateId);
    
    // Create instances based on participant count
    const instances = Array.from({ length: participantCount }, (_, index) => ({
      id: `inst-${Date.now()}-${index}`,
      studentName: `Participant ${index + 1}`,
      studentEmail: `participant${index + 1}@example.com`,
      status: "provisioning" as const,
      startedAt: "Just now",
      timeRemaining: `${primaryTemplate?.runtimeLimit || 60} min`,
      cpu: 0,
      memory: 0,
      ipAddress: "Pending...",
    }));

    addLab({
      name: labName,
      description: description || `Lab running from ${dateRange.from ? format(dateRange.from, "PPP") : ""} to ${dateRange.to ? format(dateRange.to, "PPP") : ""}`,
      templateId: vmTemplates[0].templateId,
      templateName: primaryTemplate?.name || "",
      batchName: "General",
      status: "active",
      instanceCount: participantCount + adminCount,
      instances,
    });

    toast({
      title: "Lab created successfully",
      description: `Lab "${labName}" created with ${participantCount} participant instances and ${adminCount} admin instances.`,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/labs");
    }, 500);
  };

  // Pricing calculations (placeholder - user will provide logic later)
  const calculatePricing = () => {
    const basePrice = 50; // Base price per VM per day
    const totalVMs = (vmType === "multi" ? vmTemplates.length : 1) * participantCount + adminCount;
    const days = dateRange.from && dateRange.to 
      ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;
    
    const vmCost = totalVMs * basePrice * days;
    const storageCost = totalVMs * 5 * days; // $5 storage per VM per day
    const networkCost = totalVMs * 2 * days; // $2 network per VM per day
    const supportCost = days * 10; // $10 per day for support
    
    return {
      vmCost,
      storageCost,
      networkCost,
      supportCost,
      totalVMs,
      days,
      total: vmCost + storageCost + networkCost + supportCost,
    };
  };

  const pricing = calculatePricing();

  const getApprovalStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return <StatusBadge status="success" label="Approved" pulse />;
      case "rejected":
        return <StatusBadge status="error" label="Rejected" />;
      default:
        return <StatusBadge status="warning" label="Pending" pulse={approvalRequested} />;
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Create Lab"
        description="Provision lab instances for your training session"
        breadcrumbs={[
          { label: "Labs", href: "/labs" },
          { label: "Create Lab" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/labs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Labs
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Basic Information
                </CardTitle>
                <CardDescription>Provide lab details and schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="labName">Lab Name *</Label>
                  <Input
                    id="labName"
                    placeholder="e.g., AWS EC2 Fundamentals Workshop"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the lab purpose and objectives..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lab Duration *</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "PPP") : "Start Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal bg-background/50",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "PPP") : "End Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                          disabled={(date) => date < (dateRange.from || new Date())}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {dateRange.from && dateRange.to && (
                    <p className="text-sm text-muted-foreground">
                      Duration: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* VM Configuration */}
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
                      setVmTemplates([{ templateId: "", instanceName: "" }]);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all",
                      vmType === "single"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-border"
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
                      vmType === "multi"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-border"
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTemplate(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Template *</Label>
                          <Select
                            value={vm.templateId}
                            onValueChange={(value) => handleTemplateChange(index, "templateId", value)}
                          >
                            <SelectTrigger className="bg-background/50">
                              <SelectValue placeholder="Select template..." />
                            </SelectTrigger>
                            <SelectContent className="bg-background border z-50">
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
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

            {/* Participant & Admin Count */}
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
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}
                        className="shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        value={participantCount}
                        onChange={(e) => setParticipantCount(parseInt(e.target.value) || 1)}
                        className="text-center bg-background/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setParticipantCount(Math.min(500, participantCount + 1))}
                        className="shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {participantCount * (vmType === "multi" ? vmTemplates.length : 1)} VMs for participants
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Number of Admin Instances</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setAdminCount(Math.max(0, adminCount - 1))}
                        className="shrink-0"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={adminCount}
                        onChange={(e) => setAdminCount(parseInt(e.target.value) || 0)}
                        className="text-center bg-background/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setAdminCount(Math.min(10, adminCount + 1))}
                        className="shrink-0"
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For instructors and support staff
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Instances</span>
                    <span className="text-lg font-bold text-primary">
                      {pricing.totalVMs} VMs
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
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
                    <span className="text-muted-foreground">Lab Name</span>
                    <span className="font-medium truncate max-w-[150px]">{labName || "Not set"}</span>
                  </div>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    * Final pricing may vary based on actual usage
                  </p>
                </div>

                <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details & Breakdown
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Lab Pricing Breakdown</DialogTitle>
                      <DialogDescription>Detailed breakdown of all costs and components</DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Lab Configuration */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Lab Configuration
                        </h4>
                        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Lab Name</p>
                            <p className="font-medium">{labName || "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Duration</p>
                            <p className="font-medium">{pricing.days > 0 ? `${pricing.days} days` : "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Start Date</p>
                            <p className="font-medium">{dateRange.from ? format(dateRange.from, "PPP") : "Not set"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">End Date</p>
                            <p className="font-medium">{dateRange.to ? format(dateRange.to, "PPP") : "Not set"}</p>
                          </div>
                        </div>
                      </div>

                      {/* VM Configuration */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Server className="h-4 w-4" /> VM Configuration
                        </h4>
                        <div className="space-y-2">
                          {vmTemplates.map((vm, index) => {
                            const template = vm.templateId ? getTemplateById(vm.templateId) : null;
                            return (
                              <div key={index} className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
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
                      </div>

                      {/* Instance Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4" /> Instance Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Participant Instances</p>
                            <p className="font-medium">{participantCount * (vmType === "multi" ? vmTemplates.length : 1)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Admin Instances</p>
                            <p className="font-medium">{adminCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">VMs per Participant</p>
                            <p className="font-medium">{vmType === "multi" ? vmTemplates.length : 1}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Total VMs</p>
                            <p className="font-medium">{pricing.totalVMs}</p>
                          </div>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <DollarSign className="h-4 w-4" /> Cost Breakdown
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">Compute Cost</p>
                              <p className="text-sm text-muted-foreground">${pricing.totalVMs} VMs × $50/day × {pricing.days} days</p>
                            </div>
                            <span className="font-semibold">${pricing.vmCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">Storage Cost</p>
                              <p className="text-sm text-muted-foreground">${pricing.totalVMs} VMs × $5/day × {pricing.days} days</p>
                            </div>
                            <span className="font-semibold">${pricing.storageCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">Network Cost</p>
                              <p className="text-sm text-muted-foreground">${pricing.totalVMs} VMs × $2/day × {pricing.days} days</p>
                            </div>
                            <span className="font-semibold">${pricing.networkCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <p className="font-medium">Support Cost</p>
                              <p className="text-sm text-muted-foreground">$10/day × {pricing.days} days</p>
                            </div>
                            <span className="font-semibold">${pricing.supportCost.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Total */}
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleRequestApproval}
                    disabled={!isFormValid}
                  >
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
                  className={cn(
                    "w-full",
                    isApproved ? "btn-gradient" : ""
                  )}
                  disabled={!isApproved || isSubmitting}
                >
                  {isApproved ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Creating Lab..." : "Create Lab"}
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
      </form>
    </div>
  );
}
