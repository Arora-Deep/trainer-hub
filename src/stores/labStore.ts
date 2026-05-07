import { create } from "zustand";

export interface LabInstance {
  id: string;
  studentName: string;
  studentEmail: string;
  status: "running" | "stopped" | "error" | "provisioning";
  startedAt: string;
  timeRemaining: string;
  cpu: number;
  memory: number;
  ipAddress: string;
}

export interface Lab {
  id: string;
  name: string;
  description: string;
  templateId: string;
  templateName: string;
  batchName: string;
  status: "active" | "inactive" | "scheduled";
  createdAt: string;
  instanceCount: number;
  instances: LabInstance[];
}

export interface LabTemplate {
  id: string;
  name: string;
  description: string;
  type: "Linux" | "Windows";
  os: string;
  osVersion: string;
  cloudProvider: "aws" | "azure" | "gcp" | "digitalocean";
  region: string;
  vcpus: number;
  memory: number; // in GB
  storage: number; // in GB
  runtimeLimit: number; // in minutes
  category: string;
  tags: string[];
  policies: {
    internetAccess: boolean;
    clipboardAccess: boolean;
    fileUpload: boolean;
    fileDownload: boolean;
    sshAccess: boolean;
    rdpAccess: boolean;
  };
  startupScript: string;
  lastUpdated: string;
  createdAt: string;
}

interface LabStore {
  labs: Lab[];
  templates: LabTemplate[];
  addLab: (lab: Omit<Lab, "id" | "createdAt">) => void;
  addTemplate: (template: Omit<LabTemplate, "id" | "createdAt" | "lastUpdated">) => LabTemplate;
  updateTemplate: (id: string, template: Partial<LabTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getLabById: (id: string) => Lab | undefined;
  getTemplateById: (id: string) => LabTemplate | undefined;
}

const initialTemplates: LabTemplate[] = [];
const initialLabs: Lab[] = [];

export const useLabStore = create<LabStore>((set, get) => ({
  labs: initialLabs,
  templates: initialTemplates,

  addLab: (lab) => {
    const newLab: Lab = {
      ...lab,
      id: `lab-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    set((state) => ({ labs: [...state.labs, newLab] }));
  },

  addTemplate: (template) => {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newTemplate: LabTemplate = {
      ...template,
      id: `tpl-${Date.now()}`,
      createdAt: now,
      lastUpdated: now,
    };
    set((state) => ({ templates: [...state.templates, newTemplate] }));
    return newTemplate;
  },

  updateTemplate: (id, template) => {
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === id
          ? { ...t, ...template, lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
          : t
      ),
    }));
  },

  deleteTemplate: (id) => {
    set((state) => ({ templates: state.templates.filter((t) => t.id !== id) }));
  },

  getLabById: (id) => get().labs.find((lab) => lab.id === id),

  getTemplateById: (id) => get().templates.find((template) => template.id === id),
}));
