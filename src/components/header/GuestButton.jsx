import React, { memo } from "react";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

/**
 * GuestButtons - Component displaying login and registration buttons for guest users
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Function to handle navigation
 * @param {string} [props.className] - Optional additional CSS classes
 * @param {boolean} [props.isMobile] - Whether the component is rendered in mobile view
 */
export const GuestButtons = memo(
  ({ onNavigate, className = "", isMobile = false }) => {
    // Animation variants
    const buttonVariants = {
      hover: { scale: 1.03 },
      tap: { scale: 0.97 },
    };

    // Mobile layout
    if (isMobile) {
      return (
        <div className={`flex flex-col space-y-3 w-full ${className}`}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onNavigate("/login")}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
            bg-gradient-to-r from-orange-500 to-orange-600
            text-white font-medium shadow-sm hover:shadow-md
            hover:from-orange-600 hover:to-orange-700
            transition-all duration-300"
            aria-label="Log in to your account"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => onNavigate("/signup")}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl
            border-2 border-orange-500 text-orange-600 dark:text-orange-500
            font-medium bg-transparent relative overflow-hidden group
            hover:text-orange-700 dark:hover:text-orange-400
            transition-all duration-300"
            aria-label="Create a new account"
          >
            <span
              className="absolute inset-0 bg-orange-50 dark:bg-orange-950/10 
            opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
            />
            <UserPlus className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Register</span>
          </motion.button>
        </div>
      );
    }

    // Desktop layout
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onNavigate("/login")}
          className="px-4 py-2 rounded-xl
          bg-gradient-to-r from-orange-500 to-orange-600
          text-white font-medium shadow-sm hover:shadow-md
          hover:from-orange-600 hover:to-orange-700
          transition-all duration-300 flex items-center gap-2 
          focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Log in to your account"
        >
          <LogIn className="w-4 h-4" />
          <span>Login</span>
        </motion.button>

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onNavigate("/signup")}
          className="px-4 py-2 rounded-xl border border-orange-500 
          text-orange-500 font-medium relative overflow-hidden group
          transition-all duration-300 flex items-center gap-2
          focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          aria-label="Create a new account"
        >
          <span
            className="absolute inset-0 bg-gradient-to-r from-orange-50 to-orange-100 
          dark:from-orange-950/10 dark:to-orange-900/10 opacity-0 
          group-hover:opacity-100 transition-opacity rounded-xl"
          />
          <UserPlus className="w-4 h-4 relative z-10" />
          <span
            className="relative z-10 group-hover:text-orange-600 dark:group-hover:text-orange-400 
          transition-colors"
          >
            Register
          </span>
        </motion.button>
      </div>
    );
  },
);

export default GuestButtons;
