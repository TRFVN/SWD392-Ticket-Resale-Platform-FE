import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Modern, expandable search bar component
 */

const SearchBar = ({ mini = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside clicks to collapse search
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
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

  // Toggle search expansion
  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSearchValue("");
    }
  };

  // Clear search input
  const clearSearch = (e) => {
    e.stopPropagation();
    setSearchValue("");
    inputRef.current.focus();
  };

  // Handle search submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Sử dụng React Router để điều hướng đến trang tìm kiếm
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.form
            initial={{ width: 36, opacity: 0.5 }}
            animate={{ width: mini ? "10rem" : "14rem", opacity: 1 }}
            exit={{ width: 36, opacity: 0 }}
            className="relative"
            onSubmit={handleSubmit}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={mini ? "Tìm kiếm..." : "Tìm kiếm sự kiện..."}
              className={`w-full ${
                mini ? "h-7 pl-7 pr-7 text-[0.65rem]" : "h-8 pl-8 pr-8 text-xs"
              } rounded-full border-none bg-light-primary/80 dark:bg-dark-secondary/90 backdrop-blur-sm
                focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm`}
            />

            {/* Animated pulsing search icon */}
            <motion.div
              className={`absolute ${
                mini ? "left-2 top-1.5" : "left-2.5 top-2"
              } text-primary`}
              animate={{
                scale: searchValue ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: searchValue ? 0 : Infinity,
                repeatType: "reverse",
                repeatDelay: 2,
              }}
            >
              <Search size={mini ? 12 : 14} />
            </motion.div>

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
              >
                <X size={mini ? 12 : 14} />
              </motion.button>
            )}

            {/* Suggestion dropdown if typing - hide on mini mode */}
            {searchValue && !mini && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 py-1.5 bg-light-primary dark:bg-dark-primary rounded-xl shadow-lg border border-gray-200 dark:border-dark-accent z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3 pb-1">
                  Đề xuất
                </div>
                {["Concert", "Festival", "Workshop", "Conference"].map(
                  (suggestion, i) => (
                    <motion.button
                      key={suggestion}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: i * 0.05 },
                      }}
                    >
                      <Search size={10} className="mr-2 text-gray-400" />
                      {suggestion
                        .toLowerCase()
                        .includes(searchValue.toLowerCase()) ? (
                        <>
                          {suggestion.substring(
                            0,
                            suggestion
                              .toLowerCase()
                              .indexOf(searchValue.toLowerCase()),
                          )}
                          <span className="font-medium text-primary">
                            {suggestion.substring(
                              suggestion
                                .toLowerCase()
                                .indexOf(searchValue.toLowerCase()),
                              suggestion
                                .toLowerCase()
                                .indexOf(searchValue.toLowerCase()) +
                                searchValue.length,
                            )}
                          </span>
                          {suggestion.substring(
                            suggestion
                              .toLowerCase()
                              .indexOf(searchValue.toLowerCase()) +
                              searchValue.length,
                          )}
                        </>
                      ) : (
                        suggestion
                      )}
                    </motion.button>
                  ),
                )}
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSearch}
            className={`relative ${
              mini ? "h-7 w-7" : "h-8 w-8"
            } rounded-full bg-primary/10 dark:bg-gray-800 flex items-center 
              justify-center text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-gray-700 transition-colors shadow-sm`}
            aria-label="Search"
          >
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

export default SearchBar;
