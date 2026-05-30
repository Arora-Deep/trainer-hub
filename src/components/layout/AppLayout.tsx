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
      {isStudent && (
        <>
          <span
            className="sp-orb animate-float-soft"
            style={{
              top: -120, left: -120, height: 420, width: 420,
              background: "radial-gradient(circle, hsl(var(--xp) / 0.55), transparent 70%)",
              animationDuration: "9s",
            }}
          />
          <span
            className="sp-orb animate-float-soft"
            style={{
              top: 120, right: -160, height: 460, width: 460,
              background: "radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)",
              animationDuration: "11s",
              animationDelay: "1s",
            }}
          />
          <span
            className="sp-orb animate-float-soft"
            style={{
              bottom: -180, left: "30%", height: 520, width: 520,
              background: "radial-gradient(circle, hsl(var(--tier-architect) / 0.45), transparent 70%)",
              animationDuration: "13s",
              animationDelay: "2s",
            }}
          />
        </>
      )}
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
