import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import { useParams } from "react-router-dom";

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
  { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 75, lastActive: "2 hours ago" },
  { id: 2, name: "Bob Williams", email: "bob@example.com", progress: 60, lastActive: "1 hour ago" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", progress: 90, lastActive: "30 min ago" },
  { id: 4, name: "David Brown", email: "david@example.com", progress: 45, lastActive: "5 hours ago" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", progress: 80, lastActive: "1 hour ago" },
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
    <div className="space-y-6">
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
            <Button>
              <Play className="mr-2 h-4 w-4" />
              Start Session
            </Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{batchDetails.students}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <Calendar className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">12</p>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-info/10 p-3">
                <FlaskConical className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">3</p>
                <p className="text-sm text-muted-foreground">Labs Assigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <StatusBadge status="success" label="Live" />
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
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
                <CardTitle className="text-base">Batch Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Course</p>
                    <p className="font-medium">{batchDetails.course}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trainer</p>
                    <p className="font-medium">{batchDetails.trainer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{batchDetails.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{batchDetails.endDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{announcement.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Students ({students.length})</CardTitle>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Students
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {student.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{student.lastActive}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
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

        <TabsContent value="labs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Assigned Labs</CardTitle>
              <Button size="sm">
                <FlaskConical className="mr-2 h-4 w-4" />
                Attach Lab
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-center">Completions</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedLabs.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">{lab.name}</TableCell>
                      <TableCell>
                        <StatusBadge status="info" label={lab.type} />
                      </TableCell>
                      <TableCell>{lab.duration}</TableCell>
                      <TableCell className="text-center">{lab.completions}/{batchDetails.students}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell className="text-center text-success">{record.present}</TableCell>
                      <TableCell className="text-center text-destructive">{record.absent}</TableCell>
                      <TableCell className="text-center">
                        {Math.round((record.present / (record.present + record.absent)) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Announcements</CardTitle>
              <Button size="sm">
                <Mail className="mr-2 h-4 w-4" />
                New Announcement
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{announcement.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{announcement.date}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Assessments</CardTitle>
              <Button size="sm">
                <ClipboardList className="mr-2 h-4 w-4" />
                Create Assessment
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No assessments yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
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
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-muted-foreground mb-4">📊</div>
                <h3 className="text-lg font-medium">Reports Coming Soon</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
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