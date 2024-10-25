import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { menuVariants } from "./const/animations";

export const UserMenu = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={menuVariants}
        initial="closed"
        animate="open"
        exit="closed"
        className="absolute right-0 mt-2 w-56 rounded-lg overflow-hidden
          bg-white dark:bg-gray-800 
          shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            John Doe
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            john.doe@example.com
          </p>
        </div>

        <div className="py-1">
          {[
            { icon: User, label: "Profile", to: "/profile" },
            { icon: Heart, label: "Wishlist", to: "/wishlist" },
            { icon: Settings, label: "Settings", to: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center px-4 py-2 text-sm text-gray-700 
                dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                transition-colors"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Link>
          ))}

          <button
            onClick={onClose}
            className="flex w-full items-center px-4 py-2 text-sm 
              text-red-600 dark:text-red-400
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
