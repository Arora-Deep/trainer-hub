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
} from "lucide-react";

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
  { value: "aws", label: "Amazon Web Services (AWS)", regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1"] },
  { value: "azure", label: "Microsoft Azure", regions: ["eastus", "westus2", "westeurope", "southeastasia"] },
  { value: "gcp", label: "Google Cloud Platform", regions: ["us-central1", "us-east1", "europe-west1", "asia-south1"] },
  { value: "digitalocean", label: "DigitalOcean", regions: ["nyc1", "sfo2", "ams3", "sgp1"] },
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

export default function CreateLabTemplate() {
  const navigate = useNavigate();
  const { addTemplate } = useLabStore();

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

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!formData.os) {
      toast.error("Please select an operating system");
      return;
    }
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const osLabel = osOptions[formData.type].find((o) => o.value === formData.os)?.label || formData.os;
    const [osName, osVersion] = osLabel.split(" ").reduce(
      (acc, part, idx, arr) => {
        if (idx === 0) return [part, ""];
        return [acc[0], arr.slice(1).join(" ")];
      },
      ["", ""]
    );

    addTemplate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      os: osName,
      osVersion: osVersion || osLabel.split(" ").slice(1).join(" "),
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

    toast.success("Lab template created successfully");
    navigate("/labs");
    setIsSubmitting(false);
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
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Creating..." : "Create Template"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Basic Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
              <CardDescription>Define the template name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this lab template is used for..."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Operating System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Operating System
              </CardTitle>
              <CardDescription>Select the OS type and version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="h-4 w-4" />
                Cloud Provider
              </CardTitle>
              <CardDescription>Select where the VMs will be provisioned</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select
                    value={formData.cloudProvider}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        cloudProvider: value,
                        region: cloudProviders.find((p) => p.value === value)?.regions[0] || "",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cloudProviders.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Resources
              </CardTitle>
              <CardDescription>Configure VM compute resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    vCPUs
                  </Label>
                  <span className="font-medium">{formData.vcpus}</span>
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
                    Memory (GB)
                  </Label>
                  <span className="font-medium">{formData.memory} GB</span>
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
                    Storage (GB)
                  </Label>
                  <span className="font-medium">{formData.storage} GB</span>
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
                    Runtime Limit (minutes)
                  </Label>
                  <span className="font-medium">{formData.runtimeLimit} min</span>
                </div>
                <Slider
                  value={[formData.runtimeLimit]}
                  onValueChange={([value]) => setFormData((prev) => ({ ...prev, runtimeLimit: value }))}
                  min={15}
                  max={480}
                  step={15}
                />
              </div>
            </CardContent>
          </Card>

          {/* Startup Script */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Startup Script
              </CardTitle>
              <CardDescription>Script to run when the VM starts (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={formData.type === "Linux" ? "#!/bin/bash\n\n# Your startup commands here" : "# PowerShell startup script"}
                value={formData.startupScript}
                onChange={(e) => setFormData((prev) => ({ ...prev, startupScript: e.target.value }))}
                className="font-mono text-sm"
                rows={6}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Policies */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Access Policies
              </CardTitle>
              <CardDescription>Control what users can do in the lab</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="internetAccess" className="flex items-center gap-2 cursor-pointer">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Internet Access
                </Label>
                <Switch
                  id="internetAccess"
                  checked={formData.policies.internetAccess}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, internetAccess: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="clipboardAccess" className="flex items-center gap-2 cursor-pointer">
                  <Clipboard className="h-4 w-4 text-muted-foreground" />
                  Clipboard Access
                </Label>
                <Switch
                  id="clipboardAccess"
                  checked={formData.policies.clipboardAccess}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, clipboardAccess: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fileUpload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  File Upload
                </Label>
                <Switch
                  id="fileUpload"
                  checked={formData.policies.fileUpload}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, fileUpload: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="fileDownload" className="flex items-center gap-2 cursor-pointer">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  File Download
                </Label>
                <Switch
                  id="fileDownload"
                  checked={formData.policies.fileDownload}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, fileDownload: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sshAccess" className="flex items-center gap-2 cursor-pointer">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  SSH Access
                </Label>
                <Switch
                  id="sshAccess"
                  checked={formData.policies.sshAccess}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, sshAccess: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="rdpAccess" className="flex items-center gap-2 cursor-pointer">
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                  RDP Access
                </Label>
                <Switch
                  id="rdpAccess"
                  checked={formData.policies.rdpAccess}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      policies: { ...prev.policies, rdpAccess: checked },
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">OS</span>
                <span className="font-medium">
                  {formData.os ? osOptions[formData.type].find((o) => o.value === formData.os)?.label : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium capitalize">{formData.cloudProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">{formData.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">vCPUs</span>
                <span className="font-medium">{formData.vcpus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">{formData.memory} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">{formData.storage} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Runtime</span>
                <span className="font-medium">{formData.runtimeLimit} min</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
