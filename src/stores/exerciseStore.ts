import { create } from "zustand";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  language: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  problemStatement: string;
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  timeLimit: number; // in seconds
  memoryLimit: number; // in MB
  status: "draft" | "published";
  submissions: number;
  successRate: number;
  createdAt: Date;
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
      difficulty: "easy",
      topic: "Arrays",
      problemStatement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      starterCode: "def two_sum(nums, target):\n    # Your code here\n    pass",
      solutionCode: "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i",
      testCases: [
        { id: "1", input: "[2,7,11,15], 9", expectedOutput: "[0, 1]", isHidden: false },
        { id: "2", input: "[3,2,4], 6", expectedOutput: "[1, 2]", isHidden: false },
      ],
      timeLimit: 2,
      memoryLimit: 256,
      status: "published",
      submissions: 456,
      successRate: 89,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Binary Search Tree",
      language: "JavaScript",
      difficulty: "medium",
      topic: "Trees",
      problemStatement: "Implement a binary search tree with insert, search, and delete operations.",
      starterCode: "class BST {\n  constructor() {\n    // Your code here\n  }\n}",
      solutionCode: "",
      testCases: [],
      timeLimit: 3,
      memoryLimit: 256,
      status: "published",
      submissions: 234,
      successRate: 72,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Graph Traversal (BFS/DFS)",
      language: "Python",
      difficulty: "hard",
      topic: "Graphs",
      problemStatement: "Implement both BFS and DFS traversal for a given graph.",
      starterCode: "def bfs(graph, start):\n    pass\n\ndef dfs(graph, start):\n    pass",
      solutionCode: "",
      testCases: [],
      timeLimit: 5,
      memoryLimit: 512,
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
