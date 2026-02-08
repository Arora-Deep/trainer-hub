import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBatchStore } from "@/stores/batchStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Users,
  Settings,
  FileText,
  Clock,
  Plus,
  X,
  Monitor,
  Building2,
  Laptop,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreateBatch() {
  const navigate = useNavigate();
  const { addBatch } = useBatchStore();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructors, setInstructors] = useState<string[]>([""]);
  const [published, setPublished] = useState(false);
  const [allowSelfEnrollment, setAllowSelfEnrollment] = useState(false);
  const [certification, setCertification] = useState(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [evaluationEndDate, setEvaluationEndDate] = useState<Date>();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [seatCount, setSeatCount] = useState(20);
  const [medium, setMedium] = useState<"online" | "offline" | "hybrid">("online");

  const handleAddInstructor = () => {
    setInstructors([...instructors, ""]);
  };

  const handleRemoveInstructor = (index: number) => {
    if (instructors.length > 1) {
      setInstructors(instructors.filter((_, i) => i !== index));
    }
  };

  const handleInstructorChange = (index: number, value: string) => {
    const updated = [...instructors];
    updated[index] = value;
    setInstructors(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({ title: "Error", description: "Batch name is required", variant: "destructive" });
      return;
    }

    if (!startDate || !endDate) {
      toast({ title: "Error", description: "Start and end dates are required", variant: "destructive" });
      return;
    }

    const filteredInstructors = instructors.filter((i) => i.trim());
    if (filteredInstructors.length === 0) {
      toast({ title: "Error", description: "At least one instructor is required", variant: "destructive" });
      return;
    }

    const id = addBatch({
      name: name.trim(),
      description: description.trim(),
      instructors: filteredInstructors,
      settings: {
        published,
        allowSelfEnrollment,
        certification,
      },
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      evaluationEndDate: evaluationEndDate?.toISOString() || endDate.toISOString(),
      additionalDetails: additionalDetails.trim(),
      seatCount,
      medium,
    });

    toast({ title: "Success", description: "Batch created successfully!" });
    navigate(`/batches/${id}`);
  };

  return (
    <div className="space-y-6 animate-in-up">
      <PageHeader
        title="Create Batch"
        description="Set up a new training batch with all the necessary details"
        breadcrumbs={[
          { label: "Batches", href: "/batches" },
          { label: "Create Batch" },
        ]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the batch name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AWS Solutions Architect - Batch 13"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/40 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the batch..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-muted/40 border-0 min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Instructors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Instructors
              </CardTitle>
              <CardDescription>Add one or more instructors for this batch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructors.map((instructor, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Instructor name"
                    value={instructor}
                    onChange={(e) => handleInstructorChange(index, e.target.value)}
                    className="bg-muted/40 border-0"
                  />
                  {instructors.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveInstructor(index)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddInstructor}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Instructor
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                Settings
              </CardTitle>
              <CardDescription>Configure batch visibility and enrollment options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Published</Label>
                  <p className="text-xs text-muted-foreground">Make this batch visible to students</p>
                </div>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Self Enrollment</Label>
                  <p className="text-xs text-muted-foreground">Students can enroll themselves</p>
                </div>
                <Switch checked={allowSelfEnrollment} onCheckedChange={setAllowSelfEnrollment} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Certification</Label>
                  <p className="text-xs text-muted-foreground">Issue certificates on completion</p>
                </div>
                <Switch checked={certification} onCheckedChange={setCertification} />
              </div>
            </CardContent>
          </Card>

          {/* Date and Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Date and Time
              </CardTitle>
              <CardDescription>Set the batch schedule and evaluation period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted/40 border-0",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted/40 border-0",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Evaluation End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-muted/40 border-0",
                        !evaluationEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {evaluationEndDate ? format(evaluationEndDate, "PPP") : "Select evaluation end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={evaluationEndDate}
                      onSelect={setEvaluationEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Batch Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Batch Details
              </CardTitle>
              <CardDescription>Configure capacity and delivery method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seatCount">Seat Count</Label>
                <Input
                  id="seatCount"
                  type="number"
                  min={1}
                  max={500}
                  value={seatCount}
                  onChange={(e) => setSeatCount(parseInt(e.target.value) || 20)}
                  className="bg-muted/40 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label>Medium</Label>
                <Select value={medium} onValueChange={(v) => setMedium(v as typeof medium)}>
                  <SelectTrigger className="bg-muted/40 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Online
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Offline
                      </div>
                    </SelectItem>
                    <SelectItem value="hybrid">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        Hybrid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Additional Details
              </CardTitle>
              <CardDescription>Any extra information about the batch</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes, prerequisites, or special instructions..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="bg-muted/40 border-0 min-h-[120px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/batches")}>
            Cancel
          </Button>
          <Button type="submit" className="shadow-md">
            Create Batch
          </Button>
        </div>
      </form>
    </div>
  );
}
