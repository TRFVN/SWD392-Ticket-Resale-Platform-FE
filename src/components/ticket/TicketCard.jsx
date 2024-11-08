import {
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Tag,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const TicketCard = ({ ticket, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);

  // Check if we're on the MyTickets page
  const isMyTicketsPage = location.pathname.includes("/mytickets");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/tickets/${ticket.ticketId}`, {
      state: {
        ticket,
        fromMyTickets: isMyTicketsPage,
      },
    });
  };

  return (
    <div
      className={`group relative ${
        isDarkMode ? "bg-gray-800/50" : "bg-white/50"
      } backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={ticket.ticketImage || "/api/placeholder/400/300"}
          alt={ticket.ticketName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${
            isDarkMode
              ? "from-gray-900 via-gray-900/50"
              : "from-gray-800 via-gray-800/40"
          } to-transparent`}
        />

        {/* Top Badges - Only show if not on MyTickets */}
        {!isMyTicketsPage && (
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center gap-2">
                <Tag size={14} className="text-white" />
                <span className="text-white text-sm font-medium">
                  {ticket.categoryName}
                </span>
              </div>
              {ticket.eventName !== ticket.ticketName && (
                <div
                  className={`px-3 py-1 ${
                    isDarkMode ? "bg-gray-800/80" : "bg-gray-700/70"
                  } backdrop-blur-sm rounded-full`}
                >
                  <span className="text-white text-sm">{ticket.eventName}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLike}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 
                ${
                  isLiked
                    ? "bg-red-500"
                    : isDarkMode
                    ? "bg-gray-900/60 hover:bg-red-500"
                    : "bg-gray-800/60 hover:bg-red-500"
                }`}
            >
              <Heart
                className="w-5 h-5 text-white"
                fill={isLiked ? "white" : "none"}
              />
            </button>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h3 className="text-white text-lg font-bold line-clamp-1">
                {ticket.ticketName}
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {formatDate(ticket.eventDate)}
                  </span>
                </div>
              </div>
            </div>
            {/* Price - Only show if not on MyTickets */}
            {!isMyTicketsPage && (
              <div className="bg-orange-500 px-4 py-2 rounded-xl">
                <span className="text-white text-lg font-bold">
                  {formatPrice(ticket.ticketPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Location */}
        <div
          className={`flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm truncate">
            {[ticket.city, ticket.district, ticket.address]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>

        {/* Description - Only show if not on MyTickets */}
        {!isMyTicketsPage && ticket.ticketDescription && (
          <p
            className={`text-sm line-clamp-2 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {ticket.ticketDescription}
          </p>
        )}

        {/* Action Bar */}
        <div
          className={`flex items-center justify-between pt-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="hidden sm:flex flex-col">
            <span
              className={`text-xs ${
                isDarkMode ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Serial No.
            </span>
            <span
              className={`font-mono text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {ticket.serialNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Overlay */}
      <div
        className={`absolute inset-0 ${
          isDarkMode ? "bg-gray-900/80" : "bg-gray-800/80"
        } backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4`}
      >
        {isMyTicketsPage ? (
          // MyTickets view - only show View Details
          <button
            onClick={handleDetailsClick}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors"
          >
            View Details
          </button>
        ) : (
          // Normal view - show all action buttons
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(ticket);
              }}
              className={`px-6 py-2 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-600 hover:bg-gray-500"
              } text-white rounded-xl transition-colors`}
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${ticket.userId}`);
              }}
              className={`p-2 ${
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              } rounded-xl transition-colors`}
              title="Contact seller"
            >
              <MessageCircle className="w-5 h-5 " />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
