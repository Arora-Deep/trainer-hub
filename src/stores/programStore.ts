import { create } from 'zustand';

export interface ProgramCourse {
  id: string;
  name: string;
  order: number;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  courses: ProgramCourse[];
  duration: string;
  enrolled: number;
  status: 'active' | 'draft' | 'archived';
  certification: boolean;
  certificationId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  outcomes: string[];
  lastUpdated: string;
  createdAt: string;
}

interface ProgramStore {
  programs: Program[];
  addProgram: (program: Omit<Program, 'id' | 'enrolled' | 'lastUpdated' | 'createdAt'>) => Program;
  getProgram: (id: string) => Program | undefined;
  updateProgram: (id: string, updates: Partial<Program>) => void;
  deleteProgram: (id: string) => void;
  addCourseToProgram: (programId: string, course: Omit<ProgramCourse, 'order'>) => void;
  removeCourseFromProgram: (programId: string, courseId: string) => void;
  reorderCourses: (programId: string, courses: ProgramCourse[]) => void;
}

const initialPrograms: Program[] = [
  {
    id: "1",
    name: "Full Stack Development Bootcamp",
    description: "Comprehensive program covering front-end, back-end, and DevOps fundamentals",
    courses: [
      { id: "c1", name: "HTML & CSS Fundamentals", order: 1 },
      { id: "c2", name: "JavaScript Essentials", order: 2 },
      { id: "c3", name: "React Development", order: 3 },
      { id: "c4", name: "Node.js & Express", order: 4 },
      { id: "c5", name: "Database Design", order: 5 },
      { id: "c6", name: "API Development", order: 6 },
      { id: "c7", name: "DevOps Basics", order: 7 },
      { id: "c8", name: "Capstone Project", order: 8 },
    ],
    duration: "16 weeks",
    enrolled: 156,
    status: "active",
    certification: true,
    certificationId: "2",
    difficulty: "intermediate",
    prerequisites: ["Basic programming knowledge", "Computer fundamentals"],
    outcomes: ["Build full-stack applications", "Deploy to cloud", "Work with databases"],
    lastUpdated: "2024-01-10",
    createdAt: "2023-06-15",
  },
  {
    id: "2",
    name: "Data Science Fundamentals",
    description: "Learn data analysis, visualization, and machine learning basics",
    courses: [
      { id: "c9", name: "Python for Data Science", order: 1 },
      { id: "c10", name: "Statistics & Probability", order: 2 },
      { id: "c11", name: "Data Visualization", order: 3 },
      { id: "c12", name: "Machine Learning Intro", order: 4 },
      { id: "c13", name: "SQL for Analytics", order: 5 },
      { id: "c14", name: "Data Projects", order: 6 },
    ],
    duration: "12 weeks",
    enrolled: 89,
    status: "active",
    certification: true,
    certificationId: "3",
    difficulty: "intermediate",
    prerequisites: ["Basic math", "Programming basics"],
    outcomes: ["Analyze datasets", "Create visualizations", "Build ML models"],
    lastUpdated: "2024-01-08",
    createdAt: "2023-07-20",
  },
  {
    id: "3",
    name: "Cloud Architecture Certificate",
    description: "Master cloud infrastructure and architecture on AWS",
    courses: [
      { id: "c15", name: "Cloud Fundamentals", order: 1 },
      { id: "c16", name: "AWS Core Services", order: 2 },
      { id: "c17", name: "Networking & Security", order: 3 },
      { id: "c18", name: "Serverless Architecture", order: 4 },
      { id: "c19", name: "Cloud Projects", order: 5 },
    ],
    duration: "10 weeks",
    enrolled: 45,
    status: "draft",
    certification: true,
    certificationId: "1",
    difficulty: "advanced",
    prerequisites: ["Linux basics", "Networking fundamentals"],
    outcomes: ["Design cloud solutions", "Implement AWS services", "Optimize costs"],
    lastUpdated: "2024-01-05",
    createdAt: "2023-09-01",
  },
  {
    id: "4",
    name: "DevOps Engineering Path",
    description: "Learn CI/CD, containerization, and infrastructure as code",
    courses: [
      { id: "c20", name: "Linux Administration", order: 1 },
      { id: "c21", name: "Docker & Containers", order: 2 },
      { id: "c22", name: "Kubernetes", order: 3 },
      { id: "c23", name: "CI/CD Pipelines", order: 4 },
      { id: "c24", name: "Infrastructure as Code", order: 5 },
      { id: "c25", name: "Monitoring & Logging", order: 6 },
      { id: "c26", name: "DevOps Projects", order: 7 },
    ],
    duration: "14 weeks",
    enrolled: 72,
    status: "active",
    certification: true,
    certificationId: "4",
    difficulty: "advanced",
    prerequisites: ["Programming experience", "Cloud basics"],
    outcomes: ["Build CI/CD pipelines", "Manage containers", "Automate infrastructure"],
    lastUpdated: "2024-01-03",
    createdAt: "2023-08-10",
  },
  {
    id: "5",
    name: "Cybersecurity Essentials",
    description: "Introduction to cybersecurity principles and practices",
    courses: [
      { id: "c27", name: "Security Fundamentals", order: 1 },
      { id: "c28", name: "Network Security", order: 2 },
      { id: "c29", name: "Ethical Hacking Basics", order: 3 },
      { id: "c30", name: "Security Tools", order: 4 },
    ],
    duration: "8 weeks",
    enrolled: 0,
    status: "archived",
    certification: true,
    certificationId: "5",
    difficulty: "beginner",
    prerequisites: ["Networking basics"],
    outcomes: ["Identify vulnerabilities", "Implement security measures", "Use security tools"],
    lastUpdated: "2023-12-15",
    createdAt: "2023-05-01",
  },
];

export const useProgramStore = create<ProgramStore>((set, get) => ({
  programs: initialPrograms,

  addProgram: (program) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgram: Program = {
      ...program,
      id: Date.now().toString(),
      enrolled: 0,
      lastUpdated: today,
      createdAt: today,
    };
    set((state) => ({
      programs: [...state.programs, newProgram],
    }));
    return newProgram;
  },

  getProgram: (id) => {
    return get().programs.find((program) => program.id === id);
  },

  updateProgram: (id, updates) => {
    set((state) => ({
      programs: state.programs.map((program) =>
        program.id === id
          ? { ...program, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
          : program
      ),
    }));
  },

  deleteProgram: (id) => {
    set((state) => ({
      programs: state.programs.filter((program) => program.id !== id),
    }));
  },

  addCourseToProgram: (programId, course) => {
    set((state) => ({
      programs: state.programs.map((program) => {
        if (program.id === programId) {
          const maxOrder = Math.max(...program.courses.map((c) => c.order), 0);
          return {
            ...program,
            courses: [...program.courses, { ...course, order: maxOrder + 1 }],
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return program;
      }),
    }));
  },

  removeCourseFromProgram: (programId, courseId) => {
    set((state) => ({
      programs: state.programs.map((program) => {
        if (program.id === programId) {
          return {
            ...program,
            courses: program.courses.filter((c) => c.id !== courseId),
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return program;
      }),
    }));
  },

  reorderCourses: (programId, courses) => {
    set((state) => ({
      programs: state.programs.map((program) =>
        program.id === programId
          ? { ...program, courses, lastUpdated: new Date().toISOString().split('T')[0] }
          : program
      ),
    }));
  },
}));
