import React from "react";
import { motion } from "framer-motion";

export const SocialButton = ({ icon: Icon, label, onClick, iconColor }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full inline-flex justify-center items-center py-2.5 px-4 
              border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
              bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
  >
    <Icon className={`h-4 w-4 ${iconColor}`} />
    <span className="ml-2 text-xs sm:text-sm">{label}</span>
  </motion.button>
);
