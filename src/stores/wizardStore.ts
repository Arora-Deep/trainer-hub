import { create } from "zustand";

export interface WizardSuggestion {
  id: string;
  title: string;
  description: string;
  action: string; // route to navigate to, or special action
  icon: string; // lucide icon name
  category: "batch" | "lab" | "course" | "general";
  priority: number; // higher = shown first
}

interface WizardStore {
  isOpen: boolean;
  dismissed: string[]; // suggestion IDs the user has dismissed
  completedActions: string[]; // actions the user has completed
  toggle: () => void;
  open: () => void;
  close: () => void;
  dismiss: (id: string) => void;
  markCompleted: (action: string) => void;
  resetDismissed: () => void;
}

export const useWizardStore = create<WizardStore>((set) => ({
  isOpen: false,
  dismissed: [],
  completedActions: [],
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  dismiss: (id) => set((s) => ({ dismissed: [...s.dismissed, id] })),
  markCompleted: (action) =>
    set((s) => ({
      completedActions: s.completedActions.includes(action)
        ? s.completedActions
        : [...s.completedActions, action],
    })),
  resetDismissed: () => set({ dismissed: [] }),
}));

// Context-aware suggestion engine
export function getWizardSuggestions(
  pathname: string,
  context: {
    hasBatches?: boolean;
    hasLabs?: boolean;
    hasTemplates?: boolean;
    batchHasVMs?: boolean;
    batchHasStudents?: boolean;
    batchHasCourse?: boolean;
    batchStatus?: string;
    trainerVMStatus?: string;
    cloneStatus?: string;
    vmEntryCount?: number;
  }
): WizardSuggestion[] {
  const suggestions: WizardSuggestion[] = [];

  // ── Dashboard suggestions ──
  if (pathname === "/") {
    if (!context.hasBatches) {
      suggestions.push({
        id: "dash-create-batch",
        title: "Create your first batch",
        description: "Set up a training batch with scheduling, VMs, and student management.",
        action: "/batches/create",
        icon: "Plus",
        category: "batch",
        priority: 100,
      });
    }
    if (!context.hasTemplates) {
      suggestions.push({
        id: "dash-create-template",
        title: "Create a VM template",
        description: "Define a reusable VM template for your lab environments.",
        action: "/labs/create-template",
        icon: "Server",
        category: "lab",
        priority: 90,
      });
    }
    suggestions.push({
      id: "dash-view-batches",
      title: "View all batches",
      description: "Check the status and manage your active training batches.",
      action: "/batches",
      icon: "Calendar",
      category: "batch",
      priority: 50,
    });
    suggestions.push({
      id: "dash-create-lab",
      title: "Create a new lab",
      description: "Set up a hands-on lab environment for students.",
      action: "/labs/create",
      icon: "FlaskConical",
      category: "lab",
      priority: 60,
    });
  }

  // ── Batches list ──
  if (pathname === "/batches") {
    suggestions.push({
      id: "batches-create",
      title: "Create a new batch",
      description: "Start the batch creation wizard with scheduling and VM setup.",
      action: "/batches/create",
      icon: "Plus",
      category: "batch",
      priority: 100,
    });
  }

  // ── Batch details ──
  if (pathname.match(/^\/batches\/[^/]+$/) && pathname !== "/batches/create") {
    if (!context.batchHasStudents) {
      suggestions.push({
        id: "batch-add-students",
        title: "Add students to this batch",
        description: "Enroll students so they can access labs and course materials.",
        action: "tab:students",
        icon: "UserPlus",
        category: "batch",
        priority: 100,
      });
    }
    if (!context.batchHasCourse) {
      suggestions.push({
        id: "batch-assign-course",
        title: "Assign a course",
        description: "Link a course or program to this batch for structured learning.",
        action: "tab:course",
        icon: "BookOpen",
        category: "batch",
        priority: 90,
      });
    }
    if (!context.batchHasVMs) {
      suggestions.push({
        id: "batch-add-vms",
        title: "Add VMs to this batch",
        description: "Configure virtual machines for hands-on lab environments.",
        action: "tab:vms",
        icon: "Monitor",
        category: "batch",
        priority: 95,
      });
    }
    if (context.batchHasVMs && context.trainerVMStatus === "not_provisioned") {
      suggestions.push({
        id: "batch-provision-trainer",
        title: "Provision the Trainer VM",
        description: "Start the admin VM so the trainer can configure it before cloning.",
        action: "tab:vms",
        icon: "Terminal",
        category: "batch",
        priority: 100,
      });
    }
    if (context.trainerVMStatus === "running") {
      suggestions.push({
        id: "batch-configure-trainer",
        title: "Mark Trainer VM as configured",
        description: "Once you've installed all software, mark it ready for cloning.",
        action: "tab:vms",
        icon: "CheckCircle2",
        category: "batch",
        priority: 100,
      });
    }
    if (context.trainerVMStatus === "configured" && context.cloneStatus === "not_cloned") {
      suggestions.push({
        id: "batch-clone-vms",
        title: "Clone VMs for all students",
        description: "Duplicate the trainer VM for every enrolled student.",
        action: "tab:vms",
        icon: "Copy",
        category: "batch",
        priority: 100,
      });
    }
    suggestions.push({
      id: "batch-post-announcement",
      title: "Post an announcement",
      description: "Notify students about schedule changes, materials, or updates.",
      action: "tab:announcements",
      icon: "Megaphone",
      category: "batch",
      priority: 40,
    });
  }

  // ── Create batch ──
  if (pathname === "/batches/create") {
    suggestions.push({
      id: "create-batch-tip-1",
      title: "Start with batch details",
      description: "Give your batch a clear name and add at least one instructor.",
      action: "none",
      icon: "FileText",
      category: "batch",
      priority: 100,
    });
    suggestions.push({
      id: "create-batch-tip-2",
      title: "Pick your schedule",
      description: "Use the calendar to select start and end dates for the batch.",
      action: "none",
      icon: "Calendar",
      category: "batch",
      priority: 90,
    });
    suggestions.push({
      id: "create-batch-tip-3",
      title: "Configure VMs per day",
      description: "Add VMs with per-day time slots for precise scheduling.",
      action: "none",
      icon: "Monitor",
      category: "batch",
      priority: 80,
    });
  }

  // ── Labs ──
  if (pathname === "/labs") {
    suggestions.push({
      id: "labs-create",
      title: "Create a new lab",
      description: "Set up a hands-on lab environment for your students.",
      action: "/labs/create",
      icon: "Plus",
      category: "lab",
      priority: 100,
    });
    if (!context.hasTemplates) {
      suggestions.push({
        id: "labs-create-template",
        title: "Create a VM template first",
        description: "Templates define the base environment for labs.",
        action: "/labs/create-template",
        icon: "Server",
        category: "lab",
        priority: 95,
      });
    }
  }

  // ── Lab creation ──
  if (pathname === "/labs/create") {
    suggestions.push({
      id: "lab-create-tip",
      title: "Need a template?",
      description: "Create a VM template before setting up a lab that uses it.",
      action: "/labs/create-template",
      icon: "Server",
      category: "lab",
      priority: 90,
    });
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}
