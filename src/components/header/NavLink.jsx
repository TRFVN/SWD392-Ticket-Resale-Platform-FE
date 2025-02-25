import React, { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, Ticket, TrendingUp, Compass } from "lucide-react";

/**
 * NavLinks - Navigation links component for header
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle navigation
 * @param {string} [props.activePath] - Current active path for highlighting
 * @param {string} [props.className] - Optional additional CSS classes
 * @param {boolean} [props.isMobile] - Whether the component is rendered in mobile view
 */
export const NavLinks = memo(
  ({ onNavigate, activePath = "", className = "", isMobile = false }) => {
    // Default navigation items
    const navItems = [
      {
        icon: Calendar,
        text: "Browse Events",
        path: "/events",
        description: "Find upcoming events near you",
      },
      {
        icon: Ticket,
        text: "Browse Tickets",
        path: "/tickets",
        description: "Get tickets for your favorite events",
      },
    ];

    // Animation variants for list items
    const itemVariants = {
      hover: {
        x: 4,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
      },
    };

    // Render mobile version
    if (isMobile) {
      return (
        <div className={`flex flex-col space-y-2 w-full ${className}`}>
          {navItems.map((item) => {
            const isActive = activePath === item.path;

            return (
              <motion.button
                key={item.path}
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => onNavigate(item.path)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl
                ${
                  isActive
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/70"
                }
                transition-all duration-200`}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg
                ${
                  isActive
                    ? "bg-white dark:bg-gray-700 text-orange-500"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }
                shadow-sm transition-colors`}
                >
                  <item.icon className="w-5 h-5" />
                </div>

                <div className="flex flex-col flex-1">
                  <span className="font-medium">{item.text}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="nav-active-mobile"
                    className="w-1.5 h-1.5 rounded-full bg-orange-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      );
    }

    // Render desktop version
    return (
      <div className={`hidden md:flex items-center gap-4 ${className}`}>
        {navItems.map((item) => {
          const isActive = activePath === item.path;

          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate(item.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl 
              relative overflow-hidden group
              ${
                isActive
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-gray-700 dark:text-gray-300"
              }
              transition-all duration-300`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Background highlight */}
              <span
                className={`absolute inset-0 rounded-xl transition-opacity duration-300
              ${
                isActive
                  ? "bg-orange-50 dark:bg-orange-900/20 opacity-100"
                  : "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800/50 dark:to-gray-700/50 opacity-0 group-hover:opacity-100"
              }`}
              />

              {/* Icon */}
              <item.icon className="w-5 h-5 text-orange-500 relative z-10" />

              {/* Text */}
              <span
                className="font-medium relative z-10 
              group-hover:text-orange-600 dark:group-hover:text-orange-400 
              transition-colors"
              >
                {item.text}
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 
                  w-1.5 h-1.5 rounded-full bg-orange-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  },
);
export default NavLinks;
