import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  GripVertical,
  FileText,
  PlayCircle,
  HelpCircle,
  FlaskConical,
  Save,
  Eye,
  Settings,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";

// Mock data for a course
const courseData = {
  id: 1,
  name: "AWS Solutions Architect Professional",
  description: "Comprehensive training for AWS Solutions Architect certification",
  modules: [
    {
      id: 1,
      title: "Introduction to AWS",
      expanded: true,
      lessons: [
        { id: 1, title: "What is Cloud Computing?", type: "video" },
        { id: 2, title: "AWS Global Infrastructure", type: "text" },
        { id: 3, title: "Quiz: AWS Basics", type: "quiz" },
      ],
    },
    {
      id: 2,
      title: "EC2 Deep Dive",
      expanded: false,
      lessons: [
        { id: 4, title: "EC2 Instance Types", type: "video" },
        { id: 5, title: "Hands-on: Launch EC2", type: "lab" },
        { id: 6, title: "EC2 Pricing Models", type: "text" },
      ],
    },
    {
      id: 3,
      title: "S3 Storage Solutions",
      expanded: false,
      lessons: [
        { id: 7, title: "S3 Bucket Basics", type: "video" },
        { id: 8, title: "S3 Security & Policies", type: "text" },
        { id: 9, title: "Lab: S3 Configuration", type: "lab" },
      ],
    },
  ],
};

const lessonIcons: Record<string, any> = {
  video: PlayCircle,
  text: FileText,
  quiz: HelpCircle,
  lab: FlaskConical,
};

export default function CourseEditor() {
  const { id } = useParams();
  const [modules, setModules] = useState(courseData.modules);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(1);

  const toggleModule = (moduleId: number) => {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, expanded: !m.expanded } : m
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={courseData.name}
        description="Edit course content and structure"
        breadcrumbs={[
          { label: "Course Builder", href: "/course-builder" },
          { label: courseData.name },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Left Sidebar - Module Tree */}
        <Card className="h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Modules</CardTitle>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="space-y-1">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium hover:bg-muted transition-colors"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  {module.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="flex-1 truncate">{module.title}</span>
                </button>
                {module.expanded && (
                  <div className="ml-8 space-y-1">
                    {module.lessons.map((lesson) => {
                      const Icon = lessonIcons[lesson.type];
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson.id)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                            selectedLesson === lesson.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="truncate">{lesson.title}</span>
                        </button>
                      );
                    })}
                    <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted transition-colors">
                      <Plus className="h-4 w-4" />
                      <span>Add Lesson</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="space-y-4">
          {/* Moodle Integration Note */}
          <Card className="border-info/30 bg-info/5">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-full bg-info/10 p-2">
                <FileText className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-sm">Moodle LMS Integration</p>
                <p className="text-sm text-muted-foreground">
                  Course content from Moodle LMS is embedded and synced here.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Lesson Editor</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lesson Title</label>
                <Input defaultValue="What is Cloud Computing?" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lesson Type</label>
                <div className="flex gap-2">
                  {Object.entries(lessonIcons).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant={type === "video" ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Enter lesson content here..."
                  className="min-h-[200px]"
                  defaultValue="Cloud computing is the on-demand delivery of IT resources over the Internet with pay-as-you-go pricing. Instead of buying, owning, and maintaining physical data centers and servers, you can access technology services, such as computing power, storage, and databases, on an as-needed basis from a cloud provider like Amazon Web Services (AWS)."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attach Lab (Optional)</label>
                <Button variant="outline" className="w-full justify-start">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Select a lab template...
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
                <Button variant="outline" size="sm">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Add Quiz
                </Button>
                <Button variant="outline" size="sm">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Attach Lab
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}