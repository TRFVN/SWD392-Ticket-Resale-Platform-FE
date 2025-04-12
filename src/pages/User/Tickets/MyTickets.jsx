import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  AlertCircle,
  CheckCircle,
  Calendar,
  Tag,
  MapPin,
  Search,
  Clock,
  CalendarDays,
  QrCode,
  Share2,
  MoreHorizontal,
  Download,
  Printer,
  Plus,
  X,
  SlidersHorizontal,
  CreditCard,
  TicketCheck,
  WalletCards,
  ArrowUpRight,
  CheckCheck,
  Star,
  PieChart,
  Map,
  Grid,
  LayoutList,
  History,
  Info,
  RefreshCw,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "../../../hooks/useTickets";

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 3.3, 0));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-4 right-4 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 z-50 max-w-md
      ${type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white`}
    >
      <div className="flex-shrink-0">
        {type === "success" ? (
          <CheckCircle className="w-5 h-5" />
        ) : (
          <AlertCircle className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{message}</p>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-white"
            style={{ width: `${progress}%`, transition: "width 100ms linear" }}
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-white/80 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// Card flip component for ticket
const FlippableTicketCard = ({ ticket, onAction, isDarkMode }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const cardRef = useRef(null);

  // Get category badge color based on category name
  const getCategoryBadgeColor = (categoryName) => {
    if (!categoryName) return "";

    switch (categoryName) {
      case "VIP":
        return isDarkMode
          ? "bg-purple-800/30 text-purple-400"
          : "bg-purple-100 text-purple-600";
      case "Standard":
        return isDarkMode
          ? "bg-blue-800/30 text-blue-400"
          : "bg-blue-100 text-blue-600";
      default:
        return isDarkMode
          ? "bg-green-800/30 text-green-400"
          : "bg-green-100 text-green-600";
    }
  };

  // Format the event date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateString || "No date";
    }
  };

  // Get days remaining until event
  const getDaysRemaining = () => {
    if (!ticket.eventDate) return null;
    const eventDate = new Date(ticket.eventDate);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Get background gradient based on ticket type
  const getBackgroundGradient = () => {
    if (!ticket.categoryName) return "from-gray-800 to-gray-900";

    switch (ticket.categoryName) {
      case "VIP":
        return "from-purple-600 to-purple-900";
      case "Standard":
        return "from-blue-600 to-blue-900";
      default:
        return "from-green-600 to-teal-800";
    }
  };

  // Generate QR code placeholder
  const getQrPlaceholder = () => {
    return (
      <div className="relative w-32 h-32 bg-white rounded-lg overflow-hidden flex items-center justify-center mx-auto">
        <div className="text-black text-xs">QR Code</div>
        <div className="absolute inset-4 border-2 border-black rounded"></div>
        <div className="absolute inset-8 border-2 border-black rounded"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`${
                  i % 3 === 0 || i === 4 ? "bg-black" : "bg-transparent"
                } ${i === 4 ? "rounded-full" : ""}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div
      ref={cardRef}
      className="perspective-1000 relative"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of card */}
        <motion.div
          className={`backface-hidden rounded-2xl overflow-hidden border shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
          style={{ backfaceVisibility: "hidden" }}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="p-5">
            {/* Ticket Header */}
            <div className="flex justify-between items-start mb-4">
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium bg-opacity-20 ${getCategoryBadgeColor(
                  ticket.categoryName,
                )}`}
              >
                {ticket.categoryName || "Category"}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStarred(!isStarred);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {isStarred ? (
                    <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  ) : (
                    <Star className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                      : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Ticket Name */}
            <h3
              className={`text-lg font-bold mb-2 group-hover:text-orange-500 transition-colors line-clamp-2
              ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {ticket.ticketName || ticket.eventName}
            </h3>

            {/* Event Date */}
            <p
              className={`mb-4 text-sm flex items-center gap-1.5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {formatDate(ticket.eventDate)}

              {daysRemaining !== null && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    daysRemaining < 7
                      ? "bg-red-500/10 text-red-500"
                      : "bg-green-500/10 text-green-500"
                  }`}
                >
                  {daysRemaining} days left
                </span>
              )}
            </p>

            {/* Ticket Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`line-clamp-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {ticket.city || "Location"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard
                  className={`w-4 h-4 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(ticket.ticketPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Card Actions */}
          <div
            className={`flex border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <button
              onClick={() => onAction(ticket)}
              className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5
                ${
                  isDarkMode
                    ? "text-white hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Details
            </button>
            <div
              className={`w-px ${
                isDarkMode ? "bg-gray-700" : "border-gray-100"
              }`}
            ></div>
            <button
              className="flex-1 py-3 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors flex items-center justify-center gap-1.5"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(true);
              }}
            >
              <QrCode className="w-4 h-4" />
              View Ticket
            </button>
          </div>
        </motion.div>

        {/* Back of card (ticket details) */}
        <motion.div
          className={`backface-hidden absolute inset-0 rounded-2xl overflow-hidden border shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className={`h-full flex flex-col bg-gradient-to-br ${
              isDarkMode
                ? getBackgroundGradient()
                : "from-orange-500 to-orange-600"
            }`}
          >
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ticket overlay content */}
            <div className="relative flex-1 p-6 flex flex-col">
              {/* Abstract pattern for background */}
              <div className="absolute inset-0 opacity-20 overflow-hidden">
                <div className="absolute -inset-[10px]">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern
                        id={`pattern-circles-${ticket.ticketId}`}
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                        patternContentUnits="userSpaceOnUse"
                      >
                        <circle
                          id="pattern-circle"
                          cx="10"
                          cy="10"
                          r="1.6257413380501518"
                          fill="#fff"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#pattern-circles-${ticket.ticketId})`}
                    />
                  </svg>
                </div>
              </div>

              {/* Ticket content */}
              <div className="relative mb-3 flex justify-center items-center">
                <span className="px-4 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                  {ticket.categoryName || "Standard"} Ticket
                </span>
              </div>

              <h3 className="text-xl font-bold text-white text-center mb-2">
                {ticket.ticketName || ticket.eventName}
              </h3>

              <p className="text-white/80 text-sm text-center mb-6">
                {ticket.eventName}
              </p>

              <div className="mt-auto">
                {/* QR Code area */}
                {getQrPlaceholder()}

                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex justify-between items-center text-white mb-2">
                    <span className="text-sm text-white/70">Date & Time</span>
                    <span className="text-sm font-medium">
                      {formatDate(ticket.eventDate)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-white mb-2">
                    <span className="text-sm text-white/70">Location</span>
                    <span className="text-sm font-medium">
                      {ticket.city || "Location"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm text-white/70">Ticket ID</span>
                    <span className="text-sm font-medium font-mono">
                      {ticket.ticketId?.substring(0, 8) || "T12345678"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket actions */}
            <div className="grid grid-cols-4 divide-x divide-white/20 bg-black/20 backdrop-blur-sm">
              <button className="py-3 text-white flex flex-col items-center justify-center">
                <Download className="w-4 h-4 mb-1" />
                <span className="text-xs">Save</span>
              </button>
              <button className="py-3 text-white flex flex-col items-center justify-center">
                <Share2 className="w-4 h-4 mb-1" />
                <span className="text-xs">Share</span>
              </button>
              <button className="py-3 text-white flex flex-col items-center justify-center">
                <CalendarDays className="w-4 h-4 mb-1" />
                <span className="text-xs">Calendar</span>
              </button>
              <button className="py-3 text-white flex flex-col items-center justify-center">
                <Printer className="w-4 h-4 mb-1" />
                <span className="text-xs">Print</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// EmptyState component with 3D illustration
const EmptyState = ({ isDarkMode, navigate }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col items-center justify-center min-h-[70vh] p-4"
  >
    <div className="relative mb-8 w-64 h-64">
      {/* 3D Ticket illustration */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
      >
        <div
          className={`w-full h-full relative rounded-3xl overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-2xl transform rotate-12`}
        >
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? "bg-gradient-to-br from-purple-500/20 to-orange-500/20"
                : "bg-gradient-to-br from-purple-100 to-orange-100"
            }`}
          ></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
            <WalletCards className="w-16 h-16 text-orange-500 mb-4" />
            <div
              className={`h-3 w-3/4 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } mb-3`}
            ></div>
            <div
              className={`h-3 w-1/2 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } mb-6`}
            ></div>
            <div
              className={`h-2 w-5/6 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } mb-2`}
            ></div>
            <div
              className={`h-2 w-5/6 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } mb-2`}
            ></div>
            <div
              className={`h-2 w-4/6 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>

    <h3
      className={`text-2xl font-bold ${
        isDarkMode ? "text-white" : "text-gray-900"
      } mb-2 text-center`}
    >
      Your ticket collection is empty
    </h3>

    <p
      className={`${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      } text-center max-w-md mb-8`}
    >
      Start your journey by exploring exciting events and booking your first
      ticket!
    </p>

    <div className="flex flex-wrap gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/tickets")}
        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2 shadow-lg"
      >
        <Search className="w-5 h-5" />
        Browse Events
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/popular")}
        className={`px-6 py-3 ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
        } rounded-xl transition-colors flex items-center gap-2 shadow-lg`}
      >
        <Tag className="w-5 h-5" />
        Popular Events
      </motion.button>
    </div>
  </motion.div>
);

