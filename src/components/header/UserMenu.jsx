import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Heart,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  Gift,
  HelpCircle,
  Ticket,
  Star,
  ChevronRight,
} from "lucide-react";

// Animation variants defined outside component to avoid recreation
const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      staggerChildren: 0.035,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: -5 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
};

const sectionVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Memoized MenuItem component with enhanced styling and accessibility
const MenuItem = memo(
  ({ icon: Icon, label, to, badge, isPro, onItemClick }) => {
    const handleClick = useCallback(
      (e) => {
        e.preventDefault();
        if (onItemClick) {
          onItemClick(to);
        }
      },
      [onItemClick, to],
    );

    return (
      <motion.div variants={itemVariants}>
        <button
          onClick={handleClick}
          className="group flex items-center justify-between w-full px-4 py-3
          text-gray-700 dark:text-gray-200 
          hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100
          dark:hover:from-gray-800 dark:hover:to-gray-700/70
          transition-all duration-200 rounded-lg mx-1 relative overflow-hidden"
          aria-label={`Go to ${label}`}
        >
          {/* Hover gradient background effect */}
          <span
            className="absolute inset-0 bg-gradient-to-r from-orange-50/0 to-orange-100/0 
          dark:from-orange-900/0 dark:to-orange-800/0 
          group-hover:from-orange-50/50 group-hover:to-orange-100/30
          dark:group-hover:from-orange-900/10 dark:group-hover:to-orange-800/5
          opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
          />

          <div className="flex items-center z-10">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl mr-3
            bg-gradient-to-br from-gray-50 to-gray-100
            dark:from-gray-800 dark:to-gray-750
            text-gray-600 dark:text-gray-400
            group-hover:from-orange-50 group-hover:to-orange-100
            dark:group-hover:from-gray-700 dark:group-hover:to-gray-600
            group-hover:text-orange-500 dark:group-hover:text-orange-400
            transform-gpu group-hover:scale-110 transition-all duration-200 
            shadow-sm group-hover:shadow-md"
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {label}
              </p>
              {isPro && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center">
                  Pro Feature
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 ml-1"></span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            {badge && (
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full
              bg-orange-100 dark:bg-orange-500/20 
              text-orange-600 dark:text-orange-400 
              group-hover:bg-orange-200 dark:group-hover:bg-orange-500/30
              transition-colors duration-200"
              >
                {badge}
              </span>
            )}
            <ChevronRight
              className="w-4 h-4 text-gray-400 dark:text-gray-500 
            opacity-0 group-hover:opacity-100 transition-opacity 
            transform-gpu group-hover:translate-x-1 transition-transform duration-200"
            />
          </div>
        </button>
      </motion.div>
    );
  },
);

// Menu section header component
const SectionHeader = memo(({ title }) => (
  <motion.div
    variants={itemVariants}
    className="px-4 py-2 flex items-center gap-2"
  >
    <h3
      className="text-xs font-semibold text-gray-500 
      dark:text-gray-400 uppercase tracking-wider"
    >
      {title}
    </h3>
    <div className="h-px flex-grow bg-gray-100 dark:bg-gray-700"></div>
  </motion.div>
));

// Logout button component
const LogoutButton = memo(({ handleLogout, onClose }) => {
  const handleClick = useCallback(() => {
    handleLogout();
    onClose();
  }, [handleLogout, onClose]);

  return (
    <motion.div
      variants={itemVariants}
      className="border-t border-gray-200/80 dark:border-gray-700/80 p-2"
    >
      <button
        onClick={handleClick}
        className="flex items-center w-full px-4 py-3 rounded-xl
          text-red-600 dark:text-red-400
          hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/70
          dark:hover:from-red-900/20 dark:hover:to-red-800/10
          transition-all duration-200 group relative overflow-hidden"
        aria-label="Sign out of your account"
      >
        <span
          className="absolute inset-0 bg-red-50/0 dark:bg-red-900/0 
          group-hover:bg-red-50/80 dark:group-hover:bg-red-900/20 
          transition-colors duration-200 rounded-lg"
        />

        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl mr-3
          bg-gradient-to-br from-red-50 to-red-100
          dark:from-red-900/30 dark:to-red-800/20
          text-red-600 dark:text-red-400
          group-hover:shadow-md shadow-sm
          transform-gpu group-hover:scale-110 transition-all duration-200 z-10"
        >
          <LogOut className="w-5 h-5" />
        </div>
        <span className="font-medium z-10">Sign Out</span>
      </button>
    </motion.div>
  );
});

// Menu data structure defined outside component
const menuItems = [
  {
    section: "Account",
    items: [
      { icon: User, label: "My Profile", to: "/profile" },
      {
        icon: Bell,
        label: "Notifications",
        to: "/notifications",
        badge: "3",
      },
      { icon: Heart, label: "Wishlist", to: "/wishlist", badge: "5" },
    ],
  },
  {
    section: "Events & Tickets",
    items: [
      { icon: Ticket, label: "My Tickets", to: "/tickets" },
      { icon: Star, label: "Saved Events", to: "/saved" },
      { icon: Gift, label: "Gift Cards", to: "/gift-cards", isPro: true },
    ],
  },
  {
    section: "Settings",
    items: [
      { icon: CreditCard, label: "Payment Methods", to: "/payments" },
      { icon: Settings, label: "Account Settings", to: "/settings" },
      { icon: HelpCircle, label: "Help Center", to: "/help" },
    ],
  },
];

// Main UserMenu component with optimizations
export const UserMenu = memo(({ isOpen, onClose, handleLogout }) => {
  const handleItemClick = useCallback(
    (path) => {
      window.location.href = path;
      onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/5 dark:bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Menu panel */}
          <motion.div
            key="menu-panel"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden
              bg-white/95 dark:bg-gray-800/95
              shadow-xl ring-1 ring-black/5 dark:ring-white/10
              border border-gray-200/80 dark:border-gray-700/80 z-50
              backdrop-blur-sm"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            {/* Menu header */}
            <motion.div
              variants={itemVariants}
              className="px-4 py-3 border-b border-gray-200/80 dark:border-gray-700/80"
            >
              <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Account Menu
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your profile and settings
              </p>
            </motion.div>

            {/* Menu Sections with optimized rendering */}
            <div className="py-2 max-h-[60vh] overflow-y-auto">
              {menuItems.map((section, idx) => (
                <motion.div
                  key={section.section}
                  className="py-2"
                  variants={sectionVariants}
                  custom={idx}
                >
                  <SectionHeader title={section.section} />
                  <div className="space-y-1 px-1">
                    {section.items.map((item) => (
                      <MenuItem
                        key={item.label}
                        {...item}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sign Out Button */}
            <LogoutButton handleLogout={handleLogout} onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

export default UserMenu;
