import React from "react";
import { motion } from "framer-motion";

/**
 * Mobile menu hamburger button with animation
 */
const MobileMenuButton = ({ isOpen, onClick }) => {
  const transition = { duration: 0.3 };

  // Line animations
  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 6 },
  };

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  };

  const bottomLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 },
  };

  return (
    <button
      className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full block"
          variants={topLineVariants}
          animate={isOpen ? "open" : "closed"}
          transition={transition}
        />
        <motion.span
          className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full block"
          variants={middleLineVariants}
          animate={isOpen ? "open" : "closed"}
          transition={transition}
        />
        <motion.span
          className="w-full h-0.5 bg-gray-600 dark:bg-gray-300 rounded-full block"
          variants={bottomLineVariants}
          animate={isOpen ? "open" : "closed"}
          transition={transition}
        />
      </div>
    </button>
  );
};

export default MobileMenuButton;
