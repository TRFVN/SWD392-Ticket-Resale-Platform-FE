import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import StaffHeader from "../components/layout/StaffHeader";
import StaffSidebar from "../components/layout/StaffSidebar";
import { useSelector } from "react-redux";

function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const pathParts = location.pathname.split("/");
  const lastPath = pathParts[pathParts.length - 1];
  const [currentPath, setCurrentPath] = useState("");
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleChangePath = (newPath) => {
    navigate(newPath);
  };
  useEffect(() => {
    setCurrentPath(lastPath);
  }, [lastPath]);

  // Handle dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDarkMode]);

  return (
    <div className="dark:bg-gray-900 transition-colors duration-200">
      <StaffHeader />

      <div
        className={`${
          showSidebar ? "grid grid-cols-8" : "flex"
        } flex-row justify-start items-start w-full min-h-screen 
        dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <div
          className={`${
            showSidebar ? "col-span-1 w-full" : "w-[4%]"
          } min-h-screen dark:bg-gray-800 transition-colors duration-200`}
        >
          <StaffSidebar
            toggleSidebar={toggleSidebar}
            showSidebar={showSidebar}
            currentPath={currentPath}
            handleChangePath={handleChangePath}
          />
        </div>
        <div
          className={`${
            showSidebar ? "col-span-7 w-full" : "w-[96%]"
          } bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200`}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaffLayout;
