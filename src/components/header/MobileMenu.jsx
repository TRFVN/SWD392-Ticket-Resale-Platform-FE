import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Heart,
  ShoppingCart,
  Bell,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { IconButton } from "./IconButton";
import { SearchBar } from "./SearchBar";

export const MobileMenu = ({
  isOpen,
  onClose,
  searchValue,
  setSearchValue,
  handleLogout,
  isDarkMode,
  dispatch,
  toggleTheme,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm 
            bg-white dark:bg-gray-900 z-50 overflow-y-auto"
        >
          {/* Mobile Menu Content */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Menu
                </h2>
                <IconButton icon={X} onClick={onClose} />
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {/* Quick Actions */}
            <div className="p-4 grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: "Upcoming", badge: "5" },
                { icon: Heart, label: "Wishlist", badge: "3" },
                { icon: ShoppingCart, label: "Cart", badge: "2" },
                { icon: Bell, label: "Notifications", badge: "3" },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex flex-col items-center justify-center p-4
                    bg-gray-50 dark:bg-gray-800 rounded-lg
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    transition-colors relative"
                >
                  <action.icon className="w-6 h-6 text-gray-700 dark:text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {action.label}
                  </span>
                  {action.badge && (
                    <span
                      className="absolute top-2 right-2 bg-orange-500 
                      text-white text-xs rounded-full w-5 h-5 
                      flex items-center justify-center"
                    >
                      {action.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="mx-4 flex items-center justify-center px-4 py-2
                text-sm text-gray-700 dark:text-gray-200 rounded-lg
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-2" />
                  Dark Mode
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-auto mx-4 mb-4 flex items-center justify-center px-4 py-2
                text-sm text-red-600 dark:text-red-400 rounded-lg
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
