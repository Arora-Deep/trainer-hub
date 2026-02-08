import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface BatchBasicInfoProps {
  name: string;
  setName: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  instructors: string[];
  setInstructors: (v: string[]) => void;
  published: boolean;
  setPublished: (v: boolean) => void;
  allowSelfEnrollment: boolean;
  setAllowSelfEnrollment: (v: boolean) => void;
  certification: boolean;
  setCertification: (v: boolean) => void;
  startDate: Date | undefined;
  setStartDate: (v: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (v: Date | undefined) => void;
  evaluationEndDate: Date | undefined;
  setEvaluationEndDate: (v: Date | undefined) => void;
  additionalDetails: string;
  setAdditionalDetails: (v: string) => void;
  seatCount: number;
  setSeatCount: (v: number) => void;
  medium: "online" | "offline" | "hybrid";
  setMedium: (v: "online" | "offline" | "hybrid") => void;
}

export function BatchBasicInfo({
  name, setName,
  description, setDescription,
  instructors, setInstructors,
  published, setPublished,
  allowSelfEnrollment, setAllowSelfEnrollment,
  certification, setCertification,
  startDate, setStartDate,
  endDate, setEndDate,
  evaluationEndDate, setEvaluationEndDate,
  additionalDetails, setAdditionalDetails,
  seatCount, setSeatCount,
  medium, setMedium,
}: BatchBasicInfoProps) {
  const handleAddInstructor = () => setInstructors([...instructors, ""]);
  const handleRemoveInstructor = (index: number) => {
    if (instructors.length > 1) setInstructors(instructors.filter((_, i) => i !== index));
  };
  const handleInstructorChange = (index: number, value: string) => {
    const updated = [...instructors];
    updated[index] = value;
    setInstructors(updated);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Basic Information */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <FileText className="h-4 w-4 text-primary" />
            </div>
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
              className="bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the batch..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Instructors */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-info/20 to-info/5">
              <Users className="h-4 w-4 text-info" />
            </div>
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
                className="bg-background/50"
              />
              {instructors.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveInstructor(index)} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={handleAddInstructor} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Button>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-success/20 to-success/5">
              <Clock className="h-4 w-4 text-success" />
            </div>
            Schedule & Capacity
          </CardTitle>
          <CardDescription>Set dates, seat count and delivery mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Evaluation End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50", !evaluationEndDate && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {evaluationEndDate ? format(evaluationEndDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border z-50" align="start">
                <Calendar mode="single" selected={evaluationEndDate} onSelect={setEvaluationEndDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seatCount">Seat Count</Label>
              <Input id="seatCount" type="number" min={1} max={500} value={seatCount} onChange={(e) => setSeatCount(parseInt(e.target.value) || 20)} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Medium</Label>
              <Select value={medium} onValueChange={(v) => setMedium(v as typeof medium)}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online"><div className="flex items-center gap-2"><Monitor className="h-4 w-4" /> Online</div></SelectItem>
                  <SelectItem value="offline"><div className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Offline</div></SelectItem>
                  <SelectItem value="hybrid"><div className="flex items-center gap-2"><Laptop className="h-4 w-4" /> Hybrid</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5">
              <Settings className="h-4 w-4 text-warning" />
            </div>
            Settings
          </CardTitle>
          <CardDescription>Configure visibility, enrollment and additional details</CardDescription>
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
          <div className="space-y-2">
            <Label>Additional Details</Label>
            <Textarea
              placeholder="Prerequisites, special instructions..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="bg-background/50 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}