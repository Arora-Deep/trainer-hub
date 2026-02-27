import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Download, ExternalLink } from "lucide-react";

const certificates = [
  { id: "1", title: "Docker Essentials", issuer: "CodeCraft Institute", issuedDate: "Feb 10, 2025", credentialId: "DC-2025-00142", status: "issued" },
  { id: "2", title: "AWS Cloud Practitioner", issuer: "TechSkills Academy", issuedDate: "-", credentialId: "-", status: "in_progress" },
];

export default function StudentCertificates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground text-sm mt-1">Your earned certifications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((c) => (
          <Card key={c.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${c.status === "issued" ? "bg-warning/10" : "bg-muted"}`}>
                  <Trophy className={`h-6 w-6 ${c.status === "issued" ? "text-warning" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{c.title}</h3>
                    <Badge variant="secondary" className={`text-xs ${c.status === "issued" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {c.status === "issued" ? "Issued" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{c.issuer}</p>
                  {c.status === "issued" && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">Issued: {c.issuedDate} · ID: {c.credentialId}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Download</Button>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs"><ExternalLink className="h-3.5 w-3.5" /> Verify</Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
