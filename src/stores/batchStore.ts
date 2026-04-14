import { create } from "zustand";

export interface Participant {
  id: string;
  name: string;
  email: string;
  quizScore: number | null;
  currentModule: string;
  lastActive: string;
  attendance: {
    present: number;
    total: number;
  };
  vmStatus?: "running" | "stopped" | "error" | "not_assigned";
  vmIpAddress?: string;
}

export interface VMTemplateConfig {
  templateId: string;
  instanceName: string;
}

export interface VMDaySchedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface VMEntry {
  id: string;
  templateId: string;
  instanceName: string;
  vmType: "single" | "multi";
  dateRange: { from: string; to: string };
  dailySchedules: VMDaySchedule[];
}

export interface VMSnapshot {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  size: string;
  status: "creating" | "ready" | "failed";
  isGolden: boolean;
}

export interface VMInstance {
  id: string;
  assignedTo: string;
  assignedEmail: string;
  vmName: string;
  status: "running" | "stopped" | "error" | "provisioning";
  ipAddress: string;
  startedAt: string;
  currentSnapshotId?: string;
}

export interface VMConfig {
  id: string;
  dateRange: { from: string; to: string };
  vmType: "single" | "multi";
  vmTemplates: VMTemplateConfig[];
  vmEntries: VMEntry[];
  trainerVM: {
    status: "not_provisioned" | "provisioning" | "running" | "configured" | "snapshotted" | "stopped";
    ipAddress: string;
    provisionedAt: string;
    consoleUrl: string;
    credentials: {
      username: string;
      password: string;
      sshPort: number;
    };
  };
  snapshots: VMSnapshot[];
  goldenSnapshotId?: string;
  participantVMs: VMInstance[];
  cloneStatus: "not_cloned" | "cloning" | "cloned";
  pricing: {
    compute: number;
    storage: number;
    network: number;
    support: number;
    total: number;
  };
  approval: {
    cloudAdda: "pending" | "approved" | "rejected";
    companyAdmin: "pending" | "approved" | "rejected";
    requested: boolean;
  };
  createdAt: string;
}

export interface LabConfig extends VMConfig {}

export interface AssignedLab {
  id: string;
  labId: string;
  name: string;
  type: string;
  duration: string;
  completions: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  courseId?: string;
  courseName?: string;
  instructors: string[];
  settings: {
    published: boolean;
    allowSelfEnrollment: boolean;
    certification: boolean;
  };
  startDate: string;
  endDate: string;
  evaluationEndDate: string;
  additionalDetails: string;
  seatCount: number;
  medium: "online" | "offline" | "hybrid";
  status: "upcoming" | "live" | "completed";
  createdAt: string;
  participants: Participant[];
  assignedLabs: AssignedLab[];
  announcements: Announcement[];
  vmConfig?: VMConfig;
  labConfigs: VMConfig[];
}

interface BatchStore {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, "id" | "createdAt" | "status" | "participants" | "assignedLabs" | "announcements" | "labConfigs">, vmConfig?: VMConfig) => string;
  getBatch: (id: string) => Batch | undefined;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  addParticipant: (batchId: string, student: Omit<Student, "id" | "quizScore" | "currentModule" | "lastActive" | "attendance" | "vmStatus" | "vmIpAddress">) => void;
  removeParticipant: (batchId: string, studentId: string) => void;
  assignLab: (batchId: string, lab: Omit<AssignedLab, "id" | "completions">) => void;
  removeLab: (batchId: string, labAssignmentId: string) => void;
  addAnnouncement: (batchId: string, announcement: Omit<Announcement, "id" | "date">) => void;
  setCourse: (batchId: string, courseId: string, courseName: string) => void;
  setVMConfig: (batchId: string, vmConfig: VMConfig) => void;
  provisionTrainerVM: (batchId: string) => void;
  markTrainerVMConfigured: (batchId: string) => void;
  cloneTrainerVMForBatch: (batchId: string) => void;
  createSnapshot: (batchId: string, name: string, description: string) => void;
  setGoldenSnapshot: (batchId: string, snapshotId: string) => void;
  deleteSnapshot: (batchId: string, snapshotId: string) => void;
  resetStudentVM: (batchId: string, vmId: string, snapshotId: string) => void;
  resetAllVMs: (batchId: string, snapshotId: string) => void;
  recloneStudentVM: (batchId: string, vmId: string) => void;
  recloneAllVMs: (batchId: string) => void;
  snapshotStudentVM: (batchId: string, vmId: string, name: string) => void;
  stopStudentVM: (batchId: string, vmId: string) => void;
  startStudentVM: (batchId: string, vmId: string) => void;
  restartStudentVM: (batchId: string, vmId: string) => void;
  recloneTrainerVM: (batchId: string, snapshotId: string) => void;
  resetTrainerVM: (batchId: string, snapshotId: string) => void;
  stopTrainerVM: (batchId: string) => void;
  startTrainerVM: (batchId: string) => void;
  // Legacy compat
  addLabConfig: (batchId: string, labConfig: any) => void;
  updateLabConfig: (batchId: string, labConfigId: string, updates: any) => void;
  removeLabConfig: (batchId: string, labConfigId: string) => void;
  provisionLab: (batchId: string, labConfigId: string) => void;
}

