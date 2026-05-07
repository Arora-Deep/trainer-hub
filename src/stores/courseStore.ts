import { create } from 'zustand';

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  duration: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  deliveryType: string;
  batches: number;
  lastUpdated: string;
  status: string;
  category?: string;
  description?: string;
  chapters: Chapter[];
}

interface CourseStore {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'batches' | 'lastUpdated' | 'chapters'>) => string;
  getCourse: (id: string) => Course | undefined;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  addChapter: (courseId: string, title: string) => void;
  updateChapter: (courseId: string, chapterId: string, title: string) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  addLesson: (courseId: string, chapterId: string, lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (courseId: string, chapterId: string, lessonId: string, updates: Partial<Lesson>) => void;
  deleteLesson: (courseId: string, chapterId: string, lessonId: string) => void;
}

const initialCourses: Course[] = [];

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
    };
    set((state) => ({ courses: [...state.courses, newCourse] }));
    return id;
  },
  
  getCourse: (id) => {
    return get().courses.find(c => c.id === id);
  },
  
  updateCourse: (id, updates) => {
    set((state) => ({
      courses: state.courses.map(c => c.id === id ? { ...c, ...updates } : c)
    }));
  },
  
  addChapter: (courseId, title) => {
    const chapterId = `ch-${Date.now()}`;
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { ...c, chapters: [...c.chapters, { id: chapterId, title, lessons: [] }] }
          : c
      )
    }));
  },
  
  updateChapter: (courseId, chapterId, title) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { 
              ...c, 
              chapters: c.chapters.map(ch => 
                ch.id === chapterId ? { ...ch, title } : ch
              )
            }
          : c
      )
    }));
  },
  
  deleteChapter: (courseId, chapterId) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { ...c, chapters: c.chapters.filter(ch => ch.id !== chapterId) }
          : c
      )
    }));
  },
  
  addLesson: (courseId, chapterId, lesson) => {
    const lessonId = `l-${Date.now()}`;
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { 
              ...c, 
              chapters: c.chapters.map(ch => 
                ch.id === chapterId 
                  ? { ...ch, lessons: [...ch.lessons, { ...lesson, id: lessonId }] }
                  : ch
              )
            }
          : c
      )
    }));
  },
  
  updateLesson: (courseId, chapterId, lessonId, updates) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { 
              ...c, 
              chapters: c.chapters.map(ch => 
                ch.id === chapterId 
                  ? { 
                      ...ch, 
                      lessons: ch.lessons.map(l => 
                        l.id === lessonId ? { ...l, ...updates } : l
                      )
                    }
                  : ch
              )
            }
          : c
      )
    }));
  },
  
  deleteLesson: (courseId, chapterId, lessonId) => {
    set((state) => ({
      courses: state.courses.map(c => 
        c.id === courseId 
          ? { 
              ...c, 
              chapters: c.chapters.map(ch => 
                ch.id === chapterId 
                  ? { ...ch, lessons: ch.lessons.filter(l => l.id !== lessonId) }
                  : ch
              )
            }
          : c
      )
    }));
  },
}));
