import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";
import {
  FileText,
  Server,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BatchBasicInfo } from "@/components/batches/BatchBasicInfo";
import { BatchVMConfig } from "@/components/batches/BatchVMConfig";
import { BatchReview } from "@/components/batches/BatchReview";

interface VMTemplate {
  templateId: string;
  instanceName: string;
}

const steps = [
  { id: 1, label: "Batch Info", icon: FileText },
  { id: 2, label: "VM Configuration", icon: Server },
  { id: 3, label: "Review & Approve", icon: CheckCircle2 },
];

export default function CreateBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();
  const [step, setStep] = useState(1);

  // Step 1 - Basic Info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<string[]>([""]);
  const [published, setPublished] = useState(false);
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(false);
  const [certification, setCertification] = useState(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [evaluationEndDate, setEvaluationEndDate] = useState<Date>();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [medium, setMedium] = useState<"online" | "offline" | "hybrid">("online");

  // Step 2 - VM Config
  const [vmType, setVmType] = useState<"single" | "multi">("single");
  const [vmTemplates, setVmTemplates] = useState<VMTemplate[]>([{ templateId: "", instanceName: "" }]);
  const [participantCount, setParticipantCount] = useState(10);
  const [adminCount, setAdminCount] = useState(1);
  const [vmStartDate, setVmStartDate] = useState<Date>();
  const [vmEndDate, setVmEndDate] = useState<Date>();

  // Step 3 - Approval
  const [approvalRequested, setApprovalRequested] = useState(false);
  const [cloudAddaApproval, setCloudAddaApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [companyAdminApproval, setCompanyAdminApproval] = useState<"pending" | "approved" | "rejected">("pending");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing
  const calculatePricing = () => {
    const basePrice = 50;
    const totalVMs = (vmType === "multi" ? vmTemplates.length : 1) * participantCount + adminCount;
    const days = vmStartDate && vmEndDate
      ? Math.ceil((vmEndDate.getTime() - vmStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;
    const vmCost = totalVMs * basePrice * days;
    const storageCost = totalVMs * 5 * days;
    const networkCost = totalVMs * 2 * days;
    const supportCost = days * 10;
    return { vmCost, storageCost, networkCost, supportCost, totalVMs, days, total: vmCost + storageCost + networkCost + supportCost };
  };

  const pricing = calculatePricing();
  const isApproved = cloudAddaApproval === "approved" && companyAdminApproval === "approved";

  const isStep1Valid = name.trim() && startDate && endDate && instructors.some(i => i.trim());
  const isStep2Valid = vmStartDate && vmEndDate && vmTemplates.every(t => t.templateId && t.instanceName);
  const isFormValid = isStep1Valid && isStep2Valid;

  const handleRequestApproval = () => {
    setApprovalRequested(true);
    toast({ title: "Approval Requested", description: "Request sent to CloudAdda and Company Admin." });
    setTimeout(() => {
      setCloudAddaApproval("approved");
      toast({ title: "CloudAdda Approved", description: "CloudAdda has approved your batch." });
    }, 3000);
    setTimeout(() => {
      setCompanyAdminApproval("approved");
      toast({ title: "Company Admin Approved", description: "Company Admin has approved the batch." });
    }, 5000);
  };

  const handleNext = () => {
    if (step === 1 && !isStep1Valid) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    if (step === 2 && !isStep2Valid) {
      toast({ title: "Error", description: "Please complete VM configuration.", variant: "destructive" });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApproved) {
      toast({ title: "Approval Required", description: "Please wait for both approvals.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const filteredInstructors = instructors.filter((i) => i.trim());
    const id = addBatch({
      name: name.trim(),
      description: description.trim(),
      instructors: filteredInstructors,
      settings: { published, allowSelfEnrollment, certification },
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
      evaluationEndDate: evaluationEndDate?.toISOString() || endDate!.toISOString(),
      additionalDetails: additionalDetails.trim(),
      seatCount,
      medium,
      vmConfig: {
        vmType,
        templates: vmTemplates,
        participantCount,
        adminCount,
        vmStartDate: vmStartDate!.toISOString(),
        vmEndDate: vmEndDate!.toISOString(),
        adminVmProvisioned: false,
        adminVmCloned: false,
        approvalStatus: {
          requested: true,
          cloudAdda: "approved",
          companyAdmin: "approved",
        },
      },
    });

    toast({ title: "Success", description: "Batch created successfully with VM configuration!" });
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/batches/${id}`);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Create Batch"
        description="Set up a new training batch with VM provisioning"
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: "Create Batch" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/batches")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Batches
          </Button>
        }
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (s.id < step) setStep(s.id);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                step === s.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : step > s.id
                  ? "bg-success/20 text-success cursor-pointer"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s.id ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              {s.label}
            </button>
            {idx < steps.length - 1 && (
              <div className={cn("w-12 h-0.5 rounded-full", step > s.id ? "bg-success" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <BatchBasicInfo
            name={name} setName={setName}
            description={description} setDescription={setDescription}
            instructors={instructors} setInstructors={setInstructors}
            published={published} setPublished={setPublished}
            allowSelfEnrollment={allowSelfEnrollment} setAllowSelfEnrollment={setAllowSelfEnrollment}
            certification={certification} setCertification={setCertification}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
            evaluationEndDate={evaluationEndDate} setEvaluationEndDate={setEvaluationEndDate}
            additionalDetails={additionalDetails} setAdditionalDetails={setAdditionalDetails}
            seatCount={seatCount} setSeatCount={setSeatCount}
            medium={medium} setMedium={setMedium}
          />
        )}

        {/* Step 2: VM Config */}
        {step === 2 && (
          <BatchVMConfig
            vmType={vmType} setVmType={setVmType}
            vmTemplates={vmTemplates} setVmTemplates={setVmTemplates}
            participantCount={participantCount} setParticipantCount={setParticipantCount}
            adminCount={adminCount} setAdminCount={setAdminCount}
            vmStartDate={vmStartDate} setVmStartDate={setVmStartDate}
            vmEndDate={vmEndDate} setVmEndDate={setVmEndDate}
          />
        )}

        {/* Step 3: Review & Approve */}
        {step === 3 && (
          <BatchReview
            batchName={name} description={description}
            startDate={startDate} endDate={endDate}
            medium={medium} seatCount={seatCount}
            instructors={instructors}
            vmType={vmType} vmTemplates={vmTemplates}
            participantCount={participantCount} adminCount={adminCount}
            vmStartDate={vmStartDate} vmEndDate={vmEndDate}
            pricing={pricing}
            approvalRequested={approvalRequested}
            cloudAddaApproval={cloudAddaApproval}
            companyAdminApproval={companyAdminApproval}
            onRequestApproval={handleRequestApproval}
            isFormValid={!!isFormValid}
            isApproved={isApproved}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Navigation Buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => step > 1 ? setStep(step - 1) : navigate("/batches")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step > 1 ? "Previous" : "Cancel"}
            </Button>
            <Button type="button" onClick={handleNext} className="shadow-md">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex justify-start mt-8">
            <Button type="button" variant="outline" onClick={() => setStep(2)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}