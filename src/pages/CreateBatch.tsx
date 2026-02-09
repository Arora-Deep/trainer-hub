import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { useBatchStore, type VMConfig, type VMTemplateConfig } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
import { cn } from "@/lib/utils";
import { format, differenceInDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  CalendarIcon,
  Users,
  Settings,
  FileText,
  Clock,
  Plus,
  X,
  Monitor,
  Building2,
  Laptop,
  Server,
  Layers,
  DollarSign,
  Shield,
  CheckCircle2,
  Eye,
  Send,
  HardDrive,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TemplatePickerGrid } from "@/components/labs/TemplatePickerGrid";

const steps = [
  { id: 1, name: "Basic Info", description: "Batch details", icon: FileText },
  { id: 2, name: "Schedule", description: "Dates & settings", icon: Clock },
  { id: 3, name: "VMs", description: "VM configuration", icon: Monitor },
  { id: 4, name: "Review", description: "Confirm & create", icon: CheckCircle2 },
];

export default function CreateBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();
  const { templates } = useLabStore();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Basic Information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<string[]>([""]);

  // Step 2: Schedule & Settings
  const [published, setPublished] = useState(false);
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(false);
  const [certification, setCertification] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [evaluationEndDate, setEvaluationEndDate] = useState<Date>();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [medium, setMedium] = useState<"online" | "offline" | "hybrid">("online");

  // Step 3: VM Configuration
  const [enableVMs, setEnableVMs] = useState(false);
  const [vmStartDate, setVmStartDate] = useState<Date>();
  const [vmEndDate, setVmEndDate] = useState<Date>();
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [vmTemplates, setVmTemplates] = useState<VMTemplateConfig[]>([{ templateId: "", instanceName: "" }]);

  // Step 4: Approval
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [cloudAddaApproval, setCloudAddaApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [companyAdminApproval, setCompanyAdminApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleAddInstructor = () => setInstructors([...instructors, ""]);
  const handleRemoveInstructor = (index: number) => {
    if (instructors.length > 1) setInstructors(instructors.filter((_, i) => i !== index));
  };
  const handleInstructorChange = (index: number, value: string) => {
    const updated = [...instructors];
    updated[index] = value;
    setInstructors(updated);
  };

  const handleAddVMTemplate = () => {
    if (vmTemplates.length < 3) {
      setVmTemplates([...vmTemplates, { templateId: "", instanceName: "" }]);
    }
  };

  const handleRemoveVMTemplate = (index: number) => {
    if (vmTemplates.length > 1) {
      setVmTemplates(vmTemplates.filter((_, i) => i !== index));
    }
  };

  const handleVMTemplateChange = (index: number, field: keyof VMTemplateConfig, value: string) => {
    const updated = [...vmTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setVmTemplates(updated);
  };

  // Pricing calculation
  const calculatePricing = () => {
    if (!enableVMs || !vmStartDate || !vmEndDate) return { compute: 0, storage: 0, network: 0, support: 0, total: 0, totalVMs: 0, days: 0 };
    const basePrice = 50;
    const totalVMs = (vmType === "multi" ? vmTemplates.length : 1) * seatCount + 1; // +1 for trainer
    const days = Math.ceil((vmEndDate.getTime() - vmStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const compute = totalVMs * basePrice * days;
    const storage = totalVMs * 5 * days;
    const network = totalVMs * 2 * days;
    const support = days * 10;
    return { compute, storage, network, support, total: compute + storage + network + support, totalVMs, days };
  };

  const pricing = calculatePricing();

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    toast({ title: "Approval Requested", description: "Your batch request has been sent for approval." });
    setTimeout(() => {
      setCloudAddaApproval("approved");
      toast({ title: "CloudAdda Approved", description: "CloudAdda has approved your batch request." });
    }, 2000);
    setTimeout(() => {
      setCompanyAdminApproval("approved");
      toast({ title: "Company Admin Approved", description: "Your Company Admin has approved the batch request." });
    }, 4000);
  };

  const isApproved = cloudAddaApproval === "approved" && companyAdminApproval === "approved";

  const canProceed = () => {
    switch (currentStep) {
      case 1: return name.trim() && instructors.some(i => i.trim());
      case 2: return dateRange.from && dateRange.to;
      case 3: return true;
      case 4: return !enableVMs || isApproved;
      default: return true;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enableVMs && !isApproved) {
      toast({ title: "Approval Required", description: "Please wait for approval before creating the batch.", variant: "destructive" });
      return;
    }

    const filteredInstructors = instructors.filter((i) => i.trim());

    let vmConfig: VMConfig | undefined;
    if (enableVMs && vmStartDate && vmEndDate) {
      vmConfig = {
        id: `vm-${Date.now()}`,
        dateRange: { from: vmStartDate.toISOString(), to: vmEndDate.toISOString() },
        vmType,
        vmTemplates,
        trainerVM: { status: "not_provisioned", ipAddress: "", provisionedAt: "" },
        studentVMs: [],
        cloneStatus: "not_cloned",
        pricing: {
          compute: pricing.compute,
          storage: pricing.storage,
          network: pricing.network,
          support: pricing.support,
          total: pricing.total,
        },
        approval: { cloudAdda: cloudAddaApproval, companyAdmin: companyAdminApproval, requested: approvalRequested },
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    }

    const id = addBatch(
      {
        name: name.trim(),
        description: description.trim(),
        instructors: filteredInstructors,
        settings: { published, allowSelfEnrollment, certification },
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
        evaluationEndDate: evaluationEndDate?.toISOString() || dateRange.to?.toISOString() || "",
        additionalDetails: additionalDetails.trim(),
        seatCount,
        medium,
      },
      vmConfig
    );

    toast({ title: "Success", description: "Batch created successfully!" });
    navigate(`/batches/${id}`);
  };

  const getApprovalStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved": return <StatusBadge status="success" label="Approved" />;
      case "rejected": return <StatusBadge status="error" label="Rejected" />;
      default: return <StatusBadge status="warning" label="Pending" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Batch"
        description="Set up a new training batch with VM environments"
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: "Create Batch" },
        ]}
      />

      {/* Progress Steps */}
      <Card>
        <div className="h-1 bg-primary/20">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
        </div>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : currentStep > step.id
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </button>
                  <div className="text-center mt-2">
                    <span className={cn("text-sm font-medium block", currentStep === step.id ? "text-foreground" : "text-muted-foreground")}>
                      {step.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{step.description}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px mx-6">
                    <div className={cn("h-full transition-colors", currentStep > step.id ? "bg-primary" : "bg-border")} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the batch name and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Batch Name *</Label>
                  <Input id="name" placeholder="e.g., AWS Solutions Architect - Batch 13" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Brief description of the batch..." value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Instructors
                </CardTitle>
                <CardDescription>Add one or more instructors for this batch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {instructors.map((instructor, index) => (
                  <div key={index} className="flex gap-2">
                    <Input placeholder="Instructor name" value={instructor} onChange={(e) => handleInstructorChange(index, e.target.value)} />
                    {instructors.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveInstructor(index)} className="shrink-0 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddInstructor} className="w-full border-dashed">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Instructor
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Schedule & Settings */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Calendar Section */}
            <Card>
              <CardContent className="pt-8 pb-6 flex flex-col items-center">
                <div className="text-center mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Choose start date and end date</h2>
                  {dateRange.from && dateRange.to ? (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <p className="text-sm text-muted-foreground">
                        {format(dateRange.from, "MMM d, yyyy")} — {format(dateRange.to, "MMM d, yyyy")} ({differenceInDays(dateRange.to, dateRange.from) + 1} days)
                      </p>
                      <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground h-auto py-0.5 px-1.5" onClick={() => setDateRange({ from: undefined, to: undefined })}>
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Select a start date, then an end date on the calendar</p>
                  )}
                </div>
                <Calendar
                  mode="range"
                  selected={dateRange as DateRange}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  className="p-4 pointer-events-auto"
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </CardContent>
            </Card>

            {/* Additional Options */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Evaluation End Date */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Evaluation End Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !evaluationEndDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {evaluationEndDate ? format(evaluationEndDate, "PPP") : "Optional"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={evaluationEndDate} onSelect={setEvaluationEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Batch Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Batch Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="seatCount">Seat Count</Label>
                    <Input id="seatCount" type="number" min={1} max={500} value={seatCount} onChange={(e) => setSeatCount(parseInt(e.target.value) || 20)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Medium</Label>
                    <Select value={medium} onValueChange={(v) => setMedium(v as typeof medium)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online"><div className="flex items-center gap-2"><Monitor className="h-4 w-4" />Online</div></SelectItem>
                        <SelectItem value="offline"><div className="flex items-center gap-2"><Building2 className="h-4 w-4" />Offline</div></SelectItem>
                        <SelectItem value="hybrid"><div className="flex items-center gap-2"><Laptop className="h-4 w-4" />Hybrid</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Published</Label>
                      <p className="text-xs text-muted-foreground">Make visible</p>
                    </div>
                    <Switch checked={published} onCheckedChange={setPublished} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Self Enrollment</Label>
                      <p className="text-xs text-muted-foreground">Students can enroll</p>
                    </div>
                    <Switch checked={allowSelfEnrollment} onCheckedChange={setAllowSelfEnrollment} />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Certification</Label>
                      <p className="text-xs text-muted-foreground">Issue on completion</p>
                    </div>
                    <Switch checked={certification} onCheckedChange={setCertification} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: VM Configuration */}
        {currentStep === 3 && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Enable VMs Toggle */}
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Virtual Machines</h3>
                        <p className="text-sm text-muted-foreground">Enable VM environments for this batch</p>
                      </div>
                    </div>
                    <Switch checked={enableVMs} onCheckedChange={setEnableVMs} />
                  </div>
                </CardContent>
              </Card>

              {enableVMs && (
                <>
                  {/* VM Date Range */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        VM Schedule
                      </CardTitle>
                      <CardDescription>Set when VMs should be available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>VM Start Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !vmStartDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {vmStartDate ? format(vmStartDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={vmStartDate} onSelect={setVmStartDate} className="p-3 pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>VM End Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button type="button" variant="outline" className={cn("w-full justify-start text-left font-normal", !vmEndDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {vmEndDate ? format(vmEndDate, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={vmEndDate} onSelect={setVmEndDate} className="p-3 pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* VM Type Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        VM Type
                      </CardTitle>
                      <CardDescription>Choose how many VMs each participant gets</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => { setVmType("single"); setVmTemplates([{ templateId: "", instanceName: "" }]); }}
                          className={cn(
                            "p-5 rounded-xl border-2 text-left transition-all",
                            vmType === "single" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          )}
                        >
                          <Monitor className="h-6 w-6 mb-2 text-primary" />
                          <h4 className="font-semibold">Single VM</h4>
                          <p className="text-xs text-muted-foreground mt-1">One VM per participant</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVmType("multi")}
                          className={cn(
                            "p-5 rounded-xl border-2 text-left transition-all",
                            vmType === "multi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                          )}
                        >
                          <Layers className="h-6 w-6 mb-2 text-primary" />
                          <h4 className="font-semibold">Multi VM</h4>
                          <p className="text-xs text-muted-foreground mt-1">2-3 VMs per participant</p>
                        </button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Template Selection */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Server className="h-4 w-4 text-primary" />
                            VM Templates
                          </CardTitle>
                          <CardDescription>Select template and name your instances</CardDescription>
                        </div>
                        {vmType === "multi" && vmTemplates.length < 3 && (
                          <Button type="button" variant="outline" size="sm" onClick={handleAddVMTemplate}>
                            <Plus className="mr-1 h-3 w-3" /> Add VM
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {vmTemplates.map((vm, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border bg-muted/10 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {index + 1}
                              </div>
                              VM Configuration
                            </span>
                            {vmType === "multi" && vmTemplates.length > 1 && (
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveVMTemplate(index)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs">Select Template</Label>
                            <TemplatePickerGrid
                              templates={templates}
                              selectedId={vm.templateId}
                              onSelect={(template) => handleVMTemplateChange(index, "templateId", template.id)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Instance Name</Label>
                            <Input placeholder="e.g., Web Server, Database, etc." value={vm.instanceName} onChange={(e) => handleVMTemplateChange(index, "instanceName", e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Pricing Sidebar */}
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Cost Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!enableVMs ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Monitor className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium">No VMs configured</p>
                      <p className="text-xs">Enable VMs to see pricing</p>
                    </div>
                  ) : (
                    <>
                      {vmStartDate && vmEndDate && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div>
                              <p className="text-xs text-muted-foreground">VMs</p>
                              <p className="text-lg font-bold">{pricing.totalVMs}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Days</p>
                              <p className="text-lg font-bold">{pricing.days}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Type</p>
                              <p className="text-lg font-bold capitalize">{vmType}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><Server className="h-3.5 w-3.5" /> Compute</span>
                          <span className="font-medium">${pricing.compute.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><HardDrive className="h-3.5 w-3.5" /> Storage</span>
                          <span className="font-medium">${pricing.storage.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Network</span>
                          <span className="font-medium">${pricing.network.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 rounded-lg bg-muted/30 text-sm">
                          <span className="text-muted-foreground flex items-center gap-2"><Shield className="h-3.5 w-3.5" /> Support</span>
                          <span className="font-medium">${pricing.support.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total</span>
                          <span className="text-2xl font-bold text-primary">${pricing.total.toFixed(0)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 4: Review & Create */}
        {currentStep === 4 && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Batch Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch Name</p>
                      <p className="font-semibold mt-1 truncate">{name}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Instructors</p>
                      <p className="font-semibold mt-1 truncate">{instructors.filter(i => i.trim()).join(", ") || "None"}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                      <p className="font-semibold mt-1">{dateRange.from && dateRange.to ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}` : "Not set"}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Seat Count</p>
                      <p className="font-semibold mt-1">{seatCount} seats</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Medium</p>
                      <p className="font-semibold mt-1 capitalize">{medium}</p>
                    </div>
                    <div className={cn("p-4 rounded-lg border", enableVMs ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border/50")}>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">VMs</p>
                      <p className="font-semibold mt-1">{enableVMs ? `${pricing.totalVMs} VMs` : "None"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {enableVMs && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-primary" />
                      VM Configuration
                    </CardTitle>
                    <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View Breakdown</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Pricing Breakdown</DialogTitle>
                          <DialogDescription>Detailed cost breakdown for VM infrastructure</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 py-4">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Total VMs:</span><span className="font-medium">{pricing.totalVMs}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Duration:</span><span className="font-medium">{pricing.days} days</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Compute:</span><span className="font-medium">${pricing.compute.toFixed(0)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Storage:</span><span className="font-medium">${pricing.storage.toFixed(0)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Network:</span><span className="font-medium">${pricing.network.toFixed(0)}</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Support:</span><span className="font-medium">${pricing.support.toFixed(0)}</span></div>
                          </div>
                          <div className="border-t pt-3 flex justify-between items-center">
                            <span className="font-semibold">Grand Total</span>
                            <span className="text-2xl font-bold text-primary">${pricing.total.toFixed(0)}</span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10">
                          <Monitor className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{vmType === "multi" ? `${vmTemplates.length} VMs per participant` : "Single VM per participant"}</p>
                          <p className="text-sm text-muted-foreground">
                            {pricing.totalVMs} total VMs • {pricing.days} days
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary">${pricing.total.toFixed(0)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Approval & Actions */}
            <div className="space-y-6">
              {enableVMs && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Approval Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <Server className={cn("h-4 w-4", cloudAddaApproval === "approved" ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-medium text-sm">CloudAdda</span>
                      </div>
                      {getApprovalStatusBadge(cloudAddaApproval)}
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <Building2 className={cn("h-4 w-4", companyAdminApproval === "approved" ? "text-primary" : "text-muted-foreground")} />
                        <span className="font-medium text-sm">Company Admin</span>
                      </div>
                      {getApprovalStatusBadge(companyAdminApproval)}
                    </div>

                    {!approvalRequested && (
                      <Button type="button" onClick={handleRequestApproval} className="w-full" variant="outline">
                        <Send className="mr-2 h-4 w-4" />
                        Request Approval
                      </Button>
                    )}

                    {approvalRequested && !isApproved && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground flex items-center gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        <span>Waiting for approvals...</span>
                      </div>
                    )}

                    {isApproved && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-primary flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>All approvals received!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {enableVMs && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      Total Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-primary">${pricing.total.toFixed(0)}</span>
                      <p className="text-sm text-muted-foreground mt-1">{pricing.totalVMs} VMs for {pricing.days} days</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button type="button" variant="outline" size="lg" onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate("/batches")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

          {currentStep < 4 ? (
            <Button type="button" size="lg" onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceed()}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={enableVMs && !isApproved}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Batch
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
