import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useRoleStore } from "@/stores/roleStore";

export function AppLayout() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const role = useRoleStore((s) => s.role);
  const isStudent = role === "student";

  return (
    <div className={`min-h-screen bg-background ${isStudent ? "student-portal" : ""}`}>

      <AppSidebar />
      <div
        className="transition-all duration-200"
        style={{ paddingLeft: collapsed ? 60 : 230 }}
      >
        <AppHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
