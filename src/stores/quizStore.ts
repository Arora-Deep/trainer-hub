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
  quizzes: [],

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
