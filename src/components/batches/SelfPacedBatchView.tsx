import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Clock, Users, Monitor, BookOpen, ClipboardList, Settings, BarChart3,
  ExternalLink, PowerOff, Sparkles,
} from "lucide-react";
import type { Batch } from "@/stores/batchStore";
import type { Course } from "@/stores/courseStore";
import { motion } from "framer-motion";

interface Props {
  batch: Batch;
  course?: Course;
}

// Mock running VMs / learners for demo purposes
const mockLearners = [
  { id: "l1", name: "Aarav Mehta", email: "aarav@acme.com", hoursUsed: 18, hoursTotal: 120, expiresIn: "42 days", progress: 35 },
  { id: "l2", name: "Priya Sharma", email: "priya@acme.com", hoursUsed: 72, hoursTotal: 120, expiresIn: "8 days", progress: 78 },
  { id: "l3", name: "Rohan Verma", email: "rohan@acme.com", hoursUsed: 4, hoursTotal: 120, expiresIn: "58 days", progress: 12 },
  { id: "l4", name: "Sneha Iyer", email: "sneha@acme.com", hoursUsed: 120, hoursTotal: 120, expiresIn: "Expired", progress: 100 },
];

const mockRunningVMs = [
  { id: "v1", learner: "Aarav Mehta", lab: "S3 Bucket Lab", template: "AWS Sandbox", status: "running", timeLeft: "42 min" },
  { id: "v2", learner: "Priya Sharma", lab: "Lambda Lab", template: "AWS Sandbox", status: "running", timeLeft: "11 min" },
  { id: "v3", learner: "Rohan Verma", lab: "EC2 Lab", template: "AWS Sandbox", status: "provisioning", timeLeft: "—" },
];

export function SelfPacedBatchView({ batch, course }: Props) {
  const enrolled = batch.enrolledCount ?? mockLearners.length;
  const running = mockRunningVMs.filter((v) => v.status === "running").length;
  const hoursConsumed = mockLearners.reduce((a, l) => a + l.hoursUsed, 0);
  const avgProgress = Math.round(mockLearners.reduce((a, l) => a + l.progress, 0) / Math.max(mockLearners.length, 1));

  const labLessons = (course?.chapters || []).flatMap((ch) =>
    ch.lessons.filter((l) => l.type === "lab" || l.lab).map((l) => ({ chapter: ch.title, lesson: l }))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <PageHeader
          title={batch.name}
          description={batch.description}
          breadcrumbs={[{ label: "Batches", href: "/batches" }, { label: batch.name }]}
        />
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="capitalize gap-1 text-xs">
            <Clock className="h-3 w-3" /> Self-paced
          </Badge>
          <StatusBadge status="success" label="Live" pulse />
          {course && (
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link to={`/courses/${course.id}`}>
                <BookOpen className="h-3.5 w-3.5" /> Open course
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Enrolled", value: enrolled, icon: Users, desc: "learners" },
          { label: "Running VMs", value: running, icon: Monitor, desc: "right now" },
          { label: "Hours Consumed", value: `${hoursConsumed}h`, icon: Clock, desc: "this batch" },
          { label: "Avg Progress", value: `${avgProgress}%`, icon: BarChart3, desc: "course completion" },
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

      {/* Course config inherited banner */}
      {course && (
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Inherited from course
              </CardTitle>
              <CardDescription>
                Access model, VM hours, and per-lab templates are configured on the course — edit them there.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link to={`/courses/${course.id}`}>
                Edit in course <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { label: "Access Model", value: course.settings?.accessModel || "full-course" },
                { label: "VM Hours / Learner", value: course.settings?.totalAccessHours ?? "—" },
                { label: "Validity After Launch", value: `${course.settings?.validityAfterLaunchDays ?? "—"} d` },
                { label: "Idle Shutdown", value: `${course.settings?.defaultIdleShutdownMin ?? "—"} min` },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.label}</p>
                  <p className="font-semibold text-sm capitalize mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="learners" className="space-y-6">
        <div className="border-b border-border">
          <TabsList className="bg-transparent p-0 h-auto space-x-1">
            {[
              { value: "learners", label: "Learners", icon: Users },
              { value: "vms", label: "Running VMs", icon: Monitor },
              { value: "assessments", label: "Assessments", icon: ClipboardList },
              { value: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-2 text-sm gap-1.5"
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="learners">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enrolled learners</CardTitle>
              <CardDescription>Floating enrollment — learners join and progress at their own pace.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Hours Used</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLearners.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{l.name}</p>
                          <p className="text-[11px] text-muted-foreground">{l.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm tabular-nums">{l.hoursUsed} / {l.hoursTotal} h</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${l.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums">{l.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={l.expiresIn === "Expired" ? "destructive" : "outline"} className="text-[10px]">{l.expiresIn}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-xs h-7">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vms">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Running VMs</CardTitle>
              <CardDescription>Student-launched on-demand VMs currently provisioned.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Learner</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time Left</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRunningVMs.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="text-sm">{v.learner}</TableCell>
                      <TableCell className="text-sm">{v.lab}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{v.template}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={v.status === "running" ? "success" : "warning"}
                          label={v.status}
                        />
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">{v.timeLeft}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive gap-1">
                          <PowerOff className="h-3 w-3" /> Force stop
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {mockRunningVMs.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">No VMs running right now.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assessments</CardTitle>
              <CardDescription>Quiz, assignment and exam progress across enrolled learners.</CardDescription>
            </CardHeader>
            <CardContent>
              {labLessons.length === 0 && !course ? (
                <p className="text-xs text-muted-foreground text-center py-8">Link a course to see assessments.</p>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">
                  Assessment progress will populate once learners attempt them.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch settings</CardTitle>
              <CardDescription>
                Enrollment-only settings live here. Lab settings (templates, hours, idle shutdown) are managed on the course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">Enrollment mode</p>
                  <p className="text-xs text-muted-foreground">{batch.selfPacedConfig?.enrollmentMode || "always-open"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">Max concurrent learners</p>
                  <p className="text-xs text-muted-foreground">{batch.selfPacedConfig?.maxConcurrentLearners ?? "—"}</p>
                </div>
              </div>
              {course && (
                <div className="p-3 rounded-lg border border-dashed border-border bg-muted/20 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">Lab &amp; access settings</p>
                    <p className="text-xs text-muted-foreground">Configured on the course — open it to change templates, runtime caps, or VM hours.</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs shrink-0">
                    <Link to={`/courses/${course.id}`}>Open course <ExternalLink className="h-3 w-3" /></Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
