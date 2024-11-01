import React from "react";
import {
  ShoppingCart,
  MessageCircle,
  Ticket,
  Tag,
  User,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
const Sidebar = ({ ticket, onChat }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <div className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50">
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onChat}
            className="w-full px-4 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </motion.button>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Event Details
        </h3>
        {[
          {
            icon: Ticket,
            label: "Event ID",
            value: ticket.eventId?.slice(0, 8) || "N/A",
          },
          {
            icon: Tag,
            label: "Category",
            value: ticket.categoryId?.slice(0, 8) || "N/A",
          },
          {
            icon: User,
            label: "Seller ID",
            value: ticket.userId?.slice(0, 8) || "N/A",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            <span className="font-mono text-gray-900 dark:text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Important Info */}
      <div className="p-6 rounded-2xl bg-orange-500/10">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-orange-500 mt-1" />
          <div className="space-y-2">
            <h3 className="font-medium text-orange-500">
              Important Information
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Please arrive at least 30 minutes before the event. Bring valid ID
              matching the ticket holder's name.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Sidebar;
