import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";

export const SearchBar = ({ value, onChange, onFocus }) => (
  <div className="relative w-full">
    <input
      type="text"
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      placeholder="Search events, artists, or venues..."
      className="w-full py-3 px-5 pr-12 rounded-full
        bg-gray-100 dark:bg-gray-800 
        border border-gray-300 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        focus:outline-none focus:ring-2 focus:ring-orange-500
        placeholder-gray-500 dark:placeholder-gray-400"
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
      >
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
      >
        <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </motion.button>
    </div>
  </div>
);
