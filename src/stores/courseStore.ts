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
  | 'game-based-learning';

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
  { id: "10", name: "Java Fundamentals", deliveryType: "instructor-led", category: "Programming", description: "VILT Java fundamentals bootcamp with daily live classes and dedicated lab VMs.", batches: 1, lastUpdated: "May 20, 2026", status: "active", settings: { ...defaultSettings, deliveryType: 'instructor-led' }, owner: { type: 'trainer', id: 't-3', name: 'Rahul Verma' }, moderation: 'approved', chapters: [] },
  { id: "11", name: "Python Fundamentals", deliveryType: "self-paced", category: "Programming", description: "Self-paced Python fundamentals with persistent learner labs cloned from a trainer golden template.", batches: 1, lastUpdated: "Apr 25, 2026", status: "active", settings: { ...defaultSettings, deliveryType: 'self-paced', labPolicy: 'unlimited-during-validity', visibility: 'customer' }, owner: { type: 'trainer', id: 't-4', name: 'Neha Kapoor' }, moderation: 'approved', chapters: [] },
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
