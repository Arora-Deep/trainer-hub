import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Upload, 
  Calendar as CalendarIcon,
  DollarSign,
  Award,
  Image,
  Video,
  Info,
  Save,
  Eye,
  X,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const categories = [
  "Cloud Computing",
  "DevOps",
  "Programming",
  "Data Science",
  "Cybersecurity",
  "Networking",
  "Database",
  "Web Development",
  "Mobile Development",
  "AI/ML",
];

const deliveryTypes = [
  { value: "instructor-led", label: "Instructor-led" },
  { value: "self-paced", label: "Self-paced" },
  { value: "hybrid", label: "Hybrid" },
  { value: "live-online", label: "Live Online" },
];

const instructors = [
  { id: "1", name: "John Smith", specialty: "Cloud Architecture" },
  { id: "2", name: "Sarah Johnson", specialty: "DevOps" },
  { id: "3", name: "Mike Chen", specialty: "Kubernetes" },
  { id: "4", name: "Emily Davis", specialty: "AWS" },
  { id: "5", name: "David Wilson", specialty: "Security" },
];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    deliveryType: "",
    tags: [] as string[],
    selectedInstructors: [] as string[],
    courseImage: null as File | null,
    courseImagePreview: "",
    isPublished: false,
    isUpcoming: false,
    isFeatured: false,
    disableSelfEnrollment: false,
    publishDate: undefined as Date | undefined,
    aboutCourse: "",
    courseDescription: "",
    previewVideoUrl: "",
    isPaidCourse: false,
    coursePrice: "",
    currency: "USD",
    hasPaidCertificate: false,
    certificatePrice: "",
    hasCompletionCertificate: true,
  });

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInstructorToggle = (instructorId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedInstructors: prev.selectedInstructors.includes(instructorId)
        ? prev.selectedInstructors.filter(id => id !== instructorId)
        : [...prev.selectedInstructors, instructorId]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        courseImage: file,
        courseImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (asDraft: boolean = false) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(asDraft ? "Course saved as draft!" : "Course created successfully!");
    navigate("/courses");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Create New Course"
        description="Add a new course to your training catalog"
        breadcrumbs={[
          { label: "Courses", href: "/courses" },
          { label: "Create Course" }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/courses")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button 
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the fundamental details about your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., AWS Solutions Architect Professional"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="input-premium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Delivery Type *</Label>
                  <Select 
                    value={formData.deliveryType} 
                    onValueChange={(value) => handleInputChange("deliveryType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="input-premium"
                  />
                  <Button type="button" variant="outline" onClick={handleAddTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Instructors</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {instructors.map((instructor) => (
                    <div
                      key={instructor.id}
                      onClick={() => handleInstructorToggle(instructor.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        formData.selectedInstructors.includes(instructor.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <Checkbox
                        checked={formData.selectedInstructors.includes(instructor.id)}
                        onCheckedChange={() => handleInstructorToggle(instructor.id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{instructor.name}</p>
                        <p className="text-xs text-muted-foreground">{instructor.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Describe what students will learn in this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about">About This Course</Label>
                <Textarea
                  id="about"
                  placeholder="Brief overview of the course (shown in course cards and previews)"
                  value={formData.aboutCourse}
                  onChange={(e) => handleInputChange("aboutCourse", e.target.value)}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  A short summary that appears in course listings
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Course Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the course content, objectives, and outcomes..."
                  value={formData.courseDescription}
                  onChange={(e) => handleInputChange("courseDescription", e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Comprehensive description shown on the course details page
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Media & Preview
              </CardTitle>
              <CardDescription>
                Add visual content to make your course more appealing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Course Thumbnail Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  {formData.courseImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.courseImagePreview}
                        alt="Course thumbnail"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => handleInputChange("courseImagePreview", "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-3 rounded-full bg-primary/10">
                          <Image className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Click to upload image</p>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG up to 5MB (Recommended: 1280x720)
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="previewVideo">Preview Video URL</Label>
                <Input
                  id="previewVideo"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  value={formData.previewVideoUrl}
                  onChange={(e) => handleInputChange("previewVideoUrl", e.target.value)}
                  className="input-premium"
                />
                <p className="text-xs text-muted-foreground">
                  Add a YouTube or Vimeo URL for course preview
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Certification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Pricing & Certification
              </CardTitle>
              <CardDescription>
                Configure course pricing and certificate options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Paid Course */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="paidCourse"
                      checked={formData.isPaidCourse}
                      onCheckedChange={(checked) => handleInputChange("isPaidCourse", checked)}
                    />
                    <div>
                      <Label htmlFor="paidCourse" className="cursor-pointer">
                        This is a paid course
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Students will need to pay to access this course
                      </p>
                    </div>
                  </div>
                </div>

                {formData.isPaidCourse && (
                  <div className="grid grid-cols-2 gap-4 pl-4 animate-in-up">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={formData.currency}
                        onValueChange={(value) => handleInputChange("currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Course Price</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.coursePrice}
                        onChange={(e) => handleInputChange("coursePrice", e.target.value)}
                        className="input-premium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Certification Options */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Certification Options
                </h4>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="completionCert"
                      checked={formData.hasCompletionCertificate}
                      onCheckedChange={(checked) => handleInputChange("hasCompletionCertificate", checked)}
                    />
                    <div>
                      <Label htmlFor="completionCert" className="cursor-pointer">
                        Completion Certificate
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Students receive a free certificate upon completing the course
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="paidCert"
                      checked={formData.hasPaidCertificate}
                      onCheckedChange={(checked) => handleInputChange("hasPaidCertificate", checked)}
                    />
                    <div>
                      <Label htmlFor="paidCert" className="cursor-pointer">
                        Premium Certificate (Paid)
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Offer a verified certificate for an additional fee
                      </p>
                    </div>
                  </div>
                </div>

                {formData.hasPaidCertificate && (
                  <div className="pl-4 animate-in-up">
                    <div className="space-y-2 max-w-xs">
                      <Label>Certificate Price</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.certificatePrice}
                        onChange={(e) => handleInputChange("certificatePrice", e.target.value)}
                        className="input-premium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Column */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="published" className="cursor-pointer">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Make this course visible to students
                  </p>
                </div>
                <Checkbox
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="upcoming" className="cursor-pointer">Upcoming</Label>
                  <p className="text-xs text-muted-foreground">
                    Mark as coming soon
                  </p>
                </div>
                <Checkbox
                  id="upcoming"
                  checked={formData.isUpcoming}
                  onCheckedChange={(checked) => handleInputChange("isUpcoming", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="featured" className="cursor-pointer">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight on homepage
                  </p>
                </div>
                <Checkbox
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange("isFeatured", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label htmlFor="selfEnroll" className="cursor-pointer">Disable Self-Enrollment</Label>
                  <p className="text-xs text-muted-foreground">
                    Require manual enrollment
                  </p>
                </div>
                <Checkbox
                  id="selfEnroll"
                  checked={formData.disableSelfEnrollment}
                  onCheckedChange={(checked) => handleInputChange("disableSelfEnrollment", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Publish Date */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.publishDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.publishDate ? (
                        format(formData.publishDate, "PPP")
                      ) : (
                        "Pick a date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.publishDate}
                      onSelect={(date) => handleInputChange("publishDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Leave empty to publish immediately
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button className="w-full" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Course"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => navigate("/courses")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