const determineStatus = (startDate: string, endDate: string): "upcoming" | "live" | "completed" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "live";
};

const initialBatches: Batch[] = [
  {
    id: "1",
    name: "AWS Solutions Architect - Batch 12",
    description: "Comprehensive AWS Solutions Architect training covering EC2, S3, VPC, and more.",
    courseId: "1",
    courseName: "AWS SA Pro",
    instructors: ["John Smith"],
    settings: { published: true, allowSelfEnrollment: false, certification: true },
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    evaluationEndDate: "2024-02-20",
    additionalDetails: "This batch focuses on hands-on labs and real-world scenarios.",
    seatCount: 30,
    medium: "online",
    status: "upcoming",
    createdAt: "Jan 1, 2024",
    participants: [
      { id: "s1", name: "Alice Johnson", email: "alice@example.com", quizScore: 82, currentModule: "EC2 & Compute", lastActive: "2 hours ago", attendance: { present: 18, total: 20 }, vmStatus: "running", vmIpAddress: "10.0.1.1" },
      { id: "s2", name: "Bob Williams", email: "bob@example.com", quizScore: 68, currentModule: "S3 & Storage", lastActive: "1 hour ago", attendance: { present: 15, total: 20 }, vmStatus: "running", vmIpAddress: "10.0.1.2" },
      { id: "s3", name: "Carol Davis", email: "carol@example.com", quizScore: 95, currentModule: "VPC & Networking", lastActive: "30 min ago", attendance: { present: 20, total: 20 }, vmStatus: "running", vmIpAddress: "10.0.1.3" },
      { id: "s4", name: "David Brown", email: "david@example.com", quizScore: 45, currentModule: "IAM & Security", lastActive: "5 hours ago", attendance: { present: 12, total: 20 }, vmStatus: "stopped", vmIpAddress: "10.0.1.4" },
      { id: "s5", name: "Eva Martinez", email: "eva@example.com", quizScore: null, currentModule: "EC2 & Compute", lastActive: "1 hour ago", attendance: { present: 17, total: 20 }, vmStatus: "error", vmIpAddress: "10.0.1.5" },
    ],
    assignedLabs: [
      { id: "al1", labId: "lab-1", name: "EC2 Instance Setup", type: "Linux", duration: "60 min", completions: 20 },
      { id: "al2", labId: "lab-2", name: "S3 Bucket Configuration", type: "AWS Console", duration: "45 min", completions: 18 },
    ],
    announcements: [
      { id: "ann1", title: "Lab Schedule Update", content: "Tomorrow's lab session will start 30 minutes early.", date: "Jan 17, 2024" },
      { id: "ann2", title: "New Study Materials", content: "Additional practice tests have been uploaded to the course portal.", date: "Jan 16, 2024" },
    ],
    vmConfig: {
      id: "vm-1",
      dateRange: { from: "2024-01-15", to: "2024-02-15" },
      vmEntries: [],
      vmType: "single",
      vmTemplates: [{ templateId: "tpl-1", instanceName: "EC2 Instance" }],
      trainerVM: {
        status: "configured",
        ipAddress: "10.0.1.100",
        provisionedAt: "2024-01-14T10:00:00Z",
        consoleUrl: "https://console.cloudadda.io/vm/vm-adm-1",
        credentials: { username: "root", password: "Tr@in3r!2024", sshPort: 22 },
      },
      snapshots: [
        { id: "snap-1", name: "Initial Setup", description: "Base configuration with all tools installed", createdAt: "2024-01-14T12:00:00Z", size: "4.2 GB", status: "ready", isGolden: true },
        { id: "snap-2", name: "Post Lab 1", description: "After EC2 setup lab completion", createdAt: "2024-01-16T15:00:00Z", size: "5.1 GB", status: "ready", isGolden: false },
        { id: "snap-3", name: "Post Lab 2", description: "After S3 bucket configuration lab", createdAt: "2024-01-18T10:00:00Z", size: "5.4 GB", status: "ready", isGolden: false },
      ],
      goldenSnapshotId: "snap-1",
      participantVMs: [
        { id: "svm-1", assignedTo: "Alice Johnson", assignedEmail: "alice@example.com", vmName: "EC2 Instance", status: "running", ipAddress: "10.0.1.1", startedAt: "2024-01-15T09:00:00Z", currentSnapshotId: "snap-2" },
        { id: "svm-2", assignedTo: "Bob Williams", assignedEmail: "bob@example.com", vmName: "EC2 Instance", status: "running", ipAddress: "10.0.1.2", startedAt: "2024-01-15T09:00:00Z", currentSnapshotId: "snap-1" },
        { id: "svm-3", assignedTo: "Carol Davis", assignedEmail: "carol@example.com", vmName: "EC2 Instance", status: "running", ipAddress: "10.0.1.3", startedAt: "2024-01-15T09:00:00Z", currentSnapshotId: "snap-2" },
        { id: "svm-4", assignedTo: "David Brown", assignedEmail: "david@example.com", vmName: "EC2 Instance", status: "stopped", ipAddress: "10.0.1.4", startedAt: "2024-01-15T09:00:00Z", currentSnapshotId: "snap-1" },
        { id: "svm-5", assignedTo: "Eva Martinez", assignedEmail: "eva@example.com", vmName: "EC2 Instance", status: "error", ipAddress: "10.0.1.5", startedAt: "2024-01-15T09:00:00Z" },
      ],
      cloneStatus: "cloned",
      pricing: { compute: 3125, storage: 312.5, network: 125, support: 60, total: 3622.5 },
      approval: { cloudAdda: "approved", companyAdmin: "approved", requested: true },
      createdAt: "Jan 10, 2024",
    },
    labConfigs: [],
  },
  {
    id: "2",
    name: "Kubernetes Fundamentals - Batch 8",
    description: "Learn the fundamentals of Kubernetes container orchestration.",
    courseId: "2",
    courseName: "K8s Basics",
    instructors: ["Jane Doe"],
    settings: { published: true, allowSelfEnrollment: true, certification: true },
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    evaluationEndDate: "2024-02-15",
    additionalDetails: "",
    seatCount: 25,
    medium: "online",
    status: "live",
    createdAt: "Dec 20, 2023",
    participants: [],
    assignedLabs: [],
    announcements: [],
    labConfigs: [],
  },
  {
    id: "3",
    name: "Docker Masterclass - Batch 15",
    description: "Master Docker containerization from basics to advanced.",
    courseId: "3",
    courseName: "Docker Pro",
    instructors: ["Mike Johnson"],
    settings: { published: true, allowSelfEnrollment: false, certification: true },
    startDate: "2023-12-01",
    endDate: "2024-01-01",
    evaluationEndDate: "2024-01-05",
    additionalDetails: "",
    seatCount: 35,
    medium: "hybrid",
    status: "completed",
    createdAt: "Nov 15, 2023",
    participants: [],
    assignedLabs: [],
    announcements: [],
    labConfigs: [],
  },
  {
    id: "4",
    name: "Terraform Advanced - Batch 5",
    description: "Advanced Terraform techniques for infrastructure automation.",
    courseId: "4",
    courseName: "Terraform Pro",
    instructors: ["Sarah Wilson"],
    settings: { published: true, allowSelfEnrollment: true, certification: false },
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    evaluationEndDate: "2024-02-25",
    additionalDetails: "",
    seatCount: 20,
    medium: "online",
    status: "upcoming",
    createdAt: "Jan 5, 2024",
    participants: [],
    assignedLabs: [],
    announcements: [],
    labConfigs: [],
  },
  {
    id: "5",
    name: "Azure DevOps - Batch 3",
    description: "Complete Azure DevOps training for CI/CD pipelines.",
    courseId: "5",
    courseName: "Azure DevOps",
    instructors: ["Tom Brown"],
    settings: { published: true, allowSelfEnrollment: false, certification: true },
    startDate: "2024-01-08",
    endDate: "2024-02-08",
    evaluationEndDate: "2024-02-12",
    additionalDetails: "",
    seatCount: 28,
    medium: "offline",
    status: "live",
    createdAt: "Dec 28, 2023",
    participants: [],
    assignedLabs: [],
    announcements: [],
    labConfigs: [],
  },
  {
    id: "6",
    name: "Linux Administration - Batch 20",
    description: "Comprehensive Linux system administration course.",
    courseId: "6",
    courseName: "Linux Admin",
    instructors: ["Emily Chen"],
    settings: { published: true, allowSelfEnrollment: true, certification: true },
    startDate: "2023-11-15",
    endDate: "2023-12-15",
    evaluationEndDate: "2023-12-20",
    additionalDetails: "",
    seatCount: 32,
    medium: "online",
    status: "completed",
    createdAt: "Nov 1, 2023",
    participants: [],
    assignedLabs: [],
    announcements: [],
    labConfigs: [],
  },
];

