import { create } from "zustand";

export type Role = "cloudadda" | "trainer" | "student";
export type AdminSubRole = "super_admin" | "ops" | "finance" | "support" | "sales" | "auditor";

interface RoleState {
  role: Role;
  adminSubRole: AdminSubRole;
  setRole: (role: Role) => void;
  setAdminSubRole: (r: AdminSubRole) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: "trainer",
  adminSubRole: "super_admin",
  setRole: (role) => set({ role }),
  setAdminSubRole: (adminSubRole) => set({ adminSubRole }),
}));

export const roleLabels: Record<Role, string> = {
  cloudadda: "CloudAdda Admin",
  trainer: "Trainer Portal",
  student: "Student Portal",
};

export const roleDashboardPaths: Record<Role, string> = {
  cloudadda: "/admin/dashboard",
  trainer: "/",
  student: "/student/dashboard",
};

/** Pricing visible only to super admin & finance roles. */
export const canViewPricing = (sub: AdminSubRole) =>
  sub === "super_admin" || sub === "finance";
