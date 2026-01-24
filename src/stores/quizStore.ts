import { create } from "zustand";

export interface Question {
  id: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  course: string;
  totalMarks: number;
  passingPercentage: number;
  maxAttempts: number;
  duration: number; // in minutes
  questions: Question[];
  settings: {
    showAnswers: boolean;
    shuffleQuestions: boolean;
    enableNegativeMarking: boolean;
    showSubmissionHistory: boolean;
  };
  status: "draft" | "published";
  attempts: number;
  avgScore: number;
  createdAt: Date;
}

interface QuizStore {
  quizzes: Quiz[];
  addQuiz: (quiz: Omit<Quiz, "id" | "attempts" | "avgScore" | "createdAt">) => void;
  updateQuiz: (id: string, updates: Partial<Quiz>) => void;
  deleteQuiz: (id: string) => void;
  getQuiz: (id: string) => Quiz | undefined;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  quizzes: [
    {
      id: "1",
      title: "JavaScript Fundamentals Quiz",
      course: "JavaScript Essentials",
      totalMarks: 25,
      passingPercentage: 60,
      maxAttempts: 3,
      duration: 30,
      questions: [],
      settings: {
        showAnswers: true,
        shuffleQuestions: false,
        enableNegativeMarking: false,
        showSubmissionHistory: true,
      },
      status: "published",
      attempts: 234,
      avgScore: 78,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "React Hooks Assessment",
      course: "Advanced React",
      totalMarks: 20,
      passingPercentage: 70,
      maxAttempts: 2,
      duration: 25,
      questions: [],
      settings: {
        showAnswers: false,
        shuffleQuestions: true,
        enableNegativeMarking: false,
        showSubmissionHistory: false,
      },
      status: "published",
      attempts: 156,
      avgScore: 72,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Python Basics Test",
      course: "Python for Beginners",
      totalMarks: 30,
      passingPercentage: 50,
      maxAttempts: 5,
      duration: 45,
      questions: [],
      settings: {
        showAnswers: true,
        shuffleQuestions: true,
        enableNegativeMarking: false,
        showSubmissionHistory: true,
      },
      status: "published",
      attempts: 312,
      avgScore: 81,
      createdAt: new Date(),
    },
    {
      id: "4",
      title: "Database Design Quiz",
      course: "SQL Masterclass",
      totalMarks: 15,
      passingPercentage: 60,
      maxAttempts: 2,
      duration: 20,
      questions: [],
      settings: {
        showAnswers: false,
        shuffleQuestions: false,
        enableNegativeMarking: true,
        showSubmissionHistory: false,
      },
      status: "draft",
      attempts: 89,
      avgScore: 75,
      createdAt: new Date(),
    },
  ],

  addQuiz: (quiz) =>
    set((state) => ({
      quizzes: [
        ...state.quizzes,
        {
          ...quiz,
          id: Date.now().toString(),
          attempts: 0,
          avgScore: 0,
          createdAt: new Date(),
        },
      ],
    })),

  updateQuiz: (id, updates) =>
    set((state) => ({
      quizzes: state.quizzes.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    })),

  deleteQuiz: (id) =>
    set((state) => ({
      quizzes: state.quizzes.filter((q) => q.id !== id),
    })),

  getQuiz: (id) => get().quizzes.find((q) => q.id === id),
}));
