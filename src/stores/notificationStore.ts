import { create } from "zustand";
import { useCustomerStore } from "./customerStore";

export interface Notification {
  id: string;
  type: "batch_request" | "ticket" | "alert" | "provision_failure" | "billing" | "system" | "meeting" | "announcement" | "assessment";
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
  notifications: [
    { id: "n1", type: "alert", title: "GPU Capacity Exhausted", description: "ap-south-1 GPU cluster at 100%", timestamp: "2026-04-13T10:00:00Z", read: false, link: "/admin/alerts", severity: "critical" },
    { id: "n2", type: "ticket", title: "Critical Ticket: GPU labs not starting", description: "DataScience Bootcamp — TKT-2001", timestamp: "2026-04-13T09:45:00Z", read: false, link: "/admin/support/tickets", severity: "critical" },
    { id: "n3", type: "batch_request", title: "New Batch Request", description: "DevOps Academy — CPU quota increase", timestamp: "2026-04-13T09:30:00Z", read: false, link: "/admin/batches/requests", severity: "medium" },
    { id: "n4", type: "provision_failure", title: "Provision Job Failed", description: "JOB-1002 failed after 2 retries", timestamp: "2026-04-13T09:15:00Z", read: false, link: "/admin/labs/queue", severity: "high" },
    { id: "n5", type: "billing", title: "Invoice Overdue", description: "SkillBridge Labs — ₹9,500 (14 days)", timestamp: "2026-04-13T08:00:00Z", read: false, link: "/admin/billing/invoices", severity: "high" },
    { id: "n6", type: "batch_request", title: "Seat Increase Request", description: "Corporate L&D Co — Linux Fund. #8", timestamp: "2026-04-13T07:30:00Z", read: false, link: "/admin/batches/requests", severity: "medium" },
    { id: "n7", type: "system", title: "Maintenance Window Scheduled", description: "node-mum-03 — Apr 15, 02:00–04:00", timestamp: "2026-04-12T18:00:00Z", read: true, link: "/admin/infra/maintenance", severity: "low" },
    { id: "n8", type: "billing", title: "Invoice Overdue", description: "NexGen Academy — ₹4,200 (40 days)", timestamp: "2026-04-12T10:00:00Z", read: true, link: "/admin/billing/invoices", severity: "critical" },
    { id: "n9", type: "provision_failure", title: "Provision Job Failed", description: "JOB-1006 — Network timeout", timestamp: "2026-04-12T08:00:00Z", read: true, link: "/admin/labs/queue", severity: "high" },
    { id: "n10", type: "ticket", title: "High Priority Ticket", description: "SkillBridge Labs — K8s labs stuck", timestamp: "2026-04-12T06:00:00Z", read: true, link: "/admin/support/tickets", severity: "high" },
  ],
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
