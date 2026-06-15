import { create } from 'zustand';

export type LessonType =
  | 'video'
  | 'reading'
  | 'quiz'
  | 'assignment'
  | 'code-exercise'
  | 'lab'
  | 'lab-instruction'
  | 'live-session'
  | 'ctf-scenario'
  | 'exam'
  | 'mock-exam'
  | 'survey'
  | 'game-based-learning'
  | 'reasoning';

export type LabMode = 'on-demand' | 'persistent';

export type LabAllocationType =
  | 'persistent'      // dedicated for full course duration
  | 'module-unlock'   // unlocks after prerequisite lesson/module
  | 'time-limited'    // launch -> countdown
  | 'hour-pool';      // student spends from a pool

export interface LabAllocation {
  type: LabAllocationType;
  hours?: number;                    // persistent fixed total / hour-pool total
  expiry?: string;                   // ISO date for persistent fixed-expiry
  untilCourseEnd?: boolean;
  unlockAfter?: {
    kind: 'lesson' | 'module' | 'quiz' | 'assignment';
    refId: string;
    refLabel?: string;
  };
  sessionDurationHrs?: number;       // time-limited per launch
  onExpire?: 'suspend' | 'delete' | 'lock';
}

export interface LabAttachment {
  templateId: string;
  templateName: string;
  mode: LabMode;
  estimatedHours?: number;
  allocation?: LabAllocation;
}

export type LessonSource = 'inline' | 'library';

export interface LessonAttachment {
  name: string;
  size?: number;
  url?: string;
  kind?: string;
}

export interface LabInstructionTask {
  id: string;
  title: string;
  detail?: string;
}

export interface LabInstructionResource {
  label: string;
  url?: string;
  kind?: 'link' | 'doc' | 'download' | 'reference';
}

export interface LabInstructionContent {
  objective?: string;
  prerequisites?: string[];
  tasks?: LabInstructionTask[];
  expectedOutcome?: string;
  resources?: LabInstructionResource[];
  launchLessonId?: string;
}

export interface LiveSessionContent {
  date?: string;
  time?: string;
  durationMin?: number;
  meetingUrl?: string;
  agenda?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  // Common
  summary?: string;
  instructions?: string;
  // Video / reading
  body?: string;
  videoUrl?: string;
  videoFileName?: string;
  transcript?: string;
  attachments?: LessonAttachment[];
  allowDownload?: boolean;
  // Lab
  lab?: LabAttachment;
  successCriteria?: string;
  // Lab instructions
  labInstructions?: LabInstructionContent;
  // Live session
  liveSession?: LiveSessionContent;
  // Code exercise
  language?: string;
  starterCode?: string;
  // Exam / assessment
  proctored?: boolean;
  passingScore?: number;
  attempts?: number;
  timeLimit?: number; // minutes
  // Library link
  source?: LessonSource;
  refId?: string;
  // Grading
  weight?: number;
  required?: boolean;
  // AI Reasoning
  reasoningPrompt?: string;
  reasoningModelAnswer?: string;
  reasoningRubric?: string;
  reasoningType?: 'explain-choice' | 'compare-options' | 'improve-solution' | 'root-cause' | 'scenario-response';
  reasoningQuestions?: {
    id: string;
    prompt: string;
    modelAnswer?: string;
    rubric?: string;
    type?: 'explain-choice' | 'compare-options' | 'improve-solution' | 'root-cause' | 'scenario-response';
  }[];
}


export const ASSESSMENT_LESSON_TYPES: LessonType[] = ['quiz', 'assignment', 'code-exercise', 'exam', 'game-based-learning'];
export const isAssessmentLesson = (t: LessonType) => ASSESSMENT_LESSON_TYPES.includes(t);

export interface AssessmentEntry {
  chapterId: string;
  chapterTitle: string;
  chapterIndex: number;
  lessonIndex: number;
  orderIndex: number; // overall order across course
  lesson: Lesson;
}

