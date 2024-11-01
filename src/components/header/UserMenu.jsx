import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const menuVariants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.15 },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
};

const itemVariants = {
  closed: { opacity: 0, x: -10 },
  open: { opacity: 1, x: 0 },
};

const MenuItem = ({ icon: Icon, label, to, badge, isPro, onItemClick }) => {
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick();
    }
    navigate(to);
  };

  return (
    <motion.div variants={itemVariants}>
      <div
        onClick={handleClick}
        className="group flex items-center justify-between px-4 py-3 cursor-pointer
          text-gray-700 dark:text-gray-200 
          hover:bg-gray-50 dark:hover:bg-gray-700/50 
          transition-colors duration-200"
      >
        <div className="flex items-center">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl mr-3
            bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400
            group-hover:scale-110 transition-transform duration-200"
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            {isPro && (
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Pro Feature
              </span>
            )}
          </div>
        </div>
        {badge && (
          <span
            className="px-2 py-0.5 text-xs font-medium rounded-full
            bg-orange-100 dark:bg-orange-500/20 
            text-orange-600 dark:text-orange-400"
          >
            {badge}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const UserMenu = ({ isOpen, onClose, handleLogout }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden
            bg-white dark:bg-gray-800
            shadow-lg border border-gray-200 dark:border-gray-700 z-50"
        >
          {/* Menu Sections */}
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {menuItems.map((section) => (
              <div key={section.section} className="py-2">
                <motion.h3
                  variants={itemVariants}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 
                    dark:text-gray-400 uppercase tracking-wider"
                >
                  {section.section}
                </motion.h3>
                {section.items.map((item) => (
                  <MenuItem key={item.label} {...item} onItemClick={onClose} />
                ))}
              </div>
            ))}
          </div>

          {/* Sign Out Button */}
          <motion.div
            variants={itemVariants}
            className="border-t border-gray-200 dark:border-gray-700"
          >
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="flex items-center w-full px-4 py-3
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-500/10
                transition-colors duration-200"
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl mr-3
                bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">Sign Out</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
