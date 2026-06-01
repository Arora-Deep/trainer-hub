import { create } from "zustand";

// ---------- Types ----------
export type SkillKey =
  | "cloud" | "linux" | "kubernetes" | "security"
  | "networking" | "devops" | "ai" | "python" | "infra";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface ModuleNode {
  id: string;
  name: string;
  kind: "course" | "lesson" | "lab" | "challenge" | "assessment";
  detail: string;
  link: string;
  status: "locked" | "available" | "in_progress" | "completed";
  estMinutes?: number;
  prerequisiteIds?: string[];
}

export interface LearningPath {
  key: SkillKey;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  estHours: number;
  modules: ModuleNode[];
  mastery: number; // 0-100
}

export interface Challenge {
  id: string;
  title: string;
  brief: string;
  category: SkillKey;
  difficulty: Difficulty;
  duration: string;
  status: "available" | "in_progress" | "completed";
  participants: number;
  // Optional multi-step storyline (absorbed from old Quests)
  steps?: Array<{
    id: string;
    title: string;
    detail: string;
    link: string;
    completed: boolean;
  }>;
  reward?: string;            // e.g. "Certificate of Cluster Initiate"
  completedAt?: string;
  // kept for backward-compat with the trainer Engagement page
  xp?: number;
}

export interface CompletedLab {
  id: string;
  title: string;
  completedAt: string;
  outcome: string;
  skill: SkillKey;
}

export interface SkillMastery {
  key: SkillKey;
  label: string;
  mastery: number; // 0-100, derived from assessments + labs
}

export interface Streak {
  current: number;
  longest: number;
  weeklyDays: boolean[];           // last 7 days
  activity: Record<string, number>;// YYYY-MM-DD -> intensity 0-4 (last 30+ days)
  lastActive: string;
}

export interface Portfolio {
  handle: string;
  headline: string;
  isPublic: boolean;
  links: { label: string; url: string }[];
}

export interface BatchLeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  initials: string;
  completionPct: number;  // % of program completed
  avgScore: number;       // average assessment score
  labsShipped: number;
  score: number;          // composite
  you?: boolean;
}

export interface BatchInfo {
  id: string;
  name: string;
}

// ---------- Helpers ----------
function seedActivity(): Record<string, number> {
  const out: Record<string, number> = {};
  const today = new Date();
  for (let i = 0; i < 35; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const recency = 1 - i / 35;
    const r = Math.random();
    if (r < 0.25 - recency * 0.15) out[key] = 0;
    else if (r < 0.55) out[key] = 1;
    else if (r < 0.82) out[key] = 2;
    else if (r < 0.95) out[key] = 3;
    else out[key] = 4;
  }
  return out;
}

// ---------- Seed data ----------
const skillLabel: Record<SkillKey, string> = {
  cloud: "Cloud", linux: "Linux", kubernetes: "Kubernetes",
  security: "Security", networking: "Networking", devops: "DevOps",
  ai: "AI / ML", python: "Python", infra: "Infrastructure",
};

const skillMastery: SkillMastery[] = [
  { key: "linux",      label: skillLabel.linux,      mastery: 84 },
  { key: "kubernetes", label: skillLabel.kubernetes, mastery: 72 },
  { key: "cloud",      label: skillLabel.cloud,      mastery: 68 },
  { key: "devops",     label: skillLabel.devops,     mastery: 61 },
  { key: "networking", label: skillLabel.networking, mastery: 54 },
  { key: "infra",      label: skillLabel.infra,      mastery: 49 },
  { key: "security",   label: skillLabel.security,   mastery: 38 },
  { key: "python",     label: skillLabel.python,     mastery: 32 },
  { key: "ai",         label: skillLabel.ai,         mastery: 14 },
];

