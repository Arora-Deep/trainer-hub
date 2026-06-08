import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users, Calendar, Play, RefreshCw, Clock, BookOpen, Megaphone, Plus, Server,
  Monitor, Loader2, ExternalLink, Copy, CheckCircle2, Terminal, Mail,
  ClipboardList, Settings, GraduationCap, TrendingUp, Zap, BarChart3,
  AlertCircle, Globe, Building2, MoreVertical, RotateCcw, Power, PowerOff,
  Camera, Trash2, Star, Eye, EyeOff, Clipboard, Video, FileText, Award, ChevronRight, Edit,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore, getCourseAssessments, isAssessmentLesson, type Lesson } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ParticipantsTab } from "@/components/batches/ParticipantsTab";
import { BatchSettingsTab } from "@/components/batches/BatchSettingsTab";
import { MeetingsTab } from "@/components/batches/MeetingsTab";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

const mediumConfig: Record<string, { icon: React.ElementType; label: string }> = {
  online: { icon: Globe, label: "Online" },
  offline: { icon: Building2, label: "Offline" },
  hybrid: { icon: Zap, label: "Hybrid" },
};

const terminalLines = [
  "root@trainer-vm:~# kubectl get pods -n production",
  "NAME                          READY   STATUS    RESTARTS   AGE",
  "nginx-dep-7f44fc4d4-2k8x9    1/1     Running   0          2h",
  "nginx-dep-7f44fc4d4-9j3bc    1/1     Running   0          2h",
  "redis-master-0                1/1     Running   0          5h",
  "root@trainer-vm:~# _",
];

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getBatch, addAnnouncement, setCourse, provisionTrainerVM, markTrainerVMConfigured,
    cloneTrainerVMForBatch, createSnapshot, setGoldenSnapshot, deleteSnapshot,
    resetParticipantVM, recloneParticipantVM, restartParticipantVM, stopParticipantVM, startParticipantVM,
    resetAllVMs, recloneAllVMs,
  } = useBatchStore();
  const { courses } = useCourseStore();
  const { templates } = useLabStore();

  const batch = getBatch(id || "");

  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [assignCourseOpen, setAssignCourseOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [createSnapshotOpen, setCreateSnapshotOpen] = useState(false);
  const [snapName, setSnapName] = useState("");
  const [snapDesc, setSnapDesc] = useState("");
  const [selectedVMIds, setSelectedVMIds] = useState<string[]>([]);
  const [consoleSheetVM, setConsoleSheetVM] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  if (!batch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <p className="text-muted-foreground mt-2">The batch you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/batches")}>Back to Batches</Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "MMM d, yyyy"); } catch { return dateStr; }
  };

  const handleAddAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    addAnnouncement(batch.id, { title: announcementTitle.trim(), content: announcementContent.trim() });
    toast({ title: "Success", description: "Announcement posted successfully" });
    setAnnouncementTitle(""); setAnnouncementContent(""); setAnnouncementOpen(false);
  };

  const handleAssignCourse = () => {
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) { toast({ title: "Error", description: "Please select a course", variant: "destructive" }); return; }
    setCourse(batch.id, course.id, course.name);
    toast({ title: "Success", description: "Course assigned successfully" });
    setSelectedCourseId(""); setAssignCourseOpen(false);
  };

  const handleCreateSnapshot = () => {
    if (!snapName.trim()) return;
    createSnapshot(batch.id, snapName.trim(), snapDesc.trim());
    toast({ title: "Snapshot Creating", description: `"${snapName}" is being created...` });
    setSnapName(""); setSnapDesc(""); setCreateSnapshotOpen(false);
  };

  const daysRemaining = () => {
    try {
      const end = new Date(batch.endDate);
      const diff = Math.ceil((end.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch { return 0; }
  };

  const vm = batch.vmConfig;
  const trainerStatus = vm?.trainerVM.status || "not_provisioned";
  const MediumIcon = mediumConfig[batch.medium]?.icon || Globe;
  const snapshots = vm?.snapshots || [];
  const goldenSnapshot = snapshots.find(s => s.isGolden);

  const toggleVMSelection = (vmId: string) => {
    setSelectedVMIds(prev => prev.includes(vmId) ? prev.filter(id => id !== vmId) : [...prev, vmId]);
  };
  const selectAllVMs = () => {
    if (!vm) return;
    if (selectedVMIds.length === vm.participantVMs.length) {
      setSelectedVMIds([]);
    } else {
      setSelectedVMIds(vm.participantVMs.map(v => v.id));
    }
  };

  const consoleVM = vm?.participantVMs.find(v => v.id === consoleSheetVM);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <PageHeader
          title={batch.name}
          description={batch.description}
          breadcrumbs={[{ label: "Batches", href: "/batches" }, { label: batch.name }]}
        />
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="capitalize gap-1 text-xs">
            {batch.deliveryMode === "self-paced" ? <Clock className="h-3 w-3" /> : <Video className="h-3 w-3" />}
            {batch.deliveryMode === "self-paced" ? "Self-paced" : "Live"}
          </Badge>
          <StatusBadge
            status={statusMap[batch.status].status}
            label={statusMap[batch.status].label}
            pulse={batch.status === "live"}
          />
          <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Refresh</Button>
          {batch.status === "live" && batch.deliveryMode !== "self-paced" && (
            <Button size="sm" onClick={() => navigate("/live-training")}><Play className="mr-1.5 h-3.5 w-3.5" />Start Session</Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Participants", value: `${batch.participants.length}/${batch.seatCount}`, icon: Users, desc: "enrolled" },
          { label: "Days Left", value: daysRemaining(), icon: Calendar, desc: `ends ${formatDate(batch.endDate)}` },
          { label: "VMs Active", value: vm ? vm.participantVMs.filter(v => v.status === "running").length : 0, icon: Monitor, desc: "running" },
          { label: "Medium", value: mediumConfig[batch.medium]?.label || batch.medium, icon: MediumIcon, desc: "delivery" },
          { label: "Snapshots", value: snapshots.length, icon: Camera, desc: goldenSnapshot ? `golden: ${goldenSnapshot.name}` : "none set" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border bg-card p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="border-b border-border">
          <TabsList className="bg-transparent p-0 h-auto space-x-1">
            {[
              { value: "overview", label: "Overview", icon: BarChart3 },
              { value: "participants", label: "Participants", icon: Users, count: batch.participants.length },
              { value: "vms", label: "VMs", icon: Monitor },
              { value: "course", label: "Course", icon: BookOpen },
              { value: "meetings", label: "Meetings", icon: Video },
              { value: "announcements", label: "Announcements", icon: Megaphone, count: batch.announcements.length },
              { value: "assessments", label: "Assessments", icon: ClipboardList },
              { value: "reports", label: "Reports", icon: TrendingUp },
              { value: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm gap-1.5"
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] h-4 rounded">{tab.count}</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Batch Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Course", value: batch.courseName || "Not assigned" },
                      { label: "Instructors", value: batch.instructors.join(", ") || "None" },
                      { label: "Start Date", value: formatDate(batch.startDate) },
                      { label: "End Date", value: formatDate(batch.endDate) },
                      { label: "Seat Count", value: `${batch.seatCount} seats` },
                      { label: "Medium", value: mediumConfig[batch.medium]?.label || batch.medium },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                        <p className="font-semibold text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={batch.settings.published ? "default" : "secondary"}>
                      {batch.settings.published ? "Published" : "Draft"}
                    </Badge>
                    <Badge variant={batch.settings.allowSelfEnrollment ? "default" : "secondary"}>
                      {batch.settings.allowSelfEnrollment ? "Self-Enrollment On" : "Self-Enrollment Off"}
                    </Badge>
                    <Badge variant={batch.settings.certification ? "default" : "secondary"}>
                      {batch.settings.certification ? "Certification Enabled" : "No Certification"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-primary" />
                    Recent Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {batch.announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No announcements yet.</p>
                  ) : (
                    batch.announcements.slice(0, 3).map((a) => (
                      <div key={a.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                        <p className="font-medium text-sm">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{a.content}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1.5">{a.date}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
              {vm && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-primary" />
                      VM Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Trainer VM</span>
                      <StatusBadge
                        status={trainerStatus === "configured" || trainerStatus === "running" ? "success" : trainerStatus === "provisioning" ? "warning" : "default"}
                        label={trainerStatus === "not_provisioned" ? "Not Ready" : trainerStatus}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Clone Status</span>
                      <StatusBadge
                        status={vm.cloneStatus === "cloned" ? "success" : vm.cloneStatus === "cloning" ? "warning" : "default"}
                        label={vm.cloneStatus === "not_cloned" ? "Pending" : vm.cloneStatus}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Participant VMs</span>
                      <span className="font-semibold text-sm">{vm.participantVMs.length}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="participants">
          <ParticipantsTab batch={batch} />
        </TabsContent>

        {/* VMs Tab */}
        <TabsContent value="vms">
          <div className="space-y-6">
            {!vm ? (
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                      <Monitor className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold">No VMs configured</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1.5">This batch was created without VM configuration. Edit the batch to add VMs.</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* VM Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Template", value: templates.find(t => t.id === vm.vmTemplates[0]?.templateId)?.name || vm.vmTemplates[0]?.instanceName || "—" },
                    { label: "Type", value: `${vm.vmType} VM` },
                    { label: "Participant VMs", value: vm.participantVMs.length },
                    { label: "Est. Cost", value: `$${vm.pricing.total.toFixed(0)}` },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">{item.label}</p>
                      <p className="font-bold text-lg capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Trainer VM Workflow */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-primary" />
                      Trainer VM Workflow
                    </CardTitle>
                    <CardDescription>Provision → Configure → Clone for all participants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Step 1: Provision */}
                      <div className={cn(
                        "p-4 rounded-xl border transition-colors",
                        trainerStatus === "not_provisioned" ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/20"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                              trainerStatus !== "not_provisioned" ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground"
                            )}>
                              {trainerStatus !== "not_provisioned" ? <CheckCircle2 className="h-4 w-4" /> : "1"}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Provision Admin VM</p>
                              <p className="text-xs text-muted-foreground">Create a VM instance for the trainer</p>
                            </div>
                          </div>
                          {trainerStatus === "not_provisioned" && (
                            <Button size="sm" onClick={() => { provisionTrainerVM(batch.id); toast({ title: "Provisioning", description: "Trainer VM is being provisioned..." }); }}>
                              <Server className="mr-2 h-4 w-4" />Provision VM
                            </Button>
                          )}
                          {trainerStatus === "provisioning" && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Provisioning...</div>
                          )}
                          {(trainerStatus === "running" || trainerStatus === "configured") && <StatusBadge status="success" label="Provisioned" />}
                        </div>
                        {(trainerStatus === "running" || trainerStatus === "configured") && vm.trainerVM.ipAddress && (
                          <div className="mt-3 ml-11 flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">IP:</span>
                            <code className="px-2 py-0.5 rounded bg-muted text-xs font-mono">{vm.trainerVM.ipAddress}</code>
                          </div>
                        )}
                      </div>

                      {/* Step 2: Configure */}
                      <div className={cn(
                        "p-4 rounded-xl border transition-colors",
                        trainerStatus === "running" ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/20",
                        (trainerStatus === "not_provisioned" || trainerStatus === "provisioning") && "opacity-50"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                              trainerStatus === "running" ? "bg-primary text-primary-foreground" : trainerStatus === "configured" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {trainerStatus === "configured" ? <CheckCircle2 className="h-4 w-4" /> : "2"}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Launch Console & Configure</p>
                              <p className="text-xs text-muted-foreground">Install software, configure the environment</p>
                            </div>
                          </div>
                          {trainerStatus === "running" && (
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => { toast({ title: "Console Launched" }); window.open(`https://console.cloudadda.com/vm/${batch.id}`, "_blank"); }}>
                                <ExternalLink className="mr-2 h-4 w-4" />Console
                              </Button>
                              <Button size="sm" onClick={() => { markTrainerVMConfigured(batch.id); toast({ title: "Configured" }); }}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />Mark Done
                              </Button>
                            </div>
                          )}
                          {trainerStatus === "configured" && <StatusBadge status="success" label="Configured" />}
                        </div>
                      </div>

                      {/* Step 3: Clone */}
                      <div className={cn(
                        "p-4 rounded-xl border transition-colors",
                        trainerStatus === "configured" && vm.cloneStatus === "not_cloned" ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/20",
                        trainerStatus !== "configured" && "opacity-50"
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                              trainerStatus === "configured" && vm.cloneStatus === "not_cloned" ? "bg-primary text-primary-foreground" : vm.cloneStatus === "cloned" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              {vm.cloneStatus === "cloned" ? <CheckCircle2 className="h-4 w-4" /> : "3"}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">Clone for Batch</p>
                              <p className="text-xs text-muted-foreground">Create identical VMs for all {batch.seatCount} participants</p>
                            </div>
                          </div>
                          {trainerStatus === "configured" && vm.cloneStatus === "not_cloned" && (
                            <Button size="sm" onClick={() => { cloneTrainerVMForBatch(batch.id); toast({ title: "Cloning Started" }); }}>
                              <Copy className="mr-2 h-4 w-4" />Clone
                            </Button>
                          )}
                          {vm.cloneStatus === "cloning" && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Cloning...</div>}
                          {vm.cloneStatus === "cloned" && <StatusBadge status="success" label={`${vm.participantVMs.length} VMs`} />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Snapshot Management Panel */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />
                        Snapshot Management
                      </CardTitle>
                      <CardDescription>Create and manage VM snapshots for this batch</CardDescription>
                    </div>
                    <Dialog open={createSnapshotOpen} onOpenChange={setCreateSnapshotOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" />Create Snapshot</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Snapshot</DialogTitle>
                          <DialogDescription>Take a snapshot of the current trainer VM state</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Name</Label>
                            <Input placeholder="e.g., Post Lab 3" value={snapName} onChange={e => setSnapName(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="What state does this snapshot capture?" value={snapDesc} onChange={e => setSnapDesc(e.target.value)} className="min-h-[80px]" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateSnapshotOpen(false)}>Cancel</Button>
                          <Button onClick={handleCreateSnapshot} disabled={!snapName.trim()}>Create</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {snapshots.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No snapshots yet. Create one to save the current VM state.</p>
                    ) : (
                      <div className="space-y-2">
                        {snapshots.map(snap => (
                          <div key={snap.id} className={cn(
                            "flex items-center justify-between p-3 rounded-xl border transition-colors",
                            snap.isGolden ? "border-primary/30 bg-primary/5" : "border-border/50"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "h-8 w-8 rounded-lg flex items-center justify-center",
                                snap.isGolden ? "bg-primary/10" : "bg-muted/50"
                              )}>
                                {snap.isGolden ? <Star className="h-4 w-4 text-primary" /> : <Camera className="h-4 w-4 text-muted-foreground" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-sm">{snap.name}</p>
                                  {snap.isGolden && <Badge className="text-[9px] h-4 px-1.5">Golden</Badge>}
                                  {snap.status === "creating" && <Badge variant="secondary" className="text-[9px] h-4 px-1.5"><Loader2 className="h-2.5 w-2.5 animate-spin mr-1" />Creating</Badge>}
                                </div>
                                <p className="text-xs text-muted-foreground">{snap.description}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{snap.size} • {formatDate(snap.createdAt)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {!snap.isGolden && snap.status === "ready" && (
                                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { setGoldenSnapshot(batch.id, snap.id); toast({ title: "Golden Snapshot Set", description: `"${snap.name}" is now the golden snapshot` }); }}>
                                  <Star className="mr-1 h-3 w-3" />Set Golden
                                </Button>
                              )}
                              {snap.status === "ready" && (
                                <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => { resetAllVMs(batch.id, snap.id); toast({ title: "Resetting All VMs", description: `Resetting to "${snap.name}"...` }); }}>
                                  <RotateCcw className="mr-1 h-3 w-3" />Reset All
                                </Button>
                              )}
                              {!snap.isGolden && (
                                <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => { deleteSnapshot(batch.id, snap.id); toast({ title: "Snapshot Deleted" }); }}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Participant VMs Table with Rich Actions */}
                {vm.participantVMs.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Monitor className="h-4 w-4 text-primary" />
                          Participant VMs ({vm.participantVMs.length})
                        </CardTitle>
                        <CardDescription>
                          {vm.participantVMs.filter(v => v.status === "running").length} running,{" "}
                          {vm.participantVMs.filter(v => v.status === "stopped").length} stopped,{" "}
                          {vm.participantVMs.filter(v => v.status === "error").length} errors
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => { recloneAllVMs(batch.id); toast({ title: "Recloning All VMs", description: "All participant VMs are being recloned from golden snapshot..." }); }}>
                          <Copy className="mr-1.5 h-3.5 w-3.5" />Reclone All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Bulk Actions Bar */}
                      {selectedVMIds.length > 0 && (
                        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-primary/20">
                          <span className="text-sm font-medium">{selectedVMIds.length} VM{selectedVMIds.length > 1 ? "s" : ""} selected</span>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => {
                              selectedVMIds.forEach(vmId => restartParticipantVM(batch.id, vmId));
                              toast({ title: "Restarting Selected VMs" });
                              setSelectedVMIds([]);
                            }}>
                              <RotateCcw className="mr-1 h-3 w-3" />Restart
                            </Button>
                            {goldenSnapshot && (
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => {
                                selectedVMIds.forEach(vmId => resetParticipantVM(batch.id, vmId, goldenSnapshot.id));
                                toast({ title: "Resetting Selected VMs" });
                                setSelectedVMIds([]);
                              }}>
                                <RefreshCw className="mr-1 h-3 w-3" />Reset to Golden
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => {
                              selectedVMIds.forEach(vmId => recloneParticipantVM(batch.id, vmId));
                              toast({ title: "Recloning Selected VMs" });
                              setSelectedVMIds([]);
                            }}>
                              <Copy className="mr-1 h-3 w-3" />Reclone
                            </Button>
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setSelectedVMIds([])}>Clear</Button>
                          </div>
                        </div>
                      )}
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-10">
                              <Checkbox
                                checked={selectedVMIds.length === vm.participantVMs.length && vm.participantVMs.length > 0}
                                onCheckedChange={selectAllVMs}
                              />
                            </TableHead>
                            <TableHead className="font-medium">Assigned To</TableHead>
                            <TableHead className="font-medium">VM Name</TableHead>
                            <TableHead className="font-medium">IP Address</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium">CPU / RAM</TableHead>
                            <TableHead className="font-medium">Snapshot</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vm.participantVMs.map((svm) => {
                            const mockCpu = Math.floor(20 + Math.random() * 60);
                            const mockRam = Math.floor(30 + Math.random() * 50);
                            const currentSnap = snapshots.find(s => s.id === svm.currentSnapshotId);
                            return (
                              <TableRow key={svm.id} className="group">
                                <TableCell>
                                  <Checkbox
                                    checked={selectedVMIds.includes(svm.id)}
                                    onCheckedChange={() => toggleVMSelection(svm.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{svm.assignedTo.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium text-sm">{svm.assignedTo}</p>
                                      {svm.assignedEmail !== "unassigned" && <p className="text-xs text-muted-foreground">{svm.assignedEmail}</p>}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">{svm.vmName}</TableCell>
                                <TableCell><code className="text-xs font-mono px-2 py-0.5 rounded bg-muted">{svm.ipAddress}</code></TableCell>
                                <TableCell>
                                  <StatusBadge
                                    status={svm.status === "running" ? "success" : svm.status === "error" ? "error" : svm.status === "provisioning" ? "warning" : "default"}
                                    label={svm.status === "running" ? "Running" : svm.status === "error" ? "Error" : svm.status === "provisioning" ? "Resetting..." : "Stopped"}
                                    pulse={svm.status === "provisioning"}
                                  />
                                </TableCell>
                                <TableCell>
                                  {svm.status === "running" ? (
                                    <div className="space-y-1 w-24">
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-muted-foreground">CPU</span>
                                        <span className="font-mono">{mockCpu}%</span>
                                      </div>
                                      <Progress value={mockCpu} className="h-1" />
                                      <div className="flex items-center justify-between text-[10px]">
                                        <span className="text-muted-foreground">RAM</span>
                                        <span className="font-mono">{mockRam}%</span>
                                      </div>
                                      <Progress value={mockRam} className="h-1" />
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <span className="text-xs text-muted-foreground">{currentSnap?.name || "—"}</span>
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="h-3.5 w-3.5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52">
                                      <DropdownMenuItem onClick={() => setConsoleSheetVM(svm.id)}>
                                        <ExternalLink className="mr-2 h-3.5 w-3.5" />Open Console
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(`ssh root@${svm.ipAddress}`); toast({ title: "SSH Command Copied" }); }}>
                                        <Clipboard className="mr-2 h-3.5 w-3.5" />Copy SSH Command
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem onClick={() => { restartParticipantVM(batch.id, svm.id); toast({ title: `Restarting ${svm.assignedTo}'s VM` }); }}>
                                        <RotateCcw className="mr-2 h-3.5 w-3.5" />Restart VM
                                      </DropdownMenuItem>
                                      {svm.status === "running" ? (
                                        <DropdownMenuItem onClick={() => { stopParticipantVM(batch.id, svm.id); toast({ title: `Stopped ${svm.assignedTo}'s VM` }); }}>
                                          <PowerOff className="mr-2 h-3.5 w-3.5" />Stop VM
                                        </DropdownMenuItem>
                                      ) : svm.status === "stopped" ? (
                                        <DropdownMenuItem onClick={() => { startParticipantVM(batch.id, svm.id); toast({ title: `Starting ${svm.assignedTo}'s VM` }); }}>
                                          <Power className="mr-2 h-3.5 w-3.5" />Start VM
                                        </DropdownMenuItem>
                                      ) : null}
                                      <DropdownMenuSeparator />
                                      {snapshots.filter(s => s.status === "ready").length > 0 && (
                                        <DropdownMenuSub>
                                          <DropdownMenuSubTrigger>
                                            <RefreshCw className="mr-2 h-3.5 w-3.5" />Reset to Snapshot
                                          </DropdownMenuSubTrigger>
                                          <DropdownMenuSubContent>
                                            {snapshots.filter(s => s.status === "ready").map(snap => (
                                              <DropdownMenuItem key={snap.id} onClick={() => { resetParticipantVM(batch.id, svm.id, snap.id); toast({ title: `Resetting to "${snap.name}"` }); }}>
                                                {snap.isGolden && <Star className="mr-1.5 h-3 w-3 text-primary" />}
                                                {snap.name}
                                              </DropdownMenuItem>
                                            ))}
                                          </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                      )}
                                      <DropdownMenuItem onClick={() => { recloneParticipantVM(batch.id, svm.id); toast({ title: `Recloning ${svm.assignedTo}'s VM from golden snapshot` }); }}>
                                        <Copy className="mr-2 h-3.5 w-3.5" />Reclone from Golden
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </TabsContent>

        {/* Course Tab */}
        <TabsContent value="course">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Course / Program</CardTitle>
                <CardDescription>Assign a course or program to this batch</CardDescription>
              </div>
              <Dialog open={assignCourseOpen} onOpenChange={setAssignCourseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="mr-2 h-4 w-4" />{batch.courseName ? "Change" : "Assign"}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Course</DialogTitle>
                    <DialogDescription>Select a course for this batch.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label>Select Course</Label>
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                      <SelectTrigger className="mt-2"><SelectValue placeholder="Choose a course..." /></SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (<SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAssignCourseOpen(false)}>Cancel</Button>
                    <Button onClick={handleAssignCourse}>Assign</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {batch.courseName ? (() => {
                const assignedCourse = courses.find((c) => c.id === batch.courseId) || courses.find((c) => c.name === batch.courseName);
                const lessonIcons: Record<string, any> = { video: Video, document: FileText, quiz: Award, assignment: FileText };
                const totalLessons = assignedCourse?.chapters.reduce((s, ch) => s + ch.lessons.length, 0) || 0;
                return (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-border p-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <GraduationCap className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold">{batch.courseName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {assignedCourse ? `${assignedCourse.chapters.length} chapters · ${totalLessons} lessons` : "Assigned to this batch"}
                            </p>
                          </div>
                        </div>
                        {assignedCourse && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${assignedCourse.id}/builder`)}>
                              <Edit className="h-3.5 w-3.5 mr-1" /> Edit content
                            </Button>
                            <Button size="sm" onClick={() => navigate(`/courses/${assignedCourse.id}`)}>
                              Open course <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {assignedCourse && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Course Content</CardTitle>
                          <CardDescription>Chapters and lessons in this course</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {assignedCourse.chapters.length === 0 ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                              No content added yet. <button onClick={() => navigate(`/courses/${assignedCourse.id}/builder`)} className="text-primary hover:underline">Add chapters</button>
                            </div>
                          ) : (
                            <Accordion type="multiple" defaultValue={assignedCourse.chapters.map((ch) => ch.id)}>
                              {assignedCourse.chapters.map((ch, ci) => (
                                <AccordionItem key={ch.id} value={ch.id}>
                                  <AccordionTrigger className="text-sm">
                                    <span className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Chapter {ci + 1}</span> · {ch.title}
                                      <Badge variant="outline" className="text-[10px] ml-2">{ch.lessons.length} lessons</Badge>
                                    </span>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-1 pl-2">
                                      {ch.lessons.map((l) => {
                                        const Icon = lessonIcons[l.type] || BookOpen;
                                        return (
                                          <div key={l.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm flex-1">{l.title}</span>
                                            <Badge variant="outline" className="text-[10px] capitalize">{l.type}</Badge>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{l.duration}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold">No course assigned</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Assign a course to this batch.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <MeetingsTab batchName={batch.name} />
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Announcements</CardTitle>
                <CardDescription>Broadcast messages to all participants</CardDescription>
              </div>
              <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
                <DialogTrigger asChild>
                  <Button size="sm"><Mail className="mr-2 h-4 w-4" />New Announcement</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Announcement</DialogTitle>
                    <DialogDescription>Create an announcement for this batch.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcementTitle">Title</Label>
                      <Input id="announcementTitle" placeholder="Announcement title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcementContent">Content</Label>
                      <Textarea id="announcementContent" placeholder="Write your announcement..." value={announcementContent} onChange={(e) => setAnnouncementContent(e.target.value)} className="min-h-[100px]" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAnnouncementOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddAnnouncement}>Post</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {batch.announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                    <Megaphone className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <h3 className="text-lg font-semibold">No announcements yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Create an announcement to broadcast to all participants.</p>
                </div>
              ) : (
                batch.announcements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl border border-border p-4 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Megaphone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-sm">{a.title}</h4>
                          <p className="text-sm text-muted-foreground">{a.content}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{a.date}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Assessments</CardTitle>
                <CardDescription>Create and manage quizzes and tests</CardDescription>
              </div>
              <Button size="sm"><ClipboardList className="mr-2 h-4 w-4" />Create Assessment</Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No assessments yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Create quizzes and tests to evaluate student progress.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reports & Analytics</CardTitle>
              <CardDescription>Detailed insights into batch performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">Reports Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Detailed analytics and reports will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <BatchSettingsTab batch={batch} />
        </TabsContent>
      </Tabs>

      {/* Console Sheet for Participant VM */}
      <Sheet open={!!consoleSheetVM} onOpenChange={() => setConsoleSheetVM(null)}>
        <SheetContent side="full" className="">
          {consoleVM && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Console — {consoleVM.assignedTo}
                </SheetTitle>
                <SheetDescription>{consoleVM.vmName} • {consoleVM.ipAddress}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Terminal Preview */}
                <div className="rounded-lg bg-[hsl(var(--foreground))] p-4 font-mono text-xs leading-relaxed text-[hsl(var(--background))] min-h-[200px]">
                  {terminalLines.map((line, i) => (
                    <div key={i} className="opacity-80">{line}</div>
                  ))}
                </div>

                {/* Connection Details */}
                <div className="rounded-xl border border-border p-4 space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connection Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">IP Address</span>
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono">{consoleVM.ipAddress}</code>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { navigator.clipboard.writeText(consoleVM.ipAddress); toast({ title: "Copied" }); }}>
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">SSH Command</span>
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono text-xs">ssh root@{consoleVM.ipAddress}</code>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => { navigator.clipboard.writeText(`ssh root@${consoleVM.ipAddress}`); toast({ title: "SSH Copied" }); }}>
                          <Copy className="h-2.5 w-2.5" />
                        </Button>
                      </div>
                    </div>
                    {vm?.trainerVM.credentials && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Password</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono text-xs">{showPassword ? vm.trainerVM.credentials.password : "••••••••"}</code>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* VM Actions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { restartParticipantVM(batch.id, consoleVM.id); toast({ title: "Restarting VM" }); }}>
                      <RotateCcw className="mr-1.5 h-3 w-3" />Restart
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { recloneParticipantVM(batch.id, consoleVM.id); toast({ title: "Recloning from Golden" }); setConsoleSheetVM(null); }}>
                      <Copy className="mr-1.5 h-3 w-3" />Reclone
                    </Button>
                    {consoleVM.status === "running" ? (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => { stopParticipantVM(batch.id, consoleVM.id); toast({ title: "VM Stopped" }); }}>
                        <PowerOff className="mr-1.5 h-3 w-3" />Stop
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => { startParticipantVM(batch.id, consoleVM.id); toast({ title: "VM Starting" }); }}>
                        <Power className="mr-1.5 h-3 w-3" />Start
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => { window.open(`https://console.cloudadda.io/vm/${consoleVM.id}`, "_blank"); }}>
                      <ExternalLink className="mr-1.5 h-3 w-3" />External
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
