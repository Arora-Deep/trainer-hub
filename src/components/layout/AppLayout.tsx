import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-[240px] transition-all duration-300 has-[aside.w-\\[68px\\]]:pl-[68px]">
        <AppHeader />
        <main className="p-6 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