const learningPaths: LearningPath[] = [
  {
    key: "linux", slug: "linux-fundamentals",
    name: "Linux Fundamentals",
    tagline: "From the shell to systemd internals.",
    description: "Become fluent at the Linux command line and confident running production workloads. Covers process management, networking, scripting, and security.",
    estHours: 24, mastery: 84,
    modules: [
      { id: "l1", name: "Terminal Basics",     kind: "course",     detail: "Course · 6 lessons",    link: "/student/courses", status: "completed", estMinutes: 90 },
      { id: "l2", name: "File Systems",        kind: "lab",        detail: "Lab · 45m",             link: "/student/labs",    status: "completed", estMinutes: 45 },
      { id: "l3", name: "Process Management",  kind: "lab",        detail: "Lab · 1h",              link: "/student/labs",    status: "completed", estMinutes: 60 },
      { id: "l4", name: "Networking",          kind: "lab",        detail: "Lab · 1h",              link: "/student/labs",    status: "in_progress", estMinutes: 60 },
      { id: "l5", name: "Shell Scripting",     kind: "course",     detail: "Course · 4 lessons",    link: "/student/courses", status: "available", estMinutes: 75 },
      { id: "l6", name: "Permissions & SELinux", kind: "lab",      detail: "Lab · 1.5h",            link: "/student/labs",    status: "locked", estMinutes: 90, prerequisiteIds: ["l5"] },
      { id: "l7", name: "Linux Mastery Check", kind: "assessment", detail: "15 questions",          link: "/student/assessments", status: "locked", estMinutes: 30, prerequisiteIds: ["l6"] },
    ],
  },
  {
    key: "kubernetes", slug: "kubernetes-track",
    name: "Kubernetes Track",
    tagline: "From pods to production clusters.",
    description: "Stand up real clusters, deploy stateful workloads, and run production-grade Kubernetes — including HA control planes and cluster admin.",
    estHours: 38, mastery: 72,
    modules: [
      { id: "k1", name: "Pods & Deployments",      kind: "course", detail: "Course · 5 lessons", link: "/student/courses", status: "completed" },
      { id: "k2", name: "Services & Ingress",      kind: "lab",    detail: "Lab · 1h",           link: "/student/labs",    status: "completed" },
      { id: "k3", name: "ConfigMaps & Secrets",    kind: "lab",    detail: "Lab · 45m",          link: "/student/labs",    status: "completed" },
      { id: "k4", name: "Networking Deep Dive",    kind: "lab",    detail: "Lab · 1.5h",         link: "/student/labs",    status: "in_progress" },
      { id: "k5", name: "Stateful Workloads",      kind: "lab",    detail: "Lab · 1.5h",         link: "/student/labs",    status: "available" },
      { id: "k6", name: "Cluster Administration",  kind: "lab",    detail: "Lab · 2h",           link: "/student/labs",    status: "locked", prerequisiteIds: ["k5"] },
      { id: "k7", name: "Production HA",           kind: "challenge", detail: "Challenge · 2h",  link: "/student/challenges", status: "locked", prerequisiteIds: ["k6"] },
    ],
  },
  {
    key: "devops", slug: "devops-track",
    name: "DevOps Track",
    tagline: "Pipelines, observability, and platform thinking.",
    description: "Build a complete CI/CD pipeline — Git, containers, IaC, observability, and platform engineering practices.",
    estHours: 32, mastery: 61,
    modules: [
      { id: "d1", name: "Git & GitHub Workflows", kind: "course", detail: "Course · 4 lessons", link: "/student/courses", status: "completed" },
      { id: "d2", name: "CI Pipelines",           kind: "lab",    detail: "Lab · 1h",           link: "/student/labs",    status: "completed" },
      { id: "d3", name: "Containerization",       kind: "lab",    detail: "Lab · 1h",           link: "/student/labs",    status: "in_progress" },
      { id: "d4", name: "Infrastructure as Code", kind: "lab",    detail: "Lab · 1.5h",         link: "/student/labs",    status: "available" },
      { id: "d5", name: "Observability Stack",    kind: "lab",    detail: "Lab · 1.5h",         link: "/student/labs",    status: "locked", prerequisiteIds: ["d4"] },
      { id: "d6", name: "Platform Engineering",   kind: "challenge", detail: "Challenge · 2h",  link: "/student/challenges", status: "locked", prerequisiteIds: ["d5"] },
    ],
  },
  {
    key: "security", slug: "security-track",
    name: "Security Track",
    tagline: "Defend, detect, and respond.",
    description: "Harden systems, design network security, and respond to real incidents across hybrid environments.",
    estHours: 28, mastery: 38,
    modules: [
      { id: "s1", name: "System Hardening",  kind: "lab", detail: "Lab · 1h",   link: "/student/labs", status: "completed" },
      { id: "s2", name: "Network Security",  kind: "lab", detail: "Lab · 1h",   link: "/student/labs", status: "in_progress" },
      { id: "s3", name: "Identity & Access", kind: "lab", detail: "Lab · 1.5h", link: "/student/labs", status: "available" },
      { id: "s4", name: "Threat Detection",  kind: "lab", detail: "Lab · 2h",   link: "/student/labs", status: "locked", prerequisiteIds: ["s3"] },
      { id: "s5", name: "Incident Response", kind: "challenge", detail: "Challenge · 1.5h", link: "/student/challenges", status: "locked", prerequisiteIds: ["s4"] },
    ],
  },
];

