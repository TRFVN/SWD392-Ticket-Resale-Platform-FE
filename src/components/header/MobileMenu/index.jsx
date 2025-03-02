import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, Calendar, MapPin, TrendingUp, PlusCircle } from "lucide-react";
import { useNavigationItems } from "../../../hooks/useNavigationItems";

/**
 * Mobile Navigation Menu
 * Modern, animated mobile drawer with glassmorphism
 */
const MobileNav = ({ isOpen, onItemClick }) => {
  const { navItems, activeTab, setActiveTab, handleNavigation } =
    useNavigationItems();

  // Icon mapping for navigation items
  const iconMap = {
    events: Ticket,
    tickets: Calendar,
    venues: MapPin,
    trending: TrendingUp,
    create: PlusCircle,
  };

  // Handle navigation item click
  const handleClick = (id, path) => {
    setActiveTab(id);
    handleNavigation(path);
    onItemClick();
  };

  // Animation variants
  const containerVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.07,
      },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden overflow-hidden bg-light-primary/80 dark:bg-dark-primary/80 backdrop-blur-md"
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 dark:opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          <div className="px-4 py-3 relative">
            <ul className="space-y-2 py-2">
              {navItems.map((item, index) => {
                const Icon = iconMap[item.id] || Ticket;

                return (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <motion.a
                      href={item.path}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        ${
                          activeTab === item.id
                            ? "bg-primary text-white dark:bg-primary-dark"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }
                        transition-all duration-200
                      `}
                      onClick={(e) => {
                        e.preventDefault();
                        handleClick(item.id, item.path);
                      }}
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 },
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={`
                        flex items-center justify-center w-8 h-8 rounded-lg
                        ${
                          activeTab === item.id
                            ? "bg-white/20"
                            : "bg-primary/10 dark:bg-gray-700"
                        }
                      `}
                      >
                        <Icon
                          className={
                            activeTab === item.id
                              ? "text-white"
                              : "text-primary dark:text-gray-300"
                          }
                          size={18}
                        />
                      </div>

                      <span className="font-medium">{item.label}</span>

                      {item.badge && (
                        <motion.span
                          className={`
                            ml-auto px-2 py-0.5 text-xs rounded-full
                            ${
                              activeTab === item.id
                                ? "bg-white/20 text-white"
                                : "bg-primary text-white"
                            }
                          `}
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 1,
                          }}
                        >
                          {item.badge}
                        </motion.span>
                      )}

                      {/* Arrow indicator for active item */}
                      {activeTab === item.id && (
                        <motion.svg
                          className="w-5 h-5 ml-auto text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          initial={{ x: -5, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      )}
                    </motion.a>
                  </motion.li>
                );
              })}
            </ul>

            {/* Quick action buttons */}
            <motion.div
              className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700"
              variants={itemVariants}
            >
              <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href="/create-ticket"
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/create-ticket");
                    onItemClick();
                  }}
                >
                  <PlusCircle size={24} />
                  <span className="mt-2 text-sm font-medium">Tạo sự kiện</span>
                </motion.a>

                <motion.a
                  href="/tickets"
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/mytickets");
                    onItemClick();
                  }}
                >
                  <Ticket size={24} />
                  <span className="mt-2 text-sm font-medium">Vé của tôi</span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;
