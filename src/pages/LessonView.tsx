import { useMemo, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useCourseStore, type LessonType } from "@/stores/courseStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowLeft, ArrowRight, BookOpen, Video, FileText, HelpCircle, ClipboardList,
  Code2, FlaskConical, Flag, GraduationCap, Pencil, CheckCircle2, Download, Play, ExternalLink, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const typeIcons: Record<LessonType, any> = {
  video: Video, reading: FileText, quiz: HelpCircle, assignment: ClipboardList,
  "code-exercise": Code2, lab: FlaskConical, "lab-instruction": ClipboardList,
  "live-session": Video, "ctf-scenario": Flag, exam: GraduationCap,
  "mock-exam": GraduationCap, survey: HelpCircle, "game-based-learning": HelpCircle, reasoning: HelpCircle,
};

export default function LessonView() {
  const { courseId = "", lessonId = "" } = useParams();
  const navigate = useNavigate();
  const course = useCourseStore((s) => s.getCourse(courseId));
  const [completed, setCompleted] = useState(false);

  const flat = useMemo(() => {
    if (!course) return [];
    return course.chapters.flatMap((ch, ci) =>
      ch.lessons.map((l, li) => ({ chapter: ch, ci, li, lesson: l }))
    );
  }, [course]);

  if (!course) return <Navigate to="/courses" replace />;
  const idx = flat.findIndex((x) => x.lesson.id === lessonId);
  if (idx === -1) return <Navigate to={`/courses/${courseId}`} replace />;

  const { lesson, chapter, ci, li } = flat[idx];
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
  const Icon = typeIcons[lesson.type];

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: course.name, href: `/courses/${course.id}` },
          { label: lesson.title },
        ]}
        title={lesson.title}
        description={lesson.summary || `${chapter.title} · Lesson ${ci + 1}.${li + 1}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCompleted((v) => !v)}>
              <CheckCircle2 className={cn("h-4 w-4 mr-1.5", completed && "text-success")} />
              {completed ? "Completed" : "Mark complete"}
            </Button>
            <Button size="sm" asChild>
              <Link to={`/courses/${course.id}`}>
                <Pencil className="h-4 w-4 mr-1.5" /> Edit in builder
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Outline */}
        <Card className="h-fit lg:sticky lg:top-4">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Course outline</CardTitle></CardHeader>
          <CardContent className="p-2 space-y-3 max-h-[70vh] overflow-y-auto">
            {course.chapters.map((ch, ciOuter) => (
              <div key={ch.id}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
                  Chapter {ciOuter + 1} · {ch.title}
                </p>
                <div className="space-y-0.5">
                  {ch.lessons.map((l, liOuter) => {
                    const LIcon = typeIcons[l.type];
                    const active = l.id === lesson.id;
                    return (
                      <Link
                        key={l.id}
                        to={`/courses/${course.id}/lessons/${l.id}`}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                          active ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground/80"
                        )}
                      >
                        <LIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate flex-1">{ciOuter + 1}.{liOuter + 1} {l.title}</span>
                        {l.required && <Lock className="h-3 w-3 text-muted-foreground" />}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1"><Icon className="h-3 w-3" />{labelFor(lesson.type)}</Badge>
                {lesson.duration && <Badge variant="outline">{lesson.duration}</Badge>}
                {lesson.required && <Badge variant="outline">Required</Badge>}
                {typeof lesson.weight === "number" && lesson.weight > 0 && <Badge variant="outline">Weight {lesson.weight}%</Badge>}
              </div>

              {lesson.instructions && (
                <div className="rounded-md border bg-muted/30 p-3 text-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Instructions</p>
                  <p className="whitespace-pre-wrap">{lesson.instructions}</p>
                </div>
              )}

              <LessonBody />
            </CardContent>
          </Card>

          {/* Prev / Next */}
          <div className="flex justify-between gap-2">
            <Button variant="outline" disabled={!prev} onClick={() => prev && navigate(`/courses/${course.id}/lessons/${prev.lesson.id}`)}>
              <ArrowLeft className="h-4 w-4 mr-1.5" /> {prev ? prev.lesson.title : "Previous"}
            </Button>
            <Button disabled={!next} onClick={() => next && navigate(`/courses/${course.id}/lessons/${next.lesson.id}`)}>
              {next ? next.lesson.title : "Next"} <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  function LessonBody() {
    switch (lesson.type) {
      case "video":
        return <VideoBlock />;
      case "reading":
        return <ReadingBlock />;
      case "lab":
      case "ctf-scenario":
        return <LabBlock />;
      case "code-exercise":
        return <CodeBlock />;
      case "quiz":
      case "assignment":
      case "exam":
        return <AssessmentBlock />;
      default:
        return <EmptyBlock />;
    }
  }

  function VideoBlock() {
    const url = lesson.videoUrl;
    const isYouTube = url?.includes("youtube.com") || url?.includes("youtu.be");
    const isVimeo = url?.includes("vimeo.com");
    return (
      <div className="space-y-3">
        <div className="aspect-video rounded-lg bg-black overflow-hidden flex items-center justify-center text-white/70 text-sm">
          {url && isYouTube ? (
            <iframe className="w-full h-full" src={toYouTubeEmbed(url)} title={lesson.title} allowFullScreen />
          ) : url && isVimeo ? (
            <iframe className="w-full h-full" src={toVimeoEmbed(url)} title={lesson.title} allowFullScreen />
          ) : url ? (
            <video className="w-full h-full" src={url} controls />
          ) : lesson.videoFileName ? (
            <div className="flex flex-col items-center gap-2">
              <Play className="h-8 w-8" />
              <p className="text-sm">{lesson.videoFileName}</p>
              <p className="text-[11px] text-white/50">Preview unavailable in builder</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2"><Video className="h-8 w-8" /><p>No video source yet</p></div>
          )}
        </div>
        {lesson.transcript && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Transcript</h4>
            <div className="rounded-md border bg-muted/30 p-3 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">{lesson.transcript}</div>
          </div>
        )}
        <AttachmentsList />
      </div>
    );
  }

  function ReadingBlock() {
    return (
      <div className="space-y-3">
        {lesson.body ? (
          <article
            className="prose prose-sm max-w-none prose-headings:font-semibold prose-blockquote:border-l-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-pre:bg-muted"
            dangerouslySetInnerHTML={{ __html: lesson.body }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">No content yet. Open the editor to add reading material.</p>
        )}
        <AttachmentsList />
      </div>
    );
  }

  function LabBlock() {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border bg-muted/30 p-4 flex items-center gap-3">
          <div className="rounded-md bg-primary/10 p-2"><FlaskConical className="h-5 w-5 text-primary" /></div>
          <div className="flex-1">
            <p className="font-medium text-sm">{lesson.lab?.templateName || "No lab template"}</p>
            <p className="text-xs text-muted-foreground capitalize">{lesson.lab?.mode || "—"} · est. {lesson.lab?.estimatedHours ?? "—"}h</p>
          </div>
          <Button size="sm" onClick={() => toast.success("Lab launch requested")}>Launch lab</Button>
        </div>
        {lesson.successCriteria && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Success criteria</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{lesson.successCriteria}</p>
          </div>
        )}
      </div>
    );
  }

  function CodeBlock() {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="uppercase">{lesson.language || "code"}</Badge>
          {lesson.timeLimit ? <Badge variant="outline">{lesson.timeLimit} min</Badge> : null}
        </div>
        <pre className="rounded-md border bg-muted/40 p-3 text-xs font-mono overflow-x-auto">
{lesson.starterCode || "// No starter code provided"}
        </pre>
        <Button size="sm" onClick={() => toast.success("Opening IDE…")}><ExternalLink className="h-4 w-4 mr-1.5" />Open in IDE</Button>
      </div>
    );
  }

  function AssessmentBlock() {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Stat label="Passing" value={lesson.passingScore != null ? `${lesson.passingScore}%` : "—"} />
          <Stat label="Attempts" value={lesson.attempts ?? "—"} />
          <Stat label="Time limit" value={lesson.timeLimit ? `${lesson.timeLimit} min` : "—"} />
          <Stat label="Weight" value={lesson.weight != null ? `${lesson.weight}%` : "—"} />
        </div>
        {lesson.source === "library" && lesson.refId && (
          <p className="text-xs text-muted-foreground">Linked from library item <code className="px-1 rounded bg-muted">{lesson.refId}</code></p>
        )}
        <Button onClick={() => toast.success("Attempt started (mock)")}>
          <Play className="h-4 w-4 mr-1.5" />Start attempt
        </Button>
      </div>
    );
  }

  function AttachmentsList() {
    if (!lesson.attachments?.length) return null;
    return (
      <div>
        <h4 className="text-sm font-semibold mb-2">Attachments</h4>
        <div className="space-y-1">
          {lesson.attachments.map((a, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm">
              <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" />{a.name}</span>
              {lesson.allowDownload !== false && (
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success(`Downloading ${a.name}`)}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function EmptyBlock() {
    return <p className="text-sm text-muted-foreground">Nothing to display.</p>;
  }
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function labelFor(t: LessonType) {
  return ({ video: "Video", reading: "Reading", quiz: "Quiz", assignment: "Assignment", "code-exercise": "Code Exercise", lab: "Lab", "ctf-scenario": "CTF Scenario", exam: "Exam" } as Record<LessonType, string>)[t];
}

function toYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
    const v = u.searchParams.get("v");
    return v ? `https://www.youtube.com/embed/${v}` : url;
  } catch { return url; }
}
function toVimeoEmbed(url: string) {
  try {
    const u = new URL(url);
    const id = u.pathname.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : url;
  } catch { return url; }
}