const challenges: Challenge[] = [
  {
    id: "c1",
    title: "Deploy Your First Cluster",
    brief: "From bare nodes to a running Kubernetes cluster — then prove it survives a node failure.",
    category: "kubernetes", difficulty: "Intermediate",
    duration: "~3h", status: "in_progress", participants: 184,
    reward: "Certificate · Cluster Initiate",
    steps: [
      { id: "c1s1", title: "Kubernetes Architecture",   detail: "Course · Module 2", link: "/student/courses",     completed: true },
      { id: "c1s2", title: "Provision a 3-node cluster", detail: "Lab · 45m",        link: "/student/labs",        completed: true },
      { id: "c1s3", title: "Deploy your first workload", detail: "Lab · 30m",        link: "/student/labs",        completed: true },
      { id: "c1s4", title: "Survive a node failure",     detail: "Challenge · 45m",  link: "/student/challenges",  completed: false },
      { id: "c1s5", title: "Cluster readiness check",    detail: "Assessment · 10q", link: "/student/assessments", completed: false },
    ],
    xp: 2400,
  },
  {
    id: "c2",
    title: "Debug Broken Infrastructure",
    brief: "Diagnose and recover a misconfigured Terraform stack within the time limit.",
    category: "infra", difficulty: "Intermediate",
    duration: "45m", status: "in_progress", participants: 312,
    reward: "Lab credit · 4 hours",
    xp: 650,
  },
  {
    id: "c3",
    title: "Secure a Vulnerable Server",
    brief: "Harden a Linux box, close exposed services, configure auditd.",
    category: "security", difficulty: "Intermediate",
    duration: "1h", status: "available", participants: 241,
    reward: "Certificate · Linux Hardening",
    xp: 700,
  },
  {
    id: "c4",
    title: "Build an End-to-End CI/CD Pipeline",
    brief: "Build, test, container scan, blue/green deploy to a real cluster — then roll back safely.",
    category: "devops", difficulty: "Advanced",
    duration: "~2h", status: "available", participants: 156,
    reward: "Mentor session · 30 minutes",
    steps: [
      { id: "c4s1", title: "Git workflows that scale", detail: "Course · Module 1", link: "/student/courses", completed: false },
      { id: "c4s2", title: "Build & push containers",  detail: "Lab · 45m",         link: "/student/labs",    completed: false },
      { id: "c4s3", title: "GitHub Actions pipeline",  detail: "Lab · 1h",          link: "/student/labs",    completed: false },
      { id: "c4s4", title: "Blue/green deploy to K8s", detail: "Lab · 1h",          link: "/student/labs",    completed: false },
      { id: "c4s5", title: "Ship & roll back safely",  detail: "Challenge · 45m",   link: "/student/challenges", completed: false },
    ],
    xp: 1100,
  },
  {
    id: "c5",
    title: "Fix the Networking Issue",
    brief: "Two VPCs can't talk. Find the misconfig — without resetting the lab.",
    category: "networking", difficulty: "Beginner",
    duration: "20m", status: "completed", participants: 472,
    completedAt: "2026-05-25",
    reward: "Lab credit · 1 hour",
    xp: 300,
  },
  {
    id: "c6",
    title: "Multi-Cloud Disaster Recovery",
    brief: "Failover workloads from AWS to GCP and validate RPO/RTO targets.",
    category: "cloud", difficulty: "Expert",
    duration: "~4h", status: "available", participants: 38,
    reward: "Certificate · Cloud Sentinel",
    xp: 2200,
  },
];

