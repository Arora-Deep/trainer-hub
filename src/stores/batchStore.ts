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
  addParticipant: (batchId: string, participant: Omit<Participant, "id" | "quizScore" | "currentModule" | "lastActive" | "attendance" | "vmStatus" | "vmIpAddress">) => void;
  removeParticipant: (batchId: string, participantId: string) => void;
  updateParticipant: (batchId: string, participantId: string, updates: Partial<Pick<Participant, "name" | "email">>) => void;
  importParticipantsCSV: (batchId: string, participants: { name: string; email: string }[]) => void;
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
  resetParticipantVM: (batchId: string, vmId: string, snapshotId: string) => void;
  resetAllVMs: (batchId: string, snapshotId: string) => void;
  recloneParticipantVM: (batchId: string, vmId: string) => void;
  recloneAllVMs: (batchId: string) => void;
  snapshotParticipantVM: (batchId: string, vmId: string, name: string) => void;
  stopParticipantVM: (batchId: string, vmId: string) => void;
  startParticipantVM: (batchId: string, vmId: string) => void;
  restartParticipantVM: (batchId: string, vmId: string) => void;
  recloneTrainerVM: (batchId: string, snapshotId: string) => void;
  resetTrainerVM: (batchId: string, snapshotId: string) => void;
  stopTrainerVM: (batchId: string) => void;
  startTrainerVM: (batchId: string) => void;
  assignParticipantVM: (batchId: string, participantId: string, vmName?: string) => void;
  unassignParticipantVM: (batchId: string, vmId: string) => void;
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

const initialBatches: Batch[] = [];

