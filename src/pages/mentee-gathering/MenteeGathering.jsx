import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  ChevronRight,
  ExternalLink,
  Mail,
  Globe,
  Phone,
  Facebook,
  AlertTriangle,
} from "lucide-react";

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

    // Load Typeform embed script
    const script = document.createElement("script");
    script.src = "//embed.typeform.com/next/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isVisible]);

  return (
    <div className="w-full min-h-[400px] flex items-center justify-center">
      {!isVisible && (
        <div className="animate-pulse text-gray-400 dark:text-gray-500">
          Loading form...
        </div>
      )}
      <div data-tf-live="01JQVF0R08N5F3JQ95PWSHC8NW"></div>
    </div>
  );
});

TypeformEmbed.displayName = "TypeformEmbed";

const MenteeGathering = () => {
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Event data
  const eventData = {
    title: "Mentee Gathering Mùa 10",
    subtitle: "Sự Kiện Kết Nối Dành Riêng Cho Mentee Của UEH Mentoring",
    date: "2025-04-13",
    time: "7:30 - 11:00",
    location: "Công viên Tao Đàn, Trương Định, Quận 1, TP.HCM",
    registrationDeadline: "2025-04-10T23:59:00",
    organizationName: "UEH Mentoring",
    organizationContact: {
      email: "uehmentoring@gmail.com",
      website: "https://uehmentoring.com",
      facebook: "https://www.facebook.com/UEHMentoring",
    },
    contactPersons: [
      { name: "Thanh Hà", phone: "0397845507" },
      { name: "Ka Thy", phone: "0938627802" },
    ],
    hashtags: ["UEHMentoring", "MenteeGathering"],
    problems: [
      "Bạn đang cảm thấy áp lực với học tập và công việc?",
      "Cuộc sống bộn bề khiến bạn mệt mỏi và dần mất đi nguồn năng lượng tích cực?",
      "Bạn mong muốn một không gian để thư giãn, giao lưu và tái tạo động lực?",
    ],
    activities: [
      "Tham gia các hoạt động team building thú vị, giúp bạn xóa tan căng thẳng",
      "Gặp gỡ, giao lưu cùng các Mentee khác trong chương trình",
      "Lắng nghe những chia sẻ truyền cảm hứng về hành trình Mentoring",
      "Mở rộng mạng lưới quan hệ (Networking) với những người bạn cùng chí hướng",
      "Cơ hội nhận được những phần quà hấp dẫn khi trở thành đội chơi chiến thắng",
    ],
  };

  // Class theme handling
  const theme = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    bgGradient: isDarkMode
      ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
      : "bg-gradient-to-b from-orange-50 via-white to-gray-50",
    card: isDarkMode ? "bg-gray-800" : "bg-white",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textMuted: isDarkMode ? "text-gray-300" : "text-gray-700",
    textSubdued: isDarkMode ? "text-gray-400" : "text-gray-500",
    primary: isDarkMode ? "text-orange-400" : "text-orange-500",
    primaryBg: "bg-orange-500",
    primaryBgHover: "hover:bg-orange-600",
    primaryLight: isDarkMode ? "bg-orange-500/10" : "bg-orange-50",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    divider: isDarkMode ? "border-gray-700" : "border-gray-100",
  };

  // Scroll progress calculation for reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Format date for countdown
  const getTimeRemaining = () => {
    const deadline = new Date(eventData.registrationDeadline);
    const now = new Date();
    const timeRemaining = deadline - now;

    if (timeRemaining <= 0) {
      return { expired: true };
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    return { expired: false, days, hours };
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div
      className={`min-h-screen ${theme.bgGradient} transition-colors duration-300`}
    >
      <Helmet>
        <title>Mentee Gathering Mùa 10 - UEH Mentoring | TicketHub</title>
        <meta
          name="description"
          content="Sự Kiện Kết Nối Dành Riêng Cho Mentee Của UEH Mentoring. Tham gia để mở rộng kết nối và tái tạo động lực."
        />
      </Helmet>

      {/* Reading Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div
          className="h-full bg-orange-500 transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <div className={`container mx-auto px-6 relative z-10`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <span
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 ${theme.primaryLight} ${theme.primary} rounded-full text-sm font-medium mb-6`}
            >
              UEH MENTORING
            </span>

            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${theme.text}`}
            >
              Mentee Gathering
              <span className={theme.primary}> Mùa 10</span>
            </h1>

            <p className={`text-xl ${theme.textMuted} mb-8 max-w-2xl mx-auto`}>
              {eventData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#typeform"
                className={`px-8 py-3 ${theme.primaryBg} ${theme.primaryBgHover} text-white font-medium rounded-lg transition-all shadow-md`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Đăng Ký Ngay
              </motion.a>
              <motion.a
                href="#details"
                className={`px-8 py-3 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } hover:bg-opacity-80 ${
                  theme.text
                } font-medium rounded-lg border ${theme.border} transition-all`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Xem Chi Tiết
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Event info cards at the bottom of hero */}
        <motion.div
          className="container mx-auto px-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Date */}
            <div
              className={`p-5 rounded-xl ${theme.card} shadow-sm flex items-center gap-4`}
            >
              <div
                className={`w-12 h-12 ${theme.primaryLight} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Calendar className={`w-6 h-6 ${theme.primary}`} />
              </div>
              <div>
                <h3 className={`text-sm font-medium ${theme.textSubdued}`}>
                  Thời gian
                </h3>
                <p className={`font-medium ${theme.text}`}>
                  Chủ Nhật, {eventData.date.split("-")[2]} Tháng{" "}
                  {eventData.date.split("-")[1]}
                </p>
                <p className={`text-sm ${theme.textSubdued}`}>
                  {eventData.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div
              className={`p-5 rounded-xl ${theme.card} shadow-sm flex items-center gap-4`}
            >
              <div
                className={`w-12 h-12 ${theme.primaryLight} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <MapPin className={`w-6 h-6 ${theme.primary}`} />
              </div>
              <div>
                <h3 className={`text-sm font-medium ${theme.textSubdued}`}>
                  Địa điểm
                </h3>
                <p className={`font-medium ${theme.text}`}>Công viên Tao Đàn</p>
                <p className={`text-sm ${theme.textSubdued}`}>Quận 1, TP.HCM</p>
              </div>
            </div>

            {/* Registration */}
            <div
              className={`p-5 rounded-xl ${theme.card} shadow-sm flex items-center gap-4`}
            >
              <div
                className={`w-12 h-12 ${theme.primaryLight} rounded-full flex items-center justify-center flex-shrink-0`}
              >
                <Clock className={`w-6 h-6 ${theme.primary}`} />
              </div>
              <div>
                <h3 className={`text-sm font-medium ${theme.textSubdued}`}>
                  Hạn đăng ký
                </h3>
                {!timeRemaining.expired ? (
                  <p className={`font-medium ${theme.text}`}>
                    Còn {timeRemaining.days} ngày {timeRemaining.hours} giờ
                  </p>
                ) : (
                  <p className={`font-medium text-red-500`}>
                    Đã hết hạn đăng ký
                  </p>
                )}
                <p className={`text-sm ${theme.textSubdued}`}>10/04/2025</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problems Section - Enhanced with cards */}
      <section className={`py-12 ${theme.card}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className={`text-2xl md:text-3xl font-bold mb-8 text-center ${theme.text}`}
              >
                Bạn có đang gặp những vấn đề này?
              </h2>

              <div className="space-y-3">
                {eventData.problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    className={`p-5 ${
                      index % 3 === 0
                        ? "bg-orange-50 dark:bg-gray-700/90"
                        : index % 3 === 1
                        ? "bg-blue-50 dark:bg-gray-700/80"
                        : "bg-purple-50 dark:bg-gray-700/70"
                    } rounded-lg`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <p className={`${theme.textMuted} flex items-center`}>
                      <AlertTriangle
                        className={`w-4 h-4 mr-3 flex-shrink-0 ${
                          index % 3 === 0
                            ? "text-orange-500 dark:text-orange-400"
                            : index % 3 === 1
                            ? "text-blue-500 dark:text-blue-400"
                            : "text-purple-500 dark:text-purple-400"
                        }`}
                      />
                      {problem}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Event Section */}
      <section id="details" className={`py-14 ${theme.bg}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span
                className={`inline-block px-3 py-1 ${theme.primaryLight} ${theme.primary} rounded-full text-sm font-medium mb-3`}
              >
                GIỚI THIỆU
              </span>

              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${theme.text}`}
              >
                Mentee Gathering là gì?
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className={`prose prose-lg md:prose-xl dark:prose-invert max-w-none mb-10 ${theme.textMuted}`}
              >
                <p>
                  Mentee Gathering là sự kiện đặc biệt được tổ chức dành riêng
                  cho các Mentee của UEH Mentoring qua nhiều mùa. Đây không chỉ
                  là cơ hội để kết nối cộng đồng mà còn mang đến những trải
                  nghiệm thú vị giúp bạn mở rộng mối quan hệ và làm mới bản
                  thân.
                </p>
              </div>

              <div className={`${theme.card} rounded-xl shadow-sm p-6 md:p-8`}>
                <h3 className={`text-xl font-bold mb-6 ${theme.text}`}>
                  Hoạt động hấp dẫn tại sự kiện
                </h3>

                <ul className="space-y-4">
                  {eventData.activities.map((activity, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div
                        className={`flex-shrink-0 w-6 h-6 ${theme.primaryBg} rounded-full flex items-center justify-center mr-3 mt-0.5`}
                      >
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className={theme.textMuted}>{activity}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className={`py-14 ${theme.card}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <span
                className={`inline-block px-3 py-1 ${theme.primaryLight} ${theme.primary} rounded-full text-sm font-medium mb-3`}
              >
                CHI TIẾT
              </span>

              <h2
                className={`text-2xl md:text-3xl font-bold mb-4 ${theme.text}`}
              >
                Thông tin chi tiết về sự kiện
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className={`${
                  theme.primaryLight
                } p-6 rounded-xl shadow-sm border ${
                  isDarkMode ? "border-orange-500/20" : "border-orange-200"
                }`}
              >
                <div className="space-y-5">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${theme.text} mb-2 flex items-center`}
                    >
                      <Clock className="w-5 h-5 mr-2" /> Thời gian
                    </h3>
                    <p className={`text-lg ${theme.primary} font-medium`}>
                      7h30 - 11h00, Chủ Nhật, ngày 13/04/2025
                    </p>
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-semibold ${theme.text} mb-2 flex items-center`}
                    >
                      <MapPin className="w-5 h-5 mr-2" /> Địa điểm
                    </h3>
                    <p className={`text-lg ${theme.primary} font-medium`}>
                      Công viên Tao Đàn - Trương Định, Phường Bến Thành, Quận 1,
                      TP.HCM
                    </p>
                  </div>

                  <div>
                    <h3
                      className={`text-lg font-semibold ${theme.text} mb-2 flex items-center`}
                    >
                      <Users className="w-5 h-5 mr-2" /> Đối tượng tham gia
                    </h3>
                    <p className={theme.textMuted}>
                      Mentee các mùa của UEH Mentoring
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className={`bg-blue-50 dark:bg-gray-700 p-6 rounded-xl shadow-sm border ${
                  isDarkMode ? "border-blue-500/20" : "border-blue-200"
                }`}
              >
                <div className="space-y-5">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${theme.text} mb-2 flex items-center`}
                    >
                      <Calendar className="w-5 h-5 mr-2" /> Hạn chót đăng ký
                    </h3>
                    <p className={theme.textMuted}>23h59 ngày 10/04/2025</p>
                  </div>

                  <div>
                    {!timeRemaining.expired ? (
                      <div
                        className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/20`}
                      >
                        <p
                          className={`text-sm font-medium text-green-700 dark:text-green-300`}
                        >
                          Đăng ký vẫn đang mở!
                        </p>
                        <p
                          className={`text-sm text-green-600 dark:text-green-400`}
                        >
                          Còn {timeRemaining.days} ngày {timeRemaining.hours}{" "}
                          giờ để đăng ký
                        </p>
                      </div>
                    ) : (
                      <div
                        className={`p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/20`}
                      >
                        <p
                          className={`text-sm font-medium text-red-700 dark:text-red-300`}
                        >
                          Đã hết hạn đăng ký
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                      Lưu ý
                    </h3>
                    <p className={theme.textMuted}>
                      Form đăng ký có thể đóng sớm hơn dự kiến khi đủ số lượng
                      tham gia. Hãy nhanh tay đăng ký để không bỏ lỡ cơ hội tham
                      dự sự kiện hấp dẫn này!
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="typeform" className={`py-14 ${theme.bg}`}>
        <div className="container mx-auto px-6">
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
                ĐĂNG KÝ
              </span>

              <h2
                className={`text-2xl md:text-3xl font-bold mb-3 ${theme.text}`}
              >
                Đăng ký tham gia
              </h2>
              <p className={`${theme.textMuted} mb-6 max-w-xl mx-auto`}>
                Điền thông tin vào form dưới đây để đăng ký tham gia sự kiện
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`${theme.card} rounded-xl shadow-md p-6 min-h-[400px]`}
              id="typeform-container"
            >
              <TypeformEmbed />
            </motion.div>

            <div className="mt-4 text-center">
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
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Simplified */}
      <section className={`py-14 ${theme.card} border-t ${theme.divider}`}>
        <div className="container mx-auto px-6">
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
                LIÊN HỆ
              </span>

              <h2
                className={`text-2xl md:text-3xl font-bold mb-3 ${theme.text}`}
              >
                Thông tin liên hệ
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`grid md:grid-cols-2 gap-6`}
            >
              <div className={`p-6 rounded-xl ${theme.bg} shadow-sm`}>
                <h3 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                  Kênh truyền thông
                </h3>

                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${theme.primaryLight} flex items-center justify-center mr-3`}
                    >
                      <Mail className={`h-5 w-5 ${theme.primary}`} />
                    </div>
                    <a
                      href="mailto:uehmentoring@gmail.com"
                      className={`${theme.textMuted} hover:${theme.primary} transition-colors`}
                    >
                      uehmentoring@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${theme.primaryLight} flex items-center justify-center mr-3`}
                    >
                      <Facebook className={`h-5 w-5 ${theme.primary}`} />
                    </div>
                    <a
                      href="https://www.facebook.com/UEHMentoring"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${theme.textMuted} hover:${theme.primary} transition-colors`}
                    >
                      Facebook: UEH Mentoring
                    </a>
                  </li>
                  <li className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full ${theme.primaryLight} flex items-center justify-center mr-3`}
                    >
                      <Globe className={`h-5 w-5 ${theme.primary}`} />
                    </div>
                    <a
                      href="https://uehmentoring.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${theme.textMuted} hover:${theme.primary} transition-colors`}
                    >
                      Website: UEH Mentoring
                    </a>
                  </li>
                </ul>
              </div>

              <div className={`p-6 rounded-xl ${theme.bg} shadow-sm`}>
                <h3 className={`text-xl font-semibold mb-4 ${theme.text}`}>
                  Hotline
                </h3>

                <ul className="space-y-4 mb-6">
                  {eventData.contactPersons.map((person, index) => (
                    <li key={index} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full ${theme.primaryLight} flex items-center justify-center mr-3`}
                      >
                        <Phone className={`h-5 w-5 ${theme.primary}`} />
                      </div>
                      <a
                        href={`tel:${person.phone}`}
                        className={`${theme.textMuted} hover:${theme.primary} transition-colors`}
                      >
                        {person.phone} ({person.name})
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                  <h3 className={`text-lg font-semibold mb-3 ${theme.text}`}>
                    Hashtags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {eventData.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 ${theme.primaryLight} ${theme.primary} rounded-full text-sm`}
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between z-40 shadow-lg">
        <div>
          <p className={`text-sm font-medium ${theme.primary}`}>
            UEH Mentoring
          </p>
          <p className={`text-xs ${theme.textSubdued}`}>13/04/2025</p>
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

export default MenteeGathering;
