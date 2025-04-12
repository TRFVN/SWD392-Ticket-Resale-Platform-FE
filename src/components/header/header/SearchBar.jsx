import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Enhanced, accessible search bar component with improved UX
 *
 * Features:
 * - Smoother animations with reduced layout shifts
 * - Enhanced accessibility with ARIA attributes
 * - Improved search suggestions with keyboard navigation
 * - Better visual feedback for interactive states
 * - Optimized performance with memoization
 */
const SearchBar = ({ mini = false, isCompactMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Sample suggestions - in a real app, these would come from an API/state
  const suggestions = [
    { id: 1, text: "Concert", type: "category" },
    { id: 2, text: "Festival", type: "category" },
    { id: 3, text: "Workshop", type: "category" },
    { id: 4, text: "Conference", type: "event" },
  ].filter(
    (suggestion) =>
      searchValue &&
      suggestion.text.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // Handle outside clicks to collapse search
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
        setSelectedSuggestion(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Memoized toggle function
  const toggleSearch = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchValue("");
      setSelectedSuggestion(-1);
    }
  }, [isExpanded]);

  // Memoized clear function
  const clearSearch = useCallback((e) => {
    e.stopPropagation();
    setSearchValue("");
    setSelectedSuggestion(-1);
    inputRef.current.focus();
  }, []);

  // Enhanced search submission with suggestion support
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        // Use the selected suggestion
        const suggestion = suggestions[selectedSuggestion].text;
        navigate(
          `/search?q=${encodeURIComponent(suggestion)}&type=${
            suggestions[selectedSuggestion].type
          }`,
        );
      } else if (searchValue.trim()) {
        // Use the manual input
        navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      }

      setIsExpanded(false);
      setSelectedSuggestion(-1);
    },
    [searchValue, navigate, selectedSuggestion, suggestions],
  );

  // Handle keyboard navigation through suggestions
  const handleKeyDown = useCallback(
    (e) => {
      if (!suggestions.length) return;

      // Arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      }
      // Arrow up
      else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestion((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      }
      // Escape
      else if (e.key === "Escape") {
        setIsExpanded(false);
        setSelectedSuggestion(-1);
      }
    },
    [suggestions.length],
  );

  // Animation variants for search components
  const searchButtonVariants = {
    rest: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      rotate: 15,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.9,
      rotate: 0,
      transition: { duration: 0.1 },
    },
  };

  const inputVariants = {
    collapsed: {
      width: 36,
      opacity: 0.5,
    },
    expanded: {
      width: mini ? "10rem" : "14rem",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const bgPulseVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
    },
    animate: {
      opacity: [0, 0.5, 0.2],
      scale: [0.95, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
      },
    },
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="font-medium text-primary">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.form
            key="search-form"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={inputVariants}
            className="relative"
            onSubmit={handleSubmit}
            role="search"
          >
            {/* Animated background gradient */}
            <motion.div
              className={`absolute inset-0 rounded-full 
                ${
                  isCompactMode
                    ? "bg-gradient-to-r from-primary/30 to-primary/10 dark:from-primary/20 dark:to-primary/10"
                    : "bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5"
                } 
                blur-sm`}
              initial="initial"
              animate="animate"
              exit="initial"
              variants={bgPulseVariants}
            />

            {/* Enhanced search input with improved accessibility */}
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSelectedSuggestion(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={mini ? "Tìm kiếm..." : "Tìm kiếm sự kiện..."}
              className={`w-full ${
                mini ? "h-7 pl-7 pr-7 text-[0.65rem]" : "h-8 pl-8 pr-8 text-xs"
              } rounded-full border-none 
                ${
                  isCompactMode
                    ? "bg-light-primary/90 dark:bg-dark-secondary/90 shadow-md"
                    : "bg-light-primary/80 dark:bg-dark-secondary/90 shadow-sm"
                }
                backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                transition-all duration-300`}
              aria-label="Search"
              aria-expanded={suggestions.length > 0}
              aria-autocomplete="list"
              aria-controls={
                suggestions.length > 0 ? "search-suggestions" : undefined
              }
              aria-activedescendant={
                selectedSuggestion >= 0
                  ? `suggestion-${suggestions[selectedSuggestion]?.id}`
                  : undefined
              }
            />

            {/* Animated search icon with enhanced feedback */}
            <motion.div
              className={`absolute ${
                mini ? "left-2 top-1.5" : "left-2.5 top-2"
              } text-primary`}
              animate={{
                scale: searchValue ? [1, 1.2, 1] : 1,
                rotate: searchValue ? [0, 15, 0] : 0,
              }}
              transition={{
                duration: 0.5,
                repeat: searchValue ? 0 : Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            >
              <Search size={mini ? 12 : 14} strokeWidth={2.5} />
            </motion.div>

            {/* Clear button with enhanced animation */}
            {searchValue && (
              <motion.button
                type="button"
                onClick={clearSearch}
                className={`absolute ${
                  mini ? "right-2 top-1.5" : "right-2.5 top-2"
                } text-gray-400 hover:text-gray-600 dark:hover:text-gray-200`}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                aria-label="Clear search"
              >
                <X size={mini ? 12 : 14} />
              </motion.button>
            )}

            {/* Enhanced suggestion dropdown */}
            {searchValue && suggestions.length > 0 && !mini && (
              <motion.div
                id="search-suggestions"
                className="absolute top-full left-0 right-0 mt-2 py-1.5 
                  bg-light-primary dark:bg-dark-primary rounded-xl shadow-lg
                  border border-gray-200 dark:border-dark-accent z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                role="listbox"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3 pb-1">
                  Đề xuất
                </div>

                {suggestions.map((suggestion, i) => (
                  <motion.div
                    key={suggestion.id}
                    id={`suggestion-${suggestion.id}`}
                    className={`w-full text-left px-3 py-1.5 text-xs 
                      ${
                        selectedSuggestion === i
                          ? "bg-primary/10 dark:bg-primary/20"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      } 
                      flex items-center justify-between cursor-pointer`}
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: { delay: i * 0.05 },
                    }}
                    onClick={() => {
                      setSelectedSuggestion(i);
                      handleSubmit({ preventDefault: () => {} });
                    }}
                    role="option"
                    aria-selected={selectedSuggestion === i}
                  >
                    <div className="flex items-center">
                      <Search size={10} className="mr-2 text-gray-400" />
                      {highlightMatch(suggestion.text, searchValue)}

                      {/* Type badge for better category distinction */}
                      <span
                        className={`ml-2 px-1 text-[0.6rem] rounded-full
                        ${
                          suggestion.type === "category"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        }`}
                      >
                        {suggestion.type}
                      </span>
                    </div>

                    {/* Arrow indicator for selection */}
                    {selectedSuggestion === i && (
                      <ArrowRight size={10} className="text-primary" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.button
            key="search-button"
            variants={searchButtonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={toggleSearch}
            className={`relative ${mini ? "h-7 w-7" : "h-8 w-8"} rounded-full 
              ${
                isCompactMode
                  ? "bg-primary/20 dark:bg-gray-700 shadow-md"
                  : "bg-primary/10 dark:bg-gray-800 shadow-sm"
              }
              flex items-center justify-center text-primary dark:text-primary-light 
              hover:bg-primary/20 dark:hover:bg-gray-700 transition-colors`}
            aria-label="Open search"
          >
            {/* Pulsing background effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/5 dark:bg-primary/10"
              animate={{
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            <Search size={mini ? 13 : 15} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Memoize for better performance
export default memo(SearchBar);
