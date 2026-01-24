import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useCertificationStore } from "@/stores/certificationStore";
import { useToast } from "@/hooks/use-toast";

const Certifications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { certifications, deleteCertification, addCertification } = useCertificationStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<string | null>(null);

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

  const handleView = (id: string) => {
    navigate(`/certifications/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/certifications/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setCertToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (certToDelete) {
      const cert = certifications.find(c => c.id === certToDelete);
      deleteCertification(certToDelete);
      toast({
        title: "Certification Deleted",
        description: `"${cert?.name}" has been deleted.`,
      });
      setCertToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleDuplicate = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    if (cert) {
      addCertification({
        name: `${cert.name} (Copy)`,
        description: cert.description,
        program: cert.program,
        passingScore: cert.passingScore,
        validityPeriod: cert.validityPeriod,
        validityYears: cert.validityYears,
        status: "draft",
        requirements: [...cert.requirements],
        badgeColor: cert.badgeColor,
      });
      toast({
        title: "Certification Duplicated",
        description: `A copy of "${cert.name}" has been created.`,
      });
    }
  };

  const handleExport = (id: string) => {
    const cert = certifications.find(c => c.id === id);
    toast({
      title: "Export Started",
      description: `Exporting issued certificates for "${cert?.name}"...`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certifications"
        description="Manage certification templates and track issued certificates"
        actions={
          <Button className="gap-2" onClick={() => navigate("/certifications/create")}>
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
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem onClick={() => handleView(cert.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(cert.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Template
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport(cert.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Export Issued
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(cert.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(cert.id)}
                        >
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Certification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this certification? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Certifications;
