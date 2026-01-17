import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Award, 
  CheckCircle,
  Clock,
  Users,
  Edit,
  Copy,
  Trash2,
  Eye,
  Download
} from "lucide-react";

const certifications = [
  {
    id: "1",
    name: "AWS Solutions Architect",
    program: "Cloud Architecture Certificate",
    issued: 45,
    pending: 12,
    validityPeriod: "2 years",
    status: "active",
    passingScore: 70,
  },
  {
    id: "2",
    name: "Full Stack Developer",
    program: "Full Stack Development Bootcamp",
    issued: 89,
    pending: 23,
    validityPeriod: "Lifetime",
    status: "active",
    passingScore: 75,
  },
  {
    id: "3",
    name: "Data Science Professional",
    program: "Data Science Fundamentals",
    issued: 34,
    pending: 8,
    validityPeriod: "3 years",
    status: "active",
    passingScore: 80,
  },
  {
    id: "4",
    name: "DevOps Engineer",
    program: "DevOps Engineering Path",
    issued: 56,
    pending: 15,
    validityPeriod: "2 years",
    status: "draft",
    passingScore: 70,
  },
  {
    id: "5",
    name: "Cybersecurity Analyst",
    program: "Cybersecurity Essentials",
    issued: 0,
    pending: 0,
    validityPeriod: "1 year",
    status: "draft",
    passingScore: 85,
  },
];

const Certifications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || cert.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === "active").length,
    totalIssued: certifications.reduce((sum, c) => sum + c.issued, 0),
    totalPending: certifications.reduce((sum, c) => sum + c.pending, 0),
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications"
        description="Manage certification templates and track issued certificates"
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Certification
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Certifications"
          value={stats.total}
          icon={Award}
        />
        <StatCard
          title="Active Templates"
          value={stats.active}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Certificates Issued"
          value={stats.totalIssued}
          icon={Users}
          variant="info"
        />
        <StatCard
          title="Pending Review"
          value={stats.totalPending}
          icon={Clock}
          variant="warning"
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {["all", "active", "draft"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className="capitalize"
                >
                  {filter}
                </Button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search certifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certification Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Passing Score</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertifications.map((cert) => (
                <TableRow key={cert.id} className="table-row-premium">
                  <TableCell className="font-medium">{cert.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cert.program}</TableCell>
                  <TableCell>{cert.passingScore}%</TableCell>
                  <TableCell>{cert.validityPeriod}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      {cert.issued}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      {cert.pending}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={getStatusVariant(cert.status) as any}
                      label={cert.status}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Export Issued
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Certifications;
