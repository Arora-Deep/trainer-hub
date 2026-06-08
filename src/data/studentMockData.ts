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
  bodyHtml?: string;
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
  // Code exercise fields (auto-graded with mock Judge0)
  codeProblem?: string;
  codeConstraints?: string;
  codeStarter?: string;
  codeSolution?: string;
  codeHints?: string[];
  codeTests?: { id: string; input: string; expectedOutput: string; hidden?: boolean; weight?: number }[];
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
  // ───────── DEMO: Java Fundamentals (Self-Paced) ─────────
  {
    id: "10",
    name: "Java Fundamentals",
    category: "Programming",
    description:
      "Self-paced Java fundamentals bootcamp covering syntax, OOP, collections, exception handling, file IO, multithreading and JDBC. Learn on your own schedule with rich reading material, videos and hands-on labs on an always-on JDK 21 sandbox.",
    instructor: "Mentor: Rahul Verma",
    instructorBio:
      "Java champion with 12+ years of enterprise Java experience. Oracle Certified Professional, ex-tech lead at a Fortune 500 bank. Holds weekly async office hours.",
    modules: 10, completed: 3, totalHours: 40, status: "in_progress",
    deliveryMode: "self-paced", rating: 4.9, studyTime: "9h 30m", lastAccessed: "1h ago",
    batch: "Java Fundamentals — Self-Paced", batchId: "10", prerequisites: [],
    nextLessonId: "l-10-7",
    totalAccessHours: 80, usedAccessHours: 18,
    persistentLab: {
      labId: "lab-10",
      templateName: "Java Dev Sandbox (JDK 21 + Maven)",
      totalHours: 40,
      usedHours: 9.5,
      ip: "10.0.10.18",
      status: "running",
    },
    studyData: [
      { day: "Mon", hours: 2 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 2 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 1.5 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 0.5 },
    ],
    chapters: [
      {
        id: "ch-10-1", title: "Getting Started",
        lessons: [
          { id: "l-10-1", title: "Welcome & course roadmap", type: "video", duration: "12m", completed: true, locked: false,
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
            body: "An overview of what you will learn over the next 4 weeks — from your first 'Hello World' to building a JDBC-backed CLI app." },
          { id: "l-10-2", title: "Reading: Why Java still matters in 2026", type: "reading", duration: "15m", completed: true, locked: false,
            bodyHtml: `
              <h1>Why Java still matters in 2026</h1>
              <p class="lead">Java turned 30 this year. Despite the rise of Go, Rust, Kotlin and TypeScript, the JVM ecosystem still powers a staggering share of the world's critical infrastructure — and shows no signs of slowing down.</p>

              <h2>1. Where you'll find Java today</h2>
              <ul>
                <li><strong>Banking & FinTech</strong> — almost every major bank (JPMorgan, Goldman Sachs, HDFC, ICICI) runs core systems on the JVM. Low-latency trading platforms are written in Java because of predictable GC and JIT performance.</li>
                <li><strong>Big Data</strong> — Apache Kafka, Spark, Hadoop, Cassandra, Elasticsearch, Flink — all JVM-based.</li>
                <li><strong>Android</strong> — even with Kotlin's rise, the Android runtime, SDK and 80% of production apps still ship Java bytecode.</li>
                <li><strong>Enterprise SaaS</strong> — Atlassian (Jira, Confluence), Salesforce backends, Netflix middleware, LinkedIn's Kafka pipelines.</li>
              </ul>

              <h2>2. What "write once, run anywhere" really means</h2>
              <p>Your <code>.java</code> source is compiled by <code>javac</code> into platform-neutral <strong>bytecode</strong> (<code>.class</code> files). The Java Virtual Machine (JVM) on Linux, macOS, Windows, ARM servers or even a Raspberry Pi interprets that bytecode and JIT-compiles hot paths into native machine code at runtime.</p>
              <blockquote>The JVM is one of the most sophisticated runtime systems ever built — adaptive optimisation, escape analysis, biased locking, tiered compilation, and a pluggable garbage collector.</blockquote>

              <h2>3. Modern Java is not your uncle's Java</h2>
              <p>If you last saw Java 8, you're in for a treat. Java 21 (the current LTS) gives you:</p>
              <ul>
                <li><code>var</code> for local type inference</li>
                <li><strong>Records</strong> — one-line immutable data classes</li>
                <li><strong>Pattern matching</strong> in <code>switch</code> and <code>instanceof</code></li>
                <li><strong>Sealed classes</strong> for exhaustive hierarchies</li>
                <li><strong>Virtual threads (Project Loom)</strong> — millions of cheap threads, no reactor framework required</li>
                <li><strong>Text blocks</strong> for multi-line strings</li>
              </ul>

              <h2>4. Why this matters for your career</h2>
              <p>Job postings for "Java backend engineer" still outnumber Go and Rust combined in India, the US and Europe. Average compensation for a Java engineer with 3+ years is 30–40% higher than the median backend role because the systems are mission-critical and the ecosystem is deep.</p>
              <p>By the end of this course you will be able to read, debug and contribute to a real enterprise codebase — not just toy programs.</p>

              <h2>What to do next</h2>
              <ol>
                <li>Watch the next lesson and install JDK 21 + IntelliJ IDEA.</li>
                <li>Launch your dedicated <em>Java Dev Sandbox</em> VM and run your first program.</li>
                <li>Take the chapter quiz to lock in the basics.</li>
              </ol>
            ` },
          { id: "l-10-3", title: "Installing JDK 21 & IntelliJ IDEA", type: "video", duration: "20m", completed: true, locked: false,
            videoUrl: "https://www.youtube.com/embed/dRMvujm3a88" },
          { id: "l-10-4", title: "Lab: Your first Java program", type: "lab", duration: "45m", completed: false, locked: false,
            labTemplate: "Java Dev Sandbox (JDK 21 + Maven)", labMode: "on-demand", estimatedHours: 1,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 } },
          { id: "l-10-5", title: "Quiz: Setup & basics", type: "quiz", duration: "10m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-10-2", title: "Syntax, Variables & Control Flow",
        lessons: [
          { id: "l-10-6", title: "Primitive types, operators, casting", type: "video", duration: "35m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34" },
          { id: "l-10-6b", title: "Reading: Variables, types and the stack vs heap", type: "reading", duration: "18m", completed: false, locked: false,
            bodyHtml: `
              <h1>Variables, types and where they live</h1>
              <p class="lead">Every Java program is a dance between two regions of memory: the <strong>stack</strong> (fast, per-thread, holds primitives and references) and the <strong>heap</strong> (slower, garbage-collected, holds every object you ever <code>new</code>).</p>

              <h2>Primitive types — the 8 originals</h2>
              <table>
                <thead><tr><th>Type</th><th>Size</th><th>Range</th><th>Default</th></tr></thead>
                <tbody>
                  <tr><td><code>byte</code></td><td>8-bit</td><td>-128…127</td><td>0</td></tr>
                  <tr><td><code>short</code></td><td>16-bit</td><td>±32k</td><td>0</td></tr>
                  <tr><td><code>int</code></td><td>32-bit</td><td>±2.1B</td><td>0</td></tr>
                  <tr><td><code>long</code></td><td>64-bit</td><td>±9.2 quintillion</td><td>0L</td></tr>
                  <tr><td><code>float</code></td><td>32-bit IEEE-754</td><td>~7 digits</td><td>0.0f</td></tr>
                  <tr><td><code>double</code></td><td>64-bit IEEE-754</td><td>~15 digits</td><td>0.0d</td></tr>
                  <tr><td><code>char</code></td><td>16-bit Unicode</td><td>U+0000…U+FFFF</td><td>'\\u0000'</td></tr>
                  <tr><td><code>boolean</code></td><td>JVM-defined</td><td>true / false</td><td>false</td></tr>
                </tbody>
              </table>

              <h2>References vs values</h2>
              <pre><code>int x = 42;            // value lives on the stack
String name = "Alex";  // reference on stack, String object on heap
int[] data = {1,2,3};  // reference on stack, array on heap</code></pre>
              <p>This distinction explains every "but I changed it inside the method!" bug you'll ever write. Primitives pass by value; object references pass by value <em>of the reference</em> — so you can mutate the object, but reassigning the parameter doesn't change the caller's reference.</p>

              <h2>Casting — widening vs narrowing</h2>
              <p>Widening (e.g. <code>int → long</code>) is implicit. Narrowing (<code>double → int</code>) requires an explicit cast and may lose data:</p>
              <pre><code>double pi = 3.14159;
int truncated = (int) pi;   // 3 — fractional part discarded</code></pre>

              <h2>Why <code>BigDecimal</code> exists</h2>
              <blockquote>Never use <code>double</code> for money. Floating-point can't represent 0.1 exactly — <code>0.1 + 0.2</code> in Java prints <code>0.30000000000000004</code>. Use <code>java.math.BigDecimal</code>.</blockquote>

              <h2>Control flow in modern Java</h2>
              <p>Java 14+ introduced <strong>switch expressions</strong> — they return a value and have no fall-through:</p>
              <pre><code>String day = switch (dayOfWeek) {
    case MON, TUE, WED, THU, FRI -> "Weekday";
    case SAT, SUN -> "Weekend";
};</code></pre>
              <p>This eliminates an entire class of bugs caused by forgotten <code>break</code> statements in classic switch.</p>
            ` },
          { id: "l-10-9", title: "Code exercise: FizzBuzz", type: "code-exercise", duration: "30m", completed: false, locked: false, language: "java",
            codeProblem: "Write a program that reads an integer N from stdin and prints numbers from 1 to N, one per line, with these rules:\n• If the number is divisible by 3, print 'Fizz' instead.\n• If divisible by 5, print 'Buzz' instead.\n• If divisible by both 3 and 5, print 'FizzBuzz'.",
            codeConstraints: "1 <= N <= 100",
            codeStarter: "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Your code here\n    }\n}",
            codeSolution: "import java.util.Scanner;\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            if (i % 15 == 0) System.out.println(\"FizzBuzz\");\n            else if (i % 3 == 0) System.out.println(\"Fizz\");\n            else if (i % 5 == 0) System.out.println(\"Buzz\");\n            else System.out.println(i);\n        }\n    }\n}",
            codeHints: ["Check divisibility by 15 (i.e. both 3 and 5) first.", "Use a single for loop from 1 to N inclusive."],
            codeTests: [
              { id: "t1", input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz", weight: 25 },
              { id: "t2", input: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", weight: 35 },
              { id: "t3", input: "30", expectedOutput: "(hidden)", hidden: true, weight: 40 },
            ],
          },
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
          { id: "l-10-11", title: "Classes, objects, constructors", type: "video", duration: "40m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/pTB0EiLXUC8" },
          { id: "l-10-12", title: "Inheritance & polymorphism", type: "video", duration: "45m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/jzeoNkU45IM" },
          { id: "l-10-13", title: "Reading: SOLID principles in plain English", type: "reading", duration: "20m", completed: false, locked: false,
            bodyHtml: `
              <h1>SOLID principles in plain English</h1>
              <p class="lead">Five design principles, coined by Robert C. Martin, that separate a codebase you enjoy working in from one you dread on Monday mornings. We'll walk through each one with a banking domain example.</p>

              <h2>S — Single Responsibility Principle</h2>
              <p>A class should have one, and only one, reason to change. The classic violation: a <code>Customer</code> class that loads itself from the database, validates fields, sends welcome emails and renders a PDF receipt.</p>
              <pre><code>// ❌ Bad — four reasons to change
class Customer {
  void saveToDb() { ... }
  void validate() { ... }
  void sendWelcomeEmail() { ... }
  void printReceipt() { ... }
}

// ✅ Good — split responsibilities
class Customer { /* data only */ }
class CustomerRepository { void save(Customer c) { ... } }
class CustomerValidator { void validate(Customer c) { ... } }
class EmailService { void sendWelcome(Customer c) { ... } }</code></pre>

              <h2>O — Open/Closed</h2>
              <p>Software entities should be <strong>open for extension, closed for modification</strong>. Adding a new account type (Savings, Current, FixedDeposit) shouldn't require editing a giant <code>switch</code> — it should mean adding a new subclass.</p>

              <h2>L — Liskov Substitution</h2>
              <p>If <code>S</code> is a subtype of <code>T</code>, you can substitute <code>S</code> for <code>T</code> without breaking the program. The infamous "Square extends Rectangle" trap is the textbook violation: setting width on a Square changes height, breaking every caller that assumed independent dimensions.</p>

              <h2>I — Interface Segregation</h2>
              <p>Clients shouldn't be forced to depend on methods they don't use. A 40-method <code>BankingService</code> interface should be split into <code>AccountService</code>, <code>TransferService</code>, <code>StatementService</code> — so a reporting module isn't dragged into transaction logic.</p>

              <h2>D — Dependency Inversion</h2>
              <p>Depend on <strong>abstractions</strong>, not concretions. Your <code>TransferService</code> should accept an <code>AccountRepository</code> interface, not <code>PostgresAccountRepository</code> directly. This is what makes unit testing (with mocks) possible and what lets you swap Postgres for DynamoDB without rewriting business logic.</p>

              <blockquote>If your IDE shows red squiggles every time a requirement changes, you probably broke at least three of these. Re-read this lesson.</blockquote>
            ` },
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
          { id: "l-10-16", title: "List, Set, Map — when to use what", type: "video", duration: "50m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/viTHc_4XfCA" },
          { id: "l-10-16b", title: "Reading: Choosing the right collection", type: "reading", duration: "16m", completed: false, locked: false,
            bodyHtml: `
              <h1>Choosing the right collection</h1>
              <p class="lead">Java's <code>java.util</code> package has over 20 collection classes. 90% of the time you only need four — and picking the wrong one is the difference between an O(1) lookup and an accidental O(n²) loop that takes down production.</p>

              <h2>The decision tree</h2>
              <ul>
                <li><strong>Need order? Allow duplicates?</strong> → <code>ArrayList</code> (random access, fast iteration) or <code>LinkedList</code> (fast insert/remove at ends).</li>
                <li><strong>No duplicates, no order matters?</strong> → <code>HashSet</code> — O(1) contains / add / remove.</li>
                <li><strong>No duplicates, insertion order matters?</strong> → <code>LinkedHashSet</code>.</li>
                <li><strong>No duplicates, sorted?</strong> → <code>TreeSet</code> (O(log n), red-black tree).</li>
                <li><strong>Key → value lookup?</strong> → <code>HashMap</code>. With insertion order: <code>LinkedHashMap</code>. Sorted: <code>TreeMap</code>.</li>
              </ul>

              <h2>The hidden cost of ArrayList.contains()</h2>
              <pre><code>List&lt;String&gt; ids = new ArrayList&lt;&gt;();   // O(n) contains
for (String id : incoming) {
    if (!ids.contains(id)) ids.add(id);    // O(n²) overall 🔥
}

// ✅ Use a Set
Set&lt;String&gt; ids = new HashSet&lt;&gt;();     // O(1) contains
for (String id : incoming) ids.add(id);    // O(n) overall</code></pre>

              <h2>Generics — why they exist</h2>
              <p>Before Java 5, every collection held raw <code>Object</code> — you cast on every read and prayed at runtime. Generics let the compiler prove type safety at compile time:</p>
              <pre><code>List&lt;Customer&gt; customers = repo.findAll();
for (Customer c : customers) {   // no cast — Customer is guaranteed
    System.out.println(c.email());
}</code></pre>

              <h2>Bounded wildcards — PECS</h2>
              <p><strong>P</strong>roducer <strong>E</strong>xtends, <strong>C</strong>onsumer <strong>S</strong>uper. If a method <em>reads</em> from a collection, use <code>? extends T</code>. If it <em>writes</em>, use <code>? super T</code>. This unlocks polymorphism without sacrificing type safety.</p>
            ` },
          { id: "l-10-17", title: "Generics & wildcards", type: "video", duration: "35m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/K1iu1kXkVoA" },
          { id: "l-10-18", title: "Lab: Refactor with collections", type: "lab", duration: "1h 30m", completed: false, locked: false,
            labTemplate: "Java Dev Sandbox (JDK 21 + Maven)", labMode: "on-demand", estimatedHours: 2,
            labAllocation: { type: "time-limited", sessionDurationHrs: 2 } },
          { id: "l-10-19", title: "Quiz: Collections framework", type: "quiz", duration: "20m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-10-5", title: "Exceptions, IO & Multithreading",
        lessons: [
          { id: "l-10-20", title: "Checked vs unchecked exceptions", type: "video", duration: "30m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/1XAfapkBQjk" },
          { id: "l-10-20b", title: "Reading: Exception handling done right", type: "reading", duration: "14m", completed: false, locked: false,
            bodyHtml: `
              <h1>Exception handling done right</h1>
              <p class="lead">Exceptions exist to <em>separate the normal happy path from the recovery path</em>. They are not a flow-control mechanism, not a "return two values" trick, and definitely not something to swallow silently with an empty catch block.</p>

              <h2>Checked vs unchecked — the two-minute version</h2>
              <ul>
                <li><strong>Checked</strong> (<code>extends Exception</code>) — the compiler forces you to declare or handle it. Use for <em>recoverable</em> failures the caller is expected to deal with: <code>IOException</code>, <code>SQLException</code>.</li>
                <li><strong>Unchecked</strong> (<code>extends RuntimeException</code>) — programmer errors and unrecoverable failures: <code>NullPointerException</code>, <code>IllegalArgumentException</code>, <code>IllegalStateException</code>.</li>
              </ul>

              <h2>The cardinal sins</h2>
              <pre><code>// ❌ The "shut up compiler" pattern
try { riskyOp(); } catch (Exception e) { /* nothing */ }

// ❌ Catch and rethrow with no context
try { riskyOp(); } catch (IOException e) { throw new RuntimeException(e); }

// ✅ Catch what you can handle, wrap with context
try {
    config = loadConfig(path);
} catch (IOException e) {
    throw new ConfigLoadException("Failed loading config from " + path, e);
}</code></pre>

              <h2>try-with-resources</h2>
              <p>Since Java 7, any class implementing <code>AutoCloseable</code> can go in the try header — and the JVM guarantees <code>close()</code> is called, even if your code throws.</p>
              <pre><code>try (BufferedReader r = Files.newBufferedReader(path)) {
    return r.readLine();
}  // r.close() called automatically</code></pre>

              <h2>The rule of thumb</h2>
              <blockquote><strong>Throw early, catch late.</strong> Validate inputs at the boundary and fail fast. Catch only at the layer where you can do something meaningful — log, retry, or translate to a user-facing error.</blockquote>
            ` },
          { id: "l-10-21", title: "File IO with java.nio", type: "video", duration: "40m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/yH3SuD8M6Ow" },
          { id: "l-10-22", title: "Multithreading & ExecutorService", type: "video", duration: "1h", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/4aYvLz4E1Ts" },
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
          { id: "l-10-25", title: "JDBC basics & PreparedStatement", type: "video", duration: "45m", completed: false, locked: false,
            videoUrl: "https://www.youtube.com/embed/QwbZmpQgPB8" },
          { id: "l-10-25b", title: "Reading: JDBC, connection pools & SQL injection", type: "reading", duration: "16m", completed: false, locked: false,
            bodyHtml: `
              <h1>JDBC, connection pools & SQL injection</h1>
              <p class="lead">JDBC is Java's lowest-level database API. Modern frameworks (Hibernate, Spring Data, jOOQ) sit on top of it — and they all delegate to JDBC under the hood. Understanding it is non-negotiable.</p>

              <h2>The four objects you need to know</h2>
              <ol>
                <li><code>DataSource</code> — the pool-aware factory. You never call <code>DriverManager.getConnection()</code> in production.</li>
                <li><code>Connection</code> — a session with the database. <strong>Always</strong> close it (or use try-with-resources) — connection leaks kill apps.</li>
                <li><code>PreparedStatement</code> — a precompiled, parameter-safe SQL statement. Never use <code>Statement</code> with concatenated user input.</li>
                <li><code>ResultSet</code> — a forward-only cursor over rows. Also <code>AutoCloseable</code>.</li>
              </ol>

              <h2>The SQL injection that ended careers</h2>
              <pre><code>// ❌ NEVER do this — direct concatenation
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
stmt.executeQuery(sql);
// If email = "x' OR '1'='1" → returns every row. Or worse, drops the table.

// ✅ PreparedStatement — driver escapes for you
PreparedStatement ps = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?");
ps.setString(1, email);
ResultSet rs = ps.executeQuery();</code></pre>

              <h2>Why connection pools matter</h2>
              <p>Opening a TCP connection + TLS handshake + authentication to Postgres takes 30-100ms. If every HTTP request opens a new connection, your p99 latency is dead before your code runs. <strong>HikariCP</strong> is the de-facto standard in 2026 — pre-warmed connections, ~10µs to acquire.</p>

              <h2>Transactions</h2>
              <pre><code>conn.setAutoCommit(false);
try {
    debit(fromAccount, amount);
    credit(toAccount, amount);
    conn.commit();
} catch (SQLException e) {
    conn.rollback();
    throw e;
}</code></pre>
              <p>This 6-line pattern is the foundation of every banking system on earth.</p>
            ` },
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
  // ───────── DEMO: Python Fundamentals (VILT — Live Instructor-Led) ─────────
  {
    id: "11",
    name: "Python Fundamentals",
    category: "Programming",
    description:
      "Instructor-led Python fundamentals — from syntax to OOP, file handling, and a final mini-project. Daily live sessions with Neha, paired with quizzes, code exercises and AI reasoning assessments. Lab access is provisioned through your batch.",
    instructor: "Neha Kapoor",
    instructorBio:
      "Senior Python engineer, ex-Razorpay. Runs live cohorts and weekly Q&A sessions.",
    modules: 10, completed: 2, totalHours: 32, status: "in_progress",
    deliveryMode: "live", rating: 4.8, studyTime: "4h 15m", lastAccessed: "5h ago",
    batch: "Python Fundamentals — Cohort 7", batchId: "11", prerequisites: [],
    nextLessonId: "l-11-5",
    nextLiveSession: { title: "Variables, numbers & strings (Live)", date: "Today", time: "6:00 PM" },
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
          { id: "l-11-4", title: "Quiz: Setup check", type: "quiz", duration: "8m", completed: false, locked: false },
        ],
      },
      {
        id: "ch-11-2", title: "Syntax & Data Types",
        lessons: [
          { id: "l-11-5", title: "Variables, numbers, strings", type: "video", duration: "30m", completed: false, locked: false },
          { id: "l-11-6", title: "Lists, tuples, sets, dicts", type: "video", duration: "45m", completed: false, locked: false },
          { id: "l-11-7", title: "Code exercise: String manipulation", type: "code-exercise", duration: "30m", completed: false, locked: false,
            language: "python",
            codeProblem: "Read a single line of text from stdin and print it back with:\n• All words reversed in order (last word first).\n• Each word's letters left untouched.\nWords are separated by a single space.",
            codeConstraints: "1 <= length(text) <= 1000",
            codeStarter: "def reverse_words(s: str) -> str:\n    # Your code here\n    pass\n\nif __name__ == '__main__':\n    text = input()\n    print(reverse_words(text))",
            codeSolution: "def reverse_words(s):\n    return ' '.join(reversed(s.split(' ')))\n\nif __name__ == '__main__':\n    print(reverse_words(input()))",
            codeHints: ["str.split(' ') returns the list of words.", "reversed() works on any sequence — combine with ' '.join()."],
            codeTests: [
              { id: "t1", input: "hello world", expectedOutput: "world hello", weight: 25 },
              { id: "t2", input: "the quick brown fox", expectedOutput: "fox brown quick the", weight: 35 },
              { id: "t3", input: "(hidden)", expectedOutput: "(hidden)", hidden: true, weight: 40 },
            ],
          },
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
          { id: "l-11-16", title: "Code exercise: BankAccount class", type: "code-exercise", duration: "45m", completed: false, locked: false, language: "python",
            codeProblem: "Implement a BankAccount class supporting deposit(amount), withdraw(amount) and balance.\nRules:\n• Initial balance is 0.\n• withdraw() should not allow the balance to go below 0 — print 'Insufficient funds' and ignore the withdrawal.\n• Read operations from stdin: first line is N (number of ops), then N lines each like 'D 100' or 'W 50'. After processing, print the final balance.",
            codeConstraints: "1 <= N <= 100\n0 <= amount <= 10000",
            codeStarter: "class BankAccount:\n    def __init__(self):\n        # Your code here\n        pass\n    def deposit(self, amount):\n        pass\n    def withdraw(self, amount):\n        pass\n\nif __name__ == '__main__':\n    acc = BankAccount()\n    n = int(input())\n    for _ in range(n):\n        op, amt = input().split()\n        if op == 'D': acc.deposit(int(amt))\n        else: acc.withdraw(int(amt))\n    print(acc.balance)",
            codeSolution: "class BankAccount:\n    def __init__(self):\n        self.balance = 0\n    def deposit(self, amount):\n        self.balance += amount\n    def withdraw(self, amount):\n        if amount > self.balance:\n            print('Insufficient funds')\n            return\n        self.balance -= amount",
            codeHints: ["Track balance as an instance attribute set in __init__.", "Guard withdraw() before mutating balance."],
            codeTests: [
              { id: "t1", input: "3\nD 100\nD 50\nW 30", expectedOutput: "120", weight: 30 },
              { id: "t2", input: "2\nD 50\nW 100", expectedOutput: "Insufficient funds\n50", weight: 30 },
              { id: "t3", input: "(hidden)", expectedOutput: "(hidden)", hidden: true, weight: 40 },
            ],
          },
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
    timeRemaining: "Always-on · 30.5h left", ip: "10.0.10.18", cpu: 28, ram: 40, storage: 25, uptime: "35m",
    batch: "Java Fundamentals — Self-Paced", batchId: "10", deliveryMode: "self-paced",
    accessKind: "course-persistent", courseId: "10",
    sshPort: 22, username: "student", password: "Jv@self2026",
    lastCommands: ["$ javac Main.java", "$ java Main", "$ mvn -q test"],
    totalAccessHours: 40, usedAccessHours: 9.5,
    snapshots: [{ id: "s1", name: "Fresh JDK 21", createdAt: "May 10", size: "3.8 GB" }],
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
    batch: "Java Fundamentals — Self-Paced", dueDate: "Any time", score: null, maxScore: 100, status: "pending",
    timeLimitMin: 25, attempts: 0, maxAttempts: 2, deliveryMode: "self-paced",
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
