import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  ClipboardList,
  Code2,
  FlaskConical,
  Flag,
  GraduationCap,
  Pencil,
  Trash2,
  MoreHorizontal,
  Upload,
  Eye,
  Library,
  Brain,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useCourseStore, type Lesson, type Chapter, type LessonType } from "@/stores/courseStore";
import { LessonEditorSheet } from "./LessonEditorSheet";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourseContentEditorProps {
  courseId: string;
  chapters: Chapter[];
}

const lessonTypeIcons: Record<LessonType, typeof Video> = {
  video: Video,
  reading: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
  "code-exercise": Code2,
  lab: FlaskConical,
  "lab-instruction": ClipboardList,
  "live-session": Video,
  "ctf-scenario": Flag,
  exam: GraduationCap,
  "mock-exam": GraduationCap,
  survey: HelpCircle,
  "game-based-learning": HelpCircle,
};

const lessonTypeLabels: Record<LessonType, string> = {
  video: "Video",
  reading: "Reading",
  quiz: "Quiz",
  assignment: "Assignment",
  "code-exercise": "Code Exercise",
  lab: "Lab",
  "lab-instruction": "Lab Instructions",
  "live-session": "Live Session",
  "ctf-scenario": "CTF Scenario",
  exam: "Exam",
  "mock-exam": "Mock Exam",
  survey: "Survey",
  "game-based-learning": "Game-based Learning",
};

export function CourseContentEditor({ courseId, chapters }: CourseContentEditorProps) {
  const { addChapter, updateChapter, deleteChapter, addLesson, updateLesson, deleteLesson } = useCourseStore();
  const navigate = useNavigate();

  const [expandedChapters, setExpandedChapters] = useState<string[]>(chapters.map(c => c.id));
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterTitle, setChapterTitle] = useState("");

  const [lessonSheetOpen, setLessonSheetOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: Lesson } | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const toggleChapter = (chapterId: string) =>
    setExpandedChapters((prev) => (prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]));

  const handleAddChapter = () => { setEditingChapter(null); setChapterTitle(""); setIsChapterDialogOpen(true); };
  const handleEditChapter = (chapter: Chapter) => { setEditingChapter(chapter); setChapterTitle(chapter.title); setIsChapterDialogOpen(true); };
  const handleSaveChapter = () => {
    if (!chapterTitle.trim()) { toast.error("Please enter a chapter title"); return; }
    if (editingChapter) { updateChapter(courseId, editingChapter.id, chapterTitle); toast.success("Chapter updated"); }
    else { addChapter(courseId, chapterTitle); toast.success("Chapter added"); }
    setIsChapterDialogOpen(false); setChapterTitle("");
  };
  const handleDeleteChapter = (chapterId: string) => { deleteChapter(courseId, chapterId); toast.success("Chapter deleted"); };

  const handleAddLesson = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setEditingLesson(null);
    setLessonSheetOpen(true);
  };

  const handleEditLesson = (chapterId: string, lesson: Lesson) => {
    setActiveChapterId(chapterId);
    setEditingLesson({ chapterId, lesson });
    setLessonSheetOpen(true);
  };

  const handleSaveLesson = (data: Omit<Lesson, "id"> & { id?: string }) => {
    if (editingLesson) {
      updateLesson(courseId, editingLesson.chapterId, editingLesson.lesson.id, data);
      toast.success("Lesson updated");
    } else if (activeChapterId) {
      const { id: _ignored, ...payload } = data;
      addLesson(courseId, activeChapterId, payload as Omit<Lesson, "id">);
      toast.success("Lesson added");
    }
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    deleteLesson(courseId, chapterId, lessonId); toast.success("Lesson deleted");
  };

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {chapters.length} chapters • {totalLessons} lessons
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Import Content
          </Button>
          <Button onClick={handleAddChapter} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Chapter
          </Button>
        </div>
      </div>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Import Course Content</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-xs">Content Package</Label>
            <Input type="file" accept=".json,.zip,.scorm,.xml,.csv" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
            <p className="text-[11px] text-muted-foreground">
              Supports JSON outlines, ZIP/SCORM packages, common LMS exports. Chapters and lessons will be merged into this course.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button disabled={!importFile} onClick={() => { toast.success(`${importFile?.name} imported — content queued`); setImportFile(null); setImportOpen(false); }}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {chapters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4"><FileText className="h-8 w-8 text-primary" /></div>
            <h3 className="text-lg font-medium mb-2">No content yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">Start building your course by adding chapters and lessons.</p>
            <Button onClick={handleAddChapter} className="gap-2"><Plus className="h-4 w-4" />Add Your First Chapter</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <Card key={chapter.id} className="overflow-hidden">
              <Collapsible open={expandedChapters.includes(chapter.id)} onOpenChange={() => toggleChapter(chapter.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {expandedChapters.includes(chapter.id) ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        <div>
                          <CardTitle className="text-base">Chapter {index + 1}: {chapter.title}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-0.5">{chapter.lessons.length} lessons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" onClick={() => handleAddLesson(chapter.id)}>
                          <Plus className="h-4 w-4 mr-1" />Add Lesson
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditChapter(chapter)}><Pencil className="h-4 w-4 mr-2" />Edit Chapter</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteChapter(chapter.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete Chapter</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0 pb-4">
                    {chapter.lessons.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p className="text-sm">No lessons in this chapter yet</p>
                        <Button variant="link" size="sm" onClick={() => handleAddLesson(chapter.id)} className="mt-1">Add a lesson</Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const Icon = lessonTypeIcons[lesson.type];
                          return (
                            <div
                              key={lesson.id}
                              className={cn("flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group cursor-pointer")}
                              onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-4 w-4 text-primary" /></div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm truncate">{index + 1}.{lessonIndex + 1} {lesson.title}</p>
                                    {lesson.source === "library" && (
                                      <Badge variant="outline" className="text-[10px] gap-1 py-0"><Library className="h-2.5 w-2.5" />Library</Badge>
                                    )}
                                    {lesson.required && <Badge variant="outline" className="text-[10px] py-0">Required</Badge>}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{lessonTypeLabels[lesson.type]} • {lesson.duration || "—"}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditLesson(chapter.id, lesson)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteLesson(chapter.id, lesson.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* Chapter Dialog */}
      <Dialog open={isChapterDialogOpen} onOpenChange={setIsChapterDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingChapter ? "Edit Chapter" : "Add New Chapter"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapterTitle">Chapter Title</Label>
              <Input id="chapterTitle" placeholder="e.g., Introduction to Cloud Computing" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSaveChapter(); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveChapter}>{editingChapter ? "Save Changes" : "Add Chapter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson editor sheet */}
      <LessonEditorSheet
        open={lessonSheetOpen}
        onOpenChange={setLessonSheetOpen}
        initial={editingLesson?.lesson ?? null}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
