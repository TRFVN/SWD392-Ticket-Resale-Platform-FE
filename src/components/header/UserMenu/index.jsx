import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { User, LogOut, Settings, Ticket, Plus, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * User profile menu component - simplified modern design
 */
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Get user role from localStorage
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  // Handle clicks outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {isAuthenticated ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform duration-200 hover:scale-105"
          >
            {/* Avatar image with simple online indicator */}
            <div className="relative">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}&background=random`
                }
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              />

              {/* Notification badge - simplified */}
              {user.notifications > 0 && (
                <div className="absolute -top-1 -right-1 z-20 flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold">
                  {user.notifications > 9 ? "9+" : user.notifications}
                </div>
              )}

              {/* Online indicator - simplified */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
            </div>
          </button>

          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-800 z-50 overflow-hidden transition-all duration-200"
              style={{ transformOrigin: "top right" }}
            >
              {/* User info */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1">
                {userRole && userRole !== "ORGANIZATION" && (
                  <>
                    <MenuItem icon={User} label="Hồ sơ" path="/profile" />
                    <MenuItem
                      icon={Ticket}
                      label="Vé của tôi"
                      path="/my-tickets"
                    />
                  </>
                )}
                {userRole && userRole !== "MEMBER" && (
                  <>
                    <MenuItem
                      icon={Plus}
                      label="Tạo sự kiện"
                      path="/create-event"
                    />
                    <MenuItem
                      icon={Calendar}
                      label="Sự kiện của tôi"
                      path="/my-events"
                    />
                  </>
                )}
                <MenuItem icon={Settings} label="Cài đặt" path="/settings" />
              </div>

              {/* Logout */}
              <div className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-2">
          <div className="transition-transform duration-200 hover:translate-y-[-1px]">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
            >
              Đăng nhập
            </Link>
          </div>

          <div className="transition-transform duration-200 hover:translate-y-[-1px]">
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full shadow-sm"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Menu item component - simplified
const MenuItem = ({ icon: Icon, label, path }) => (
  <Link
    to={path}
    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
  >
    {Icon && <Icon size={16} className="mr-2" />}
    {label}
  </Link>
);

export default UserMenu;
