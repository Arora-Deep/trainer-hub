import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCourseStore, type Lesson, type Chapter } from "@/stores/courseStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CourseContentEditorProps {
  courseId: string;
  chapters: Chapter[];
}

const lessonTypeIcons = {
  video: Video,
  document: FileText,
  quiz: HelpCircle,
  assignment: ClipboardList,
};

const lessonTypeLabels = {
  video: "Video",
  document: "Document",
  quiz: "Quiz",
  assignment: "Assignment",
};

export function CourseContentEditor({ courseId, chapters }: CourseContentEditorProps) {
  const { addChapter, updateChapter, deleteChapter, addLesson, updateLesson, deleteLesson } = useCourseStore();
  
  const [expandedChapters, setExpandedChapters] = useState<string[]>(chapters.map(c => c.id));
  const [isChapterDialogOpen, setIsChapterDialogOpen] = useState(false);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ chapterId: string; lesson: Lesson } | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  
  const [chapterTitle, setChapterTitle] = useState("");
  const [lessonForm, setLessonForm] = useState({
    title: "",
    type: "video" as Lesson["type"],
    duration: "",
  });

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleAddChapter = () => {
    setEditingChapter(null);
    setChapterTitle("");
    setIsChapterDialogOpen(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setChapterTitle(chapter.title);
    setIsChapterDialogOpen(true);
  };

  const handleSaveChapter = () => {
    if (!chapterTitle.trim()) {
      toast.error("Please enter a chapter title");
      return;
    }
    
    if (editingChapter) {
      updateChapter(courseId, editingChapter.id, chapterTitle);
      toast.success("Chapter updated");
    } else {
      addChapter(courseId, chapterTitle);
      toast.success("Chapter added");
    }
    
    setIsChapterDialogOpen(false);
    setChapterTitle("");
  };

  const handleDeleteChapter = (chapterId: string) => {
    deleteChapter(courseId, chapterId);
    toast.success("Chapter deleted");
  };

  const handleAddLesson = (chapterId: string) => {
    setActiveChapterId(chapterId);
    setEditingLesson(null);
    setLessonForm({ title: "", type: "video", duration: "" });
    setIsLessonDialogOpen(true);
  };

  const handleEditLesson = (chapterId: string, lesson: Lesson) => {
    setActiveChapterId(chapterId);
    setEditingLesson({ chapterId, lesson });
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
    });
    setIsLessonDialogOpen(true);
  };

  const handleSaveLesson = () => {
    if (!lessonForm.title.trim()) {
      toast.error("Please enter a lesson title");
      return;
    }
    
    if (editingLesson) {
      updateLesson(courseId, editingLesson.chapterId, editingLesson.lesson.id, lessonForm);
      toast.success("Lesson updated");
    } else if (activeChapterId) {
      addLesson(courseId, activeChapterId, lessonForm);
      toast.success("Lesson added");
    }
    
    setIsLessonDialogOpen(false);
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    deleteLesson(courseId, chapterId, lessonId);
    toast.success("Lesson deleted");
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
        <Button onClick={handleAddChapter} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Chapter
        </Button>
      </div>

      {chapters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No content yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Start building your course by adding chapters and lessons.
            </p>
            <Button onClick={handleAddChapter} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Chapter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter, index) => (
            <Card key={chapter.id} className="overflow-hidden">
              <Collapsible
                open={expandedChapters.includes(chapter.id)}
                onOpenChange={() => toggleChapter(chapter.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        {expandedChapters.includes(chapter.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <CardTitle className="text-base">
                            Chapter {index + 1}: {chapter.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {chapter.lessons.length} lessons
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddLesson(chapter.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Lesson
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditChapter(chapter)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Chapter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteChapter(chapter.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Chapter
                            </DropdownMenuItem>
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
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleAddLesson(chapter.id)}
                          className="mt-1"
                        >
                          Add a lesson
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson, lessonIndex) => {
                          const Icon = lessonTypeIcons[lesson.type];
                          return (
                            <div
                              key={lesson.id}
                              className={cn(
                                "flex items-center justify-between p-3 rounded-lg border",
                                "hover:bg-muted/50 transition-colors group"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <Icon className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {index + 1}.{lessonIndex + 1} {lesson.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {lessonTypeLabels[lesson.type]} • {lesson.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditLesson(chapter.id, lesson)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteLesson(chapter.id, lesson.id)}
                                >
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
          <DialogHeader>
            <DialogTitle>
              {editingChapter ? "Edit Chapter" : "Add New Chapter"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chapterTitle">Chapter Title</Label>
              <Input
                id="chapterTitle"
                placeholder="e.g., Introduction to Cloud Computing"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveChapter();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChapterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChapter}>
              {editingChapter ? "Save Changes" : "Add Chapter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lesson Dialog */}
      <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="lessonTitle">Lesson Title</Label>
              <Input
                id="lessonTitle"
                placeholder="e.g., What is AWS?"
                value={lessonForm.title}
                onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Lesson Type</Label>
                <Select
                  value={lessonForm.type}
                  onValueChange={(value: Lesson["type"]) => 
                    setLessonForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 15 min"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLesson}>
              {editingLesson ? "Save Changes" : "Add Lesson"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
