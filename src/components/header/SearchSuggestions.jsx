import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "./const/animations";
import { recentSearches, trendingSearches } from "./const/data";

export const SearchSuggestions = ({ isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      >
        <div className="p-4">
          {/* Recent Searches */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-full
                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Trending Searches */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Trending Now
            </h3>
            <div className="space-y-2">
              {trendingSearches.map((search) => (
                <button
                  key={search.text}
                  className="flex items-center justify-between w-full px-3 py-2 
                    text-sm text-gray-700 dark:text-gray-300 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span>{search.text}</span>
                  <span className="text-green-500 text-xs font-medium">
                    {search.trend}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
