import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";
import { CheckCircle, Shield, Calendar, ArrowLeft } from "lucide-react";
import { getStudentCertificate } from "@/data/studentMockData";

export default function CertificateVerify() {
  const { id = "" } = useParams();
  const c = getStudentCertificate(id);
  if (!c) return <Card><CardContent className="py-12 text-center">Not found.</CardContent></Card>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Certificates", href: "/student/certificates" }, { label: c.title, href: `/student/certificates/${c.id}` }, { label: "Verify" }]}
        title="Verification"
      />

      <Card className="border-success/30">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">This credential is</p>
            <Badge className="mt-2 bg-success/10 text-success border-0 text-sm">Verified Authentic</Badge>
          </div>
          <div className="pt-4 border-t border-border space-y-2 text-left text-sm">
            <Row label="Recipient" value={c.recipient} />
            <Row label="Credential" value={c.title} />
            <Row label="Issued by" value={c.issuer} />
            <Row label="Issued on" value={c.issuedDate} />
            {c.expiryDate && <Row label="Expires" value={c.expiryDate} />}
            <Row label="Credential ID" value={c.credentialId} mono />
          </div>
          <div className="pt-4">
            <p className="text-xs text-muted-foreground mb-2">Skills validated</p>
            <div className="flex flex-wrap gap-1.5 justify-center">{c.skills.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
          </div>
        </CardContent>
      </Card>

      <Button asChild variant="ghost" size="sm"><Link to={`/student/certificates/${c.id}`}><ArrowLeft className="h-4 w-4 mr-1" /> Back to certificate</Link></Button>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-muted-foreground">{label}</span><span className={`font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span></div>;
}
