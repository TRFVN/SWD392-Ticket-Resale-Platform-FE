import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Custom hook to manage navigation items and state
 * Includes support for responsive prioritization
 */
export const useNavigationItems = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Define navigation items with priority flags
  const navItems = [
    { id: "events", label: "Sự Kiện", path: "/events", priority: 100 }, // Highest priority
    { id: "tickets", label: "Vé", path: "/tickets", priority: 90 },
    {
      id: "venues",
      label: "Địa Điểm",
      path: "/venues",
      priority: 80,
      secondary: true,
    }, // Can be hidden on narrow screens
    {
      id: "trending",
      label: "Xu Hướng",
      path: "/trending",
      badge: "Hot",
      priority: 95,
    }, // High priority due to badge
    {
      id: "create",
      label: "Tạo Sự Kiện",
      path: "/create-ticket",
      badge: "Mới",
      priority: 85,
      secondary: true,
    }, // Can be hidden on narrow screens
  ];

  // Determine active tab based on URL
  const getInitialActiveTab = () => {
    const path = location.pathname;

    if (path.startsWith("/events")) return "events";
    if (path.startsWith("/tickets")) return "tickets";
    if (path.startsWith("/venues")) return "venues";
    if (path.startsWith("/trending")) return "trending";
    if (path.startsWith("/create-ticket")) return "create";
    return "events"; // Default
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getInitialActiveTab());
  }, [location.pathname]);

  // Handle navigation using React Router
  const handleNavigation = (path) => {
    navigate(path);
  };

  return {
    navItems,
    activeTab,
    setActiveTab,
    handleNavigation,
  };
};
