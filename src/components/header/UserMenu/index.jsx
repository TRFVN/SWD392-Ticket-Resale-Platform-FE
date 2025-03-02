import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { User, LogOut, Settings, Ticket, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

/**
 * User profile menu component
 */
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

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

  // Animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -5 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative" ref={menuRef}>
      {isAuthenticated ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full group"
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary-light to-primary rounded-full opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.5 }}
            />

            {/* Avatar image */}
            <motion.div className="relative">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}&background=random`
                }
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm relative z-10"
              />

              {/* Rotating notification indicator */}
              <motion.div
                className="absolute -top-1 -right-1 z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="relative flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-xs font-bold"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/50"
                    animate={{
                      scale: [1, 1.25, 1],
                      opacity: [0.7, 0.3, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                  />
                  <span>2</span>
                </motion.div>
              </motion.div>

              {/* Online indicator */}
              <motion.span
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800 z-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
                style={{ transformOrigin: "top right" }}
              >
                {/* User info */}
                <motion.div
                  variants={itemVariants}
                  className="px-4 py-2 border-b border-gray-200 dark:border-gray-800"
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </motion.div>

                {/* Menu items */}
                <div className="py-1">
                  <MenuItem
                    icon={User}
                    label="Hồ sơ"
                    path="/profile"
                    variants={itemVariants}
                  />
                  <MenuItem
                    icon={Ticket}
                    label="Vé của tôi"
                    path="/my-tickets"
                    variants={itemVariants}
                  />
                  <MenuItem
                    icon={Plus}
                    label="Tạo sự kiện"
                    path="/create-event"
                    variants={itemVariants}
                  />
                  <MenuItem
                    icon={Settings}
                    label="Cài đặt"
                    path="/settings"
                    variants={itemVariants}
                  />
                </div>

                {/* Logout */}
                <motion.div
                  variants={itemVariants}
                  className="pt-1 mt-1 border-t border-gray-200 dark:border-gray-800"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light"
            >
              Đăng nhập
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full shadow-sm"
            >
              Đăng ký
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Menu item component
const MenuItem = ({ icon: Icon, label, path, variants }) => (
  <motion.div variants={variants}>
    <Link
      to={path}
      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
    >
      {Icon && <Icon size={16} className="mr-2" />}
      {label}
    </Link>
  </motion.div>
);

export default UserMenu;
