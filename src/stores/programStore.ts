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

const initialPrograms: Program[] = [];

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
