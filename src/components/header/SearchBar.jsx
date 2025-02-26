import React, { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

// Predefined animation variants
const focusRingVariants = {
  focused: {
    opacity: 1,
    scale: 1,
  },
  unfocused: {
    opacity: 0,
    scale: 0.98,
  },
};

const clearButtonVariants = {
  hidden: { opacity: 0, scale: 0.8, width: 0 },
  visible: { opacity: 1, scale: 1, width: "auto" },
  exit: { opacity: 0, scale: 0.8, width: 0 },
};

const iconButtonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

export const SearchBar = memo(
  ({
    value,
    onChange,
    onFocus,
    onClear,
    placeholder = "Search events, artists, or venues...",
    showFilter = true,
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    // Memoized handlers to avoid recreating functions on each render
    const handleFocus = useCallback(
      (e) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        onChange({ target: { value: "" } });
      }
    }, [onClear, onChange]);

    return (
      <div className="relative w-full group">
        {/* Animated focus ring with optimized rendering */}
        <motion.div
          initial={false}
          animate={isFocused ? "focused" : "unfocused"}
          variants={focusRingVariants}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-full bg-orange-500/15 dark:bg-orange-500/30 -z-10 
          shadow-[0_0_0_2px_rgba(249,115,22,0.2)] dark:shadow-[0_0_0_2px_rgba(249,115,22,0.4)]"
        />

        {/* Input with leading search icon */}
        <div className="relative">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300
          flex items-center justify-center"
          >
            <Search
              className={`w-5 h-5 transition-colors duration-300 
            ${isFocused ? "text-orange-500 dark:text-orange-400" : ""}`}
            />
          </div>

          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-label="Search"
            className="w-full py-3 px-5 pl-12 pr-24 rounded-full 
            bg-gray-100/80 dark:bg-gray-700/90 backdrop-blur-sm
            border border-gray-200 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:border-orange-400 dark:focus:border-orange-500
            placeholder-gray-500 dark:placeholder-gray-300
            transition-all duration-300"
          />

          {/* Action buttons container - optimized for fewer DOM operations */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1
          bg-gray-100/60 dark:bg-gray-700/60 rounded-full backdrop-blur-sm pr-1"
          >
            {/* Clear button - only shown when there's text */}
            <AnimatePresence>
              {value && (
                <motion.button
                  variants={clearButtonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white
                  hover:bg-gray-200/80 dark:hover:bg-gray-600/80 rounded-full
                  transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Filter button */}
            {showFilter && (
              <motion.button
                variants={iconButtonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Filter search results"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white
                hover:bg-gray-200/80 dark:hover:bg-gray-600/80 rounded-full
                transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            )}

            {/* Search button */}
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Submit search"
              className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 
              hover:from-orange-600 hover:to-orange-700
              text-white rounded-full shadow-sm
              transition-all duration-200"
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Subtle decorative elements with optimized opacity transition */}
        <div className="absolute left-10 top-0 w-6 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute right-10 bottom-0 w-6 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/30 to-orange-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  },
);

export default SearchBar;
