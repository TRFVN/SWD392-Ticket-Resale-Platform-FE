import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useContext,
} from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Edit,
  Trash2,
  MoreVertical,
  ChevronRight,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEventByUserID } from "../../../services/eventApi";
import { AuthContext } from "../../../context/AuthContext";

// Memoized components for better performance
const EventCard = memo(({ event, onEdit, onDelete, isDarkMode }) => {
  const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const primaryBg = isDarkMode ? "bg-orange-500" : "bg-orange-500";
  const primaryBgLight = isDarkMode ? "bg-orange-500/10" : "bg-orange-50";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

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
  const isPastEvent = new Date(event.eventDate) < new Date();

  return (
    <div
      className={`rounded-3xl overflow-hidden ${bgElevated} border ${borderColor}`}
    >
      {/* Banner */}
      <div className="relative h-48 w-full overflow-hidden">
        {hasValidImage ? (
          <>
            <img
              src={event.eventImage}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent"></div>
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
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium 
            ${
              event.status === 1
                ? isDarkMode
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-green-500/10 text-green-600 border border-green-500/20"
                : isDarkMode
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
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
            className={`flex flex-col items-center rounded-2xl py-2 px-3 backdrop-blur-md ${bgElevated} border border-white/10`}
          >
            <span className={`text-xs uppercase font-medium ${primaryColor}`}>
              {eventDate.month}
            </span>
            <span className="text-xl font-bold text-white leading-none mt-1">
              {eventDate.day}
            </span>
            <span className="text-[10px] text-white/70">{eventDate.year}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => onEdit(event)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${bgElevated} text-white hover:bg-white/10`}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(event)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${bgElevated} text-red-400 hover:bg-red-500/10`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className={`font-medium ${textPrimary}`}>{event.eventName}</h3>
            <p className={`text-sm mt-1 ${textTertiary} line-clamp-2`}>
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
              <span className={textSecondary}>{event.location}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className={`text-2xl font-bold ${primaryColor}`}>
                {event.ticketTemplates?.length || 0}
              </div>
              <div className={`text-xs ${textTertiary}`}>Loại vé</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${primaryColor}`}>
                {event.ticketTemplates?.reduce(
                  (acc, ticket) => acc + ticket.totalQuantity,
                  0,
                ) || 0}
              </div>
              <div className={`text-xs ${textTertiary}`}>Tổng vé</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${primaryColor}`}>
                {event.ticketTemplates?.reduce(
                  (acc, ticket) => acc + ticket.availableQuantity,
                  0,
                ) || 0}
              </div>
              <div className={`text-xs ${textTertiary}`}>Còn lại</div>
            </div>
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
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await getEventByUserID(user.id);
      console.log("API response:", response);

      if (response) {
        if (Array.isArray(response)) {
          setEvents(response);
        } else if (response.events && Array.isArray(response.events)) {
          setEvents(response.events);
        } else if (response.data && Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error("Unexpected API response format:", response);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load your events");
      setEvents([]); // Ensure events is an empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch events
  useEffect(() => {
    // Simulate loading with the provided event data
    // setTimeout(() => {
    //   setEvents([
    //     {
    //       eventId: "1582cc5d-b586-42a6-b78b-4a3856796f14",
    //       eventName: "ronaldo ra mắt clb hà nội",
    //       eventDate: "2026-02-20T05:20:00Z",
    //       eventDescription: "anh 8 hết thời\n",
    //       eventImage:
    //         "https://storage.googleapis.com/tickethub-af919.appspot.com/EventImages/faaf5002-7b98-401f-b7bc-f4b9ef0bfe00_images.jpg",
    //       location: "HCM, Quận Ba Đình, Thành phố Hà Nội",
    //       status: 1,
    //       categoryId: "841d3c6e-ee0e-49fc-97cf-9620c9d66768",
    //       ticketTemplates: [],
    //     },
    //   ]);
    //   setLoading(false);
    // }, 500);
    fetchMyEvents();
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
    setEvents((prev) =>
      prev.filter((e) => e.eventId !== selectedEvent.eventId),
    );
    setShowDeleteConfirm(false);
    setSelectedEvent(null);
  }, [selectedEvent]);

  const bgBase = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const primaryBg = isDarkMode ? "bg-orange-500" : "bg-orange-500";

  return (
    <div className={`min-h-screen ${bgBase}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl font-bold ${textPrimary}`}>
              Sự kiện của tôi
            </h1>
            <p className={`mt-1 ${textSecondary}`}>
              Quản lý và chỉnh sửa các sự kiện bạn đã tạo
            </p>
          </div>
          <button
            onClick={() => navigate("/events/create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${primaryBg} text-white font-medium hover:bg-orange-600`}
          >
            <Plus size={18} />
            <span>Tạo sự kiện mới</span>
          </button>
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : events.length === 0 ? (
          <div className={`text-center py-12 ${textSecondary}`}>
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Bạn chưa tạo sự kiện nào</p>
            <button
              onClick={() => navigate("/events/create")}
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${primaryBg} text-white font-medium hover:bg-orange-600`}
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
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md mx-4 p-6 rounded-3xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className={`w-6 h-6 ${primaryColor}`} />
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
                className={`flex-1 px-4 py-2 rounded-xl border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } ${textSecondary} hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MyEvents);
