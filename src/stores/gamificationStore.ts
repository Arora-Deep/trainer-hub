import { create } from "zustand";

// ---------- Types ----------
export type SkillKey =
  | "cloud" | "linux" | "kubernetes" | "security"
  | "networking" | "devops" | "ai" | "python" | "infra";

export interface Skill {
  key: SkillKey;
  label: string;
  xp: number;
  level: number;
  nextLevelXp: number;
  rank: string;          // e.g. "Operator", "Engineer"
  percentile: number;    // 0-100
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "milestone" | "lab" | "streak" | "challenge" | "mastery";
  tier: "bronze" | "silver" | "gold" | "platinum";
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; total: number };
  icon: string; // lucide icon name
}

export interface Mission {
  id: string;
  title: string;
  detail: string;
  xp: number;
  target: number;
  progress: number;
  skill?: SkillKey;
}

export interface Challenge {
  id: string;
  title: string;
  brief: string;
  category: SkillKey;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  xp: number;
  duration: string;
  status: "available" | "in_progress" | "completed";
  participants: number;
}

export interface XPEvent {
  id: string;
  ts: string;           // ISO
  label: string;
  amount: number;
  skill: SkillKey;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  handle: string;
  level: number;
  xp: number;
  delta: number;        // rank change
  identity: string;
  you?: boolean;
}

export interface SkillNode {
  id: string;
  name: string;
  xp: number;
  status: "locked" | "available" | "in_progress" | "mastered";
  children?: SkillNode[];
}

export interface SkillTrack {
  key: SkillKey;
  name: string;
  tagline: string;
  mastery: number; // 0-100
  nodes: SkillNode[];
}

// ---------- Helpers ----------
const skillRank = (level: number) => {
  if (level >= 35) return "Architect";
  if (level >= 25) return "Specialist";
  if (level >= 15) return "Engineer";
  if (level >= 8)  return "Operator";
  if (level >= 3)  return "Apprentice";
  return "Initiate";
};

// ---------- Seed data ----------
const skills: Skill[] = [
  { key: "kubernetes", label: "Kubernetes", xp: 4820, level: 18, nextLevelXp: 5400, rank: skillRank(18), percentile: 94 },
  { key: "linux",      label: "Linux",      xp: 6210, level: 22, nextLevelXp: 7000, rank: skillRank(22), percentile: 88 },
  { key: "devops",     label: "DevOps",     xp: 3950, level: 15, nextLevelXp: 4500, rank: skillRank(15), percentile: 82 },
  { key: "cloud",      label: "Cloud",      xp: 5120, level: 19, nextLevelXp: 5800, rank: skillRank(19), percentile: 79 },
  { key: "networking", label: "Networking", xp: 2140, level: 11, nextLevelXp: 2600, rank: skillRank(11), percentile: 64 },
  { key: "security",   label: "Security",   xp: 1280, level: 7,  nextLevelXp: 1800, rank: skillRank(7),  percentile: 52 },
  { key: "infra",      label: "Infrastructure", xp: 3340, level: 14, nextLevelXp: 4000, rank: skillRank(14), percentile: 71 },
  { key: "python",     label: "Python",     xp: 980,  level: 6,  nextLevelXp: 1400, rank: skillRank(6),  percentile: 41 },
  { key: "ai",         label: "AI / ML",    xp: 320,  level: 3,  nextLevelXp: 600,  rank: skillRank(3),  percentile: 22 },
];

const totalXp = skills.reduce((s, k) => s + k.xp, 0);
const overallLevel = 24;            // derived
const nextLevelTotal = 32000;

const achievements: Achievement[] = [
  { id: "a1", title: "First Deployment", description: "Deploy your first production-grade workload.", category: "milestone", tier: "bronze", unlocked: true, unlockedAt: "2026-02-14", icon: "Rocket" },
  { id: "a2", title: "Linux Survivor", description: "Complete 25 Linux labs without resetting.", category: "lab", tier: "silver", unlocked: true, unlockedAt: "2026-03-02", icon: "Terminal" },
  { id: "a3", title: "Kubernetes Builder", description: "Stand up a multi-node cluster from scratch.", category: "lab", tier: "gold", unlocked: true, unlockedAt: "2026-04-11", icon: "Boxes" },
  { id: "a4", title: "Packet Hunter", description: "Diagnose 10 real-world networking issues.", category: "challenge", tier: "silver", unlocked: true, unlockedAt: "2026-04-21", icon: "Network" },
  { id: "a5", title: "Cloud Commander", description: "Operate workloads across 3 cloud providers.", category: "mastery", tier: "gold", unlocked: false, progress: { current: 2, total: 3 }, icon: "Cloud" },
  { id: "a6", title: "100 Hours in Labs", description: "Spend 100 hands-on hours in CloudAdda labs.", category: "milestone", tier: "gold", unlocked: false, progress: { current: 78, total: 100 }, icon: "Clock" },
  { id: "a7", title: "Night Shift Engineer", description: "Complete 20 labs between 10pm and 2am.", category: "streak", tier: "silver", unlocked: false, progress: { current: 13, total: 20 }, icon: "Moon" },
  { id: "a8", title: "Cluster Architect", description: "Design and deploy a production-grade HA cluster.", category: "mastery", tier: "platinum", unlocked: false, progress: { current: 0, total: 1 }, icon: "Server" },
  { id: "a9", title: "DevOps Specialist", description: "Reach Level 20 on the DevOps skill track.", category: "mastery", tier: "platinum", unlocked: false, progress: { current: 15, total: 20 }, icon: "Workflow" },
  { id: "a10", title: "Infrastructure Operator", description: "Maintain 99% lab uptime over 30 days.", category: "milestone", tier: "gold", unlocked: false, progress: { current: 27, total: 30 }, icon: "Activity" },
];

