import React, { memo } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggleButton - A modern animated button to toggle between light and dark themes
 *
 * @param {Object} props
 * @param {boolean} props.isDarkMode - Current theme state (true for dark mode)
 * @param {Function} props.onClick - Handler function for theme toggle
 * @param {string} [props.className] - Optional additional CSS classes
 */
export const ThemeToggleButton = memo(
  ({ isDarkMode, onClick, className = "" }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-2.5 rounded-full bg-gray-100/80 dark:bg-gray-800/80 
        hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 
        overflow-hidden group focus:outline-none focus:ring-2 focus:ring-orange-500/50 
        dark:focus:ring-orange-400/50 ${className}`}
        onClick={onClick}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {/* Icon container with transitions */}
        <div className="relative z-10 transition-all duration-500">
          <motion.div
            initial={false}
            animate={{
              rotateY: isDarkMode ? 180 : 0,
              opacity: isDarkMode ? 0 : 1,
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              rotateY: isDarkMode ? 0 : -180,
              opacity: isDarkMode ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center"
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        </div>

        {/* Background glow effect */}
        <motion.div
          initial={false}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`absolute inset-0 bg-gradient-to-tr 
          ${
            isDarkMode
              ? "from-amber-100/10 to-amber-300/10"
              : "from-indigo-300/10 to-indigo-500/10"
          } 
          rounded-full`}
        />

        {/* Hover effect */}
        <span
          className={`absolute inset-0 bg-gradient-to-tr
        ${
          isDarkMode
            ? "from-amber-100/0 to-amber-300/0"
            : "from-indigo-300/0 to-indigo-500/0"
        }
        group-hover:${
          isDarkMode
            ? "from-amber-100/20 to-amber-300/20"
            : "from-indigo-300/20 to-indigo-500/20"
        }
        rounded-full transition-opacity duration-300`}
        />
      </motion.button>
    );
  },
);

export default ThemeToggleButton;
