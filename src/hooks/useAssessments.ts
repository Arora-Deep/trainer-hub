import { useMemo } from "react";
import { useQuizStore } from "@/stores/quizStore";
import { useAssignmentStore } from "@/stores/assignmentStore";
import { useExerciseStore } from "@/stores/exerciseStore";

export type AssessmentType = "Quiz" | "Assignment" | "Exercise";
export type AssessmentLifecycle = "draft" | "in_review" | "published" | "archived";

export interface UnifiedAssessment {
  id: string;
  type: AssessmentType;
  title: string;
  course: string;
  status: AssessmentLifecycle;
  attempts: number;
  avgScore: number;
  difficulty?: string;
  createdAt: Date;
  editPath: string;
  detailPath: string;
}

const normLifecycle = (s: string): AssessmentLifecycle => {
  if (s === "draft" || s === "in_review" || s === "published" || s === "archived") return s;
  if (s === "active") return "published";
  if (s === "completed") return "archived";
  return "draft";
};

export function useAssessments() {
  const quizzes = useQuizStore((s) => s.quizzes);
  const assignments = useAssignmentStore((s) => s.assignments);
  const exercises = useExerciseStore((s) => s.exercises);

  return useMemo<UnifiedAssessment[]>(() => {
    const q: UnifiedAssessment[] = quizzes.map((x) => ({
      id: x.id,
      type: "Quiz",
      title: x.title,
      course: x.course,
      status: normLifecycle(x.status),
      attempts: x.attempts,
      avgScore: x.avgScore,
      createdAt: x.createdAt,
      editPath: `/quizzes/${x.id}`,
      detailPath: `/quizzes/${x.id}`,
    }));
    const a: UnifiedAssessment[] = assignments.map((x) => ({
      id: x.id,
      type: "Assignment",
      title: x.title,
      course: x.course,
      status: normLifecycle(x.status),
      attempts: x.submissions,
      avgScore: 0,
      createdAt: x.createdAt,
      editPath: `/assignments`,
      detailPath: `/assignments`,
    }));
    const e: UnifiedAssessment[] = exercises.map((x) => ({
      id: x.id,
      type: "Exercise",
      title: x.title,
      course: x.topic,
      status: normLifecycle(x.status),
      attempts: x.submissions,
      avgScore: x.successRate,
      difficulty: x.difficulty,
      createdAt: x.createdAt,
      editPath: `/exercises/${x.id}`,
      detailPath: `/exercises/${x.id}`,
    }));
    return [...q, ...a, ...e].sort(
      (x, y) => +new Date(y.createdAt) - +new Date(x.createdAt)
    );
  }, [quizzes, assignments, exercises]);
}
