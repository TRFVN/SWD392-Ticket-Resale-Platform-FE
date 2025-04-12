import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Check,
  Share,
  Camera,
  Clock,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logAnalyticsEvent } from "../../services/firebase";
import { notifyCartUpdated } from "../../utils/cartEvents";

// TypeForm component with memo for performance
const TypeformEmbed = React.memo(() => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div data-tf-live="01JQVF0R08N5F3JQ95PWSHC8NW"></div>;
});

TypeformEmbed.displayName = "TypeformEmbed";

const MissUniverseEvent = () => {
  // State management
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Event information
  const eventInfo = {
    id: "miss-universe-2024",
    title: "BUILDING YOUR UNIVERSE - Dare to dream, dare to lead",
    subtitle:
      "Cơ hội học cách xây dựng thương hiệu cá nhân vươn tầm quốc tế với Hoa hậu Hoàn vũ 2024",
    date: "2025-04-10T09:30:00.000Z",
    endTime: "11:30",
    location:
      "Hội trường 204, Trường Đại học Hoa Sen, 08 Nguyễn Văn Tráng, Quận 1, TP.HCM",
    description: `Lần đầu tiên tại Việt Nam, đương kim Miss Universe 2024 - Victoria Kjær Theilvig sẽ có mặt tại Trường Đại học Hoa Sen để chia sẻ về hành trình vươn tầm thế giới.

BUILDING YOUR UNIVERSE - Dare to dream, dare to lead là talkshow giúp bạn khám phá bí quyết xây dựng thương hiệu cá nhân chuyên nghiệp, phát triển tư duy hội nhập toàn cầu và tự tin khẳng định bản thân.

Cùng đồng hành với đương kim Miss Universe 2024 là ông Valentin Trần - Chủ tịch Miss Universe Việt Nam, mang đến những câu chuyện và bài học thực tế từ đấu trường quốc tế.`,
    image:
      "https://images.unsplash.com/photo-1674574124649-778f9afc0e9c?q=80&w=1470&auto=format&fit=crop",
    availableTickets: 250,
    totalTickets: 300,
    ticketPrice: 0,
    speakers: [
      {
        name: "Victoria Kjær Theilvig",
        title: "Miss Universe 2024",
        image:
          "https://images.unsplash.com/photo-1687360440886-f220f137a16c?q=80&w=1469&auto=format&fit=crop",
      },
      {
        name: "Valentin Trần",
        title: "Chủ tịch Miss Universe Việt Nam",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
      },
    ],
    benefits: [
      "Cơ hội hiếm có để gặp gỡ trực tiếp Miss Universe 2024 và lắng nghe những câu chuyện thực tế từ hành trình chinh phục thế giới.",
      "Học hỏi bí quyết xây dựng thương hiệu cá nhân từ chính những người đã thành công trên đấu trường quốc tế.",
      "Nắm bắt những xu hướng mới nhất về phát triển bản thân và định vị hình ảnh trong thời đại số.",
      "Kết nối với cộng đồng sinh viên năng động, những người cùng chung chí hướng và khát vọng vươn xa.",
    ],
    audience: "Sinh viên HSU & học sinh THPT tại TP.HCM",
    organizer:
      "TRƯỜNG ĐẠI HỌC HOA SEN - Trường đào tạo hàng đầu về Kinh Doanh, Quản Lý, Công Nghệ và Sáng Tạo",
  };

  // CSS classes based on theme
  const theme = {
    primary: isDarkMode ? "text-orange-400" : "text-orange-500",
    primaryBg: "bg-orange-500",
    primaryBgHover: "hover:bg-orange-600",
    primaryBgLight: isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    card: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textMuted: isDarkMode ? "text-gray-300" : "text-gray-700",
    textSubdued: isDarkMode ? "text-gray-400" : "text-gray-500",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
  };

  // Format date
  const formatDate = useCallback((dateString) => {
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
      full: new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date),
    };
  }, []);

  // Get formatted date
  const eventDate = formatDate(eventInfo.date);

  // Track page view
  useEffect(() => {
    logAnalyticsEvent("page_view", {
      page_title: "Miss Universe Event",
      page_location: window.location.href,
      event_id: eventInfo.id,
    });

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  const scrollToForm = () => {
    const formSection = document.getElementById("typeform");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegister = () => {
    if (ticketQuantity > 0) {
      setIsAddingToCart(true);

      // Log the analytics event
      logAnalyticsEvent("begin_checkout", {
        items: [
          {
            item_id: "miss-universe-event-ticket",
            item_name: "Miss Universe Event Ticket",
            quantity: ticketQuantity,
            price: 0,
          },
        ],
        value: 0,
        currency: "VND",
      });

      // Simulate adding to cart with a small delay
      setTimeout(() => {
        setIsAddingToCart(false);

        // Send custom event to notify cart update
        notifyCartUpdated({
          itemId: "miss-universe-event-ticket",
          itemName: "Miss Universe Event Ticket",
          quantity: ticketQuantity,
          price: 0,
        });

        // Scroll to Typeform
        scrollToForm();
      }, 600);
    }
  };

  // Calculate the percentage of tickets remaining
  const percentTicketsRemaining = Math.round(
    (eventInfo.availableTickets / eventInfo.totalTickets) * 100,
  );

  // Share event functions
  const shareUrl = window.location.href;
  const shareTitle = `${eventInfo.title} - TicketHub`;

  const handleShare = async (platform) => {
    try {
      switch (platform) {
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          // You could add a toast notification here
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl,
            )}`,
            "_blank",
          );
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl,
            )}&text=${encodeURIComponent(shareTitle)}`,
            "_blank",
          );
          break;
        case "whatsapp":
          window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(
              shareTitle + " " + shareUrl,
            )}`,
            "_blank",
          );
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              url: shareUrl,
            });
          }
      }

      // Log share event
      logAnalyticsEvent("share_event", {
        event_id: eventInfo.id,
        method: platform,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} pb-20 md:pb-0`}>
      <Helmet>
        <title>Building Your Universe - Miss Universe 2024 | TicketHub</title>
        <meta
          name="description"
          content="Gặp gỡ đương kim Miss Universe 2024 - Victoria Kjær Theilvig và học hỏi bí quyết xây dựng thương hiệu cá nhân vươn tầm quốc tế."
        />
      </Helmet>

      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[65vh] w-full overflow-hidden">
        {/* Optimized image loading */}
        <img
          src={eventInfo.image}
          alt={eventInfo.title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-3xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-orange-200 text-sm font-medium mb-4 border border-orange-200/30">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                Sự kiện đặc biệt
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {eventInfo.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {eventInfo.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  href="#typeform"
                  className={`px-8 py-3.5 rounded-lg ${theme.primaryBg} text-white font-medium shadow-lg ${theme.primaryBgHover} transition-all`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đăng Ký Ngay
                </motion.a>
                <motion.a
                  href="#details"
                  className="px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Chi Tiết
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Event date badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 py-2 px-4 rounded-full backdrop-blur-md bg-white/10 border border-white/10 text-white">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {eventDate.day} {eventDate.month}
          </span>
        </div>
      </div>

      {/* Quick Info Bar - Simplified */}
      <div className={`${theme.card} shadow-sm sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {/* Date/time */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryBgLight}`}
              >
                <Calendar className={`w-5 h-5 ${theme.primary}`} />
              </div>
              <div>
                <p className={`${theme.text} font-medium`}>
                  {eventDate.weekday}, {eventDate.day} {eventDate.month}
                </p>
                <p className={`text-sm ${theme.textSubdued}`}>9:30 - 11:30</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryBgLight}`}
              >
                <MapPin className={`w-5 h-5 ${theme.primary}`} />
              </div>
              <div>
                <p className={theme.text}>Hội trường 204, ĐH Hoa Sen</p>
                <p className={`text-sm ${theme.textSubdued}`}>Quận 1, TP.HCM</p>
              </div>
            </div>

            {/* Tickets */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryBgLight}`}
              >
                <Users className={`w-5 h-5 ${theme.primary}`} />
              </div>
              <div>
                <p className={`${theme.text} font-medium`}>Miễn phí</p>
                <p className={`text-sm ${theme.textSubdued}`}>
                  Còn {eventInfo.availableTickets} vé
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="details" className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Event */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.card} shadow-sm`}
            >
              <h2 className={`text-2xl font-bold mb-5 ${theme.text}`}>
                Giới thiệu sự kiện
              </h2>
              <div className={`${theme.textMuted} space-y-4 text-base`}>
                {eventInfo.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            {/* Speakers Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.card} shadow-sm`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
                Diễn giả
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {eventInfo.speakers.map((speaker, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <div
                        className={`w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ${
                          isDarkMode ? "ring-orange-500/30" : "ring-orange-200"
                        }`}
                      >
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 p-1 rounded-full ${theme.primaryBg}`}
                      >
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3
                      className={`text-lg font-bold ${theme.text} mb-1 mt-2 text-center`}
                    >
                      {speaker.name}
                    </h3>
                    <p className={`text-sm ${theme.primary} text-center`}>
                      {speaker.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits Cards - Simplified */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.card} shadow-sm`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
                Lợi ích khi tham gia
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventInfo.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${theme.border} flex gap-3`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full ${theme.primaryBg} flex items-center justify-center mt-0.5`}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className={`${theme.textMuted} text-sm`}>{benefit}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.card} shadow-sm`}
            >
              <h2 className={`text-xl font-bold mb-3 ${theme.text}`}>
                Đơn vị tổ chức
              </h2>
              <p className={`${theme.textMuted} mb-4`}>{eventInfo.organizer}</p>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryBgLight} ${theme.primary}`}
                >
                  #TicketHub
                </span>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryBgLight} ${theme.primary}`}
                >
                  #HSU
                </span>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryBgLight} ${theme.primary}`}
                >
                  #HoaSenUniversity
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right column - Registration card - 4 columns */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-20">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`p-6 rounded-xl ${theme.card} shadow-md mb-5`}
              >
                <h2 className={`text-xl font-bold mb-5 ${theme.text}`}>
                  Đăng ký tham gia
                </h2>

                <div className="space-y-5">
                  {/* Ticket status */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-lg font-bold ${theme.primary}`}>
                        Miễn phí
                      </span>
                      <span className={`text-sm ${theme.textSubdued}`}>
                        {eventInfo.availableTickets}/{eventInfo.totalTickets} vé
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full">
                      <div
                        className={`h-2 w-full rounded-full overflow-hidden ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentTicketsRemaining}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={theme.primaryBg}
                        ></motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Target audience */}
                  <div
                    className={`p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/20`}
                  >
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p
                          className={`text-xs font-medium text-blue-700 dark:text-blue-300`}
                        >
                          Đối tượng tham dự
                        </p>
                        <p
                          className={`text-sm text-blue-600 dark:text-blue-400`}
                        >
                          {eventInfo.audience}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Event time */}
                  <div
                    className={`p-3 rounded-lg ${theme.primaryBgLight} border border-orange-100 dark:border-orange-900/20`}
                  >
                    <div className="flex items-start gap-3">
                      <Clock
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme.primary}`}
                      />
                      <div>
                        <p className={`text-xs font-medium ${theme.text}`}>
                          Thời gian
                        </p>
                        <p className={`text-sm ${theme.textMuted}`}>
                          {eventDate.full}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Register button */}
                  <motion.button
                    onClick={handleRegister}
                    disabled={isAddingToCart}
                    className={`w-full py-3 text-center rounded-lg ${theme.primaryBg} text-white font-medium transition disabled:opacity-70 disabled:cursor-not-allowed`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAddingToCart ? (
                      <span className="inline-flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      "Đăng Ký Ngay"
                    )}
                  </motion.button>

                  <p className={`text-xs text-center ${theme.textSubdued}`}>
                    Bằng cách đăng ký, bạn đồng ý với các điều khoản của sự kiện
                  </p>
                </div>
              </motion.div>

              {/* Share card - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`p-5 rounded-xl ${theme.card} shadow-sm relative`}
              >
                <h3 className={`text-base font-medium mb-4 ${theme.text}`}>
                  Chia sẻ sự kiện
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-9 h-9 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"
                    aria-label="Share via WhatsApp"
                  >
                    <i className="fab fa-whatsapp"></i>
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className={`w-9 h-9 rounded-full ml-auto flex items-center justify-center ${
                      isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                    }`}
                    aria-label="Copy link"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form - Optimized */}
      <section id="typeform" className={`py-16 ${theme.bg}`}>
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span
              className={`inline-block px-3 py-1 ${theme.primaryBgLight} ${theme.primary} rounded-full text-sm font-medium mb-3`}
            >
              ĐĂNG KÝ THAM GIA
            </span>

            <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${theme.text}`}>
              Đăng ký chỉ trong vài phút
            </h2>
            <p className={`text-base ${theme.textMuted} max-w-lg mx-auto`}>
              Điền thông tin vào form dưới đây để đảm bảo có chỗ tham gia sự
              kiện đặc biệt này
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`${theme.card} rounded-xl shadow-lg overflow-hidden`}
          >
            <div className="min-h-[550px]">
              <TypeformEmbed />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 text-center"
          >
            <p
              className={`text-sm ${theme.textSubdued} flex items-center justify-center gap-2`}
            >
              <span>Gặp sự cố khi đăng ký?</span>
              <a
                href="https://form.typeform.com/to/x3VAGgKm"
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.primary} font-medium flex items-center`}
              >
                Mở form trong tab mới <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mobile CTA - Streamlined */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-40 shadow-lg">
        <div>
          <span className={`font-medium ${theme.primary}`}>Miễn phí</span>
          <p className={`text-xs ${theme.textSubdued}`}>
            Còn {eventInfo.availableTickets} vé
          </p>
        </div>
        <motion.a
          href="#typeform"
          className={`px-5 py-2 ${theme.primaryBg} text-white rounded-lg shadow-sm`}
          whileTap={{ scale: 0.97 }}
        >
          Đăng ký ngay
        </motion.a>
      </div>
    </div>
  );
};

export default MissUniverseEvent;
