import { create } from "zustand";

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  reason?: string;
  meta?: Record<string, any>;
}

interface AuditState {
  entries: AuditEntry[];
  log: (e: Omit<AuditEntry, "id" | "timestamp" | "actor"> & { actor?: string }) => void;
}

export const useAuditStore = create<AuditState>((set) => ({
  entries: [],
  log: (e) =>
    set((s) => ({
      entries: [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          actor: e.actor || "admin@cloudadda.io",
          action: e.action,
          target: e.target,
          reason: e.reason,
          meta: e.meta,
        },
        ...s.entries,
      ].slice(0, 200),
    })),
}));
