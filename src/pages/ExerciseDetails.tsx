import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExerciseStore } from "@/stores/exerciseStore";
import { getLanguageById, JUDGE0_STATUS } from "@/lib/judge0Languages";
import {
  Play,
  Send,
  Code2,
  Clock,
  HardDrive,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Terminal,
  Eye,
  EyeOff,
  BarChart3,
  Edit,
  Lightbulb,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TestResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime?: number;
  memoryUsed?: number;
  statusId?: number;
}

const ExerciseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getExercise } = useExerciseStore();
  
  const exercise = getExercise(id || "");
  
  const [code, setCode] = useState(exercise?.starterCode || "");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [customOutput, setCustomOutput] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState("problem");

  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-semibold">Exercise Not Found</h2>
          <Button onClick={() => navigate("/exercises")}>Back to Exercises</Button>
        </div>
      </div>
    );
  }

  const language = getLanguageById(exercise.languageId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "hard": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  // Simulate running code (will be replaced with actual Judge0 API call)
  const handleRun = async () => {
    setIsRunning(true);
    setCustomOutput("");
    
    // Simulate Judge0 API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Placeholder: In real implementation, this would call Judge0 API
    // const submission: Judge0Submission = {
    //   source_code: btoa(code), // Base64 encode
    //   language_id: exercise.languageId,
    //   stdin: btoa(customInput),
    //   cpu_time_limit: exercise.timeLimit,
    //   memory_limit: exercise.memoryLimit,
    // };
    
    setCustomOutput("// Judge0 integration pending\n// Your code output will appear here\n\nInput received:\n" + (customInput || "(no input)"));
    setIsRunning(false);
  };

  // Simulate submitting code for grading
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults([]);
    
    // Simulate batch submission to Judge0
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Placeholder results - in real implementation, batch submit to Judge0
    const mockResults: TestResult[] = exercise.testCases.map((tc, index) => ({
      testCaseId: tc.id,
      passed: Math.random() > 0.3, // Random for demo
      actualOutput: tc.expectedOutput, // Would come from Judge0
      expectedOutput: tc.expectedOutput,
      executionTime: Math.random() * exercise.timeLimit,
      memoryUsed: Math.random() * (exercise.memoryLimit / 1024),
      statusId: Math.random() > 0.3 ? 3 : 4, // Accepted or Wrong Answer
    }));
    
    setTestResults(mockResults);
    setIsSubmitting(false);
    setActiveTab("results");
  };

  const passedTests = testResults.filter((r) => r.passed).length;
  const totalScore = testResults.reduce((sum, result) => {
    const testCase = exercise.testCases.find((tc) => tc.id === result.testCaseId);
    return sum + (result.passed ? (testCase?.weight || 0) : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title={exercise.title}
        description={`${exercise.language} • ${exercise.topic}`}
        breadcrumbs={[
          { label: "Exercises", href: "/exercises" },
          { label: exercise.title },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/exercises/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => navigate(`/exercises/${id}/analytics`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Left Panel - Problem Description */}
        <Card className="flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="problem">Problem</TabsTrigger>
                  <TabsTrigger value="results">
                    Results
                    {testResults.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {passedTests}/{testResults.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {exercise.timeLimit}s
                  </Badge>
                  <Badge variant="outline">
                    <HardDrive className="h-3 w-3 mr-1" />
                    {Math.round(exercise.memoryLimit / 1024)}MB
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-auto">
              <TabsContent value="problem" className="mt-0 space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold">Problem Statement</h3>
                  <p className="whitespace-pre-wrap">{exercise.problemStatement}</p>
                  
                  {exercise.constraints && (
                    <>
                      <h4 className="text-md font-semibold mt-4">Constraints</h4>
                      <pre className="bg-muted p-3 rounded text-sm">{exercise.constraints}</pre>
                    </>
                  )}
                </div>

                {/* Sample Test Cases */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Sample Test Cases</h4>
                  {exercise.testCases.filter((tc) => !tc.isHidden).map((tc, index) => (
                    <div key={tc.id} className="bg-muted rounded-lg p-3 space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">
                        Example {index + 1}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Input:</div>
                          <pre className="bg-background p-2 rounded text-sm font-mono">{tc.input}</pre>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Output:</div>
                          <pre className="bg-background p-2 rounded text-sm font-mono">{tc.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                  {exercise.testCases.some((tc) => tc.isHidden) && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <EyeOff className="h-3.5 w-3.5" />
                      {exercise.testCases.filter((tc) => tc.isHidden).length} hidden test case(s)
                    </p>
                  )}
                </div>

                {/* Hints */}
                {exercise.hints && exercise.hints.length > 0 && (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHints(!showHints)}
                      className="gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      {showHints ? "Hide Hints" : "Show Hints"}
                    </Button>
                    {showHints && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 space-y-2">
                        {exercise.hints.map((hint, index) => (
                          <p key={index} className="text-sm">
                            <span className="font-medium">Hint {index + 1}:</span> {hint}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="results" className="mt-0 space-y-4">
                {testResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <Terminal className="h-12 w-12 mb-3" />
                    <p>Submit your code to see test results</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {passedTests === testResults.length ? (
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        ) : (
                          <XCircle className="h-8 w-8 text-red-500" />
                        )}
                        <div>
                          <p className="font-semibold">
                            {passedTests === testResults.length ? "All Tests Passed!" : "Some Tests Failed"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {passedTests}/{testResults.length} tests passed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{totalScore}</p>
                        <p className="text-sm text-muted-foreground">points</p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {testResults.map((result, index) => {
                        const testCase = exercise.testCases.find((tc) => tc.id === result.testCaseId);
                        const status = JUDGE0_STATUS[result.statusId as keyof typeof JUDGE0_STATUS];
                        
                        return (
                          <AccordionItem
                            key={result.testCaseId}
                            value={result.testCaseId}
                            className={`border rounded-lg px-4 ${
                              result.passed ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
                            }`}
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                {result.passed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span>Test Case {index + 1}</span>
                                {testCase?.isHidden && (
                                  <Badge variant="outline" className="text-xs">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Hidden
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {status?.description || "Unknown"}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Expected Output:</p>
                                  <pre className="bg-background p-2 rounded text-sm font-mono">{result.expectedOutput}</pre>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1">Your Output:</p>
                                  <pre className="bg-background p-2 rounded text-sm font-mono">{result.actualOutput}</pre>
                                </div>
                              </div>
                              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Time: {result.executionTime?.toFixed(3)}s</span>
                                <span>Memory: {result.memoryUsed?.toFixed(0)}KB</span>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Right Panel - Code Editor */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-3 flex-shrink-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Code Editor
                <Badge variant="secondary">{language?.name || exercise.language}</Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setCode(exercise.starterCode)}>
                  Reset
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Solution
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Reference Solution</DialogTitle>
                    </DialogHeader>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono">
                      {exercise.solutionCode || "No solution provided"}
                    </pre>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 resize-none font-mono text-sm bg-muted border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Write your solution here..."
              />
            </CardContent>
          </Card>

          {/* Custom Input/Output */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                Custom Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Input (stdin)</label>
                  <Textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Custom input..."
                    rows={3}
                    className="font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Output (stdout)</label>
                  <Textarea
                    value={customOutput}
                    readOnly
                    placeholder="Output will appear here..."
                    rows={3}
                    className="font-mono text-sm resize-none bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRun}
              disabled={isRunning || isSubmitting}
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Run Code
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetails;
