import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Trophy, Download, ExternalLink, Share2, Calendar,
  CheckCircle, Clock, Award, Shield,
} from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  credentialId: string;
  status: "issued" | "in_progress" | "expired";
  progress: number;
  skills: string[];
  verifyUrl: string;
}

const certificates: Certificate[] = [
  {
    id: "1", title: "Docker Essentials", issuer: "CodeCraft Institute", issuedDate: "Feb 10, 2025",
    expiryDate: null, credentialId: "DC-2025-00142", status: "issued", progress: 100,
    skills: ["Docker", "Containers", "Docker Compose", "Networking"],
    verifyUrl: "#",
  },
  {
    id: "2", title: "AWS Cloud Practitioner", issuer: "TechSkills Academy", issuedDate: "-",
    expiryDate: null, credentialId: "-", status: "in_progress", progress: 65,
    skills: ["AWS", "Cloud Computing", "IAM", "EC2", "S3"],
    verifyUrl: "#",
  },
  {
    id: "3", title: "Linux Fundamentals", issuer: "TechSkills Academy", issuedDate: "Jan 5, 2025",
    expiryDate: "Jan 5, 2027", credentialId: "LF-2025-00089", status: "issued", progress: 100,
    skills: ["Linux", "CLI", "Shell Scripting", "System Admin"],
    verifyUrl: "#",
  },
];

export default function StudentCertificates() {
  const issued = certificates.filter(c => c.status === "issued").length;
  const inProgress = certificates.filter(c => c.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground text-sm mt-1">Your earned certifications and progress</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-success">
            <Award className="h-4 w-4" /><span className="font-medium">{issued} Earned</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" /><span>{inProgress} In Progress</span>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((c) => (
          <Card key={c.id} className={c.status === "issued" ? "border-success/20" : ""}>
            <CardContent className="pt-6">
              {/* Badge Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                  c.status === "issued" ? "bg-gradient-to-br from-warning/20 to-warning/5" : "bg-muted"
                }`}>
                  <Trophy className={`h-7 w-7 ${c.status === "issued" ? "text-warning" : "text-muted-foreground"}`} />
                </div>
                <Badge variant="secondary" className={`text-xs ${
                  c.status === "issued" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}>
                  {c.status === "issued" ? "✓ Issued" : "In Progress"}
                </Badge>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-sm">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{c.issuer}</p>

              {/* Progress or details */}
              {c.status === "in_progress" ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">Complete all modules and pass the final assessment to earn this certificate.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Issued: {c.issuedDate}</span>
                  </div>
                  {c.expiryDate && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Expires: {c.expiryDate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>ID: {c.credentialId}</span>
                  </div>
                </div>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {c.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-[10px]">{skill}</Badge>
                ))}
              </div>

              {/* Actions */}
              {c.status === "issued" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1"><Download className="h-3.5 w-3.5" /> Download</Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1"><ExternalLink className="h-3.5 w-3.5" /> Verify</Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Share2 className="h-3.5 w-3.5" /></Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
