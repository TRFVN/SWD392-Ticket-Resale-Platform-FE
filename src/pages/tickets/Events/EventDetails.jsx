import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share,
  Heart,
  Ticket,
  ShoppingCart,
  ChevronDown,
  Info,
  Users,
  Star,
  ExternalLink,
  Plus,
  Minus,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosConfig";
import { notifyCartUpdated } from "../../../utils/cartEvents";
import { getTicketTemplatesByEventId } from "../../../services/ticketApi";
import { getEventByIdApi } from "../../../services/eventApi";

// Header Actions Component - Smaller, more subtle actions
const HeaderActions = ({ onBackClick, isLiked, setIsLiked }) => (
  <>
    {/* Back button */}
    <button
      onClick={onBackClick}
      className="fixed top-5 left-5 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors"
      aria-label="Back to events"
    >
      <ArrowLeft size={16} />
    </button>

    {/* Action buttons */}
    <div className="fixed top-5 right-5 z-50 flex items-center gap-1.5">
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors"
        aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={16}
          className={isLiked ? "fill-red-500 text-red-500" : "text-white"}
        />
      </button>

      <button
        onClick={() =>
          (window.location.href = `mailto:?subject=${encodeURIComponent(
            "Check out this event!",
          )}&body=${encodeURIComponent(window.location.href)}`)
        }
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors"
        aria-label="Share event"
      >
        <Share size={16} />
      </button>

      <button
        onClick={() => (window.location.href = "/cart")}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors"
        aria-label="View cart"
      >
        <ShoppingCart size={16} />
      </button>
    </div>
  </>
);

