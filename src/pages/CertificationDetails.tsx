import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCertificationStore } from "@/stores/certificationStore";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Award,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  Target,
  Shield,
  Plus,
  Download,
  Mail,
  XCircle,
} from "lucide-react";

// Mock issued certificates data
const mockIssuedCertificates = [
  { id: "1", studentName: "John Doe", email: "john@example.com", issuedDate: "2024-01-15", expiryDate: "2026-01-15", status: "active" },
  { id: "2", studentName: "Jane Smith", email: "jane@example.com", issuedDate: "2024-01-10", expiryDate: "2026-01-10", status: "active" },
  { id: "3", studentName: "Mike Johnson", email: "mike@example.com", issuedDate: "2023-12-20", expiryDate: "2025-12-20", status: "active" },
  { id: "4", studentName: "Sarah Wilson", email: "sarah@example.com", issuedDate: "2023-11-05", expiryDate: "2025-11-05", status: "expired" },
];

const mockPendingReviews = [
  { id: "1", studentName: "Alex Brown", email: "alex@example.com", submittedDate: "2024-01-18", score: 85 },
  { id: "2", studentName: "Emily Davis", email: "emily@example.com", submittedDate: "2024-01-17", score: 72 },
  { id: "3", studentName: "Chris Lee", email: "chris@example.com", submittedDate: "2024-01-16", score: 68 },
];

const CertificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCertification, deleteCertification, updateCertification } = useCertificationStore();
  const certification = getCertification(id || "");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState({ name: "", email: "" });

  if (!certification) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Certification Not Found</h2>
        <p className="text-muted-foreground mb-4">The certification you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/certifications")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certifications
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteCertification(certification.id);
    toast({
      title: "Certification Deleted",
      description: `"${certification.name}" has been deleted.`,
    });
    navigate("/certifications");
  };

  const handleToggleStatus = () => {
    const newStatus = certification.status === "active" ? "draft" : "active";
    updateCertification(certification.id, { status: newStatus });
    toast({
      title: "Status Updated",
      description: `Certification is now ${newStatus}.`,
    });
  };

  const handleIssueCertificate = () => {
    if (!newRecipient.name || !newRecipient.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    // In a real app, this would issue the certificate
    toast({
      title: "Certificate Issued",
      description: `Certificate issued to ${newRecipient.name}.`,
    });
    setIssueDialogOpen(false);
    setNewRecipient({ name: "", email: "" });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "draft": return "warning";
      case "expired": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={certification.name}
        description={certification.description || "No description provided"}
        breadcrumbs={[
          { label: "Certifications", href: "/certifications" },
          { label: certification.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/certifications")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button variant="outline" onClick={() => navigate(`/certifications/${id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Certificates Issued"
          value={certification.issued}
          icon={CheckCircle}
          variant="success"
        />
        <StatCard
          title="Pending Review"
          value={certification.pending}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Passing Score"
          value={`${certification.passingScore}%`}
          icon={Target}
        />
        <StatCard
          title="Validity"
          value={certification.validityPeriod}
          icon={Calendar}
        />
      </div>

      {/* Info Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Certification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Associated Program</p>
                  <p className="font-medium">{certification.program}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusBadge
                      status={getStatusVariant(certification.status) as any}
                      label={certification.status}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{certification.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Badge Color</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: certification.badgeColor }}
                    />
                    <span className="font-medium">{certification.badgeColor}</span>
                  </div>
                </div>
              </div>

              {certification.requirements.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                  <ul className="space-y-2">
                    {certification.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Badge Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Badge Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: certification.badgeColor }}
              >
                <Award className="h-12 w-12 text-white" />
              </div>
              <p className="text-sm font-medium text-center">{certification.name}</p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setIssueDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Issue Certificate
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export All Issued
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={handleToggleStatus}
              >
                <Shield className="mr-2 h-4 w-4" />
                {certification.status === "active" ? "Unpublish" : "Publish"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Issued / Pending */}
      <Card>
        <Tabs defaultValue="issued">
          <CardHeader>
            <TabsList>
              <TabsTrigger value="issued" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Issued ({mockIssuedCertificates.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="h-4 w-4" />
                Pending Review ({mockPendingReviews.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="issued" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockIssuedCertificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{cert.email}</TableCell>
                      <TableCell>{cert.issuedDate}</TableCell>
                      <TableCell>{cert.expiryDate}</TableCell>
                      <TableCell>
                        <StatusBadge
                          status={getStatusVariant(cert.status) as any}
                          label={cert.status}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead className="w-24"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPendingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{review.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{review.email}</TableCell>
                      <TableCell>{review.submittedDate}</TableCell>
                      <TableCell>
                        <span className={review.score >= certification.passingScore ? "text-green-600" : "text-amber-600"}>
                          {review.score}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Certification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{certification.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Certificate Dialog */}
      <Dialog open={issueDialogOpen} onOpenChange={setIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
            <DialogDescription>
              Manually issue a certificate to a recipient.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                placeholder="Enter full name"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email Address</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="Enter email"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueCertificate}>
              <Mail className="mr-2 h-4 w-4" />
              Issue & Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificationDetails;
