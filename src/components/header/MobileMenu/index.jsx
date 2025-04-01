import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Calendar,
  MapPin,
  TrendingUp,
  PlusCircle,
  ShoppingCart,
  Info,
} from "lucide-react";
import { useNavigationItems } from "../../../hooks/useNavigationItems";
import { Link } from "react-router-dom";

/**
 * Mobile Navigation Menu
 * Modern, animated mobile drawer with glassmorphism
 */
const MobileNav = ({ isOpen, onItemClick }) => {
  const { navItems, activeTab, setActiveTab, handleNavigation, cartCount } =
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

  const MobileNavItem = ({ icon: Icon, label, path, onItemClick, badge }) => (
    <motion.div variants={itemVariants} whileTap={{ scale: 0.95 }}>
      <Link
        to={path}
        className="flex items-center px-6 py-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={onItemClick}
      >
        <span className="relative">
          {Icon && <Icon className="w-5 h-5 mr-3" />}
          {badge && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-orange-500 rounded-full">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        {label}
      </Link>
    </motion.div>
  );

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
            <nav className="mt-4 border-t border-gray-200 dark:border-gray-800">
              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                className="py-2"
              >
                <MobileNavItem
                  icon={Ticket}
                  label="Vé"
                  path="/tickets"
                  onItemClick={onItemClick}
                  badge={cartCount}
                />
                <MobileNavItem
                  icon={Calendar}
                  label="Sự kiện"
                  path="/events"
                  onItemClick={onItemClick}
                />
                <MobileNavItem
                  icon={ShoppingCart}
                  label="Giỏ hàng"
                  path="/cart"
                  onItemClick={onItemClick}
                  badge={cartCount}
                />
                <MobileNavItem
                  icon={Info}
                  label="Về chúng tôi"
                  path="/about"
                  onItemClick={onItemClick}
                />
              </motion.div>
            </nav>

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
