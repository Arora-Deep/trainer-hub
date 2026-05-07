import { create } from "zustand";

export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  type: "project" | "practical" | "report";
  maxScore: number;
  dueDate: Date;
  instructions: string;
  attachments: string[];
  allowLateSubmission: boolean;
  latePenalty: number; // percentage per day
  submissionType: "file" | "link" | "text";
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  status: "draft" | "active" | "completed";
  submissions: number;
  pending: number;
  createdAt: Date;
}

interface AssignmentStore {
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, "id" | "submissions" | "pending" | "createdAt">) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  getAssignment: (id: string) => Assignment | undefined;
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: [],

  addAssignment: (assignment) =>
    set((state) => ({
      assignments: [
        ...state.assignments,
        {
          ...assignment,
          id: Date.now().toString(),
          submissions: 0,
          pending: 0,
          createdAt: new Date(),
        },
      ],
    })),

  updateAssignment: (id, updates) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  deleteAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.filter((a) => a.id !== id),
    })),

  getAssignment: (id) => get().assignments.find((a) => a.id === id),
}));
