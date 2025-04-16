import React, { useState, useEffect, memo, useCallback } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Edit,
  Trash2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEventByUserID, deleteEventApi } from "../../../services/eventApi";
import { getTicketTemplatesByEventId } from "../../../services/ticketApi";

// Memoized components for better performance
const EventCard = memo(({ event, onEdit, onDelete, isDarkMode, navigate }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketData, setTicketData] = useState({
    templates: [],
    totalTickets: 0,
    availableTickets: 0,
    loaded: false,
  });

  // Theme variables
  const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const bgOverlay = isDarkMode ? "bg-gray-900/60" : "bg-gray-800/50";
  const badgeBg = isDarkMode ? "bg-gray-800/80" : "bg-white/80";

  // Fetch ticket templates for this event
  useEffect(() => {
    const fetchTicketData = async () => {
      if (ticketData.loaded) return;

      try {
        setIsLoading(true);
        const response = await getTicketTemplatesByEventId(event.eventId);

        let templates = [];
        if (Array.isArray(response)) {
          templates = response;
        } else if (response && Array.isArray(response.result)) {
          templates = response.result;
        }

        const totalTickets = templates.reduce(
          (acc, ticket) => acc + (ticket.totalQuantity || 0),
          0,
        );

        const availableTickets = templates.reduce(
          (acc, ticket) => acc + (ticket.availableQuantity || 0),
          0,
        );

        setTicketData({
          templates,
          totalTickets,
          availableTickets,
          loaded: true,
        });
      } catch (error) {
        console.error(
          `Error fetching tickets for event ${event.eventId}:`,
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketData();
  }, [event.eventId, ticketData.loaded]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString("vi-VN", { month: "short" }),
      weekday: date.toLocaleString("vi-VN", { weekday: "long" }),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const eventDate = formatDate(event.eventDate);
  const hasValidImage =
    event.eventImage &&
    (event.eventImage.startsWith("http") ||
      event.eventImage.includes(".appspot.com"));

  // Handle card click to navigate to event details
  const handleCardClick = () => {
    navigate(`/events/${event.eventId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group rounded-2xl overflow-hidden ${bgElevated} border ${borderColor} hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-[460px]`}
    >
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
        {hasValidImage ? (
          <>
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x200?text=No+Image";
              }}
            />
            <div
              className={`absolute inset-0 ${bgOverlay} opacity-30 group-hover:opacity-20 transition-opacity`}
            ></div>
          </>
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <Calendar
              className={`w-24 h-24 ${
                isDarkMode ? "text-gray-700" : "text-gray-300"
              }`}
            />
          </div>
        )}

        {/* Event status */}
        <div className="absolute top-4 left-4">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-sm text-xs font-medium 
            ${
              event.status === 1
                ? isDarkMode
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-green-500/10 text-green-600 border border-green-500/20"
                : isDarkMode
                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                : "bg-red-500/10 text-red-600 border border-red-500/20"
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                event.status === 1 ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {event.status === 1 ? "Đang diễn ra" : "Không hoạt động"}
          </span>
        </div>

        {/* Event date */}
        <div className="absolute bottom-4 left-4">
          <div
            className={`flex flex-col items-center rounded-xl py-2 px-3 backdrop-blur-md ${badgeBg} border border-white/10 shadow-md`}
          >
            <span className={`text-xs uppercase font-medium ${primaryColor}`}>
              {eventDate.month}
            </span>
            <span
              className={`text-xl font-bold ${textPrimary} leading-none mt-1`}
            >
              {eventDate.day}
            </span>
            <span className={`text-[10px] ${textTertiary}`}>
              {eventDate.year}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeBg} backdrop-blur-sm text-primary hover:bg-white/20 dark:hover:bg-gray-700/70 transition-colors`}
            aria-label="Chỉnh sửa sự kiện"
            title="Chỉnh sửa sự kiện"
          >
            <Edit size={16} className={primaryColor} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${badgeBg} backdrop-blur-sm hover:bg-red-500/10 transition-colors`}
            aria-label="Xóa sự kiện"
            title="Xóa sự kiện"
          >
            <Trash2 size={16} className="text-red-400 dark:text-red-300" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow overflow-hidden">
        <div className="space-y-3 flex-grow overflow-hidden">
          <div>
            <h3 className={`font-medium text-lg ${textPrimary} truncate`}>
              {event.eventName}
            </h3>
            <p
              className={`text-sm mt-1 ${textTertiary} line-clamp-2 overflow-hidden`}
            >
              {event.eventDescription}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${primaryColor}`} />
              <span className={textSecondary}>{eventDate.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className={`w-4 h-4 ${primaryColor}`} />
              <span className={`${textSecondary} line-clamp-1`}>
                {event.location}
              </span>
            </div>
          </div>
        </div>

        {/* Stats - Fixed at bottom */}
        <div className="grid grid-cols-3 gap-4 pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div
              className={`text-xl font-bold ${primaryColor} min-h-[28px] flex items-center justify-center`}
            >
              {isLoading ? (
                <div className="inline-block w-4 h-4 border-2 border-t-transparent border-orange-500 rounded-full animate-spin mx-auto"></div>
              ) : (
                ticketData.templates.length
              )}
            </div>
            <div className={`text-xs ${textTertiary}`}>Loại vé</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl font-bold ${primaryColor} min-h-[28px] flex items-center justify-center`}
            >
              {isLoading ? (
                <div className="inline-block w-4 h-4 border-2 border-t-transparent border-orange-500 rounded-full animate-spin mx-auto"></div>
              ) : (
                ticketData.totalTickets
              )}
            </div>
            <div className={`text-xs ${textTertiary}`}>Tổng vé</div>
          </div>
          <div className="text-center">
            <div
              className={`text-xl font-bold ${primaryColor} min-h-[28px] flex items-center justify-center`}
            >
              {isLoading ? (
                <div className="inline-block w-4 h-4 border-2 border-t-transparent border-orange-500 rounded-full animate-spin mx-auto"></div>
              ) : (
                ticketData.availableTickets
              )}
            </div>
            <div className={`text-xs ${textTertiary}`}>Còn lại</div>
          </div>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = "EventCard";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventByUserID();

      if (response && Array.isArray(response)) {
        // Sort events by date (newest first)
        const sortedEvents = [...response].sort(
          (a, b) => new Date(b.eventDate) - new Date(a.eventDate),
        );
        setEvents(sortedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải sự kiện, vui lòng thử lại sau");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = useCallback(() => {
    fetchMyEvents();
    toast.info("Đang làm mới danh sách sự kiện...");
  }, []);

  const handleEdit = useCallback(
    (event) => {
      navigate(`/events/edit/${event.eventId}`);
    },
    [navigate],
  );

  const handleDelete = useCallback((event) => {
    setSelectedEvent(event);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedEvent) return;

    try {
      setDeleteLoading(true);
      await deleteEventApi(selectedEvent.eventId);
      setEvents((prev) =>
        prev.filter((e) => e.eventId !== selectedEvent.eventId),
      );
      toast.success("Xóa sự kiện thành công");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Không thể xóa sự kiện, vui lòng thử lại sau");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent]);

  // Theme-related variables
  const bgBase = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const primaryBg = isDarkMode ? "bg-orange-500" : "bg-orange-500";

  return (
    <div className={`min-h-screen ${bgBase} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>
              Sự kiện của tôi
            </h1>
            <p className={`mt-1 ${textSecondary}`}>
              Quản lý và chỉnh sửa các sự kiện bạn đã tạo
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${borderColor} ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
              title="Làm mới danh sách"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <button
              onClick={() => navigate("/events/create")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${primaryBg} text-white font-medium hover:bg-orange-600 transition-colors shadow-sm`}
            >
              <Plus size={18} />
              <span>Tạo sự kiện mới</span>
            </button>
          </div>
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-orange-500 mb-4"></div>
            <p className={textSecondary}>Đang tải sự kiện...</p>
          </div>
        ) : events.length === 0 ? (
          <div
            className={`text-center py-16 ${textSecondary} rounded-3xl ${bgElevated} border ${borderColor} shadow-sm`}
          >
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Bạn chưa tạo sự kiện nào</p>
            <p className={`${textTertiary} mt-1 mb-6 max-w-md mx-auto`}>
              Tạo sự kiện đầu tiên của bạn để bắt đầu bán vé và quản lý các hoạt
              động
            </p>
            <button
              onClick={() => navigate("/events/create")}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${primaryBg} text-white font-medium hover:bg-orange-600 shadow-sm`}
            >
              <Plus size={18} />
              <span>Tạo sự kiện mới</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.eventId}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDarkMode={isDarkMode}
                navigate={navigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className={`w-full max-w-md mx-4 p-6 rounded-2xl ${bgElevated} shadow-xl border ${borderColor}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <h3 className={`text-lg font-medium ${textPrimary}`}>
                Xác nhận xóa
              </h3>
            </div>
            <p className={textSecondary}>
              Bạn có chắc chắn muốn xóa sự kiện &ldquo;
              {selectedEvent?.eventName}&rdquo;? Hành động này không thể hoàn
              tác.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className={`flex-1 px-4 py-2 rounded-xl border ${borderColor} ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                {deleteLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent border-white"></div>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MyEvents);