// Event Header Component - More streamlined with better typography
const EventHeader = ({ event, eventDate }) => {
  const hasValidImage =
    event.eventImage &&
    (event.eventImage.startsWith("http") ||
      event.eventImage.includes(".appspot.com"));

  return (
    <div className="relative h-[32vh] md:h-[38vh] overflow-hidden">
      {/* Background image or placeholder */}
      {hasValidImage ? (
        <img
          src={event.eventImage}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <Calendar className="w-12 h-12 text-gray-700" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80"></div>

      {/* Event basic info */}
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
        {/* Event status pill */}
        <div
          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium mb-1.5 
          bg-orange-500/20 text-orange-300 border border-orange-500/30"
        >
          <span className="mr-1 h-1 w-1 rounded-full bg-orange-400"></span>
          {event.status === 1 ? "Đang diễn ra" : "Đã kết thúc"}
        </div>

        {/* Event title */}
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
          {event.eventName}
        </h1>

        {/* Event meta info - more compact */}
        <div className="flex flex-wrap gap-2 text-xs text-white/90">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1 text-orange-400/90" />
            <span>
              {eventDate.weekday.charAt(0).toUpperCase() +
                eventDate.weekday.slice(1)}
              , {eventDate.day} {eventDate.month}
            </span>
          </div>

          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1 text-orange-400/90" />
            <span>{eventDate.time}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-orange-400/90" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Title component for consistent headings
const SectionTitle = ({ icon: Icon, title }) => (
  <h2 className="text-base font-bold mb-2.5 flex items-center">
    <Icon className="w-4 h-4 mr-1.5 text-orange-500" />
    {title}
  </h2>
);

// Event Description Section - More compact
const EventDescription = ({
  description,
  showAllDescription,
  setShowAllDescription,
}) => (
  <section className="mb-4">
    <SectionTitle icon={Info} title="Thông tin sự kiện" />

    <div
      className={`prose prose-sm max-w-none ${
        !showAllDescription && description?.length > 150 ? "line-clamp-3" : ""
      }`}
    >
      {description || "Không có thông tin chi tiết cho sự kiện này."}
    </div>

    {description && description.length > 150 && (
      <button
        onClick={() => setShowAllDescription(!showAllDescription)}
        className="mt-1 text-orange-500 text-xs font-medium hover:underline flex items-center"
      >
        {showAllDescription ? "Thu gọn" : "Xem thêm"}
        <ChevronDown
          className={`ml-0.5 w-3 h-3 transform transition-transform ${
            showAllDescription ? "rotate-180" : ""
          }`}
        />
      </button>
    )}
  </section>
);

// Highlight Card Component - More compact and elegant
const HighlightCard = ({ icon: Icon, title, content, isDarkMode }) => (
  <div
    className={`p-2.5 rounded-lg border ${
      isDarkMode
        ? "border-gray-700/70 bg-gray-800/30"
        : "border-gray-200/70 bg-white"
    } flex items-start`}
  >
    <div className="w-6 h-6 rounded-full bg-orange-100/70 dark:bg-orange-900/20 flex items-center justify-center mr-2 flex-shrink-0">
      <Icon className="w-3.5 h-3.5 text-orange-500" />
    </div>
    <div>
      <h3 className="font-medium text-xs mb-0.5">{title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
        {content}
      </p>
    </div>
  </div>
);

// Event Highlights Section - Grid with smaller cards
const EventHighlights = ({ event, tickets, isDarkMode }) => (
  <section className="mb-4">
    <SectionTitle icon={Star} title="Điểm nổi bật" />

    <div className="grid grid-cols-2 gap-2">
      <HighlightCard
        icon={Users}
        title="Đối tượng"
        content="Phù hợp mọi lứa tuổi"
        isDarkMode={isDarkMode}
      />
      <HighlightCard
        icon={Clock}
        title="Thời lượng"
        content="Diễn ra trong 120 phút"
        isDarkMode={isDarkMode}
      />
      <HighlightCard
        icon={Star}
        title="Đánh giá"
        content="4.8/5 từ người tham dự"
        isDarkMode={isDarkMode}
      />
      <HighlightCard
        icon={Ticket}
        title="Vé"
        content={
          tickets?.length
            ? `${tickets.length} loại vé khác nhau`
            : "Không có vé"
        }
        isDarkMode={isDarkMode}
      />
    </div>
  </section>
);

// Location Section - Refined layout with better use of space
const LocationSection = ({ event, eventDate, isDarkMode }) => (
  <section className="mb-4">
    <SectionTitle icon={MapPin} title="Địa điểm" />

    <div
      className={`p-3 rounded-lg border ${
        isDarkMode
          ? "border-gray-700/70 bg-gray-800/30"
          : "border-gray-200/70 bg-white"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="font-medium text-sm mb-0.5">{event.location}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {event.address || "Không có địa chỉ chi tiết"}
          </p>
          <div className="flex items-center mt-1.5 text-xs text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            <span>Bắt đầu lúc {eventDate.time}</span>
          </div>
        </div>

        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            event.location,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded flex items-center gap-1 transition-colors self-start whitespace-nowrap"
        >
          <MapPin className="w-3 h-3" />
          Xem trên bản đồ
        </a>
      </div>
    </div>
  </section>
);

// Organizer Section - More compact with better information hierarchy
const OrganizerSection = ({ event, isDarkMode }) => (
  <section className="mb-4">
    <SectionTitle icon={Users} title="Ban tổ chức" />

    <div
      className={`p-3 rounded-lg border ${
        isDarkMode
          ? "border-gray-700/70 bg-gray-800/30"
          : "border-gray-200/70 bg-white"
      } flex flex-row gap-3`}
    >
      <div className="w-10 h-10 rounded-full bg-orange-100/70 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
        <Users className="w-5 h-5 text-orange-500" />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-sm mb-0.5">
          {event.organizerName || "Ban tổ chức sự kiện"}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
          {event.organizerDescription ||
            "Thông tin chi tiết về ban tổ chức chưa được cung cấp."}
        </p>

        {event.organizerWebsite && (
          <a
            href={event.organizerWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center text-orange-500 hover:underline text-xs"
          >
            <span>Truy cập website</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
      </div>
    </div>
  </section>
);

// Ticket Card Component - More refined and compact
const TicketCard = ({
  ticket,
  quantity,
  onIncrement,
  onDecrement,
  onAddToCart,
  isAddingToCart,
  isDarkMode,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  return (
    <div
      className={`p-3 rounded-lg border ${
        isDarkMode
          ? "border-gray-700/70 hover:border-gray-600"
          : "border-gray-200/70 hover:border-gray-300"
      } transition-colors`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h3 className="font-medium text-sm">{ticket.ticketName}</h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {ticket.rank || "Vé thường"}
          </div>
        </div>
        <div className="text-right">
          <div className="text-orange-500 font-medium text-sm">
            {formatCurrency(ticket.ticketPrice)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {ticket.availableQuantity > 0
              ? `Còn ${ticket.availableQuantity} vé`
              : "Hết vé"}
          </div>
        </div>
      </div>

      {ticket.ticketDescription && (
        <p className="text-xs mb-2 text-gray-600 dark:text-gray-400 leading-snug">
          {ticket.ticketDescription}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onDecrement(ticket.ticketTemplateId)}
            className={`w-6 h-6 rounded-l border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            } flex items-center justify-center transition-colors`}
            disabled={quantity <= 1}
          >
            <Minus size={12} className={quantity <= 1 ? "opacity-40" : ""} />
          </button>
          <div
            className={`w-7 h-6 border-t border-b text-center ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"
            } flex items-center justify-center text-xs font-medium`}
          >
            {quantity || 1}
          </div>
          <button
            onClick={() => onIncrement(ticket.ticketTemplateId)}
            className={`w-6 h-6 rounded-r border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            } flex items-center justify-center transition-colors`}
            disabled={ticket.availableQuantity <= quantity}
          >
            <Plus
              size={12}
              className={
                ticket.availableQuantity <= quantity ? "opacity-40" : ""
              }
            />
          </button>
        </div>

        <button
          onClick={() => onAddToCart(ticket)}
          disabled={isAddingToCart || ticket.availableQuantity <= 0}
          className={`px-2.5 py-1 rounded text-xs font-medium ${
            ticket.availableQuantity > 0
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          } transition-colors flex items-center gap-1`}
        >
          <ShoppingCart size={12} />
          {isAddingToCart
            ? "Đang xử lý..."
            : ticket.availableQuantity > 0
            ? "Thêm vào giỏ"
            : "Hết vé"}
        </button>
      </div>
    </div>
  );
};

// Ticket Section - More elegant ticket container
const TicketSection = ({
  tickets,
  ticketQuantities,
  incrementQuantity,
  decrementQuantity,
  handleAddToCart,
  isAddingToCart,
  isDarkMode,
}) => (
  <div className="sticky top-14 p-3">
    <SectionTitle icon={Ticket} title="Vé sự kiện" />

    {tickets.length > 0 ? (
      <div className="space-y-2">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.ticketId}
            ticket={ticket}
            quantity={ticketQuantities[ticket.ticketTemplateId] || 1}
            onIncrement={incrementQuantity}
            onDecrement={decrementQuantity}
            onAddToCart={handleAddToCart}
            isAddingToCart={isAddingToCart}
            isDarkMode={isDarkMode}
          />
        ))}

        <div className="mt-3 pt-2 border-t border-dashed border-gray-300 dark:border-gray-700">
          <button
            onClick={() => (window.location.href = "/cart")}
            className={`w-full py-1.5 rounded ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            } font-medium transition-colors text-xs flex items-center justify-center gap-1`}
          >
            <ShoppingCart size={14} />
            Xem giỏ hàng
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <Ticket className="w-10 h-10 mb-2 text-gray-400 opacity-30" />
        <h3 className="text-sm font-medium mb-1">Không có vé nào</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
          Hiện tại chưa có vé nào cho sự kiện này. Vui lòng quay lại sau.
        </p>
      </div>
    )}
  </div>
);

// Tags component to show event categories/tags
const EventTags = ({
  tags = ["Hòa nhạc", "Âm nhạc", "Giải trí"],
  isDarkMode,
}) => (
  <div className="flex flex-wrap gap-1 mb-4">
    {tags.map((tag) => (
      <span
        key={tag}
        className={`text-xs px-2 py-0.5 rounded-full ${
          isDarkMode
            ? "bg-gray-800 text-gray-300 border border-gray-700"
            : "bg-gray-100 text-gray-600 border border-gray-200"
        }`}
      >
        {tag}
      </span>
    ))}
  </div>
);

// Event Stats - small stats about the event
const EventStats = ({ event, isDarkMode }) => (
  <div
    className={`grid grid-cols-3 gap-2 mb-4 p-2 rounded-lg ${
      isDarkMode ? "bg-gray-800/30" : "bg-gray-50"
    }`}
  >
    <div className="text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Lượt xem</div>
      <div className="font-medium text-sm">2.5k</div>
    </div>
    <div className="text-center border-x border-gray-200 dark:border-gray-700">
      <div className="text-xs text-gray-500 dark:text-gray-400">Vé đã bán</div>
      <div className="font-medium text-sm">78%</div>
    </div>
    <div className="text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Đánh giá</div>
      <div className="font-medium text-sm flex items-center justify-center">
        4.8 <Star className="w-3 h-3 text-amber-400 ml-0.5" />
      </div>
    </div>
  </div>
);

// Related events section - "You might also like"
const RelatedEvents = ({ isDarkMode }) => (
  <section className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-medium">Sự kiện liên quan</h3>
      <a href="/events" className="text-xs text-orange-500 flex items-center">
        Xem tất cả <ChevronsRight className="w-3 h-3 ml-0.5" />
      </a>
    </div>

    <div className="grid grid-cols-2 gap-2">
      {[1, 2].map((i) => (
        <a
          key={i}
          href="/events/1"
          className={`block rounded-lg overflow-hidden border ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="h-20 bg-gray-300 dark:bg-gray-700 relative">
            <div className="absolute inset-0 flex items-end p-2">
              <div className="text-white text-xs font-medium">Sự kiện {i}</div>
            </div>
          </div>
        </a>
      ))}
    </div>
  </section>
);

