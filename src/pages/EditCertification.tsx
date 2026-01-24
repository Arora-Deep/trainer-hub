import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCertificationStore } from "@/stores/certificationStore";
import { useProgramStore } from "@/stores/programStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Award, Plus, X, Palette, Save } from "lucide-react";

const badgeColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Yellow", value: "#EAB308" },
];

const EditCertification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCertification, updateCertification } = useCertificationStore();
  const programs = useProgramStore((state) => state.programs);
  
  const certification = getCertification(id || "");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    program: "",
    passingScore: 70,
    validityYears: 2,
    requirements: [""],
    badgeColor: "#3B82F6",
  });

  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    if (certification) {
      setFormData({
        name: certification.name,
        description: certification.description,
        program: certification.program,
        passingScore: certification.passingScore,
        validityYears: certification.validityYears,
        requirements: certification.requirements.length > 0 ? certification.requirements : [""],
        badgeColor: certification.badgeColor,
      });
      setIsPublished(certification.status === "active");
    }
  }, [certification]);

  if (!certification) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Award className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Certification Not Found</h2>
        <p className="text-muted-foreground mb-4">The certification you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/certifications")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Certifications
        </Button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => (i === index ? value : req)),
    }));
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const getValidityPeriod = (years: number) => {
    if (years === 0) return "Lifetime";
    return years === 1 ? "1 year" : `${years} years`;
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Certification name is required",
        variant: "destructive",
      });
      return;
    }

    const filteredRequirements = formData.requirements.filter((req) => req.trim() !== "");

    updateCertification(certification.id, {
      name: formData.name,
      description: formData.description,
      program: formData.program || "No Program",
      passingScore: formData.passingScore,
      validityPeriod: getValidityPeriod(formData.validityYears),
      validityYears: formData.validityYears,
      status: isPublished ? "active" : "draft",
      requirements: filteredRequirements,
      badgeColor: formData.badgeColor,
    });

    toast({
      title: "Success",
      description: `Certification "${formData.name}" updated successfully`,
    });

    navigate(`/certifications/${certification.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Certification"
        description={`Editing: ${certification.name}`}
        breadcrumbs={[
          { label: "Certifications", href: "/certifications" },
          { label: certification.name, href: `/certifications/${certification.id}` },
          { label: "Edit" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/certifications/${certification.id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
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
              <CardDescription>Update the certification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AWS Solutions Architect"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this certification validates..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Associated Program</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) => handleInputChange("program", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.name}>
                        {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Certification Criteria */}
          <Card>
            <CardHeader>
              <CardTitle>Certification Criteria</CardTitle>
              <CardDescription>Define passing requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passingScore">Passing Score (%)</Label>
                  <Input
                    id="passingScore"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.passingScore}
                    onChange={(e) => handleInputChange("passingScore", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="validity">Validity Period</Label>
                  <Select
                    value={formData.validityYears.toString()}
                    onValueChange={(value) => handleInputChange("validityYears", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Lifetime</SelectItem>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="2">2 Years</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>List the requirements to earn this certification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Requirement ${index + 1}`}
                    value={requirement}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                  />
                  {formData.requirements.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={handleAddRequirement} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Requirement
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
                  <Label htmlFor="published">Active Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this certification active
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

          {/* Badge Design */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Badge Design
              </CardTitle>
              <CardDescription>Choose the badge color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {badgeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-10 w-full rounded-md border-2 transition-all ${
                      formData.badgeColor === color.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleInputChange("badgeColor", color.value)}
                    title={color.name}
                  />
                ))}
              </div>

              {/* Badge Preview */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">Preview</p>
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: formData.badgeColor }}
                >
                  <Award className="h-10 w-10 text-white" />
                </div>
                <p className="text-sm font-medium text-center">
                  {formData.name || "Certification Name"}
                </p>
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
                <span className="text-muted-foreground">Passing Score</span>
                <span className="font-medium">{formData.passingScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Validity</span>
                <span className="font-medium">{getValidityPeriod(formData.validityYears)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requirements</span>
                <span className="font-medium">
                  {formData.requirements.filter((r) => r.trim()).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium capitalize">
                  {isPublished ? "Active" : "Draft"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditCertification;
