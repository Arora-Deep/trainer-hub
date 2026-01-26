import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background bg-mesh">
      <AppSidebar />
      <div className="pl-[260px] transition-all duration-300 has-[aside.w-\\[76px\\]]:pl-[76px]">
        <AppHeader />
        <main className="p-6 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
