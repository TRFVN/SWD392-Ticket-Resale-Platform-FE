import React from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
const MainContent = ({ ticket }) => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  return (
    <div className="lg:flex gap-8 p-6">
      {/* QR Code Section */}
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } shadow-sm`}
        >
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Ticket QR Code
          </h2>
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <img
              src={ticket.ticketImage}
              alt="Ticket QR Code"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <p
            className={`mt-4 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Present this QR code at the event entrance for check-in
          </p>
        </motion.div>
      </div>

      {/* Details Section */}
      <div className="lg:w-1/2 space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } shadow-sm`}
        >
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            About This Event
          </h2>
          <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
            {ticket.ticketDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } shadow-sm`}
        >
          <h2
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Location
          </h2>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 mt-1 text-orange-500" />
            <div>
              <p
                className={`font-medium ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {ticket.city}
              </p>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {ticket.district}
              </p>
              <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                {ticket.street}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default MainContent;
