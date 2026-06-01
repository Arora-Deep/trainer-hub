import { create } from 'zustand';

export interface PersistentVMRef {
  vmId: string;
  templateName: string;
  attachedToLessonId: string;
  status: 'provisioning' | 'ready' | 'suspended';
}

export interface OnDemandSession {
  id: string;
  lessonId: string;
  startedAt: string;
  durationHours: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  validUntil: string; // ISO date
  // Lab wallet: undefined means "unlimited during validity"
  walletHoursTotal?: number;
  walletHoursUsed: number;
  persistentVMs: PersistentVMRef[];
  sessions: OnDemandSession[];
  completedLessonIds: string[];
}

interface EnrollmentStore {
  enrollments: Enrollment[];
  getForCourse: (studentId: string, courseId: string) => Enrollment | undefined;
  enroll: (studentId: string, courseId: string, opts: { validityDays?: number; walletHours?: number }) => Enrollment;
  markComplete: (enrollmentId: string, lessonId: string) => void;
  consumeHours: (enrollmentId: string, lessonId: string, hours: number) => boolean;
  attachPersistentVM: (enrollmentId: string, vm: PersistentVMRef) => void;
  walletRemaining: (e: Enrollment) => number | null; // null = unlimited
}

const today = new Date();
const addDays = (d: number) => new Date(today.getTime() + d * 86400000).toISOString();

const initial: Enrollment[] = [
  {
    id: 'en-1',
    studentId: 'me',
    courseId: '6',
    enrolledAt: today.toISOString(),
    validUntil: addDays(78),
    walletHoursTotal: undefined,
    walletHoursUsed: 0,
    persistentVMs: [
      { vmId: 'pvm-1', templateName: 'Ubuntu 22.04 Hardening Box', attachedToLessonId: 'l-sec-3', status: 'ready' },
    ],
    sessions: [],
    completedLessonIds: ['l-sec-1'],
  },
  {
    id: 'en-2',
    studentId: 'me',
    courseId: '8',
    enrolledAt: today.toISOString(),
    validUntil: addDays(45),
    walletHoursTotal: 15,
    walletHoursUsed: 4.5,
    persistentVMs: [],
    sessions: [],
    completedLessonIds: ['l-py-1', 'l-py-2'],
  },
];

export const useEnrollmentStore = create<EnrollmentStore>((set, get) => ({
  enrollments: initial,

  getForCourse: (studentId, courseId) =>
    get().enrollments.find(e => e.studentId === studentId && e.courseId === courseId),

  enroll: (studentId, courseId, opts) => {
    const e: Enrollment = {
      id: `en-${Date.now()}`,
      studentId,
      courseId,
      enrolledAt: new Date().toISOString(),
      validUntil: addDays(opts.validityDays ?? 90),
      walletHoursTotal: opts.walletHours,
      walletHoursUsed: 0,
      persistentVMs: [],
      sessions: [],
      completedLessonIds: [],
    };
    set(s => ({ enrollments: [...s.enrollments, e] }));
    return e;
  },

  markComplete: (enrollmentId, lessonId) => {
    set(s => ({
      enrollments: s.enrollments.map(e =>
        e.id === enrollmentId && !e.completedLessonIds.includes(lessonId)
          ? { ...e, completedLessonIds: [...e.completedLessonIds, lessonId] }
          : e
      ),
    }));
  },

  consumeHours: (enrollmentId, lessonId, hours) => {
    const e = get().enrollments.find(x => x.id === enrollmentId);
    if (!e) return false;
    if (e.walletHoursTotal !== undefined && e.walletHoursUsed + hours > e.walletHoursTotal) return false;
    set(s => ({
      enrollments: s.enrollments.map(en =>
        en.id === enrollmentId
          ? {
              ...en,
              walletHoursUsed: en.walletHoursUsed + hours,
              sessions: [...en.sessions, { id: `s-${Date.now()}`, lessonId, startedAt: new Date().toISOString(), durationHours: hours }],
            }
          : en
      ),
    }));
    return true;
  },

  attachPersistentVM: (enrollmentId, vm) => {
    set(s => ({
      enrollments: s.enrollments.map(e =>
        e.id === enrollmentId ? { ...e, persistentVMs: [...e.persistentVMs, vm] } : e
      ),
    }));
  },

  walletRemaining: (e) => {
    if (e.walletHoursTotal === undefined) return null;
    return Math.max(0, e.walletHoursTotal - e.walletHoursUsed);
  },
}));
