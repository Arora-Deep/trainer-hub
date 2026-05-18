import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Trophy, Download, Share2, ExternalLink, Calendar, Shield, Award, BookOpen, Copy } from "lucide-react";
import { getStudentCertificate } from "@/data/studentMockData";
import { toast } from "sonner";

export default function CertificateDetail() {
  const { id = "" } = useParams();
  const c = getStudentCertificate(id);
  if (!c) return <Card><CardContent className="py-12 text-center">Certificate not found.</CardContent></Card>;
  const isIssued = c.status === "issued";

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Certificates", href: "/student/certificates" }, { label: c.title }]}
        title={c.title}
        description={`Issued by ${c.issuer}`}
        actions={
          isIssued ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1.5" onClick={() => toast.success("PDF downloaded")}><Download className="h-4 w-4" /> Download PDF</Button>
              <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Share link copied")}><Share2 className="h-4 w-4" /> Share</Button>
              <Button asChild className="gap-1.5"><Link to={`/student/certificates/${c.id}/verify`}><ExternalLink className="h-4 w-4" /> Verify</Link></Button>
            </div>
          ) : c.relatedCourseId ? (
            <Button asChild className="gap-1.5"><Link to={`/student/courses/${c.relatedCourseId}`}><BookOpen className="h-4 w-4" /> Continue course</Link></Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cert preview */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-[1.4/1] bg-gradient-to-br from-amber-50 via-white to-amber-100 dark:from-amber-950/20 dark:via-background dark:to-amber-900/20 border-8 border-double border-warning/30 p-8 flex flex-col items-center justify-center text-center relative">
              <Trophy className="h-12 w-12 text-warning mb-3" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Certificate of Completion</p>
              <h2 className="text-2xl font-serif mt-3">{c.recipient}</h2>
              <p className="text-sm text-muted-foreground mt-1">has successfully completed</p>
              <h3 className="text-xl font-semibold mt-2">{c.title}</h3>
              <p className="text-xs text-muted-foreground mt-4">{c.description}</p>
              <div className="flex items-center gap-8 mt-6 text-xs">
                <div><p className="text-muted-foreground">Issued</p><p className="font-medium">{c.issuedDate}</p></div>
                <div><p className="text-muted-foreground">Credential ID</p><p className="font-medium font-mono">{c.credentialId}</p></div>
                <div><p className="text-muted-foreground">Issuer</p><p className="font-medium">{c.issuer}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Skills validated</p>
              <div className="flex flex-wrap gap-1.5">{c.skills.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{c.issuedDate}</span></div>
              {c.expiryDate && <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>Expires {c.expiryDate}</span></div>}
              <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-muted-foreground" /><span className="font-mono text-xs">{c.credentialId}</span></div>
              <div className="flex items-center gap-2"><Award className="h-4 w-4 text-muted-foreground" /><span>{c.issuer}</span></div>
            </div>
            {isIssued && (
              <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Verify URL</p>
                <div className="flex items-center gap-2 p-2 rounded bg-muted">
                  <code className="text-[10px] flex-1 truncate">{c.verifyUrl}</code>
                  <button onClick={() => { navigator.clipboard.writeText(c.verifyUrl); toast.success("Copied"); }}><Copy className="h-3 w-3" /></button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
