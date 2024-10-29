import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
const MainContent = ({ ticket }) => {
  return (
    <div className="lg:col-span-2 space-y-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          About This Event
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {ticket.ticketDescription}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-800/50"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Location
        </h2>
        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
          <MapPin className="w-5 h-5 mt-1 text-orange-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {ticket.city}
            </p>
            <p>{ticket.district}</p>
            <p>{ticket.street}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MainContent;