export const useBatchStore = create<BatchStore>((set, get) => ({
  batches: initialBatches,

  addBatch: (batch, vmConfig) => {
    const id = Date.now().toString();
    const status = determineStatus(batch.startDate, batch.endDate);
    // Auto-generate participants based on seat count
    const autoParticipants: Participant[] = Array.from({ length: batch.seatCount }, (_, i) => ({
      id: `p-${Date.now()}-${i}`,
      name: `Participant ${i + 1}`,
      email: `participant${i + 1}@example.com`,
      quizScore: null,
      currentModule: "Not Started",
      lastActive: "Never",
      attendance: { present: 0, total: 0 },
      vmStatus: "not_assigned" as const,
    }));
    const newBatch: Batch = {
      ...batch, id, status,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      participants: autoParticipants, assignedLabs: [], announcements: [], vmConfig, labConfigs: [],
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

  addParticipant: (batchId, participant) => {
    const newParticipant: Participant = {
      ...participant, id: `s-${Date.now()}`, quizScore: null, currentModule: "Not Started",
      lastActive: "Never", attendance: { present: 0, total: 0 }, vmStatus: "not_assigned",
    };
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, participants: [...b.participants, newParticipant] } : b),
    }));
  },

  removeParticipant: (batchId, participantId) => {
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? { ...b, participants: b.participants.filter((s) => s.id !== participantId) } : b),
    }));
  },

  updateParticipant: (batchId, participantId, updates) => {
    set((state) => ({
      batches: state.batches.map((b) => b.id === batchId ? {
        ...b, participants: b.participants.map((p) => p.id === participantId ? { ...p, ...updates } : p),
      } : b),
    }));
  },

  importParticipantsCSV: (batchId, csvParticipants) => {
    set((state) => ({
      batches: state.batches.map((b) => {
        if (b.id !== batchId) return b;
        const newParticipants: Participant[] = csvParticipants.map((cp, i) => ({
          id: `p-${Date.now()}-${i}`,
          name: cp.name,
          email: cp.email,
          quizScore: null,
          currentModule: "Not Started",
          lastActive: "Never",
          attendance: { present: 0, total: 0 },
          vmStatus: "not_assigned" as const,
        }));
        return { ...b, participants: newParticipants, seatCount: Math.max(b.seatCount, newParticipants.length) };
      }),
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
      const participantVMs: VMInstance[] = currentBatch.participants.map((participant, idx) => ({
        id: `vm-participant-${Date.now()}-${idx}`,
        assignedTo: participant.name, assignedEmail: participant.email,
        vmName: currentBatch.vmConfig!.vmTemplates[0]?.instanceName || "Participant VM",
        status: "running" as const,
        ipAddress: `10.0.${Math.floor((idx + 1) / 255)}.${((idx + 1) % 255) + 1}`,
        startedAt: new Date().toISOString(),
      }));
      const remaining = currentBatch.seatCount - currentBatch.participants.length;
      for (let i = 0; i < Math.min(remaining, 5); i++) {
        participantVMs.push({
          id: `vm-unassigned-${Date.now()}-${i}`,
          assignedTo: `Seat ${currentBatch.participants.length + i + 1}`, assignedEmail: "unassigned",
          vmName: currentBatch.vmConfig!.vmTemplates[0]?.instanceName || "Participant VM",
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

  resetParticipantVM: (batchId, vmId, snapshotId) => {
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

  recloneParticipantVM: (batchId, vmId) => {
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

  snapshotParticipantVM: (batchId, vmId, name) => {
    const snapshotId = `snap-s-${Date.now()}`;
    const newSnapshot: VMSnapshot = {
      id: snapshotId, name, description: `Snapshot of participant VM ${vmId}`,
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

  stopParticipantVM: (batchId, vmId) => {
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

  startParticipantVM: (batchId, vmId) => {
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

  restartParticipantVM: (batchId, vmId) => {
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

  assignParticipantVM: (batchId, participantId, vmName) => {
    set((state) => ({
      batches: state.batches.map((b) => {
        if (b.id !== batchId) return b;
        const participant = b.participants.find((p) => p.id === participantId);
        if (!participant) return b;
        const ipAddress = `10.0.${Math.floor(Math.random() * 50) + 1}.${Math.floor(Math.random() * 250) + 2}`;
        const newVM: VMInstance = {
          id: `svm-${Date.now()}-${participantId}`,
          assignedTo: participant.name,
          assignedEmail: participant.email,
          vmName: vmName || `VM-${Math.floor(Math.random() * 9000) + 1000}`,
          status: "provisioning",
          ipAddress,
          startedAt: new Date().toISOString(),
          currentSnapshotId: b.vmConfig?.goldenSnapshotId,
        };
        const updatedParticipants = b.participants.map((p) =>
          p.id === participantId ? { ...p, vmStatus: "running" as const, vmIpAddress: ipAddress } : p
        );
        if (!b.vmConfig) {
          return { ...b, participants: updatedParticipants };
        }
        return {
          ...b,
          participants: updatedParticipants,
          vmConfig: { ...b.vmConfig, participantVMs: [...b.vmConfig.participantVMs, newVM] },
        };
      }),
    }));
    setTimeout(() => {
      set((state) => ({
        batches: state.batches.map((b) =>
          b.id === batchId && b.vmConfig
            ? {
                ...b,
                vmConfig: {
                  ...b.vmConfig,
                  participantVMs: b.vmConfig.participantVMs.map((vm) =>
                    vm.assignedEmail && b.participants.find((p) => p.id === participantId)?.email === vm.assignedEmail && vm.status === "provisioning"
                      ? { ...vm, status: "running" as const }
                      : vm
                  ),
                },
              }
            : b
        ),
      }));
    }, 2000);
  },

  unassignParticipantVM: (batchId, vmId) => {
    set((state) => ({
      batches: state.batches.map((b) => {
        if (b.id !== batchId || !b.vmConfig) return b;
        const vm = b.vmConfig.participantVMs.find((v) => v.id === vmId);
        return {
          ...b,
          vmConfig: { ...b.vmConfig, participantVMs: b.vmConfig.participantVMs.filter((v) => v.id !== vmId) },
          participants: b.participants.map((p) =>
            vm && p.email === vm.assignedEmail ? { ...p, vmStatus: "not_assigned" as const, vmIpAddress: undefined } : p
          ),
        };
      }),
    }));
  },

  // Legacy compatibility stubs
  addLabConfig: () => {},
  updateLabConfig: () => {},
  removeLabConfig: () => {},
  provisionLab: () => {},
}));
