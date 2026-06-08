// Centralized mock data for the Student portal. Keeps list & detail pages in sync.

export type DeliveryMode = "live" | "self-paced" | "hybrid";

export type StudentLessonType =
  | "video"
  | "reading"
  | "lab"
  | "lab-instruction"
  | "live-session"
  | "quiz"
  | "assignment"
  | "code-exercise"
  | "ctf-scenario"
  | "exam"
  | "mock-exam"
  | "survey"
  | "game-based-learning"
  | "reasoning";

export type LabAllocationType = "persistent" | "module-unlock" | "time-limited" | "hour-pool";

export interface StudentLabAllocation {
  type: LabAllocationType;
  hours?: number;
  sessionDurationHrs?: number;
  untilCourseEnd?: boolean;
  unlockAfterLabel?: string;
}

export interface StudentLabInstruction {
  objective?: string;
  prerequisites?: string[];
  tasks?: { id: string; title: string; detail?: string }[];
  expectedOutcome?: string;
  resources?: { label: string; url?: string }[];
}

export interface StudentLesson {
  id: string;
  title: string;
  type: StudentLessonType;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
  body?: string;
  labMode?: "on-demand" | "persistent";
  labTemplate?: string;
  labAllocation?: StudentLabAllocation;
  labInstruction?: StudentLabInstruction;
  estimatedHours?: number;
  language?: string;
  proctored?: boolean;
  reasoningPrompt?: string;
  reasoningModelAnswer?: string;
  reasoningRubric?: string[];
  reasoningType?: "explain-choice" | "compare-options" | "improve-solution" | "root-cause" | "scenario-response";
}

export interface StudentChapter {
  id: string;
  title: string;
  lessons: StudentLesson[];
}

export interface StudentCoursePersistentLab {
  labId: string;
  templateName: string;
  totalHours: number;
  usedHours: number;
  ip?: string;
  status?: "running" | "stopped";
}

export interface StudentCourse {
  id: string;
  name: string;
  category: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar?: string;
  modules: number;
  completed: number;
  totalHours: number;
  status: "in_progress" | "completed" | "not_started";
  deliveryMode: DeliveryMode;
  rating: number;
  studyTime: string;
  lastAccessed: string;
  batch: string;
  batchId: string;
  prerequisites: string[];
  chapters: StudentChapter[];
  resources: { id: string; name: string; type: "pdf" | "slides" | "link" | "zip"; size?: string; url: string }[];
  nextLessonId?: string;
  // self-paced
  totalAccessHours?: number;
  usedAccessHours?: number;
  persistentLab?: StudentCoursePersistentLab;
  // live
  nextLiveSession?: { title: string; date: string; time: string };
  studyData: { day: string; hours: number }[];
}

