import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useBatchStore, type VMConfig, type VMTemplateConfig, type VMEntry } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
import { useCustomerStore } from "@/stores/customerStore";
import { useRoleStore, canViewPricing } from "@/stores/roleStore";
import { VMDaySchedule, type DaySchedule } from "@/components/batches/VMDaySchedule";
import { TemplatePickerDropdown } from "@/components/labs/TemplatePickerDropdown";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { format, differenceInDays, eachDayOfInterval, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "@/hooks/use-toast";
import {
  Building2, FileText, Clock, Monitor, CheckCircle2,
  Users, Settings, Layers, Server, DollarSign, Shield, Eye, Sparkles,
  Send, HardDrive, Trash2, ArrowRight, ArrowLeft, Plus, X, Zap, Laptop,
  Lock, Network,
} from "lucide-react";

const steps = [
  { id: 1, name: "Customer", description: "Pick customer", icon: Building2 },
  { id: 2, name: "Basic Info", description: "Batch details", icon: FileText },
  { id: 3, name: "Schedule", description: "Dates & settings", icon: Clock },
  { id: 4, name: "VMs", description: "VM configuration", icon: Monitor },
  { id: 5, name: "Review", description: "Confirm & create", icon: CheckCircle2 },
];

const regions = [
  { value: "ap-south-1", label: "ap-south-1 (Mumbai)" },
  { value: "us-east-1", label: "us-east-1 (Virginia)" },
  { value: "eu-west-1", label: "eu-west-1 (Ireland)" },
  { value: "ap-southeast-1", label: "ap-southeast-1 (Singapore)" },
];

export default function AdminCreateBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();
  const { templates } = useLabStore();
  const { customers } = useCustomerStore();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const presetCustomerId = params.get("customerId") || "";

  const [currentStep, setCurrentStep] = useState(presetCustomerId ? 2 : 1);

  // Step 1
  const [customerId, setCustomerId] = useState(presetCustomerId);

  // Step 2
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<string[]>([""]);
  const [region, setRegion] = useState("ap-south-1");
  const [tags, setTags] = useState("");
  const [costCenter, setCostCenter] = useState("");

  // Step 3
  const [published, setPublished] = useState(false);
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(false);
  const [certification, setCertification] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [medium, setMedium] = useState<"online" | "offline" | "hybrid">("online");
  const [prepDays, setPrepDays] = useState(2);
  const [autoExtend, setAutoExtend] = useState(false);

  // Delivery mode
  const [deliveryMode, setDeliveryMode] = useState<"live" | "self-paced">("live");
  const [accessModel, setAccessModel] = useState<"full-course" | "lesson-unlock">("full-course");
  const [totalAccessHours, setTotalAccessHours] = useState(120);
  const [estimatedEnrollment, setEstimatedEnrollment] = useState(20);

  // Step 4
  const [enableVMs, setEnableVMs] = useState(true);
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [vmTemplates, setVmTemplates] = useState<VMTemplateConfig[]>([{ templateId: "", instanceName: "" }]);
  const [vmDateRange, setVmDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [vmDailySchedules, setVmDailySchedules] = useState<DaySchedule[]>([]);
  const [addedVMs, setAddedVMs] = useState<VMEntry[]>([]);
  const [vmCpu, setVmCpu] = useState(4);
  const [vmRam, setVmRam] = useState(8);
  const [vmDisk, setVmDisk] = useState(50);
  const [skipApproval, setSkipApproval] = useState(true);

  // Advanced VM options
  const [enableVLAN, setEnableVLAN] = useState(false);
  const [vlanId, setVlanId] = useState("100");
  const [enableQemu, setEnableQemu] = useState(true);
  const [enableNestedVirt, setEnableNestedVirt] = useState(false);

  // RBAC: pricing visibility
  const adminSubRole = useRoleStore((s) => s.adminSubRole);
  const showPricing = canViewPricing(adminSubRole);

  // Step 5 approval
  const [cloudAddaApproval, setCloudAddaApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [companyAdminApproval, setCompanyAdminApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const selectedCustomer = customers.find((c) => c.id === customerId);

  const calculatePricing = () => {
    if (!enableVMs || addedVMs.length === 0) return { compute: 0, storage: 0, network: 0, support: 0, total: 0, totalVMs: 0, days: 0 };
    const basePrice = 50;
    const totalVMs = addedVMs.length * seatCount + 1;
    const totalDays = addedVMs.reduce((sum, vm) => {
      const from = new Date(vm.dateRange.from);
      const to = new Date(vm.dateRange.to);
      return sum + Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }, 0);
    const compute = totalVMs * basePrice * totalDays;
    const storage = totalVMs * 5 * totalDays;
    const network = totalVMs * 2 * totalDays;
    const support = totalDays * 10;
    return { compute, storage, network, support, total: compute + storage + network + support, totalVMs, days: totalDays };
  };
  const pricing = calculatePricing();

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!customerId;
      case 2: return name.trim() && instructors.some((i) => i.trim());
      case 3: return dateRange.from && dateRange.to;
      case 4: return !enableVMs || addedVMs.length > 0;
      case 5: return !enableVMs || skipApproval || (cloudAddaApproval === "approved" && companyAdminApproval === "approved");
      default: return true;
    }
  };

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    toast({ title: "Approval Requested" });
    setTimeout(() => { setCloudAddaApproval("approved"); toast({ title: "CloudAdda Approved" }); }, 1500);
    setTimeout(() => { setCompanyAdminApproval("approved"); toast({ title: "Company Admin Approved" }); }, 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredInstructors = instructors.filter((i) => i.trim());

    let vmConfig: VMConfig | undefined;
    if (enableVMs && addedVMs.length > 0) {
      const firstVM = addedVMs[0];
      const lastVM = addedVMs[addedVMs.length - 1];
      vmConfig = {
        id: `vm-${Date.now()}`,
        dateRange: { from: firstVM.dateRange.from, to: lastVM.dateRange.to },
        vmType: firstVM.vmType,
        vmTemplates: addedVMs.map((vm) => ({ templateId: vm.templateId, instanceName: vm.instanceName })),
        vmEntries: addedVMs,
        trainerVM: { status: "not_provisioned", ipAddress: "", provisionedAt: "", consoleUrl: "", credentials: { username: "root", password: "", sshPort: 22 } },
        participantVMs: [],
        snapshots: [],
        cloneStatus: "not_cloned",
        pricing: { compute: pricing.compute, storage: pricing.storage, network: pricing.network, support: pricing.support, total: pricing.total },
        approval: {
          cloudAdda: skipApproval ? "approved" : cloudAddaApproval,
          companyAdmin: skipApproval ? "approved" : companyAdminApproval,
          requested: skipApproval || approvalRequested,
        },
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
    }

    const description2 = description.trim() + (selectedCustomer ? `\n\nCustomer: ${selectedCustomer.name} • Region: ${region}${tags ? ` • Tags: ${tags}` : ""}${costCenter ? ` • Cost Center: ${costCenter}` : ""}` : "");

    const id = addBatch(
      {
        name: name.trim(),
        description: description2,
        instructors: filteredInstructors,
        settings: { published, allowSelfEnrollment, certification },
        startDate: dateRange.from?.toISOString() || "",
        endDate: dateRange.to?.toISOString() || "",
        evaluationEndDate: dateRange.to?.toISOString() || "",
        additionalDetails: additionalDetails.trim(),
        seatCount: deliveryMode === "self-paced" ? 0 : seatCount,
        medium,
        deliveryMode,
        accessModel: deliveryMode === "self-paced" ? accessModel : undefined,
        totalAccessHours: deliveryMode === "self-paced" && accessModel === "full-course" ? totalAccessHours : undefined,
        enrollmentMode: deliveryMode === "self-paced" ? "floating" : "fixed",
      },
      vmConfig
    );

    toast({ title: "Batch Created", description: `${name} created for ${selectedCustomer?.name || "customer"}.` });
    navigate(`/admin/batches/${id}`);
  };

  const getApprovalStatusBadge = (status: "pending" | "approved" | "rejected") => {
    if (status === "approved") return <StatusBadge status="success" label="Approved" />;
    if (status === "rejected") return <StatusBadge status="error" label="Rejected" />;
    return <StatusBadge status="warning" label="Pending" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Batch"
        description="Provision a new training batch on behalf of a customer"
        breadcrumbs={[{ label: "Batches", href: "/admin/batches" }, { label: "Create Batch" }]}
      />

      <Card>
        <div className="h-1 bg-primary/10 overflow-hidden">
          <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${(currentStep / steps.length) * 100}%` }} transition={{ duration: 0.4 }} />
        </div>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      currentStep === step.id ? "bg-primary text-primary-foreground"
                        : currentStep > step.id ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                  </button>
                  <div className="text-center mt-2">
                    <span className={cn("text-xs font-medium block", currentStep === step.id ? "text-foreground" : "text-muted-foreground")}>{step.name}</span>
                    <span className="text-[10px] text-muted-foreground">{step.description}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn("flex-1 h-px mx-4", currentStep > step.id ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* Step 1: Customer */}
          {currentStep === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Select Customer</CardTitle>
                  <CardDescription>Pick the customer this batch is being provisioned for</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={customerId} onValueChange={setCustomerId}>
                    <SelectTrigger><SelectValue placeholder="Search and select customer..." /></SelectTrigger>
                    <SelectContent>
                      {customers.filter((c) => c.status === "active" || c.status === "trial").map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            {c.name}
                            <Badge variant="secondary" className="text-[10px] capitalize">{c.status}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedCustomer && (
                    <div className="p-4 rounded-xl border bg-muted/30 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Plan</p><p className="font-medium capitalize">{selectedCustomer.plan}</p></div>
                      <div><p className="text-xs text-muted-foreground">SLA</p><p className="font-medium capitalize">{selectedCustomer.slaTier}</p></div>
                      <div><p className="text-xs text-muted-foreground">Active Batches</p><p className="font-medium">{selectedCustomer.activeBatches}</p></div>
                      <div><p className="text-xs text-muted-foreground">Quota CPU</p><p className="font-medium">{selectedCustomer.quota.cpu} vCPU</p></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Basic */}
          {currentStep === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Delivery Mode</CardTitle>
                  <CardDescription>How will participants experience this batch?</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button type="button" onClick={() => setDeliveryMode("live")} className={cn("p-4 rounded-xl border-2 text-left transition-all", deliveryMode === "live" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                    <div className="flex items-center gap-2 mb-1.5"><Users className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">Live Instructor-led</span></div>
                    <p className="text-xs text-muted-foreground">Scheduled sessions, fixed seats, classroom-style VMs.</p>
                  </button>
                  <button type="button" onClick={() => setDeliveryMode("self-paced")} className={cn("p-4 rounded-xl border-2 text-left transition-all", deliveryMode === "self-paced" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                    <div className="flex items-center gap-2 mb-1.5"><Clock className="h-4 w-4 text-primary" /><span className="font-semibold text-sm">Self-paced</span></div>
                    <p className="text-xs text-muted-foreground">Floating enrolment, hour-based VM access.</p>
                  </button>
                </CardContent>
              </Card>
              {deliveryMode === "self-paced" && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Self-paced settings</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Access model</Label>
                      <Select value={accessModel} onValueChange={(v) => setAccessModel(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-course">Full-course access</SelectItem>
                          <SelectItem value="lesson-unlock">Lesson-based unlock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {accessModel === "full-course" && (
                      <div className="space-y-2"><Label>Total hours / learner</Label>
                        <Input type="number" min={1} value={totalAccessHours} onChange={(e) => setTotalAccessHours(parseInt(e.target.value) || 120)} />
                      </div>
                    )}
                    <div className="space-y-2"><Label>Estimated enrolment</Label>
                      <Input type="number" min={1} value={estimatedEnrollment} onChange={(e) => setEstimatedEnrollment(parseInt(e.target.value) || 0)} />
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Basic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Batch Name *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. K8s Batch #15" /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[100px]" /></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Instructors</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {instructors.map((inst, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={inst} placeholder="Instructor name" onChange={(e) => { const next = [...instructors]; next[idx] = e.target.value; setInstructors(next); }} />
                        {instructors.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" onClick={() => setInstructors(instructors.filter((_, i) => i !== idx))}><X className="h-4 w-4" /></Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="w-full border-dashed" onClick={() => setInstructors([...instructors, ""])}>
                      <Plus className="mr-2 h-4 w-4" /> Add Instructor
                    </Button>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Admin Options</CardTitle><CardDescription>Internal placement and tagging</CardDescription></CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2"><Label>Region</Label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{regions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label>Tags</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="enterprise, q1-2026" /></div>
                    <div className="space-y-2"><Label>Internal Cost Center</Label><Input value={costCenter} onChange={(e) => setCostCenter(e.target.value)} placeholder="CC-1234" /></div>
                  </CardContent>
                </Card>
              </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Schedule */}
          {currentStep === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-8 pb-6 flex flex-col items-center">
                    <div className="text-center mb-6">
                      <h2 className="text-lg font-semibold">Choose start and end date</h2>
                      {dateRange.from && dateRange.to ? (
                        <p className="text-sm text-muted-foreground mt-2">
                          {format(dateRange.from, "MMM d, yyyy")} — {format(dateRange.to, "MMM d, yyyy")} ({differenceInDays(dateRange.to, dateRange.from) + 1} days)
                          {dateRange.from && <> · Prep VM available from <strong>{format(subDays(dateRange.from, prepDays), "MMM d")}</strong></>}
                        </p>
                      ) : <p className="text-sm text-muted-foreground mt-1">Select start, then end</p>}
                    </div>
                    <Calendar mode="range" selected={dateRange as DateRange} onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })} numberOfMonths={2} className="p-4 pointer-events-auto" />
                  </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Batch Details</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5"><Label>Seat Count</Label><Input type="number" min={1} max={500} value={seatCount} onChange={(e) => setSeatCount(parseInt(e.target.value) || 20)} /></div>
                      <div className="space-y-1.5"><Label>Medium</Label>
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
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Admin Schedule</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-1.5"><Label>Prep Period (days)</Label><Input type="number" min={0} max={14} value={prepDays} onChange={(e) => setPrepDays(parseInt(e.target.value) || 0)} /></div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border">
                        <div><Label className="text-sm">Auto-extend</Label><p className="text-xs text-muted-foreground">Extend if VMs in use at end</p></div>
                        <Switch checked={autoExtend} onCheckedChange={setAutoExtend} />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /> Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Published</Label><Switch checked={published} onCheckedChange={setPublished} /></div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Self Enrollment</Label><Switch checked={allowSelfEnrollment} onCheckedChange={setAllowSelfEnrollment} /></div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border"><Label className="text-sm">Certification</Label><Switch checked={certification} onCheckedChange={setCertification} /></div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Additional Details</CardTitle></CardHeader>
                  <CardContent><Textarea value={additionalDetails} onChange={(e) => setAdditionalDetails(e.target.value)} placeholder="Internal notes, SLAs, special arrangements..." className="min-h-[80px]" /></CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {/* Step 4: VMs */}
          {currentStep === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="py-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10"><Monitor className="h-5 w-5 text-primary" /></div>
                        <div><h3 className="font-semibold">Virtual Machines</h3><p className="text-sm text-muted-foreground">Enable VM environments</p></div>
                      </div>
                      <Switch checked={enableVMs} onCheckedChange={setEnableVMs} />
                    </CardContent>
                  </Card>

                  {enableVMs && (
                    <>
                      {addedVMs.length > 0 && (
                        <Card>
                          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> Added VMs ({addedVMs.length})</CardTitle></CardHeader>
                          <CardContent className="space-y-3">
                            {addedVMs.map((vm, idx) => {
                              const tpl = templates.find((t) => t.id === vm.templateId);
                              return (
                                <div key={vm.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{idx + 1}</div>
                                    <div>
                                      <p className="font-semibold text-sm">{vm.instanceName || "Unnamed VM"}</p>
                                      <p className="text-xs text-muted-foreground">{tpl?.name || "No template"} • {format(new Date(vm.dateRange.from), "MMM d")} – {format(new Date(vm.dateRange.to), "MMM d, yyyy")}</p>
                                    </div>
                                  </div>
                                  <Button type="button" variant="ghost" size="icon" onClick={() => setAddedVMs(addedVMs.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              );
                            })}
                          </CardContent>
                        </Card>
                      )}

                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /> VM Type</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <button type="button" onClick={() => setVmType("single")} className={cn("p-5 rounded-xl border-2 text-left", vmType === "single" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                            <Monitor className="h-6 w-6 mb-2 text-primary" />
                            <h4 className="font-semibold">Single VM</h4>
                            <p className="text-xs text-muted-foreground mt-1">One VM per participant</p>
                          </button>
                          <button type="button" onClick={() => setVmType("multi")} className={cn("p-5 rounded-xl border-2 text-left", vmType === "multi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/40")}>
                            <Layers className="h-6 w-6 mb-2 text-primary" />
                            <h4 className="font-semibold">Multi VM</h4>
                            <p className="text-xs text-muted-foreground mt-1">2-3 VMs per participant</p>
                          </button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> VM Template</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <Label className="text-xs">Select Template</Label>
                            <TemplatePickerDropdown templates={templates} selectedId={vmTemplates[0]?.templateId || ""} onSelect={(t) => { const next = [...vmTemplates]; next[0] = { ...next[0], templateId: t.id }; setVmTemplates(next); setVmCpu(t.vcpus); setVmRam(t.memory); setVmDisk(t.storage); }} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Instance Name</Label>
                            <Input placeholder="e.g. Web Server" value={vmTemplates[0]?.instanceName || ""} onChange={(e) => { const next = [...vmTemplates]; next[0] = { ...next[0], instanceName: e.target.value }; setVmTemplates(next); }} />
                          </div>
                          <div className="grid grid-cols-3 gap-3 border-t pt-4">
                            <div className="space-y-1"><Label className="text-xs">vCPU Override</Label><Input type="number" value={vmCpu} onChange={(e) => setVmCpu(parseInt(e.target.value) || 1)} /></div>
                            <div className="space-y-1"><Label className="text-xs">RAM (GB)</Label><Input type="number" value={vmRam} onChange={(e) => setVmRam(parseInt(e.target.value) || 1)} /></div>
                            <div className="space-y-1"><Label className="text-xs">Disk (GB)</Label><Input type="number" value={vmDisk} onChange={(e) => setVmDisk(parseInt(e.target.value) || 10)} /></div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-8 pb-6 flex flex-col items-center">
                          <div className="text-center mb-6">
                            <h2 className="text-lg font-semibold">VM availability dates</h2>
                            {vmDateRange.from && vmDateRange.to ? (
                              <p className="text-sm text-muted-foreground mt-2">{format(vmDateRange.from, "MMM d")} — {format(vmDateRange.to, "MMM d, yyyy")} ({differenceInDays(vmDateRange.to, vmDateRange.from) + 1} days)</p>
                            ) : <p className="text-sm text-muted-foreground mt-1">Pick a date range</p>}
                          </div>
                          <Calendar mode="range" selected={vmDateRange as DateRange} onSelect={(range) => setVmDateRange({ from: range?.from, to: range?.to })} numberOfMonths={2} className="p-4 pointer-events-auto" />
                        </CardContent>
                      </Card>

                      {vmDateRange.from && vmDateRange.to && (
                        <VMDaySchedule dateRange={{ from: vmDateRange.from, to: vmDateRange.to }} dailySchedules={vmDailySchedules} onChange={setVmDailySchedules} />
                      )}

                      <Button type="button" size="lg" className="w-full" disabled={!vmDateRange.from || !vmDateRange.to || !vmTemplates[0]?.templateId} onClick={() => {
                        const days = eachDayOfInterval({ start: vmDateRange.from!, end: vmDateRange.to! });
                        const finalSchedules = days.map((d) => {
                          const dateStr = format(d, "yyyy-MM-dd");
                          return vmDailySchedules.find((s) => s.date === dateStr) || { date: dateStr, startTime: "09:00", endTime: "18:00" };
                        });
                        const newVM: VMEntry = {
                          id: `vme-${Date.now()}`,
                          templateId: vmTemplates[0]?.templateId || "",
                          instanceName: vmTemplates[0]?.instanceName || "",
                          vmType,
                          dateRange: { from: vmDateRange.from!.toISOString(), to: vmDateRange.to!.toISOString() },
                          dailySchedules: finalSchedules,
                        };
                        setAddedVMs([...addedVMs, newVM]);
                        setVmTemplates([{ templateId: "", instanceName: "" }]);
                        setVmDateRange({ from: undefined, to: undefined });
                        setVmDailySchedules([]);
                        toast({ title: "VM Added", description: newVM.instanceName || "VM added" });
                      }}>
                        <Plus className="mr-2 h-4 w-4" /> Add VM
                      </Button>
                    </>
                  )}
                </div>

                <div>
                  <Card className="sticky top-6">
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-4 w-4 text-primary" /> Cost Estimate</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {!enableVMs || addedVMs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground"><Monitor className="h-12 w-12 mx-auto mb-3 opacity-30" /><p className="text-sm">Add VMs to see pricing</p></div>
                      ) : (
                        <>
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 grid grid-cols-3 gap-3 text-center">
                            <div><p className="text-xs text-muted-foreground">VMs</p><p className="text-lg font-bold">{pricing.totalVMs}</p></div>
                            <div><p className="text-xs text-muted-foreground">Days</p><p className="text-lg font-bold">{pricing.days}</p></div>
                            <div><p className="text-xs text-muted-foreground">Type</p><p className="text-lg font-bold capitalize">{vmType}</p></div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between p-2 rounded-lg bg-muted/30 text-sm"><span>Compute</span><span className="font-medium">${pricing.compute.toFixed(0)}</span></div>
                            <div className="flex justify-between p-2 rounded-lg bg-muted/30 text-sm"><span>Storage</span><span className="font-medium">${pricing.storage.toFixed(0)}</span></div>
                            <div className="flex justify-between p-2 rounded-lg bg-muted/30 text-sm"><span>Network</span><span className="font-medium">${pricing.network.toFixed(0)}</span></div>
                            <div className="flex justify-between p-2 rounded-lg bg-muted/30 text-sm"><span>Support</span><span className="font-medium">${pricing.support.toFixed(0)}</span></div>
                          </div>
                          <div className="border-t pt-3 flex justify-between items-center"><span className="font-semibold">Total</span><span className="text-2xl font-bold text-primary">${pricing.total.toFixed(0)}</span></div>
                        </>
                      )}
                      <div className="border-t pt-3 flex items-center justify-between">
                        <div><Label className="text-sm">Skip Approval</Label><p className="text-xs text-muted-foreground">Admin override</p></div>
                        <Switch checked={skipApproval} onCheckedChange={setSkipApproval} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Batch Summary</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Customer</p><p className="font-semibold mt-1 truncate">{selectedCustomer?.name}</p></div>
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Batch</p><p className="font-semibold mt-1 truncate">{name}</p></div>
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Region</p><p className="font-semibold mt-1">{region}</p></div>
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Duration</p><p className="font-semibold mt-1">{dateRange.from && dateRange.to ? `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d")}` : "—"}</p></div>
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Seats</p><p className="font-semibold mt-1">{seatCount}</p></div>
                      <div className="p-4 rounded-lg bg-muted/30 border"><p className="text-xs text-muted-foreground uppercase">Instructors</p><p className="font-semibold mt-1 truncate">{instructors.filter((i) => i.trim()).join(", ") || "—"}</p></div>
                    </CardContent>
                  </Card>

                  {enableVMs && addedVMs.length > 0 && (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2"><Monitor className="h-4 w-4 text-primary" /> VM Configuration</CardTitle>
                        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                          <DialogTrigger asChild><Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Breakdown</Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Pricing Breakdown</DialogTitle><DialogDescription>Detailed cost</DialogDescription></DialogHeader>
                            <div className="space-y-2 py-4 text-sm">
                              <div className="flex justify-between"><span>VMs</span><span>{pricing.totalVMs}</span></div>
                              <div className="flex justify-between"><span>Days</span><span>{pricing.days}</span></div>
                              <div className="flex justify-between"><span>Compute</span><span>${pricing.compute.toFixed(0)}</span></div>
                              <div className="flex justify-between"><span>Storage</span><span>${pricing.storage.toFixed(0)}</span></div>
                              <div className="flex justify-between"><span>Network</span><span>${pricing.network.toFixed(0)}</span></div>
                              <div className="flex justify-between"><span>Support</span><span>${pricing.support.toFixed(0)}</span></div>
                              <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-primary">${pricing.total.toFixed(0)}</span></div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border">
                          <div>
                            <p className="font-semibold">{vmType === "multi" ? `${addedVMs.length} VMs per participant` : "Single VM per participant"}</p>
                            <p className="text-sm text-muted-foreground">{pricing.totalVMs} total • {pricing.days} days</p>
                          </div>
                          <span className="text-lg font-bold text-primary">${pricing.total.toFixed(0)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div>
                  {enableVMs && !skipApproval && (
                    <Card>
                      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Approval</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"><span className="text-sm">CloudAdda</span>{getApprovalStatusBadge(cloudAddaApproval)}</div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"><span className="text-sm">Company Admin</span>{getApprovalStatusBadge(companyAdminApproval)}</div>
                        {!approvalRequested && (
                          <Button type="button" className="w-full" onClick={handleRequestApproval}><Send className="mr-2 h-4 w-4" /> Request Approval</Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {skipApproval && (
                    <Card><CardContent className="p-4 text-sm text-muted-foreground flex items-start gap-2"><Zap className="h-4 w-4 text-amber-500 mt-0.5" /> Admin override active. Batch will be created immediately without approval.</CardContent></Card>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between pt-6 mt-6 border-t">
          <Button type="button" variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          {currentStep < steps.length ? (
            <Button type="button" disabled={!canProceed()} onClick={() => setCurrentStep(currentStep + 1)}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={!canProceed()} className="gap-2">
              <CheckCircle2 className="h-4 w-4" /> Create Batch
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
