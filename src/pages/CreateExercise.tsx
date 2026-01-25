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
import { JUDGE0_LANGUAGES, getLanguageByName } from "@/lib/judge0Languages";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2,
  Play,
  ClipboardCheck,
  Save,
  Code2,
  Info
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const defaultLanguage = JUDGE0_LANGUAGES[0]; // Python

  const [formData, setFormData] = useState({
    title: "",
    language: defaultLanguage.name,
    languageId: defaultLanguage.id,
    difficulty: "medium" as "easy" | "medium" | "hard",
    topic: "Arrays",
    problemStatement: "",
    constraints: "",
    hints: [] as string[],
    starterCode: defaultLanguage.defaultTemplate,
    solutionCode: "",
    timeLimit: 2,
    memoryLimit: 262144, // 256MB in KB for Judge0
  });

  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: "1", input: "", expectedOutput: "", isHidden: false, weight: 100 },
  ]);

  const [newHint, setNewHint] = useState("");

  const handleLanguageChange = (languageName: string) => {
    const lang = getLanguageByName(languageName);
    if (lang) {
      setFormData({
        ...formData,
        language: lang.name,
        languageId: lang.id,
        starterCode: lang.defaultTemplate,
      });
    }
  };

  const addHint = () => {
    if (newHint.trim()) {
      setFormData({
        ...formData,
        hints: [...formData.hints, newHint.trim()],
      });
      setNewHint("");
    }
  };

  const removeHint = (index: number) => {
    setFormData({
      ...formData,
      hints: formData.hints.filter((_, i) => i !== index),
    });
  };

  const addTestCase = () => {
    setTestCases([
      ...testCases,
      { id: Date.now().toString(), input: "", expectedOutput: "", isHidden: false, weight: 0 },
    ]);
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string | boolean | number) => {
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
                    <Label htmlFor="language" className="flex items-center gap-2">
                      Language <span className="text-destructive">*</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Judge0 Language ID: {formData.languageId}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select
                      value={formData.language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JUDGE0_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.id} value={lang.name}>
                            {lang.name}
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
                  <Label htmlFor="timeLimit" className="flex items-center gap-2">
                    Time Limit (seconds)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>CPU time limit for Judge0 execution</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    min={1}
                    max={15}
                    value={formData.timeLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, timeLimit: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memoryLimit" className="flex items-center gap-2">
                    Memory Limit (KB)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Memory limit in KB for Judge0 (262144 = 256MB)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="memoryLimit"
                    type="number"
                    min={16384}
                    max={524288}
                    step={16384}
                    value={formData.memoryLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, memoryLimit: parseInt(e.target.value) || 262144 })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Cases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Test Cases</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Input/Output format compatible with Judge0 stdin/stdout
                </p>
              </div>
              <Button onClick={addTestCase} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Test Case
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Input (stdin)</TableHead>
                    <TableHead>Expected Output (stdout)</TableHead>
                    <TableHead className="w-20">Weight</TableHead>
                    <TableHead className="w-20">Hidden</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testCases.map((tc) => (
                    <TableRow key={tc.id}>
                      <TableCell>
                        <Textarea
                          value={tc.input}
                          onChange={(e) =>
                            updateTestCase(tc.id, "input", e.target.value)
                          }
                          placeholder="Input (one value per line)"
                          rows={2}
                          className="font-mono text-sm resize-none"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={tc.expectedOutput}
                          onChange={(e) =>
                            updateTestCase(tc.id, "expectedOutput", e.target.value)
                          }
                          placeholder="Expected output"
                          rows={2}
                          className="font-mono text-sm resize-none"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={tc.weight || 0}
                          onChange={(e) =>
                            updateTestCase(tc.id, "weight", parseInt(e.target.value) || 0)
                          }
                          className="w-16"
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
            <CardContent className="space-y-4">
              <Textarea
                value={formData.problemStatement}
                onChange={(e) =>
                  setFormData({ ...formData, problemStatement: e.target.value })
                }
                placeholder="Describe the problem in detail. Include examples, constraints, and expected behavior..."
                rows={6}
                className="resize-none font-mono text-sm"
              />
              
              <div className="space-y-2">
                <Label>Constraints</Label>
                <Textarea
                  value={formData.constraints}
                  onChange={(e) =>
                    setFormData({ ...formData, constraints: e.target.value })
                  }
                  placeholder="e.g., 1 <= n <= 10^5&#10;Time complexity: O(n log n)"
                  rows={3}
                  className="resize-none font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label>Hints (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={newHint}
                    onChange={(e) => setNewHint(e.target.value)}
                    placeholder="Add a hint for students..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHint())}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addHint}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.hints.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.hints.map((hint, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-secondary rounded text-sm"
                      >
                        <span className="text-muted-foreground">#{index + 1}:</span>
                        <span className="max-w-[200px] truncate">{hint}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => removeHint(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Starter Code
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  (Template for {formData.language})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.starterCode}
                onChange={(e) =>
                  setFormData({ ...formData, starterCode: e.target.value })
                }
                placeholder="Enter starter code template..."
                rows={10}
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
                rows={10}
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