// Timeline view component
const TicketTimeline = ({ tickets, onAction, isDarkMode }) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [];
  // Generate 6 months starting from current month
  for (let i = 0; i < 6; i++) {
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    months.push({ month, year });
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Group tickets by month
  const ticketsByMonth = {};
  tickets.forEach((ticket) => {
    if (!ticket.eventDate) return;

    const date = new Date(ticket.eventDate);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;

    if (!ticketsByMonth[key]) {
      ticketsByMonth[key] = [];
    }

    ticketsByMonth[key].push(ticket);
  });

  return (
    <div className="space-y-8">
      {months.map(({ month, year }) => {
        const key = `${year}-${month}`;
        const monthTickets = ticketsByMonth[key] || [];

        if (monthTickets.length === 0) return null;

        return (
          <div key={key} className="relative">
            <div className="sticky top-4 z-10 mb-4">
              <h3
                className={`inline-block px-4 py-2 rounded-full ${
                  isDarkMode
                    ? "bg-gray-800 text-white shadow-lg"
                    : "bg-white text-gray-900 shadow-md"
                }`}
              >
                {monthNames[month]} {year}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {monthTickets.map((ticket) => (
                <FlippableTicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  onAction={onAction}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Calendar View component (simplified)
const CalendarView = ({ tickets, onAction, isDarkMode }) => {
  // Group tickets by date
  const ticketsByDate = {};
  tickets.forEach((ticket) => {
    if (!ticket.eventDate) return;

    const date = new Date(ticket.eventDate);
    const dateStr = date.toISOString().split("T")[0];

    if (!ticketsByDate[dateStr]) {
      ticketsByDate[dateStr] = [];
    }

    ticketsByDate[dateStr].push(ticket);
  });

  // Generate calendar days
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and total days in month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Add empty cells for days before first day of month
  const emptyCells = Array.from({ length: firstDay }, (_, i) => null);
  const allCells = [...emptyCells, ...days];

  // Calculate rows (weeks)
  const rows = [];
  for (let i = 0; i < allCells.length; i += 7) {
    rows.push(allCells.slice(i, i + 7));
  }

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl shadow-lg overflow-hidden border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div
        className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-white"} border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h3
          className={`text-xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {new Date().toLocaleString("default", { month: "long" })}{" "}
          {currentYear}
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className={`text-center text-sm font-medium ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((day, colIndex) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${colIndex}`}
                      className={`aspect-square ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    />
                  );
                }

                const date = new Date(currentYear, currentMonth, day);
                const dateStr = date.toISOString().split("T")[0];
                const dayTickets = ticketsByDate[dateStr] || [];
                const hasTickets = dayTickets.length > 0;

                const isToday = day === currentDate.getDate();

                return (
                  <div
                    key={day}
                    className={`aspect-square p-1 relative cursor-pointer ${
                      isToday
                        ? isDarkMode
                          ? "bg-orange-500/20 rounded"
                          : "bg-orange-100 rounded"
                        : ""
                    }`}
                  >
                    <div
                      className={`h-full w-full flex flex-col items-center justify-center rounded ${
                        hasTickets
                          ? isDarkMode
                            ? "bg-orange-500/10 hover:bg-orange-500/20"
                            : "bg-orange-50 hover:bg-orange-100"
                          : ""
                      } transition-colors`}
                    >
                      <span
                        className={`text-sm ${
                          isToday
                            ? "font-bold text-orange-500"
                            : isDarkMode
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {day}
                      </span>

                      {hasTickets && (
                        <div className="flex mt-1">
                          {dayTickets.slice(0, 3).map((ticket, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                ticket.categoryName === "VIP"
                                  ? "bg-purple-500"
                                  : ticket.categoryName === "Standard"
                                  ? "bg-blue-500"
                                  : "bg-green-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Event list for today */}
      <div
        className={`p-4 border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h4
          className={`font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-3`}
        >
          Today's Events
        </h4>

        {(() => {
          const today = new Date();
          const todayStr = today.toISOString().split("T")[0];
          const todayTickets = ticketsByDate[todayStr] || [];

          if (todayTickets.length === 0) {
            return (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No events scheduled for today
              </p>
            );
          }

          return todayTickets.map((ticket) => (
            <div
              key={ticket.ticketId}
              onClick={() => onAction(ticket)}
              className={`p-3 rounded ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              } mb-2 cursor-pointer hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between">
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {ticket.ticketName || ticket.eventName}
                </span>
                <span
                  className={`text-xs ${getCategoryBadgeColor(
                    ticket.categoryName,
                  )}`}
                >
                  {ticket.categoryName}
                </span>
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {ticket.city}
              </p>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

// Stats visualization component
const StatsVisualization = ({ tickets, isDarkMode }) => {
  // Calculate stats
  const totalSpent = tickets.reduce((sum, t) => sum + (t.ticketPrice || 0), 0);

  // Group by category for pie chart data
  const categoryData = {};
  tickets.forEach((ticket) => {
    const category = ticket.categoryName || "Uncategorized";
    if (!categoryData[category]) {
      categoryData[category] = {
        count: 0,
        total: 0,
      };
    }
    categoryData[category].count++;
    categoryData[category].total += ticket.ticketPrice || 0;
  });

  // Format to percentage for visualization
  const categoryPercentages = Object.entries(categoryData).map(
    ([name, data]) => ({
      name,
      percentage: Math.round((data.count / tickets.length) * 100),
      count: data.count,
      total: data.total,
    }),
  );

  // Get color for category
  const getCategoryColor = (category) => {
    switch (category) {
      case "VIP":
        return "bg-purple-500";
      case "Standard":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl p-5 border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } shadow-lg`}
    >
      <h3
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-5`}
      >
        Ticket Statistics
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie chart */}
        <div>
          <h4
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Tickets by Category
          </h4>

          <div className="relative pt-5">
            <div className="w-40 h-40 mx-auto relative">
              {/* Render pie chart segments */}
              {categoryPercentages.map((category, index) => {
                const previousPercent = categoryPercentages
                  .slice(0, index)
                  .reduce((sum, cat) => sum + cat.percentage, 0);

                return (
                  <div
                    key={category.name}
                    className={`absolute inset-0 ${getCategoryColor(
                      category.name,
                    )}`}
                    style={{
                      clipPath: `conic-gradient(from ${
                        previousPercent * 3.6
                      }deg, rgba(0,0,0,0) ${
                        category.percentage * 3.6
                      }deg, rgba(0,0,0,0) 360deg)`,
                    }}
                  />
                );
              })}

              {/* Center circle cutout */}
              <div
                className={`absolute rounded-full ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
                style={{
                  top: "25%",
                  left: "25%",
                  width: "50%",
                  height: "50%",
                }}
              />
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2">
              {categoryPercentages.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 ${getCategoryColor(
                        category.name,
                      )} rounded-full`}
                    />
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {category.count}
                    </span>
                    <span
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      ({category.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending stats */}
        <div>
          <h4
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-3`}
          >
            Spending Overview
          </h4>

          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } mb-4`}
          >
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total Spent
              </span>
              <span
                className={`text-lg font-bold ${
                  isDarkMode ? "text-orange-400" : "text-orange-500"
                }`}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(totalSpent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Average per ticket
              </span>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(totalSpent / tickets.length)}
              </span>
            </div>
          </div>

          {/* Spending by category */}
          <h4
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            Spending by Category
          </h4>

          <div className="space-y-3">
            {categoryPercentages.map((category) => {
              const percentage = Math.round(
                (category.total / totalSpent) * 100,
              );

              return (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(category.total)}
                    </span>
                  </div>

                  <div
                    className={`h-2 w-full rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${getCategoryColor(
                        category.name,
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Map view component (simplified)
const MapView = ({ tickets, onAction, isDarkMode }) => {
  // Group tickets by city
  const cities = {};
  tickets.forEach((ticket) => {
    if (!ticket.city) return;

    if (!cities[ticket.city]) {
      cities[ticket.city] = [];
    }

    cities[ticket.city].push(ticket);
  });

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-xl p-5 border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } shadow-lg`}
    >
      <h3
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-4 flex items-center gap-2`}
      >
        <Map className="w-5 h-5 text-orange-500" />
        Event Locations
      </h3>

      <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-200 dark:bg-gray-700 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map
              className={`w-12 h-12 mx-auto mb-2 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p className={`${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
              Map Visualization
            </p>
          </div>
        </div>

        {/* Placeholder for map markers */}
        {Object.keys(cities).map((city, index) => {
          // Just randomly position markers for display purposes
          const left = 10 + ((index * 70) % 80);
          const top = 20 + ((index * 50) % 60);

          return (
            <div
              key={city}
              className="absolute"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div className="relative group">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  {cities[city].length}
                </div>

                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div
                    className={`p-2 rounded shadow-lg text-center ${
                      isDarkMode
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="font-medium">{city}</p>
                    <p className="text-xs">
                      {cities[city].length} ticket
                      {cities[city].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-1">
        {Object.entries(cities).map(([city, cityTickets]) => (
          <div key={city}>
            <div
              className={`p-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              } mb-1 cursor-pointer transition-colors flex justify-between items-center`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span
                  className={`font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {city}
                </span>
              </div>
              <span
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {cityTickets.length} ticket{cityTickets.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="pl-5 mb-3">
              {cityTickets.slice(0, 2).map((ticket) => (
                <div
                  key={ticket.ticketId}
                  onClick={() => onAction(ticket)}
                  className={`px-3 py-2 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } rounded cursor-pointer flex items-center justify-between`}
                >
                  <span
                    className={`text-sm truncate ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {ticket.ticketName || ticket.eventName}
                  </span>
                  <span
                    className={`text-xs ${getCategoryBadgeColor(
                      ticket.categoryName,
                    )}`}
                  >
                    {ticket.categoryName}
                  </span>
                </div>
              ))}

              {cityTickets.length > 2 && (
                <button
                  className={`px-3 py-1 text-xs ${
                    isDarkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  + {cityTickets.length - 2} more
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const MyTicketsPage = () => {
  const { tickets, loading, error, refetch } = useTickets("user");
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [viewTransition, setViewTransition] = useState(false);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const sidebarRef = useRef(null);

  // Format price to currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(price);
  };

  // Filter and sort tickets
  useEffect(() => {
    if (!tickets) return;

    let filtered = [...tickets];

    // Filter by tab
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (ticket) => new Date(ticket.eventDate) > new Date(),
      );
    } else if (activeTab === "past") {
      filtered = filtered.filter(
        (ticket) => new Date(ticket.eventDate) <= new Date(),
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (ticket) =>
          (ticket.ticketName &&
            ticket.ticketName.toLowerCase().includes(term)) ||
          (ticket.eventName && ticket.eventName.toLowerCase().includes(term)) ||
          (ticket.city && ticket.city.toLowerCase().includes(term)),
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedCategories.includes(ticket.categoryName),
      );
    }

    // Filter by cities
    if (selectedCities.length > 0) {
      filtered = filtered.filter((ticket) =>
        selectedCities.includes(ticket.city),
      );
    }

    // Sort tickets
    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        break;
      case "date-desc":
        filtered.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.ticketPrice - b.ticketPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.ticketPrice - a.ticketPrice);
        break;
      case "name-asc":
        filtered.sort((a, b) =>
          (a.ticketName || a.eventName || "").localeCompare(
            b.ticketName || b.eventName || "",
          ),
        );
        break;
      case "name-desc":
        filtered.sort((a, b) =>
          (b.ticketName || b.eventName || "").localeCompare(
            a.ticketName || a.eventName || "",
          ),
        );
        break;
      default:
        break;
    }

    setFilteredTickets(filtered);
  }, [
    tickets,
    activeTab,
    searchTerm,
    selectedCategories,
    selectedCities,
    sortBy,
  ]);

  // Handle clicks outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAction = (ticket) => {
    navigate(`/tickets/${ticket.ticketId}`, { state: { ticket } });
  };

  // Get unique categories
  const categories = tickets
    ? [...new Set(tickets.map((t) => t.categoryName).filter(Boolean))]
    : [];

  // Get unique cities
  const cities = tickets
    ? [...new Set(tickets.map((t) => t.city).filter(Boolean))]
    : [];

  // Get upcoming tickets
  const upcomingTickets = tickets
    ? tickets.filter((t) => new Date(t.eventDate) > new Date())
    : [];

  // Get past tickets
  const pastTickets = tickets
    ? tickets.filter((t) => new Date(t.eventDate) <= new Date())
    : [];

  // Calculate total value
  const totalValue = tickets
    ? tickets.reduce((sum, t) => sum + (t.ticketPrice || 0), 0)
    : 0;

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedCities([]);
    setSortBy("date-desc");
    setShowSidebar(false);
  };

  // Change view mode with transition
  const changeViewMode = (mode) => {
    setViewTransition(true);
    setTimeout(() => {
      setViewMode(mode);
      setViewTransition(false);
    }, 300);
  };

  // Stats Card Component
  const StatsCard = ({
    icon: Icon,
    title,
    value,
    color = "orange",
    onClick,
  }) => (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${
        isDarkMode ? "bg-gray-800/70" : "bg-white"
      } backdrop-blur-sm rounded-xl flex items-center gap-4 p-4 cursor-pointer border ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      } shadow-sm transition-all duration-300`}
    >
      <div
        className={`p-3 rounded-xl ${
          color === "orange"
            ? isDarkMode
              ? "bg-orange-500/10"
              : "bg-orange-50"
            : color === "green"
            ? isDarkMode
              ? "bg-green-500/10"
              : "bg-green-50"
            : color === "blue"
            ? isDarkMode
              ? "bg-blue-500/10"
              : "bg-blue-50"
            : color === "purple"
            ? isDarkMode
              ? "bg-purple-500/10"
              : "bg-purple-50"
            : isDarkMode
            ? "bg-gray-700"
            : "bg-gray-100"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${
            color === "orange"
              ? "text-orange-500"
              : color === "green"
              ? "text-green-500"
              : color === "blue"
              ? "text-blue-500"
              : color === "purple"
              ? "text-purple-500"
              : "text-gray-500"
          }`}
        />
      </div>
      <div>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );

  // Sidebar filter component
  const Sidebar = () => (
    <motion.aside
      ref={sidebarRef}
      initial={{ x: "-100%" }}
      animate={{ x: showSidebar ? 0 : "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed inset-y-0 left-0 w-80 z-30 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } border-r ${
        isDarkMode ? "border-gray-800" : "border-gray-200"
      } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-lg font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Filters
        </h3>
        <button
          onClick={() => setShowSidebar(false)}
          className={`rounded-full p-2 ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {/* View selector */}
        <div>
          <h4
            className={`text-sm font-medium mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            View Mode
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => changeViewMode("cards")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                viewMode === "cards"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Card Grid</span>
            </button>

            <button
              onClick={() => changeViewMode("timeline")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                viewMode === "timeline"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => changeViewMode("calendar")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                viewMode === "calendar"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => changeViewMode("map")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                viewMode === "map"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </button>

            <button
              onClick={() => changeViewMode("stats")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                viewMode === "stats"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <PieChart className="w-4 h-4" />
              <span>Statistics</span>
            </button>
          </div>
        </div>

        {/* Date filter */}
        <div>
          <h4
            className={`text-sm font-medium mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Date
          </h4>
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                activeTab === "all"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <TicketCheck className="w-4 h-4" />
              <span>All Tickets</span>
              <span
                className={`ml-auto text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {tickets?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                activeTab === "upcoming"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming</span>
              <span
                className={`ml-auto text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {upcomingTickets?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`flex items-center gap-2 w-full p-2 rounded ${
                activeTab === "past"
                  ? isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-500"
                  : isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Past</span>
              <span
                className={`ml-auto text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {pastTickets?.length || 0}
              </span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4
            className={`text-sm font-medium mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Categories
          </h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  if (selectedCategories.includes(category)) {
                    setSelectedCategories(
                      selectedCategories.filter((c) => c !== category),
                    );
                  } else {
                    setSelectedCategories([...selectedCategories, category]);
                  }
                }}
                className={`flex items-center gap-2 w-full p-2 rounded ${
                  selectedCategories.includes(category)
                    ? isDarkMode
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-orange-50 text-orange-500"
                    : isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    category === "VIP"
                      ? "bg-purple-500"
                      : category === "Standard"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                />
                <span>{category}</span>
                {selectedCategories.includes(category) && (
                  <CheckCheck className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}

            {categories.length === 0 && (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No categories available
              </p>
            )}
          </div>
        </div>

        {/* Cities */}
        <div>
          <h4
            className={`text-sm font-medium mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Locations
          </h4>
          <div className="space-y-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  if (selectedCities.includes(city)) {
                    setSelectedCities(selectedCities.filter((c) => c !== city));
                  } else {
                    setSelectedCities([...selectedCities, city]);
                  }
                }}
                className={`flex items-center gap-2 w-full p-2 rounded ${
                  selectedCities.includes(city)
                    ? isDarkMode
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-orange-50 text-orange-500"
                    : isDarkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{city}</span>
                {selectedCities.includes(city) && (
                  <CheckCheck className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}

            {cities.length === 0 && (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No locations available
              </p>
            )}
          </div>
        </div>

        {/* Sort options */}
        <div>
          <h4
            className={`text-sm font-medium mb-3 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Sort By
          </h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`w-full p-2.5 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-orange-500`}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Reset button */}
        <div className="pt-2">
          <button
            onClick={resetFilters}
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </motion.aside>
  );

  // Overlay for sidebar
  const SidebarOverlay = () => (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </AnimatePresence>
  );

  // Header component
  const Header = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`p-3 ${
            isDarkMode ? "bg-orange-500/10" : "bg-orange-100"
          } rounded-xl`}
        >
          <Ticket className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Tickets
          </h1>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            {filteredTickets.length} tickets found
            {activeTab !== "all" && ` • ${activeTab}`}
            {(selectedCategories.length > 0 || selectedCities.length > 0) &&
              " • filtered"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSidebar(true)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-700 text-white"
              : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
          } transition-colors shadow-sm`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {(selectedCategories.length > 0 || selectedCities.length > 0) && (
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                isDarkMode
                  ? "bg-orange-500 text-white"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {selectedCategories.length + selectedCities.length}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate("/tickets")}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-xl text-white flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tickets</span>
        </button>
      </div>
    </div>
  );

  // Search bar component
  const SearchBar = () => (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="Search tickets by name, event, or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white focus:ring-orange-500/50"
            : "bg-white border-gray-200 text-gray-900 focus:ring-orange-500/30"
        } focus:outline-none focus:ring-2 transition-all shadow-sm`}
      />
      <Search
        className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      />

      {searchTerm && (
        <button
          onClick={() => setSearchTerm("")}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${
            isDarkMode
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  // View selector component
  const ViewSelector = () => (
    <div
      className={`flex justify-between items-center mb-6 sticky top-0 z-10 backdrop-blur-sm p-3 -mx-3 ${
        isDarkMode ? "bg-gray-900/80" : "bg-gray-50/80"
      }`}
    >
      <div
        className={`flex rounded-xl overflow-hidden border ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => changeViewMode("cards")}
          className={`p-2 flex items-center ${
            viewMode === "cards"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
              : isDarkMode
              ? "bg-gray-800/50 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <Grid className="w-5 h-5" />
        </button>

        <button
          onClick={() => changeViewMode("timeline")}
          className={`p-2 flex items-center ${
            viewMode === "timeline"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
              : isDarkMode
              ? "bg-gray-800/50 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <LayoutList className="w-5 h-5" />
        </button>

        <button
          onClick={() => changeViewMode("calendar")}
          className={`p-2 flex items-center ${
            viewMode === "calendar"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
              : isDarkMode
              ? "bg-gray-800/50 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <CalendarDays className="w-5 h-5" />
        </button>

        <button
          onClick={() => changeViewMode("map")}
          className={`p-2 flex items-center ${
            viewMode === "map"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
              : isDarkMode
              ? "bg-gray-800/50 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <Map className="w-5 h-5" />
        </button>

        <button
          onClick={() => changeViewMode("stats")}
          className={`p-2 flex items-center ${
            viewMode === "stats"
              ? isDarkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-900"
              : isDarkMode
              ? "bg-gray-800/50 text-gray-400 hover:text-white"
              : "bg-gray-100 text-gray-500 hover:text-gray-900"
          }`}
        >
          <PieChart className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`p-2 rounded-lg border ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-900"
          } focus:outline-none text-sm`}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>

        {(selectedCategories.length > 0 ||
          selectedCities.length > 0 ||
          searchTerm) && (
          <button
            onClick={resetFilters}
            className={`p-2 rounded-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );

  // Stats grid component
  const StatsGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        icon={TicketCheck}
        title="All Tickets"
        value={tickets?.length || 0}
        color="orange"
        onClick={() => setActiveTab("all")}
      />

      <StatsCard
        icon={Calendar}
        title="Upcoming Events"
        value={upcomingTickets?.length || 0}
        color="green"
        onClick={() => setActiveTab("upcoming")}
      />

      <StatsCard
        icon={Clock}
        title="Past Events"
        value={pastTickets?.length || 0}
        color="blue"
        onClick={() => setActiveTab("past")}
      />

      <StatsCard
        icon={CreditCard}
        title="Total Value"
        value={formatCurrency(totalValue)}
        color="purple"
      />
    </div>
  );

  // No results component
  const NoResultsFound = () => (
    <div
      className={`p-8 rounded-xl text-center ${
        isDarkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      } shadow-lg`}
    >
      <Search
        className={`w-12 h-12 mx-auto mb-4 ${
          isDarkMode ? "text-gray-600" : "text-gray-400"
        }`}
      />

      <h3
        className={`text-lg font-medium ${
          isDarkMode ? "text-white" : "text-gray-900"
        } mb-2`}
      >
        No tickets found
      </h3>

      <p
        className={`${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        } mb-6 max-w-md mx-auto`}
      >
        {searchTerm
          ? `No results for "${searchTerm}"`
          : "Try adjusting your filters or browse available tickets"}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          Reset Filters
        </button>

        <button
          onClick={() => navigate("/tickets")}
          className={`px-4 py-2 ${
            isDarkMode
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          } rounded-lg transition-colors`}
        >
          Browse Tickets
        </button>
      </div>
    </div>
  );

  // Render the appropriate view
  const renderView = () => {
    if (filteredTickets.length === 0) {
      return <NoResultsFound />;
    }

    switch (viewMode) {
      case "timeline":
        return (
          <TicketTimeline
            tickets={filteredTickets}
            onAction={handleAction}
            isDarkMode={isDarkMode}
          />
        );
      case "calendar":
        return (
          <CalendarView
            tickets={filteredTickets}
            onAction={handleAction}
            isDarkMode={isDarkMode}
          />
        );
      case "stats":
        return (
          <StatsVisualization
            tickets={filteredTickets}
            isDarkMode={isDarkMode}
          />
        );
      case "map":
        return (
          <MapView
            tickets={filteredTickets}
            onAction={handleAction}
            isDarkMode={isDarkMode}
          />
        );
      case "cards":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <FlippableTicketCard
                key={ticket.ticketId}
                ticket={ticket}
                onAction={handleAction}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className={`relative w-16 h-16 ${
            isDarkMode ? "text-orange-500" : "text-orange-500"
          }`}
        >
          <svg
            className="animate-spin w-full h-full"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10C32.7746 10 18.6646 24.11 18.6646 41.3354C18.6646 41.9142 19.1328 42.3823 19.7115 42.3823H26.6224C27.2012 42.3823 27.6693 41.9142 27.6693 41.3354C27.6693 29.0689 37.7335 19.0047 50 19.0047C62.2665 19.0047 72.3307 29.0689 72.3307 41.3354C72.3307 53.6018 62.2665 63.6661 50 63.6661C49.4212 63.6661 48.9531 64.1342 48.9531 64.713V71.6238C48.9531 72.2026 49.4212 72.6708 50 72.6708C67.2254 72.6708 81.3354 58.5608 81.3354 41.3354C81.3354 24.11 67.2254 10 50 10Z"
              fill="currentColor"
            />
          </svg>
          <div
            className={`absolute inset-0 ${
              isDarkMode ? "text-white" : "text-gray-900"
            } flex items-center justify-center opacity-80 text-xs font-bold`}
          >
            {Math.floor(Math.random() * 100)}%
          </div>
        </div>
        <p className={`mt-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Loading your tickets...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h3
          className={`text-xl font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-2 text-center`}
        >
          Oops! Something went wrong
        </h3>
        <p
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } text-center max-w-md mb-8`}
        >
          {error}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={refetch}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className={`px-6 py-3 ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
            } rounded-xl transition-colors flex items-center gap-2`}
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!tickets?.length) {
    return <EmptyState isDarkMode={isDarkMode} navigate={navigate} />;
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Sidebar for filters */}
      <Sidebar />
      <SidebarOverlay />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Header />

        {/* Stats Grid */}
        <StatsGrid />

        {/* Search Bar */}
        <SearchBar />

        {/* View Selector */}
        <ViewSelector />

        {/* Content with transition */}
        <motion.div
          animate={{
            opacity: viewTransition ? 0 : 1,
            y: viewTransition ? 20 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>

        {/* Help button */}
        <div className="fixed bottom-6 right-6">
          <button
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTicketsPage;
