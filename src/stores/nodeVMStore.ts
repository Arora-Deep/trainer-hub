import { create } from "zustand";

export type NodeVMStatus = "running" | "stopped" | "error" | "provisioning";

export interface NodeVM {
  id: string;
  name: string;
  node: string;
  region: string;
  os: string;
  vcpu: number;
  ramGB: number;
  diskGB: number;
  ipAddress: string;
  status: NodeVMStatus;
  customerId?: string;
  customerName?: string;
  batchId?: string;
  batchName?: string;
  studentId?: string;
  studentName?: string;
  bonusHours?: number;
}

interface NodeVMState {
  vms: NodeVM[];
  assign: (vmIds: string[], target: { customerId?: string; customerName?: string; batchId?: string; batchName?: string; studentId?: string; studentName?: string }) => void;
  release: (vmIds: string[]) => void;
  addBonusHours: (vmIds: string[], hours: number) => void;
}

const nodes = [
  { node: "node-mum-01", region: "ap-south-1 / Mumbai" },
  { node: "node-mum-02", region: "ap-south-1 / Mumbai" },
  { node: "node-nyc-01", region: "us-east-1 / Virginia" },
  { node: "node-pdx-01", region: "us-west-2 / Oregon" },
  { node: "node-dub-01", region: "eu-west-1 / Ireland" },
];

const oses = ["Ubuntu 22.04", "Ubuntu 20.04", "CentOS 8", "Windows Server 2022", "Alpine 3.18"];

function seedVMs(): NodeVM[] {
  const out: NodeVM[] = [];
  let n = 1;
  nodes.forEach((nd, ni) => {
    for (let i = 0; i < 8; i++) {
      const assigned = (n % 3 !== 0);
      out.push({
        id: `nvm-${String(n).padStart(3, "0")}`,
        name: `vm-${nd.node.split("-")[1]}-${String(i + 1).padStart(2, "0")}`,
        node: nd.node,
        region: nd.region,
        os: oses[(ni + i) % oses.length],
        vcpu: [2, 4, 8][i % 3],
        ramGB: [4, 8, 16][i % 3],
        diskGB: [40, 80, 120][i % 3],
        ipAddress: `10.${ni + 10}.${i + 1}.${n % 250}`,
        status: i % 5 === 4 ? "stopped" : i % 7 === 6 ? "error" : "running",
        customerId: assigned ? (i % 2 === 0 ? "cust-1" : "cust-2") : undefined,
        customerName: assigned ? (i % 2 === 0 ? "TechSkills Academy" : "CodeCraft Institute") : undefined,
        batchId: assigned ? (i % 2 === 0 ? "1" : "2") : undefined,
        batchName: assigned ? (i % 2 === 0 ? "AWS SA - Batch 12" : "K8s - Batch 8") : undefined,
        studentName: assigned && i % 4 === 0 ? "Alice Johnson" : undefined,
        bonusHours: 0,
      });
      n++;
    }
  });
  return out;
}

export const useNodeVMStore = create<NodeVMState>((set) => ({
  vms: seedVMs(),
  assign: (vmIds, target) =>
    set((s) => ({
      vms: s.vms.map((v) =>
        vmIds.includes(v.id)
          ? {
              ...v,
              customerId: target.customerId ?? v.customerId,
              customerName: target.customerName ?? v.customerName,
              batchId: target.batchId ?? v.batchId,
              batchName: target.batchName ?? v.batchName,
              studentId: target.studentId,
              studentName: target.studentName,
            }
          : v,
      ),
    })),
  release: (vmIds) =>
    set((s) => ({
      vms: s.vms.map((v) =>
        vmIds.includes(v.id)
          ? { ...v, customerId: undefined, customerName: undefined, batchId: undefined, batchName: undefined, studentId: undefined, studentName: undefined }
          : v,
      ),
    })),
  addBonusHours: (vmIds, hours) =>
    set((s) => ({
      vms: s.vms.map((v) => (vmIds.includes(v.id) ? { ...v, bonusHours: (v.bonusHours || 0) + hours } : v)),
    })),
}));
