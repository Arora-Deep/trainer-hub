import { create } from "zustand";
import { useCustomerStore } from "./customerStore";

export interface Notification {
  id: string;
  type: "batch_request" | "ticket" | "alert" | "provision_failure" | "billing" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link: string;
  severity?: "critical" | "high" | "medium" | "low";
}

interface NotificationState {
  notifications: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  markRead: (id) => set((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  markAllRead: () => set((s) => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
  dismiss: (id) => set((s) => ({ notifications: s.notifications.filter(n => n.id !== id) })),
}));

// Helper to get counts for badges
export function useNotificationCounts() {
  const { notifications } = useNotificationStore();
  const unread = notifications.filter(n => !n.read);
  return {
    total: unread.length,
    requests: unread.filter(n => n.type === "batch_request").length,
    tickets: unread.filter(n => n.type === "ticket").length,
    alerts: unread.filter(n => n.type === "alert").length,
    billing: unread.filter(n => n.type === "billing").length,
    provisioning: unread.filter(n => n.type === "provision_failure").length,
  };
}
