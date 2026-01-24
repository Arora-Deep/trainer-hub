import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProgramStore } from "@/stores/programStore";
import { useCourseStore } from "@/stores/courseStore";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  GraduationCap, 
  Plus, 
  X, 
  GripVertical,
  BookOpen,
  Clock,
  Target
} from "lucide-react";

const CreateProgram = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const addProgram = useProgramStore((state) => state.addProgram);
  const courses = useCourseStore((state) => state.courses);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    difficulty: "intermediate" as const,
    certification: false,
    prerequisites: [""],
    outcomes: [""],
  });

  const [selectedCourses, setSelectedCourses] = useState<{ id: string; name: string; order: number }[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddPrerequisite = () => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: [...prev.prerequisites, ""],
    }));
  };

  const handlePrerequisiteChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.map((prereq, i) => (i === index ? value : prereq)),
    }));
  };

  const handleRemovePrerequisite = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const handleAddOutcome = () => {
    setFormData((prev) => ({
      ...prev,
      outcomes: [...prev.outcomes, ""],
    }));
  };

  const handleOutcomeChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.map((outcome, i) => (i === index ? value : outcome)),
    }));
  };

  const handleRemoveOutcome = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      outcomes: prev.outcomes.filter((_, i) => i !== index),
    }));
  };

  const handleCourseToggle = (courseId: string, courseName: string) => {
    setSelectedCourses((prev) => {
      const exists = prev.find((c) => c.id === courseId);
      if (exists) {
        return prev.filter((c) => c.id !== courseId);
      } else {
        return [...prev, { id: courseId, name: courseName, order: prev.length + 1 }];
      }
    });
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses((prev) => {
      const filtered = prev.filter((c) => c.id !== courseId);
      return filtered.map((c, index) => ({ ...c, order: index + 1 }));
    });
  };

  const moveCourse = (index: number, direction: "up" | "down") => {
    setSelectedCourses((prev) => {
      const newCourses = [...prev];
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= newCourses.length) return prev;
      [newCourses[index], newCourses[newIndex]] = [newCourses[newIndex], newCourses[index]];
      return newCourses.map((c, i) => ({ ...c, order: i + 1 }));
    });
  };

  const handleSubmit = (asDraft: boolean) => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Program name is required",
        variant: "destructive",
      });
      return;
    }

    if (selectedCourses.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one course to the program",
        variant: "destructive",
      });
      return;
    }

    const filteredPrerequisites = formData.prerequisites.filter((p) => p.trim() !== "");
    const filteredOutcomes = formData.outcomes.filter((o) => o.trim() !== "");

    const program = addProgram({
      name: formData.name,
      description: formData.description,
      courses: selectedCourses,
      duration: formData.duration || `${selectedCourses.length * 2} weeks`,
      status: asDraft ? "draft" : "active",
      certification: formData.certification,
      difficulty: formData.difficulty,
      prerequisites: filteredPrerequisites,
      outcomes: filteredOutcomes,
    });

    toast({
      title: "Success",
      description: `Program "${program.name}" created successfully`,
    });

    navigate("/programs");
  };

  const availableCourses = courses.filter(
    (course) => !selectedCourses.find((sc) => sc.id === course.id)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Program"
        description="Build a learning program by combining multiple courses"
        breadcrumbs={[
          { label: "Programs", href: "/programs" },
          { label: "Create Program" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/programs")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSubmit(true)}>
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit(false)}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Program Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Full Stack Development Bootcamp"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this program..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 12 weeks"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Program Courses
              </CardTitle>
              <CardDescription>
                Select and order courses for this program ({selectedCourses.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Courses */}
              {selectedCourses.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Courses (drag to reorder)</Label>
                  <div className="space-y-2 rounded-lg border p-3">
                    {selectedCourses.map((course, index) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-2 rounded-md border bg-muted/50 p-2"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {index + 1}
                        </span>
                        <span className="flex-1 font-medium">{course.name}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCourse(index, "up")}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveCourse(index, "down")}
                            disabled={index === selectedCourses.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCourse(course.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Courses */}
              <div className="space-y-2">
                <Label>Available Courses</Label>
                <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                  {availableCourses.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      All courses have been added to this program
                    </p>
                  ) : (
                    availableCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-3 rounded-md border p-2 hover:bg-muted/50"
                      >
                      <Checkbox
                          id={`course-${course.id}`}
                          onCheckedChange={() => handleCourseToggle(course.id, course.name)}
                        />
                        <label
                          htmlFor={`course-${course.id}`}
                          className="flex-1 cursor-pointer text-sm font-medium"
                        >
                          {course.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
              <CardDescription>What should students know before starting?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.prerequisites.map((prerequisite, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Prerequisite ${index + 1}`}
                    value={prerequisite}
                    onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                  />
                  {formData.prerequisites.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePrerequisite(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddPrerequisite} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Prerequisite
              </Button>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Outcomes
              </CardTitle>
              <CardDescription>What will students be able to do after completing?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.outcomes.map((outcome, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Outcome ${index + 1}`}
                    value={outcome}
                    onChange={(e) => handleOutcomeChange(index, e.target.value)}
                  />
                  {formData.outcomes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOutcome(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddOutcome} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Learning Outcome
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Publish Immediately</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this program active
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="certification">Include Certification</Label>
                  <p className="text-sm text-muted-foreground">
                    Award certificate on completion
                  </p>
                </div>
                <Switch
                  id="certification"
                  checked={formData.certification}
                  onCheckedChange={(checked) => handleInputChange("certification", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Courses</span>
                <span className="font-medium">{selectedCourses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {formData.duration || `${selectedCourses.length * 2} weeks`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Difficulty</span>
                <span className="font-medium capitalize">{formData.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Certification</span>
                <span className="font-medium">{formData.certification ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">
                  {isPublished ? "Active" : "Draft"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Program Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedCourses.length}</p>
                    <p className="text-xs text-muted-foreground">Total Courses</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {formData.outcomes.filter((o) => o.trim()).length}
                    </p>
                    <p className="text-xs text-muted-foreground">Learning Outcomes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProgram;
