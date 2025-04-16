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

// Add this to your CSS or define in the component
const AnimatedBg = ({ children, isDarkMode }) => (
  <div className="relative overflow-hidden rounded-3xl">
    <div
      className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-700/5 
      before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)] 
      before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-1000"
    ></div>
    <div className="relative z-10">{children}</div>
  </div>
);

// Section Title component with animated accent
const SectionTitle = ({ icon: Icon, title }) => (
  <h2 className="text-base font-bold mb-4 flex items-center">
    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 mr-3 shadow-md shadow-orange-500/10">
      <Icon className="w-4 h-4 text-white" />
    </div>
    <span className="relative">
      {title}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 animate-expand-line"></span>
    </span>
  </h2>
);

// Event Description Section - With interactive expanding card
const EventDescription = ({
  description,
  showAllDescription,
  setShowAllDescription,
}) => (
  <section className="mb-6 backdrop-blur-[2px]">
    <SectionTitle icon={Info} title="Thông tin sự kiện" />

    <div
      className={`prose prose-sm max-w-none relative ${
        !showAllDescription && description?.length > 150
          ? "max-h-24 overflow-hidden"
          : ""
      } bg-gray-100/5 dark:bg-gray-800/20 p-5 rounded-3xl border border-gray-200/10 dark:border-gray-700/30 
      transition-all duration-500 ease-in-out shadow-sm hover:shadow-md hover:border-orange-500/20`}
    >
      {description || "Không có thông tin chi tiết cho sự kiện này."}

      {!showAllDescription && description?.length > 150 && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-100/90 dark:from-gray-800/90 to-transparent"></div>
      )}
    </div>

    {description && description.length > 150 && (
      <button
        onClick={() => setShowAllDescription(!showAllDescription)}
        className="mt-2 px-4 py-1.5 text-orange-500 text-xs font-medium bg-orange-500/5 hover:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300"
      >
        {showAllDescription ? "Thu gọn" : "Xem thêm"}
        <ChevronDown
          className={`ml-1 w-3.5 h-3.5 transform transition-transform ${
            showAllDescription ? "rotate-180" : ""
          }`}
        />
      </button>
    )}
  </section>
);

// Highlight Card Component - With animated hover effect
const HighlightCard = ({ icon: Icon, title, content, isDarkMode }) => (
  <div
    className={`p-4 rounded-3xl border relative group overflow-hidden ${
      isDarkMode
        ? "border-gray-700/40 bg-gray-800/20"
        : "border-gray-200/50 bg-white/70"
    } transition-all duration-500 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5`}
  >
    {/* Spotlight hover effect */}
    <div className="absolute -inset-full h-full w-full bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>

    <div className="flex items-start relative z-10">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mr-3 flex-shrink-0 shadow-md shadow-orange-500/10 group-hover:shadow-orange-500/30 transition-all duration-500 group-hover:scale-110">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  </div>
);

