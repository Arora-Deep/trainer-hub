import { create } from "zustand";

export interface TrainerFeedback {
  id: string;
  studentName: string;
  batchName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface TrainerMetrics {
  avgRating: number;        // 0-5
  npsScore: number;         // -100..100
  completionRate: number;   // 0-100
  attendanceRate: number;   // 0-100
  batchesDelivered: number;
  studentsTrained: number;
  ratingTrend: { month: string; rating: number }[];
  scoreDistribution: { bucket: string; count: number }[];
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  certifications: string[];
  bio: string;
  hourlyRate: number;
  joinedAt: string;
  status: "active" | "inactive";
  assignedBatchIds: string[];
  metrics: TrainerMetrics;
  feedback: TrainerFeedback[];
}

const trend = (base: number) =>
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => ({
    month: m,
    rating: Math.max(3, Math.min(5, +(base + (Math.sin(i) * 0.3)).toFixed(2))),
  }));

const dist = (peak: number) => [
  { bucket: "0-40", count: Math.max(0, 5 - peak) },
  { bucket: "40-60", count: 4 },
  { bucket: "60-75", count: 8 },
  { bucket: "75-90", count: peak * 2 },
  { bucket: "90-100", count: peak },
];

const initial: Trainer[] = [
  {
    id: "t-1",
    name: "Rahul Verma",
    email: "rahul.verma@cloudadda.com",
    skills: ["Java", "Spring Boot", "Microservices", "Maven"],
    certifications: ["Oracle Certified Java SE 11", "Spring Professional"],
    bio: "10+ years building enterprise Java systems. Loves teaching beginners and explaining JVM internals.",
    hourlyRate: 2200,
    joinedAt: "2023-04-12",
    status: "active",
    assignedBatchIds: ["10"],
    metrics: {
      avgRating: 4.7, npsScore: 72, completionRate: 92, attendanceRate: 95,
      batchesDelivered: 14, studentsTrained: 312,
      ratingTrend: trend(4.6), scoreDistribution: dist(9),
    },
    feedback: [
      { id: "f1", studentName: "Alice K.", batchName: "Java Fundamentals — Cohort 24", rating: 5, comment: "Best trainer I've had. Explanations are crystal clear.", date: "2026-06-10" },
      { id: "f2", studentName: "Vivek M.", batchName: "Java Fundamentals — Cohort 23", rating: 4, comment: "Very thorough, sometimes goes deep too fast.", date: "2026-05-22" },
    ],
  },
  {
    id: "t-2",
    name: "Priya Nair",
    email: "priya.nair@cloudadda.com",
    skills: ["Python", "Data Science", "Pandas", "ML"],
    certifications: ["AWS ML Specialty", "Google Data Analytics"],
    bio: "Data scientist turned educator. Specialises in Python for analytics and ML fundamentals.",
    hourlyRate: 2500,
    joinedAt: "2022-11-03",
    status: "active",
    assignedBatchIds: ["11"],
    metrics: {
      avgRating: 4.8, npsScore: 80, completionRate: 95, attendanceRate: 97,
      batchesDelivered: 22, studentsTrained: 480,
      ratingTrend: trend(4.7), scoreDistribution: dist(10),
    },
    feedback: [
      { id: "f3", studentName: "Sneha R.", batchName: "Python Fundamentals — Cohort 14", rating: 5, comment: "Hands-on labs were excellent.", date: "2026-06-08" },
    ],
  },
  {
    id: "t-3",
    name: "John Smith",
    email: "john.smith@cloudadda.com",
    skills: ["AWS", "Cloud Architecture", "Terraform"],
    certifications: ["AWS Solutions Architect Pro", "AWS DevOps Pro"],
    bio: "AWS Solutions Architect with 12 years of cloud delivery experience.",
    hourlyRate: 2800,
    joinedAt: "2021-06-20",
    status: "active",
    assignedBatchIds: ["1"],
    metrics: {
      avgRating: 4.5, npsScore: 65, completionRate: 88, attendanceRate: 91,
      batchesDelivered: 18, studentsTrained: 410,
      ratingTrend: trend(4.4), scoreDistribution: dist(8),
    },
    feedback: [],
  },
  {
    id: "t-4",
    name: "Jane Doe",
    email: "jane.doe@cloudadda.com",
    skills: ["Kubernetes", "Docker", "CI/CD"],
    certifications: ["CKA", "CKAD"],
    bio: "Container & orchestration specialist.",
    hourlyRate: 2600,
    joinedAt: "2022-02-14",
    status: "active",
    assignedBatchIds: ["2"],
    metrics: {
      avgRating: 4.6, npsScore: 70, completionRate: 90, attendanceRate: 93,
      batchesDelivered: 16, studentsTrained: 360,
      ratingTrend: trend(4.5), scoreDistribution: dist(8),
    },
    feedback: [],
  },
  {
    id: "t-5",
    name: "Sarah Wilson",
    email: "sarah.wilson@cloudadda.com",
    skills: ["DevOps", "Jenkins", "Ansible", "Linux"],
    certifications: ["RHCE", "Jenkins Engineer"],
    bio: "DevOps engineer focused on automation pipelines.",
    hourlyRate: 2400,
    joinedAt: "2023-01-09",
    status: "active",
    assignedBatchIds: ["4", "7"],
    metrics: {
      avgRating: 4.3, npsScore: 58, completionRate: 85, attendanceRate: 89,
      batchesDelivered: 11, studentsTrained: 240,
      ratingTrend: trend(4.3), scoreDistribution: dist(6),
    },
    feedback: [],
  },
  {
    id: "t-6",
    name: "Dr. Anjali Rao",
    email: "anjali.rao@cloudadda.com",
    skills: ["Machine Learning", "Deep Learning", "PyTorch", "Statistics"],
    certifications: ["PhD Computer Science", "TensorFlow Developer"],
    bio: "ML researcher and educator. Published author on neural network optimisation.",
    hourlyRate: 3200,
    joinedAt: "2021-09-15",
    status: "active",
    assignedBatchIds: ["9"],
    metrics: {
      avgRating: 4.9, npsScore: 85, completionRate: 96, attendanceRate: 98,
      batchesDelivered: 9, studentsTrained: 180,
      ratingTrend: trend(4.8), scoreDistribution: dist(11),
    },
    feedback: [],
  },
  {
    id: "t-7",
    name: "Tom Brown",
    email: "tom.brown@cloudadda.com",
    skills: ["Azure", "PowerShell", ".NET"],
    certifications: ["Azure Solutions Architect Expert"],
    bio: "Azure cloud specialist with strong Windows ecosystem expertise.",
    hourlyRate: 2300,
    joinedAt: "2023-08-22",
    status: "inactive",
    assignedBatchIds: [],
    metrics: {
      avgRating: 4.1, npsScore: 45, completionRate: 80, attendanceRate: 86,
      batchesDelivered: 6, studentsTrained: 130,
      ratingTrend: trend(4.1), scoreDistribution: dist(5),
    },
    feedback: [],
  },
];