const completedLabs: CompletedLab[] = [
  { id: "lab-1", title: "Kubernetes Networking Deep Dive", completedAt: "2026-05-26", outcome: "Configured pod-to-pod CNI with Calico", skill: "kubernetes" },
  { id: "lab-2", title: "Terraform State Recovery",        completedAt: "2026-05-22", outcome: "Recovered from corrupted backend, zero downtime", skill: "infra" },
  { id: "lab-3", title: "nftables Firewall Design",        completedAt: "2026-05-18", outcome: "Hardened a multi-zone perimeter", skill: "linux" },
  { id: "lab-4", title: "CI/CD with GitHub Actions",       completedAt: "2026-05-12", outcome: "End-to-end build, test, deploy", skill: "devops" },
  { id: "lab-5", title: "Linux Process Management",        completedAt: "2026-05-04", outcome: "Wrote a production-grade systemd unit", skill: "linux" },
  { id: "lab-6", title: "VPC Segmentation",                completedAt: "2026-04-29", outcome: "3-tier network with private subnets", skill: "cloud" },
];

const batchInfo: BatchInfo[] = [
  { id: "batch-aws-2026", name: "AWS DevOps Bootcamp · Spring 2026" },
  { id: "batch-k8s-2026", name: "Kubernetes Mastery · 2026" },
];

const batchLeaderboards: Record<string, BatchLeaderboardEntry[]> = {
  "batch-aws-2026": [
    { rank: 1, name: "Aarav Mehta",   handle: "aarav",  initials: "AM", completionPct: 78, avgScore: 92, labsShipped: 24, score: 0 },
    { rank: 2, name: "Priya Sharma",  handle: "priya",  initials: "PS", completionPct: 74, avgScore: 91, labsShipped: 22, score: 0 },
    { rank: 3, name: "Sarah Johnson", handle: "sarah",  initials: "SJ", completionPct: 71, avgScore: 88, labsShipped: 21, score: 0, you: true },
    { rank: 4, name: "Marcus Lee",    handle: "marcus", initials: "ML", completionPct: 68, avgScore: 86, labsShipped: 19, score: 0 },
    { rank: 5, name: "Diego Alvarez", handle: "diego",  initials: "DA", completionPct: 64, avgScore: 84, labsShipped: 18, score: 0 },
    { rank: 6, name: "Ananya Iyer",   handle: "ananya", initials: "AI", completionPct: 60, avgScore: 82, labsShipped: 17, score: 0 },
    { rank: 7, name: "Kenji Watanabe",handle: "kenji",  initials: "KW", completionPct: 58, avgScore: 80, labsShipped: 16, score: 0 },
    { rank: 8, name: "Fatima Noor",   handle: "fatima", initials: "FN", completionPct: 52, avgScore: 78, labsShipped: 14, score: 0 },
  ],
  "batch-k8s-2026": [
    { rank: 1, name: "Marcus Lee",    handle: "marcus", initials: "ML", completionPct: 81, avgScore: 94, labsShipped: 26, score: 0 },
    { rank: 2, name: "Sarah Johnson", handle: "sarah",  initials: "SJ", completionPct: 76, avgScore: 90, labsShipped: 23, score: 0, you: true },
    { rank: 3, name: "Aarav Mehta",   handle: "aarav",  initials: "AM", completionPct: 72, avgScore: 89, labsShipped: 22, score: 0 },
    { rank: 4, name: "Rohan Kapoor",  handle: "rohan",  initials: "RK", completionPct: 65, avgScore: 85, labsShipped: 19, score: 0 },
    { rank: 5, name: "Sneha Patel",   handle: "sneha",  initials: "SP", completionPct: 60, avgScore: 83, labsShipped: 17, score: 0 },
  ],
};

