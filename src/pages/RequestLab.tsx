import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Send, Upload, X, FileText, Cpu, HardDrive, MemoryStick,
  Monitor, Package, Calendar, Users, DollarSign, CheckCircle2,
} from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
}

const OS_OPTIONS = [
  { value: "ubuntu-22", label: "Ubuntu 22.04 LTS" },
  { value: "ubuntu-20", label: "Ubuntu 20.04 LTS" },
  { value: "centos-9", label: "CentOS Stream 9" },
  { value: "rhel-9", label: "Red Hat Enterprise Linux 9" },
  { value: "debian-12", label: "Debian 12" },
  { value: "windows-server-2022", label: "Windows Server 2022" },
  { value: "windows-server-2019", label: "Windows Server 2019" },
  { value: "windows-11", label: "Windows 11 Pro" },
  { value: "windows-10", label: "Windows 10 Pro" },
  { value: "kali", label: "Kali Linux" },
  { value: "custom", label: "Custom / Other (specify in notes)" },
];

const COMMON_SOFTWARE = [
  "Docker", "Kubernetes", "Python", "Node.js", "Java JDK", "VS Code",
  "IntelliJ IDEA", "Eclipse", "MySQL", "PostgreSQL", "MongoDB", "Redis",
  "Jenkins", "Ansible", "Terraform", "AWS CLI", "Azure CLI", "GCP SDK",
  "Git", "Postman", "Wireshark", "Burp Suite", "Metasploit",
];

export default function RequestLab() {
  const [requestType, setRequestType] = useState<"lab" | "quote">("lab");
  const [labName, setLabName] = useState("");
  const [os, setOs] = useState("");
  const [vcpu, setVcpu] = useState("4");
  const [ram, setRam] = useState("8");
  const [storage, setStorage] = useState("100");
  const [gpu, setGpu] = useState("none");
  const [seatCount, setSeatCount] = useState("20");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedSoftware, setSelectedSoftware] = useState<string[]>([]);
  const [customSoftware, setCustomSoftware] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const toggleSoftware = (s: string) => {
    setSelectedSoftware((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    const newFiles = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labName || !os) {
      toast.error("Please fill in lab name and operating system");
      return;
    }
    toast.success(
      requestType === "quote"
        ? "Quote request submitted — our team will reach out within 24 hours"
        : "Lab request submitted — you'll receive a confirmation shortly"
    );
    // Reset
    setLabName(""); setOs(""); setSeatCount("20"); setDuration("");
    setStartDate(""); setSelectedSoftware([]); setCustomSoftware("");
    setDetails(""); setFiles([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request a Lab / Quote"
        description="Tell us what you need and our team will provision a custom lab environment or send you a tailored quote."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Request Type</CardTitle>
              <CardDescription>What would you like to do?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={requestType}
                onValueChange={(v) => setRequestType(v as "lab" | "quote")}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <label
                  className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                    requestType === "lab" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem value="lab" className="mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <Package className="h-4 w-4" /> Request a Lab
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Provision a ready-to-use lab environment for an upcoming batch.
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                    requestType === "quote" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem value="quote" className="mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4" /> Request a Quote
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Get a price estimate for a custom setup before committing.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Basics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lab Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="labName">Lab name / Purpose *</Label>
                <Input
                  id="labName"
                  placeholder="e.g. DevOps Bootcamp – Cohort 14"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="os">Operating System *</Label>
                <Select value={os} onValueChange={setOs}>
                  <SelectTrigger id="os">
                    <SelectValue placeholder="Select an OS" />
                  </SelectTrigger>
                  <SelectContent>
                    {OS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats" className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Seats</Label>
                  <Input id="seats" type="number" min={1} value={seatCount} onChange={(e) => setSeatCount(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Duration</Label>
                  <Input id="duration" placeholder="e.g. 4 weeks" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Preferred start</Label>
                  <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resources Per VM</CardTitle>
              <CardDescription>Specify the compute footprint for each participant's machine.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /> vCPU</Label>
                  <Select value={vcpu} onValueChange={setVcpu}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["2", "4", "8", "16", "32"].map((v) => (
                        <SelectItem key={v} value={v}>{v} vCPU</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><MemoryStick className="h-3.5 w-3.5" /> RAM</Label>
                  <Select value={ram} onValueChange={setRam}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["4", "8", "16", "32", "64", "128"].map((v) => (
                        <SelectItem key={v} value={v}>{v} GB</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5" /> Storage</Label>
                  <Select value={storage} onValueChange={setStorage}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["50", "100", "200", "500", "1000"].map((v) => (
                        <SelectItem key={v} value={v}>{v} GB SSD</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> GPU</Label>
                  <Select value={gpu} onValueChange={setGpu}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No GPU</SelectItem>
                      <SelectItem value="t4">NVIDIA T4 (16 GB)</SelectItem>
                      <SelectItem value="a10">NVIDIA A10 (24 GB)</SelectItem>
                      <SelectItem value="a100">NVIDIA A100 (40 GB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Software */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Software Required</CardTitle>
              <CardDescription>Pick from the catalog or add your own.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {COMMON_SOFTWARE.map((s) => {
                  const active = selectedSoftware.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSoftware(s)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {active && <CheckCircle2 className="h-3 w-3" />}
                      {s}
                    </button>
                  );
                })}
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="customSoftware">Other software / specific versions</Label>
                <Input
                  id="customSoftware"
                  placeholder="e.g. Oracle DB 19c, SAP HANA, MATLAB R2024a"
                  value={customSoftware}
                  onChange={(e) => setCustomSoftware(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Details + uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Additional Details</CardTitle>
              <CardDescription>
                Share anything else we should know — networking rules, license keys, integrations, etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                rows={6}
                placeholder="Describe your requirements in detail..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
              <div className="space-y-2">
                <Label>Attachments</Label>
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-8 cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Click to upload or drag files here</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PDF, DOCX, XLSX, images, configs — up to 25 MB each
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {files.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{f.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatSize(f.size)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-6">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
              <CardDescription>Review before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="secondary">
                  {requestType === "quote" ? "Quote" : "Lab"}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium truncate ml-2">{labName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS</span>
                  <span className="font-medium truncate ml-2">
                    {OS_OPTIONS.find((o) => o.value === os)?.label || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">{seatCount || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{duration || "—"}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">vCPU</span>
                  <span className="font-medium">{vcpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RAM</span>
                  <span className="font-medium">{ram} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage</span>
                  <span className="font-medium">{storage} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPU</span>
                  <span className="font-medium">
                    {gpu === "none" ? "None" : gpu.toUpperCase()}
                  </span>
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-muted-foreground mb-1.5">Software ({selectedSoftware.length})</div>
                {selectedSoftware.length === 0 ? (
                  <div className="text-xs text-muted-foreground">None selected</div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {selectedSoftware.slice(0, 6).map((s) => (
                      <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                    {selectedSoftware.length > 6 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{selectedSoftware.length - 6}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              {files.length > 0 && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attachments</span>
                    <span className="font-medium">{files.length} file{files.length > 1 ? "s" : ""}</span>
                  </div>
                </>
              )}
              <Separator />
              <Button type="submit" className="w-full gap-2">
                <Send className="h-4 w-4" />
                {requestType === "quote" ? "Request Quote" : "Submit Lab Request"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Our team typically responds within 24 business hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
