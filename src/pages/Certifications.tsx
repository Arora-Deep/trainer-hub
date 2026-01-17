import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Award, CheckCircle, Clock, Download } from "lucide-react";

const certifications = [
  { id: "1", name: "AWS Solutions Architect", program: "Cloud Architecture Certificate", issued: 45, pending: 12, validityPeriod: "2 years", status: "active", passingScore: 70 },
  { id: "2", name: "Full Stack Developer", program: "Full Stack Development Bootcamp", issued: 89, pending: 23, validityPeriod: "Lifetime", status: "active", passingScore: 75 },
  { id: "3", name: "Data Science Professional", program: "Data Science Fundamentals", issued: 34, pending: 8, validityPeriod: "3 years", status: "active", passingScore: 80 },
  { id: "4", name: "DevOps Engineer", program: "DevOps Engineering Path", issued: 56, pending: 15, validityPeriod: "2 years", status: "draft", passingScore: 70 },
  { id: "5", name: "Cybersecurity Analyst", program: "Cybersecurity Essentials", issued: 0, pending: 0, validityPeriod: "1 year", status: "draft", passingScore: 85 },
];

export default function Certifications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredCertifications = certifications.filter((cert) => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || cert.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: certifications.length,
    active: certifications.filter(c => c.status === "active").length,
    draft: certifications.filter(c => c.status === "draft").length,
  };

  const totalIssued = certifications.reduce((sum, c) => sum + c.issued, 0);
  const totalPending = certifications.reduce((sum, c) => sum + c.pending, 0);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Certifications"
        description="Manage certificate templates and track issuance"
        breadcrumbs={[{ label: "Certifications" }]}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Certification
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Issued:</span>
          <span className="font-semibold">{totalIssued}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-warning" />
          <span className="text-muted-foreground">Pending:</span>
          <span className="font-semibold">{totalPending}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="active" className="text-xs">Active ({counts.active})</TabsTrigger>
            <TabsTrigger value="draft" className="text-xs">Draft ({counts.draft})</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCertifications.map((cert) => (
          <Card key={cert.id} className="hover:border-border/80 transition-colors group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Template</DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Issued
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <h3 className="font-medium text-sm mb-1">{cert.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{cert.program}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>Pass: {cert.passingScore}%</span>
                <span>•</span>
                <span>Valid: {cert.validityPeriod}</span>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-success" />
                    {cert.issued} issued
                  </span>
                  {cert.pending > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <Clock className="h-3.5 w-3.5" />
                      {cert.pending} pending
                    </span>
                  )}
                </div>
                <StatusBadge
                  status={getStatusVariant(cert.status) as any}
                  label={cert.status}
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
