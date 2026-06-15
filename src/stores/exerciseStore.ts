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
  exercises: [
    {
      id: "1",
      title: "Two Sum Problem",
      language: "Python",
      languageId: 71, // Python 3
      difficulty: "easy",
      topic: "Arrays",
      problemStatement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
      constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
      hints: ["Try using a hash map to store values you've seen"],
      starterCode: "def two_sum(nums, target):\n    # Your code here\n    pass",
      solutionCode: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
      testCases: [
        { id: "1", input: "[2,7,11,15]\n9", expectedOutput: "[0, 1]", isHidden: false, weight: 25 },
        { id: "2", input: "[3,2,4]\n6", expectedOutput: "[1, 2]", isHidden: false, weight: 25 },
        { id: "3", input: "[3,3]\n6", expectedOutput: "[0, 1]", isHidden: true, weight: 50 },
      ],
      timeLimit: 2,
      memoryLimit: 262144, // 256MB in KB
      status: "published",
      submissions: 456,
      successRate: 89,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Binary Search Tree",
      language: "JavaScript",
      languageId: 63, // JavaScript
      difficulty: "medium",
      topic: "Trees",
      problemStatement: "Implement a binary search tree with insert, search, and delete operations.\n\nYour implementation should handle:\n- Inserting values\n- Searching for values\n- Deleting values while maintaining BST properties",
      constraints: "All values are unique integers\n1 <= operations <= 1000",
      starterCode: "class BST {\n  constructor() {\n    // Your code here\n  }\n  \n  insert(value) {\n    // Implement insert\n  }\n  \n  search(value) {\n    // Implement search\n  }\n  \n  delete(value) {\n    // Implement delete\n  }\n}",
      solutionCode: "",
      testCases: [],
      timeLimit: 3,
      memoryLimit: 262144,
      status: "published",
      submissions: 234,
      successRate: 72,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Graph Traversal (BFS/DFS)",
      language: "Python",
      languageId: 71,
      difficulty: "hard",
      topic: "Graphs",
      problemStatement: "Implement both BFS and DFS traversal for a given graph represented as an adjacency list.\n\nReturn the order of nodes visited during traversal.",
      constraints: "1 <= nodes <= 1000\nGraph may be disconnected",
      starterCode: "def bfs(graph, start):\n    # Return list of nodes in BFS order\n    pass\n\ndef dfs(graph, start):\n    # Return list of nodes in DFS order\n    pass",
      solutionCode: "",
      testCases: [],
      timeLimit: 5,
      memoryLimit: 524288, // 512MB in KB
      status: "published",
      submissions: 123,
      successRate: 58,
      createdAt: new Date(),
    },
  ],

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
