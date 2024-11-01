import React, { useEffect, useState } from "react";
import {
  Tag,
  MapPin,
  Calendar,
  MessageCircle,
  Search,
  Filter,
  Ticket,
  ShoppingCart,
  Heart,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTicketsApi } from "../../services/ticket";
import TicketGrid from "../../components/ticket/TicketGrid";

// Main TicketsPage component with original logic and new cart functionality
const TicketsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("purchased");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await getAllTicketsApi();
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filterTickets = () => {
    switch (activeTab) {
      case "purchased":
        return tickets.filter((ticket) => ticket.status === 1);
      case "negotiating":
        return tickets.filter((ticket) => ticket.status === 2);
      case "selling":
        return tickets.filter((ticket) => ticket.status === 3);
      default:
        return [];
    }
  };

  const handleAction = (ticket) => {
    switch (activeTab) {
      case "purchased":
        navigate(`/tickets/${ticket.ticketId}`);
        break;
      case "negotiating":
        navigate(`/chats?ticketId=${ticket.ticketId}`);
        break;
      case "selling":
        navigate(`/tickets/${ticket.ticketId}/edit`);
        break;
    }
  };

  const handleAddToCart = (ticket) => {
    setCartItems((prev) => [...prev, ticket]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Available Tickets</h1>
            <div className="flex items-center gap-4">
              <button className="relative p-2 group">
                <ShoppingCart className="w-6 h-6 text-white" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
                {/* Cart Preview Tooltip */}
                {cartItems?.length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-gray-900 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                    <div className="p-4">
                      <div className="text-sm font-medium text-white mb-3">
                        Cart ({cartItems.length})
                      </div>
                      <div className="space-y-3">
                        {cartItems.slice(0, 3).map((item) => (
                          <div
                            key={item.ticketId}
                            className="flex items-center gap-3"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden">
                              <img
                                src={item.ticketImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {item.ticketName}
                              </p>
                              <p className="text-sm text-orange-500">
                                {item.ticketPrice.toLocaleString("vi-VN")}đ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => navigate("/cart")}
                        className="w-full mt-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
                      >
                        View Cart
                      </button>
                    </div>
                  </div>
                )}
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-colors">
                Add Ticket
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <TicketGrid
            tickets={filterTickets()}
            onAction={handleAction}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketsPage;
