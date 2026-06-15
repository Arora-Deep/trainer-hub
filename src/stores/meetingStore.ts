import { create } from "zustand";

export type MeetingKind = "batch-session" | "ad-hoc" | "office-hours";
export type MeetingStatus = "draft" | "scheduled" | "live" | "ended" | "cancelled";
export type MeetingVisibility = "batch" | "invitees" | "public-in-company";

export interface MeetingRecording {
  id: string;
  title: string;
  url: string;
  durationMins: number;
  recordedAt: string;
  sizeMb: number;
  thumbnail?: string;
}

export interface AttendanceRecord {
  studentId: string;
  name: string;
  email: string;
  joinedAt?: string;
  leftAt?: string;
  durationMins: number;
  presentPct: number;
  status: "present" | "late" | "left-early" | "absent";
}

export interface EngagementRecord {
  studentId: string;
  name: string;
  talkTimeSec: number;
  chatMessages: number;
  handRaises: number;
  pollResponses: number;
  cameraOnPct: number;
  score: number;
  tier: "low" | "medium" | "high";
}

export interface MeetingRecurrence {
  freq: "weekly";
  byDay: number[]; // 0=Sun..6=Sat
  until: string; // ISO date
}

export interface MeetingSettings {
  record: boolean;
  muteOnJoin: boolean;
  waitingRoom: boolean;
  allowChat: boolean;
  allowScreenShare: boolean;
  raiseHand: boolean;
  maxAttendees: number;
  lockSettings: boolean;
}

export interface MeetingBBB {
  meetingId: string;
  joinUrlMock: string;
  moderatorPwMock: string;
  attendeePwMock: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  kind: MeetingKind;
  batchId?: string;
  batchName?: string;
  courseId?: string;
  lessonId?: string;
  trainerId: string;
  trainerName: string;
  coHostIds: string[];
  scheduledAt: string; // ISO
  durationMins: number;
  timezone: string;
  status: MeetingStatus;
  visibility: MeetingVisibility;
  inviteeIds: string[];
  recurrence?: MeetingRecurrence;
  bbb: MeetingBBB;
  settings: MeetingSettings;
  agenda: string[];
  prerequisites: string[];
  materials: { id: string; name: string; url: string }[];
  attendance: AttendanceRecord[];
  engagement: EngagementRecord[];
  recordings: MeetingRecording[];
  createdAt: string;
  createdBy: string;
  /** Total expected invitees (for absence calc) */
  totalInvited: number;
}