interface TrainerStore {
  trainers: Trainer[];
  addTrainer: (t: Omit<Trainer, "id" | "metrics" | "feedback" | "assignedBatchIds" | "joinedAt" | "status">) => string;
  updateTrainer: (id: string, updates: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  assignToBatch: (trainerId: string, batchId: string) => void;
  unassignFromBatch: (trainerId: string, batchId: string) => void;
  getTrainer: (id: string) => Trainer | undefined;
  getTrainerByName: (name: string) => Trainer | undefined;
}

export const useTrainerStore = create<TrainerStore>((set, get) => ({
  trainers: initial,
  addTrainer: (t) => {
    const id = `t-${Date.now()}`;
    const trainer: Trainer = {
      ...t,
      id,
      joinedAt: new Date().toISOString().slice(0, 10),
      status: "active",
      assignedBatchIds: [],
      feedback: [],
      metrics: {
        avgRating: 0, npsScore: 0, completionRate: 0, attendanceRate: 0,
        batchesDelivered: 0, studentsTrained: 0,
        ratingTrend: trend(4), scoreDistribution: dist(4),
      },
    };
    set((s) => ({ trainers: [trainer, ...s.trainers] }));
    return id;
  },
  updateTrainer: (id, updates) =>
    set((s) => ({ trainers: s.trainers.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
  deleteTrainer: (id) =>
    set((s) => ({ trainers: s.trainers.filter((t) => t.id !== id) })),
  assignToBatch: (trainerId, batchId) =>
    set((s) => ({
      trainers: s.trainers.map((t) =>
        t.id === trainerId && !t.assignedBatchIds.includes(batchId)
          ? { ...t, assignedBatchIds: [...t.assignedBatchIds, batchId] }
          : t
      ),
    })),
  unassignFromBatch: (trainerId, batchId) =>
    set((s) => ({
      trainers: s.trainers.map((t) =>
        t.id === trainerId
          ? { ...t, assignedBatchIds: t.assignedBatchIds.filter((b) => b !== batchId) }
          : t
      ),
    })),
  getTrainer: (id) => get().trainers.find((t) => t.id === id),
  getTrainerByName: (name) => get().trainers.find((t) => t.name === name),
}));

export const ALL_SKILLS = [
  "Java", "Spring Boot", "Microservices", "Maven", "Python", "Data Science",
  "Pandas", "ML", "AWS", "Cloud Architecture", "Terraform", "Kubernetes",
  "Docker", "CI/CD", "DevOps", "Jenkins", "Ansible", "Linux", "Machine Learning",
  "Deep Learning", "PyTorch", "Statistics", "Azure", "PowerShell", ".NET",
  "React", "Node.js", "TypeScript", "GraphQL", "SQL", "MongoDB",
];
