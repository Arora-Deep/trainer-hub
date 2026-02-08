import { create } from "zustand";

export interface Student {
  id: string;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
}

export interface AssignedLab {
  id: string;
  labId: string;
  name: string;
  type: string;
  duration: string;
  completions: number;
}

export interface BatchVMTemplate {
  templateId: string;
  instanceName: string;
}

export interface BatchVMConfig {
  vmType: "single" | "multi";
  templates: BatchVMTemplate[];
  participantCount: number;
  adminCount: number;
  vmStartDate: string;
  vmEndDate: string;
  adminVmProvisioned: boolean;
  adminVmCloned: boolean;
  approvalStatus: {
    requested: boolean;
    cloudAdda: "pending" | "approved" | "rejected";
    companyAdmin: "pending" | "approved" | "rejected";
  };
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
  students: Student[];
  assignedLabs: AssignedLab[];
  announcements: Announcement[];
  vmConfig?: BatchVMConfig;
}

interface BatchStore {
  batches: Batch[];
  addBatch: (batch: Omit<Batch, "id" | "createdAt" | "status" | "students" | "assignedLabs" | "announcements">) => string;
  getBatch: (id: string) => Batch | undefined;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;
  addStudent: (batchId: string, student: Omit<Student, "id" | "progress" | "lastActive">) => void;
  removeStudent: (batchId: string, studentId: string) => void;
  assignLab: (batchId: string, lab: Omit<AssignedLab, "id" | "completions">) => void;
  removeLab: (batchId: string, labAssignmentId: string) => void;
  addAnnouncement: (batchId: string, announcement: Omit<Announcement, "id" | "date">) => void;
  setCourse: (batchId: string, courseId: string, courseName: string) => void;
  updateVMConfig: (batchId: string, vmConfig: Partial<BatchVMConfig>) => void;
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
    students: [
      { id: "s1", name: "Alice Johnson", email: "alice@example.com", progress: 75, lastActive: "2 hours ago" },
      { id: "s2", name: "Bob Williams", email: "bob@example.com", progress: 60, lastActive: "1 hour ago" },
      { id: "s3", name: "Carol Davis", email: "carol@example.com", progress: 90, lastActive: "30 min ago" },
      { id: "s4", name: "David Brown", email: "david@example.com", progress: 45, lastActive: "5 hours ago" },
      { id: "s5", name: "Eva Martinez", email: "eva@example.com", progress: 80, lastActive: "1 hour ago" },
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
      vmType: "single",
      templates: [{ templateId: "tpl-1", instanceName: "AWS Lab Instance" }],
      participantCount: 25,
      adminCount: 2,
      vmStartDate: "2024-01-15",
      vmEndDate: "2024-02-15",
      adminVmProvisioned: true,
      adminVmCloned: false,
      approvalStatus: { requested: true, cloudAdda: "approved", companyAdmin: "approved" },
    },
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
    students: [],
    assignedLabs: [],
    announcements: [],
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
    students: [],
    assignedLabs: [],
    announcements: [],
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
    students: [],
    assignedLabs: [],
    announcements: [],
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
    students: [],
    assignedLabs: [],
    announcements: [],
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
    students: [],
    assignedLabs: [],
    announcements: [],
  },
];

export const useBatchStore = create<BatchStore>((set, get) => ({
  batches: initialBatches,

  addBatch: (batch) => {
    const id = Date.now().toString();
    const status = determineStatus(batch.startDate, batch.endDate);
    const newBatch: Batch = {
      ...batch,
      id,
      status,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      students: [],
      assignedLabs: [],
      announcements: [],
    };
    set((state) => ({ batches: [...state.batches, newBatch] }));
    return id;
  },

  getBatch: (id) => get().batches.find((b) => b.id === id),

  updateBatch: (id, updates) => {
    set((state) => ({
      batches: state.batches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  deleteBatch: (id) => {
    set((state) => ({ batches: state.batches.filter((b) => b.id !== id) }));
  },

  addStudent: (batchId, student) => {
    const newStudent: Student = {
      ...student,
      id: `s-${Date.now()}`,
      progress: 0,
      lastActive: "Never",
    };
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, students: [...b.students, newStudent] } : b
      ),
    }));
  },

  removeStudent: (batchId, studentId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, students: b.students.filter((s) => s.id !== studentId) } : b
      ),
    }));
  },

  assignLab: (batchId, lab) => {
    const newAssignment: AssignedLab = {
      ...lab,
      id: `al-${Date.now()}`,
      completions: 0,
    };
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, assignedLabs: [...b.assignedLabs, newAssignment] } : b
      ),
    }));
  },

  removeLab: (batchId, labAssignmentId) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, assignedLabs: b.assignedLabs.filter((l) => l.id !== labAssignmentId) } : b
      ),
    }));
  },

  addAnnouncement: (batchId, announcement) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, announcements: [newAnnouncement, ...b.announcements] } : b
      ),
    }));
  },

  setCourse: (batchId, courseId, courseName) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId ? { ...b, courseId, courseName } : b
      ),
    }));
  },

  updateVMConfig: (batchId, vmConfigUpdates) => {
    set((state) => ({
      batches: state.batches.map((b) =>
        b.id === batchId
          ? { ...b, vmConfig: { ...b.vmConfig!, ...vmConfigUpdates } }
          : b
      ),
    }));
  },
}));
