import { useRoleStore, type AdminSubRole, canViewPricing } from "@/stores/roleStore";

export function IfFinance({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const sub = useRoleStore((s) => s.adminSubRole);
  return canViewPricing(sub) ? <>{children}</> : <>{fallback}</>;
}

export function IfAdminRole({ roles, children, fallback = null }: { roles: AdminSubRole[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const sub = useRoleStore((s) => s.adminSubRole);
  return roles.includes(sub) ? <>{children}</> : <>{fallback}</>;
}
