import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useLabStore } from "@/stores/labStore";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Save,
  X,
  Server,
  Cpu,
  HardDrive,
  Globe,
  Shield,
  Terminal,
  Upload,
  Download,
  Clipboard,
  Monitor,
  Clock,
  Tag,
  Check,
  Layers,
  Wrench,
  Play,
  Camera,
  Loader2,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const osOptions = {
  Linux: [
    { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
    { value: "ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
    { value: "centos-8", label: "CentOS 8 Stream" },
    { value: "centos-7", label: "CentOS 7" },
    { value: "debian-11", label: "Debian 11" },
    { value: "alpine-3.18", label: "Alpine Linux 3.18" },
    { value: "rhel-8", label: "Red Hat Enterprise Linux 8" },
  ],
  Windows: [
    { value: "win-server-2022", label: "Windows Server 2022" },
    { value: "win-server-2019", label: "Windows Server 2019" },
    { value: "win-11-pro", label: "Windows 11 Pro" },
    { value: "win-10-pro", label: "Windows 10 Pro" },
  ],
};

const cloudProviders = [
  { value: "aws", label: "Amazon Web Services", icon: "🟠", regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"] },
  { value: "azure", label: "Microsoft Azure", icon: "🔵", regions: ["eastus", "westus2", "westeurope", "southeastasia"] },
  { value: "gcp", label: "Google Cloud", icon: "🔴", regions: ["us-central1", "us-east1", "europe-west1", "asia-south1"] },
  { value: "cloudadda", label: "CloudAdda", icon: "🟣", regions: ["in-mum-1", "in-del-1", "in-blr-1"] },
];

const categories = [
  "Cloud Computing",
  "Container Orchestration",
  "Containerization",
  "System Administration",
  "Infrastructure",
  "DevOps",
  "Security",
  "Networking",
  "Database",
  "Development",
];

type Step = "configure" | "choose-type" | "builder";

export default function CreateLabTemplate() {
  const navigate = useNavigate();
  const { addTemplate } = useLabStore();

  const [step, setStep] = useState<Step>("configure");
  const [templateType, setTemplateType] = useState<"basic" | "custom" | null>(null);
  const [builderStatus, setBuilderStatus] = useState<"idle" | "provisioning" | "ready" | "snapshotting" | "complete">("idle");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "Linux" as "Linux" | "Windows",
    os: "",
    cloudProvider: "aws",
    region: "us-east-1",
    vcpus: 2,
    memory: 4,
    storage: 20,
    runtimeLimit: 60,
    category: "",
    tags: [] as string[],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: true,
      sshAccess: true,
      rdpAccess: false,
    },
    startupScript: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProvider = cloudProviders.find((p) => p.value === formData.cloudProvider);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a template name");
      return false;
    }
    if (!formData.os) {
      toast.error("Please select an operating system");
      return false;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep("choose-type");
    }
  };

  const handleBack = () => {
    if (step === "choose-type") {
      setStep("configure");
      setTemplateType(null);
    } else if (step === "builder") {
      setStep("choose-type");
      setBuilderStatus("idle");
    }
  };

  const handleSelectTemplateType = (type: "basic" | "custom") => {
    setTemplateType(type);
    if (type === "basic") {
      handleSubmitBasic();
    } else {
      setStep("builder");
    }
  };

  const handleSubmitBasic = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const osLabel = osOptions[formData.type].find((o) => o.value === formData.os)?.label || formData.os;
    const [osName] = osLabel.split(" ");

    addTemplate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      os: osName,
      osVersion: osLabel.split(" ").slice(1).join(" "),
      cloudProvider: formData.cloudProvider as "aws" | "azure" | "gcp" | "digitalocean",
      region: formData.region,
      vcpus: formData.vcpus,
      memory: formData.memory,
      storage: formData.storage,
      runtimeLimit: formData.runtimeLimit,
      category: formData.category,
      tags: formData.tags,
      policies: formData.policies,
      startupScript: formData.startupScript,
    });

    toast.success("Basic template created successfully");
    navigate("/labs");
    setIsSubmitting(false);
  };

  const handleProvisionBuilder = async () => {
    setBuilderStatus("provisioning");
    // Simulate provisioning
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setBuilderStatus("ready");
    toast.success("Builder VM is ready! You can now access it to customize.");
  };

  const handleTakeSnapshot = async () => {
    setBuilderStatus("snapshotting");
    // Simulate snapshotting
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const osLabel = osOptions[formData.type].find((o) => o.value === formData.os)?.label || formData.os;
    const [osName] = osLabel.split(" ");

    addTemplate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      os: osName,
      osVersion: osLabel.split(" ").slice(1).join(" "),
      cloudProvider: formData.cloudProvider as "aws" | "azure" | "gcp" | "digitalocean",
      region: formData.region,
      vcpus: formData.vcpus,
      memory: formData.memory,
      storage: formData.storage,
      runtimeLimit: formData.runtimeLimit,
      category: formData.category,
      tags: [...formData.tags, "custom-image"],
      policies: formData.policies,
      startupScript: formData.startupScript,
    });

    setBuilderStatus("complete");
    toast.success("Template created from snapshot successfully!");
    setTimeout(() => navigate("/labs"), 1500);
  };

  const getStepNumber = () => {
    switch (step) {
      case "configure": return 1;
      case "choose-type": return 2;
      case "builder": return 3;
      default: return 1;
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Create Lab Template"
        description="Configure a new virtual machine template for lab environments"
        breadcrumbs={[
          { label: "Labs", href: "/labs" },
          { label: "Create Template" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/labs")}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        }
      />

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 py-4">
        {[
          { num: 1, label: "Configure" },
          { num: 2, label: "Template Type" },
          { num: 3, label: "Finalize" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                getStepNumber() === s.num
                  ? "bg-primary text-primary-foreground"
                  : getStepNumber() > s.num
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {getStepNumber() > s.num ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="h-5 w-5 flex items-center justify-center text-sm font-semibold">
                  {s.num}
                </span>
              )}
              <span className="font-medium text-sm">{s.label}</span>
            </div>
            {idx < 2 && (
              <div className={cn(
                "w-12 h-0.5 mx-2",
                getStepNumber() > s.num ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Configuration */}
      {step === "configure" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Configuration Forms */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>Define the template name and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., AWS EC2 Linux Instance"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this lab template is used for..."
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Operating System */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  Operating System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>OS Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "Linux" | "Windows") =>
                        setFormData((prev) => ({ ...prev, type: value, os: "" }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Linux">Linux</SelectItem>
                        <SelectItem value="Windows">Windows</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>OS Version *</Label>
                    <Select
                      value={formData.os}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, os: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {osOptions[formData.type].map((os) => (
                          <SelectItem key={os.value} value={os.value}>
                            {os.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cloud Provider */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-primary" />
                  Cloud Provider
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {cloudProviders.map((provider) => (
                    <button
                      key={provider.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          cloudProvider: provider.value,
                          region: provider.regions[0],
                        }))
                      }
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                        formData.cloudProvider === provider.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      )}
                    >
                      <span className="text-2xl">{provider.icon}</span>
                      <span className="text-sm font-medium text-center">{provider.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedProvider?.regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        vCPUs
                      </Label>
                      <Badge variant="secondary">{formData.vcpus} cores</Badge>
                    </div>
                    <Slider
                      value={[formData.vcpus]}
                      onValueChange={([value]) => setFormData((prev) => ({ ...prev, vcpus: value }))}
                      min={1}
                      max={16}
                      step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        Memory
                      </Label>
                      <Badge variant="secondary">{formData.memory} GB</Badge>
                    </div>
                    <Slider
                      value={[formData.memory]}
                      onValueChange={([value]) => setFormData((prev) => ({ ...prev, memory: value }))}
                      min={1}
                      max={64}
                      step={1}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        Storage
                      </Label>
                      <Badge variant="secondary">{formData.storage} GB</Badge>
                    </div>
                    <Slider
                      value={[formData.storage]}
                      onValueChange={([value]) => setFormData((prev) => ({ ...prev, storage: value }))}
                      min={10}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Runtime Limit
                      </Label>
                      <Badge variant="secondary">{formData.runtimeLimit} min</Badge>
                    </div>
                    <Slider
                      value={[formData.runtimeLimit]}
                      onValueChange={([value]) => setFormData((prev) => ({ ...prev, runtimeLimit: value }))}
                      min={15}
                      max={480}
                      step={15}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Access Policies */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Access Policies
                </CardTitle>
                <CardDescription>Control what users can do in the lab</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { key: "internetAccess", label: "Internet Access", icon: Globe },
                    { key: "clipboardAccess", label: "Clipboard Access", icon: Clipboard },
                    { key: "fileUpload", label: "File Upload", icon: Upload },
                    { key: "fileDownload", label: "File Download", icon: Download },
                    { key: "sshAccess", label: "SSH Access", icon: Terminal },
                    { key: "rdpAccess", label: "RDP Access", icon: Monitor },
                  ].map((policy) => (
                    <div
                      key={policy.key}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-colors",
                        formData.policies[policy.key as keyof typeof formData.policies]
                          ? "border-primary/30 bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <Label className="flex items-center gap-2 cursor-pointer">
                        <policy.icon className="h-4 w-4 text-muted-foreground" />
                        {policy.label}
                      </Label>
                      <Switch
                        checked={formData.policies[policy.key as keyof typeof formData.policies]}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            policies: { ...prev.policies, [policy.key]: checked },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Configuration Preview */}
          <div className="lg:sticky lg:top-6 space-y-6">
            <Card className="glass-card border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-primary" />
                  Configuration Preview
                </CardTitle>
                <CardDescription>Live preview of your template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Template Name */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Template Name</p>
                  <p className="font-semibold text-lg">{formData.name || "Untitled Template"}</p>
                </div>

                <div className="h-px bg-border" />

                {/* OS Info */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Operating System</p>
                    <p className="font-medium">
                      {formData.os
                        ? osOptions[formData.type].find((o) => o.value === formData.os)?.label
                        : "Not selected"}
                    </p>
                  </div>
                </div>

                {/* Cloud Provider */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                    {selectedProvider?.icon}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cloud Provider</p>
                    <p className="font-medium">{selectedProvider?.label}</p>
                    <p className="text-xs text-muted-foreground">{formData.region}</p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Resources Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Cpu className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="font-semibold">{formData.vcpus}</p>
                    <p className="text-xs text-muted-foreground">vCPUs</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <HardDrive className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="font-semibold">{formData.memory} GB</p>
                    <p className="text-xs text-muted-foreground">Memory</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <HardDrive className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="font-semibold">{formData.storage} GB</p>
                    <p className="text-xs text-muted-foreground">Storage</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 text-center">
                    <Clock className="h-4 w-4 mx-auto text-primary mb-1" />
                    <p className="font-semibold">{formData.runtimeLimit}</p>
                    <p className="text-xs text-muted-foreground">Min Runtime</p>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Policies Summary */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Access Policies</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(formData.policies).map(([key, enabled]) => (
                      <Badge
                        key={key}
                        variant={enabled ? "default" : "outline"}
                        className={cn(
                          "text-xs",
                          enabled ? "bg-primary/20 text-primary border-primary/30" : "opacity-50"
                        )}
                      >
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Category & Tags */}
                {(formData.category || formData.tags.length > 0) && (
                  <>
                    <div className="h-px bg-border" />
                    <div className="space-y-2">
                      {formData.category && (
                        <Badge variant="secondary">{formData.category}</Badge>
                      )}
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Next Button */}
            <Button onClick={handleNext} className="w-full btn-gradient" size="lg">
              Continue to Template Type
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Choose Template Type */}
      {step === "choose-type" && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Choose Template Type</h2>
            <p className="text-muted-foreground">
              Select how you want to create your template
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Template */}
            <button
              onClick={() => handleSelectTemplateType("basic")}
              disabled={isSubmitting}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all hover:border-primary hover:shadow-lg",
                "bg-gradient-to-br from-card to-card/50"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Layers className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Basic Template</h3>
                  <p className="text-muted-foreground text-sm">
                    Use the configuration as-is. The template will be created with the base OS image and your specified settings.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Quick setup
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Standard base image
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" />
                    Ready to use immediately
                  </li>
                </ul>
                <div className="pt-2">
                  <span className="inline-flex items-center text-primary font-medium">
                    {isSubmitting && templateType === "basic" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Basic Template
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            </button>

            {/* Custom Template */}
            <button
              onClick={() => handleSelectTemplateType("custom")}
              className={cn(
                "group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all hover:border-primary hover:shadow-lg",
                "bg-gradient-to-br from-card to-card/50"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                  Advanced
                </Badge>
              </div>
              <div className="relative space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Wrench className="h-7 w-7 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Customized Template</h3>
                  <p className="text-muted-foreground text-sm">
                    Provision a builder VM where you can install software, configure settings, then save it as a snapshot.
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-orange-500" />
                    Full customization
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-orange-500" />
                    Install any software
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <Check className="h-4 w-4 text-orange-500" />
                    Pre-configured environment
                  </li>
                </ul>
                <div className="pt-2">
                  <span className="inline-flex items-center text-orange-500 font-medium">
                    Start Builder VM
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Configuration
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Builder VM */}
      {step === "builder" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="glass-card">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Builder VM Setup</CardTitle>
              <CardDescription>
                Provision a VM, customize it, then create a snapshot as your template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Timeline */}
              <div className="space-y-4">
                {[
                  { 
                    status: "provisioning", 
                    label: "Provision Builder VM", 
                    description: "Creating a VM with your configuration",
                    icon: Server 
                  },
                  { 
                    status: "ready", 
                    label: "Customize & Configure", 
                    description: "Access the VM and install your software",
                    icon: Terminal 
                  },
                  { 
                    status: "snapshotting", 
                    label: "Create Snapshot", 
                    description: "Capture the VM state as your template",
                    icon: Camera 
                  },
                  { 
                    status: "complete", 
                    label: "Template Ready", 
                    description: "Your custom template is saved",
                    icon: Check 
                  },
                ].map((item, idx) => {
                  const statusOrder = ["idle", "provisioning", "ready", "snapshotting", "complete"];
                  const currentIdx = statusOrder.indexOf(builderStatus);
                  const itemIdx = statusOrder.indexOf(item.status);
                  const isActive = builderStatus === item.status || (item.status === "provisioning" && builderStatus === "idle");
                  const isCompleted = currentIdx > itemIdx;

                  return (
                    <div key={item.status} className="flex items-start gap-4">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
                        isCompleted ? "bg-primary text-primary-foreground" :
                        isActive ? "bg-primary/20 text-primary" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? (
                          <Check className="h-5 w-5" />
                        ) : isActive && (builderStatus === "provisioning" || builderStatus === "snapshotting") ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <item.icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className={cn(
                          "font-medium",
                          isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      {idx < 3 && (
                        <div className={cn(
                          "absolute left-5 mt-10 w-0.5 h-8",
                          isCompleted ? "bg-primary" : "bg-muted"
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                {builderStatus === "idle" && (
                  <Button onClick={handleProvisionBuilder} className="btn-gradient" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Provision Builder VM
                  </Button>
                )}

                {builderStatus === "ready" && (
                  <>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <p className="font-medium">Builder VM is Ready!</p>
                      <p className="text-sm text-muted-foreground">
                        Access your VM and install any software or configurations you need.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Terminal className="mr-2 h-4 w-4" />
                          Open SSH Console
                        </Button>
                        {formData.type === "Windows" && (
                          <Button variant="outline" size="sm">
                            <Monitor className="mr-2 h-4 w-4" />
                            Open RDP
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button onClick={handleTakeSnapshot} className="btn-gradient" size="lg">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Snapshot & Save Template
                    </Button>
                  </>
                )}

                {builderStatus === "complete" && (
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                      <Check className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium text-lg">Template Created Successfully!</p>
                    <p className="text-sm text-muted-foreground">Redirecting to labs...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {builderStatus !== "complete" && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleBack} disabled={builderStatus === "provisioning" || builderStatus === "snapshotting"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