export function getCourseAssessments(course: { chapters: Chapter[] }): AssessmentEntry[] {
  const out: AssessmentEntry[] = [];
  let order = 0;
  course.chapters.forEach((ch, ci) => {
    ch.lessons.forEach((l, li) => {
      if (isAssessmentLesson(l.type)) {
        out.push({
          chapterId: ch.id,
          chapterTitle: ch.title,
          chapterIndex: ci,
          lessonIndex: li,
          orderIndex: order++,
          lesson: l,
        });
      }
    });
  });
  return out;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type ValidityModel = 'days-from-enrollment' | 'fixed-end-date' | 'cohort';
export type LabPolicy = 'hourly-wallet' | 'unlimited-during-validity';
export type CourseVisibility = 'private' | 'customer' | 'marketplace';
export type CourseOwnerType = 'admin' | 'trainer' | 'customer';
export type CourseModerationStatus = 'draft' | 'pending-review' | 'approved' | 'rejected';

export interface CourseSettings {
  deliveryType: 'self-paced' | 'instructor-led' | 'hybrid';
  validityModel: ValidityModel;
  validityDays?: number;
  endDate?: string;
  labPolicy: LabPolicy;
  labWalletHours?: number;
  prerequisites: string[];
  sequential: boolean;
  completionMinPct: number;
  completionMinQuizScore: number;
  requireExam: boolean;
  issuesCertificate: boolean;
  certificationId?: string;
  discussionEnabled: boolean;
  visibility: CourseVisibility;
}

export interface Course {
  id: string;
  name: string;
  deliveryType: string; // mirrors settings.deliveryType (kept for back-compat)
  batches: number;
  lastUpdated: string;
  status: string;
  category?: string;
  description?: string;
  chapters: Chapter[];
  settings?: CourseSettings;
  owner?: { type: CourseOwnerType; id: string; name: string };
  moderation?: CourseModerationStatus;
}

const defaultSettings: CourseSettings = {
  deliveryType: 'self-paced',
  validityModel: 'days-from-enrollment',
  validityDays: 90,
  labPolicy: 'unlimited-during-validity',
  labWalletHours: 20,
  prerequisites: [],
  sequential: false,
  completionMinPct: 80,
  completionMinQuizScore: 70,
  requireExam: false,
  issuesCertificate: true,
  discussionEnabled: true,
  visibility: 'customer',
};

interface CourseStore {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'batches' | 'lastUpdated' | 'chapters'>) => string;
  getCourse: (id: string) => Course | undefined;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  updateSettings: (id: string, updates: Partial<CourseSettings>) => void;
  submitForReview: (id: string) => void;
  setModeration: (id: string, status: CourseModerationStatus) => void;
  addChapter: (courseId: string, title: string) => void;
  updateChapter: (courseId: string, chapterId: string, title: string) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  addLesson: (courseId: string, chapterId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (courseId: string, chapterId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, chapterId: string, lessonId: string) => void;
}

const initialCourses: Course[] = [
  { id: "10", name: "Java Fundamentals", deliveryType: "instructor-led", category: "Programming", description: "VILT Java fundamentals bootcamp with daily live classes and dedicated lab VMs.", batches: 1, lastUpdated: "May 20, 2026", status: "active", settings: { ...defaultSettings, deliveryType: 'instructor-led' }, owner: { type: 'trainer', id: 't-3', name: 'Rahul Verma' }, moderation: 'approved', chapters: [
    { id: "ch-java-1", title: "Getting Started with Java", lessons: [
      { id: "l-java-1", title: "Welcome & Course Roadmap", type: "video", duration: "10 min", summary: "Trainer kicks off the cohort and walks through the 6-week schedule." },
      { id: "l-java-2", title: "Reading: The Java Platform (JVM, JRE, JDK)", type: "reading", duration: "15 min", body: "Java is a class-based, object-oriented language compiled to bytecode and executed on the Java Virtual Machine (JVM). This reading covers the JDK toolchain (javac, java, jshell), how the JVM loads classes, JIT compilation, and why 'write once, run anywhere' still matters in 2026." },
      { id: "l-java-3", title: "Video: JDK 21 setup walkthrough", type: "video", duration: "45 min", videoUrl: "https://www.youtube.com/embed/dRMvujm3a88" },
      { id: "l-java-4", title: "Lab: Hello Java on your VM", type: "lab", duration: "30 min", lab: { templateId: 'tpl-java', templateName: 'Java Dev VM (JDK 21)', mode: 'persistent' } },
      { id: "l-java-5", title: "Quiz: Java Platform Basics", type: "quiz", duration: "10 min", passingScore: 70, attempts: 2 },
    ]},
    { id: "ch-java-2", title: "Syntax, Variables & Control Flow", lessons: [
      { id: "l-java-6", title: "Video: Primitive types & operators", type: "video", duration: "22 min" },
      { id: "l-java-7", title: "Reading: Control flow cheatsheet", type: "reading", duration: "12 min", body: "if/else, switch expressions (Java 14+), for, while, do-while, enhanced-for, labelled break — with idiomatic examples." },
      { id: "l-java-8", title: "Exercise: FizzBuzz in Java", type: "code-exercise", duration: "20 min", language: "java", starterCode: "public class FizzBuzz {\n  public static void main(String[] args) {\n    // TODO\n  }\n}" },
      { id: "l-java-9", title: "AI Reasoning: Why is String immutable?", type: "reasoning", duration: "10 min", reasoningType: "root-cause", reasoningPrompt: "Explain why the String class is immutable in Java and how that helps with security, the String pool and multithreading.", reasoningRubric: "string pool / interning\nsecurity / TOCTOU\nthread safety\ncached hashcode / HashMap keys" },
    ]},
    { id: "ch-java-3", title: "Object-Oriented Programming", lessons: [
      { id: "l-java-10", title: "Video: Classes, objects & constructors", type: "video", duration: "28 min" },
      { id: "l-java-11", title: "Video: Inheritance & polymorphism", type: "video", duration: "25 min" },
      { id: "l-java-12", title: "Reading: SOLID principles in Java", type: "reading", duration: "18 min", body: "Single responsibility, open/closed, Liskov, interface segregation, dependency inversion — with Java snippets for each." },
      { id: "l-java-13", title: "Quiz: OOP Concepts", type: "quiz", duration: "15 min", passingScore: 70, attempts: 2 },
      { id: "l-java-14", title: "Game-Based Learning: Refactor the Zoo", type: "game-based-learning", duration: "25 min", summary: "Earn points by refactoring a tangled Animal hierarchy into clean polymorphic code." },
    ]},
    { id: "ch-java-4", title: "Collections & Generics", lessons: [
      { id: "l-java-15", title: "Video: List, Set, Map deep-dive", type: "video", duration: "30 min" },
      { id: "l-java-16", title: "Reading: Generics & type erasure", type: "reading", duration: "14 min", body: "How the compiler enforces generic types, bounded wildcards (? extends T / ? super T), and common pitfalls with raw types." },
      { id: "l-java-17", title: "Exercise: Word Frequency Counter", type: "code-exercise", duration: "30 min", language: "java" },
      { id: "l-java-18", title: "Assignment: Library Management System", type: "assignment", duration: "2 days", instructions: "Build a console app using HashMap and ArrayList to manage books, members and loans. Submit as a zipped Maven project." },
    ]},
    { id: "ch-java-5", title: "Exceptions, Files & Streams", lessons: [
      { id: "l-java-19", title: "Video: try/catch/finally & custom exceptions", type: "video", duration: "20 min" },
      { id: "l-java-20", title: "Reading: java.nio.file & try-with-resources", type: "reading", duration: "12 min", body: "Reading and writing files safely with the modern NIO.2 API, auto-closing resources, and idiomatic error handling." },
      { id: "l-java-21", title: "Lab: Build a CSV log parser", type: "lab", duration: "60 min", lab: { templateId: 'tpl-java', templateName: 'Java Dev VM (JDK 21)', mode: 'persistent' } },
      { id: "l-java-22", title: "Quiz: Exceptions & I/O", type: "quiz", duration: "10 min", passingScore: 70 },
    ]},
    { id: "ch-java-6", title: "Capstone & Final Assessment", lessons: [
      { id: "l-java-23", title: "Video: Capstone briefing", type: "video", duration: "30 min" },
      { id: "l-java-24", title: "Assignment: Capstone — Bank Account Simulator", type: "assignment", duration: "5 days", instructions: "Design a multi-account banking domain with transactions, transfers and an audit log. Use OOP, collections and exception handling." },
      { id: "l-java-25", title: "Game-Based Learning: Bug Bash Arena", type: "game-based-learning", duration: "30 min", summary: "Timed challenge — fix as many seeded bugs as you can in a Java codebase." },
      { id: "l-java-26", title: "Final Exam (Proctored)", type: "exam", duration: "60 min", proctored: true, passingScore: 70, attempts: 1, timeLimit: 60 },
      { id: "l-java-27", title: "AI Reasoning: What will you build next?", type: "reasoning", duration: "5 min", reasoningType: "scenario-response", reasoningPrompt: "Describe a small Java project you'd build next week and the concepts from this course you'd use." },
    ]},
  ] },
  { id: "11", name: "Python Fundamentals", deliveryType: "self-paced", category: "Programming", description: "Self-paced Python fundamentals with persistent learner labs cloned from a trainer golden template.", batches: 1, lastUpdated: "Apr 25, 2026", status: "active", settings: { ...defaultSettings, deliveryType: 'self-paced', labPolicy: 'unlimited-during-validity', visibility: 'customer' }, owner: { type: 'trainer', id: 't-4', name: 'Neha Kapoor' }, moderation: 'approved', chapters: [
    { id: "ch-pyf-1", title: "Welcome to Python", lessons: [
      { id: "l-pyf-1", title: "Intro video: Why Python in 2026?", type: "video", duration: "8 min" },
      { id: "l-pyf-2", title: "Reading: Setting up your learner VM", type: "reading", duration: "10 min", body: "Your personal Python VM has been cloned from the trainer's golden snapshot. It includes Python 3.12, pip, venv, VS Code Server and pre-installed packages (numpy, pandas, requests). Launch it from the lab panel and you're ready to code." },
      { id: "l-pyf-3", title: "Lab: Your persistent Python VM", type: "lab", duration: "open", lab: { templateId: 'tpl-py', templateName: 'Python Learner VM', mode: 'persistent' } },
      { id: "l-pyf-4", title: "AI Reasoning: What do you want to build?", type: "reasoning", duration: "5 min", reasoningType: "scenario-response", reasoningPrompt: "Pick one project you'd like to build in Python and outline the modules / libraries you'd reach for." },
    ]},
    { id: "ch-pyf-2", title: "Syntax, Variables & Types", lessons: [
      { id: "l-pyf-5", title: "Video: Variables, numbers & strings", type: "video", duration: "18 min" },
      { id: "l-pyf-6", title: "Reading: Truthiness & Pythonic style", type: "reading", duration: "12 min", body: "PEP 8 essentials, truthy/falsy values, f-strings, comprehensions, and idiomatic patterns that separate beginners from intermediate Pythonistas." },
      { id: "l-pyf-7", title: "Exercise: Temperature converter", type: "code-exercise", duration: "15 min", language: "python", starterCode: "def c_to_f(c):\n    # TODO\n    pass\n" },
      { id: "l-pyf-8", title: "Quiz: Python Basics", type: "quiz", duration: "10 min", passingScore: 70, attempts: 3 },
    ]},
    { id: "ch-pyf-3", title: "Control Flow & Functions", lessons: [
      { id: "l-pyf-9", title: "Video: if / for / while", type: "video", duration: "20 min" },
      { id: "l-pyf-10", title: "Video: Functions, *args, **kwargs", type: "video", duration: "22 min" },
      { id: "l-pyf-11", title: "Exercise: FizzBuzz", type: "code-exercise", duration: "15 min", language: "python" },
      { id: "l-pyf-12", title: "Exercise: Prime number checker", type: "code-exercise", duration: "20 min", language: "python" },
      { id: "l-pyf-13", title: "Game-Based Learning: Loop Labyrinth", type: "game-based-learning", duration: "25 min", summary: "Navigate a maze by writing the correct loop & conditional for each room." },
    ]},
    { id: "ch-pyf-4", title: "Data Structures", lessons: [
      { id: "l-pyf-14", title: "Video: Lists, tuples, sets, dicts", type: "video", duration: "26 min" },
      { id: "l-pyf-15", title: "Reading: Choosing the right structure", type: "reading", duration: "14 min", body: "Big-O cheat sheet for list vs set vs dict operations, when to use a tuple vs a namedtuple vs a dataclass." },
      { id: "l-pyf-16", title: "Assignment: Contact Book CLI", type: "assignment", duration: "Any time", instructions: "Build a CLI that stores contacts in a JSON file with add/search/delete commands. Submit your script and a screen recording." },
      { id: "l-pyf-17", title: "Quiz: Data Structures", type: "quiz", duration: "10 min", passingScore: 70 },
    ]},
    { id: "ch-pyf-5", title: "Files, Modules & Packages", lessons: [
      { id: "l-pyf-18", title: "Video: Reading & writing files", type: "video", duration: "18 min" },
      { id: "l-pyf-19", title: "Reading: Virtual envs & pip", type: "reading", duration: "12 min", body: "Why every project needs its own venv, how requirements.txt works, and a tour of the modern alternative (uv) — already installed on your lab VM." },
      { id: "l-pyf-20", title: "Lab: Build a CSV analyzer", type: "lab", duration: "60 min", lab: { templateId: 'tpl-py', templateName: 'Python Learner VM', mode: 'persistent' } },
      { id: "l-pyf-21", title: "Exercise: Word counter from file", type: "code-exercise", duration: "25 min", language: "python" },
    ]},
    { id: "ch-pyf-6", title: "Capstone", lessons: [
      { id: "l-pyf-22", title: "Reading: Capstone brief", type: "reading", duration: "10 min", body: "Build a weather dashboard that pulls data from a public API, caches it locally and renders a daily summary. Stretch goal: schedule it with cron on your VM." },
      { id: "l-pyf-23", title: "Assignment: Weather Dashboard", type: "assignment", duration: "Any time", instructions: "Submit the project zip and a short Loom walkthrough." },
      { id: "l-pyf-24", title: "Game-Based Learning: Debug Dungeon", type: "game-based-learning", duration: "30 min", summary: "Solve increasingly tricky Python bugs to escape the dungeon." },
      { id: "l-pyf-25", title: "Final Quiz: Python Fundamentals", type: "quiz", duration: "20 min", passingScore: 70, attempts: 2 },
    ]},
  ] },
  {
    id: "1",
    name: "AWS Solutions Architect Professional",
    deliveryType: "instructor-led",
    batches: 5,
    lastUpdated: "Jan 12, 2024",
    status: "active",
    settings: { ...defaultSettings, deliveryType: 'instructor-led' },
    owner: { type: 'trainer', id: 't-1', name: 'James Wilson' },
    moderation: 'approved',
    chapters: [
      { id: "ch1", title: "Introduction to AWS", lessons: [
        { id: "l1", title: "What is AWS?", type: "video", duration: "15 min" },
        { id: "l2", title: "AWS Global Infrastructure", type: "video", duration: "20 min" },
      ]},
      { id: "ch2", title: "Compute Services", lessons: [
        { id: "l3", title: "EC2 Overview", type: "video", duration: "25 min" },
        { id: "l4", title: "Lambda Functions", type: "video", duration: "30 min" },
        { id: "l5", title: "EC2 Hands-on Lab", type: "lab", duration: "45 min", lab: { templateId: 'tpl-1', templateName: 'AWS EC2 Linux Instance', mode: 'on-demand', estimatedHours: 1 } },
      ]},
    ],
  },
  { id: "2", name: "Kubernetes Fundamentals", deliveryType: "instructor-led", batches: 3, lastUpdated: "Jan 10, 2024", status: "active", chapters: [], settings: { ...defaultSettings, deliveryType: 'instructor-led' }, moderation: 'approved' },
  { id: "3", name: "Docker Masterclass", deliveryType: "instructor-led", batches: 4, lastUpdated: "Jan 8, 2024", status: "active", chapters: [], settings: { ...defaultSettings, deliveryType: 'instructor-led' }, moderation: 'approved' },
  { id: "4", name: "Terraform for AWS", deliveryType: "self-paced", batches: 2, lastUpdated: "Jan 5, 2024", status: "draft", chapters: [], settings: { ...defaultSettings, labPolicy: 'hourly-wallet', labWalletHours: 30 }, owner: { type: 'trainer', id: 't-2', name: 'Maya Patel' }, moderation: 'pending-review' },
  { id: "5", name: "Azure DevOps Pipeline", deliveryType: "instructor-led", batches: 1, lastUpdated: "Dec 28, 2023", status: "archived", chapters: [], settings: { ...defaultSettings, deliveryType: 'instructor-led' }, moderation: 'approved' },
  { id: "6", name: "Linux Server Hardening", deliveryType: "self-paced", category: "Cyber Security", description: "Self-paced hands-on Linux hardening with CTF scenarios.", batches: 1, lastUpdated: "Mar 1, 2024", status: "active", settings: { ...defaultSettings, labPolicy: 'unlimited-during-validity', visibility: 'marketplace' }, owner: { type: 'customer', id: 'c-1', name: 'SecureWorks Academy' }, moderation: 'approved', chapters: [
    { id: "ch-sec-1", title: "Recon & Hardening Basics", lessons: [
      { id: "l-sec-1", title: "Threat landscape overview", type: "reading", duration: "10 min", body: "Cybersecurity hardening starts with knowing what you're defending against..." },
      { id: "l-sec-2", title: "SSH lockdown walkthrough", type: "video", duration: "18 min" },
      { id: "l-sec-3", title: "Persistent practice host", type: "lab", duration: "open", lab: { templateId: 'tpl-1', templateName: 'Ubuntu 22.04 Hardening Box', mode: 'persistent' } },
      { id: "l-sec-4", title: "CTF: First foothold", type: "ctf-scenario", duration: "60 min", lab: { templateId: 'tpl-1', templateName: 'CTF Scenario Box', mode: 'on-demand', estimatedHours: 2 } },
    ]},
  ]},
  { id: "7", name: "GenAI Prompt Engineering", deliveryType: "hybrid", category: "AI/ML", description: "Hybrid weekly live + self-paced labs.", batches: 1, lastUpdated: "Feb 10, 2024", status: "active", chapters: [], settings: { ...defaultSettings, deliveryType: 'hybrid' }, moderation: 'approved' },
  { id: "8", name: "Python for Data Science", deliveryType: "self-paced", category: "Coding", description: "Self-paced Python journey with Judge0 coding exercises.", batches: 1, lastUpdated: "Feb 1, 2024", status: "active", settings: { ...defaultSettings, labPolicy: 'hourly-wallet', labWalletHours: 15 }, owner: { type: 'customer', id: 'c-2', name: 'DataPath' }, moderation: 'approved', chapters: [
    { id: "ch-py-1", title: "Python Foundations", lessons: [
      { id: "l-py-1", title: "Welcome video", type: "video", duration: "8 min" },
      { id: "l-py-2", title: "Reading: variables & types", type: "reading", duration: "12 min" },
      { id: "l-py-3", title: "Exercise: FizzBuzz", type: "code-exercise", duration: "20 min", language: "python" },
      { id: "l-py-4", title: "Quiz: Module 1", type: "quiz", duration: "10 min" },
    ]},
    { id: "ch-py-2", title: "NumPy & Pandas Lab", lessons: [
      { id: "l-py-5", title: "On-demand Jupyter Lab", type: "lab", duration: "open", lab: { templateId: 'tpl-3', templateName: 'Jupyter Sandbox', mode: 'on-demand', estimatedHours: 2 } },
      { id: "l-py-6", title: "Final exam", type: "exam", duration: "45 min", proctored: true },
    ]},
  ]},
  // DEMO courses
];

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: initialCourses,

  addCourse: (course) => {
    const id = Date.now().toString();
    const newCourse: Course = {
      ...course,
      id,
      batches: 0,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      chapters: [],
      settings: course.settings ?? { ...defaultSettings, deliveryType: (course.deliveryType as any) ?? 'self-paced' },
      moderation: course.moderation ?? 'draft',
    };
    set((state) => ({ courses: [...state.courses, newCourse] }));
    return id;
  },

  getCourse: (id) => get().courses.find(c => c.id === id),

  updateCourse: (id, updates) => {
    set((state) => ({ courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c) }));
  },

  updateSettings: (id, updates) => {
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === id ? { ...c, settings: { ...(c.settings ?? defaultSettings), ...updates } } : c
      ),
    }));
  },

  submitForReview: (id) => {
    set((state) => ({ courses: state.courses.map(c => c.id === id ? { ...c, moderation: 'pending-review' as const } : c) }));
  },

  setModeration: (id, status) => {
    set((state) => ({ courses: state.courses.map(c => c.id === id ? { ...c, moderation: status } : c) }));
  },

  addChapter: (courseId, title) => {
    const chapterId = `ch-${Date.now()}`;
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId ? { ...c, chapters: [...c.chapters, { id: chapterId, title, lessons: [] }] } : c
      )
    }));
  },

  updateChapter: (courseId, chapterId, title) => {
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId
          ? { ...c, chapters: c.chapters.map(ch => ch.id === chapterId ? { ...ch, title } : ch) }
          : c
      )
    }));
  },

  deleteChapter: (courseId, chapterId) => {
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId ? { ...c, chapters: c.chapters.filter(ch => ch.id !== chapterId) } : c
      )
    }));
  },

  addLesson: (courseId, chapterId, lesson) => {
    const lessonId = `l-${Date.now()}`;
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId
          ? { ...c, chapters: c.chapters.map(ch => ch.id === chapterId ? { ...ch, lessons: [...ch.lessons, { ...lesson, id: lessonId }] } : ch) }
          : c
      )
    }));
  },

  updateLesson: (courseId, chapterId, lessonId, updates) => {
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId
          ? { ...c, chapters: c.chapters.map(ch => ch.id === chapterId ? { ...ch, lessons: ch.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l) } : ch) }
          : c
      )
    }));
  },

  deleteLesson: (courseId, chapterId, lessonId) => {
    set((state) => ({
      courses: state.courses.map(c =>
        c.id === courseId
          ? { ...c, chapters: c.chapters.map(ch => ch.id === chapterId ? { ...ch, lessons: ch.lessons.filter(l => l.id !== lessonId) } : ch) }
          : c
      )
    }));
  },
}));

export const DEFAULT_COURSE_SETTINGS = defaultSettings;
