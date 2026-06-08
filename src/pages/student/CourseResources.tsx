import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Download, ExternalLink, FileText, FileArchive, Link as LinkIcon, Presentation, Video, Image as ImageIcon } from "lucide-react";
import { getStudentCourse } from "@/data/studentMockData";
import { useBatchStore } from "@/stores/batchStore";

const icons: Record<string, any> = { pdf: FileText, slides: Presentation, zip: FileArchive, link: LinkIcon, video: Video, document: FileText, image: ImageIcon, other: FileText };

export default function CourseResources() {
  const { id = "" } = useParams();
  const c = getStudentCourse(id);
  const batches = useBatchStore((s) => s.batches);
  const trainerMaterials = batches
    .filter((b) => !c || b.courseId === c.id)
    .flatMap((b) => (b.materials ?? []).map((m) => ({ ...m, batchName: b.name })));
  if (!c) return <Card><CardContent className="py-12 text-center">Course not found.</CardContent></Card>;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Courses", href: "/student/courses" }, { label: c.name, href: `/student/courses/${c.id}` }, { label: "Resources" }]}
        title="Resources"
        description={`Downloadable materials and links for ${c.name}`}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {c.resources.map((r) => {
          const Icon = icons[r.type] || FileText;
          const isLink = r.type === "link";
          return (
            <Card key={r.id}>
              <CardContent className="py-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-5 w-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2"><Badge variant="outline" className="text-[10px] uppercase">{r.type}</Badge>{r.size}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1.5" asChild>
                  <a href={r.url} target="_blank" rel="noreferrer">{isLink ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />} {isLink ? "Open" : "Download"}</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {c.resources.length === 0 && <Card className="md:col-span-2"><CardContent className="py-12 text-center text-sm text-muted-foreground">No resources yet.</CardContent></Card>}
      </div>
    </div>
  );
}