// Event Highlights Section - Grid with smaller cards
const EventHighlights = ({ event, tickets, isDarkMode }) => (
  <section className="mb-5">
    <SectionTitle icon={Star} title="Điểm nổi bật" />

    <div className="grid grid-cols-2 gap-3">
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
  <section className="mb-5">
    <SectionTitle icon={MapPin} title="Địa điểm" />

    <div
      className={`p-4 rounded-2xl border backdrop-blur-[2px] ${
        isDarkMode
          ? "border-gray-700/40 bg-gray-800/20"
          : "border-gray-200/50 bg-white/70"
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
          className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs rounded-full flex items-center gap-1.5 transition-all duration-300 self-start whitespace-nowrap"
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
  <section className="mb-5">
    <SectionTitle icon={Users} title="Ban tổ chức" />

    <div
      className={`p-4 rounded-2xl border backdrop-blur-[2px] ${
        isDarkMode
          ? "border-gray-700/40 bg-gray-800/20"
          : "border-gray-200/50 bg-white/70"
      } flex flex-row gap-4`}
    >
      <div className="w-12 h-12 rounded-full bg-orange-100/70 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
        <Users className="w-6 h-6 text-orange-500" />
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

// Ticket Card Component - With interactive 3D effect
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
      className={`p-5 rounded-3xl border transform-gpu transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10
        ${
          isDarkMode
            ? "border-gray-700/40 bg-gray-800/20 hover:border-orange-500/30"
            : "border-gray-200/50 bg-white/70 hover:border-orange-500/20"
        } relative group perspective`}
    >
      {/* Ticket animation line */}
      <div className="absolute -left-1 top-8 bottom-8 w-[2px] border-l-2 border-dashed border-orange-500/30"></div>

      {/* Price tag */}
      <div className="absolute -right-2 -top-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg transform rotate-3 z-10">
        {formatCurrency(ticket.ticketPrice)}
      </div>

      <div className="flex justify-between items-start mb-3 relative">
        <div>
          <h3 className="font-semibold text-base mb-1 pr-16">
            {ticket.ticketName}
          </h3>
          <div className="text-xs inline-flex items-center px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">
            {ticket.rank || "Vé thường"}
          </div>
        </div>
      </div>

      {ticket.ticketDescription && (
        <p className="text-xs mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          {ticket.ticketDescription}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {/* Available tickets */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <Ticket className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
          {ticket.availableQuantity > 0
            ? `Còn ${ticket.availableQuantity} vé`
            : "Hết vé"}

          {/* Progressive bar */}
          {ticket.availableQuantity > 0 && ticket.totalQuantity > 0 && (
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                  style={{
                    width: `${
                      (ticket.availableQuantity / ticket.totalQuantity) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <span>
                {Math.round(
                  (ticket.availableQuantity / ticket.totalQuantity) * 100,
                )}
                %
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => onDecrement(ticket.ticketTemplateId)}
              className={`w-9 h-9 rounded-l-full border ${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              } flex items-center justify-center transition-colors`}
              disabled={quantity <= 1}
            >
              <Minus size={15} className={quantity <= 1 ? "opacity-40" : ""} />
            </button>
            <div
              className={`w-10 h-9 border-t border-b text-center ${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              } flex items-center justify-center text-xs font-medium`}
            >
              {quantity || 1}
            </div>
            <button
              onClick={() => onIncrement(ticket.ticketTemplateId)}
              className={`w-9 h-9 rounded-r-full border ${
                isDarkMode
                  ? "bg-gray-800/80 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              } flex items-center justify-center transition-colors`}
              disabled={ticket.availableQuantity <= quantity}
            >
              <Plus
                size={15}
                className={
                  ticket.availableQuantity <= quantity ? "opacity-40" : ""
                }
              />
            </button>
          </div>

          <button
            onClick={() => onAddToCart(ticket)}
            disabled={isAddingToCart || ticket.availableQuantity <= 0}
            className={`relative px-4 py-2.5 rounded-full text-xs font-medium overflow-hidden ${
              ticket.availableQuantity > 0
                ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            } transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg group`}
          >
            {/* Animated background effect */}
            {ticket.availableQuantity > 0 && (
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
            )}

            <ShoppingCart size={14} className="relative z-10" />
            <span className="relative z-10">
              {isAddingToCart
                ? "Đang xử lý..."
                : ticket.availableQuantity > 0
                ? "Thêm vào giỏ"
                : "Hết vé"}
            </span>
          </button>
        </div>
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
  <div>
    <SectionTitle icon={Ticket} title="Vé sự kiện" />

    {tickets.length > 0 ? (
      <div className="space-y-4">
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

        <div className="mt-6 pt-4 border-t border-dashed border-gray-300/50 dark:border-gray-700/50">
          <button
            onClick={() => (window.location.href = "/cart")}
            className={`w-full py-3 rounded-full ${
              isDarkMode
                ? "bg-gray-800/80 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            } font-medium transition-colors text-xs flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md`}
          >
            <ShoppingCart size={14} />
            Xem giỏ hàng
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center py-8 text-center backdrop-blur-[2px] bg-gray-100/5 dark:bg-gray-800/20 rounded-2xl border border-gray-200/10 dark:border-gray-700/30">
        <Ticket className="w-12 h-12 mb-3 text-gray-400 opacity-30" />
        <h3 className="text-sm font-medium mb-1">Không có vé nào</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs px-4">
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
  <div className="flex flex-wrap gap-1.5 mb-5">
    {tags.map((tag) => (
      <span
        key={tag}
        className={`text-xs px-3 py-1 rounded-full ${
          isDarkMode
            ? "bg-gray-800/50 text-gray-300 border border-gray-700/50 backdrop-blur-[2px]"
            : "bg-gray-100/70 text-gray-600 border border-gray-200/50 backdrop-blur-[2px]"
        } transition-colors hover:border-orange-500/30`}
      >
        {tag}
      </span>
    ))}
  </div>
);

// Event Stats - small stats about the event
const EventStats = ({ event, isDarkMode }) => (
  <div
    className={`grid grid-cols-3 gap-2 mb-5 p-3 rounded-2xl backdrop-blur-[2px] ${
      isDarkMode
        ? "bg-gray-800/20 border border-gray-700/30"
        : "bg-gray-50/70 border border-gray-200/30"
    }`}
  >
    <div className="text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Lượt xem</div>
      <div className="font-medium text-sm">2.5k</div>
    </div>
    <div className="text-center border-x border-gray-200/50 dark:border-gray-700/50">
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
  <section className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold flex items-center">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-orange-500/10 mr-2">
          <Calendar className="w-3.5 h-3.5 text-orange-500" />
        </div>
        Sự kiện liên quan
      </h3>
      <a
        href="/events"
        className="text-xs text-orange-500 flex items-center hover:underline"
      >
        Xem tất cả <ChevronsRight className="w-3 h-3 ml-0.5" />
      </a>
    </div>

    <div className="grid grid-cols-2 gap-3">
      {[1, 2].map((i) => (
        <a
          key={i}
          href="/events/1"
          className={`block rounded-2xl overflow-hidden border backdrop-blur-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5 hover:scale-[1.02] ${
            isDarkMode
              ? "border-gray-700/40 bg-gray-800/20"
              : "border-gray-200/50 bg-white/70"
          }`}
        >
          <div className="h-24 bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-900 relative">
            <div className="absolute inset-0 flex items-end p-3 bg-gradient-to-t from-black/60 to-transparent">
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
    card: isDarkMode
      ? "bg-gray-800/50 backdrop-filter backdrop-blur-[2px]"
      : "bg-white/80 backdrop-filter backdrop-blur-[2px]",
  };

  // Loading screen
  if (loadingEvent) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent"></div>
          <p className={`text-sm ${theme.text}`}>
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
        <div className="text-center max-w-xs mx-auto p-5 rounded-2xl backdrop-blur-[2px] bg-gray-100/5 dark:bg-gray-800/20 border border-gray-200/10 dark:border-gray-700/30">
          <Info size={40} className="mx-auto mb-4 text-orange-500" />
          <h2 className={`text-xl font-bold mb-2 ${theme.text}`}>
            Không tìm thấy sự kiện
          </h2>
          <p className={`mb-5 text-sm ${theme.textMuted}`}>
            Sự kiện này không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại
            đường dẫn.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={16} />
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
      <div className="w-full">
        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Event title */}
          <div className="mb-6 text-center">
            <h1 className={`text-2xl md:text-3xl font-bold ${theme.text}`}>
              {event.eventName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className={theme.textSecondary}>{eventDate.full}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className={theme.textSecondary}>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Event information column */}
            <div className="w-full lg:w-2/3">
              {/* Content wrapper with proper spacing */}
              <div className="p-5 rounded-3xl backdrop-blur-[2px] bg-white/5 dark:bg-gray-800/5 border border-white/10 dark:border-gray-700/10 shadow-lg">
                {/* Event image - now in left column */}
                <div className="mb-6">
                  <div className="relative w-full h-[220px] md:h-[280px] overflow-hidden rounded-xl shadow-md">
                    {event.eventImage &&
                    (event.eventImage.startsWith("http") ||
                      event.eventImage.includes(".appspot.com")) ? (
                      <img
                        src={event.eventImage}
                        alt={event.eventName}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <Calendar className="w-16 h-16 text-gray-600 opacity-30" />
                      </div>
                    )}

                    {/* Overlay gradient for better contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                    {/* Event status pill */}
                    <div className="absolute top-3 left-3">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/80 to-orange-600/80 text-white border border-orange-500/40 shadow-sm">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-white inline-flex"></span>
                        {event.status === 1 ? "Đang diễn ra" : "Đã kết thúc"}
                      </div>
                    </div>
                  </div>
                </div>

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

                {/* Event Highlights */}
                <EventHighlights
                  event={event}
                  tickets={tickets}
                  isDarkMode={isDarkMode}
                />

                {/* Location Details */}
                <LocationSection
                  event={event}
                  eventDate={eventDate}
                  isDarkMode={isDarkMode}
                />

                {/* Organizer Information */}
                <OrganizerSection event={event} isDarkMode={isDarkMode} />

                {/* Related events section */}
                <RelatedEvents isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Tickets column */}
            <div className="w-full lg:w-1/3 md:sticky md:top-5 self-start">
              {loadingTickets ? (
                <div className="h-36 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="p-5 rounded-3xl backdrop-blur-[2px] bg-white/5 dark:bg-gray-800/5 border border-white/10 dark:border-gray-700/10 shadow-lg">
                  <TicketSection
                    tickets={tickets}
                    ticketQuantities={ticketQuantities}
                    incrementQuantity={incrementQuantity}
                    decrementQuantity={decrementQuantity}
                    handleAddToCart={handleAddToCart}
                    isAddingToCart={isAddingToCart}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to events button - floating at bottom left */}
      <div className="fixed bottom-6 left-6 z-30">
        <button
          onClick={() => navigate("/events")}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/20 shadow-lg"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Quay lại</span>
        </button>
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
            className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex items-center justify-center shadow-lg text-white transition-all duration-300 hover:shadow-orange-500/30 border border-white/10"
          >
            <Ticket size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
