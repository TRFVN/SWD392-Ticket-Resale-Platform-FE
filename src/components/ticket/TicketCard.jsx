import React from "react";
import {
  Tag,
  MapPin,
  Calendar,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TicketCard = ({ ticket, onAction }) => {
  const navigate = useNavigate();
  const {
    ticketName,
    ticketPrice,
    ticketImage,
    eventDate,
    serialNumber,
    ticketDescription,
    city,
    district,
    userId, // ID of ticket owner
  } = ticket;

  const handleChatClick = (e) => {
    e.stopPropagation();
    if (userId) {
      navigate(`/chat/${userId}`);
    } else {
      toast.error("Không thể chat với người bán này");
    }
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      {/* Ticket Shape Overlay */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-gray-100 dark:bg-gray-700 rounded-r-full" />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-12 bg-gray-100 dark:bg-gray-700 rounded-l-full" />

      {/* Main Content */}
      <div className="p-1">
        {/* Image Section */}
        <div className="relative h-48 rounded-[1.75rem] overflow-hidden">
          <img
            src={ticketImage}
            alt={ticketName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Top Tags */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2">
              <Tag size={14} />
              <span className="text-sm font-medium">Premium</span>
            </div>
            <div className="bg-emerald-500/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              Available
            </div>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white dark:bg-gray-800 text-2xl font-bold px-4 py-2 rounded-xl shadow-lg">
              {ticketPrice.toLocaleString("vi-VN")}đ
            </div>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {ticketName}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {ticketDescription}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {new Date(eventDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {[city, district].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Serial No.
              </span>
              <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                {serialNumber}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleChatClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                <MessageCircle size={18} />
                <span className="text-sm font-medium">Chat</span>
              </button>
              <button
                onClick={() => onAction(ticket)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