const dailyMissions: Mission[] = [
  { id: "d1", title: "Complete 1 lab", detail: "Any lab counts — finish today's task.", xp: 150, target: 1, progress: 0, skill: "infra" },
  { id: "d2", title: "Spend 60 minutes hands-on", detail: "Active terminal time in any environment.", xp: 100, target: 60, progress: 32 },
  { id: "d3", title: "Attempt today's challenge", detail: "Debug-the-cluster · Intermediate", xp: 200, target: 1, progress: 0, skill: "kubernetes" },
];

const weeklyMissions: Mission[] = [
  { id: "w1", title: "Finish 5 labs this week", detail: "Across any skill track.", xp: 600, target: 5, progress: 3 },
  { id: "w2", title: "Attend 2 live sessions", detail: "Stay engaged with your cohort.", xp: 400, target: 2, progress: 1 },
  { id: "w3", title: "Complete 1 Advanced challenge", detail: "Push your edge.", xp: 800, target: 1, progress: 0, skill: "devops" },
  { id: "w4", title: "Maintain a 7-day streak", detail: "Show up every day.", xp: 500, target: 7, progress: 5 },
];

const challenges: Challenge[] = [
  { id: "c1", title: "Deploy a Highly-Available Kubernetes Cluster", brief: "Provision a 3-master / 5-worker cluster with etcd quorum and validate failover.", category: "kubernetes", difficulty: "Advanced", xp: 1200, duration: "~2h", status: "available", participants: 184 },
  { id: "c2", title: "Debug Broken Infrastructure",                brief: "Diagnose and recover a misconfigured Terraform stack within the time limit.",      category: "infra",      difficulty: "Intermediate", xp: 650,  duration: "45m", status: "in_progress", participants: 312 },
  { id: "c3", title: "Secure a Vulnerable Server",                  brief: "Harden a Linux box, close exposed services, configure auditd.",                     category: "security",   difficulty: "Intermediate", xp: 700,  duration: "1h",  status: "available", participants: 241 },
  { id: "c4", title: "Configure a CI/CD Pipeline",                  brief: "End-to-end pipeline: build, test, container scan, blue/green deploy.",              category: "devops",     difficulty: "Advanced", xp: 1100, duration: "~2h", status: "available", participants: 156 },
  { id: "c5", title: "Fix the Networking Issue",                    brief: "Two VPCs can't talk. Find the misconfig — without resetting the lab.",              category: "networking", difficulty: "Beginner",     xp: 300,  duration: "20m", status: "completed", participants: 472 },
  { id: "c6", title: "Build a Multi-Cloud Disaster Recovery Plan",  brief: "Failover workloads from AWS to GCP and validate RPO/RTO targets.",                 category: "cloud",      difficulty: "Expert",       xp: 2200, duration: "~4h", status: "available", participants: 38 },
];

const xpFeed: XPEvent[] = [
  { id: "x1", ts: "2026-05-26T09:14:00Z", label: "Lab completed · Kubernetes Networking Deep Dive", amount: 350, skill: "kubernetes" },
  { id: "x2", ts: "2026-05-26T08:02:00Z", label: "Live session attended · CI/CD with GitHub Actions", amount: 120, skill: "devops" },
  { id: "x3", ts: "2026-05-25T22:40:00Z", label: "Daily streak bonus · Day 14",                       amount: 80,  skill: "infra" },
  { id: "x4", ts: "2026-05-25T19:11:00Z", label: "Challenge completed · Fix the Networking Issue",    amount: 300, skill: "networking" },
  { id: "x5", ts: "2026-05-25T15:30:00Z", label: "Assessment passed · Linux Process Management",      amount: 220, skill: "linux" },
  { id: "x6", ts: "2026-05-24T20:01:00Z", label: "Lab completed · Terraform State Recovery",          amount: 280, skill: "infra" },
];

