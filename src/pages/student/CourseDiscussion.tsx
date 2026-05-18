import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { MessageSquare, ThumbsUp, Send, User } from "lucide-react";
import { getStudentCourse } from "@/data/studentMockData";
import { toast } from "sonner";

const seed = [
  { id: "t1", author: "Priya M.", role: "Student", time: "2h ago", text: "Anyone else getting an IAM permission error on the EC2 lab?", replies: 3, likes: 5 },
  { id: "t2", author: "James Wilson", role: "Instructor", time: "1d ago", text: "Reminder: VPC quiz is due Friday. Make sure to revisit the routing chapter.", replies: 8, likes: 12 },
  { id: "t3", author: "Arjun K.", role: "Student", time: "2d ago", text: "Loved chapter 2 — the diagrams really helped.", replies: 1, likes: 4 },
];

export default function CourseDiscussion() {
  const { id = "" } = useParams();
  const c = getStudentCourse(id);
  const [draft, setDraft] = useState("");
  if (!c) return <Card><CardContent className="py-12 text-center">Course not found.</CardContent></Card>;

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "My Courses", href: "/student/courses" }, { label: c.name, href: `/student/courses/${c.id}` }, { label: "Discussion" }]}
        title="Discussion"
        description={`Q&A and conversation for ${c.name}`}
      />

      <Card>
        <CardContent className="pt-6 space-y-3">
          <Textarea rows={3} placeholder="Ask a question or share a thought..." value={draft} onChange={(e) => setDraft(e.target.value)} />
          <div className="flex justify-end">
            <Button size="sm" className="gap-1.5" onClick={() => { toast.success("Posted"); setDraft(""); }}><Send className="h-3.5 w-3.5" /> Post</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {seed.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{t.author}</p>
                    <Badge variant="outline" className="text-[10px]">{t.role}</Badge>
                    <p className="text-xs text-muted-foreground">{t.time}</p>
                  </div>
                  <p className="text-sm mt-1">{t.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3 w-3" /> {t.likes}</button>
                    <button className="flex items-center gap-1 hover:text-foreground"><MessageSquare className="h-3 w-3" /> {t.replies} replies</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
