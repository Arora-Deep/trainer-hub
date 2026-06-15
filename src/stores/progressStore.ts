import { create } from "zustand";

export type ProgressItemType = "lesson" | "quiz" | "assignment" | "exercise" | "lab";
export type ProgressStatus = "not_started" | "in_progress" | "submitted" | "graded";

export interface ProgressItem {
  id: string;
  batchId: string;
  studentId: string;
  studentName: string;
  itemId: string;
  itemTitle: string;
  itemType: ProgressItemType;
  dueAt?: string; // ISO
  status: ProgressStatus;
  score?: number;
  maxScore?: number;
  submittedAt?: string;
  lastActivityAt?: string;
}

interface ProgressStore {
  items: ProgressItem[];
  forBatch: (batchId: string) => ProgressItem[];
  forStudent: (batchId: string, studentId: string) => ProgressItem[];
  dueThisWeek: (batchId: string) => ProgressItem[];
  studentCompletion: (batchId: string, studentId: string) => number;
  atRiskStudents: (batchId: string) => { studentId: string; studentName: string; completion: number }[];
}

const STUDENTS = [
  { id: "s1", name: "Alice Johnson" },
  { id: "s2", name: "Bob Williams" },
  { id: "s3", name: "Carol Davis" },
  { id: "s4", name: "David Brown" },
  { id: "s5", name: "Eva Martinez" },
  { id: "current-student", name: "Sarah Ahmed" },
];

const ITEMS: Omit<ProgressItem, "studentId" | "studentName" | "status" | "score" | "submittedAt" | "lastActivityAt">[] = [
  { id: "", batchId: "1", itemId: "l-1", itemTitle: "EC2 Basics", itemType: "lesson", dueAt: new Date(Date.now() - 86400_000 * 3).toISOString(), maxScore: 100 },
  { id: "", batchId: "1", itemId: "q-1", itemTitle: "AWS Fundamentals Quiz", itemType: "quiz", dueAt: new Date(Date.now() + 86400_000 * 2).toISOString(), maxScore: 100 },
  { id: "", batchId: "1", itemId: "a-1", itemTitle: "Build a VPC", itemType: "assignment", dueAt: new Date(Date.now() + 86400_000 * 5).toISOString(), maxScore: 100 },
  { id: "", batchId: "1", itemId: "e-1", itemTitle: "Two Sum Exercise", itemType: "exercise", dueAt: new Date(Date.now() + 86400_000 * 4).toISOString(), maxScore: 100 },
  { id: "", batchId: "1", itemId: "lab-1", itemTitle: "EC2 Instance Setup Lab", itemType: "lab", dueAt: new Date(Date.now() + 86400_000 * 1).toISOString(), maxScore: 100 },
];

function seedItems(): ProgressItem[] {
  const out: ProgressItem[] = [];
  let n = 0;
  for (const s of STUDENTS) {
    for (const tpl of ITEMS) {
      const r = ((s.id.charCodeAt(0) + n) % 10) / 10;
      let status: ProgressStatus = "not_started";
      let score: number | undefined;
      let submittedAt: string | undefined;
      if (r > 0.7) {
        status = "graded";
        score = Math.round(40 + r * 55);
        submittedAt = new Date(Date.now() - 86400_000 * 2).toISOString();
      } else if (r > 0.45) {
        status = "submitted";
        submittedAt = new Date(Date.now() - 86400_000).toISOString();
      } else if (r > 0.2) {
        status = "in_progress";
      }
      out.push({
        ...tpl,
        id: `p-${n++}`,
        studentId: s.id,
        studentName: s.name,
        status,
        score,
        submittedAt,
        lastActivityAt: new Date(Date.now() - r * 86400_000 * 7).toISOString(),
      });
    }
  }
  return out;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  items: seedItems(),
  forBatch: (batchId) => get().items.filter((i) => i.batchId === batchId),
  forStudent: (batchId, studentId) =>
    get().items.filter((i) => i.batchId === batchId && i.studentId === studentId),
  dueThisWeek: (batchId) => {
    const now = Date.now();
    const week = now + 86400_000 * 7;
    return get().items.filter(
      (i) =>
        i.batchId === batchId &&
        i.dueAt &&
        +new Date(i.dueAt) >= now &&
        +new Date(i.dueAt) <= week
    );
  },
  studentCompletion: (batchId, studentId) => {
    const list = get().items.filter(
      (i) => i.batchId === batchId && i.studentId === studentId
    );
    if (!list.length) return 0;
    const done = list.filter((i) => i.status === "graded" || i.status === "submitted").length;
    return Math.round((done / list.length) * 100);
  },
  atRiskStudents: (batchId) => {
    const byStudent = new Map<string, { name: string; total: number; done: number }>();
    for (const i of get().items.filter((x) => x.batchId === batchId)) {
      const cur = byStudent.get(i.studentId) || { name: i.studentName, total: 0, done: 0 };
      cur.total += 1;
      if (i.status === "graded" || i.status === "submitted") cur.done += 1;
      byStudent.set(i.studentId, cur);
    }
    const out: { studentId: string; studentName: string; completion: number }[] = [];
    byStudent.forEach((v, k) => {
      const pct = v.total ? Math.round((v.done / v.total) * 100) : 0;
      if (pct < 50) out.push({ studentId: k, studentName: v.name, completion: pct });
    });
    return out.sort((a, b) => a.completion - b.completion);
  },
}));
