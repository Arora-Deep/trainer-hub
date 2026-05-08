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
  assignments: [
    {
      id: "1",
      title: "Build a REST API",
      course: "Node.js Backend Development",
      description: "Create a fully functional REST API with authentication",
      type: "project",
      maxScore: 100,
      dueDate: new Date("2024-01-20"),
      instructions: "Build a complete REST API using Node.js and Express",
      attachments: [],
      allowLateSubmission: true,
      latePenalty: 10,
      submissionType: "link",
      allowedFileTypes: [],
      maxFileSize: 10,
      status: "active",
      submissions: 45,
      pending: 12,
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "React Dashboard Component",
      course: "Advanced React",
      description: "Build a reusable dashboard component",
      type: "practical",
      maxScore: 50,
      dueDate: new Date("2024-01-18"),
      instructions: "Create a dashboard with charts and data visualization",
      attachments: [],
      allowLateSubmission: false,
      latePenalty: 0,
      submissionType: "file",
      allowedFileTypes: ["zip", "tar.gz"],
      maxFileSize: 50,
      status: "active",
      submissions: 38,
      pending: 8,
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Database Schema Design",
      course: "SQL Masterclass",
      description: "Design a normalized database schema",
      type: "practical",
      maxScore: 75,
      dueDate: new Date("2024-01-10"),
      instructions: "Design a database schema for an e-commerce application",
      attachments: [],
      allowLateSubmission: true,
      latePenalty: 5,
      submissionType: "file",
      allowedFileTypes: ["sql", "pdf"],
      maxFileSize: 20,
      status: "completed",
      submissions: 52,
      pending: 0,
      createdAt: new Date(),
    },
  ],

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
