import { create } from "zustand";

export interface PortalAnnouncement {
  id: string;
  batchId: string | null; // null = global
  batchName?: string;
  title: string;
  body: string;
  postedBy: string;
  postedAt: string; // ISO
  pinned: boolean;
  audience: "batch" | "global";
}

interface AnnouncementStore {
  announcements: PortalAnnouncement[];
  add: (a: Omit<PortalAnnouncement, "id" | "postedAt">) => string;
  remove: (id: string) => void;
  togglePin: (id: string) => void;
  byBatch: (batchId: string) => PortalAnnouncement[];
  global: () => PortalAnnouncement[];
  all: () => PortalAnnouncement[];
}

const iso = (offsetHours: number) =>
  new Date(Date.now() + offsetHours * 3600_000).toISOString();

export const useAnnouncementStore = create<AnnouncementStore>((set, get) => ({
  announcements: [
    {
      id: "a-1",
      batchId: "1",
      batchName: "AWS Solutions Architect - Batch 12",
      title: "Tomorrow's session moved to 10 AM",
      body: "Heads-up: tomorrow's VPC session moves up by 30 minutes.",
      postedBy: "James Wilson",
      postedAt: iso(-3),
      pinned: true,
      audience: "batch",
    },
    {
      id: "a-2",
      batchId: null,
      title: "Platform maintenance Saturday 2 AM",
      body: "Expect 30 minutes of downtime for routine maintenance.",
      postedBy: "Admin",
      postedAt: iso(-26),
      pinned: false,
      audience: "global",
    },
    {
      id: "a-3",
      batchId: "11",
      batchName: "Python Fundamentals — Cohort 14",
      title: "New Pandas dataset uploaded",
      body: "Check Materials for the new sample CSV before tomorrow's workshop.",
      postedBy: "Priya Nair",
      postedAt: iso(-10),
      pinned: false,
      audience: "batch",
    },
  ],
  add: (a) => {
    const id = `a-${Date.now()}`;
    set((s) => ({
      announcements: [
        { ...a, id, postedAt: new Date().toISOString() },
        ...s.announcements,
      ],
    }));
    return id;
  },
  remove: (id) =>
    set((s) => ({ announcements: s.announcements.filter((a) => a.id !== id) })),
  togglePin: (id) =>
    set((s) => ({
      announcements: s.announcements.map((a) =>
        a.id === id ? { ...a, pinned: !a.pinned } : a
      ),
    })),
  byBatch: (batchId) =>
    get()
      .announcements.filter((a) => a.batchId === batchId)
      .sort((a, b) => (+b.pinned - +a.pinned) || (+new Date(b.postedAt) - +new Date(a.postedAt))),
  global: () =>
    get()
      .announcements.filter((a) => a.batchId === null)
      .sort((a, b) => (+b.pinned - +a.pinned) || (+new Date(b.postedAt) - +new Date(a.postedAt))),
  all: () =>
    get().announcements.sort(
      (a, b) => (+b.pinned - +a.pinned) || (+new Date(b.postedAt) - +new Date(a.postedAt))
    ),
}));
