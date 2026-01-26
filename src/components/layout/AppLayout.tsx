import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-[240px]">
        <main className="p-6 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
