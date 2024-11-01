import {
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TicketCard = ({ ticket, onAddToCart }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString()}đ`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/tickets/${ticket.ticketId}`, {
      state: { ticket }, // Pass the ticket data through navigation state
    });
  };
  return (
    <div className="group bg-gray-800/50 backdrop-blur rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-orange-500/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={ticket.ticketImage}
          alt={ticket.ticketName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />

        {/* Premium Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-orange-500/90 backdrop-blur-sm rounded-full flex items-center gap-2">
          <Tag size={14} className="text-white" />
          <span className="text-white text-sm font-medium">Premium</span>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isLiked ? "bg-red-500" : "bg-gray-900/60 hover:bg-red-500"
          }`}
        >
          <Heart
            className="w-5 h-5 text-white"
            fill={isLiked ? "white" : "none"}
          />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-white text-lg font-bold line-clamp-1">
              {ticket.ticketName}
            </h3>
            <div className="flex items-center gap-2 text-gray-300">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDate(ticket.eventDate)}</span>
            </div>
          </div>
          <div className="bg-orange-500 px-4 py-2 rounded-xl">
            <span className="text-white text-lg font-bold">
              {formatPrice(ticket.ticketPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-gray-400 text-sm line-clamp-2">
          {ticket.ticketDescription}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">
            {[ticket.city, ticket.district].filter(Boolean).join(", ")}
          </span>
        </div>

        {/* Serial Number & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Serial No.</span>
            <span className="font-mono text-sm text-gray-300">
              {ticket.serialNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(ticket);
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/chat/${ticket.userId}`);
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
            <button
              onClick={handleDetailsClick}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