// Main Component - Now with optimized layout
const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);

  // State
  const [event, setEvent] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [showAllDescription, setShowAllDescription] = useState(false);

  // Format date
  const formatDate = useCallback((dateString) => {
    try {
      if (!dateString) {
        return {
          day: "--",
          month: "--",
          weekday: "Không có",
          year: "--",
          time: "--:--",
          full: "Không có thời gian",
        };
      }

      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return {
          day: "--",
          month: "--",
          weekday: "Không hợp lệ",
          year: "--",
          time: "--:--",
          full: "Định dạng thời gian không hợp lệ",
        };
      }

      return {
        day: date.getDate(),
        month: date.toLocaleString("vi-VN", { month: "short" }),
        weekday: date.toLocaleString("vi-VN", { weekday: "long" }),
        year: date.getFullYear(),
        time: date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        full: new Intl.DateTimeFormat("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date),
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return {
        day: "--",
        month: "--",
        weekday: "Lỗi",
        year: "--",
        time: "--:--",
        full: "Lỗi định dạng thời gian",
      };
    }
  }, []);

  // Handle adding ticket to cart
  const handleAddToCart = useCallback(
    async (ticket) => {
      try {
        setIsAddingToCart(true);
        const quantity = ticketQuantities[ticket.ticketTemplateId] || 1;
        const ticketTemplateId = ticket.ticketTemplateId || ticket.ticketId;

        if (!ticketTemplateId) {
          toast.error("Không thể xác định mã vé");
          return;
        }

        await axiosInstance.post("api/Cart/AddToCart", {
          ticketTemplateId: ticketTemplateId,
          quantity: quantity,
        });

        toast.success(
          `Đã thêm ${quantity} vé ${ticket.ticketName} vào giỏ hàng`,
        );
        notifyCartUpdated();

        // Reset quantity after adding to cart
        setTicketQuantities((prev) => ({
          ...prev,
          [ticket.ticketTemplateId]: 1,
        }));
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể thêm vé vào giỏ hàng",
        );
      } finally {
        setIsAddingToCart(false);
      }
    },
    [ticketQuantities],
  );

  // Increment ticket quantity
  const incrementQuantity = useCallback((ticketId) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: (prev[ticketId] || 1) + 1,
    }));
  }, []);

  // Decrement ticket quantity
  const decrementQuantity = useCallback((ticketId) => {
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(1, (prev[ticketId] || 1) - 1),
    }));
  }, []);

  // Load event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoadingEvent(true);

        // First try to get event from history state
        const currentEvent = window.history.state?.usr?.event;

        if (currentEvent) {
          setEvent(currentEvent);
        }
        // If not available in history state, fetch it using the API
        else if (eventId) {
          const eventData = await getEventByIdApi(eventId);
          if (eventData) {
            setEvent(eventData);
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        toast.error("Không thể tải thông tin sự kiện. Vui lòng thử lại sau.");
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Load tickets
  useEffect(() => {
    const loadTickets = async () => {
      if (event?.eventId) {
        try {
          setLoadingTickets(true);
          const response = await getTicketTemplatesByEventId(event.eventId);

          if (
            response &&
            response.isSuccess &&
            Array.isArray(response.result)
          ) {
            const formattedTickets = response.result.map((ticket) => ({
              ticketId: ticket.ticketTemplateId,
              ticketTemplateId: ticket.ticketTemplateId,
              ticketName: ticket.ticketName || "Vé không tên",
              eventName: event.eventName || "Sự kiện không tên",
              eventDate: event.eventDate || new Date().toISOString(),
              ticketDescription: ticket.description || "",
              ticketPrice: ticket.ticketPrice || 0,
              ticketImage:
                ticket.imageTicket ||
                event.eventImage ||
                "/api/placeholder/400/300",
              city: event.location || "Không có địa điểm",
              address: event.address || "",
              serialNumber: ticket.ticketTemplateId,
              rank: ticket.rank || "Thường",
              categoryName: ticket.rank || "Thường",
              availableQuantity: ticket.availableQuantity || 0,
              totalQuantity: ticket.totalQuantity || 0,
            }));

            setTickets(formattedTickets);

            // Initialize ticket quantities
            const initialQuantities = {};
            formattedTickets.forEach((ticket) => {
              initialQuantities[ticket.ticketTemplateId] = 1;
            });
            setTicketQuantities(initialQuantities);
          } else {
            setTickets([]);
          }
        } catch (error) {
          console.error("Error loading tickets:", error);
          setTickets([]);
        } finally {
          setLoadingTickets(false);
        }
      }
    };

    loadTickets();
  }, [event]);

  // Handle theme classes
  const theme = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-800" : "border-gray-100",
    card: isDarkMode ? "bg-gray-800/50" : "bg-white",
  };

  // Loading screen
  if (loadingEvent) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg}`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
          <p className={`text-xs ${theme.text}`}>
            Đang tải thông tin sự kiện...
          </p>
        </div>
      </div>
    );
  }

  // Error if no event found
  if (!event) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg}`}
      >
        <div className="text-center max-w-xs mx-auto p-4">
          <Info size={32} className="mx-auto mb-3 text-orange-500" />
          <h2 className={`text-lg font-bold mb-1.5 ${theme.text}`}>
            Không tìm thấy sự kiện
          </h2>
          <p className={`mb-4 text-xs ${theme.textMuted}`}>
            Sự kiện này không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại
            đường dẫn.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-1.5 rounded bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium transition-colors flex items-center gap-1 mx-auto"
          >
            <ArrowLeft size={14} />
            <span>Quay lại trang sự kiện</span>
          </button>
        </div>
      </div>
    );
  }

  const eventDate = formatDate(event.eventDate);
  const isPastEvent = new Date(event.eventDate) < new Date();
  const hasTickets = tickets && tickets.length > 0;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
      {/* Header Actions */}
      <HeaderActions
        onBackClick={() => navigate("/events")}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
      />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row">
        {/* Event information column */}
        <div className="w-full lg:w-2/3 pt-0">
          {/* Event Header with smaller dimensions */}
          <EventHeader event={event} eventDate={eventDate} />

          {/* Event Content - more compact padding */}
          <div className="px-3 py-4 md:px-4">
            {/* Event tags */}
            <EventTags isDarkMode={isDarkMode} />

            {/* Event stats */}
            <EventStats event={event} isDarkMode={isDarkMode} />

            {/* Description */}
            <EventDescription
              description={event.eventDescription}
              showAllDescription={showAllDescription}
              setShowAllDescription={setShowAllDescription}
            />

            {/* Event Highlights - smaller card layout */}
            <EventHighlights
              event={event}
              tickets={tickets}
              isDarkMode={isDarkMode}
            />

            {/* Location Details - more compact layout */}
            <LocationSection
              event={event}
              eventDate={eventDate}
              isDarkMode={isDarkMode}
            />

            {/* Organizer Information - smaller, cleaner layout */}
            <OrganizerSection event={event} isDarkMode={isDarkMode} />

            {/* Related events section */}
            <RelatedEvents isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Tickets column */}
        <div className="w-full lg:w-1/3 lg:border-l lg:border-gray-200 dark:lg:border-gray-800">
          {loadingTickets ? (
            <div className="h-36 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <TicketSection
              tickets={tickets}
              ticketQuantities={ticketQuantities}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              handleAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* Mobile only: Smaller floating action button for tickets */}
      {hasTickets && !isPastEvent && (
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <button
            onClick={() => {
              document
                .querySelector(".lg\\:w-1\\/3")
                .scrollIntoView({ behavior: "smooth" });
            }}
            className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center shadow-md text-white transition-colors"
          >
            <Ticket size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
