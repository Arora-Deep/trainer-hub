import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background/50 backdrop-blur-sm" style={{ background: 'linear-gradient(135deg, hsl(210 40% 96%) 0%, hsl(220 35% 93%) 30%, hsl(240 25% 94%) 60%, hsl(210 40% 96%) 100%)' }}>
      <AppSidebar />
      <div className="pl-[248px] transition-all duration-300 has-[aside.w-\\[68px\\]]:pl-[86px]">
        <AppHeader />
        <main className="p-6 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