// composite score: 50% completion + 35% avg score + 15% labs (normalized to 30)
function computeComposite(e: BatchLeaderboardEntry): number {
  const labsNorm = Math.min(100, (e.labsShipped / 30) * 100);
  return Math.round(e.completionPct * 0.5 + e.avgScore * 0.35 + labsNorm * 0.15);
}

Object.values(batchLeaderboards).forEach((list) => {
  list.forEach((e) => (e.score = computeComposite(e)));
  list.sort((a, b) => b.score - a.score);
  list.forEach((e, i) => (e.rank = i + 1));
});

// ---------- Store ----------
interface GamificationState {
  profile: {
    name: string;
    handle: string;
    headline: string;
    avatarInitials: string;
    batchId: string;
    batchName: string;
    enrolledBatches: BatchInfo[];
    joinedAt: string;
  };
  streak: Streak;
  skillMastery: SkillMastery[];
  learningPaths: LearningPath[];
  challenges: Challenge[];
  completedLabs: CompletedLab[];
  portfolio: Portfolio;
  setPortfolio: (p: Partial<Portfolio>) => void;
  getBatchLeaderboard: (batchId: string) => BatchLeaderboardEntry[];
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  profile: {
    name: "Sarah Johnson",
    handle: "sarah",
    headline: "DevOps & Kubernetes engineer in training",
    avatarInitials: "SJ",
    batchId: "batch-aws-2026",
    batchName: batchInfo[0].name,
    enrolledBatches: batchInfo,
    joinedAt: "2026-01-08",
  },
  streak: {
    current: 14,
    longest: 28,
    weeklyDays: [true, true, true, true, true, true, false],
    activity: seedActivity(),
    lastActive: new Date().toISOString(),
  },
  skillMastery,
  learningPaths,
  challenges,
  completedLabs,
  portfolio: {
    handle: "sarah",
    headline: "DevOps & Kubernetes engineer in training",
    isPublic: true,
    links: [
      { label: "GitHub", url: "https://github.com/sarah" },
      { label: "LinkedIn", url: "https://linkedin.com/in/sarah" },
    ],
  },
  setPortfolio: (p) => set((s) => ({ portfolio: { ...s.portfolio, ...p } })),
  getBatchLeaderboard: (batchId) => batchLeaderboards[batchId] ?? [],
}));

// ---------- Style maps (kept for shared UI) ----------
export const skillColor: Record<SkillKey, string> = {
  cloud: "hsl(210 90% 56%)", linux: "hsl(28 90% 55%)", kubernetes: "hsl(220 85% 60%)",
  security: "hsl(0 75% 58%)", networking: "hsl(160 70% 45%)", devops: "hsl(265 70% 60%)",
  ai: "hsl(290 70% 60%)", python: "hsl(48 90% 55%)", infra: "hsl(190 70% 50%)",
};

export const difficultyStyle: Record<Difficulty, string> = {
  Beginner: "text-success bg-success/10 border-success/20",
  Intermediate: "text-primary bg-primary/10 border-primary/20",
  Advanced: "text-warning bg-warning/10 border-warning/20",
  Expert: "text-destructive bg-destructive/10 border-destructive/20",
};

export const statusStyle: Record<ModuleNode["status"], string> = {
  completed: "text-success bg-success/10 border-success/20",
  in_progress: "text-primary bg-primary/10 border-primary/20",
  available: "text-muted-foreground bg-muted/40 border-border",
  locked: "text-muted-foreground/60 bg-muted/20 border-border opacity-60",
};

// derived helpers
export const pathProgress = (p: LearningPath) => {
  const done = p.modules.filter((m) => m.status === "completed").length;
  return { done, total: p.modules.length, pct: Math.round((done / p.modules.length) * 100) };
};

export const challengeProgress = (c: Challenge) => {
  if (!c.steps?.length) return { done: 0, total: 0, pct: c.status === "completed" ? 100 : 0 };
  const done = c.steps.filter((s) => s.completed).length;
  return { done, total: c.steps.length, pct: Math.round((done / c.steps.length) * 100) };
};
