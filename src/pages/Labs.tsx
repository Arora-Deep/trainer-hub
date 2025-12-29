import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  RefreshCw,
  Square,
  Clock,
  Terminal,
  MoreHorizontal,
  Cpu,
  HardDrive,
} from "lucide-react";

// Mock data
const labTemplates = [
  { id: 1, name: "AWS EC2 Linux Instance", type: "Linux", os: "Ubuntu 22.04", runtime: "120 min", lastUpdated: "Jan 10, 2024" },
  { id: 2, name: "Windows Server 2022", type: "Windows", os: "Windows Server 2022", runtime: "180 min", lastUpdated: "Jan 8, 2024" },
  { id: 3, name: "Kubernetes Cluster", type: "Linux", os: "Alpine Linux", runtime: "90 min", lastUpdated: "Jan 5, 2024" },
  { id: 4, name: "Docker Environment", type: "Linux", os: "Ubuntu 20.04", runtime: "60 min", lastUpdated: "Dec 28, 2023" },
  { id: 5, name: "Terraform Sandbox", type: "Linux", os: "CentOS 8", runtime: "120 min", lastUpdated: "Jan 12, 2024" },
];

const labInstances = [
  { id: 1, student: "Alice Johnson", batch: "AWS SA - Batch 12", lab: "AWS EC2 Setup", status: "running", timeRemaining: "45 min", cpu: 32, memory: 48 },
  { id: 2, student: "Bob Williams", batch: "K8s - Batch 8", lab: "Kubernetes Pod", status: "running", timeRemaining: "30 min", cpu: 45, memory: 62 },
  { id: 3, student: "Carol Davis", batch: "Docker - Batch 15", lab: "Docker Compose", status: "error", timeRemaining: "15 min", cpu: 0, memory: 0 },
  { id: 4, student: "David Brown", batch: "Terraform - Batch 5", lab: "Terraform Basics", status: "running", timeRemaining: "60 min", cpu: 28, memory: 35 },
  { id: 5, student: "Eva Martinez", batch: "AWS SA - Batch 12", lab: "S3 Configuration", status: "stopped", timeRemaining: "0 min", cpu: 0, memory: 0 },
  { id: 6, student: "Frank Lee", batch: "K8s - Batch 8", lab: "Service Mesh", status: "running", timeRemaining: "85 min", cpu: 55, memory: 70 },
];

const statusConfig: Record<string, { status: "success" | "warning" | "error" | "default"; label: string }> = {
  running: { status: "success", label: "Running" },
  stopped: { status: "default", label: "Stopped" },
  error: { status: "error", label: "Error" },
};

export default function Labs() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Labs"
        description="Manage lab templates and monitor active lab instances"
        breadcrumbs={[{ label: "Labs" }]}
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Lab Template
          </Button>
        }
      />

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Lab Templates</TabsTrigger>
          <TabsTrigger value="instances">Lab Instances (Live)</TabsTrigger>
        </TabsList>

        {/* Lab Templates */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">All Templates</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-10 w-64" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>OS Version</TableHead>
                    <TableHead>Runtime Limit</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={template.type === "Linux" ? "success" : "info"}
                          label={template.type}
                        />
                      </TableCell>
                      <TableCell>{template.os}</TableCell>
                      <TableCell>{template.runtime}</TableCell>
                      <TableCell className="text-muted-foreground">{template.lastUpdated}</TableCell>
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

        {/* Lab Instances (Live) */}
        <TabsContent value="instances" className="space-y-4">
          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-success">4</p>
                    <p className="text-sm text-muted-foreground">Running</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-muted-foreground">1</p>
                    <p className="text-sm text-muted-foreground">Stopped</p>
                  </div>
                  <Square className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold text-destructive">1</p>
                    <p className="text-sm text-muted-foreground">Errors</p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-semibold">40%</p>
                    <p className="text-sm text-muted-foreground">Avg CPU Usage</p>
                  </div>
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">Live Lab Instances</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search instances..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Lab</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Time Left
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Cpu className="h-4 w-4" />
                        CPU
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-4 w-4" />
                        Memory
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labInstances.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell className="font-medium">{instance.student}</TableCell>
                      <TableCell className="text-muted-foreground">{instance.batch}</TableCell>
                      <TableCell>{instance.lab}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={statusConfig[instance.status].status}
                          label={statusConfig[instance.status].label}
                        />
                      </TableCell>
                      <TableCell>{instance.timeRemaining}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-12 rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${instance.cpu}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{instance.cpu}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-12 rounded-full bg-secondary">
                            <div
                              className="h-2 rounded-full bg-info"
                              style={{ width: `${instance.memory}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{instance.memory}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Square className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Clock className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Terminal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}