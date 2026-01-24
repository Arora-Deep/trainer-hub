import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useCourseStore } from "@/stores/courseStore";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon,
  Upload,
  Save,
  FileText
} from "lucide-react";

const CreateAssignment = () => {
  const navigate = useNavigate();
  const { addAssignment } = useAssignmentStore();
  const { courses } = useCourseStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    type: "practical" as "project" | "practical" | "report",
    maxScore: 100,
    instructions: "",
    submissionType: "file" as "file" | "link" | "text",
    maxFileSize: 10,
  });

  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [latePenalty, setLatePenalty] = useState(10);
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(["pdf", "zip", "doc", "docx"]);

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an assignment title",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive",
      });
      return;
    }

    addAssignment({
      ...formData,
      dueDate,
      allowLateSubmission,
      latePenalty: allowLateSubmission ? latePenalty : 0,
      allowedFileTypes,
      attachments: [],
      status: "draft",
    });

    toast({
      title: "Assignment Created",
      description: "Your assignment has been created successfully",
    });

    navigate("/assignments");
  };

  const toggleFileType = (type: string) => {
    setAllowedFileTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Assignment"
        description="Create a new assignment with instructions and submission settings"
        breadcrumbs={[
          { label: "Assignments", href: "/assignments" },
          { label: "Create Assignment" },
        ]}
        actions={
          <Button onClick={handleSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            Save Assignment
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter assignment title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the assignment"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) =>
                    setFormData({ ...formData, course: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "project" | "practical" | "report") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="practical">Practical</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  value={formData.maxScore}
                  onChange={(e) =>
                    setFormData({ ...formData, maxScore: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Due Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={formData.instructions}
              onChange={(e) =>
                setFormData({ ...formData, instructions: e.target.value })
              }
              placeholder="Enter detailed instructions for the assignment..."
              rows={10}
              className="resize-none"
            />

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here or click to upload attachments
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Browse Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submission Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Submission Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type</Label>
                <Select
                  value={formData.submissionType}
                  onValueChange={(value: "file" | "link" | "text") =>
                    setFormData({ ...formData, submissionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">File Upload</SelectItem>
                    <SelectItem value="link">URL/Link</SelectItem>
                    <SelectItem value="text">Text Submission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.submissionType === "file" && (
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={formData.maxFileSize}
                    onChange={(e) =>
                      setFormData({ ...formData, maxFileSize: parseInt(e.target.value) || 10 })
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between space-x-2">
                <div>
                  <Label htmlFor="allowLateSubmission" className="cursor-pointer">
                    Allow Late Submission
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Students can submit after the due date
                  </p>
                </div>
                <Switch
                  id="allowLateSubmission"
                  checked={allowLateSubmission}
                  onCheckedChange={setAllowLateSubmission}
                />
              </div>
            </div>

            {allowLateSubmission && (
              <div className="w-48 space-y-2">
                <Label htmlFor="latePenalty">Late Penalty (% per day)</Label>
                <Input
                  id="latePenalty"
                  type="number"
                  value={latePenalty}
                  onChange={(e) => setLatePenalty(parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            {formData.submissionType === "file" && (
              <div className="space-y-2">
                <Label>Allowed File Types</Label>
                <div className="flex flex-wrap gap-2">
                  {["pdf", "doc", "docx", "zip", "tar.gz", "ppt", "pptx", "xls", "xlsx", "txt", "jpg", "png"].map(
                    (type) => (
                      <Button
                        key={type}
                        type="button"
                        variant={allowedFileTypes.includes(type) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFileType(type)}
                      >
                        .{type}
                      </Button>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateAssignment;
