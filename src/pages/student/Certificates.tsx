import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Trophy, Calendar, Clock, Shield, Award, Search, ExternalLink, ChevronRight, BookOpen } from "lucide-react";
import { studentCertificates } from "@/data/studentMockData";

export default function StudentCertificates() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => studentCertificates.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === "all") return true;
    return c.status === tab;
  }), [tab, search]);

  const issued = studentCertificates.filter((c) => c.status === "issued").length;
  const inProgress = studentCertificates.filter((c) => c.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
          <p className="text-muted-foreground text-sm mt-1">Your earned certifications and progress</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-success"><Award className="h-4 w-4" /><span className="font-medium">{issued} Earned</span></div>
          <div className="flex items-center gap-1.5 text-muted-foreground"><Clock className="h-4 w-4" /><span>{inProgress} In Progress</span></div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search certificates..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList><TabsTrigger value="all" className="text-xs">All</TabsTrigger><TabsTrigger value="issued" className="text-xs">Earned</TabsTrigger><TabsTrigger value="in_progress" className="text-xs">In Progress</TabsTrigger><TabsTrigger value="expired" className="text-xs">Expired</TabsTrigger></TabsList>
        </Tabs>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className={c.status === "issued" ? "border-success/20" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${c.status === "issued" ? "bg-gradient-to-br from-warning/20 to-warning/5" : "bg-muted"}`}>
                  <Trophy className={`h-7 w-7 ${c.status === "issued" ? "text-warning" : "text-muted-foreground"}`} />
                </div>
                <Badge variant="secondary" className={`text-xs ${c.status === "issued" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {c.status === "issued" ? "✓ Issued" : c.status === "in_progress" ? "In Progress" : "Expired"}
                </Badge>
              </div>

              <Link to={`/student/certificates/${c.id}`}><h3 className="font-semibold text-sm hover:text-primary">{c.title}</h3></Link>
              <p className="text-xs text-muted-foreground mt-0.5">{c.issuer}</p>

              {c.status === "in_progress" ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Completion</span><span className="font-medium">{c.progress}%</span></div>
                  <Progress value={c.progress} className="h-2" />
                  {c.relatedCourseId && <Button asChild size="sm" variant="outline" className="w-full mt-3 gap-1.5"><Link to={`/student/courses/${c.relatedCourseId}`}><BookOpen className="h-3.5 w-3.5" /> Continue course</Link></Button>}
                </div>
              ) : (
                <div className="mt-4 space-y-1.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" />Issued: {c.issuedDate}</p>
                  {c.expiryDate && <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="h-3 w-3" />Expires: {c.expiryDate}</p>}
                  <p className="text-xs text-muted-foreground flex items-center gap-2"><Shield className="h-3 w-3" />ID: {c.credentialId}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-4">{c.skills.slice(0, 4).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>

              <Button asChild size="sm" variant="outline" className="w-full mt-4 gap-1.5"><Link to={`/student/certificates/${c.id}`}>View <ChevronRight className="h-3 w-3" /></Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
