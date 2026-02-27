import { create } from "zustand";

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "trial";
  activeBatches: number;
  totalStudents: number;
  activeVMs: number;
  region: string;
  joinedDate: string;
  monthlyUsage: number;
}

interface CustomerState {
  customers: Customer[];
}

export const useCustomerStore = create<CustomerState>(() => ({
  customers: [
    { id: "1", name: "TechSkills Academy", contactPerson: "Rajesh Kumar", email: "rajesh@techskills.com", plan: "enterprise", status: "active", activeBatches: 8, totalStudents: 240, activeVMs: 45, region: "ap-south-1", joinedDate: "2024-06-15", monthlyUsage: 12500 },
    { id: "2", name: "CodeCraft Institute", contactPerson: "Priya Sharma", email: "priya@codecraft.in", plan: "professional", status: "active", activeBatches: 4, totalStudents: 120, activeVMs: 22, region: "us-east-1", joinedDate: "2024-09-01", monthlyUsage: 6800 },
    { id: "3", name: "CloudLearn Pro", contactPerson: "Mike Chen", email: "mike@cloudlearn.io", plan: "professional", status: "active", activeBatches: 3, totalStudents: 85, activeVMs: 15, region: "eu-west-1", joinedDate: "2024-11-10", monthlyUsage: 4200 },
    { id: "4", name: "DevOps Training Co", contactPerson: "Sarah Wilson", email: "sarah@devopstraining.com", plan: "starter", status: "trial", activeBatches: 1, totalStudents: 20, activeVMs: 5, region: "us-west-2", joinedDate: "2025-01-20", monthlyUsage: 800 },
    { id: "5", name: "SkillBridge Labs", contactPerson: "Amit Patel", email: "amit@skillbridge.in", plan: "enterprise", status: "active", activeBatches: 6, totalStudents: 180, activeVMs: 38, region: "ap-south-1", joinedDate: "2024-03-10", monthlyUsage: 9500 },
    { id: "6", name: "NexGen Academy", contactPerson: "Lisa Park", email: "lisa@nexgen.edu", plan: "starter", status: "inactive", activeBatches: 0, totalStudents: 45, activeVMs: 0, region: "ap-southeast-1", joinedDate: "2024-08-05", monthlyUsage: 0 },
  ],
}));
