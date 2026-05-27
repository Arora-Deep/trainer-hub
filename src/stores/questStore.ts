import { create } from "zustand";
import type { SkillKey } from "./gamificationStore";

export type QuestStepKind = "course" | "lesson" | "lab" | "quiz" | "challenge" | "assessment";
export type QuestStatus = "locked" | "available" | "in_progress" | "completed";

export interface QuestStep {
  id: string;
  kind: QuestStepKind;
  title: string;
  detail: string;
  link: string;
  xp: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  tagline: string;
  story: string;
  skill: SkillKey;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  totalXp: number;
  rewardTitle: string;
  steps: QuestStep[];
  status: QuestStatus;
}

const seedQuests: Quest[] = [
  {
    id: "q1",
    title: "Deploy Your First Cluster",
    tagline: "From bare nodes to a running Kubernetes cluster.",
    story: "Stand up a real cluster, deploy your first workload, then prove it survives a node failure.",
    skill: "kubernetes",
    difficulty: "Intermediate",
    totalXp: 2400,
    rewardTitle: "Cluster Initiate",
    status: "in_progress",
    steps: [
      { id: "q1s1", kind: "lesson", title: "Kubernetes Architecture", detail: "Course · Module 2", link: "/student/courses", xp: 300, completed: true },
      { id: "q1s2", kind: "lab",    title: "Provision a 3-node cluster", detail: "Lab · 45m",          link: "/student/labs",    xp: 500, completed: true },
      { id: "q1s3", kind: "lab",    title: "Deploy your first workload", detail: "Lab · 30m",          link: "/student/labs",    xp: 400, completed: true },
      { id: "q1s4", kind: "challenge", title: "Survive a node failure",  detail: "Challenge · 45m",    link: "/student/challenges", xp: 700, completed: false },
      { id: "q1s5", kind: "assessment", title: "Cluster readiness check", detail: "10 questions",      link: "/student/assessments", xp: 500, completed: false },
    ],
  },
  {
    id: "q2",
    title: "Linux Black Belt",
    tagline: "From shell to systemd internals.",
    story: "Master process management, networking, and SELinux through hands-on labs.",
    skill: "linux",
    difficulty: "Advanced",
    totalXp: 3200,
    rewardTitle: "Linux Sensei",
    status: "available",
    steps: [
      { id: "q2s1", kind: "lab",   title: "Process trees & signals",   detail: "Lab · 40m", link: "/student/labs", xp: 500, completed: false },
      { id: "q2s2", kind: "lab",   title: "nftables firewall design",  detail: "Lab · 1h",  link: "/student/labs", xp: 700, completed: false },
      { id: "q2s3", kind: "challenge", title: "Recover a broken boot", detail: "Challenge · 1h", link: "/student/challenges", xp: 900, completed: false },
      { id: "q2s4", kind: "lab",   title: "Harden with SELinux",       detail: "Lab · 1h",  link: "/student/labs", xp: 600, completed: false },
      { id: "q2s5", kind: "assessment", title: "Linux mastery check",  detail: "15 questions", link: "/student/assessments", xp: 500, completed: false },
    ],
  },
  {
    id: "q3",
    title: "From Zero to DevOps",
    tagline: "Build a complete CI/CD pipeline end-to-end.",
    story: "Git workflows, container builds, security scans, and blue/green deploys to a real cluster.",
    skill: "devops",
    difficulty: "Advanced",
    totalXp: 3600,
    rewardTitle: "Pipeline Architect",
    status: "available",
    steps: [
      { id: "q3s1", kind: "lesson", title: "Git workflows that scale",  detail: "Course · Module 1", link: "/student/courses", xp: 400, completed: false },
      { id: "q3s2", kind: "lab",    title: "Build & push containers",   detail: "Lab · 45m",        link: "/student/labs", xp: 600, completed: false },
      { id: "q3s3", kind: "lab",    title: "GitHub Actions pipeline",   detail: "Lab · 1h",         link: "/student/labs", xp: 800, completed: false },
      { id: "q3s4", kind: "lab",    title: "Blue/green deploy to K8s",  detail: "Lab · 1h",         link: "/student/labs", xp: 900, completed: false },
      { id: "q3s5", kind: "challenge", title: "Ship & roll back safely", detail: "Challenge · 45m", link: "/student/challenges", xp: 900, completed: false },
    ],
  },
  {
    id: "q4",
    title: "Cloud Sentinel",
    tagline: "Secure workloads across providers.",
    story: "Identity, network, and detection — across AWS, GCP, and Azure.",
    skill: "security",
    difficulty: "Expert",
    totalXp: 4800,
    rewardTitle: "Cloud Sentinel",
    status: "locked",
    steps: [
      { id: "q4s1", kind: "lab", title: "IAM least-privilege design", detail: "Lab · 1h", link: "/student/labs", xp: 800, completed: false },
      { id: "q4s2", kind: "lab", title: "VPC segmentation",            detail: "Lab · 1h", link: "/student/labs", xp: 900, completed: false },
      { id: "q4s3", kind: "challenge", title: "Detect the intrusion",  detail: "Challenge · 1h", link: "/student/challenges", xp: 1100, completed: false },
      { id: "q4s4", kind: "lab", title: "Multi-cloud audit trail",     detail: "Lab · 1.5h", link: "/student/labs", xp: 1100, completed: false },
      { id: "q4s5", kind: "assessment", title: "Cloud security exam",  detail: "20 questions", link: "/student/assessments", xp: 900, completed: false },
    ],
  },
];

interface QuestState {
  quests: Quest[];
  active?: string;
  setActive: (id: string) => void;
}

export const useQuestStore = create<QuestState>((set) => ({
  quests: seedQuests,
  active: "q1",
  setActive: (id) => set({ active: id }),
}));

export const questProgress = (q: Quest) => {
  const done = q.steps.filter(s => s.completed).length;
  return { done, total: q.steps.length, pct: Math.round((done / q.steps.length) * 100) };
};
