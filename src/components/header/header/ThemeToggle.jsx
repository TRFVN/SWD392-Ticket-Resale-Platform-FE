import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Sun, Moon } from "lucide-react";
import { toggleTheme } from "../../../store/slice/themeSlice";
/**
 * Animated theme toggle button component
 */
const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="relative h-8 w-8 rounded-full bg-primary/10 dark:bg-gray-800 flex items-center 
        justify-center hover:bg-primary/20 dark:hover:bg-gray-700 transition-colors shadow-sm overflow-hidden"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 ${
          isDarkMode ? "bg-blue-500/20" : "bg-orange-500/20"
        }`}
        animate={{
          rotate: isDarkMode ? 0 : 180,
        }}
        transition={{ duration: 1 }}
      />

      {/* Sun/Moon container with rotation */}
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        {/* Sun rays */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            opacity: isDarkMode ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
                transform: `rotate(${i * 45}deg) translate(8px, 0)`,
              }}
              animate={{
                scale: isDarkMode ? 0 : [1, 1.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: isDarkMode ? 0 : Infinity,
                repeatType: "reverse",
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>

        {/* Sun circle */}
        <motion.div
          initial={false}
          animate={{
            scale: isDarkMode ? 0.5 : 1,
            opacity: isDarkMode ? 0 : 1,
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-3 h-3 rounded-full bg-primary" />
        </motion.div>

        {/* Moon with craters */}
        <motion.div
          initial={false}
          animate={{
            scale: isDarkMode ? 1 : 0.5,
            opacity: isDarkMode ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-300 overflow-hidden">
            <motion.div
              className="absolute w-1.5 h-1.5 rounded-full bg-gray-300/50 dark:bg-gray-400/50"
              style={{ top: "25%", left: "25%" }}
            />
            <motion.div
              className="absolute w-1 h-1 rounded-full bg-gray-300/50 dark:bg-gray-400/50"
              style={{ top: "60%", left: "40%" }}
            />
            <motion.div
              className="absolute w-6 h-6 rounded-full bg-gray-900 dark:bg-gray-800"
              style={{ top: "-25%", left: "60%" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
