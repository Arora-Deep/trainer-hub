import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const batchDetails = {
  id: 1,
  name: "AWS Solutions Architect - Batch 12",
  course: "AWS SA Pro",
  trainer: "John Smith",
  startDate: "Jan 15, 2024",
  endDate: "Feb 15, 2024",
  students: 24,
  status: "live",
  description: "Comprehensive AWS Solutions Architect training covering EC2, S3, VPC, and more.",
};

const students = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 75, lastActive: "2 hours ago", avatar: "alice" },
  { id: 2, name: "Bob Williams", email: "bob@example.com", progress: 60, lastActive: "1 hour ago", avatar: "bob" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", progress: 90, lastActive: "30 min ago", avatar: "carol" },
  { id: 4, name: "David Brown", email: "david@example.com", progress: 45, lastActive: "5 hours ago", avatar: "david" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", progress: 80, lastActive: "1 hour ago", avatar: "eva" },
];

const assignedLabs = [
  { id: 1, name: "EC2 Instance Setup", type: "Linux", duration: "60 min", completions: 20 },
  { id: 2, name: "S3 Bucket Configuration", type: "AWS Console", duration: "45 min", completions: 18 },
  { id: 3, name: "VPC Network Design", type: "AWS Console", duration: "90 min", completions: 15 },
];

const attendance = [
  { date: "Jan 15, 2024", present: 22, absent: 2 },
  { date: "Jan 16, 2024", present: 24, absent: 0 },
  { date: "Jan 17, 2024", present: 21, absent: 3 },
  { date: "Jan 18, 2024", present: 23, absent: 1 },
];

const announcements = [
  { id: 1, title: "Lab Schedule Update", content: "Tomorrow's lab session will start 30 minutes early.", date: "Jan 17, 2024" },
  { id: 2, title: "New Study Materials", content: "Additional practice tests have been uploaded to the course portal.", date: "Jan 16, 2024" },
];

export default function BatchDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title={batchDetails.name}
        description={batchDetails.description}
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: batchDetails.name },
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
          value={batchDetails.students}
          icon={Users}
          variant="primary"
          size="compact"
        />
        <StatCard
          title="Days Remaining"
          value={12}
          icon={Calendar}
          variant="success"
          size="compact"
        />
        <StatCard
          title="Labs Assigned"
          value={3}
          icon={FlaskConical}
          variant="info"
          size="compact"
        />
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <StatusBadge status="success" label="Live" pulse />
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
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
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
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
                    <p className="font-medium">{batchDetails.course}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Trainer</p>
                    <p className="font-medium">{batchDetails.trainer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</p>
                    <p className="font-medium tabular-nums">{batchDetails.startDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">End Date</p>
                    <p className="font-medium tabular-nums">{batchDetails.endDate}</p>
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
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1.5">{announcement.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Students ({students.length})</CardTitle>
                <CardDescription>Manage enrolled students and track their progress</CardDescription>
              </div>
              <Button size="sm" className="shadow-sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Students
              </Button>
            </CardHeader>
            <CardContent className="p-0">
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
                  {students.map((student) => (
                    <TableRow key={student.id} className="table-row-premium group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-primary/10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.avatar}`} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {student.name.split(" ").map(n => n[0]).join("")}
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Send Message</DropdownMenuItem>
                            <DropdownMenuItem>View Progress</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Assigned Labs</CardTitle>
                <CardDescription>Labs attached to this batch for hands-on practice</CardDescription>
              </div>
              <Button size="sm" className="shadow-sm">
                <FlaskConical className="mr-2 h-4 w-4" />
                Attach Lab
              </Button>
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
                  {assignedLabs.map((lab) => (
                    <TableRow key={lab.id} className="table-row-premium group">
                      <TableCell className="font-medium">{lab.name}</TableCell>
                      <TableCell>
                        <StatusBadge status="info" label={lab.type} dot={false} />
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{lab.duration}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{lab.completions}</span>
                        <span className="text-muted-foreground">/{batchDetails.students}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attendance Record</CardTitle>
              <CardDescription>Track daily attendance for all sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium text-center">Present</TableHead>
                    <TableHead className="font-medium text-center">Absent</TableHead>
                    <TableHead className="font-medium text-center">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record, index) => {
                    const rate = Math.round((record.present / (record.present + record.absent)) * 100);
                    return (
                      <TableRow key={index} className="table-row-premium">
                        <TableCell className="font-medium tabular-nums">{record.date}</TableCell>
                        <TableCell className="text-center">
                          <span className="text-success font-medium">{record.present}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-destructive font-medium">{record.absent}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge 
                            status={rate >= 90 ? "success" : rate >= 75 ? "warning" : "error"} 
                            label={`${rate}%`}
                            dot={false}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
              <Button size="sm" className="shadow-sm">
                <Mail className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-xl border border-border p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{announcement.date}</span>
                  </div>
                </div>
              ))}
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