export const studentCourses: StudentCourse[] = [
  {
    id: "1",
    name: "AWS Cloud Practitioner",
    category: "Cloud",
    description: "Master the fundamentals of Amazon Web Services. Covers EC2, S3, VPC, IAM and more. Preps you for the AWS Cloud Practitioner certification.",
    instructor: "James Wilson",
    instructorBio: "15+ years cloud architecture. AWS Solutions Architect Professional.",
    modules: 12,
    completed: 8,
    totalHours: 24,
    status: "in_progress",
    deliveryMode: "live",
    rating: 4.8,
    studyTime: "8h 20m",
    lastAccessed: "2h ago",
    batch: "AWS Batch 12",
    batchId: "1",
    prerequisites: [],
    nextLessonId: "l-1-9",
    nextLiveSession: { title: "VPC Deep Dive", date: "Today", time: "2:00 PM" },
    studyData: [
      { day: "Mon", hours: 1.5 }, { day: "Tue", hours: 2 }, { day: "Wed", hours: 0.5 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 1.5 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 0.8 },
    ],
    chapters: [
      {
        id: "ch-1-1", title: "Foundations",
        lessons: [
          { id: "l-1-1", title: "Introduction to AWS", type: "video", duration: "45m", completed: true, locked: false, body: "Overview of AWS global infrastructure, regions, AZs and core services." },
          { id: "l-1-2", title: "IAM & Security", type: "video", duration: "1h 15m", completed: true, locked: false },
          { id: "l-1-3", title: "Shared Responsibility Model", type: "reading", duration: "20m", completed: true, locked: false, body: "AWS secures the cloud; you secure what's in the cloud..." },
        ],
      },
      {
        id: "ch-1-2", title: "Compute & Storage",
        lessons: [
          { id: "l-1-4", title: "EC2 Fundamentals", type: "video", duration: "2h", completed: true, locked: false },
          { id: "l-1-5", title: "EC2 Hands-on Lab", type: "lab", duration: "1h", completed: true, locked: false },
          { id: "l-1-6", title: "S3 & Storage", type: "video", duration: "1h 30m", completed: true, locked: false },
          { id: "l-1-7", title: "S3 Quiz", type: "quiz", duration: "20m", completed: true, locked: false },
        ],
      },
      {
        id: "ch-1-3", title: "Networking",
        lessons: [
          { id: "l-1-8", title: "Networking Basics", type: "reading", duration: "30m", completed: true, locked: false },
          { id: "l-1-9", title: "VPC Deep Dive", type: "video", duration: "1h 30m", completed: false, locked: false },
          {
            id: "l-1-9b", title: "Lab Instructions: Build a VPC", type: "lab-instruction", duration: "10m",
            completed: false, locked: false,
            labInstruction: {
              objective: "Provision a VPC with public + private subnets and verify connectivity end-to-end.",
              prerequisites: ["Completed 'VPC Deep Dive' video", "Lab VM is running"],
              tasks: [
                { id: "t1", title: "Create a VPC with CIDR 10.0.0.0/16" },
                { id: "t2", title: "Create one public and one private subnet" },
                { id: "t3", title: "Attach an Internet Gateway and configure route tables" },
                { id: "t4", title: "Launch a test EC2 in each subnet and verify reachability" },
              ],
              expectedOutcome: "You can SSH into the public EC2 and ping the private EC2 from within it.",
              resources: [
                { label: "AWS VPC official docs", url: "https://docs.aws.amazon.com/vpc/" },
                { label: "VPC cheat sheet (PDF)", url: "#" },
              ],
            },
          },
          {
            id: "l-1-10", title: "VPC Lab", type: "lab", duration: "1h 30m", completed: false, locked: false,
            labTemplate: "AWS Networking Sandbox", labMode: "on-demand", estimatedHours: 2,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 },
          },
          { id: "l-1-11", title: "Route 53 & CDN", type: "video", duration: "1h", completed: false, locked: true },
          { id: "l-1-12", title: "Final Assessment", type: "quiz", duration: "45m", completed: false, locked: true },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "AWS Cheatsheet.pdf", type: "pdf", size: "2.1 MB", url: "#" },
      { id: "r2", name: "VPC Slides.pdf", type: "slides", size: "4.7 MB", url: "#" },
      { id: "r3", name: "AWS Free Tier", type: "link", url: "https://aws.amazon.com/free" },
      { id: "r4", name: "Lab Starter Kit.zip", type: "zip", size: "12 MB", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Kubernetes Fundamentals",
    category: "DevOps",
    description: "Deep dive into Kubernetes — pods, services, deployments, Helm. Hands-on cluster management.",
    instructor: "Sarah Chen",
    instructorBio: "CNCF Ambassador. 10 years container orchestration.",
    modules: 8, completed: 2, totalHours: 16, status: "in_progress",
    deliveryMode: "live", rating: 4.6, studyTime: "3h 10m", lastAccessed: "1d ago",
    batch: "K8s Batch 5", batchId: "2", prerequisites: ["Docker Essentials"],
    nextLessonId: "l-2-3",
    nextLiveSession: { title: "Pods & Deployments", date: "Tomorrow", time: "10:00 AM" },
    studyData: [
      { day: "Mon", hours: 0.5 }, { day: "Tue", hours: 1 }, { day: "Wed", hours: 0 },
      { day: "Thu", hours: 0.5 }, { day: "Fri", hours: 0.5 }, { day: "Sat", hours: 0.5 }, { day: "Sun", hours: 0.2 },
    ],
    chapters: [
      {
        id: "ch-2-1", title: "Foundations",
        lessons: [
          { id: "l-2-1", title: "Intro to Container Orchestration", type: "video", duration: "30m", completed: true, locked: false },
          { id: "l-2-2", title: "K8s Architecture", type: "video", duration: "1h", completed: true, locked: false },
        ],
      },
      {
        id: "ch-2-2", title: "Workloads",
        lessons: [
          { id: "l-2-3", title: "Pods & Deployments", type: "video", duration: "1h 30m", completed: false, locked: false },
          { id: "l-2-4", title: "K8s Lab: First Cluster", type: "lab", duration: "2h", completed: false, locked: false },
          { id: "l-2-5", title: "Services & Networking", type: "video", duration: "1h 15m", completed: false, locked: true },
          { id: "l-2-6", title: "ConfigMaps & Secrets", type: "reading", duration: "30m", completed: false, locked: true },
          { id: "l-2-7", title: "Helm Charts", type: "video", duration: "1h", completed: false, locked: true },
          { id: "l-2-8", title: "K8s Final Quiz", type: "quiz", duration: "30m", completed: false, locked: true },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "K8s Cheatsheet.pdf", type: "pdf", size: "1.4 MB", url: "#" },
      { id: "r2", name: "kubectl Reference", type: "link", url: "https://kubernetes.io/docs/reference/kubectl/" },
    ],
  },
  {
    id: "3",
    name: "Docker Essentials",
    category: "DevOps",
    description: "Everything about Docker — building images to multi-container apps with Compose.",
    instructor: "Mark Davis", instructorBio: "DevOps engineer at scale.",
    modules: 6, completed: 6, totalHours: 10, status: "completed",
    deliveryMode: "live", rating: 4.9, studyTime: "11h 45m", lastAccessed: "1w ago",
    batch: "Docker Batch 8", batchId: "3", prerequisites: [],
    studyData: [],
    chapters: [
      {
        id: "ch-3-1", title: "Docker Core",
        lessons: [
          { id: "l-3-1", title: "What is Docker?", type: "video", duration: "30m", completed: true, locked: false },
          { id: "l-3-2", title: "Images & Containers", type: "video", duration: "1h", completed: true, locked: false },
          { id: "l-3-3", title: "Dockerfile & Build", type: "lab", duration: "1h 30m", completed: true, locked: false },
          { id: "l-3-4", title: "Docker Compose", type: "video", duration: "1h", completed: true, locked: false },
          { id: "l-3-5", title: "Networking & Volumes", type: "reading", duration: "45m", completed: true, locked: false },
          { id: "l-3-6", title: "Docker Final Quiz", type: "quiz", duration: "30m", completed: true, locked: false },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Docker Cheatsheet.pdf", type: "pdf", size: "900 KB", url: "#" },
    ],
  },
  {
    id: "4",
    name: "Python for Data Science",
    category: "Data Science",
    description: "Self-paced Python journey from basics to pandas, numpy, and ML foundations. Hands-on labs available 24/7.",
    instructor: "Mentor: Sarah Wilson",
    instructorBio: "Data scientist. Mentors learners async via comments & weekly office hours.",
    modules: 14, completed: 4, totalHours: 38, status: "in_progress",
    deliveryMode: "self-paced", rating: 4.7, studyTime: "6h 40m", lastAccessed: "3h ago",
    batch: "Python Self-Paced", batchId: "7", prerequisites: [],
    nextLessonId: "l-4-5",
    totalAccessHours: 120, usedAccessHours: 38,
    persistentLab: {
      labId: "lab-4",
      templateName: "Python DS Sandbox",
      totalHours: 20,
      usedHours: 6.5,
      ip: "10.0.3.21",
      status: "running",
    },
    studyData: [
      { day: "Mon", hours: 1 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 0.5 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 0.5 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 1.2 },
    ],
    chapters: [
      {
        id: "ch-4-1", title: "Python Basics",
        lessons: [
          { id: "l-4-1", title: "Setting up your environment", type: "video", duration: "20m", completed: true, locked: false },
          { id: "l-4-2", title: "Variables & Types", type: "video", duration: "40m", completed: true, locked: false },
          { id: "l-4-3", title: "Control Flow", type: "video", duration: "50m", completed: true, locked: false },
          { id: "l-4-4", title: "Functions Lab", type: "lab", duration: "1h", completed: true, locked: false },
        ],
      },
      {
        id: "ch-4-2", title: "Data Wrangling",
        lessons: [
          { id: "l-4-5", title: "Intro to NumPy", type: "video", duration: "1h", completed: false, locked: false },
          { id: "l-4-6", title: "Pandas Fundamentals", type: "video", duration: "1h 30m", completed: false, locked: false },
          { id: "l-4-7", title: "DataFrame Lab", type: "lab", duration: "1h 30m", completed: false, locked: false },
          { id: "l-4-8", title: "Cleaning Real Data", type: "assignment", duration: "2h", completed: false, locked: false },
        ],
      },
      {
        id: "ch-4-3", title: "Visualisation & ML",
        lessons: [
          { id: "l-4-9", title: "Matplotlib & Seaborn", type: "video", duration: "1h", completed: false, locked: false },
          { id: "l-4-10", title: "Intro to Scikit-Learn", type: "video", duration: "1h 20m", completed: false, locked: false },
          { id: "l-4-11", title: "Regression Lab", type: "lab", duration: "2h", completed: false, locked: false },
          { id: "l-4-12", title: "Classification Lab", type: "lab", duration: "2h", completed: false, locked: false },
          { id: "l-4-13", title: "Capstone Project", type: "assignment", duration: "5h", completed: false, locked: false },
          { id: "l-4-14", title: "Final Assessment", type: "quiz", duration: "45m", completed: false, locked: false },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Python Cheatsheet.pdf", type: "pdf", size: "1.8 MB", url: "#" },
      { id: "r2", name: "Pandas Reference.pdf", type: "pdf", size: "3.2 MB", url: "#" },
      { id: "r3", name: "Sample Datasets.zip", type: "zip", size: "24 MB", url: "#" },
    ],
  },
  {
    id: "5",
    name: "Linux Server Hardening",
    category: "Security",
    description: "Self-paced hands-on hardening of Linux servers — SSH, firewalls, SELinux, auditing.",
    instructor: "Mentor: Priya Nair",
    instructorBio: "Security engineer. Async Q&A within 24 hours.",
    modules: 9, completed: 0, totalHours: 22, status: "not_started",
    deliveryMode: "self-paced", rating: 4.5, studyTime: "0h", lastAccessed: "—",
    batch: "Linux Self-Paced", batchId: "8", prerequisites: [],
    totalAccessHours: 80, usedAccessHours: 0,
    persistentLab: {
      labId: "lab-5",
      templateName: "Linux Hardening Sandbox",
      totalHours: 20,
      usedHours: 0,
      status: "stopped",
    },
    studyData: [],
    chapters: [
      {
        id: "ch-5-1", title: "Baseline Hardening",
        lessons: [
          { id: "l-5-1", title: "Threat model & goals", type: "reading", duration: "20m", completed: false, locked: false },
          { id: "l-5-2", title: "User accounts & sudo", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-5-3", title: "SSH hardening lab", type: "lab", duration: "1h", completed: false, locked: false },
        ],
      },
      {
        id: "ch-5-2", title: "Network & Firewalls",
        lessons: [
          { id: "l-5-4", title: "iptables & nftables", type: "video", duration: "1h", completed: false, locked: false },
          { id: "l-5-5", title: "UFW Lab", type: "lab", duration: "1h", completed: false, locked: false },
          { id: "l-5-6", title: "fail2ban", type: "video", duration: "30m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-5-3", title: "Auditing",
        lessons: [
          { id: "l-5-7", title: "auditd & logging", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-5-8", title: "Lynis scan lab", type: "lab", duration: "1h", completed: false, locked: false },
          { id: "l-5-9", title: "Final Assessment", type: "quiz", duration: "30m", completed: false, locked: false },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "CIS Benchmark Summary.pdf", type: "pdf", size: "2.6 MB", url: "#" },
    ],
  },
  {
    id: "6",
    name: "GenAI Prompt Engineering",
    category: "AI",
    description: "Hybrid course — weekly live sessions + self-paced labs. Learn to design prompts that ship.",
    instructor: "Dr. Anjali Rao",
    instructorBio: "AI researcher. Hosts weekly live workshops with async labs in between.",
    modules: 8, completed: 1, totalHours: 18, status: "in_progress",
    deliveryMode: "hybrid", rating: 4.8, studyTime: "1h 15m", lastAccessed: "5h ago",
    batch: "GenAI Hybrid Cohort", batchId: "9", prerequisites: [],
    nextLessonId: "l-6-2",
    nextLiveSession: { title: "Live: Prompt Patterns Workshop", date: "Wed, Mar 5", time: "6:00 PM" },
    totalAccessHours: 40, usedAccessHours: 2,
    studyData: [
      { day: "Mon", hours: 0 }, { day: "Tue", hours: 0.5 }, { day: "Wed", hours: 0 },
      { day: "Thu", hours: 0.5 }, { day: "Fri", hours: 0 }, { day: "Sat", hours: 0.25 }, { day: "Sun", hours: 0 },
    ],
    chapters: [
      {
        id: "ch-6-1", title: "Foundations",
        lessons: [
          { id: "l-6-1", title: "What is prompt engineering?", type: "video", duration: "30m", completed: true, locked: false },
          { id: "l-6-2", title: "Prompt anatomy", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-6-3", title: "Hands-on: First prompts", type: "lab", duration: "1h", completed: false, locked: false },
        ],
      },
      {
        id: "ch-6-2", title: "Patterns",
        lessons: [
          { id: "l-6-4", title: "Few-shot, CoT, ReAct", type: "video", duration: "1h", completed: false, locked: false },
          { id: "l-6-5", title: "Pattern Lab", type: "lab", duration: "1h 30m", completed: false, locked: false },
          { id: "l-6-6", title: "Evaluation basics", type: "reading", duration: "30m", completed: false, locked: false },
          { id: "l-6-7", title: "Build a small agent", type: "assignment", duration: "3h", completed: false, locked: false },
          { id: "l-6-8", title: "Final Assessment", type: "quiz", duration: "40m", completed: false, locked: false },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Prompt Patterns.pdf", type: "pdf", size: "1.1 MB", url: "#" },
      { id: "r2", name: "OpenAI Cookbook", type: "link", url: "https://cookbook.openai.com" },
    ],
  },
  // ───────── DEMO: Java Fundamentals (VILT — 15 students) ─────────
  {
    id: "10",
    name: "Java Fundamentals",
    category: "Programming",
    description:
      "Instructor-led Java fundamentals bootcamp covering syntax, OOP, collections, exception handling, file IO, multithreading and JDBC. Daily live classes with hands-on labs on a shared cluster.",
    instructor: "Rahul Verma",
    instructorBio:
      "Java champion with 12+ years of enterprise Java experience. Oracle Certified Professional, ex-tech lead at a Fortune 500 bank.",
    modules: 10, completed: 3, totalHours: 40, status: "in_progress",
    deliveryMode: "live", rating: 4.9, studyTime: "9h 30m", lastAccessed: "1h ago",
    batch: "Java Fundamentals — Cohort 24", batchId: "10", prerequisites: [],
    nextLessonId: "l-10-7",
    nextLiveSession: { title: "OOP: Classes & Objects (Live)", date: "Today", time: "11:00 AM" },
    studyData: [
      { day: "Mon", hours: 2 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 2 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 1.5 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 0.5 },
    ],
    chapters: [
      {
        id: "ch-10-1", title: "Getting Started",
        lessons: [
          { id: "l-10-1", title: "Welcome & course roadmap", type: "video", duration: "12m", completed: true, locked: false,
            body: "An overview of what you will learn over the next 4 weeks — from your first 'Hello World' to building a JDBC-backed CLI app." },
          { id: "l-10-2", title: "Reading: Why Java still matters in 2026", type: "reading", duration: "15m", completed: true, locked: false,
            body: "Java remains the backbone of enterprise systems — banks, telecoms, Android, Big Data (Kafka, Spark, Hadoop) all run on the JVM. This chapter walks through where Java fits today, its ecosystem, and why JVM languages still dominate large-scale production." },
          { id: "l-10-3", title: "Installing JDK 21 & IntelliJ IDEA", type: "video", duration: "20m", completed: true, locked: false },
          { id: "l-10-4", title: "Lab: Your first Java program", type: "lab", duration: "45m", completed: false, locked: false,
            labTemplate: "Java Dev Sandbox (JDK 21 + Maven)", labMode: "on-demand", estimatedHours: 1,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 } },
          { id: "l-10-5", title: "Quiz: Setup & basics", type: "quiz", duration: "10m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-10-2", title: "Syntax, Variables & Control Flow",
        lessons: [
          { id: "l-10-6", title: "Primitive types, operators, casting", type: "video", duration: "35m", completed: false, locked: false },
          { id: "l-10-7", title: "Live class: Control flow deep-dive", type: "live-session", duration: "1h 30m", completed: false, locked: false },
          { id: "l-10-8", title: "Insight: Where do you struggle most?", type: "survey", duration: "5m", completed: false, locked: false,
            body: "Trainer-pushed insight question to gauge cohort confidence before moving to OOP." },
          { id: "l-10-9", title: "Lab: FizzBuzz & loops practice", type: "code-exercise", duration: "30m", completed: false, locked: false, language: "java" },
          { id: "l-10-9b", title: "AI Reasoning: for loop vs while loop", type: "reasoning", duration: "8m", completed: false, locked: false,
            reasoningType: "explain-choice",
            reasoningPrompt: "You need to process records until a user enters EXIT. Would you use a for loop or a while loop? Explain your reasoning.",
            reasoningModelAnswer: "A while loop is preferred because the number of iterations is not known in advance — execution continues until a sentinel value (EXIT) is encountered. A for loop fits known/iterable ranges. Mention readability, exit-condition placement, and the risk of an infinite loop if the sentinel check is wrong.",
            reasoningRubric: ["unknown iteration count", "sentinel / exit condition", "compare for vs while", "infinite loop risk", "maintainability"],
          },
          { id: "l-10-10", title: "Quiz: Control flow", type: "quiz", duration: "15m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-10-3", title: "Object-Oriented Programming",
        lessons: [
          { id: "l-10-11", title: "Classes, objects, constructors", type: "video", duration: "40m", completed: false, locked: false },
          { id: "l-10-12", title: "Inheritance & polymorphism", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-10-13", title: "Reading: SOLID principles in plain English", type: "reading", duration: "20m", completed: false, locked: false,
            body: "A practical walkthrough of Single Responsibility, Open/Closed, Liskov, Interface Segregation and Dependency Inversion — using a banking domain example." },
          { id: "l-10-14", title: "Game: OOP Concept Quest", type: "game-based-learning", duration: "30m", completed: false, locked: false,
            body: "A scenario-based escape room where you debug a misbehaving zoo simulation by applying the right OOP concept at each room." },
          { id: "l-10-14b", title: "AI Reasoning: Why is String immutable in Java?", type: "reasoning", duration: "10m", completed: false, locked: false,
            reasoningType: "root-cause",
            reasoningPrompt: "Explain why the String class is immutable in Java. What problems would arise if String were mutable, and how does immutability help with security, the String pool and multithreading?",
            reasoningModelAnswer: "Strings are immutable so they can be safely shared via the String pool (deduplication), so security-sensitive values (class names, file paths, DB URLs) cannot be changed after a security check (TOCTOU), so they are inherently thread-safe (no synchronization needed), and so their hashCode can be cached — making them excellent keys in HashMap. If String were mutable, pool sharing would corrupt unrelated references and any 'check then use' security pattern would break.",
            reasoningRubric: ["string pool / interning", "security / class loading", "thread safety", "cached hashcode / HashMap keys", "trade-off vs StringBuilder"],
          },
          { id: "l-10-15", title: "Assignment: Build a Library Management System", type: "assignment", duration: "3h", completed: false, locked: false,
            body: "Design a small library system with Book, Member and Loan classes. Submit GitHub repo + screen recording." },
        ],
      },
      {
        id: "ch-10-4", title: "Collections & Generics",
        lessons: [
          { id: "l-10-16", title: "List, Set, Map — when to use what", type: "video", duration: "50m", completed: false, locked: false },
          { id: "l-10-17", title: "Generics & wildcards", type: "video", duration: "35m", completed: false, locked: false },
          { id: "l-10-18", title: "Lab: Refactor with collections", type: "lab", duration: "1h 30m", completed: false, locked: false,
            labTemplate: "Java Dev Sandbox (JDK 21 + Maven)", labMode: "on-demand", estimatedHours: 2,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 } },
          { id: "l-10-19", title: "Quiz: Collections framework", type: "quiz", duration: "20m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-10-5", title: "Exceptions, IO & Multithreading",
        lessons: [
          { id: "l-10-20", title: "Checked vs unchecked exceptions", type: "video", duration: "30m", completed: false, locked: false },
          { id: "l-10-21", title: "File IO with java.nio", type: "video", duration: "40m", completed: false, locked: false },
          { id: "l-10-22", title: "Multithreading & ExecutorService", type: "video", duration: "1h", completed: false, locked: false },
          { id: "l-10-23", title: "Game: Concurrency Café", type: "game-based-learning", duration: "25m", completed: false, locked: false,
            body: "Run a virtual café — assign threads to baristas without deadlocking the espresso machine." },
          { id: "l-10-24", title: "Lab: Concurrent file processor", type: "lab", duration: "2h", completed: false, locked: false,
            labTemplate: "Java Dev Sandbox (JDK 21 + Maven)", labMode: "on-demand", estimatedHours: 2,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 } },
        ],
      },
      {
        id: "ch-10-6", title: "JDBC & Capstone",
        lessons: [
          { id: "l-10-25", title: "JDBC basics & PreparedStatement", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-10-26", title: "Capstone: CLI Expense Tracker", type: "assignment", duration: "6h", completed: false, locked: false,
            body: "Build a CLI expense tracker backed by PostgreSQL using JDBC. Submission: GitHub repo + 5-min demo video." },
          { id: "l-10-27", title: "Final exam (proctored)", type: "exam", duration: "1h 30m", completed: false, locked: false, proctored: true },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Java Cheatsheet.pdf", type: "pdf", size: "1.6 MB", url: "#" },
      { id: "r2", name: "OOP Patterns Slides.pdf", type: "slides", size: "3.4 MB", url: "#" },
      { id: "r3", name: "Oracle Java Docs", type: "link", url: "https://docs.oracle.com/en/java/" },
      { id: "r4", name: "Starter Project.zip", type: "zip", size: "8 MB", url: "#" },
    ],
  },
  // ───────── DEMO: Python Fundamentals (Self-Paced — 50 students) ─────────
  {
    id: "11",
    name: "Python Fundamentals",
    category: "Programming",
    description:
      "Self-paced Python fundamentals — from syntax to OOP, file handling, and a final mini-project. Launch your own Python lab anytime from a pre-baked trainer template.",
    instructor: "Mentor: Neha Kapoor",
    instructorBio:
      "Senior Python engineer, ex-Razorpay. Mentors learners async with weekly office hours every Saturday.",
    modules: 10, completed: 2, totalHours: 32, status: "in_progress",
    deliveryMode: "self-paced", rating: 4.8, studyTime: "4h 15m", lastAccessed: "5h ago",
    batch: "Python Fundamentals — Self-Paced", batchId: "11", prerequisites: [],
    nextLessonId: "l-11-5",
    totalAccessHours: 60, usedAccessHours: 12,
    persistentLab: {
      labId: "lab-11",
      templateName: "Python 3.12 Workstation",
      totalHours: 30,
      usedHours: 4.5,
      ip: "10.0.11.42",
      status: "running",
    },
    studyData: [
      { day: "Mon", hours: 0.5 }, { day: "Tue", hours: 1 }, { day: "Wed", hours: 0.75 },
      { day: "Thu", hours: 0.5 }, { day: "Fri", hours: 0.5 }, { day: "Sat", hours: 0.5 }, { day: "Sun", hours: 0.5 },
    ],
    chapters: [
      {
        id: "ch-11-1", title: "Setup & First Steps",
        lessons: [
          { id: "l-11-1", title: "Welcome to Python", type: "video", duration: "10m", completed: true, locked: false,
            body: "Python is the world's most popular language for scripting, data science, ML and automation. This course takes you from zero to confidently writing Python programs." },
          { id: "l-11-2", title: "Reading: Why Python?", type: "reading", duration: "12m", completed: true, locked: false,
            body: "Python's readability, batteries-included stdlib and massive ecosystem make it the default language for prototyping. We compare it with JavaScript, Java and Go." },
          { id: "l-11-3", title: "Launch your Python lab", type: "lab-instruction", duration: "5m", completed: false, locked: false,
            labInstruction: {
              objective: "Open the always-on Python 3.12 Workstation and verify your environment.",
              prerequisites: ["Click 'Launch Lab' in the persistent lab card"],
              tasks: [
                { id: "t1", title: "Open the web terminal" },
                { id: "t2", title: "Run `python --version` (expect 3.12.x)" },
                { id: "t3", title: "Run `jupyter lab --port 8888 --no-browser`" },
              ],
              expectedOutcome: "Jupyter Lab opens on port 8888 and you can create a new notebook.",
              resources: [{ label: "Python 3.12 release notes", url: "https://docs.python.org/3.12/whatsnew/3.12.html" }],
            },
          },
          { id: "l-11-4", title: "Quiz: Setup check", type: "quiz", duration: "8m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-11-2", title: "Syntax & Data Types",
        lessons: [
          { id: "l-11-5", title: "Variables, numbers, strings", type: "video", duration: "30m", completed: false, locked: false },
          { id: "l-11-6", title: "Lists, tuples, sets, dicts", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-11-7", title: "Code exercise: String manipulation", type: "code-exercise", duration: "30m", completed: false, locked: false,
            language: "python" },
          { id: "l-11-8", title: "Insight: What confuses you most?", type: "survey", duration: "3m", completed: false, locked: false,
            body: "Async insight question — your mentor reviews responses weekly." },
        ],
      },
      {
        id: "ch-11-3", title: "Control Flow & Functions",
        lessons: [
          { id: "l-11-9", title: "if / elif / else, loops", type: "video", duration: "35m", completed: false, locked: false },
          { id: "l-11-10", title: "Functions, args, *args, **kwargs", type: "video", duration: "40m", completed: false, locked: false },
          { id: "l-11-10b", title: "AI Reasoning: List comprehension vs for loop", type: "reasoning", duration: "8m", completed: false, locked: false,
            reasoningType: "compare-options",
            reasoningPrompt: "You need to build a new list of squared values from an existing list of 10,000 numbers. Would you use a list comprehension or a traditional for loop with `.append()`? Compare the two approaches on readability, performance and when each is the better choice.",
            reasoningModelAnswer: "A list comprehension is preferred here — it is more readable for a single-expression transformation, runs faster in CPython because the loop happens in C (no repeated `.append()` attribute lookups), and signals intent (build a new list). A for-loop is better when the body has side effects, multiple statements, or needs early termination — comprehensions optimize for expression, not control flow.",
            reasoningRubric: ["readability / intent", "performance (C-level loop, fewer attribute lookups)", "when for loop is better (side effects, complex body)", "memory (generator vs list)", "pythonic idiom"],
          },
          { id: "l-11-11", title: "Reading: Pythonic style (PEP 8 essentials)", type: "reading", duration: "15m", completed: false, locked: false,
            body: "Idiomatic Python: list comprehensions, truthiness, EAFP vs LBYL, naming conventions and the Zen of Python." },
          { id: "l-11-12", title: "Game: Python Pop Quiz Show", type: "game-based-learning", duration: "20m", completed: false, locked: false,
            body: "A Kahoot-style quiz show with 25 rapid-fire questions. Earn XP for streaks." },
          { id: "l-11-13", title: "Assignment: Build a number-guessing CLI", type: "assignment", duration: "1h 30m", completed: false, locked: false,
            body: "Build an interactive number-guessing game with difficulty levels. Submit a single .py file." },
        ],
      },
      {
        id: "ch-11-4", title: "OOP in Python",
        lessons: [
          { id: "l-11-14", title: "Classes, __init__, self", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-11-15", title: "Inheritance & dunder methods", type: "video", duration: "40m", completed: false, locked: false },
          { id: "l-11-16", title: "Code exercise: Build a `BankAccount` class", type: "code-exercise", duration: "45m", completed: false, locked: false, language: "python" },
          { id: "l-11-17", title: "Quiz: OOP fundamentals", type: "quiz", duration: "15m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-11-5", title: "Files, Errors & Modules",
        lessons: [
          { id: "l-11-18", title: "Reading & writing files", type: "video", duration: "30m", completed: false, locked: false },
          { id: "l-11-19", title: "try / except / finally", type: "video", duration: "25m", completed: false, locked: false },
          { id: "l-11-19b", title: "AI Reasoning: try/except vs if-check (EAFP vs LBYL)", type: "reasoning", duration: "10m", completed: false, locked: false,
            reasoningType: "compare-options",
            reasoningPrompt: "In Python, would you use a try/except block to handle a missing dictionary key, or check with `if key in dict` first? Compare the two — when is each appropriate? (EAFP vs LBYL)",
            reasoningModelAnswer: "Python idiom favours EAFP — 'easier to ask forgiveness than permission' — so a try/except KeyError is generally cleaner and faster on the happy path because exceptions are cheap when not raised, and there is no race condition between the check and the access. LBYL (if key in dict) is preferable when the missing case is the common path (exceptions are expensive then), when the check has no race risk, or for readability when multiple conditions are pre-validated together. Bonus: `.get()` is the Pythonic middle ground for a single key.",
            reasoningRubric: ["EAFP vs LBYL terminology", "performance on happy path", "race conditions / TOCTOU", "readability", "dict.get() alternative"],
          },
          { id: "l-11-20", title: "Working with modules & venv", type: "video", duration: "30m", completed: false, locked: false },
          { id: "l-11-21", title: "Game: Debug Detective", type: "game-based-learning", duration: "30m", completed: false, locked: false,
            body: "5 broken Python programs — find the bug, choose the fix, climb the leaderboard." },
        ],
      },
      {
        id: "ch-11-6", title: "Mini Project & Wrap-up",
        lessons: [
          { id: "l-11-22", title: "Capstone: Personal Expense Tracker (JSON-backed)", type: "assignment", duration: "4h", completed: false, locked: false,
            body: "Build a CLI expense tracker that persists to JSON, supports categories, and prints monthly summaries." },
          { id: "l-11-23", title: "Final quiz", type: "quiz", duration: "30m", completed: false, locked: false },
          { id: "l-11-24", title: "What's next: paths for data, web, automation", type: "reading", duration: "10m", completed: false, locked: false },
        ],
      },
    ],
    resources: [
      { id: "r1", name: "Python Cheatsheet.pdf", type: "pdf", size: "1.2 MB", url: "#" },
      { id: "r2", name: "PEP 8 Quick Reference.pdf", type: "pdf", size: "600 KB", url: "#" },
      { id: "r3", name: "Sample Datasets.zip", type: "zip", size: "8 MB", url: "#" },
      { id: "r4", name: "Official Python Docs", type: "link", url: "https://docs.python.org/3/" },
    ],
  },
];

export const getStudentCourse = (id: string) => studentCourses.find((c) => c.id === id);

// ───── LABS ─────
export interface StudentLab {
  id: string;
  name: string;
  template: string;
  os: "linux" | "windows";
  status: "running" | "stopped" | "completed" | "failed";
  timeRemaining: string;
  ip: string;
  cpu: number;
  ram: number;
  storage: number;
  uptime: string;
  batch: string;
  batchId: string;
  deliveryMode: DeliveryMode;
  accessKind?: "course-persistent" | "lesson-time-limited";
  courseId?: string;
  sshPort: number;
  username: string;
  password: string;
  rdpPort?: number;
  lastCommands: string[];
  totalAccessHours?: number;
  usedAccessHours?: number;
  snapshots: { id: string; name: string; createdAt: string; size: string }[];
}

export const studentLabs: StudentLab[] = [
  {
    id: "lab-1", name: "AWS VPC Lab", template: "AWS Cloud Practitioner", os: "linux", status: "running",
    timeRemaining: "1h 45m", ip: "10.0.1.42", cpu: 45, ram: 62, storage: 30, uptime: "2h 15m",
    batch: "AWS Batch 12", batchId: "1", deliveryMode: "live",
    accessKind: "lesson-time-limited", courseId: "1",
    sshPort: 22, username: "student",
    password: "Aws@2026!", lastCommands: ["$ aws ec2 describe-vpcs", "$ aws ec2 create-subnet --vpc-id vpc-0a1b", "$ aws ec2 describe-route-tables"],
    snapshots: [{ id: "s1", name: "Fresh start", createdAt: "Mar 1", size: "4.2 GB" }, { id: "s2", name: "Post Subnet", createdAt: "Mar 3", size: "5.1 GB" }],
  },
  {
    id: "lab-2", name: "K8s Cluster Lab", template: "Kubernetes Fundamentals", os: "linux", status: "running",
    timeRemaining: "2h 30m", ip: "10.0.2.18", cpu: 78, ram: 85, storage: 55, uptime: "1h 30m",
    batch: "K8s Batch 5", batchId: "2", deliveryMode: "live", sshPort: 22, username: "student",
    password: "K8s@cluster1", lastCommands: ["$ kubectl get pods -A", "$ kubectl apply -f deploy.yaml", "$ kubectl logs nginx-pod"],
    snapshots: [{ id: "s1", name: "Fresh cluster", createdAt: "Mar 2", size: "6.0 GB" }],
  },
  {
    id: "lab-3", name: "Docker Lab", template: "Docker Essentials", os: "linux", status: "stopped",
    timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 20, uptime: "-",
    batch: "Docker Batch 8", batchId: "3", deliveryMode: "live", sshPort: 22, username: "student",
    password: "Docker@2026", lastCommands: [], snapshots: [],
  },
  {
    id: "lab-4", name: "Python DS Sandbox", template: "Python for Data Science", os: "linux", status: "running",
    timeRemaining: "Always-on · 13.5h left", ip: "10.0.3.21", cpu: 30, ram: 45, storage: 25, uptime: "45m",
    batch: "Python Self-Paced", batchId: "7", deliveryMode: "self-paced",
    accessKind: "course-persistent", courseId: "4",
    sshPort: 22, username: "student",
    password: "Py@datasci1", lastCommands: ["$ jupyter lab --port 8888", "$ pip install pandas seaborn"],
    totalAccessHours: 20, usedAccessHours: 6.5,
    snapshots: [{ id: "s1", name: "Conda ready", createdAt: "Feb 20", size: "3.4 GB" }],
  },
  {
    id: "lab-5", name: "Linux Hardening Lab", template: "Linux Server Hardening", os: "linux", status: "stopped",
    timeRemaining: "Always-on · 20h left", ip: "-", cpu: 0, ram: 0, storage: 18, uptime: "-",
    batch: "Linux Self-Paced", batchId: "8", deliveryMode: "self-paced",
    accessKind: "course-persistent", courseId: "5",
    sshPort: 22, username: "root",
    password: "Lnx@hard3n", lastCommands: [],
    totalAccessHours: 20, usedAccessHours: 0,
    snapshots: [],
  },
  {
    id: "lab-6", name: "Terraform Lab", template: "Terraform Basics", os: "linux", status: "completed",
    timeRemaining: "-", ip: "-", cpu: 0, ram: 0, storage: 45, uptime: "4h 20m",
    batch: "AWS Batch 12", batchId: "1", deliveryMode: "live", sshPort: 22, username: "student",
    password: "Tf@2026", lastCommands: [], snapshots: [],
  },
  // ── DEMO labs ──
  {
    id: "lab-10", name: "Java Dev Sandbox", template: "Java Dev Sandbox (JDK 21 + Maven)", os: "linux", status: "running",
    timeRemaining: "1h 30m", ip: "10.0.10.18", cpu: 28, ram: 40, storage: 25, uptime: "35m",
    batch: "Java Fundamentals — Cohort 24", batchId: "10", deliveryMode: "live",
    accessKind: "lesson-time-limited", courseId: "10",
    sshPort: 22, username: "student", password: "Jv@cohort24",
    lastCommands: ["$ javac Main.java", "$ java Main", "$ mvn -q test"],
    snapshots: [{ id: "s1", name: "Fresh JDK 21", createdAt: "May 10", size: "3.8 GB" }],
  },
  {
    id: "lab-11", name: "Python 3.12 Workstation", template: "Python 3.12 Workstation", os: "linux", status: "running",
    timeRemaining: "Always-on · 25.5h left", ip: "10.0.11.42", cpu: 22, ram: 38, storage: 22, uptime: "1h 10m",
    batch: "Python Fundamentals — Self-Paced", batchId: "11", deliveryMode: "self-paced",
    accessKind: "course-persistent", courseId: "11",
    sshPort: 22, username: "student", password: "Py@fund2026",
    lastCommands: ["$ python --version", "$ jupyter lab --port 8888", "$ pip install requests"],
    totalAccessHours: 30, usedAccessHours: 4.5,
    snapshots: [{ id: "s1", name: "Py 3.12 + Jupyter", createdAt: "May 1", size: "3.1 GB" }],
  },
];

export const getStudentLab = (id: string) => studentLabs.find((l) => l.id === id);

// ───── SCHEDULE ─────
export interface StudentSession {
  id: string;
  title: string;
  description: string;
  batch: string;
  batchId: string;
  courseId?: string;
  date: string;     // human readable
  isoDate: string;  // ISO yyyy-mm-dd
  time: string;
  duration: string;
  type: "live" | "lab" | "self-paced" | "assessment";
  instructor: string;
  status: "upcoming" | "today" | "completed";
  agenda: string[];
  prep: string[];
  joinUrl?: string;
  labId?: string;
  resources: { id: string; name: string; url: string }[];
}

export const studentSchedule: StudentSession[] = [
  { id: "se-1", title: "AWS VPC Deep Dive", description: "Live walkthrough of VPC, subnets, NAT and routing.", batch: "AWS Batch 12", batchId: "1", courseId: "1", date: "Today", isoDate: "2026-05-18", time: "2:00 PM", duration: "2h", type: "live", instructor: "James Wilson", status: "today",
    agenda: ["Recap of networking", "VPC architecture", "Demo: build a VPC", "Q&A"], prep: ["Read networking basics chapter", "Have AWS console open"], joinUrl: "#", labId: "lab-1", resources: [{ id: "r1", name: "VPC Slides.pdf", url: "#" }] },
  { id: "se-2", title: "VPC Lab Session", description: "Apply VPC concepts in a guided lab.", batch: "AWS Batch 12", batchId: "1", courseId: "1", date: "Today", isoDate: "2026-05-18", time: "4:00 PM", duration: "1.5h", type: "lab", instructor: "James Wilson", status: "today",
    agenda: ["Lab brief", "Hands-on", "Validation"], prep: ["Lab VM warmed up"], labId: "lab-1", resources: [] },
  { id: "se-3", title: "K8s Pod Networking", description: "Live class on pod networking patterns.", batch: "K8s Batch 5", batchId: "2", courseId: "2", date: "Tomorrow", isoDate: "2026-05-19", time: "10:00 AM", duration: "1.5h", type: "live", instructor: "Sarah Chen", status: "upcoming",
    agenda: ["Pod-to-pod traffic", "Services", "CNI overview"], prep: ["Skim K8s arch reading"], joinUrl: "#", resources: [] },
  { id: "se-4", title: "K8s Lab: First Cluster", description: "Spin up your first cluster.", batch: "K8s Batch 5", batchId: "2", courseId: "2", date: "Tomorrow", isoDate: "2026-05-19", time: "11:30 AM", duration: "2h", type: "lab", instructor: "Sarah Chen", status: "upcoming",
    agenda: ["minikube setup", "Deploy nginx", "Expose service"], prep: ["Lab VM running"], labId: "lab-2", resources: [] },
  { id: "se-5", title: "Recommended: NumPy module", description: "Self-paced — keep your streak.", batch: "Python Self-Paced", batchId: "7", courseId: "4", date: "This week", isoDate: "2026-05-20", time: "Any", duration: "1h", type: "self-paced", instructor: "Mentor: Sarah Wilson", status: "upcoming",
    agenda: ["NumPy basics", "Vectorisation", "Quick exercise"], prep: [], resources: [] },
  { id: "se-6", title: "Recommended: Pandas Lab", description: "Hands-on data wrangling.", batch: "Python Self-Paced", batchId: "7", courseId: "4", date: "This week", isoDate: "2026-05-21", time: "Any", duration: "1.5h", type: "self-paced", instructor: "Mentor: Sarah Wilson", status: "upcoming",
    agenda: ["DataFrame basics", "Join & group", "Real dataset"], prep: ["Lab VM"], labId: "lab-4", resources: [] },
  { id: "se-7", title: "AWS VPC Quiz", description: "Timed assessment — 30 minutes, 20 questions.", batch: "AWS Batch 12", batchId: "1", courseId: "1", date: "Fri, May 22", isoDate: "2026-05-22", time: "3:00 PM", duration: "30m", type: "assessment", instructor: "—", status: "upcoming",
    agenda: ["20 MCQs"], prep: ["Review VPC chapter"], resources: [] },
  { id: "se-8", title: "Live Workshop: Prompt Patterns", description: "Weekly hybrid session.", batch: "GenAI Hybrid Cohort", batchId: "9", courseId: "6", date: "Wed, May 20", isoDate: "2026-05-20", time: "6:00 PM", duration: "1h 30m", type: "live", instructor: "Dr. Anjali Rao", status: "upcoming",
    agenda: ["Pattern walkthrough", "Live build"], prep: [], joinUrl: "#", resources: [] },
  { id: "se-9", title: "AWS EC2 Lab", description: "Past lab.", batch: "AWS Batch 12", batchId: "1", courseId: "1", date: "Yesterday", isoDate: "2026-05-17", time: "2:00 PM", duration: "1h", type: "lab", instructor: "James Wilson", status: "completed",
    agenda: [], prep: [], resources: [] },
];

export const getStudentSession = (id: string) => studentSchedule.find((s) => s.id === id);

// ───── ASSESSMENTS ─────
export interface StudentAssessmentQuestion {
  id: string;
  text: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}
export interface StudentAssessment {
  id: string;
  title: string;
  type: "Quiz" | "Assignment" | "Exercise";
  course: string;
  courseId: string;
  batch: string;
  dueDate: string;
  score: number | null;
  maxScore: number;
  status: "pending" | "not_started" | "completed" | "overdue";
  questions: StudentAssessmentQuestion[];
  timeLimitMin: number;
  attempts: number;
  maxAttempts: number;
  instructions: string;
  syllabus: string[];
  deliveryMode: DeliveryMode;
  // for assignment
  submission?: { type: "text" | "file"; placeholder?: string };
  // for exercise
  starterCode?: string;
  language?: string;
}

export const studentAssessments: StudentAssessment[] = [
  {
    id: "a-1", title: "AWS VPC Quiz", type: "Quiz", course: "AWS Cloud Practitioner", courseId: "1",
    batch: "AWS Batch 12", dueDate: "Today", score: null, maxScore: 100, status: "pending",
    timeLimitMin: 30, attempts: 0, maxAttempts: 2, deliveryMode: "live",
    instructions: "Answer all 5 questions within 30 minutes. You may attempt twice — the higher score counts.",
    syllabus: ["VPC components", "Subnets & routing", "NAT & IGW", "Security Groups vs NACLs"],
    questions: [
      { id: "q1", text: "Which is true about a VPC?", options: ["Spans multiple regions", "Is regional", "Is global", "Is a single AZ"], correctIndex: 1, explanation: "A VPC is scoped to a single AWS region." },
      { id: "q2", text: "What is the default route target in a public subnet's route table?", options: ["NAT Gateway", "Internet Gateway", "Local", "VPC Peering"], correctIndex: 1 },
      { id: "q3", text: "Security Groups are stateful.", options: ["True", "False"], correctIndex: 0 },
      { id: "q4", text: "Which provides outbound internet for private subnets?", options: ["IGW", "NAT GW", "VPN", "ELB"], correctIndex: 1 },
      { id: "q5", text: "NACL evaluation order is by ____", options: ["Rule number", "Alphabetical", "Random", "Insertion time"], correctIndex: 0 },
    ],
  },
  {
    id: "a-2", title: "Docker Networking Assignment", type: "Assignment", course: "Docker Essentials", courseId: "3",
    batch: "Docker Batch 8", dueDate: "Mar 1", score: null, maxScore: 50, status: "pending",
    timeLimitMin: 120, attempts: 0, maxAttempts: 1, deliveryMode: "live",
    instructions: "Submit a Docker Compose file connecting 3 services on a custom network. Include README.",
    syllabus: ["Custom networks", "Compose v3", "Service discovery"],
    questions: [], submission: { type: "file", placeholder: "Upload .zip with compose + README" },
  },
  {
    id: "a-3", title: "K8s Pod Exercise", type: "Exercise", course: "Kubernetes Fundamentals", courseId: "2",
    batch: "K8s Batch 5", dueDate: "Mar 3", score: null, maxScore: 30, status: "not_started",
    timeLimitMin: 60, attempts: 0, maxAttempts: 3, deliveryMode: "live",
    instructions: "Write a Pod manifest that runs nginx with a resource request of 100m CPU.",
    syllabus: ["Pod spec", "Resources", "kubectl apply"],
    questions: [], starterCode: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: nginx\nspec:\n  containers:\n  - name: nginx\n    image: nginx\n", language: "yaml",
  },
  {
    id: "a-4", title: "S3 & Storage Quiz", type: "Quiz", course: "AWS Cloud Practitioner", courseId: "1",
    batch: "AWS Batch 12", dueDate: "Feb 28", score: null, maxScore: 100, status: "overdue",
    timeLimitMin: 25, attempts: 0, maxAttempts: 2, deliveryMode: "live",
    instructions: "Quick 15-question quiz on S3 fundamentals.", syllabus: ["S3 classes", "Lifecycle", "Versioning"],
    questions: [
      { id: "q1", text: "Cheapest S3 class for archival is:", options: ["Standard", "IA", "Glacier Deep Archive", "One Zone-IA"], correctIndex: 2 },
      { id: "q2", text: "Versioning can be suspended.", options: ["True", "False"], correctIndex: 0 },
      { id: "q3", text: "S3 is:", options: ["Object storage", "Block storage", "File storage", "DB"], correctIndex: 0 },
    ],
  },
  {
    id: "a-5", title: "AWS IAM Quiz", type: "Quiz", course: "AWS Cloud Practitioner", courseId: "1",
    batch: "AWS Batch 12", dueDate: "Feb 20", score: 85, maxScore: 100, status: "completed",
    timeLimitMin: 25, attempts: 1, maxAttempts: 2, deliveryMode: "live",
    instructions: "IAM principals, policies, roles.", syllabus: ["Users/Groups/Roles", "Policies"],
    questions: [],
  },
  {
    id: "a-6", title: "Docker Basics Quiz", type: "Quiz", course: "Docker Essentials", courseId: "3",
    batch: "Docker Batch 8", dueDate: "Feb 15", score: 92, maxScore: 100, status: "completed",
    timeLimitMin: 20, attempts: 1, maxAttempts: 2, deliveryMode: "live",
    instructions: "10 Q quiz on Docker fundamentals.", syllabus: ["Images", "Containers", "Volumes"],
    questions: [],
  },
  {
    id: "a-7", title: "Pandas DataFrame Lab", type: "Exercise", course: "Python for Data Science", courseId: "4",
    batch: "Python Self-Paced", dueDate: "Any time", score: null, maxScore: 50, status: "not_started",
    timeLimitMin: 90, attempts: 0, maxAttempts: 5, deliveryMode: "self-paced",
    instructions: "Load the provided CSV, clean nulls, group by region, and output a summary.",
    syllabus: ["pd.read_csv", "fillna/dropna", "groupby", "agg"], questions: [],
    starterCode: "import pandas as pd\n\ndf = pd.read_csv('sales.csv')\n# TODO: clean & summarise\n", language: "python",
  },
  // ── DEMO assessments ──
  {
    id: "a-10", title: "Java OOP Quiz", type: "Quiz", course: "Java Fundamentals", courseId: "10",
    batch: "Java Fundamentals — Cohort 24", dueDate: "Fri, Jun 12", score: null, maxScore: 100, status: "pending",
    timeLimitMin: 25, attempts: 0, maxAttempts: 2, deliveryMode: "live",
    instructions: "Quick check on classes, inheritance, polymorphism and SOLID. 6 questions, 25 minutes.",
    syllabus: ["Classes & objects", "Inheritance", "Polymorphism", "SOLID basics"],
    questions: [
      { id: "q1", text: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], correctIndex: 1 },
      { id: "q2", text: "All classes in Java implicitly extend:", options: ["java.lang.Class", "java.lang.Object", "java.util.Base", "None"], correctIndex: 1 },
      { id: "q3", text: "Method overloading is determined at:", options: ["Compile time", "Runtime", "Link time", "Class load"], correctIndex: 0 },
      { id: "q4", text: "Which is NOT a SOLID principle?", options: ["Single Responsibility", "Open/Closed", "Don't Repeat Yourself", "Liskov Substitution"], correctIndex: 2 },
      { id: "q5", text: "An abstract class can have constructors.", options: ["True", "False"], correctIndex: 0 },
      { id: "q6", text: "Which access modifier is most restrictive?", options: ["public", "protected", "default", "private"], correctIndex: 3 },
    ],
  },
  {
    id: "a-11", title: "Library Management System", type: "Assignment", course: "Java Fundamentals", courseId: "10",
    batch: "Java Fundamentals — Cohort 24", dueDate: "Sun, Jun 15", score: null, maxScore: 50, status: "not_started",
    timeLimitMin: 180, attempts: 0, maxAttempts: 1, deliveryMode: "live",
    instructions: "Design a small library system with Book, Member and Loan classes. Submit a GitHub repo link and a 3-minute screen recording.",
    syllabus: ["Classes", "Composition", "Collections"],
    questions: [], submission: { type: "file", placeholder: "Upload .zip or paste GitHub link" },
  },
  {
    id: "a-12", title: "FizzBuzz in Java", type: "Exercise", course: "Java Fundamentals", courseId: "10",
    batch: "Java Fundamentals — Cohort 24", dueDate: "Any time", score: null, maxScore: 20, status: "not_started",
    timeLimitMin: 30, attempts: 0, maxAttempts: 5, deliveryMode: "live",
    instructions: "Print numbers 1-100. Multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', multiples of both print 'FizzBuzz'.",
    syllabus: ["Loops", "Conditionals", "Modulo"], questions: [],
    starterCode: "public class FizzBuzz {\n    public static void main(String[] args) {\n        // TODO\n    }\n}\n",
    language: "java",
  },
  {
    id: "a-13", title: "Python Basics Quiz", type: "Quiz", course: "Python Fundamentals", courseId: "11",
    batch: "Python Fundamentals — Self-Paced", dueDate: "Any time", score: null, maxScore: 100, status: "pending",
    timeLimitMin: 20, attempts: 0, maxAttempts: 3, deliveryMode: "self-paced",
    instructions: "Self-paced quiz on Python syntax and data types. Retake up to 3 times.",
    syllabus: ["Variables", "Strings", "Lists & dicts", "Truthiness"],
    questions: [
      { id: "q1", text: "Which is a mutable type?", options: ["tuple", "str", "list", "frozenset"], correctIndex: 2 },
      { id: "q2", text: "`bool(0)` evaluates to:", options: ["True", "False", "None", "Error"], correctIndex: 1 },
      { id: "q3", text: "What does `len('café')` return in Python 3?", options: ["3", "4", "5", "Error"], correctIndex: 1 },
      { id: "q4", text: "Which creates an empty dict?", options: ["{}", "dict()", "Both", "Neither"], correctIndex: 2 },
      { id: "q5", text: "List comprehension `[x*x for x in range(3)]` returns:", options: ["[0,1,2]", "[1,4,9]", "[0,1,4]", "[1,2,3]"], correctIndex: 2 },
    ],
  },
  {
    id: "a-14", title: "BankAccount OOP Exercise", type: "Exercise", course: "Python Fundamentals", courseId: "11",
    batch: "Python Fundamentals — Self-Paced", dueDate: "Any time", score: null, maxScore: 40, status: "not_started",
    timeLimitMin: 60, attempts: 0, maxAttempts: 5, deliveryMode: "self-paced",
    instructions: "Implement a `BankAccount` class with deposit, withdraw, transfer and history methods. Tests are pre-loaded.",
    syllabus: ["Classes", "Methods", "Exceptions"], questions: [],
    starterCode: "class BankAccount:\n    def __init__(self, owner, balance=0):\n        # TODO\n        pass\n",
    language: "python",
  },
  {
    id: "a-15", title: "Expense Tracker Capstone", type: "Assignment", course: "Python Fundamentals", courseId: "11",
    batch: "Python Fundamentals — Self-Paced", dueDate: "Any time", score: null, maxScore: 100, status: "not_started",
    timeLimitMin: 240, attempts: 0, maxAttempts: 1, deliveryMode: "self-paced",
    instructions: "Build a CLI expense tracker backed by JSON. Submit a single .zip with code + README.",
    syllabus: ["File IO", "JSON", "CLI args", "Classes"],
    questions: [], submission: { type: "file", placeholder: "Upload .zip" },
  },
];

export const getStudentAssessment = (id: string) => studentAssessments.find((a) => a.id === id);

// ───── CERTIFICATES ─────
export interface StudentCertificate {
  id: string;
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate: string | null;
  credentialId: string;
  status: "issued" | "in_progress" | "expired";
  progress: number;
  skills: string[];
  description: string;
  recipient: string;
  relatedCourseId?: string;
  verifyUrl: string;
}

export const studentCertificates: StudentCertificate[] = [
  { id: "c-1", title: "Docker Essentials", issuer: "CodeCraft Institute", issuedDate: "Feb 10, 2025", expiryDate: null, credentialId: "DC-2025-00142", status: "issued", progress: 100, skills: ["Docker", "Containers", "Docker Compose", "Networking"], description: "Awarded for completion of Docker Essentials with passing scores on all assessments.", recipient: "Alex Student", relatedCourseId: "3", verifyUrl: "https://verify.cloudadda.io/DC-2025-00142" },
  { id: "c-2", title: "AWS Cloud Practitioner", issuer: "TechSkills Academy", issuedDate: "-", expiryDate: null, credentialId: "-", status: "in_progress", progress: 65, skills: ["AWS", "Cloud Computing", "IAM", "EC2", "S3"], description: "Complete all modules and pass the final assessment to earn this certificate.", recipient: "Alex Student", relatedCourseId: "1", verifyUrl: "#" },
  { id: "c-3", title: "Linux Fundamentals", issuer: "TechSkills Academy", issuedDate: "Jan 5, 2025", expiryDate: "Jan 5, 2027", credentialId: "LF-2025-00089", status: "issued", progress: 100, skills: ["Linux", "CLI", "Shell Scripting", "System Admin"], description: "Certified Linux Fundamentals — valid for 2 years.", recipient: "Alex Student", verifyUrl: "https://verify.cloudadda.io/LF-2025-00089" },
  { id: "c-4", title: "Python for Data Science", issuer: "CodeCraft Institute", issuedDate: "-", expiryDate: null, credentialId: "-", status: "in_progress", progress: 28, skills: ["Python", "Pandas", "NumPy", "ML basics"], description: "Self-paced certificate — complete all chapters and capstone.", recipient: "Alex Student", relatedCourseId: "4", verifyUrl: "#" },
];

export const getStudentCertificate = (id: string) => studentCertificates.find((c) => c.id === id);
