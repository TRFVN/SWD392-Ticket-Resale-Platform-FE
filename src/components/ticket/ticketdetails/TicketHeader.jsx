import React from "react";
import { Share2, Heart, ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const TicketHeader = ({ ticket, isLiked, onLikeToggle, onShare, onBack }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-[60vh] md:h-[70vh] w-full"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={ticket.ticketImage}
          alt={ticket.ticketName}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/50"
              : "bg-gradient-to-t from-white/90 via-gray-900/50 to-transparent"
          }`}
        />
      </div>

      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="py-6 flex items-center justify-between">
            {/* Back Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
                Back
              </span>
            </motion.button>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onShare}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLikeToggle}
                className={`p-2.5 rounded-xl transition-colors ${
                  isLiked
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "text-white" : "text-gray-600 dark:text-gray-300"
                  }`}
                  fill={isLiked ? "white" : "none"}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-[1920px] mx-auto px-6 pb-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl backdrop-blur-md ${
              isDarkMode ? "bg-gray-900/90" : "bg-white/90"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-sm font-medium text-white">
                    Premium
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-300">
                    {ticket.serialNumber}
                  </span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {ticket.ticketName}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Price
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    {ticket.ticketPrice.toLocaleString()}
                    <span className="text-xl">đ</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default TicketHeader;
