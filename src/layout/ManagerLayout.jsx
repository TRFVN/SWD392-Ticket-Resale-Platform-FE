import React, { useState } from "react";
import ManagerSidebar from "../components/layout/ManagerSidebar";
import ManagerHeader from "../components/layout/ManagerHeader";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapse cho desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle cho mobile

  return (
    <main className="flex min-h-screen bg-manager-primary relative">
      {/* SIDEBAR DESKTOP */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <ManagerSidebar isCollapsed={isCollapsed} />
      </div>

      {/* SIDEBAR MOBILE */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden flex"
          onClick={() => setIsSidebarOpen(false)}
        >
          {/* SIDEBAR CONTENT */}
          <div
            className="w-64 bg-manager-secondary text-white transition-transform duration-300 ease-in-out transform"
            onClick={(e) => e.stopPropagation()}
            style={{ transform: "translateX(0)" }}
          >
            <ManagerSidebar isCollapsed={false} />
          </div>

          {/* DARK OVERLAY */}
          <div className="flex-1 bg-black bg-opacity-50" />
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <ManagerHeader
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          onToggleMobileSidebar={() => setIsSidebarOpen(true)}
        />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default ManagerLayout;
