import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/layout/Footer";
import StaffHeader from "../components/layout/StaffHeader";
import StaffSidebar from "../components/layout/StaffSidebar";

function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  const pathParts = location.pathname.split("/");
  const lastPath = pathParts[pathParts.length - 1];
  const [currentPath, setCurrentPath] = useState("");
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const handleChangePath = (newPath) => {
    navigate(newPath);
  };
  useEffect(() => {
    setCurrentPath(lastPath);
  }, [lastPath]);
  return (
    <div>
      <StaffHeader />

      <div
        className={`${
          showSidebar ? "grid grid-cols-8" : "flex"
        } flex-row justify-start items-start w-full min-h-screen`}
      >
        <div
          className={`${
            showSidebar ? "col-span-1 w-full" : "w-[4%]"
          } min-h-screen`}
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
          } bg-gray-50 min-h-screen`}
        >
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default StaffLayout;
