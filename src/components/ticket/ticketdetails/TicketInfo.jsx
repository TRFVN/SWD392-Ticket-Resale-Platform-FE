import React from "react";
import { Calendar, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
const TicketInfo = ({ ticket, formatDate }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  return (
    <div className="max-w-[1920px] mx-auto px-6">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`mt-8 p-6 rounded-2xl ${
          isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-6 text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Date & Time
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatDate(ticket.eventDate)}
              </div>
            </div>
          </div>
          <div className="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {ticket.city}, {ticket.district}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TicketInfo;
