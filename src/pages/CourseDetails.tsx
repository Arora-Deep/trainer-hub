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
import {
  BookOpen,
  Users,
  FlaskConical,
  Clock,
  Edit,
  ExternalLink,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

// Mock data
const courseDetails = {
  id: 1,
  name: "AWS Solutions Architect Professional",
  description: "Comprehensive training program for AWS Solutions Architect Professional certification. Covers advanced architectural concepts, best practices, and hands-on labs.",
  deliveryType: "instructor-led",
  duration: "40 hours",
  modules: 12,
  lessons: 48,
  status: "active",
};

const attachedLabs = [
  { id: 1, name: "EC2 Instance Setup", type: "Linux", duration: "60 min" },
  { id: 2, name: "S3 Bucket Configuration", type: "AWS Console", duration: "45 min" },
  { id: 3, name: "VPC Network Design", type: "AWS Console", duration: "90 min" },
  { id: 4, name: "Lambda Functions", type: "AWS Console", duration: "60 min" },
];

const enrolledBatches = [
  { id: 1, name: "AWS SA - Batch 12", trainer: "John Smith", students: 24, status: "live" },
  { id: 2, name: "AWS SA - Batch 11", trainer: "Jane Doe", students: 22, status: "completed" },
  { id: 3, name: "AWS SA - Batch 13", trainer: "Mike Johnson", students: 18, status: "upcoming" },
];

export default function CourseDetails() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title={courseDetails.name}
        description={courseDetails.description}
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: courseDetails.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/course-builder/${id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit in Builder
              </Link>
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
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{courseDetails.modules}</p>
                <p className="text-sm text-muted-foreground">Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-info/10 p-3">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{courseDetails.duration}</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <Users className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{enrolledBatches.length}</p>
                <p className="text-sm text-muted-foreground">Batches</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <FlaskConical className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{attachedLabs.length}</p>
                <p className="text-sm text-muted-foreground">Labs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="labs">Attached Labs</TabsTrigger>
          <TabsTrigger value="batches">Enrolled Batches</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Type</p>
                    <StatusBadge status="primary" label="Instructor-led" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status="success" label="Active" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="font-medium">{courseDetails.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                    <p className="font-medium">{courseDetails.lessons} lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-success" />
                    <span>Batch 12 started on Jan 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-info" />
                    <span>New lab "Lambda Functions" attached</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                    <span>Batch 11 completed on Jan 10, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Course Content</CardTitle>
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in Moodle
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Moodle LMS Content</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Course content is managed through Moodle LMS and will be embedded here.
                  Click "Open in Moodle" to edit the content directly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Attached Labs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attachedLabs.map((lab) => (
                    <TableRow key={lab.id}>
                      <TableCell className="font-medium">{lab.name}</TableCell>
                      <TableCell>
                        <StatusBadge status="info" label={lab.type} />
                      </TableCell>
                      <TableCell>{lab.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batches">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enrolled Batches</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <Link to={`/batches/${batch.id}`} className="font-medium text-primary hover:underline">
                          {batch.name}
                        </Link>
                      </TableCell>
                      <TableCell>{batch.trainer}</TableCell>
                      <TableCell className="text-center">{batch.students}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={batch.status === "live" ? "success" : batch.status === "upcoming" ? "primary" : "default"}
                          label={batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium">No assessments configured</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Assessments for this course will appear here once configured.
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
                <div className="text-4xl mb-4">📊</div>
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