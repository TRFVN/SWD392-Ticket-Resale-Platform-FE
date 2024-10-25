import { motion } from "framer-motion";

export const IconButton = ({ icon: Icon, onClick, badge, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 
      transition-colors ${className}`}
  >
    <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
    {badge && (
      <span
        className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs 
        rounded-full w-4 h-4 flex items-center justify-center"
      >
        {badge}
      </span>
    )}
  </motion.button>
);