const leaderboard: { weekly: LeaderboardEntry[]; batch: LeaderboardEntry[]; streaks: LeaderboardEntry[]; kubernetes: LeaderboardEntry[] } = {
  weekly: [
    { rank: 1, name: "Aarav Mehta",   handle: "@aarav",   level: 31, xp: 4820, delta:  2, identity: "Cloud Architect" },
    { rank: 2, name: "Priya Sharma",  handle: "@priya",   level: 29, xp: 4510, delta: -1, identity: "DevOps Engineer" },
    { rank: 3, name: "Sarah Johnson", handle: "@sarah",   level: 24, xp: 4180, delta:  4, identity: "DevOps Engineer", you: true },
    { rank: 4, name: "Marcus Lee",    handle: "@marcus",  level: 27, xp: 4020, delta:  0, identity: "Kubernetes Engineer" },
    { rank: 5, name: "Diego Alvarez", handle: "@diego",   level: 26, xp: 3890, delta: -2, identity: "Linux Operator" },
    { rank: 6, name: "Ananya Iyer",   handle: "@ananya",  level: 22, xp: 3640, delta:  1, identity: "Security Specialist" },
    { rank: 7, name: "Kenji Watanabe",handle: "@kenji",   level: 25, xp: 3520, delta: -1, identity: "Infrastructure Engineer" },
    { rank: 8, name: "Fatima Noor",   handle: "@fatima",  level: 21, xp: 3310, delta:  3, identity: "Cloud Apprentice" },
  ],
  batch: [
    { rank: 1, name: "Sarah Johnson", handle: "@sarah",  level: 24, xp: 4180, delta: 1, identity: "DevOps Engineer", you: true },
    { rank: 2, name: "Ananya Iyer",   handle: "@ananya", level: 22, xp: 3640, delta: 0, identity: "Security Specialist" },
    { rank: 3, name: "Rohan Kapoor",  handle: "@rohan",  level: 19, xp: 3120, delta: 2, identity: "Cloud Operator" },
    { rank: 4, name: "Sneha Patel",   handle: "@sneha",  level: 18, xp: 2870, delta: -1, identity: "Linux Operator" },
    { rank: 5, name: "Vikram Singh",  handle: "@vikram", level: 16, xp: 2410, delta: 0, identity: "DevOps Apprentice" },
  ],
  streaks: [
    { rank: 1, name: "Priya Sharma",  handle: "@priya",  level: 29, xp: 92,  delta: 0, identity: "92-day streak" },
    { rank: 2, name: "Aarav Mehta",   handle: "@aarav",  level: 31, xp: 78,  delta: 0, identity: "78-day streak" },
    { rank: 3, name: "Sarah Johnson", handle: "@sarah",  level: 24, xp: 14,  delta: 1, identity: "14-day streak", you: true },
    { rank: 4, name: "Diego Alvarez", handle: "@diego",  level: 26, xp: 11,  delta: -1, identity: "11-day streak" },
  ],
  kubernetes: [
    { rank: 1, name: "Marcus Lee",    handle: "@marcus", level: 27, xp: 6210, delta: 0, identity: "Kubernetes Engineer" },
    { rank: 2, name: "Sarah Johnson", handle: "@sarah",  level: 24, xp: 4820, delta: 1, identity: "Kubernetes Engineer", you: true },
    { rank: 3, name: "Aarav Mehta",   handle: "@aarav",  level: 31, xp: 4640, delta: -1, identity: "Cloud Architect" },
    { rank: 4, name: "Ananya Iyer",   handle: "@ananya", level: 22, xp: 3210, delta: 0, identity: "Security Specialist" },
  ],
};

