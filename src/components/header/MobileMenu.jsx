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
  Home,
  Ticket,
  Settings,
  HelpCircle,
  User,
  TrendingUp,
  Clock,
} from "lucide-react";

const MenuItem = ({ icon: Icon, label, badge, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200
      hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg
      transition-colors duration-200 group relative w-full"
  >
    <Icon
      className="w-5 h-5 text-gray-500 dark:text-gray-400 
      group-hover:text-orange-500 dark:group-hover:text-orange-400
      transition-colors duration-200"
    />
    <span
      className="ml-3 font-medium group-hover:text-orange-600 
      dark:group-hover:text-orange-400 transition-colors duration-200"
    >
      {label}
    </span>
    {badge && (
      <span
        className="ml-auto bg-orange-100 dark:bg-orange-500/20 text-orange-600 
        dark:text-orange-400 text-xs font-medium px-2.5 py-0.5 rounded-full"
      >
        {badge}
      </span>
    )}
  </motion.button>
);

export const MobileMenu = ({
  isOpen,
  onClose,
  searchValue,
  setSearchValue,
  handleLogout,
  isDarkMode,
  dispatch,
  toggleTheme,
  user,
}) => {
  const menuSections = [
    {
      title: "General",
      items: [
        { icon: Home, label: "Home" },
        { icon: Ticket, label: "Browse Events" },
        { icon: TrendingUp, label: "Trending", badge: "New" },
        { icon: Clock, label: "Recent" },
      ],
    },
    {
      title: "Your Items",
      items: [
        { icon: Calendar, label: "Upcoming Events", badge: "5" },
        { icon: Heart, label: "Wishlist", badge: "3" },
        { icon: ShoppingCart, label: "Cart", badge: "2" },
        { icon: Bell, label: "Notifications", badge: "3" },
      ],
    },
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile" },
        { icon: Settings, label: "Settings" },
        { icon: HelpCircle, label: "Help & Support" },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-md
              bg-white dark:bg-gray-900 z-50 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                      transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                  {/* Theme Toggle */}
                  <motion.button
                    onClick={() => dispatch(toggleTheme())}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                      transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </motion.button>
                </div>
              </div>

              {/* User Profile */}
              <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={user?.avatar || "/api/placeholder/40/40"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 
                        border-orange-500 dark:border-orange-400"
                    />
                    <div
                      className="absolute bottom-0 right-0 w-3 h-3 
                      bg-green-500 rounded-full border-2 border-white dark:border-gray-900"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user?.name || "Guest User"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email || "guest@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Sections */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 py-6 space-y-8">
                  {menuSections.map((section, index) => (
                    <div key={section.title}>
                      <h3
                        className="text-xs font-semibold text-gray-500 
                        dark:text-gray-400 uppercase tracking-wider mb-3"
                      >
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            badge={item.badge}
                            onClick={() => {
                              // Handle menu item click
                              onClose();
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center px-4 py-3
                    text-red-600 dark:text-red-400 font-medium
                    hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg
                    transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign out
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
