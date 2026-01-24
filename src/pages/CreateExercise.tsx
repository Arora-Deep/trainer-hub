import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useExerciseStore, TestCase } from "@/stores/exerciseStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2,
  Play,
  ClipboardCheck,
  Save,
  Code2
} from "lucide-react";

const LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C",
  "Go",
  "Rust",
  "Ruby",
  "PHP",
  "SQL",
  "Bash",
];

const TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Sorting",
  "Searching",
  "Recursion",
  "Stacks & Queues",
  "Hash Tables",
  "APIs",
  "Database",
  "Testing",
  "Other",
];

const CreateExercise = () => {
  const navigate = useNavigate();
  const { addExercise } = useExerciseStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    language: "Python",
    difficulty: "medium" as "easy" | "medium" | "hard",
    topic: "Arrays",
    problemStatement: "",
    starterCode: "",
    solutionCode: "",
    timeLimit: 2,
    memoryLimit: 256,
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: "1", input: "", expectedOutput: "", isHidden: false },
  ]);

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { id: Date.now().toString(), input: "", expectedOutput: "", isHidden: false },
    ]);
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean) => {
    setTestCases(
      testCases.map((tc) =>
        tc.id === id ? { ...tc, [field]: value } : tc
      )
    );
  };

  const removeTestCase = (id: string) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((tc) => tc.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exercise title",
        variant: "destructive",
      });
      return;
    }

    if (!formData.problemStatement.trim()) {
      toast({
        title: "Error",
        description: "Please enter a problem statement",
        variant: "destructive",
      });
      return;
    }

    addExercise({
      ...formData,
      testCases,
      status: "draft",
    });

    toast({
      title: "Exercise Created",
      description: "Your programming exercise has been created successfully",
    });

    navigate("/exercises");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Programming Exercise"
        description="Create a new coding challenge with test cases"
        breadcrumbs={[
          { label: "Exercises", href: "/exercises" },
          { label: "Create Exercise" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Test this Exercise
            </Button>
            <Button variant="outline" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Check Submission
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Exercise Details</CardTitle>
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
                  placeholder="Enter exercise title"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Language <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      setFormData({ ...formData, language: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value: "easy" | "medium" | "hard") =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) =>
                    setFormData({ ...formData, topic: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryLimit">Memory Limit (MB)</Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    value={formData.memoryLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, memoryLimit: parseInt(e.target.value) || 128 })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Test Cases</CardTitle>
              <Button onClick={addTestCase} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Input</TableHead>
                    <TableHead>Expected Output</TableHead>
                    <TableHead className="w-20">Hidden</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((tc) => (
                    <TableRow key={tc.id}>
                      <TableCell>
                        <Input
                          value={tc.input}
                          onChange={(e) =>
                            updateTestCase(tc.id, "input", e.target.value)
                          }
                          placeholder="Input"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={tc.expectedOutput}
                          onChange={(e) =>
                            updateTestCase(tc.id, "expectedOutput", e.target.value)
                          }
                          placeholder="Expected output"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={tc.isHidden}
                          onCheckedChange={(checked) =>
                            updateTestCase(tc.id, "isHidden", checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => removeTestCase(tc.id)}
                          disabled={testCases.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Problem Statement & Code */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Problem Statement <span className="text-destructive">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.problemStatement}
                onChange={(e) =>
                  setFormData({ ...formData, problemStatement: e.target.value })
                }
                placeholder="Describe the problem in detail. Include examples, constraints, and expected behavior..."
                rows={8}
                className="resize-none font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Starter Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.starterCode}
                onChange={(e) =>
                  setFormData({ ...formData, starterCode: e.target.value })
                }
                placeholder={`def solution():\n    # Your code here\n    pass`}
                rows={6}
                className="resize-none font-mono text-sm bg-muted"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Solution Code (Hidden from students)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.solutionCode}
                onChange={(e) =>
                  setFormData({ ...formData, solutionCode: e.target.value })
                }
                placeholder="Enter the reference solution..."
                rows={6}
                className="resize-none font-mono text-sm bg-muted"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateExercise;
