import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig";
import { subscribeToCartUpdates } from "../utils/cartEvents";

/**
 * Custom hook to manage navigation items and state
 * Includes support for responsive prioritization
 */
export const useNavigationItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("events");
  const [cartCount, setCartCount] = useState(0);

  // Get user role from localStorage instead of Redux
  const userRole = localStorage.getItem("userRole");

  // Define base navigation items with priority flags
  const baseNavItems = [
    { id: "events", label: "Sự Kiện", path: "/events", priority: 100 }, // Highest priority
    { id: "tickets", label: "Vé", path: "/tickets", priority: 90 },
    {
      id: "venues",
      label: "Địa Điểm",
      path: "/venues",
      priority: 80,
      secondary: true,
    }, // Can be hidden on narrow screens
  ];

  // Add "Tạo Sự Kiện" option only if user role is not "MEMBER"
  const navItems = [...baseNavItems];

  if (userRole && userRole !== "MEMBER") {
    navItems.push({
      id: "create",
      label: "Tạo Sự Kiện",
      path: "/create-event",
      badge: "Mới",
      priority: 85,
      secondary: true,
    });

    navItems.push({
      id: "myevents",
      label: "Sự Kiện Của Tôi",
      path: "/my-events",
      priority: 83,
      secondary: true,
    });
  }

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

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getInitialActiveTab());
  }, [location.pathname]);

  // Fetch cart items count
  const fetchCartCount = async () => {
    try {
      const response = await axiosInstance.get("api/Cart");

      if (response.data.isSuccess && Array.isArray(response.data.result)) {
        setCartCount(response.data.result.length);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // Fetch cart count
  useEffect(() => {
    fetchCartCount();

    // Set up polling to refresh cart count every minute
    const intervalId = setInterval(fetchCartCount, 60000);

    // Subscribe to cart update events
    const unsubscribe = subscribeToCartUpdates(() => {
      fetchCartCount();
    });

    return () => {
      clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  // Handle navigation using React Router
  const handleNavigation = (path) => {
    navigate(path);
  };

  return {
    navItems,
    activeTab,
    setActiveTab,
    handleNavigation,
    cartCount,
  };
};
