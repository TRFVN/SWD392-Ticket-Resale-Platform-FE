import React from "react";
import { Share2, Heart, ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const TicketHeader = ({ ticket, isLiked, onLikeToggle, onShare, onBack }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  return (
    <div className="relative py-4 mb-6">
      {/* Navigation Bar */}
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            } transition-colors`}
          >
            <ChevronLeft
              className={isDarkMode ? "text-gray-300" : "text-gray-600"}
            />
            <span
              className={`text-sm font-medium hidden sm:inline ${
                isDarkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Back
            </span>
          </motion.button>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShare}
              className={`p-2.5 rounded-xl ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              } transition-colors`}
            >
              <Share2
                className={isDarkMode ? "text-gray-300" : "text-gray-600"}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLikeToggle}
              className={`p-2.5 rounded-xl transition-colors ${
                isLiked
                  ? "bg-orange-500 hover:bg-orange-600"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Heart
                className={
                  isLiked
                    ? "text-white"
                    : isDarkMode
                    ? "text-gray-300"
                    : "text-gray-600"
                }
                fill={isLiked ? "white" : "none"}
              />
            </motion.button>
          </div>
        </div>

        {/* Basic Info Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/90" : "bg-white"
          } shadow-sm`}
        >
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-sm font-medium text-white">
                  {ticket.categoryName}
                </span>
                <span
                  className={`px-3 py-1 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-100"
                  } rounded-full text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {ticket.serialNumber}
                </span>
              </div>
              <h1
                className={`text-xl sm:text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {ticket.ticketName}
              </h1>
              <p
                className={`mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {ticket.eventName}
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Price
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(ticket.ticketPrice)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default TicketHeader;
