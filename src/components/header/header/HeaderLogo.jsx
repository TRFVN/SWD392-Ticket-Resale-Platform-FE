import React from "react";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Modern, responsive logo component
 * Supports condensed mode for smaller screens
 */
const HeaderLogo = ({ condensed = false }) => {
  return (
    <motion.div
      className="flex items-center group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to="/" className="flex items-center">
        <div className="relative flex mr-2">
          {/* Logo background with glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary rounded-lg opacity-20 dark:opacity-30 blur-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Ticket icon with bounce effect */}
          <motion.div
            className="relative z-10 bg-gradient-to-br from-primary-light to-primary dark:from-primary dark:to-primary-dark p-1.5 rounded-lg"
            whileHover={{
              rotate: [0, -5, 5, -5, 5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <Ticket size={16} className="text-white" />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <span className="text-base font-bold tracking-tight text-gray-900 dark:text-white">
              Ticket<span className="text-primary">Hub</span>
            </span>
            {/* Badge - hide on condensed mode */}
            {!condensed && (
              <motion.span
                className="ml-1 text-[0.55rem] px-1 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-semibold tracking-wider"
                whileHover={{ y: -2 }}
              >
                Pro
              </motion.span>
            )}
          </motion.div>
          {/* Subtitle - hide on condensed mode */}
          {!condensed && (
            <span className="text-[0.6rem] text-gray-500 dark:text-gray-400 block">
              Nền tảng vé cao cấp
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default HeaderLogo;
