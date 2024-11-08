import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Ticket,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TicketGrid from "../../../components/ticket/TicketGrid";
import { useTickets } from "../../../hooks/useTickets";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300
      ${type === "success" ? "bg-green-500/90" : "bg-red-500/90"} text-white`}
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5" />
      ) : (
        <XCircle className="w-5 h-5" />
      )}
      <p className="font-medium">{message}</p>
    </div>
  );
};

const MyTicketsPage = () => {
  const { tickets, loading, error, refetch } = useTickets("user");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  const handleAction = (ticket) => {
    navigate(`/tickets/${ticket.ticketId}`, { state: { ticket } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className={`mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Loading your tickets...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3
          className={`text-xl font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          Oops! Something went wrong
        </h3>
        <p
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } text-center mb-6`}
        >
          {error}
        </p>
        <div className="flex gap-4">
          <button
            onClick={refetch}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // If no tickets
  if (!tickets?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div
          className={`p-6 ${
            isDarkMode ? "bg-gray-800/50" : "bg-gray-100"
          } rounded-full mb-6`}
        >
          <Ticket className="w-12 h-12 text-orange-500" />
        </div>
        <h3
          className={`text-xl font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          } mb-2`}
        >
          No tickets found
        </h3>
        <p
          className={`${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } text-center mb-6`}
        >
          You haven't purchased any tickets yet
        </p>
        <button
          onClick={() => navigate("/tickets")}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
        >
          Browse Tickets
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 ${
                isDarkMode ? "bg-orange-500/10" : "bg-orange-100"
              } rounded-lg`}
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
                {tickets.length} tickets found
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm rounded-xl p-4 border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Upcoming Events
              </p>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {tickets.filter((t) => new Date(t.eventDate) > new Date()).length}
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm rounded-xl p-4 border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Categories
              </p>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {new Set(tickets.map((t) => t.categoryName)).size}
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm rounded-xl p-4 border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Locations
              </p>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {new Set(tickets.map((t) => t.city)).size}
            </p>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-sm rounded-xl p-4 border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5 text-orange-500" />
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                Total Value
              </p>
            </div>
            <p
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              } mt-2`}
            >
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(tickets.reduce((sum, t) => sum + t.ticketPrice, 0))}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <TicketGrid tickets={tickets} onAction={handleAction} />

        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MyTicketsPage;
