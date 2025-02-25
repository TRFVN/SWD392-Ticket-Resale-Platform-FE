import React, { memo } from "react";
import { motion } from "framer-motion";

/**
 * NavButton - A modern animated button for navigation actions
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Icon component to render (e.g., Lucide icon)
 * @param {string} [props.badge] - Optional badge text to display (e.g., notification count)
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.label - Accessibility label for the button
 * @param {string} [props.className] - Optional additional CSS classes
 * @param {boolean} [props.active] - Whether this button is currently active
 */
export const NavButton = memo(
  ({ icon: Icon, badge, onClick, label, className = "", active = false }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative p-2.5 rounded-full 
        ${
          active
            ? "bg-orange-100 dark:bg-orange-900/30"
            : "bg-gray-100/80 dark:bg-gray-800/80"
        } 
        hover:bg-gray-200 dark:hover:bg-gray-700 
        transition-all duration-300 group focus:outline-none 
        focus:ring-2 focus:ring-orange-500/50 dark:focus:ring-orange-400/50
        ${className}`}
        aria-label={label}
      >
        {/* Icon */}
        <Icon
          className={`w-5 h-5 
        ${
          active
            ? "text-orange-600 dark:text-orange-400"
            : "text-gray-700 dark:text-gray-300"
        } 
        group-hover:text-orange-500 dark:group-hover:text-orange-400 
        transition-colors duration-300`}
        />

        {/* Badge */}
        {badge && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1.5 -right-1.5 min-w-5 h-5 flex items-center justify-center 
            px-1.5 text-xs font-medium text-white
            bg-gradient-to-r from-orange-500 to-orange-600 
            rounded-full border-2 border-white dark:border-gray-900
            shadow-sm transform-gpu origin-center"
          >
            {badge}
          </motion.span>
        )}

        {/* Hover ripple effect */}
        <span
          className="absolute inset-0 rounded-full bg-orange-500/0 
        group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20
        transform scale-0 group-hover:scale-100 
        transition-all duration-300 ease-out"
        />

        {/* Active dot indicator */}
        {active && (
          <motion.span
            layoutId="nav-active-indicator"
            className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 
            w-1.5 h-1.5 rounded-full bg-orange-500"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.button>
    );
  },
);

export default NavButton;
