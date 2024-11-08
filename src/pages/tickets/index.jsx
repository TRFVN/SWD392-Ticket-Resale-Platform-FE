import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Ticket, AlertCircle, Loader2, Plus } from "lucide-react";
import { getAllTicketsApi } from "../../services/ticket";
import { useNavigate } from "react-router-dom";
import TicketGrid from "../../components/ticket/TicketGrid";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTicketsApi();
      setTickets(data);
    } catch (err) {
      setError(err.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (ticket) => {
    try {
      // Implement add to cart logic here
      console.log("Adding to cart:", ticket);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleAction = (ticket) => {
    navigate(`/tickets/${ticket.ticketId}`, { state: { ticket } });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="mt-4 text-gray-400">Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-500/10 rounded-full mb-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h3 className="text-xl font-medium text-white mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-400 text-center mb-6">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={fetchTickets}
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

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-black"
      } transition-colors duration-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <Ticket className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Available Tickets
              </h1>
              <p className="text-gray-400">{tickets.length} tickets found</p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Example: Add New Ticket Button for admins */}
            {/* <button
              onClick={() => navigate("/tickets/new")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Ticket</span>
            </button> */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-400 text-sm">Total Events</p>
            <p className="text-2xl font-bold text-white">
              {new Set(tickets.map((t) => t.eventId)).size}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-400 text-sm">Categories</p>
            <p className="text-2xl font-bold text-white">
              {new Set(tickets.map((t) => t.categoryName)).size}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-400 text-sm">Locations</p>
            <p className="text-2xl font-bold text-white">
              {new Set(tickets.map((t) => t.city)).size}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-gray-400 text-sm">Price Range</p>
            <p className="text-2xl font-bold text-white">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Math.min(...tickets.map((t) => t.ticketPrice)))}{" "}
              -
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(Math.max(...tickets.map((t) => t.ticketPrice)))}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <TicketGrid
          tickets={tickets}
          onAction={handleAction}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default TicketsPage;
