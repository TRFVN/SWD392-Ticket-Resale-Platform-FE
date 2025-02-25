import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";

export const SearchBar = ({
  value,
  onChange,
  onFocus,
  onClear,
  placeholder = "Search events, artists, or venues...",
  showFilter = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle input focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle clearing the input
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <div className="relative w-full group">
      {/* Animated focus ring */}
      <motion.div
        initial={false}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.98,
        }}
        className="absolute inset-0 rounded-full bg-orange-500/10 dark:bg-orange-500/20 -z-10 
          shadow-[0_0_0_2px_rgba(249,115,22,0.2)] dark:shadow-[0_0_0_2px_rgba(249,115,22,0.3)]"
      />

      {/* Input with leading search icon */}
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500
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
            bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:border-orange-400 dark:focus:border-orange-500
            placeholder-gray-500 dark:placeholder-gray-400
            transition-all duration-300"
        />

        {/* Action buttons container */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1
          bg-gray-100/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm pr-1"
        >
          {/* Clear button - only shown when there's text */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                aria-label="Clear search"
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                  hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full
                  transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Filter button */}
          {showFilter && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Filter search results"
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                hover:bg-gray-200/80 dark:hover:bg-gray-700/80 rounded-full
                transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          )}

          {/* Search button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
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

      {/* Subtle decorative elements for modern look */}
      <div className="absolute left-10 top-0 w-6 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute right-10 bottom-0 w-6 h-1 bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-400/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default SearchBar;
