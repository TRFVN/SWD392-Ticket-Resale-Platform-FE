import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Calendar,
  MapPin,
  Users,
  Check,
  Share,
  Clock,
  ExternalLink,
  AlertTriangle,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// Optimized TypeForm component with lazy loading
const TypeformEmbed = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use Intersection Observer to only load TypeForm when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }, // Trigger when 10% visible
    );

    const container = document.getElementById("typeform-container");
    if (container) {
      observer.observe(container);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isVisible]);

  return (
    <div className="w-full h-full min-h-[550px] flex items-center justify-center">
      {!isVisible && (
        <div className="animate-pulse text-gray-400 dark:text-gray-500 flex flex-col items-center">
          <BookOpen className="w-10 h-10 mb-3 opacity-40" />
          <span>Loading form...</span>
        </div>
      )}
      <div data-tf-live="01JQVF0R08N5F3JQ95PWSHC8NW"></div>
    </div>
  );
});

TypeformEmbed.displayName = "TypeformEmbed";

const CriticalThinkingEvent = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Theme styling based on dark/light mode
  const theme = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    card: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textMuted: isDarkMode ? "text-gray-300" : "text-gray-700",
    textSubdued: isDarkMode ? "text-gray-400" : "text-gray-500",
    primary: isDarkMode ? "text-orange-400" : "text-orange-500",
    primaryBg: "bg-orange-500",
    primaryBgHover: "hover:bg-orange-600",
    primaryLight: isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    shadowColor: isDarkMode ? "shadow-gray-900/10" : "shadow-gray-200",
  };

  // Event information
  const eventInfo = {
    id: "critical-thinking-2025",
    title: 'TALKSHOW "BẬT" TƯ DUY - "TUNG" PHẢN BIỆN',
    subtitle:
      "Sự kiện có 1-0-2 giúp bạn tránh bị dắt mũi và trở thành người có tư duy sắc bén!",
    date: "2025-04-13T08:30:00.000Z",
    endTime: "11:30",
    location: "SIHUB, 273 Điện Biên Phủ, Quận 3, TP. HCM",
    description: `Bạn có biết?
• 90% người ra quyết định theo cảm tính mà không nhận ra mình đang bị dẫn dắt.
• Tin giả lan truyền nhanh hơn tin thật 6 lần, và ngay cả những người thông minh cũng có thể bị mắc bẫy.
• Nếu không có tư duy phản biện, bạn có thể đang đưa ra những quyết định sai lầm trong công việc, tài chính, các mối quan hệ và cả cuộc sống hàng ngày.

Bạn có muốn mình là một trong số 90% đó, hay muốn trở thành người có tư duy sắc bén, biết phân tích vấn đề và ra quyết định đúng đắn?

Nếu câu trả lời là CÓ, thì bạn NHẤT ĐỊNH phải có mặt tại talkshow "BẬT" TƯ DUY – "TUNG" PHẢN BIỆN!`,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b8?q=80&w=1470&auto=format&fit=crop",
    availableTickets: 200,
    totalTickets: 200,
    speakers: [
      {
        name: "ThS. Đinh Hồng Phúc",
        title: "Dịch giả",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
      },
      {
        name: "ThS. Lê Thị Thanh Loan",
        title: "Dịch giả",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop",
      },
      {
        name: "Nhà báo Hoàng Nguyên Vũ",
        title: "Nhà báo",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop",
      },
      {
        name: "Th.S Nguyễn Hoàng Huy",
        title: "Chuyên gia tư duy phản biện",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop",
      },
      {
        name: "Á hậu, Doanh nhân Thúy Vân",
        title: "Doanh nhân",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop",
      },
    ],
    benefits: [
      "Nhìn nhận đúng giá trị và tính ứng dụng của tư duy phản biện trong cuộc sống hiện đại",
      "Lắng nghe chia sẻ về tư duy phản biện từ góc nhìn của chuyên gia/dịch giả giàu kinh nghiệm",
      "Trao đổi về các vấn đề xã hội từ góc nhìn của diễn giả khách mời",
      "Thảo luận mở về tư duy phản biện và các vấn đề trong cuộc sống với các chuyên gia",
    ],
    audience:
      "Sinh viên, người đi làm quan tâm đến phát triển tư duy phản biện",
    organizer: "NXB Phụ Nữ Việt Nam",
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

  // Calculate the percentage of tickets remaining
  const percentTicketsRemaining = Math.round(
    (eventInfo.availableTickets / eventInfo.totalTickets) * 100,
  );

  // Scroll progress calculation for reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    // Scroll to top on page load
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle share functionality
  const handleShare = async (platform) => {
    try {
      const shareUrl = window.location.href;
      const shareTitle = `${eventInfo.title} - TicketHub`;

      switch (platform) {
        case "copy":
          await navigator.clipboard.writeText(shareUrl);
          // Could add a toast notification here
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
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} pb-20 md:pb-0`}>
      <Helmet>
        <title>TALKSHOW "BẬT" TƯ DUY - "TUNG" PHẢN BIỆN | TicketHub</title>
        <meta
          name="description"
          content="Sự kiện có 1-0-2 giúp bạn tránh bị dắt mũi và trở thành người có tư duy sắc bén!"
        />
      </Helmet>

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-orange-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section with optimized overlay and animations */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        {/* Optimized image loading */}
        <img
          src={eventInfo.image}
          alt={eventInfo.title}
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-orange-200 text-sm font-medium mb-4 border border-orange-200/20">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                Sự kiện tư duy phản biện
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
                  className={`px-8 py-3.5 rounded-lg ${theme.primaryBg} text-white font-medium shadow-md ${theme.primaryBgHover} transition-all`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đăng Ký Ngay
                </motion.a>
                <motion.a
                  href="#details"
                  className="px-8 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/15 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Chi Tiết
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Event date badge - cleaner design */}
        <div className="absolute top-6 right-6 flex items-center gap-2 py-2 px-4 rounded-full backdrop-blur-md bg-white/10 border border-white/10 text-white">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {eventDate.day} {eventDate.month}
          </span>
        </div>
      </div>

      {/* Quick Info Bar - Simplified and more accessible */}
      <div className={`${theme.card} shadow-sm sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
            {/* Date/time */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryLight}`}
              >
                <Calendar className={`w-5 h-5 ${theme.primary}`} />
              </div>
              <div>
                <p className={`${theme.text} font-medium`}>
                  {eventDate.weekday}, {eventDate.day} {eventDate.month}
                </p>
                <p className={`text-sm ${theme.textSubdued}`}>8:30 - 11:30</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryLight}`}
              >
                <MapPin className={`w-5 h-5 ${theme.primary}`} />
              </div>
              <div>
                <p className={theme.text}>SIHUB, 273 Điện Biên Phủ</p>
                <p className={`text-sm ${theme.textSubdued}`}>Quận 3, TP.HCM</p>
              </div>
            </div>

            {/* Tickets */}
            <div className="flex items-center gap-4 p-5">
              <div
                className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${theme.primaryLight}`}
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

      <div id="details" className="max-w-6xl mx-auto pt-12 pb-16 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main content - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* About Event - Restructured with thematic elements */}
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

              <div className={`${theme.textMuted} space-y-4`}>
                {/* Extract stats and show as visually highlighted points before the rest of the content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/20">
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                      90%
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      người ra quyết định theo cảm tính mà không nhận ra
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/20">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      6x
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      tin giả lan truyền nhanh hơn tin thật
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/20">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      100%
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      bạn sẽ có tư duy tốt hơn sau sự kiện này
                    </p>
                  </div>
                </div>

                {/* Split description into paragraphs */}
                {eventInfo.description.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className={`${index === 0 ? "italic text-base" : ""}`}
                  >
                    {paragraph}
                  </p>
                ))}

                {/* Call to action at the end */}
                <div className="flex items-center justify-center py-3 mt-2">
                  <motion.a
                    href="#typeform"
                    className={`inline-flex items-center px-4 py-2 ${theme.primary} rounded-lg font-medium`}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    Đăng ký tham gia ngay{" "}
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Speakers Section - More visually appealing grid system */}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {eventInfo.speakers.map((speaker, index) => (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full overflow-hidden mb-3">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3
                      className={`text-sm md:text-base font-bold ${theme.text} mb-1 line-clamp-2`}
                    >
                      {speaker.name}
                    </h3>
                    <p className={`text-xs md:text-sm ${theme.primary}`}>
                      {speaker.title}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits Cards - Improved visual hierarchy and readability */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.card} shadow-sm`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${theme.text}`}>
                Điều bạn sẽ nhận được
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventInfo.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border ${theme.border} flex gap-3 hover:border-orange-200 dark:hover:border-orange-800/30 transition-colors`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full ${theme.primaryBg} flex items-center justify-center mt-0.5`}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className={`${theme.textMuted} text-sm`}>{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Organizer - Clean design */}
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
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryLight} ${theme.primary}`}
                >
                  #NXBPhunuVN
                </span>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryLight} ${theme.primary}`}
                >
                  #tuduyphanbien
                </span>
                <span
                  className={`inline-block px-3 py-1 text-xs rounded-md ${theme.primaryLight} ${theme.primary}`}
                >
                  #battuduytungphanbien
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

                  {/* Audience highlight */}
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

                  {/* Date reminder */}
                  <div
                    className={`p-3 rounded-lg ${theme.primaryLight} border border-orange-100 dark:border-orange-900/20`}
                  >
                    <div className="flex items-start gap-3">
                      <Clock
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme.primary}`}
                      />
                      <div>
                        <p className={`text-xs font-medium ${theme.text}`}>
                          Thời gian sự kiện
                        </p>
                        <p className={`text-sm ${theme.textMuted}`}>
                          {eventDate.weekday}, {eventDate.day} {eventDate.month}
                          , 8:30 - 11:30
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Register button */}
                  <motion.a
                    href="#typeform"
                    className={`block w-full py-3 text-center rounded-lg ${theme.primaryBg} text-white font-medium ${theme.primaryBgHover} transition shadow-sm hover:shadow-lg`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Đăng Ký Ngay
                  </motion.a>

                  <p className={`text-xs text-center ${theme.textSubdued}`}>
                    Bằng cách đăng ký, bạn đồng ý với các điều khoản của sự kiện
                  </p>
                </div>
              </motion.div>

              {/* Share card - More accessible */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`p-5 rounded-xl ${theme.card} shadow-sm`}
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

              {/* Warning card for limited spots */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30"
              >
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Số lượng vé có hạn. Đăng ký ngay để đảm bảo có chỗ tham dự
                    sự kiện!
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Typeform Registration - Enhanced design */}
      <section
        id="typeform"
        className={`py-16 ${theme.bg} border-t ${theme.border}`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <span
                className={`inline-block px-3 py-1 ${theme.primaryLight} ${theme.primary} rounded-full text-sm font-medium mb-3`}
              >
                ĐĂNG KÝ THAM GIA
              </span>

              <h2
                className={`text-2xl md:text-3xl font-bold mb-3 ${theme.text}`}
              >
                Đăng ký chỉ trong vài phút
              </h2>
              <p className={`${theme.textMuted} max-w-xl mx-auto`}>
                Điền thông tin vào form dưới đây để đảm bảo có chỗ tham gia sự
                kiện đặc biệt này
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`${theme.card} rounded-xl shadow-md overflow-hidden`}
              id="typeform-container"
            >
              <TypeformEmbed />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-center"
            >
              <p
                className={`text-sm ${theme.textSubdued} flex items-center justify-center gap-1`}
              >
                <span>Gặp sự cố khi đăng ký?</span>
                <a
                  href="https://form.typeform.com/to/x3VAGgKm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme.primary} font-medium flex items-center`}
                >
                  Mở form trong tab mới{" "}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </p>
            </motion.div>
          </div>
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

export default CriticalThinkingEvent;
