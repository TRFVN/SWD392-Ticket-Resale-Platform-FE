import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import TicketLogo from "../../assets/TicketHub_Logo.png";
import { AuthContext } from "../../context/AuthContext";
import None_Avatar from "../../assets/None_Avatar.jpg";
import {
  Bell,
  ChartColumnBig,
  ChartNoAxesColumnIncreasing,
  MessageSquare,
} from "lucide-react";

function StaffHeader() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between items-center w-full py-4 px-6 border-b-[1px]">
      <Link to="/" className="flex items-center flex-shrink-0 group">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={TicketLogo}
          alt="TicketHub"
          className="h-10 w-auto"
        />
        <div className="hidden sm:flex flex-col ml-3">
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300">
            TicketHub
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Best resell platform
          </span>
        </div>
      </Link>
      <div className="flex flex-row items-center gap-4">
        {[
          { icon: MessageSquare, badge: "2", path: "/message" },
          { icon: ChartColumnBig, badge: "8", path: "/static" },
          { icon: Bell, badge: "3", path: "/notifications" },
        ].map((item) => (
          <motion.button
            key={item.path}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(item.path)}
            className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-medium text-white bg-orange-500 rounded-full border-2 border-white dark:border-gray-900">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              src={user?.avatarUrl || None_Avatar}
              alt="User"
              className="w-9 h-9 rounded-lg border-2 border-orange-500"
            />
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </motion.button>
          {/* <UserMenu
            isOpen={isUserMenuOpen}
            onClose={() => setIsUserMenuOpen(false)}
            handleLogout={handleLogout}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default StaffHeader;
