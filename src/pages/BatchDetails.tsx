import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Calendar,
  FlaskConical,
  Play,
  UserPlus,
  RefreshCw,
  MoreHorizontal,
  Mail,
  ClipboardList,
  Clock,
  BookOpen,
  Megaphone,
  Trash2,
  Plus,
  Server,
  DollarSign,
  Eye,
  Shield,
  CheckCircle2,
  Loader2,
  Monitor,
  Cpu,
  HardDrive,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBatchStore, type LabConfig } from "@/stores/batchStore";
import { useCourseStore } from "@/stores/courseStore";
import { useLabStore } from "@/stores/labStore";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

const statusMap: Record<string, { status: "success" | "warning" | "primary" | "default"; label: string }> = {
  upcoming: { status: "primary", label: "Upcoming" },
  live: { status: "success", label: "Live" },
  completed: { status: "default", label: "Completed" },
};

export default function BatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBatch, addStudent, removeStudent, assignLab, removeLab, addAnnouncement, setCourse, updateLabConfig, provisionLab } = useBatchStore();
  const { courses } = useCourseStore();
  const { labs, templates } = useLabStore();

  const batch = getBatch(id || "");

  // Dialog states
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [assignLabOpen, setAssignLabOpen] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState("");

  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");

  const [assignCourseOpen, setAssignCourseOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  if (!batch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <p className="text-muted-foreground mt-2">The batch you're looking for doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate("/batches")}>
            Back to Batches
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !newStudentEmail.trim()) {
      toast({ title: "Error", description: "Name and email are required", variant: "destructive" });
      return;
    }
    addStudent(batch.id, { name: newStudentName.trim(), email: newStudentEmail.trim() });
    toast({ title: "Success", description: "Student added successfully" });
    setNewStudentName("");
    setNewStudentEmail("");
    setAddStudentOpen(false);
  };

  const handleAssignLab = () => {
    const lab = labs.find((l) => l.id === selectedLabId);
    if (!lab) {
      toast({ title: "Error", description: "Please select a lab", variant: "destructive" });
      return;
    }
    assignLab(batch.id, {
      labId: lab.id,
      name: lab.name,
      type: lab.templateName,
      duration: "60 min",
    });
    toast({ title: "Success", description: "Lab assigned successfully" });
    setSelectedLabId("");
    setAssignLabOpen(false);
  };

  const handleAddAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast({ title: "Error", description: "Title and content are required", variant: "destructive" });
      return;
    }
    addAnnouncement(batch.id, { title: announcementTitle.trim(), content: announcementContent.trim() });
    toast({ title: "Success", description: "Announcement posted successfully" });
    setAnnouncementTitle("");
    setAnnouncementContent("");
    setAnnouncementOpen(false);
  };

  const handleAssignCourse = () => {
    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) {
      toast({ title: "Error", description: "Please select a course", variant: "destructive" });
      return;
    }
    setCourse(batch.id, course.id, course.name);
    toast({ title: "Success", description: "Course assigned successfully" });
    setSelectedCourseId("");
    setAssignCourseOpen(false);
  };

  const daysRemaining = () => {
    try {
      const end = new Date(batch.endDate);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title={batch.name}
        description={batch.description}
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: batch.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Lab
            </Button>
            <Button className="shadow-md">
              <Play className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Students"
          value={batch.students.length}
          icon={Users}
          variant="primary"
          size="compact"
        />
        <StatCard
          title="Days Remaining"
          value={daysRemaining()}
          icon={Calendar}
          variant="success"
          size="compact"
        />
        <StatCard
          title="Labs Assigned"
          value={batch.assignedLabs.length}
          icon={FlaskConical}
          variant="info"
          size="compact"
        />
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <StatusBadge
              status={statusMap[batch.status].status}
              label={statusMap[batch.status].label}
              pulse={batch.status === "live"}
            />
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-muted-foreground capitalize">{batch.status}</p>
            </div>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="labs">Labs Assigned</TabsTrigger>
          <TabsTrigger value="course">Course/Program</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Batch Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Course</p>
                    <p className="font-medium">{batch.courseName || "Not assigned"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Instructors</p>
                    <p className="font-medium">{batch.instructors.join(", ") || "None"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</p>
                    <p className="font-medium tabular-nums">{formatDate(batch.startDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">End Date</p>
                    <p className="font-medium tabular-nums">{formatDate(batch.endDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Seat Count</p>
                    <p className="font-medium">{batch.seatCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Medium</p>
                    <p className="font-medium capitalize">{batch.medium}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-primary" />
                  Recent Announcements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {batch.announcements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No announcements yet.</p>
                ) : (
                  batch.announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <p className="font-medium text-sm">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1.5">{announcement.date}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Students ({batch.students.length}/{batch.seatCount})</CardTitle>
                <CardDescription>Manage enrolled students and track their progress</CardDescription>
              </div>
              <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Students
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Student</DialogTitle>
                    <DialogDescription>Add a new student to this batch.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Name</Label>
                      <Input
                        id="studentName"
                        placeholder="Student name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentEmail">Email</Label>
                      <Input
                        id="studentEmail"
                        type="email"
                        placeholder="student@example.com"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddStudentOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStudent}>Add Student</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
              {batch.students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold">No students enrolled</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                    Add students to this batch to get started.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-medium">Student</TableHead>
                      <TableHead className="font-medium">Email</TableHead>
                      <TableHead className="font-medium">Progress</TableHead>
                      <TableHead className="font-medium">Last Active</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batch.students.map((student) => (
                      <TableRow key={student.id} className="table-row-premium group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border-2 border-primary/10">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                {student.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{student.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <ProgressBar
                              value={student.progress}
                              size="sm"
                              variant={student.progress >= 75 ? "success" : student.progress >= 50 ? "primary" : "warning"}
                              showValue
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{student.lastActive}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  removeStudent(batch.id, student.id);
                                  toast({ title: "Removed", description: "Student removed from batch" });
                                }}
                              >
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <div className="space-y-6">
            {/* Lab Configurations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    Lab Configurations
                  </CardTitle>
                  <CardDescription>Manage and provision lab environments for this batch</CardDescription>
                </div>
                <Button size="sm" className="shadow-sm" onClick={() => navigate(`/batches/create`)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lab Config
                </Button>
              </CardHeader>
              <CardContent>
                {batch.labConfigs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FlaskConical className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold">No labs configured</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                      Create lab configurations when setting up the batch or add them later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batch.labConfigs.map((labConfig) => {
                      const totalVMs = (labConfig.vmType === "multi" ? labConfig.vmTemplates.length : 1) * labConfig.participantCount + labConfig.adminCount;
                      const isApproved = labConfig.approval.cloudAdda === "approved" && labConfig.approval.companyAdmin === "approved";
                      
                      return (
                        <div key={labConfig.id} className="p-4 rounded-xl border border-border/50 bg-muted/20 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <FlaskConical className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{labConfig.name}</h4>
                                <p className="text-sm text-muted-foreground">{labConfig.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {labConfig.status === "draft" && (
                                <StatusBadge status="default" label="Draft" />
                              )}
                              {labConfig.status === "pending_approval" && (
                                <StatusBadge status="warning" label="Pending Approval" pulse />
                              )}
                              {labConfig.status === "approved" && (
                                <StatusBadge status="primary" label="Approved" />
                              )}
                              {labConfig.status === "provisioning" && (
                                <StatusBadge status="warning" label="Provisioning" pulse />
                              )}
                              {labConfig.status === "active" && (
                                <StatusBadge status="success" label="Active" pulse />
                              )}
                              {labConfig.status === "completed" && (
                                <StatusBadge status="default" label="Completed" />
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="p-3 rounded-lg bg-background/50">
                              <p className="text-xs text-muted-foreground">Total VMs</p>
                              <p className="font-semibold">{totalVMs}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <p className="text-xs text-muted-foreground">Participants</p>
                              <p className="font-semibold">{labConfig.participantCount}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <p className="text-xs text-muted-foreground">VM Type</p>
                              <p className="font-semibold capitalize">{labConfig.vmType}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-background/50">
                              <p className="text-xs text-muted-foreground">Total Cost</p>
                              <p className="font-semibold text-primary">${labConfig.pricing.total.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* VM Templates */}
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground font-medium uppercase">Templates</p>
                            <div className="flex flex-wrap gap-2">
                              {labConfig.vmTemplates.map((vm, idx) => {
                                const template = templates.find(t => t.id === vm.templateId);
                                return (
                                  <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                                    <Monitor className="h-3 w-3 text-muted-foreground" />
                                    <span className="font-medium">{vm.instanceName}</span>
                                    {template && (
                                      <span className="text-muted-foreground">
                                        ({template.name})
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Approval Status */}
                          <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">CloudAdda:</span>
                              {labConfig.approval.cloudAdda === "approved" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <span className="text-xs text-muted-foreground">Pending</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Company Admin:</span>
                              {labConfig.approval.companyAdmin === "approved" ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <span className="text-xs text-muted-foreground">Pending</span>
                              )}
                            </div>
                            <div className="flex-1" />
                            
                            {labConfig.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  provisionLab(batch.id, labConfig.id);
                                  toast({ title: "Provisioning Started", description: "Lab instances are being provisioned..." });
                                }}
                                className="bg-gradient-to-r from-primary to-primary/80"
                              >
                                <Play className="mr-2 h-3 w-3" />
                                Provision Lab
                              </Button>
                            )}
                            {labConfig.status === "provisioning" && (
                              <Button size="sm" disabled>
                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                Provisioning...
                              </Button>
                            )}
                            {labConfig.status === "active" && (
                              <Button size="sm" variant="outline">
                                <Eye className="mr-2 h-3 w-3" />
                                View Instances
                              </Button>
                            )}
                          </div>

                          {/* Active Instances */}
                          {labConfig.status === "active" && labConfig.instances.length > 0 && (
                            <div className="pt-3 border-t border-border/50">
                              <p className="text-xs text-muted-foreground font-medium uppercase mb-2">
                                Running Instances ({labConfig.instances.filter(i => i.status === "running").length}/{labConfig.instances.length})
                              </p>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
                                {labConfig.instances.slice(0, 8).map((instance) => (
                                  <div key={instance.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/50 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${instance.status === "running" ? "bg-success" : instance.status === "provisioning" ? "bg-warning animate-pulse" : "bg-muted"}`} />
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium truncate">{instance.studentName}</p>
                                      <p className="text-xs text-muted-foreground truncate">{instance.ipAddress}</p>
                                    </div>
                                  </div>
                                ))}
                                {labConfig.instances.length > 8 && (
                                  <div className="flex items-center justify-center p-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                                    +{labConfig.instances.length - 8} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Legacy Assigned Labs (backward compatibility) */}
            {batch.assignedLabs.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Assigned Labs (Legacy)</CardTitle>
                    <CardDescription>Previously attached lab templates</CardDescription>
                  </div>
                  <Dialog open={assignLabOpen} onOpenChange={setAssignLabOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Attach Lab
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Lab</DialogTitle>
                        <DialogDescription>Select a lab to assign to this batch.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label>Select Lab</Label>
                        <Select value={selectedLabId} onValueChange={setSelectedLabId}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Choose a lab..." />
                          </SelectTrigger>
                          <SelectContent>
                            {labs.map((lab) => (
                              <SelectItem key={lab.id} value={lab.id}>
                                {lab.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignLabOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAssignLab}>Assign Lab</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-medium">Lab Name</TableHead>
                        <TableHead className="font-medium">Type</TableHead>
                        <TableHead className="font-medium">Duration</TableHead>
                        <TableHead className="font-medium text-center">Completions</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batch.assignedLabs.map((lab) => (
                        <TableRow key={lab.id} className="table-row-premium group">
                          <TableCell className="font-medium">{lab.name}</TableCell>
                          <TableCell>
                            <StatusBadge status="info" label={lab.type} dot={false} />
                          </TableCell>
                          <TableCell className="tabular-nums text-muted-foreground">{lab.duration}</TableCell>
                          <TableCell className="text-center">
                            <span className="font-medium">{lab.completions}</span>
                            <span className="text-muted-foreground">/{batch.students.length}</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                              onClick={() => {
                                removeLab(batch.id, lab.id);
                                toast({ title: "Removed", description: "Lab removed from batch" });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="course">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Course/Program</CardTitle>
                <CardDescription>Assign a course or program to this batch</CardDescription>
              </div>
              <Dialog open={assignCourseOpen} onOpenChange={setAssignCourseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    {batch.courseName ? "Change Course" : "Assign Course"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Course</DialogTitle>
                    <DialogDescription>Select a course for this batch.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label>Select Course</Label>
                    <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a course..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAssignCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAssignCourse}>Assign Course</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {batch.courseName ? (
                <div className="rounded-xl border border-border p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold">{batch.courseName}</h4>
                      <p className="text-sm text-muted-foreground">Assigned to this batch</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${batch.courseId}`)}>
                      View Course
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold">No course assigned</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                    Assign a course to this batch to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Announcements</CardTitle>
                <CardDescription>Broadcast messages to all students in this batch</CardDescription>
              </div>
              <Dialog open={announcementOpen} onOpenChange={setAnnouncementOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="shadow-sm">
                    <Mail className="mr-2 h-4 w-4" />
                    New Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Announcement</DialogTitle>
                    <DialogDescription>Create an announcement for this batch.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcementTitle">Title</Label>
                      <Input
                        id="announcementTitle"
                        placeholder="Announcement title"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcementContent">Content</Label>
                      <Textarea
                        id="announcementContent"
                        placeholder="Write your announcement..."
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAnnouncementOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAnnouncement}>Post Announcement</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {batch.announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Megaphone className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold">No announcements yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                    Create an announcement to broadcast to all students.
                  </p>
                </div>
              ) : (
                batch.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">{announcement.date}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Assessments</CardTitle>
                <CardDescription>Create and manage quizzes and tests</CardDescription>
              </div>
              <Button size="sm" className="shadow-sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <ClipboardList className="h-10 w-10 text-muted-foreground/60" />
                </div>
                <h3 className="text-lg font-semibold">No assessments yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                  Create quizzes and tests to evaluate student progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reports & Analytics</CardTitle>
              <CardDescription>Detailed insights into batch performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 text-4xl">
                  📊
                </div>
                <h3 className="text-lg font-semibold">Reports Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1.5">
                  Detailed analytics and reports will be available here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
