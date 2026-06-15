import { create } from "zustand";

export interface OfficeHourSlot {
  id: string;
  trainerId: string;
  trainerName: string;
  topic: string;
  /** ISO date+time for the start of the slot */
  startAt: string;
  durationMins: number;
  capacity: number;
  /** student IDs who booked the slot */
  bookedBy: string[];
}

interface OfficeHoursStore {
  slots: OfficeHourSlot[];
  addSlot: (s: Omit<OfficeHourSlot, "id" | "bookedBy">) => string;
  removeSlot: (id: string) => void;
  book: (slotId: string, studentId: string) => boolean;
  cancelBooking: (slotId: string, studentId: string) => void;
  forTrainer: (trainerId: string) => OfficeHourSlot[];
  upcomingForStudent: (studentId: string) => OfficeHourSlot[];
  available: () => OfficeHourSlot[];
}

const at = (days: number, hour: number, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const useOfficeHoursStore = create<OfficeHoursStore>((set, get) => ({
  slots: [
    { id: "oh-1", trainerId: "t-1", trainerName: "James Wilson", topic: "AWS Architecture Q&A", startAt: at(1, 16), durationMins: 30, capacity: 3, bookedBy: ["s-1"] },
    { id: "oh-2", trainerId: "t-1", trainerName: "James Wilson", topic: "AWS Architecture Q&A", startAt: at(1, 17), durationMins: 30, capacity: 3, bookedBy: [] },
    { id: "oh-3", trainerId: "t-1", trainerName: "James Wilson", topic: "AWS Architecture Q&A", startAt: at(2, 16), durationMins: 30, capacity: 3, bookedBy: [] },
    { id: "oh-4", trainerId: "t-2", trainerName: "Priya Nair", topic: "Python / Pandas help", startAt: at(2, 18), durationMins: 45, capacity: 4, bookedBy: ["s-2", "s-3"] },
    { id: "oh-5", trainerId: "t-2", trainerName: "Priya Nair", topic: "Python / Pandas help", startAt: at(3, 18), durationMins: 45, capacity: 4, bookedBy: [] },
    { id: "oh-6", trainerId: "t-4", trainerName: "Sarah Chen", topic: "Kubernetes deep-dive", startAt: at(4, 15), durationMins: 30, capacity: 2, bookedBy: [] },
    { id: "oh-7", trainerId: "t-1", trainerName: "James Wilson", topic: "AWS Architecture Q&A", startAt: at(5, 16), durationMins: 30, capacity: 3, bookedBy: [] },
  ],
  addSlot: (s) => {
    const id = `oh-${Date.now()}`;
    set((st) => ({ slots: [...st.slots, { ...s, id, bookedBy: [] }] }));
    return id;
  },
  removeSlot: (id) => set((st) => ({ slots: st.slots.filter((x) => x.id !== id) })),
  book: (slotId, studentId) => {
    const slot = get().slots.find((s) => s.id === slotId);
    if (!slot) return false;
    if (slot.bookedBy.includes(studentId)) return false;
    if (slot.bookedBy.length >= slot.capacity) return false;
    set((st) => ({
      slots: st.slots.map((s) =>
        s.id === slotId ? { ...s, bookedBy: [...s.bookedBy, studentId] } : s
      ),
    }));
    return true;
  },
  cancelBooking: (slotId, studentId) =>
    set((st) => ({
      slots: st.slots.map((s) =>
        s.id === slotId ? { ...s, bookedBy: s.bookedBy.filter((id) => id !== studentId) } : s
      ),
    })),
  forTrainer: (trainerId) =>
    get().slots
      .filter((s) => s.trainerId === trainerId)
      .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)),
  upcomingForStudent: (studentId) =>
    get().slots
      .filter((s) => s.bookedBy.includes(studentId) && +new Date(s.startAt) > Date.now())
      .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)),
  available: () =>
    get().slots
      .filter((s) => +new Date(s.startAt) > Date.now())
      .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)),
}));
