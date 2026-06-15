import { create } from "zustand";

export type MeetingStatus = "scheduled" | "live" | "ended";

export interface MeetingRecording {
  id: string;
  title: string;
  url: string;
  durationMins: number;
  recordedAt: string;
  sizeMb: number;
}

export interface MeetingAttendee {
  id: string;
  name: string;
  email: string;
  role: "moderator" | "viewer";
  joinedAt?: string;
  leftAt?: string;
}

export interface Meeting {
  id: string;
  title: string;
  batchId?: string;
  batchName?: string;
  trainerId?: string;
  trainerName?: string;
  scheduledAt: string; // ISO
  durationMins: number;
  status: MeetingStatus;
  joinUrl: string;
  welcome?: string;
  record: boolean;
  muteOnJoin: boolean;
  waitingRoom: boolean;
  maxAttendees: number;
  attendees: MeetingAttendee[];
  recordings: MeetingRecording[];
}

const now = new Date();
const offset = (days: number, hours = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(10 + hours, 0, 0, 0);
  return d.toISOString();
};

const initial: Meeting[] = [
  {
    id: "m-1",
    title: "Java Fundamentals — Day 14 Live Session",
    batchId: "10", batchName: "Java Fundamentals — Cohort 24",
    trainerId: "t-1", trainerName: "Rahul Verma",
    scheduledAt: new Date().toISOString(),
    durationMins: 90,
    status: "live",
    joinUrl: "#bbb-join-pending",
    welcome: "Welcome! Today: Collections deep dive.",
    record: true, muteOnJoin: true, waitingRoom: false,
    maxAttendees: 50,
    attendees: [
      { id: "a1", name: "Rahul Verma", email: "rahul@cloudadda.com", role: "moderator", joinedAt: "10:00" },
      { id: "a2", name: "Alice K.", email: "alice@example.com", role: "viewer", joinedAt: "10:02" },
      { id: "a3", name: "Vivek M.", email: "vivek@example.com", role: "viewer", joinedAt: "10:01" },
    ],
    recordings: [],
  },
  {
    id: "m-2",
    title: "Python Fundamentals — Pandas Workshop",
    batchId: "11", batchName: "Python Fundamentals — Cohort 14",
    trainerId: "t-2", trainerName: "Priya Nair",
    scheduledAt: offset(1, 0),
    durationMins: 120,
    status: "scheduled",
    joinUrl: "#bbb-join-pending",
    record: true, muteOnJoin: true, waitingRoom: true,
    maxAttendees: 40,
    attendees: [],
    recordings: [],
  },
  {
    id: "m-3",
    title: "AWS Solutions Architect — Office Hours",
    batchId: "1", batchName: "AWS Solutions Architect - Batch 12",
    trainerId: "t-3", trainerName: "John Smith",
    scheduledAt: offset(2, 4),
    durationMins: 60,
    status: "scheduled",
    joinUrl: "#bbb-join-pending",
    record: false, muteOnJoin: false, waitingRoom: false,
    maxAttendees: 30,
    attendees: [],
    recordings: [],
  },
  {
    id: "m-4",
    title: "Java Fundamentals — Day 12 Recording",
    batchId: "10", batchName: "Java Fundamentals — Cohort 24",
    trainerId: "t-1", trainerName: "Rahul Verma",
    scheduledAt: offset(-2),
    durationMins: 90,
    status: "ended",
    joinUrl: "#bbb-join-pending",
    record: true, muteOnJoin: true, waitingRoom: false,
    maxAttendees: 50,
    attendees: [],
    recordings: [
      { id: "r1", title: "Full session", url: "#", durationMins: 88, recordedAt: offset(-2), sizeMb: 420 },
    ],
  },
  {
    id: "m-5",
    title: "Kubernetes Fundamentals — Networking Deep Dive",
    batchId: "2", batchName: "Kubernetes Fundamentals - Batch 8",
    trainerId: "t-4", trainerName: "Jane Doe",
    scheduledAt: offset(-5),
    durationMins: 75,
    status: "ended",
    joinUrl: "#bbb-join-pending",
    record: true, muteOnJoin: true, waitingRoom: false,
    maxAttendees: 35,
    attendees: [],
    recordings: [
      { id: "r2", title: "Full session", url: "#", durationMins: 74, recordedAt: offset(-5), sizeMb: 340 },
    ],
  },
];

interface MeetingStore {
  meetings: Meeting[];
  addMeeting: (m: Omit<Meeting, "id" | "status" | "joinUrl" | "attendees" | "recordings">) => string;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getMeeting: (id: string) => Meeting | undefined;
  getMeetingsByBatch: (batchId: string) => Meeting[];
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: initial,
  addMeeting: (m) => {
    const id = `m-${Date.now()}`;
    const meeting: Meeting = {
      ...m,
      id,
      status: new Date(m.scheduledAt) > new Date() ? "scheduled" : "ended",
      joinUrl: "#bbb-join-pending",
      attendees: [],
      recordings: [],
    };
    set((s) => ({ meetings: [meeting, ...s.meetings] }));
    return id;
  },
  updateMeeting: (id, updates) =>
    set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
  deleteMeeting: (id) =>
    set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),
  getMeeting: (id) => get().meetings.find((m) => m.id === id),
  getMeetingsByBatch: (batchId) => get().meetings.filter((m) => m.batchId === batchId),
}));
