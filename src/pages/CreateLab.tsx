import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLabStore } from "@/stores/labStore";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Users, Server, Mail, User } from "lucide-react";

interface LabUser {
  id: string;
  name: string;
  email: string;
}

export default function CreateLab() {
  const navigate = useNavigate();
  const { templates, addLab, getTemplateById } = useLabStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    templateId: "",
    batchName: "",
  });

  const [users, setUsers] = useState<LabUser[]>([{ id: "1", name: "", email: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = () => {
    setUsers([...users, { id: Date.now().toString(), name: "", email: "" }]);
  };

  const handleRemoveUser = (id: string) => {
    if (users.length > 1) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleUserChange = (id: string, field: "name" | "email", value: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, [field]: value } : u)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.templateId) {
      toast({
        title: "Template required",
        description: "Please select a template to clone.",
        variant: "destructive",
      });
      return;
    }

    const validUsers = users.filter((u) => u.name.trim() && u.email.trim());
    if (validUsers.length === 0) {
      toast({
        title: "Users required",
        description: "Please add at least one user with name and email.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const template = getTemplateById(formData.templateId);
    
    // Create instances from user list
    const instances = validUsers.map((user, index) => ({
      id: `inst-${Date.now()}-${index}`,
      studentName: user.name,
      studentEmail: user.email,
      status: "provisioning" as const,
      startedAt: "Just now",
      timeRemaining: `${template?.runtimeLimit || 60} min`,
      cpu: 0,
      memory: 0,
      ipAddress: "Pending...",
    }));

    addLab({
      name: formData.name || `Lab from ${template?.name}`,
      description: formData.description || template?.description || "",
      templateId: formData.templateId,
      templateName: template?.name || "",
      batchName: formData.batchName || "Unassigned",
      status: "active",
      instanceCount: instances.length,
      instances,
    });

    toast({
      title: "Lab created successfully",
      description: `Lab created with ${validUsers.length} user(s). Instances are being provisioned.`,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/labs");
    }, 500);
  };

  const selectedTemplate = formData.templateId ? getTemplateById(formData.templateId) : null;

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Create Lab"
        description="Create a new lab by cloning a template and assigning users"
        breadcrumbs={[
          { label: "Labs", href: "/labs" },
          { label: "Create Lab" },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate("/labs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Labs
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lab Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Lab Details
                </CardTitle>
                <CardDescription>Basic information about your new lab</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Lab Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., AWS EC2 Workshop - Week 1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batchName">Batch Name</Label>
                    <Input
                      id="batchName"
                      placeholder="e.g., AWS SA - Batch 12"
                      value={formData.batchName}
                      onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Template to Clone *</Label>
                  <Select
                    value={formData.templateId}
                    onValueChange={(value) => setFormData({ ...formData, templateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} ({template.os} {template.osVersion})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the lab purpose..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Lab Users
                    </CardTitle>
                    <CardDescription>Add users who will have access to lab instances</CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddUser}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.map((user, index) => (
                  <div key={user.id} className="flex gap-3 items-start">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted text-sm font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 flex-1">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Full Name"
                          value={user.name}
                          onChange={(e) => handleUserChange(user.id, "name", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={user.email}
                          onChange={(e) => handleUserChange(user.id, "email", e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveUser(user.id)}
                      disabled={users.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <p className="text-sm text-muted-foreground mt-4">
                  {users.filter((u) => u.name && u.email).length} of {users.length} users configured
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Preview */}
            {selectedTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Selected Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">OS</p>
                      <p className="font-medium">{selectedTemplate.os}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">Provider</p>
                      <p className="font-medium uppercase">{selectedTemplate.cloudProvider}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">Resources</p>
                      <p className="font-medium">{selectedTemplate.vcpus} vCPU / {selectedTemplate.memory}GB</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-muted-foreground text-xs">Runtime</p>
                      <p className="font-medium">{selectedTemplate.runtimeLimit} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Template</span>
                  <span className="font-medium">{selectedTemplate?.name || "Not selected"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{users.filter((u) => u.name && u.email).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Instances to create</span>
                  <span className="font-medium">{users.filter((u) => u.name && u.email).length}</span>
                </div>
                <div className="pt-3 border-t">
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Lab..." : "Create Lab"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