const skillTracks: SkillTrack[] = [
  {
    key: "linux", name: "Linux Fundamentals", tagline: "From the shell to systemd internals.", mastery: 72,
    nodes: [
      { id: "l1", name: "Terminal Basics",  xp: 200, status: "mastered" },
      { id: "l2", name: "File Systems",     xp: 350, status: "mastered" },
      { id: "l3", name: "Process Management", xp: 400, status: "mastered" },
      { id: "l4", name: "Networking",       xp: 500, status: "in_progress",
        children: [
          { id: "l4a", name: "iproute2 deep dive", xp: 220, status: "mastered" },
          { id: "l4b", name: "nftables & firewalls", xp: 260, status: "in_progress" },
        ]
      },
      { id: "l5", name: "Shell Scripting",  xp: 450, status: "available" },
      { id: "l6", name: "Permissions & SELinux", xp: 500, status: "locked" },
    ]
  },
  {
    key: "kubernetes", name: "Kubernetes Track", tagline: "From pods to production clusters.", mastery: 58,
    nodes: [
      { id: "k1", name: "Pods & Deployments", xp: 300, status: "mastered" },
      { id: "k2", name: "Services & Ingress", xp: 350, status: "mastered" },
      { id: "k3", name: "ConfigMaps & Secrets", xp: 300, status: "mastered" },
      { id: "k4", name: "Networking Deep Dive", xp: 500, status: "in_progress" },
      { id: "k5", name: "Stateful Workloads", xp: 600, status: "available" },
      { id: "k6", name: "Cluster Administration", xp: 800, status: "locked" },
      { id: "k7", name: "Production HA", xp: 1200, status: "locked" },
    ]
  },
  {
    key: "devops", name: "DevOps Track", tagline: "Pipelines, observability, and platform thinking.", mastery: 49,
    nodes: [
      { id: "d1", name: "Git & GitHub Workflows", xp: 250, status: "mastered" },
      { id: "d2", name: "CI Pipelines",           xp: 400, status: "mastered" },
      { id: "d3", name: "Containerization",       xp: 400, status: "in_progress" },
      { id: "d4", name: "Infrastructure as Code", xp: 600, status: "available" },
      { id: "d5", name: "Observability Stack",    xp: 700, status: "locked" },
      { id: "d6", name: "Platform Engineering",   xp: 1000, status: "locked" },
    ]
  },
  {
    key: "security", name: "Security Track", tagline: "Defend, detect, and respond.", mastery: 28,
    nodes: [
      { id: "s1", name: "System Hardening",     xp: 300, status: "mastered" },
      { id: "s2", name: "Network Security",     xp: 400, status: "in_progress" },
      { id: "s3", name: "Identity & Access",    xp: 400, status: "available" },
      { id: "s4", name: "Threat Detection",     xp: 600, status: "locked" },
      { id: "s5", name: "Incident Response",    xp: 800, status: "locked" },
    ]
  },
];

// ---------- Store ----------
interface GamificationState {
  profile: {
    name: string;
    handle: string;
    identity: string;     // e.g. "DevOps Engineer"
    level: number;
    totalXp: number;
    nextLevelXp: number;
    percentile: number;
    specialization: SkillKey;
    topSkills: SkillKey[];
    totalLabHours: number;
    completedTracks: number;
    certifications: number;
    joinedAt: string;
  };
  skills: Skill[];
  streak: { current: number; longest: number; weeklyDays: boolean[]; lastActive: string };
  momentum: { value: number; multiplier: number; trend: "up" | "down" | "flat"; decayInHours: number };
  achievements: Achievement[];
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  challenges: Challenge[];
  xpFeed: XPEvent[];
  leaderboard: typeof leaderboard;
  skillTracks: SkillTrack[];
}

export const useGamificationStore = create<GamificationState>(() => ({
  profile: {
    name: "Sarah Johnson",
    handle: "@sarah",
    identity: "DevOps Engineer",
    level: overallLevel,
    totalXp,
    nextLevelXp: nextLevelTotal,
    percentile: 92,
    specialization: "kubernetes",
    topSkills: ["linux", "kubernetes", "cloud"],
    totalLabHours: 78,
    completedTracks: 3,
    certifications: 2,
    joinedAt: "2026-01-08",
  },
  skills,
  streak: { current: 14, longest: 28, weeklyDays: [true, true, true, true, true, true, false], lastActive: "2026-05-26T09:14:00Z" },
  momentum: { value: 72, multiplier: 1.4, trend: "up", decayInHours: 36 },
  achievements,
  dailyMissions,
  weeklyMissions,
  challenges,
  xpFeed,
  leaderboard,
  skillTracks,
}));

export const skillColor: Record<SkillKey, string> = {
  cloud: "hsl(210 90% 56%)",
  linux: "hsl(28 90% 55%)",
  kubernetes: "hsl(220 85% 60%)",
  security: "hsl(0 75% 58%)",
  networking: "hsl(160 70% 45%)",
  devops: "hsl(265 70% 60%)",
  ai: "hsl(290 70% 60%)",
  python: "hsl(48 90% 55%)",
  infra: "hsl(190 70% 50%)",
};

export const tierStyle: Record<Achievement["tier"], string> = {
  bronze: "text-amber-700 bg-amber-500/10 border-amber-600/20",
  silver: "text-slate-500 bg-slate-400/10 border-slate-400/20",
  gold: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
  platinum: "text-primary bg-primary/10 border-primary/20",
};

export const difficultyStyle: Record<Challenge["difficulty"], string> = {
  Beginner: "text-success bg-success/10 border-success/20",
  Intermediate: "text-primary bg-primary/10 border-primary/20",
  Advanced: "text-warning bg-warning/10 border-warning/20",
  Expert: "text-destructive bg-destructive/10 border-destructive/20",
};
