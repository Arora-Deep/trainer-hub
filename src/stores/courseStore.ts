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

const initialCourses: Course[] = [
  { 
    id: "1", 
    name: "AWS Solutions Architect Professional", 
    deliveryType: "instructor-led", 
    batches: 5, 
    lastUpdated: "Jan 12, 2024", 
    status: "active",
    chapters: [
      {
        id: "ch1",
        title: "Introduction to AWS",
        lessons: [
          { id: "l1", title: "What is AWS?", type: "video", duration: "15 min" },
          { id: "l2", title: "AWS Global Infrastructure", type: "video", duration: "20 min" },
        ]
      },
      {
        id: "ch2",
        title: "Compute Services",
        lessons: [
          { id: "l3", title: "EC2 Overview", type: "video", duration: "25 min" },
          { id: "l4", title: "Lambda Functions", type: "video", duration: "30 min" },
          { id: "l5", title: "EC2 Hands-on Lab", type: "assignment", duration: "45 min" },
        ]
      }
    ]
  },
  { id: "2", name: "Kubernetes Fundamentals", deliveryType: "self-paced", batches: 3, lastUpdated: "Jan 10, 2024", status: "active", chapters: [] },
  { id: "3", name: "Docker Masterclass", deliveryType: "instructor-led", batches: 4, lastUpdated: "Jan 8, 2024", status: "active", chapters: [] },
  { id: "4", name: "Terraform for AWS", deliveryType: "self-paced", batches: 2, lastUpdated: "Jan 5, 2024", status: "draft", chapters: [] },
  { id: "5", name: "Azure DevOps Pipeline", deliveryType: "instructor-led", batches: 1, lastUpdated: "Dec 28, 2023", status: "archived", chapters: [] },
  { id: "6", name: "Linux Administration", deliveryType: "self-paced", batches: 6, lastUpdated: "Dec 20, 2023", status: "active", chapters: [] },
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
