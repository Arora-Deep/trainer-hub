import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuizStore, Question } from "@/stores/quizStore";
import { useCourseStore } from "@/stores/courseStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  GripVertical,
  Play,
  ClipboardCheck,
  Save
} from "lucide-react";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuizStore();
  const { courses } = useCourseStore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    totalMarks: 100,
    passingPercentage: 60,
    maxAttempts: 1,
    duration: 30,
  });

  const [settings, setSettings] = useState({
    showAnswers: true,
    shuffleQuestions: false,
    enableNegativeMarking: false,
    showSubmissionHistory: false,
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      marks: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a quiz title",
        variant: "destructive",
      });
      return;
    }

    addQuiz({
      ...formData,
      questions,
      settings,
      status: "draft",
    });

    toast({
      title: "Quiz Created",
      description: "Your quiz has been created successfully",
    });

    navigate("/quizzes");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Quiz"
        description="Create a new quiz with questions and settings"
        breadcrumbs={[
          { label: "Quizzes", href: "/quizzes" },
          { label: "Create Quiz" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Play className="h-4 w-4" />
              Test Quiz
            </Button>
            <Button variant="outline" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Check Submissions
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
          </div>
        }
      />

      {/* Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="Enter quiz title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                value={formData.totalMarks}
                onChange={(e) =>
                  setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Maximum Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                value={formData.maxAttempts}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttempts: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passingPercentage">
                Passing Percentage <span className="text-destructive">*</span>
              </Label>
              <Input
                id="passingPercentage"
                type="number"
                value={formData.passingPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, passingPercentage: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                }
              />
            </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="showAnswers" className="cursor-pointer">
                Show Answers
              </Label>
              <Switch
                id="showAnswers"
                checked={settings.showAnswers}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showAnswers: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="shuffleQuestions" className="cursor-pointer">
                Shuffle Questions
              </Label>
              <Switch
                id="shuffleQuestions"
                checked={settings.shuffleQuestions}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, shuffleQuestions: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enableNegativeMarking" className="cursor-pointer">
                Enable Negative Marking
              </Label>
              <Switch
                id="enableNegativeMarking"
                checked={settings.enableNegativeMarking}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, enableNegativeMarking: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="showSubmissionHistory" className="cursor-pointer">
                Show Submission History
              </Label>
              <Switch
                id="showSubmissionHistory"
                checked={settings.showSubmissionHistory}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showSubmissionHistory: checked })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Questions</CardTitle>
          <Button onClick={addQuestion} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            New Question
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No questions added yet</p>
          ) : (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 space-y-4 bg-muted/30"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-2 cursor-grab text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Question {index + 1}</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(question.id, { question: e.target.value })
                          }
                          placeholder="Enter your question"
                          rows={2}
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Marks</Label>
                        <Input
                          type="number"
                          value={question.marks}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              marks: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div className="w-40 space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: Question["type"]) =>
                            updateQuestion(question.id, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true-false">True/False</SelectItem>
                            <SelectItem value="short-answer">
                              Short Answer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {question.type === "multiple-choice" && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        <div className="grid gap-2 md:grid-cols-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${question.id}`}
                                checked={question.correctAnswer === optIndex}
                                onChange={() =>
                                  updateQuestion(question.id, {
                                    correctAnswer: optIndex,
                                  })
                                }
                                className="h-4 w-4"
                              />
                              <Input
                                value={option}
                                onChange={(e) =>
                                  updateQuestionOption(
                                    question.id,
                                    optIndex,
                                    e.target.value
                                  )
                                }
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.type === "true-false" && (
                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              checked={question.correctAnswer === "true"}
                              onChange={() =>
                                updateQuestion(question.id, {
                                  correctAnswer: "true",
                                })
                              }
                            />
                            True
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`tf-${question.id}`}
                              checked={question.correctAnswer === "false"}
                              onChange={() =>
                                updateQuestion(question.id, {
                                  correctAnswer: "false",
                                })
                              }
                            />
                            False
                          </label>
                        </div>
                      </div>
                    )}

                    {question.type === "short-answer" && (
                      <div className="space-y-2">
                        <Label>Expected Answer</Label>
                        <Input
                          value={question.correctAnswer as string}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              correctAnswer: e.target.value,
                            })
                          }
                          placeholder="Enter the expected answer"
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuiz;