export const useBatchStore = create<BatchStore>((set, get) => ({
  batches: initialBatches,

  addBatch: (batch, vmConfig) => {
    const id = Date.now().toString();
    const status = determineStatus(batch.startDate, batch.endDate);
    const newBatch: Batch = {
      ...batch, id, status,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      participants: [], assignedLabs: [], announcements: [], vmConfig, labConfigs: [],
    };
    set((state) => ({ batches: [...state.batches, newBatch] }));
    return id;
  },

  getBatch: (id) => get().batches.find((b) => b.id === id),

  updateBatch: (id, updates) => {
    set((state) => ({ batches: state.batches.map((b) => (b.id === id ? { ...b, ...updates } : b)) }));
  },

  deleteBatch: (id) => {
    set((state) => ({ batches: state.batches.filter((b) => b.id !== id) }));
  },

  addParticipant: (batchId, student) => {
    const newParticipant: Participant = {
      ...student, id: `s-${Date.now()}`, quizScore: null, currentModule: "Not Started",
      lastActive: "Never", attendance: { present: 0, total: 0 }, vmStatus: "not_assigned",
    };
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, participants: [...b.participants, newParticipant] } : b),
    }));
  },

  removeParticipant: (batchId, studentId) => {
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, participants: b.participants.filter((s) => s.id !== studentId) } : b),
    }));
  },

  assignLab: (batchId, lab) => {
    const newAssignment: AssignedLab = { ...lab, id: `al-${Date.now()}`, completions: 0 };
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, assignedLabs: [...b.assignedLabs, newAssignment] } : b),
    }));
  },

  removeLab: (batchId, labAssignmentId) => {
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, assignedLabs: b.assignedLabs.filter((l) => l.id !== labAssignmentId) } : b),
    }));
  },

  addAnnouncement: (batchId, announcement) => {
    const newAnnouncement: Announcement = {
      ...announcement, id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, announcements: [newAnnouncement, ...b.announcements] } : b),
    }));
  },

  setCourse: (batchId, courseId, courseName) => {
    set((state) => ({ batches: state.batches.map((b) => b.id === batchId ? { ...b, courseId, courseName } : b) }));
  },

  setVMConfig: (batchId, vmConfig) => {
    set((state) => ({ batches: state.batches.map((b) => b.id === batchId ? { ...b, vmConfig } : b) }));
  },

  provisionTrainerVM: (batchId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "provisioning" as const } } }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, trainerVM: {
                    status: "running" as const,
                    ipAddress: `10.0.1.${100 + Math.floor(Math.random() * 50)}`,
                    provisionedAt: new Date().toISOString(),
                    consoleUrl: `https://console.cloudadda.io/vm/vm-adm-${batchId}`,
                    credentials: { username: "root", password: `Tr@in${Math.random().toString(36).slice(2, 8)}!`, sshPort: 22 },
                  },
                },
              }
            : b
        ),
      }));
    }, 3000);
  },

  markTrainerVMConfigured: (batchId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "configured" as const } } }
          : b
      ),
    }));
  },

  cloneTrainerVMForBatch: (batchId) => {
    const batch = get().batches.find((b) => b.id === batchId);
    if (!batch?.vmConfig) return;
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig ? { ...b, vmConfig: { ...b.vmConfig, cloneStatus: "cloning" as const } } : b
      ),
    }));
    setTimeout(() => {
      const currentBatch = get().batches.find((b) => b.id === batchId);
      if (!currentBatch?.vmConfig) return;
      const participantVMs: VMInstance[] = currentBatch.participants.map((student, idx) => ({
        id: `vm-student-${Date.now()}-${idx}`,
        assignedTo: student.name, assignedEmail: student.email,
        vmName: currentBatch.vmConfig!.vmTemplates[0]?.instanceName || "Student VM",
        status: "running" as const,
        ipAddress: `10.0.${Math.floor((idx + 1) / 255)}.${((idx + 1) % 255) + 1}`,
        startedAt: new Date().toISOString(),
      }));
      const remaining = currentBatch.seatCount - currentBatch.participants.length;
      for (let i = 0; i < Math.min(remaining, 5); i++) {
        participantVMs.push({
          id: `vm-unassigned-${Date.now()}-${i}`,
          assignedTo: `Seat ${currentBatch.participants.length + i + 1}`, assignedEmail: "unassigned",
          vmName: currentBatch.vmConfig!.vmTemplates[0]?.instanceName || "Student VM",
          status: "running" as const,
          ipAddress: `10.0.${Math.floor((currentBatch.participants.length + i + 1) / 255)}.${((currentBatch.participants.length + i + 1) % 255) + 1}`,
          startedAt: new Date().toISOString(),
        });
      }
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig ? { ...b, vmConfig: { ...b.vmConfig, cloneStatus: "cloned" as const, participantVMs } } : b
        ),
      }));
    }, 4000);
  },

  createSnapshot: (batchId, name, description) => {
    const snapshotId = `snap-${Date.now()}`;
    const newSnapshot: VMSnapshot = {
      id: snapshotId, name, description, createdAt: new Date().toISOString(),
      size: "Creating...", status: "creating", isGolden: false,
    };
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, snapshots: [...b.vmConfig.snapshots, newSnapshot] } }
          : b
      ),
    }));
    setTimeout(() => {
      const sizeGB = (Math.random() * 6 + 2).toFixed(1);
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, snapshots: b.vmConfig.snapshots.map((s) =>
                    s.id === snapshotId ? { ...s, status: "ready" as const, size: `${sizeGB} GB` } : s
                  ),
                },
              }
            : b
        ),
      }));
    }, 3000);
  },

  setGoldenSnapshot: (batchId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, goldenSnapshotId: snapshotId,
                snapshots: b.vmConfig.snapshots.map((s) => ({ ...s, isGolden: s.id === snapshotId })),
              },
            }
          : b
      ),
    }));
  },

  deleteSnapshot: (batchId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig,
                snapshots: b.vmConfig.snapshots.filter((s) => s.id !== snapshotId),
                goldenSnapshotId: b.vmConfig.goldenSnapshotId === snapshotId ? undefined : b.vmConfig.goldenSnapshotId,
              },
            }
          : b
      ),
    }));
  },

  resetStudentVM: (batchId, vmId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                  vm.id === vmId ? { ...vm, status: "provisioning" as const, currentSnapshotId: snapshotId } : vm
                ),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                    vm.id === vmId ? { ...vm, status: "running" as const } : vm
                  ),
                },
              }
            : b
        ),
      }));
    }, 3000);
  },

  resetAllVMs: (batchId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) => ({
                  ...vm, status: "provisioning" as const, currentSnapshotId: snapshotId,
                })),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) => ({ ...vm, status: "running" as const })),
                },
              }
            : b
        ),
      }));
    }, 5000);
  },

  recloneStudentVM: (batchId, vmId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                  vm.id === vmId ? { ...vm, status: "provisioning" as const, currentSnapshotId: b.vmConfig!.goldenSnapshotId } : vm
                ),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                    vm.id === vmId ? { ...vm, status: "running" as const } : vm
                  ),
                },
              }
            : b
        ),
      }));
    }, 4000);
  },

  recloneAllVMs: (batchId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) => ({
                  ...vm, status: "provisioning" as const, currentSnapshotId: b.vmConfig!.goldenSnapshotId,
                })),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) => ({ ...vm, status: "running" as const })),
                },
              }
            : b
        ),
      }));
    }, 6000);
  },

  snapshotStudentVM: (batchId, vmId, name) => {
    const snapshotId = `snap-s-${Date.now()}`;
    const newSnapshot: VMSnapshot = {
      id: snapshotId, name, description: `Snapshot of student VM ${vmId}`,
      createdAt: new Date().toISOString(), size: "Creating...", status: "creating", isGolden: false,
    };
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, snapshots: [...b.vmConfig.snapshots, newSnapshot] } }
          : b
      ),
    }));
    setTimeout(() => {
      const sizeGB = (Math.random() * 4 + 1).toFixed(1);
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, snapshots: b.vmConfig.snapshots.map((s) =>
                    s.id === snapshotId ? { ...s, status: "ready" as const, size: `${sizeGB} GB` } : s
                  ),
                },
              }
            : b
        ),
      }));
    }, 2000);
  },

  stopStudentVM: (batchId, vmId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                  vm.id === vmId ? { ...vm, status: "stopped" as const } : vm
                ),
              },
            }
          : b
      ),
    }));
  },

  startStudentVM: (batchId, vmId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                  vm.id === vmId ? { ...vm, status: "provisioning" as const } : vm
                ),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                    vm.id === vmId ? { ...vm, status: "running" as const } : vm
                  ),
                },
              }
            : b
        ),
      }));
    }, 2000);
  },

  restartStudentVM: (batchId, vmId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? {
              ...b, vmConfig: {
                ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                  vm.id === vmId ? { ...vm, status: "provisioning" as const } : vm
                ),
              },
            }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b, vmConfig: {
                  ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.map((vm) =>
                    vm.id === vmId ? { ...vm, status: "running" as const } : vm
                  ),
                },
              }
            : b
        ),
      }));
    }, 2000);
  },

  recloneTrainerVM: (batchId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "provisioning" as const } } }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "running" as const } } }
            : b
        ),
      }));
    }, 4000);
  },

  resetTrainerVM: (batchId, snapshotId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "provisioning" as const } } }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "running" as const } } }
            : b
        ),
      }));
    }, 3000);
  },

  stopTrainerVM: (batchId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "stopped" as const } } }
          : b
      ),
    }));
  },

  startTrainerVM: (batchId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId && b.vmConfig
          ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "provisioning" as const } } }
          : b
      ),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? { ...b, vmConfig: { ...b.vmConfig, trainerVM: { ...b.vmConfig.trainerVM, status: "running" as const } } }
            : b
        ),
      }));
    }, 2000);
  },

  // Legacy compatibility stubs
  addLabConfig: () => {},
  updateLabConfig: () => {},
  removeLabConfig: () => {},
  provisionLab: () => {},
}));
