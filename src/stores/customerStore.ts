import { create } from "zustand";

export interface Tenant {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  domain: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "suspended" | "trial" | "expired";
  regions: string[];
  quota: { cpu: number; ram: number; storage: number; gpu: number };
  currentUsage: { liveLabs: number; activeSeats: number };
  healthScore: number;
  openTickets: number;
  overdueAmount: number;
  lastActivity: string;
  activeBatches: number;
  totalStudents: number;
  activeVMs: number;
  joinedDate: string;
  monthlyUsage: number;
  slaTier: "basic" | "standard" | "premium";
  billingCycle: "monthly" | "quarterly" | "annual";
  renewalDate: string;
  walletBalance: number;
  mfaEnabled: boolean;
  ssoEnabled: boolean;
}

export interface GoldenImage {
  id: string;
  name: string;
  os: string;
  version: string;
  lastPatched: string;
  securityScan: "passed" | "failed" | "pending" | "not_scanned";
  validationStatus: "validated" | "pending" | "failed";
  usedByTemplates: number;
  status: "draft" | "tested" | "approved" | "deprecated";
}

export interface LabBlueprint {
  id: string;
  name: string;
  type: "single" | "multi";
  version: string;
  defaultResources: { cpu: number; ram: number; disk: number; gpu?: number };
  internetPolicy: "open" | "allowlist" | "blocked";
  validationStatus: "validated" | "pending" | "failed";
  publishedTo: number;
  lastUpdated: string;
  tags: string[];
  description: string;
}

export interface ProvisionJob {
  id: string;
  type: "create" | "destroy" | "extend" | "reset" | "snapshot";
  tenant: string;
  batch: string;
  blueprint: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  retries: number;
  startedAt: string;
  endedAt?: string;
  failureReason?: string;
}

export interface Ticket {
  id: string;
  tenant: string;
  priority: "critical" | "high" | "medium" | "low";
  slaMinutes: number;
  category: string;
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  assignee: string;
  subject: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  tenant: string;
  amount: number;
  status: "paid" | "due" | "overdue" | "draft";
  dueDate: string;
  overdueDays: number;
  lineItems: { description: string; amount: number }[];
}

export interface Incident {
  id: string;
  severity: "critical" | "major" | "minor" | "info";
  title: string;
  impactedClusters: string[];
  impactedTenants: string[];
  status: "active" | "investigating" | "resolved" | "postmortem";
  owner: string;
  createdAt: string;
}

export interface TenantRequest {
  id: string;
  tenant: string;
  type: "quota_increase" | "credit_request" | "po_approval" | "template_publish";
  details: string;
  status: "pending" | "approved" | "denied";
  requestedAt: string;
  requestedBy: string;
}

interface CustomerState {
  customers: Tenant[];
  goldenImages: GoldenImage[];
  blueprints: LabBlueprint[];
  provisionJobs: ProvisionJob[];
  tickets: Ticket[];
  invoices: Invoice[];
  incidents: Incident[];
  tenantRequests: TenantRequest[];
  addCustomer: (c: Partial<Tenant> & { name: string }) => string;
  updateCustomer: (id: string, patch: Partial<Tenant>) => void;
  deleteCustomer: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  goldenImages: [],
  blueprints: [],
  provisionJobs: [],
  tickets: [],
  invoices: [],
  incidents: [],
  tenantRequests: [],
  addCustomer: (c) => {
    const id = `cust-${Date.now()}`;
    const newCustomer: Tenant = {
      id,
      name: c.name,
      contactPerson: c.contactPerson ?? "",
      email: c.email ?? "",
      domain: c.domain ?? "",
      plan: c.plan ?? "starter",
      status: c.status ?? "active",
      regions: c.regions ?? ["ap-south-1"],
      quota: c.quota ?? { cpu: 0, ram: 0, storage: 0, gpu: 0 },
      currentUsage: c.currentUsage ?? { liveLabs: 0, activeSeats: 0 },
      healthScore: c.healthScore ?? 100,
      openTickets: 0,
      overdueAmount: 0,
      lastActivity: new Date().toISOString(),
      activeBatches: 0,
      totalStudents: 0,
      activeVMs: 0,
      joinedDate: new Date().toISOString(),
      monthlyUsage: 0,
      slaTier: c.slaTier ?? "standard",
      billingCycle: c.billingCycle ?? "monthly",
      renewalDate: c.renewalDate ?? new Date(Date.now() + 365 * 86400000).toISOString(),
      walletBalance: 0,
      mfaEnabled: false,
      ssoEnabled: false,
    };
    set((s) => ({ customers: [...s.customers, newCustomer] }));
    return id;
  },
  updateCustomer: (id, patch) =>
    set((s) => ({ customers: s.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
  deleteCustomer: (id) =>
    set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
}));
