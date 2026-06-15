import { create } from "zustand";

export type SandboxStatus =
  | "requested"
  | "provisioning"
  | "ready"
  | "validation"
  | "snapshot"
  | "published"
  | "rejected";

export interface SandboxVM {
  id: string;
  trainerName: string;
  trainerEmail: string;
  customerId?: string;
  customerName?: string;
  purpose: string;
  os: string;
  vcpu: number;
  ramGB: number;
  diskGB: number;
  region: string;
  targetCourse?: string;
  notes?: string;
  status: SandboxStatus;
  createdAt: string;
  ipAddress?: string;
  consoleUrl?: string;
  templateName?: string;
  origin: "trainer_request" | "admin_provision";
  history: { ts: string; status: SandboxStatus; note?: string }[];
}

interface SandboxState {
  items: SandboxVM[];
  request: (data: Omit<SandboxVM, "id" | "status" | "createdAt" | "history" | "origin"> & { origin?: SandboxVM["origin"] }) => string;
  approveProvision: (id: string) => void;
  reject: (id: string, reason: string) => void;
  markReady: (id: string) => void;
  startValidation: (id: string) => void;
  snapshotAndPublish: (id: string, templateName: string) => void;
}

const now = () => new Date().toISOString();

const initial: SandboxVM[] = [
  {
    id: "sbx-1",
    trainerName: "John Smith",
    trainerEmail: "john@techskills.com",
    customerId: "cust-1",
    customerName: "TechSkills Academy",
    purpose: "Self-paced AWS S3 lab template",
    os: "Ubuntu 22.04",
    vcpu: 2,
    ramGB: 4,
    diskGB: 40,
    region: "ap-south-1",
    targetCourse: "AWS S3 Deep Dive",
    notes: "Need awscli + sample bucket data preloaded.",
    status: "ready",
    createdAt: "2026-06-10T10:00:00Z",
    ipAddress: "10.20.1.45",
    consoleUrl: "https://console.cloudadda.io/sandbox/sbx-1",
    origin: "trainer_request",
    history: [
      { ts: "2026-06-10T10:00:00Z", status: "requested" },
      { ts: "2026-06-10T11:20:00Z", status: "provisioning" },
      { ts: "2026-06-10T11:45:00Z", status: "ready", note: "VM ready for trainer configuration" },
    ],
  },
  {
    id: "sbx-2",
    trainerName: "Jane Doe",
    trainerEmail: "jane@codecraft.com",
    customerId: "cust-2",
    customerName: "CodeCraft Institute",
    purpose: "K8s self-paced single-node cluster",
    os: "Ubuntu 22.04",
    vcpu: 4,
    ramGB: 8,
    diskGB: 60,
    region: "us-east-1",
    notes: "Pre-install kubeadm, kubectl, and helm.",
    status: "requested",
    createdAt: "2026-06-13T09:30:00Z",
    origin: "trainer_request",
    history: [{ ts: "2026-06-13T09:30:00Z", status: "requested" }],
  },
];

export const useSandboxStore = create<SandboxState>((set) => ({
  items: initial,
  request: (data) => {
    const id = `sbx-${Date.now()}`;
    const item: SandboxVM = {
      ...data,
      id,
      status: "requested",
      createdAt: now(),
      origin: data.origin || "trainer_request",
      history: [{ ts: now(), status: "requested" }],
    };
    set((s) => ({ items: [item, ...s.items] }));
    return id;
  },
  approveProvision: (id) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id
          ? {
              ...it,
              status: "provisioning",
              ipAddress: it.ipAddress || `10.30.${Math.floor(Math.random() * 50)}.${Math.floor(Math.random() * 250)}`,
              consoleUrl: it.consoleUrl || `https://console.cloudadda.io/sandbox/${it.id}`,
              history: [...it.history, { ts: now(), status: "provisioning", note: "Approved and provisioning" }],
            }
          : it,
      ),
    })),
  reject: (id, reason) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id ? { ...it, status: "rejected", history: [...it.history, { ts: now(), status: "rejected", note: reason }] } : it,
      ),
    })),
  markReady: (id) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id ? { ...it, status: "ready", history: [...it.history, { ts: now(), status: "ready", note: "Marked ready for snapshot" }] } : it,
      ),
    })),
  startValidation: (id) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id ? { ...it, status: "validation", history: [...it.history, { ts: now(), status: "validation" }] } : it,
      ),
    })),
  snapshotAndPublish: (id, templateName) =>
    set((s) => ({
      items: s.items.map((it) =>
        it.id === id
          ? {
              ...it,
              status: "published",
              templateName,
              history: [
                ...it.history,
                { ts: now(), status: "snapshot", note: `Snapshot taken for "${templateName}"` },
                { ts: now(), status: "published", note: "Template published to trainer's library" },
              ],
            }
          : it,
      ),
    })),
}));