// ---------- helpers ----------
const now = new Date();
const offset = (days: number, hour = 10, min = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const defaultSettings = (over: Partial<MeetingSettings> = {}): MeetingSettings => ({
  record: true,
  muteOnJoin: true,
  waitingRoom: false,
  allowChat: true,
  allowScreenShare: true,
  raiseHand: true,
  maxAttendees: 50,
  lockSettings: false,
  ...over,
});

const mockBBB = (id: string): MeetingBBB => ({
  meetingId: `bbb-${id}`,
  joinUrlMock: `#bbb-join-${id}`,
  moderatorPwMock: "mod-pending",
  attendeePwMock: "att-pending",
});

// Deterministic pseudo-random from string
function seedRand(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

const SAMPLE_STUDENTS = [
  { id: "s-1", name: "Alice Johnson", email: "alice@example.com" },
  { id: "s-2", name: "Bob Williams", email: "bob@example.com" },
  { id: "s-3", name: "Carol Davis", email: "carol@example.com" },
  { id: "s-4", name: "David Brown", email: "david@example.com" },
  { id: "s-5", name: "Eva Martinez", email: "eva@example.com" },
  { id: "s-6", name: "Frank Lee", email: "frank@example.com" },
  { id: "s-7", name: "Grace Kim", email: "grace@example.com" },
  { id: "s-8", name: "Henry Wang", email: "henry@example.com" },
  { id: "s-9", name: "Iris Patel", email: "iris@example.com" },
  { id: "s-10", name: "Jay Singh", email: "jay@example.com" },
  { id: "s-11", name: "Kira Roy", email: "kira@example.com" },
  { id: "s-12", name: "Liam Cohen", email: "liam@example.com" },
  // Student persona used across student portal
  { id: "current-student", name: "Sarah Ahmed", email: "sarah@example.com" },
];

export function generateAttendance(meeting: Meeting): AttendanceRecord[] {
  const rand = seedRand(meeting.id + ":att");
  const pool = SAMPLE_STUDENTS.slice(0, Math.min(meeting.totalInvited || 12, SAMPLE_STUDENTS.length));
  const start = new Date(meeting.scheduledAt);
  return pool.map((s) => {
    const r = rand();
    // 78% present, 10% late, 7% left early, 5% absent
    let status: AttendanceRecord["status"] = "present";
    let lateMin = 0;
    let earlyMin = 0;
    if (r > 0.95) status = "absent";
    else if (r > 0.88) { status = "left-early"; earlyMin = Math.floor(rand() * 25) + 10; }
    else if (r > 0.78) { status = "late"; lateMin = Math.floor(rand() * 15) + 3; }

    if (status === "absent") {
      return {
        studentId: s.id, name: s.name, email: s.email,
        durationMins: 0, presentPct: 0, status,
      };
    }
    const joinTime = new Date(start.getTime() + lateMin * 60_000);
    const leftAt = new Date(start.getTime() + (meeting.durationMins - earlyMin) * 60_000);
    const durationMins = meeting.durationMins - lateMin - earlyMin;
    const presentPct = Math.round((durationMins / meeting.durationMins) * 100);
    return {
      studentId: s.id, name: s.name, email: s.email,
      joinedAt: joinTime.toISOString(),
      leftAt: leftAt.toISOString(),
      durationMins, presentPct, status,
    };
  });
}

export function generateEngagement(meeting: Meeting, att: AttendanceRecord[]): EngagementRecord[] {
  const rand = seedRand(meeting.id + ":eng");
  return att.map((a) => {
    if (a.status === "absent") {
      return {
        studentId: a.studentId, name: a.name,
        talkTimeSec: 0, chatMessages: 0, handRaises: 0,
        pollResponses: 0, cameraOnPct: 0, score: 0, tier: "low" as const,
      };
    }
    const talk = Math.floor(rand() * 240);
    const chat = Math.floor(rand() * 18);
    const hands = Math.floor(rand() * 4);
    const polls = Math.floor(rand() * 5);
    const cam = Math.floor(rand() * 100);
    const presence = a.presentPct;
    const raw =
      Math.min(100, talk / 2) * 0.25 +
      Math.min(100, chat * 8) * 0.2 +
      Math.min(100, hands * 25) * 0.1 +
      Math.min(100, polls * 20) * 0.15 +
      cam * 0.15 +
      presence * 0.15;
    const score = Math.round(raw);
    const tier: EngagementRecord["tier"] = score >= 70 ? "high" : score >= 40 ? "medium" : "low";
    return {
      studentId: a.studentId, name: a.name,
      talkTimeSec: talk, chatMessages: chat, handRaises: hands,
      pollResponses: polls, cameraOnPct: cam, score, tier,
    };
  });
}

function buildSeed(): Meeting[] {
  const seed: Omit<Meeting, "attendance" | "engagement">[] = [
    {
      id: "m-1",
      title: "AWS VPC Deep Dive — Day 14",
      description: "Networking deep-dive: VPC, subnets, NAT, routing.",
      kind: "batch-session",
      batchId: "1", batchName: "AWS Solutions Architect - Batch 12",
      courseId: "1", lessonId: undefined,
      trainerId: "t-1", trainerName: "James Wilson", coHostIds: [],
      scheduledAt: offset(0, new Date().getHours(), 0),
      durationMins: 90,
      timezone: "Asia/Kolkata",
      status: "live",
      visibility: "batch", inviteeIds: [],
      bbb: mockBBB("m-1"),
      settings: defaultSettings({ record: true, waitingRoom: false }),
      agenda: ["Recap networking", "VPC architecture", "Demo: build a VPC", "Q&A"],
      prerequisites: ["Read networking basics chapter"],
      materials: [{ id: "mat-1", name: "VPC Slides.pdf", url: "#" }],
      recordings: [],
      createdAt: offset(-7), createdBy: "admin",
      totalInvited: 12,
    },
    {
      id: "m-2",
      title: "Python Fundamentals — Pandas Workshop",
      description: "Hands-on with DataFrames.",
      kind: "batch-session",
      batchId: "11", batchName: "Python Fundamentals — Cohort 14",
      trainerId: "t-2", trainerName: "Priya Nair", coHostIds: [],
      scheduledAt: offset(1, 10),
      durationMins: 120, timezone: "Asia/Kolkata",
      status: "scheduled", visibility: "batch", inviteeIds: [],
      bbb: mockBBB("m-2"),
      settings: defaultSettings({ waitingRoom: true, maxAttendees: 40 }),
      agenda: ["DataFrames", "Join & group", "Real dataset"],
      prerequisites: [], materials: [], recordings: [],
      createdAt: offset(-3), createdBy: "admin", totalInvited: 14,
    },
    {
      id: "m-3",
      title: "Office Hours — AWS Track",
      description: "Open Q&A.",
      kind: "office-hours",
      trainerId: "t-1", trainerName: "James Wilson", coHostIds: [],
      scheduledAt: offset(2, 16),
      durationMins: 60, timezone: "Asia/Kolkata",
      status: "scheduled", visibility: "invitees",
      inviteeIds: ["current-student", "s-1", "s-2", "s-3"],
      bbb: mockBBB("m-3"),
      settings: defaultSettings({ maxAttendees: 20, waitingRoom: true }),
      agenda: ["Open Q&A"], prerequisites: [], materials: [], recordings: [],
      createdAt: offset(-1), createdBy: "admin", totalInvited: 4,
    },
    {
      id: "m-4",
      title: "AWS Batch 12 — Day 12 Recording",
      description: "EC2 + IAM walkthrough.",
      kind: "batch-session",
      batchId: "1", batchName: "AWS Solutions Architect - Batch 12",
      courseId: "1",
      trainerId: "t-1", trainerName: "James Wilson", coHostIds: [],
      scheduledAt: offset(-2, 10),
      durationMins: 90, timezone: "Asia/Kolkata",
      status: "ended", visibility: "batch", inviteeIds: [],
      bbb: mockBBB("m-4"),
      settings: defaultSettings({ record: true }),
      agenda: ["EC2 lifecycle", "IAM policies"],
      prerequisites: [], materials: [],
      recordings: [{ id: "r1", title: "Full session", url: "#", durationMins: 88, recordedAt: offset(-2, 12), sizeMb: 420 }],
      createdAt: offset(-9), createdBy: "admin", totalInvited: 12,
    },
    {
      id: "m-5",
      title: "Kubernetes Networking Deep Dive",
      description: "Pod-to-pod, services, CNI.",
      kind: "batch-session",
      batchId: "2", batchName: "Kubernetes Fundamentals - Batch 8",
      trainerId: "t-4", trainerName: "Sarah Chen", coHostIds: [],
      scheduledAt: offset(-5, 10),
      durationMins: 75, timezone: "Asia/Kolkata",
      status: "ended", visibility: "batch", inviteeIds: [],
      bbb: mockBBB("m-5"),
      settings: defaultSettings({ record: true }),
      agenda: ["Pod networking", "Services", "CNI"],
      prerequisites: [], materials: [],
      recordings: [{ id: "r2", title: "Full session", url: "#", durationMins: 74, recordedAt: offset(-5, 12), sizeMb: 340 }],
      createdAt: offset(-12), createdBy: "admin", totalInvited: 10,
    },
    {
      id: "m-6",
      title: "Ad-hoc: AWS Doubt-Clearing",
      description: "Optional doubt-clearing session.",
      kind: "ad-hoc",
      batchId: "1", batchName: "AWS Solutions Architect - Batch 12",
      trainerId: "t-1", trainerName: "James Wilson", coHostIds: [],
      scheduledAt: offset(3, 18),
      durationMins: 45, timezone: "Asia/Kolkata",
      status: "scheduled", visibility: "batch", inviteeIds: [],
      bbb: mockBBB("m-6"),
      settings: defaultSettings({ record: false }),
      agenda: ["Open floor"], prerequisites: [], materials: [], recordings: [],
      createdAt: offset(-1), createdBy: "admin", totalInvited: 12,
    },
  ];

  return seed.map((m) => {
    const base = { ...m } as Meeting;
    if (base.status === "ended") {
      const att = generateAttendance(base);
      base.attendance = att;
      base.engagement = generateEngagement(base, att);
    } else if (base.status === "live") {
      // Partial attendance: who has joined so far
      const att = generateAttendance(base).map((a, i) =>
        i < 8 ? { ...a, status: "present" as const, leftAt: undefined } : { ...a, status: "absent" as const, durationMins: 0, presentPct: 0 }
      );
      base.attendance = att;
      base.engagement = [];
    } else {
      base.attendance = [];
      base.engagement = [];
    }
    return base;
  });
}

interface MeetingStore {
  meetings: Meeting[];
  addMeeting: (m: Omit<Meeting, "id" | "status" | "bbb" | "attendance" | "engagement" | "recordings" | "createdAt" | "createdBy">) => string;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  cancelMeeting: (id: string) => void;
  attachToBatch: (id: string, batchId: string, batchName: string) => void;
  getMeeting: (id: string) => Meeting | undefined;
  getMeetingsByBatch: (batchId: string) => Meeting[];
  getUnassignedMeetings: () => Meeting[];
  getMeetingsForStudent: (studentId: string, batchId?: string) => Meeting[];
  getLiveNowForStudent: (studentId: string, batchId?: string) => Meeting | undefined;
  getUpNextForStudent: (studentId: string, batchId?: string) => Meeting | undefined;
}

export const useMeetingStore = create<MeetingStore>((set, get) => ({
  meetings: buildSeed(),
  addMeeting: (m) => {
    const id = `m-${Date.now()}`;
    const scheduledTime = new Date(m.scheduledAt).getTime();
    const nowTime = Date.now();
    const endTime = scheduledTime + m.durationMins * 60_000;
    let status: MeetingStatus = "scheduled";
    if (nowTime > endTime) status = "ended";
    else if (nowTime >= scheduledTime) status = "live";
    const meeting: Meeting = {
      ...m, id, status,
      bbb: mockBBB(id),
      attendance: [], engagement: [], recordings: [],
      createdAt: new Date().toISOString(), createdBy: "admin",
    };
    if (status === "ended") {
      meeting.attendance = generateAttendance(meeting);
      meeting.engagement = generateEngagement(meeting, meeting.attendance);
    }
    set((s) => ({ meetings: [meeting, ...s.meetings] }));
    return id;
  },
  updateMeeting: (id, updates) =>
    set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
  deleteMeeting: (id) => set((s) => ({ meetings: s.meetings.filter((m) => m.id !== id) })),
  cancelMeeting: (id) =>
    set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, status: "cancelled" } : m)) })),
  attachToBatch: (id, batchId, batchName) =>
    set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, batchId, batchName, kind: m.kind === "office-hours" ? m.kind : "batch-session" } : m)) })),
  getMeeting: (id) => get().meetings.find((m) => m.id === id),
  getMeetingsByBatch: (batchId) => get().meetings.filter((m) => m.batchId === batchId),
  getUnassignedMeetings: () => get().meetings.filter((m) => !m.batchId),
  getMeetingsForStudent: (studentId, batchId) =>
    get().meetings.filter((m) =>
      (batchId && m.batchId === batchId) || m.inviteeIds.includes(studentId)
    ),
  getLiveNowForStudent: (studentId, batchId) => {
    const list = get().meetings.filter(
      (m) => m.status === "live" && ((batchId && m.batchId === batchId) || m.inviteeIds.includes(studentId))
    );
    return list[0];
  },
  getUpNextForStudent: (studentId, batchId) => {
    const now = Date.now();
    const upcoming = get().meetings
      .filter((m) => m.status === "scheduled" && new Date(m.scheduledAt).getTime() > now)
      .filter((m) => (batchId && m.batchId === batchId) || m.inviteeIds.includes(studentId))
      .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));
    return upcoming[0];
  },
}));

// Convenience for student portal
export const CURRENT_STUDENT_ID = "current-student";
export const CURRENT_STUDENT_BATCH_ID = "1";
