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

// Initial mock data
const initialTemplates: LabTemplate[] = [
  {
    id: "tpl-1",
    name: "AWS EC2 Linux Instance",
    description: "Standard Linux environment for AWS training",
    type: "Linux",
    os: "Ubuntu",
    osVersion: "22.04 LTS",
    cloudProvider: "aws",
    region: "us-east-1",
    vcpus: 2,
    memory: 4,
    storage: 20,
    runtimeLimit: 120,
    category: "Cloud Computing",
    tags: ["aws", "linux", "ec2"],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: true,
      sshAccess: true,
      rdpAccess: false,
    },
    startupScript: "#!/bin/bash\necho 'Lab ready'",
    lastUpdated: "Jan 10, 2024",
    createdAt: "Dec 15, 2023",
  },
  {
    id: "tpl-2",
    name: "Windows Server 2022",
    description: "Windows Server environment for system administration",
    type: "Windows",
    os: "Windows Server",
    osVersion: "2022 Datacenter",
    cloudProvider: "azure",
    region: "eastus",
    vcpus: 4,
    memory: 8,
    storage: 50,
    runtimeLimit: 180,
    category: "System Administration",
    tags: ["windows", "server", "azure"],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: true,
      sshAccess: false,
      rdpAccess: true,
    },
    startupScript: "",
    lastUpdated: "Jan 8, 2024",
    createdAt: "Dec 20, 2023",
  },
  {
    id: "tpl-3",
    name: "Kubernetes Cluster",
    description: "Multi-node Kubernetes cluster for container orchestration training",
    type: "Linux",
    os: "Alpine Linux",
    osVersion: "3.18",
    cloudProvider: "gcp",
    region: "us-central1",
    vcpus: 4,
    memory: 8,
    storage: 40,
    runtimeLimit: 90,
    category: "Container Orchestration",
    tags: ["kubernetes", "k8s", "containers", "gcp"],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: true,
      sshAccess: true,
      rdpAccess: false,
    },
    startupScript: "#!/bin/bash\nkubeadm init",
    lastUpdated: "Jan 5, 2024",
    createdAt: "Nov 28, 2023",
  },
  {
    id: "tpl-4",
    name: "Docker Environment",
    description: "Docker-ready environment for containerization training",
    type: "Linux",
    os: "Ubuntu",
    osVersion: "20.04 LTS",
    cloudProvider: "aws",
    region: "us-west-2",
    vcpus: 2,
    memory: 4,
    storage: 30,
    runtimeLimit: 60,
    category: "Containerization",
    tags: ["docker", "containers", "devops"],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: false,
      sshAccess: true,
      rdpAccess: false,
    },
    startupScript: "#!/bin/bash\ndocker --version",
    lastUpdated: "Dec 28, 2023",
    createdAt: "Dec 10, 2023",
  },
  {
    id: "tpl-5",
    name: "Terraform Sandbox",
    description: "Infrastructure as Code sandbox with Terraform pre-installed",
    type: "Linux",
    os: "CentOS",
    osVersion: "8 Stream",
    cloudProvider: "digitalocean",
    region: "nyc1",
    vcpus: 2,
    memory: 2,
    storage: 20,
    runtimeLimit: 120,
    category: "Infrastructure",
    tags: ["terraform", "iac", "infrastructure"],
    policies: {
      internetAccess: true,
      clipboardAccess: true,
      fileUpload: true,
      fileDownload: true,
      sshAccess: true,
      rdpAccess: false,
    },
    startupScript: "#!/bin/bash\nterraform --version",
    lastUpdated: "Jan 12, 2024",
    createdAt: "Dec 5, 2023",
  },
];

const initialLabs: Lab[] = [
  {
    id: "lab-1",
    name: "AWS EC2 Setup Lab",
    description: "Hands-on lab for setting up and configuring AWS EC2 instances",
    templateId: "tpl-1",
    templateName: "AWS EC2 Linux Instance",
    batchName: "AWS SA - Batch 12",
    status: "active",
    createdAt: "Jan 5, 2024",
    instanceCount: 3,
    instances: [
      { id: "inst-1", studentName: "Alice Johnson", studentEmail: "alice@example.com", status: "running", startedAt: "2 hours ago", timeRemaining: "45 min", cpu: 32, memory: 48, ipAddress: "54.123.45.67" },
      { id: "inst-2", studentName: "David Brown", studentEmail: "david@example.com", status: "running", startedAt: "1 hour ago", timeRemaining: "60 min", cpu: 28, memory: 35, ipAddress: "54.123.45.68" },
      { id: "inst-3", studentName: "Eva Martinez", studentEmail: "eva@example.com", status: "stopped", startedAt: "3 hours ago", timeRemaining: "0 min", cpu: 0, memory: 0, ipAddress: "54.123.45.69" },
    ],
  },
  {
    id: "lab-2",
    name: "Kubernetes Pod Management",
    description: "Learn to deploy and manage Kubernetes pods",
    templateId: "tpl-3",
    templateName: "Kubernetes Cluster",
    batchName: "K8s - Batch 8",
    status: "active",
    createdAt: "Jan 8, 2024",
    instanceCount: 2,
    instances: [
      { id: "inst-4", studentName: "Bob Williams", studentEmail: "bob@example.com", status: "running", startedAt: "30 min ago", timeRemaining: "30 min", cpu: 45, memory: 62, ipAddress: "35.192.45.10" },
      { id: "inst-5", studentName: "Frank Lee", studentEmail: "frank@example.com", status: "running", startedAt: "15 min ago", timeRemaining: "85 min", cpu: 55, memory: 70, ipAddress: "35.192.45.11" },
    ],
  },
  {
    id: "lab-3",
    name: "Docker Compose Workshop",
    description: "Multi-container application deployment with Docker Compose",
    templateId: "tpl-4",
    templateName: "Docker Environment",
    batchName: "Docker - Batch 15",
    status: "active",
    createdAt: "Jan 10, 2024",
    instanceCount: 1,
    instances: [
      { id: "inst-6", studentName: "Carol Davis", studentEmail: "carol@example.com", status: "error", startedAt: "1 hour ago", timeRemaining: "15 min", cpu: 0, memory: 0, ipAddress: "54.234.56.78" },
    ],
  },
  {
    id: "lab-4",
    name: "Terraform Basics",
    description: "Introduction to Infrastructure as Code with Terraform",
    templateId: "tpl-5",
    templateName: "Terraform Sandbox",
    batchName: "Terraform - Batch 5",
    status: "inactive",
    createdAt: "Dec 28, 2023",
    instanceCount: 0,
    instances: [],
  },
];

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
