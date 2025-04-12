import React, { useState, useEffect, memo, useCallback } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Share,
  Heart,
  Ticket,
  Users,
  Star,
  Info,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  AlertCircle,
  CalendarDays,
  Check,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import { toast } from "react-toastify";
import { notifyCartUpdated } from "../../../utils/cartEvents";

// Memoized components for better performance
const EventHeader = memo(
  ({
    event,
    eventDate,
    isLiked,
    setIsLiked,
    showShare,
    setShowShare,
    navigate,
    isDarkMode,
  }) => {
    const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
    const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
    const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
    const textTertiary = isDarkMode ? "text-gray-400" : "text-gray-500";
    const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
    const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

    return (
      <div
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md ${bgElevated} border-b ${borderColor}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/events")}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${bgElevated} ${textPrimary}`}
              >
                <ArrowLeft size={18} />
              </button>

              <div className="flex flex-col">
                <h1
                  className={`font-medium leading-tight max-w-xs sm:max-w-sm truncate ${textPrimary}`}
                >
                  {event.eventName}
                </h1>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={primaryColor}>{eventDate.weekday}</span>
                  <span
                    className={`w-1 h-1 rounded-full ${primaryColor} opacity-50`}
                  ></span>
                  <span className={textTertiary}>{eventDate.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${bgElevated} ${
                  isLiked ? "text-red-500" : textSecondary
                }`}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShare(!showShare)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${bgElevated} ${textSecondary}`}
                >
                  <Share size={18} />
                </button>

                {showShare && (
                  <div
                    className={`absolute right-0 mt-2 py-2 w-48 rounded-xl shadow-lg ${bgElevated} border ${borderColor}`}
                  >
                    {["Facebook", "Twitter", "Email", "Copy Link"].map(
                      (option) => (
                        <button
                          key={option}
                          className={`w-full text-left px-4 py-2 text-sm ${textSecondary} hover:bg-orange-500/10`}
                          onClick={() => setShowShare(false)}
                        >
                          {option}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

EventHeader.displayName = "EventHeader";

const EventDetails = () => {
  const [event, setEvent] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [currentSection, setCurrentSection] = useState("overview");
  const [showShare, setShowShare] = useState(false);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const navigate = useNavigate();

  // Format date safely
  const formatDate = useCallback((dateString) => {
    try {
      // Check if date string is valid
      if (!dateString) {
        return {
          day: "--",
          month: "--",
          weekday: "Not available",
          year: "--",
          time: "--:--",
          full: "Date not available",
        };
      }

      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return {
          day: "--",
          month: "--",
          weekday: "Invalid date",
          year: "--",
          time: "--:--",
          full: "Invalid date format",
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
        weekday: "Error",
        year: "--",
        time: "--:--",
        full: "Date formatting error",
      };
    }
  }, []);

  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
    setCurrentSection(id);
  }, []);

  const handleBuyTicket = useCallback(
    async (ticket) => {
      try {
        setIsAddingToCart(true);
        const quantity = ticketQuantities[ticket.ticketTemplateId] || 1;

        await axiosInstance.post("api/Cart/AddToCart", {
          ticketTemplateId: ticket.ticketTemplateId,
          quantity: quantity,
        });

        toast.success(
          `Đã thêm ${quantity} vé ${ticket.ticketName} vào giỏ hàng`,
        );
        notifyCartUpdated();
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

  // Handle quantity changes
  const increaseQuantity = useCallback((ticketTemplateId, maxAvailable) => {
    setTicketQuantities((prev) => {
      const currentQty = prev[ticketTemplateId] || 1;
      const newQty = Math.min(currentQty + 1, maxAvailable);
      return {
        ...prev,
        [ticketTemplateId]: newQty,
      };
    });
  }, []);

  const decreaseQuantity = useCallback((ticketTemplateId) => {
    setTicketQuantities((prev) => {
      const currentQty = prev[ticketTemplateId] || 1;
      const newQty = Math.max(currentQty - 1, 1);
      return {
        ...prev,
        [ticketTemplateId]: newQty,
      };
    });
  }, []);

  useEffect(() => {
    const currentEvent = window.history.state?.usr?.event;
    if (currentEvent) {
      setEvent(currentEvent);

      // Initialize ticket quantities
      if (
        currentEvent.ticketTemplates &&
        currentEvent.ticketTemplates.length > 0
      ) {
        const initialQuantities = {};
        currentEvent.ticketTemplates.forEach((ticket) => {
          initialQuantities[ticket.ticketTemplateId] = 1;
        });
        setTicketQuantities(initialQuantities);
      }
    }

    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + 120;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setCurrentSection(section.getAttribute("id"));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!event) return null;

  const eventDate = formatDate(event.eventDate);
  const hasValidImage =
    event.eventImage &&
    (event.eventImage.startsWith("http") ||
      event.eventImage.includes(".appspot.com"));
  const isPastEvent = new Date(event.eventDate) < new Date();
  const hasTickets = event.ticketTemplates && event.ticketTemplates.length > 0;

  // Theme colors
  const primaryColor = isDarkMode ? "text-orange-400" : "text-orange-500";
  const primaryBg = isDarkMode ? "bg-orange-500" : "bg-orange-500";
  const primaryBgHover = isDarkMode
    ? "hover:bg-orange-600"
    : "hover:bg-orange-600";
  const primaryBgLight = isDarkMode ? "bg-orange-500/10" : "bg-orange-50";
  const bgBase = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const bgElevated = isDarkMode ? "bg-gray-800" : "bg-white";
  const bgElevated2 = isDarkMode ? "bg-gray-800/90" : "bg-white/90";
  const bgElevated3 = isDarkMode ? "bg-gray-800/70" : "bg-white/70";
  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-300" : "text-gray-700";
  const textTertiary = isDarkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  return (
    <div className={`min-h-screen ${bgBase}`}>
      {/* Header */}
      <EventHeader
        event={event}
        eventDate={eventDate}
        isLiked={isLiked}
        setIsLiked={setIsLiked}
        showShare={showShare}
        setShowShare={setShowShare}
        navigate={navigate}
        isDarkMode={isDarkMode}
      />

      {/* Navigation tabs */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 ${bgElevated2} border-b ${borderColor}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="px-4 flex gap-1 overflow-x-auto hide-scrollbar">
            {[
              { id: "overview", label: "Tổng quan" },
              { id: "info", label: "Thông tin" },
              { id: "location", label: "Địa điểm" },
              ...(hasTickets ? [{ id: "tickets", label: "Vé" }] : []),
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap relative transition-colors ${
                  currentSection === section.id ? primaryColor : textSecondary
                }`}
              >
                {section.label}
                {currentSection === section.id && (
                  <span
                    className={`absolute bottom-0 left-1/2 right-1/2 -translate-x-1/2 h-0.5 w-1/2 ${primaryBg} rounded-full`}
                  ></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto pt-32 pb-24 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview section */}
            <section id="overview" className="space-y-6">
              {/* Hero card */}
              <div className={`rounded-3xl overflow-hidden ${bgElevated}`}>
                {/* Banner */}
                <div className="relative h-72 w-full overflow-hidden">
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

                  {/* Event info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-between items-end">
                      <div className="flex gap-4 items-end">
                        {/* Date */}
                        <div
                          className={`flex flex-col items-center rounded-2xl py-3 px-4 backdrop-blur-md ${bgElevated3} border border-white/10`}
                        >
                          <span
                            className={`text-xs uppercase font-medium ${primaryColor}`}
                          >
                            {eventDate.month}
                          </span>
                          <span className="text-2xl font-bold text-white leading-none mt-1">
                            {eventDate.day}
                          </span>
                          <span className="text-[10px] text-white/70">
                            {eventDate.year}
                          </span>
                        </div>

                        <div>
                          <h1 className="text-2xl font-bold text-white mb-1 leading-tight">
                            {event.eventName}
                          </h1>
                          <p className="text-sm text-white/80">
                            {eventDate.time} • {eventDate.weekday}
                          </p>
                        </div>
                      </div>

                      {/* Mobile CTA */}
                      {hasTickets && !isPastEvent && (
                        <button
                          onClick={() => scrollToSection("tickets")}
                          className=" sm:flex sm:items-center sm:gap-1 px-4 py-2 rounded-full text-sm font-medium text-white bg-white/20 backdrop-blur-md hover:bg-white/30"
                        >
                          <Ticket size={14} />
                          <span>Đặt vé</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event details */}
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${primaryBgLight}`}
                      >
                        <CalendarDays className={`w-4 h-4 ${primaryColor}`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${textSecondary}`}>
                          Thời gian
                        </h3>
                        <p className={textPrimary}>{eventDate.full}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${primaryBgLight}`}
                      >
                        <MapPin className={`w-4 h-4 ${primaryColor}`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${textSecondary}`}>
                          Địa điểm
                        </h3>
                        <p className={textPrimary}>{event.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info preview */}
              <div className={`p-6 rounded-3xl ${bgElevated}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${textPrimary}`}>
                    Thông tin sự kiện
                  </h2>
                  <button
                    onClick={() => scrollToSection("info")}
                    className={`flex items-center gap-1 text-sm font-medium ${primaryColor}`}
                  >
                    Xem thêm
                    <ChevronRight size={16} />
                  </button>
                </div>

                <p className={`${textSecondary} line-clamp-3`}>
                  {event.eventDescription}
                </p>
              </div>
            </section>

            {/* Info section */}
            <section id="info" className={`p-6 rounded-3xl ${bgElevated}`}>
              <h2 className={`text-xl font-bold mb-6 ${textPrimary}`}>
                Thông tin chi tiết
              </h2>

              <div
                className={`whitespace-pre-wrap ${textSecondary} leading-relaxed`}
              >
                {event.eventDescription}
              </div>

              {/* Features */}
              <div className="mt-8">
                <h3 className={`font-medium mb-4 ${textPrimary}`}>
                  Tính năng sự kiện
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users, text: "Mọi lứa tuổi" },
                    { icon: Star, text: "Đánh giá cao" },
                    { icon: Check, text: "Chương trình đa dạng" },
                    { icon: Clock, text: "Đúng giờ" },
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-2xl ${primaryBgLight}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${bgElevated}`}
                      >
                        <feature.icon className={`w-4 h-4 ${primaryColor}`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-medium ${textSecondary}`}>
                          {feature.text}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Tickets section */}
            {hasTickets && (
              <section id="tickets" className={`p-6 rounded-3xl ${bgElevated}`}>
                <h2 className={`text-xl font-bold mb-6 ${textPrimary}`}>
                  Vé sự kiện
                </h2>

                <div className="space-y-5">
                  {event.ticketTemplates.map((ticket) => (
                    <div
                      key={ticket.ticketTemplateId}
                      className={`p-5 rounded-2xl border ${borderColor} transition-all hover:border-orange-300 dark:hover:border-orange-600/50`}
                    >
                      <div className="flex flex-col gap-4">
                        {/* Ticket info */}
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Ticket card */}
                          <div
                            className={`relative w-full sm:w-36 aspect-[2/1] sm:aspect-auto sm:h-24 overflow-hidden rounded-xl border ${borderColor} flex-shrink-0`}
                          >
                            {ticket.imageTicket ? (
                              <img
                                src={ticket.imageTicket}
                                alt={ticket.ticketName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full flex items-center justify-center ${primaryBgLight}`}
                              >
                                <Ticket className={`w-8 h-8 ${primaryColor}`} />
                              </div>
                            )}

                            {/* Price overlay */}
                            <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm bg-black/40 text-white">
                              {new Intl.NumberFormat("vi-VN").format(
                                ticket.ticketPrice,
                              )}
                              đ
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3
                                    className={`font-medium text-lg ${textPrimary}`}
                                  >
                                    {ticket.ticketName}
                                  </h3>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      ticket.rank.toLowerCase().includes("vip")
                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                        : primaryBgLight + " " + primaryColor
                                    }`}
                                  >
                                    {ticket.rank}
                                  </span>
                                </div>

                                <p className={`mt-1 ${textSecondary}`}>
                                  Còn lại:{" "}
                                  <span className="font-medium">
                                    {ticket.availableQuantity}
                                  </span>
                                  /{ticket.totalQuantity} vé
                                </p>

                                <div className="mt-3">
                                  <div className={`text-sm ${textSecondary}`}>
                                    Giá:{" "}
                                    <span
                                      className={`font-medium text-base ${primaryColor}`}
                                    >
                                      {new Intl.NumberFormat("vi-VN").format(
                                        ticket.ticketPrice,
                                      )}{" "}
                                      đ
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full mt-3">
                              <div
                                className={`h-1.5 w-full rounded-full overflow-hidden ${
                                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              >
                                <div
                                  className={`h-full rounded-full ${
                                    ticket.rank.toLowerCase().includes("vip")
                                      ? "bg-purple-500 dark:bg-purple-600"
                                      : primaryBg
                                  }`}
                                  style={{
                                    width: `${
                                      (ticket.availableQuantity /
                                        ticket.totalQuantity) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Button Section */}
                        <div
                          className={`mt-1 pt-3 border-t ${borderColor} flex justify-between items-center flex-wrap gap-3`}
                        >
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <p className={`text-sm ${textSecondary}`}>
                              Số lượng:
                            </p>
                            <div
                              className={`flex items-center border ${borderColor} rounded-lg overflow-hidden`}
                            >
                              <button
                                onClick={() =>
                                  decreaseQuantity(ticket.ticketTemplateId)
                                }
                                className={`w-8 h-8 flex items-center justify-center transition ${
                                  isDarkMode
                                    ? "hover:bg-gray-700 text-gray-300"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                                disabled={
                                  ticketQuantities[ticket.ticketTemplateId] <= 1
                                }
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <div
                                className={`w-10 text-center py-1 ${textPrimary}`}
                              >
                                {ticketQuantities[ticket.ticketTemplateId] || 1}
                              </div>
                              <button
                                onClick={() =>
                                  increaseQuantity(
                                    ticket.ticketTemplateId,
                                    ticket.availableQuantity,
                                  )
                                }
                                className={`w-8 h-8 flex items-center justify-center transition ${
                                  isDarkMode
                                    ? "hover:bg-gray-700 text-gray-300"
                                    : "hover:bg-gray-100 text-gray-700"
                                }`}
                                disabled={
                                  (ticketQuantities[ticket.ticketTemplateId] ||
                                    1) >= ticket.availableQuantity
                                }
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-lg font-medium ${primaryColor}`}
                            >
                              {new Intl.NumberFormat("vi-VN").format(
                                ticket.ticketPrice *
                                  (ticketQuantities[ticket.ticketTemplateId] ||
                                    1),
                              )}
                              đ
                            </span>

                            <button
                              onClick={() => handleBuyTicket(ticket)}
                              disabled={isPastEvent || isAddingToCart}
                              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                                !isPastEvent
                                  ? ticket.rank.toLowerCase().includes("vip")
                                    ? "bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                                    : `${primaryBg} hover:bg-orange-600 text-white`
                                  : "bg-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                              }`}
                            >
                              {isAddingToCart ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Đang thêm...</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-4 h-4" />
                                  <span>Thêm vào giỏ</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                handleBuyTicket(ticket);
                                setTimeout(() => navigate("/cart"), 500);
                              }}
                              disabled={isPastEvent || isAddingToCart}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                                !isPastEvent
                                  ? "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                                  : "bg-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                              }`}
                            >
                              Mua ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info note */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10 dark:to-transparent">
                  <div className="flex gap-3">
                    <Info
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${primaryColor}`}
                    />
                    <p className={textSecondary}>
                      Giá vé đã bao gồm thuế và phí dịch vụ. Vé không được hoàn
                      trả sau khi đặt.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right column - Fixed sidebar */}
          <div className="lg:block">
            {hasTickets && !isPastEvent && (
              <div className={`sticky top-32 p-6 rounded-3xl ${bgElevated}`}>
                <h2 className={`text-xl font-bold mb-6 ${textPrimary}`}>
                  Đặt vé ngay
                </h2>

                <div className="space-y-4 mb-4">
                  {event.ticketTemplates.slice(0, 3).map((ticket) => (
                    <div
                      key={ticket.ticketTemplateId}
                      className={`p-3 rounded-xl border ${borderColor} transition-all hover:border-orange-300 dark:hover:border-orange-600/50`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={textPrimary}>{ticket.ticketName}</p>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  ticket.rank.toLowerCase().includes("vip")
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                    : primaryBgLight + " " + primaryColor
                                }`}
                              >
                                {ticket.rank}
                              </span>
                            </div>
                            <p className={`text-sm font-bold ${primaryColor}`}>
                              {new Intl.NumberFormat("vi-VN").format(
                                ticket.ticketPrice,
                              )}
                              đ
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div
                            className={`flex items-center border ${borderColor} rounded-lg overflow-hidden`}
                          >
                            <button
                              onClick={() =>
                                decreaseQuantity(ticket.ticketTemplateId)
                              }
                              className={`w-7 h-7 flex items-center justify-center ${
                                isDarkMode
                                  ? "hover:bg-gray-700 text-gray-300"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                              disabled={
                                ticketQuantities[ticket.ticketTemplateId] <= 1
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <div
                              className={`w-8 text-center text-sm py-1 ${textPrimary}`}
                            >
                              {ticketQuantities[ticket.ticketTemplateId] || 1}
                            </div>
                            <button
                              onClick={() =>
                                increaseQuantity(
                                  ticket.ticketTemplateId,
                                  ticket.availableQuantity,
                                )
                              }
                              className={`w-7 h-7 flex items-center justify-center ${
                                isDarkMode
                                  ? "hover:bg-gray-700 text-gray-300"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                              disabled={
                                (ticketQuantities[ticket.ticketTemplateId] ||
                                  1) >= ticket.availableQuantity
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleBuyTicket(ticket)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-sm ${
                              isAddingToCart ? "opacity-70 cursor-wait" : ""
                            } ${
                              ticket.rank.toLowerCase().includes("vip")
                                ? "bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600"
                                : primaryBg + " " + primaryBgHover
                            }`}
                            disabled={isAddingToCart}
                          >
                            {isAddingToCart ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang thêm</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Thêm</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {event.ticketTemplates.length > 3 && (
                  <button
                    onClick={() => scrollToSection("tickets")}
                    className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border ${borderColor} ${textSecondary} transition-colors hover:${primaryBgLight}`}
                  >
                    <span>Xem tất cả vé</span>
                    <ChevronDown size={16} />
                  </button>
                )}

                <hr className={`my-6 border-t ${borderColor}`} />

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${primaryColor}`}
                    />
                    <div>
                      <h3 className={`font-medium ${textPrimary}`}>
                        Thời gian
                      </h3>
                      <p className={`text-sm ${textSecondary}`}>
                        {eventDate.full}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${primaryColor}`}
                    />
                    <div>
                      <h3 className={`font-medium ${textPrimary}`}>Địa điểm</h3>
                      <p className={`text-sm ${textSecondary}`}>
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/cart")}
                  className={`w-full py-3 rounded-xl ${primaryBg} text-white font-medium mt-6 ${primaryBgHover} flex items-center justify-center gap-2`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Đi đến giỏ hàng</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed CTA button for mobile */}
      {hasTickets && !isPastEvent && (
        <div className="lg:hidden fixed bottom-5 left-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => scrollToSection("tickets")}
            className={`flex-1 py-3.5 rounded-xl text-white font-medium shadow-lg ${primaryBg} ${primaryBgHover} flex items-center justify-center gap-2`}
          >
            <Ticket className="w-4 h-4" />
            <span>Đặt vé ngay</span>
          </button>

          <button
            onClick={() => navigate("/cart")}
            className={`py-3.5 px-4 rounded-xl bg-white dark:bg-gray-800 text-orange-500 font-medium shadow-lg border border-orange-200 dark:border-gray-700 flex items-center justify-center`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
