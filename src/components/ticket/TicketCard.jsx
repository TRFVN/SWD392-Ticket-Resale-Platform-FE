import {
  Calendar,
  Tag,
  Clock,
  MapPin,
  ShoppingCart,
  ExternalLink,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { memo } from "react";

const TicketCard = memo(({ ticket, onAddToCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode || false);
  const isMyTicketsPage = location.pathname.includes("/mytickets");

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDetailsClick = () => {
    navigate(`/tickets/${ticket.ticketId}`, {
      state: { ticket, fromMyTickets: isMyTicketsPage },
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (typeof onAddToCart === "function") {
      onAddToCart(ticket);
    }
  };

  return (
    <div
      onClick={handleDetailsClick}
      className={`flex flex-col h-full rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer ${
        isDarkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      {/* Ticket Header */}
      <div
        className={`p-4 ${
          isDarkMode ? "bg-gray-750" : "bg-orange-50"
        } border-b ${isDarkMode ? "border-gray-700" : "border-orange-100"}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag
              className={`w-4 h-4 ${
                isDarkMode ? "text-orange-400" : "text-orange-500"
              }`}
            />
            <span
              className={`font-medium ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {ticket.rank || "Thường"}
            </span>
          </div>
          <span
            className={`text-sm font-semibold ${
              isDarkMode ? "text-orange-400" : "text-orange-500"
            }`}
          >
            {formatPrice(ticket.ticketPrice || 0)}
          </span>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="flex-1 p-4">
        <h3
          className={`text-lg font-semibold mb-3 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {ticket.ticketName || "Vé không tên"}
        </h3>

        <div className="space-y-2">
          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } text-sm`}
          >
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {ticket.eventName || "Sự kiện không tên"}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } text-sm`}
          >
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              {ticket.city || "Không có địa điểm"}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } text-sm`}
          >
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              Còn {ticket.availableQuantity || 0}/{ticket.totalQuantity || 0} vé
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Actions */}
      <div
        className={`p-3 border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-100"
        } flex justify-between items-center`}
      >
        <button
          onClick={handleDetailsClick}
          className={`text-sm flex items-center gap-1 ${
            isDarkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>Chi tiết</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={handleAddToCart}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
            isDarkMode
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          } flex items-center gap-1.5`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
});

TicketCard.displayName = "TicketCard";

export default TicketCard;
