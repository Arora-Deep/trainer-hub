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
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Users, Calendar, Play, RefreshCw, Clock, BookOpen, Megaphone, Plus, Server,
  Monitor, Loader2, ExternalLink, Copy, CheckCircle2, Terminal, Mail,
  ClipboardList, Settings, GraduationCap, TrendingUp, Zap, BarChart3,
  AlertCircle, Globe, Building2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useBatchStore } from "@/stores/batchStore";
import { useCourseStore } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StudentsTab } from "@/components/batches/StudentsTab";
import { BatchSettingsTab } from "@/components/batches/BatchSettingsTab";
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

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBatch, addAnnouncement, setCourse, provisionTrainerVM, markTrainerVMConfigured, cloneTrainerVMForBatch } = useBatchStore();
  const { courses } = useCourseStore();
  const { templates } = useLabStore();

  const batch = getBatch(id || "");

  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [assignCourseOpen, setAssignCourseOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

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
          <StatusBadge
            status={statusMap[batch.status].status}
            label={statusMap[batch.status].label}
            pulse={batch.status === "live"}
          />
          <Button variant="outline" size="sm"><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Refresh</Button>
          {batch.status === "live" && (
            <Button size="sm"><Play className="mr-1.5 h-3.5 w-3.5" />Start Session</Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Students", value: `${batch.students.length}/${batch.seatCount}`, icon: Users, desc: "enrolled" },
          { label: "Days Left", value: daysRemaining(), icon: Calendar, desc: `ends ${formatDate(batch.endDate)}` },
          { label: "VMs Active", value: vm ? (vm.studentVMs.filter(v => v.status === "running").length || (vm.trainerVM.status !== "not_provisioned" ? 1 : 0)) : 0, icon: Monitor, desc: "running" },
          { label: "Medium", value: mediumConfig[batch.medium]?.label || batch.medium, icon: MediumIcon, desc: "delivery" },
          { label: "Announcements", value: batch.announcements.length, icon: Megaphone, desc: "posted" },
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
              { value: "students", label: "Students", icon: Users, count: batch.students.length },
              { value: "vms", label: "VMs", icon: Monitor },
              { value: "course", label: "Course", icon: BookOpen },
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
            {/* Main Info */}
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

              {/* Settings Quick View */}
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

            {/* Sidebar */}
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

              {/* VM Status Quick Card */}
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
                      <span className="text-sm text-muted-foreground">Student VMs</span>
                      <span className="font-semibold text-sm">{vm.studentVMs.length}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <StudentsTab batch={batch} />
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
                    { label: "Student VMs", value: vm.studentVMs.length },
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
                    <CardDescription>Provision → Configure → Clone for all students</CardDescription>
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
                              <p className="text-xs text-muted-foreground">Create identical VMs for all {batch.seatCount} students</p>
                            </div>
                          </div>
                          {trainerStatus === "configured" && vm.cloneStatus === "not_cloned" && (
                            <Button size="sm" onClick={() => { cloneTrainerVMForBatch(batch.id); toast({ title: "Cloning Started" }); }}>
                              <Copy className="mr-2 h-4 w-4" />Clone
                            </Button>
                          )}
                          {vm.cloneStatus === "cloning" && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Cloning...</div>}
                          {vm.cloneStatus === "cloned" && <StatusBadge status="success" label={`${vm.studentVMs.length} VMs`} />}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Student VMs Table */}
                {vm.cloneStatus === "cloned" && vm.studentVMs.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-primary" />
                        Student VMs ({vm.studentVMs.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-medium">Assigned To</TableHead>
                            <TableHead className="font-medium">VM Name</TableHead>
                            <TableHead className="font-medium">IP Address</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="w-24"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {vm.studentVMs.map((svm) => (
                            <TableRow key={svm.id} className="group">
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
                                  status={svm.status === "running" ? "success" : svm.status === "error" ? "error" : "warning"}
                                  label={svm.status === "running" ? "Running" : svm.status === "error" ? "Error" : "Starting"}
                                />
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => { toast({ title: "Console", description: `Opening console for ${svm.assignedTo}...` }); }}>
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
              {batch.courseName ? (
                <div className="rounded-xl border border-border p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{batch.courseName}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to this batch</p>
                    </div>
                  </div>
                </div>
              ) : (
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

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Announcements</CardTitle>
                <CardDescription>Broadcast messages to all students</CardDescription>
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
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">Create an announcement to broadcast to all students.</p>
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
    </div>
  );
}
