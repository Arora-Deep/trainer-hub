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
import { useBatchStore, type LabConfig, type VMTemplateConfig } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
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
  FlaskConical,
  Server,
  Layers,
  DollarSign,
  Shield,
  CheckCircle2,
  Eye,
  Send,
  Cpu,
  HardDrive,
  Timer,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/ui/StatusBadge";

const steps = [
  { id: 1, name: "Batch Details", icon: FileText },
  { id: 2, name: "Schedule & Settings", icon: Clock },
  { id: 3, name: "Lab Configuration", icon: FlaskConical },
  { id: 4, name: "Review & Create", icon: CheckCircle2 },
];

interface LabConfigForm {
  name: string;
  description: string;
  dateRange: { from: Date | undefined; to: Date | undefined };
  vmType: "single" | "multi";
  vmTemplates: VMTemplateConfig[];
  participantCount: number;
  adminCount: number;
}

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
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [evaluationEndDate, setEvaluationEndDate] = useState<Date>();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [medium, setMedium] = useState<"online" | "offline" | "hybrid">("online");

  // Step 3: Lab Configuration
  const [labConfigs, setLabConfigs] = useState<LabConfigForm[]>([]);
  const [currentLabForm, setCurrentLabForm] = useState<LabConfigForm>({
    name: "",
    description: "",
    dateRange: { from: undefined, to: undefined },
    vmType: "single",
    vmTemplates: [{ templateId: "", instanceName: "" }],
    participantCount: 10,
    adminCount: 1,
  });

  // Step 4: Approval
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [cloudAddaApproval, setCloudAddaApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [companyAdminApproval, setCompanyAdminApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleAddInstructor = () => {
    setInstructors([...instructors, ""]);
  };

  const handleRemoveInstructor = (index: number) => {
    if (instructors.length > 1) {
      setInstructors(instructors.filter((_, i) => i !== index));
    }
  };

  const handleInstructorChange = (index: number, value: string) => {
    const updated = [...instructors];
    updated[index] = value;
    setInstructors(updated);
  };

  // Lab config handlers
  const handleAddVMTemplate = () => {
    if (currentLabForm.vmTemplates.length < 3) {
      setCurrentLabForm({
        ...currentLabForm,
        vmTemplates: [...currentLabForm.vmTemplates, { templateId: "", instanceName: "" }],
      });
    }
  };

  const handleRemoveVMTemplate = (index: number) => {
    if (currentLabForm.vmTemplates.length > 1) {
      setCurrentLabForm({
        ...currentLabForm,
        vmTemplates: currentLabForm.vmTemplates.filter((_, i) => i !== index),
      });
    }
  };

  const handleVMTemplateChange = (index: number, field: keyof VMTemplateConfig, value: string) => {
    const updated = [...currentLabForm.vmTemplates];
    updated[index] = { ...updated[index], [field]: value };
    setCurrentLabForm({ ...currentLabForm, vmTemplates: updated });
  };

  const handleAddLabConfig = () => {
    if (!currentLabForm.name || !currentLabForm.dateRange.from || !currentLabForm.dateRange.to) {
      toast({ title: "Error", description: "Please fill in all required lab fields", variant: "destructive" });
      return;
    }
    if (!currentLabForm.vmTemplates.every(t => t.templateId && t.instanceName)) {
      toast({ title: "Error", description: "Please complete all VM template configurations", variant: "destructive" });
      return;
    }
    setLabConfigs([...labConfigs, currentLabForm]);
    setCurrentLabForm({
      name: "",
      description: "",
      dateRange: { from: undefined, to: undefined },
      vmType: "single",
      vmTemplates: [{ templateId: "", instanceName: "" }],
      participantCount: 10,
      adminCount: 1,
    });
    toast({ title: "Lab Added", description: "Lab configuration added to batch" });
  };

  const handleRemoveLabConfig = (index: number) => {
    setLabConfigs(labConfigs.filter((_, i) => i !== index));
  };

  // Pricing calculation
  const calculateLabPricing = (lab: LabConfigForm) => {
    const basePrice = 50;
    const totalVMs = (lab.vmType === "multi" ? lab.vmTemplates.length : 1) * lab.participantCount + lab.adminCount;
    const days = lab.dateRange.from && lab.dateRange.to
      ? Math.ceil((lab.dateRange.to.getTime() - lab.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

    const compute = totalVMs * basePrice * days;
    const storage = totalVMs * 5 * days;
    const network = totalVMs * 2 * days;
    const support = days * 10;

    return { compute, storage, network, support, total: compute + storage + network + support, totalVMs, days };
  };

  const totalPricing = labConfigs.reduce(
    (acc, lab) => {
      const pricing = calculateLabPricing(lab);
      return {
        compute: acc.compute + pricing.compute,
        storage: acc.storage + pricing.storage,
        network: acc.network + pricing.network,
        support: acc.support + pricing.support,
        total: acc.total + pricing.total,
      };
    },
    { compute: 0, storage: 0, network: 0, support: 0, total: 0 }
  );

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    toast({
      title: "Approval Requested",
      description: "Your batch request has been sent for approval.",
    });

    // Simulate approvals
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
      case 1:
        return name.trim() && instructors.some(i => i.trim());
      case 2:
        return startDate && endDate;
      case 3:
        return true; // Labs are optional
      case 4:
        return labConfigs.length === 0 || isApproved;
      default:
        return true;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (labConfigs.length > 0 && !isApproved) {
      toast({ title: "Approval Required", description: "Please wait for approval before creating the batch.", variant: "destructive" });
      return;
    }

    const filteredInstructors = instructors.filter((i) => i.trim());

    // Convert lab configs to the store format
    const formattedLabConfigs: LabConfig[] = labConfigs.map((lab, index) => {
      const pricing = calculateLabPricing(lab);
      return {
        id: `lc-${Date.now()}-${index}`,
        name: lab.name,
        description: lab.description,
        dateRange: {
          from: lab.dateRange.from?.toISOString() || "",
          to: lab.dateRange.to?.toISOString() || "",
        },
        vmType: lab.vmType,
        vmTemplates: lab.vmTemplates,
        participantCount: lab.participantCount,
        adminCount: lab.adminCount,
        pricing: {
          compute: pricing.compute,
          storage: pricing.storage,
          network: pricing.network,
          support: pricing.support,
          total: pricing.total,
        },
        approval: {
          cloudAdda: cloudAddaApproval,
          companyAdmin: companyAdminApproval,
          requested: approvalRequested,
        },
        status: isApproved ? "approved" : "draft",
        instances: [],
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    });

    const id = addBatch(
      {
        name: name.trim(),
        description: description.trim(),
        instructors: filteredInstructors,
        settings: { published, allowSelfEnrollment, certification },
        startDate: startDate?.toISOString() || "",
        endDate: endDate?.toISOString() || "",
        evaluationEndDate: evaluationEndDate?.toISOString() || endDate?.toISOString() || "",
        additionalDetails: additionalDetails.trim(),
        seatCount,
        medium,
      },
      formattedLabConfigs
    );

    toast({ title: "Success", description: "Batch created successfully!" });
    navigate(`/batches/${id}`);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6 animate-in-up">
      {/* Decorative orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="orb w-[600px] h-[600px] bg-primary/20 top-[-200px] right-[-200px]" />
        <div className="orb w-[400px] h-[400px] bg-info/15 bottom-[-100px] left-[-100px]" />
      </div>

      <PageHeader
        title="Create Batch"
        description="Set up a new training batch with labs and resources"
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: "Create Batch" },
        ]}
      />

      {/* Progress Steps */}
      <Card className="glass-card border-white/10">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                      currentStep === step.id
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                        : currentStep > step.id
                        ? "bg-success/20 text-success border-2 border-success/30"
                        : "bg-muted/50 text-muted-foreground border border-border/50"
                    )}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </motion.button>
                  <span className={cn(
                    "text-xs mt-2 font-medium",
                    currentStep === step.id ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    currentStep > step.id ? "bg-success/50" : "bg-border/50"
                  )} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Batch Details */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid gap-6 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      Basic Information
                    </CardTitle>
                    <CardDescription>Enter the batch name and description</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Batch Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., AWS Solutions Architect - Batch 13"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the batch..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-background/50 min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="glass-card border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-info/5">
                        <Users className="h-4 w-4 text-info" />
                      </div>
                      Instructors
                    </CardTitle>
                    <CardDescription>Add one or more instructors for this batch</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {instructors.map((instructor, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Instructor name"
                          value={instructor}
                          onChange={(e) => handleInstructorChange(index, e.target.value)}
                          className="bg-background/50"
                        />
                        {instructors.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveInstructor(index)}
                            className="shrink-0 text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddInstructor}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Instructor
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Schedule & Settings */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid gap-6 lg:grid-cols-2"
            >
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
                        <Clock className="h-4 w-4 text-success" />
                      </div>
                      Date and Time
                    </CardTitle>
                    <CardDescription>Set the batch schedule and evaluation period</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Start Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Select start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>End Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Select end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Evaluation End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-background/50",
                              !evaluationEndDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {evaluationEndDate ? format(evaluationEndDate, "PPP") : "Select evaluation end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={evaluationEndDate}
                            onSelect={setEvaluationEndDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5">
                        <Settings className="h-4 w-4 text-warning" />
                      </div>
                      Settings
                    </CardTitle>
                    <CardDescription>Configure batch visibility and enrollment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Published</Label>
                        <p className="text-xs text-muted-foreground">Make visible to students</p>
                      </div>
                      <Switch checked={published} onCheckedChange={setPublished} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Self Enrollment</Label>
                        <p className="text-xs text-muted-foreground">Students can enroll</p>
                      </div>
                      <Switch checked={allowSelfEnrollment} onCheckedChange={setAllowSelfEnrollment} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Certification</Label>
                        <p className="text-xs text-muted-foreground">Issue on completion</p>
                      </div>
                      <Switch checked={certification} onCheckedChange={setCertification} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      Batch Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seatCount">Seat Count</Label>
                      <Input
                        id="seatCount"
                        type="number"
                        min={1}
                        max={500}
                        value={seatCount}
                        onChange={(e) => setSeatCount(parseInt(e.target.value) || 20)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Medium</Label>
                      <Select value={medium} onValueChange={(v) => setMedium(v as typeof medium)}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border z-50">
                          <SelectItem value="online">
                            <div className="flex items-center gap-2">
                              <Monitor className="h-4 w-4" />
                              Online
                            </div>
                          </SelectItem>
                          <SelectItem value="offline">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              Offline
                            </div>
                          </SelectItem>
                          <SelectItem value="hybrid">
                            <div className="flex items-center gap-2">
                              <Laptop className="h-4 w-4" />
                              Hybrid
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Lab Configuration */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid gap-6 lg:grid-cols-3"
            >
              {/* Lab Configuration Form */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        Add Lab Configuration
                      </CardTitle>
                      <CardDescription>Configure hands-on lab environments for this batch</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Basic Lab Info */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Lab Name *</Label>
                          <Input
                            placeholder="e.g., AWS EC2 Fundamentals"
                            value={currentLabForm.name}
                            onChange={(e) => setCurrentLabForm({ ...currentLabForm, name: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            placeholder="Brief description..."
                            value={currentLabForm.description}
                            onChange={(e) => setCurrentLabForm({ ...currentLabForm, description: e.target.value })}
                            className="bg-background/50"
                          />
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-background/50",
                                !currentLabForm.dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentLabForm.dateRange.from ? format(currentLabForm.dateRange.from, "PPP") : "Lab Start Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-background border z-50">
                            <Calendar
                              mode="single"
                              selected={currentLabForm.dateRange.from}
                              onSelect={(date) => setCurrentLabForm({ ...currentLabForm, dateRange: { ...currentLabForm.dateRange, from: date } })}
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
                                !currentLabForm.dateRange.to && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {currentLabForm.dateRange.to ? format(currentLabForm.dateRange.to, "PPP") : "Lab End Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-background border z-50">
                            <Calendar
                              mode="single"
                              selected={currentLabForm.dateRange.to}
                              onSelect={(date) => setCurrentLabForm({ ...currentLabForm, dateRange: { ...currentLabForm.dateRange, to: date } })}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* VM Type */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentLabForm({
                              ...currentLabForm,
                              vmType: "single",
                              vmTemplates: [{ templateId: "", instanceName: "" }],
                            });
                          }}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            currentLabForm.vmType === "single"
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-border"
                          )}
                        >
                          <Monitor className="h-6 w-6 mb-2 text-primary" />
                          <h4 className="font-semibold">Single VM</h4>
                          <p className="text-xs text-muted-foreground">One VM per participant</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentLabForm({ ...currentLabForm, vmType: "multi" })}
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            currentLabForm.vmType === "multi"
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-border"
                          )}
                        >
                          <Layers className="h-6 w-6 mb-2 text-primary" />
                          <h4 className="font-semibold">Multi VM</h4>
                          <p className="text-xs text-muted-foreground">2-3 VMs per participant</p>
                        </button>
                      </div>

                      {/* Template Selection */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>VM Templates</Label>
                          {currentLabForm.vmType === "multi" && currentLabForm.vmTemplates.length < 3 && (
                            <Button type="button" variant="outline" size="sm" onClick={handleAddVMTemplate}>
                              <Plus className="mr-1 h-3 w-3" /> Add VM
                            </Button>
                          )}
                        </div>
                        {currentLabForm.vmTemplates.map((vm, index) => {
                          const selectedTemplate = vm.templateId ? templates.find(t => t.id === vm.templateId) : null;
                          return (
                            <div key={index} className="p-4 rounded-xl border border-border/50 bg-background/30 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">VM {index + 1}</span>
                                {currentLabForm.vmType === "multi" && currentLabForm.vmTemplates.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveVMTemplate(index)}
                                    className="text-muted-foreground hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid gap-3 sm:grid-cols-2">
                                <Select
                                  value={vm.templateId}
                                  onValueChange={(value) => handleVMTemplateChange(index, "templateId", value)}
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
                                <Input
                                  placeholder="Instance name (e.g., Web Server)"
                                  value={vm.instanceName}
                                  onChange={(e) => handleVMTemplateChange(index, "instanceName", e.target.value)}
                                  className="bg-background/50"
                                />
                              </div>
                              {selectedTemplate && (
                                <div className="flex flex-wrap gap-2">
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
                      </div>

                      {/* Instance Counts */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Number of Participants</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentLabForm({ ...currentLabForm, participantCount: Math.max(1, currentLabForm.participantCount - 1) })}
                            >-</Button>
                            <Input
                              type="number"
                              min={1}
                              max={500}
                              value={currentLabForm.participantCount}
                              onChange={(e) => setCurrentLabForm({ ...currentLabForm, participantCount: parseInt(e.target.value) || 1 })}
                              className="text-center bg-background/50"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentLabForm({ ...currentLabForm, participantCount: Math.min(500, currentLabForm.participantCount + 1) })}
                            >+</Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Admin Instances</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentLabForm({ ...currentLabForm, adminCount: Math.max(0, currentLabForm.adminCount - 1) })}
                            >-</Button>
                            <Input
                              type="number"
                              min={0}
                              max={10}
                              value={currentLabForm.adminCount}
                              onChange={(e) => setCurrentLabForm({ ...currentLabForm, adminCount: parseInt(e.target.value) || 0 })}
                              className="text-center bg-background/50"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentLabForm({ ...currentLabForm, adminCount: Math.min(10, currentLabForm.adminCount + 1) })}
                            >+</Button>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddLabConfig}
                        className="w-full bg-gradient-to-r from-primary to-primary/80"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lab to Batch
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Added Labs List */}
                {labConfigs.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="glass-card border-white/10">
                      <CardHeader>
                        <CardTitle className="text-base">Added Labs ({labConfigs.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {labConfigs.map((lab, index) => {
                          const pricing = calculateLabPricing(lab);
                          return (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <FlaskConical className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{lab.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {pricing.totalVMs} VMs • {pricing.days} days • ${pricing.total.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveLabConfig(index)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Pricing Sidebar */}
              <motion.div variants={itemVariants}>
                <Card className="glass-card border-white/10 sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                      Total Pricing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {labConfigs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No labs configured yet</p>
                        <p className="text-xs">Add labs to see pricing</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Labs</span>
                            <span className="font-medium">{labConfigs.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Compute</span>
                            <span className="font-medium">${totalPricing.compute.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Storage</span>
                            <span className="font-medium">${totalPricing.storage.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Network</span>
                            <span className="font-medium">${totalPricing.network.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Support</span>
                            <span className="font-medium">${totalPricing.support.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total</span>
                            <span className="text-2xl font-bold text-primary">${totalPricing.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid gap-6 lg:grid-cols-3"
            >
              <div className="lg:col-span-2 space-y-6">
                {/* Batch Summary */}
                <motion.div variants={itemVariants}>
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        Batch Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Batch Name</p>
                          <p className="font-medium">{name}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Instructors</p>
                          <p className="font-medium">{instructors.filter(i => i.trim()).join(", ")}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium">
                            {startDate && endDate
                              ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`
                              : "Not set"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Seat Count</p>
                          <p className="font-medium">{seatCount} seats</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Medium</p>
                          <p className="font-medium capitalize">{medium}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Labs Configured</p>
                          <p className="font-medium">{labConfigs.length} labs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Labs Summary */}
                {labConfigs.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="glass-card border-white/10">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Lab Configurations</CardTitle>
                        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-4 w-4" />
                              View Full Breakdown
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Complete Pricing Breakdown</DialogTitle>
                              <DialogDescription>Detailed breakdown of all labs and costs</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              {labConfigs.map((lab, index) => {
                                const pricing = calculateLabPricing(lab);
                                return (
                                  <div key={index} className="space-y-3 p-4 rounded-xl bg-muted/30">
                                    <h4 className="font-semibold">{lab.name}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <span className="text-muted-foreground">Duration:</span>{" "}
                                        <span className="font-medium">{pricing.days} days</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Total VMs:</span>{" "}
                                        <span className="font-medium">{pricing.totalVMs}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Compute:</span>{" "}
                                        <span className="font-medium">${pricing.compute.toFixed(2)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Storage:</span>{" "}
                                        <span className="font-medium">${pricing.storage.toFixed(2)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Network:</span>{" "}
                                        <span className="font-medium">${pricing.network.toFixed(2)}</span>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Support:</span>{" "}
                                        <span className="font-medium">${pricing.support.toFixed(2)}</span>
                                      </div>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                      <span className="font-semibold">Lab Total</span>
                                      <span className="font-bold text-primary">${pricing.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold text-lg">Grand Total</span>
                                  <span className="text-3xl font-bold text-primary">${totalPricing.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {labConfigs.map((lab, index) => {
                          const pricing = calculateLabPricing(lab);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <FlaskConical className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{lab.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {pricing.totalVMs} VMs • {pricing.days} days
                                  </p>
                                </div>
                              </div>
                              <span className="font-semibold">${pricing.total.toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Approval & Actions */}
              <motion.div variants={itemVariants} className="space-y-6">
                {labConfigs.length > 0 && (
                  <Card className="glass-card border-white/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                          <Shield className="h-5 w-5 text-primary" />
                        </div>
                        Approval Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
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

                      {!approvalRequested && (
                        <Button
                          type="button"
                          onClick={handleRequestApproval}
                          className="w-full"
                          variant="outline"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Request Approval
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card className="glass-card border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
                        <DollarSign className="h-5 w-5 text-success" />
                      </div>
                      Total Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <span className="text-4xl font-bold text-primary">
                        ${totalPricing.total.toFixed(2)}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {labConfigs.length} labs configured
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate("/batches")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentStep === 1 ? "Cancel" : "Previous"}
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={labConfigs.length > 0 && !isApproved}
              className="bg-gradient-to-r from-success to-success/80 shadow-lg shadow-success/30"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Create Batch
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}