import React, { useState } from "react";
import ManagerSidebar from "../components/layout/ManagerSidebar";
import ManagerHeader from "../components/layout/ManagerHeader";
import { Outlet } from "react-router-dom";
const Tabs = [
  {
    id: 1,
    label: "Dashboard",
  },
  {
    id: 2,
    label: "Category",
  },
  {
    id: 3,
    label: "Event",
  },
  {
    id: 4,
    label: "Ticket",
  },
  {
    id: 5,
    label: "Account",
  },
  {
    id: 6,
    label: "Message",
  },
  {
    id: 7,
    label: "Reports",
  },
  {
    id: 8,
    label: "Setting",
  },
];
const ManagerLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Collapse cho desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Toggle cho mobile
  const [currentTab, setCurrentTab] = useState("Dashboard");
  return (
    <main className="flex h-screen max-h-screen bg-manager-primary relative overflow-hidden ">
      {/* SIDEBAR DESKTOP */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <ManagerSidebar
          isCollapsed={isCollapsed}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
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
        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default ManagerLayout;
