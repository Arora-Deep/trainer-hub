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
}

export const useCustomerStore = create<CustomerState>(() => ({
  customers: [
    {
      id: "1", name: "DevOps Academy", contactPerson: "Rajesh Kumar", email: "rajesh@devopsacademy.in", domain: "devopsacademy.in",
      plan: "enterprise", status: "active", regions: ["ap-south-1", "us-east-1"], quota: { cpu: 500, ram: 2048, storage: 10000, gpu: 0 },
      currentUsage: { liveLabs: 185, activeSeats: 420 }, healthScore: 92, openTickets: 2, overdueAmount: 0, lastActivity: "2 min ago",
      activeBatches: 12, totalStudents: 500, activeVMs: 185, joinedDate: "2024-03-15", monthlyUsage: 45000,
      slaTier: "premium", billingCycle: "annual", renewalDate: "2027-03-15", walletBalance: 15000, mfaEnabled: true, ssoEnabled: true,
    },
    {
      id: "2", name: "DataScience Bootcamp", contactPerson: "Priya Sharma", email: "priya@dsbootcamp.com", domain: "dsbootcamp.com",
      plan: "professional", status: "active", regions: ["ap-south-1"], quota: { cpu: 200, ram: 1024, storage: 5000, gpu: 8 },
      currentUsage: { liveLabs: 65, activeSeats: 140 }, healthScore: 78, openTickets: 5, overdueAmount: 2500, lastActivity: "15 min ago",
      activeBatches: 4, totalStudents: 180, activeVMs: 65, joinedDate: "2024-09-01", monthlyUsage: 18500,
      slaTier: "standard", billingCycle: "quarterly", renewalDate: "2026-06-01", walletBalance: 3200, mfaEnabled: true, ssoEnabled: false,
    },
    {
      id: "3", name: "Corporate L&D Co", contactPerson: "Mike Chen", email: "mike@corpld.com", domain: "corpld.com",
      plan: "enterprise", status: "active", regions: ["us-east-1", "eu-west-1"], quota: { cpu: 800, ram: 4096, storage: 20000, gpu: 4 },
      currentUsage: { liveLabs: 310, activeSeats: 680 }, healthScore: 88, openTickets: 1, overdueAmount: 0, lastActivity: "5 min ago",
      activeBatches: 18, totalStudents: 750, activeVMs: 310, joinedDate: "2024-01-10", monthlyUsage: 72000,
      slaTier: "premium", billingCycle: "annual", renewalDate: "2027-01-10", walletBalance: 45000, mfaEnabled: true, ssoEnabled: true,
    },
    {
      id: "4", name: "CloudLearn Pro", contactPerson: "Sarah Wilson", email: "sarah@cloudlearn.io", domain: "cloudlearn.io",
      plan: "starter", status: "trial", regions: ["us-west-2"], quota: { cpu: 50, ram: 256, storage: 1000, gpu: 0 },
      currentUsage: { liveLabs: 8, activeSeats: 15 }, healthScore: 95, openTickets: 0, overdueAmount: 0, lastActivity: "1 hour ago",
      activeBatches: 1, totalStudents: 20, activeVMs: 8, joinedDate: "2026-02-20", monthlyUsage: 800,
      slaTier: "basic", billingCycle: "monthly", renewalDate: "2026-03-20", walletBalance: 500, mfaEnabled: false, ssoEnabled: false,
    },
    {
      id: "5", name: "SkillBridge Labs", contactPerson: "Amit Patel", email: "amit@skillbridge.in", domain: "skillbridge.in",
      plan: "professional", status: "active", regions: ["ap-south-1"], quota: { cpu: 300, ram: 1536, storage: 8000, gpu: 0 },
      currentUsage: { liveLabs: 120, activeSeats: 280 }, healthScore: 65, openTickets: 8, overdueAmount: 9500, lastActivity: "30 min ago",
      activeBatches: 6, totalStudents: 350, activeVMs: 120, joinedDate: "2024-06-10", monthlyUsage: 28000,
      slaTier: "standard", billingCycle: "quarterly", renewalDate: "2026-06-10", walletBalance: 0, mfaEnabled: true, ssoEnabled: false,
    },
    {
      id: "6", name: "NexGen Academy", contactPerson: "Lisa Park", email: "lisa@nexgen.edu", domain: "nexgen.edu",
      plan: "starter", status: "suspended", regions: ["ap-southeast-1"], quota: { cpu: 100, ram: 512, storage: 2000, gpu: 0 },
      currentUsage: { liveLabs: 0, activeSeats: 0 }, healthScore: 25, openTickets: 3, overdueAmount: 4200, lastActivity: "2 weeks ago",
      activeBatches: 0, totalStudents: 45, activeVMs: 0, joinedDate: "2024-08-05", monthlyUsage: 0,
      slaTier: "basic", billingCycle: "monthly", renewalDate: "2026-01-05", walletBalance: -1200, mfaEnabled: false, ssoEnabled: false,
    },
  ],
  goldenImages: [
    { id: "img-1", name: "Ubuntu 22.04 LTS Base", os: "Ubuntu", version: "22.04.4", lastPatched: "2026-02-15", securityScan: "passed", validationStatus: "validated", usedByTemplates: 12, status: "approved" },
    { id: "img-2", name: "CentOS 9 Stream", os: "CentOS", version: "9.0", lastPatched: "2026-02-10", securityScan: "passed", validationStatus: "validated", usedByTemplates: 5, status: "approved" },
    { id: "img-3", name: "Windows Server 2022", os: "Windows", version: "2022 DC", lastPatched: "2026-01-28", securityScan: "pending", validationStatus: "pending", usedByTemplates: 3, status: "tested" },
    { id: "img-4", name: "Ubuntu 24.04 LTS", os: "Ubuntu", version: "24.04.1", lastPatched: "2026-02-25", securityScan: "passed", validationStatus: "pending", usedByTemplates: 0, status: "draft" },
    { id: "img-5", name: "Rocky Linux 9", os: "Rocky Linux", version: "9.3", lastPatched: "2026-02-01", securityScan: "failed", validationStatus: "failed", usedByTemplates: 2, status: "deprecated" },
  ],
  blueprints: [
    { id: "bp-1", name: "Kubernetes Lab v2", type: "multi", version: "2.1.0", defaultResources: { cpu: 4, ram: 8, disk: 50 }, internetPolicy: "allowlist", validationStatus: "validated", publishedTo: 4, lastUpdated: "2026-02-20", tags: ["DevOps", "K8s", "Containers"], description: "Multi-node Kubernetes cluster with master and 2 workers" },
    { id: "bp-2", name: "Linux + Networking Lab v1", type: "single", version: "1.3.0", defaultResources: { cpu: 2, ram: 4, disk: 30 }, internetPolicy: "open", validationStatus: "validated", publishedTo: 6, lastUpdated: "2026-02-18", tags: ["Linux", "Networking"], description: "Linux fundamentals with networking tools" },
    { id: "bp-3", name: "ML GPU Lab v1", type: "single", version: "1.0.0", defaultResources: { cpu: 8, ram: 32, disk: 100, gpu: 1 }, internetPolicy: "open", validationStatus: "validated", publishedTo: 2, lastUpdated: "2026-02-22", tags: ["ML", "GPU", "Python"], description: "GPU-enabled machine learning environment with Jupyter" },
    { id: "bp-4", name: "Docker Compose Lab", type: "multi", version: "1.1.0", defaultResources: { cpu: 2, ram: 4, disk: 40 }, internetPolicy: "allowlist", validationStatus: "pending", publishedTo: 0, lastUpdated: "2026-02-26", tags: ["DevOps", "Docker"], description: "Docker Compose multi-service deployment lab" },
    { id: "bp-5", name: "AWS Simulation Lab", type: "multi", version: "3.0.0", defaultResources: { cpu: 4, ram: 16, disk: 80 }, internetPolicy: "blocked", validationStatus: "validated", publishedTo: 5, lastUpdated: "2026-02-15", tags: ["AWS", "Cloud"], description: "Simulated AWS environment with EC2, S3, IAM" },
  ],
  provisionJobs: [
    { id: "JOB-1001", type: "create", tenant: "DevOps Academy", batch: "K8s Batch #14", blueprint: "Kubernetes Lab v2", status: "completed", retries: 0, startedAt: "2026-02-28T14:30:00Z", endedAt: "2026-02-28T14:35:00Z" },
    { id: "JOB-1002", type: "create", tenant: "DataScience Bootcamp", batch: "ML Cohort #5", blueprint: "ML GPU Lab v1", status: "failed", retries: 2, startedAt: "2026-02-28T15:00:00Z", endedAt: "2026-02-28T15:12:00Z", failureReason: "GPU capacity exhausted in ap-south-1" },
    { id: "JOB-1003", type: "create", tenant: "Corporate L&D Co", batch: "Linux Fundamentals #8", blueprint: "Linux + Networking Lab v1", status: "running", retries: 0, startedAt: "2026-02-28T16:00:00Z" },
    { id: "JOB-1004", type: "destroy", tenant: "SkillBridge Labs", batch: "Docker Batch #3", blueprint: "Docker Compose Lab", status: "queued", retries: 0, startedAt: "2026-02-28T16:30:00Z" },
    { id: "JOB-1005", type: "extend", tenant: "DevOps Academy", batch: "AWS Batch #6", blueprint: "AWS Simulation Lab", status: "completed", retries: 0, startedAt: "2026-02-28T12:00:00Z", endedAt: "2026-02-28T12:02:00Z" },
    { id: "JOB-1006", type: "create", tenant: "SkillBridge Labs", batch: "K8s Batch #2", blueprint: "Kubernetes Lab v2", status: "failed", retries: 3, startedAt: "2026-02-28T10:00:00Z", endedAt: "2026-02-28T10:25:00Z", failureReason: "Network timeout on cluster node provisioning" },
    { id: "JOB-1007", type: "snapshot", tenant: "Corporate L&D Co", batch: "ML Advanced #1", blueprint: "ML GPU Lab v1", status: "running", retries: 0, startedAt: "2026-02-28T16:15:00Z" },
    { id: "JOB-1008", type: "reset", tenant: "DataScience Bootcamp", batch: "Python Lab #12", blueprint: "Linux + Networking Lab v1", status: "completed", retries: 1, startedAt: "2026-02-28T13:45:00Z", endedAt: "2026-02-28T13:48:00Z" },
  ],
  tickets: [
    { id: "TKT-2001", tenant: "DataScience Bootcamp", priority: "critical", slaMinutes: 45, category: "VM Issue", status: "open", assignee: "Ops Team", subject: "GPU labs not starting for ML Cohort #5", createdAt: "2026-02-28T15:15:00Z" },
    { id: "TKT-2002", tenant: "SkillBridge Labs", priority: "high", slaMinutes: 120, category: "Provisioning", status: "in_progress", assignee: "Ravi M.", subject: "K8s labs stuck in pending state", createdAt: "2026-02-28T10:30:00Z" },
    { id: "TKT-2003", tenant: "Corporate L&D Co", priority: "medium", slaMinutes: 240, category: "Billing", status: "open", assignee: "Finance Team", subject: "Invoice discrepancy for February", createdAt: "2026-02-27T09:00:00Z" },
    { id: "TKT-2004", tenant: "NexGen Academy", priority: "low", slaMinutes: 480, category: "Account", status: "waiting", assignee: "Support", subject: "Request to reactivate suspended account", createdAt: "2026-02-26T14:00:00Z" },
    { id: "TKT-2005", tenant: "DevOps Academy", priority: "medium", slaMinutes: 240, category: "Feature Request", status: "open", assignee: "Product", subject: "Request for custom cloud-init templates", createdAt: "2026-02-28T11:00:00Z" },
  ],
  invoices: [
    { id: "INV-3001", tenant: "DevOps Academy", amount: 45000, status: "paid", dueDate: "2026-02-28", overdueDays: 0, lineItems: [{ description: "Enterprise Plan - Annual", amount: 40000 }, { description: "Overage: 20 extra seats", amount: 5000 }] },
    { id: "INV-3002", tenant: "DataScience Bootcamp", amount: 18500, status: "due", dueDate: "2026-03-05", overdueDays: 0, lineItems: [{ description: "Professional Plan - Q1", amount: 15000 }, { description: "GPU usage overage", amount: 3500 }] },
    { id: "INV-3003", tenant: "SkillBridge Labs", amount: 9500, status: "overdue", dueDate: "2026-02-15", overdueDays: 14, lineItems: [{ description: "Professional Plan - Q1", amount: 8000 }, { description: "Storage overage", amount: 1500 }] },
    { id: "INV-3004", tenant: "NexGen Academy", amount: 4200, status: "overdue", dueDate: "2026-01-20", overdueDays: 40, lineItems: [{ description: "Starter Plan - Jan", amount: 2500 }, { description: "VM hours", amount: 1700 }] },
    { id: "INV-3005", tenant: "Corporate L&D Co", amount: 72000, status: "paid", dueDate: "2026-02-01", overdueDays: 0, lineItems: [{ description: "Enterprise Plan - Annual", amount: 65000 }, { description: "Multi-region surcharge", amount: 7000 }] },
    { id: "INV-3006", tenant: "CloudLearn Pro", amount: 800, status: "draft", dueDate: "2026-03-20", overdueDays: 0, lineItems: [{ description: "Starter Trial Plan", amount: 800 }] },
  ],
  incidents: [
    { id: "INC-001", severity: "critical", title: "GPU cluster capacity exhausted in ap-south-1", impactedClusters: ["gpu-cluster-mumbai-1"], impactedTenants: ["DataScience Bootcamp"], status: "active", owner: "Infra Team", createdAt: "2026-02-28T15:00:00Z" },
    { id: "INC-002", severity: "major", title: "High latency on storage pool EU-WEST-1", impactedClusters: ["storage-eu-west-1"], impactedTenants: ["Corporate L&D Co"], status: "investigating", owner: "Storage Team", createdAt: "2026-02-28T13:00:00Z" },
    { id: "INC-003", severity: "minor", title: "Intermittent DNS resolution failures", impactedClusters: ["net-ap-south-1"], impactedTenants: ["DevOps Academy", "SkillBridge Labs"], status: "resolved", owner: "Network Team", createdAt: "2026-02-27T20:00:00Z" },
  ],
  tenantRequests: [
    { id: "REQ-001", tenant: "DevOps Academy", type: "quota_increase", details: "Requesting CPU quota increase from 500 to 750 for upcoming AWS certification batch of 200 students", status: "pending", requestedAt: "2026-02-28T10:00:00Z", requestedBy: "Rajesh Kumar" },
    { id: "REQ-002", tenant: "DataScience Bootcamp", type: "credit_request", details: "Credit request of ₹5,000 due to GPU provisioning failures impacting ML Cohort #5", status: "pending", requestedAt: "2026-02-28T15:30:00Z", requestedBy: "Priya Sharma" },
    { id: "REQ-003", tenant: "Corporate L&D Co", type: "po_approval", details: "PO #PO-2026-0312 for Q2 Annual Enterprise renewal - ₹72,000", status: "pending", requestedAt: "2026-02-27T09:00:00Z", requestedBy: "Mike Chen" },
    { id: "REQ-004", tenant: "SkillBridge Labs", type: "template_publish", details: "Custom Terraform Lab template ready for review and publication", status: "pending", requestedAt: "2026-02-26T16:00:00Z", requestedBy: "Amit Patel" },
  ],
}));
