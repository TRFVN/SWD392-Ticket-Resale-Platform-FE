import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar } from "lucide-react";

const TicketDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  useEffect(() => {
    if (!location.state?.ticket) {
      navigate("/my-tickets");
    } else {
      setTicket(location.state.ticket);
    }
  }, [location.state, navigate]);

  if (!ticket) return null;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-xl ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-700"
          } transition-colors`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to My Tickets</span>
        </button>

        {/* Ticket Info */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          } mb-6`}
        >
          <h1
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {ticket.ticketName}
          </h1>
          <p
            className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
          >
            {ticket.eventName}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-500" />
            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
              {formatDate(ticket.eventDate)}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div
          className={`p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Entry QR Code
          </h2>
          <div className="relative aspect-square w-full max-w-md mx-auto bg-white p-4 rounded-xl">
            <img
              src={ticket.ticketImage}
              alt="Ticket QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <p
            className={`mt-4 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } text-sm`}
          >
            Please show this QR code at the event entrance for check-in
          </p>
        </div>

        {/* Additional Event Info */}
        <div
          className={`mt-6 p-6 rounded-2xl ${
            isDarkMode ? "bg-gray-800/50" : "bg-white"
          }`}
        >
          <h2
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Event Location
          </h2>
          <div className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
            <p>{ticket.city}</p>
            <p>{ticket.district}</p>
            <p>{ticket.address}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketDetails;
