import { create } from "zustand";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight?: number; // Points for this test case (for grading)
}

export interface Exercise {
  id: string;
  title: string;
  language: string;
  languageId: number; // Judge0 language ID
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  problemStatement: string;
  constraints?: string; // Problem constraints
  hints?: string[]; // Optional hints for students
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  timeLimit: number; // in seconds (passed to Judge0)
  memoryLimit: number; // in KB (Judge0 uses KB, not MB)
  wallTimeLimit?: number; // Wall clock time limit
  maxProcesses?: number; // Max number of processes
  enableNetworkAccess?: boolean; // Allow network access
  status: "draft" | "published";
  submissions: number;
  successRate: number;
  createdAt: Date;
}

// Submission tracking for analytics
export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  code: string;
  languageId: number;
  status: "pending" | "running" | "accepted" | "wrong_answer" | "time_limit" | "memory_limit" | "runtime_error" | "compilation_error";
  testResults: TestCaseResult[];
  executionTime?: number; // in seconds
  memoryUsed?: number; // in KB
  submittedAt: Date;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput?: string;
  expectedOutput: string;
  executionTime?: number;
  memoryUsed?: number;
  statusId?: number; // Judge0 status ID
  errorMessage?: string;
}

interface ExerciseStore {
  exercises: Exercise[];
  addExercise: (exercise: Omit<Exercise, "id" | "submissions" | "successRate" | "createdAt">) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  deleteExercise: (id: string) => void;
  getExercise: (id: string) => Exercise | undefined;
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: [],

  addExercise: (exercise) =>
    set((state) => ({
      exercises: [
        ...state.exercises,
        {
          ...exercise,
          id: Date.now().toString(),
          submissions: 0,
          successRate: 0,
          createdAt: new Date(),
        },
      ],
    })),

  updateExercise: (id, updates) =>
    set((state) => ({
      exercises: state.exercises.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  deleteExercise: (id) =>
    set((state) => ({
      exercises: state.exercises.filter((e) => e.id !== id),
    })),

  getExercise: (id) => get().exercises.find((e) => e.id === id),
}));
