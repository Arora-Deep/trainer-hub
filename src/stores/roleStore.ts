import { create } from "zustand";

export type Role = "cloudadda" | "trainer" | "student";

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: "trainer",
  setRole: (role) => set({ role }),
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
