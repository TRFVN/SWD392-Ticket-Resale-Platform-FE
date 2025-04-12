import React, { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Share2,
  Heart,
  ArrowRightCircle,
  Sparkles,
  Clock,
  Ticket,
  TrendingUp,
  Star,
} from "lucide-react";

// ====== UTILS & CONSTANTS ======
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    day: date.getDate(),
    month: date.toLocaleString("vi-VN", { month: "short" }),
    weekday: date.toLocaleString("vi-VN", { weekday: "long" }),
    year: date.getFullYear(),
    time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    full: new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    }).format(date),
    shortFormat: new Intl.DateTimeFormat("vi-VN", {
      day: "numeric",
      month: "short",
    }).format(date),
  };
};

// Category colors with futuristic gradients
const CATEGORY_STYLES = {
  "Âm Nhạc": {
    gradient: "from-violet-600 to-indigo-600",
    bgLight: "bg-violet-50 dark:bg-violet-900/20",
    icon: "🎵",
    iconBg: "bg-violet-500",
  },
  "Hội Chợ": {
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    icon: "🛍️",
    iconBg: "bg-fuchsia-500",
  },
  "Văn Hóa": {
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50 dark:bg-blue-900/20",
    icon: "🏛️",
    iconBg: "bg-blue-500",
  },
  "Ẩm Thực": {
    gradient: "from-emerald-500 to-green-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "🍽️",
    iconBg: "bg-emerald-500",
  },
  "Lễ Hội": {
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-900/20",
    icon: "🎭",
    iconBg: "bg-amber-500",
  },
  "Thể Thao": {
    gradient: "from-yellow-500 to-amber-600",
    bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "⚽",
    iconBg: "bg-yellow-500",
  },
  Talkshow: {
    gradient: "from-indigo-600 to-blue-700",
    bgLight: "bg-indigo-50 dark:bg-indigo-900/20",
    icon: "🎤",
    iconBg: "bg-indigo-600",
  },
  Workshop: {
    gradient: "from-teal-500 to-emerald-600",
    bgLight: "bg-teal-50 dark:bg-teal-900/20",
    icon: "🛠️",
    iconBg: "bg-teal-500",
  },
  Gathering: {
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50 dark:bg-sky-900/20",
    icon: "👥",
    iconBg: "bg-sky-500",
  },
  "Beauty Pageant": {
    gradient: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50 dark:bg-pink-900/20",
    icon: "👑",
    iconBg: "bg-pink-500",
  },
  Seminar: {
    gradient: "from-purple-600 to-indigo-700",
    bgLight: "bg-purple-50 dark:bg-purple-900/20",
    icon: "📚",
    iconBg: "bg-purple-600",
  },
};

// Default style for categories not in the map
const DEFAULT_CATEGORY = {
  gradient: "from-gray-600 to-gray-700",
  bgLight: "bg-gray-50 dark:bg-gray-800/30",
  icon: "🎟️",
  iconBg: "bg-gray-600",
};

// ====== ANIMATIONS ======
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.8
    }
  },
};

const sliderVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: i => ({
    opacity: 1, 
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  }),
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.03, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 3, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ====== COMPONENTS ======

// FuturisticCategoryBadge Component
const FuturisticCategoryBadge = memo(({ category }) => {
  const style = CATEGORY_STYLES[category] || DEFAULT_CATEGORY;

  return (
    <div 
      className={`flex items-center gap-1.5 bg-gradient-to-r ${style.gradient} text-white text-xs font-medium px-2 py-1 rounded-lg shadow-sm backdrop-blur-sm`}
    >
      <span className="text-xs">{style.icon}</span>
      <span>{category}</span>
    </div>
  );
});
FuturisticCategoryBadge.displayName = "FuturisticCategoryBadge";

// FuturisticDateBadge Component
const FuturisticDateBadge = memo(({ date }) => {
  const eventDate = formatDate(date);
  
  return (
    <div className="flex items-center gap-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg px-2.5 py-1 text-xs font-medium border border-white/30 dark:border-white/10 shadow-sm">
      <span className="text-orange-500">
        <Calendar className="w-3.5 h-3.5" />
      </span>
      <span className="text-gray-800 dark:text-white">{eventDate.shortFormat}</span>
    </div>
  );
});
FuturisticDateBadge.displayName = "FuturisticDateBadge";

// FuturisticEventCard Component
const FuturisticEventCard = memo(({ event, index = 0 }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isDarkMode = useSelector(state => state.theme?.isDarkMode);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  
  const eventDate = formatDate(event.date);
  const categoryStyle = CATEGORY_STYLES[event.category] || DEFAULT_CATEGORY;
  
  // Calculate availability
  const availability = event.totalTickets > 0
    ? Math.round((event.availableTickets / event.totalTickets) * 100)
    : 100;

  const getAvailabilityColor = () => {
    if (availability <= 20) return "text-red-500";
    if (availability <= 50) return "text-orange-500";
    return "text-emerald-500";
  };

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.subtitle,
        url: window.location.origin + event.link,
      }).catch(err => console.log('Error sharing', err));
    }
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sliderVariants}
      whileHover="hover"
      className={`group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-white to-gray-50'} shadow-xl ${event.isHighlighted ? 'ring-2 ring-orange-500' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Holographic effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <Link to={event.link} className="block h-full">
        <div className="relative h-full flex flex-col">
          {/* Image container */}
          <div className="relative h-[55%] overflow-hidden">
            {/* Image with hover effect */}
            <motion.div 
              animate={{
                scale: isHovered ? 1.05 : 1,
                filter: isHovered ? "brightness(1.1)" : "brightness(1)"
              }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            
            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
              <FuturisticCategoryBadge category={event.category} />
              
              {/* Actions */}
              <div className="flex gap-1.5">
                <button 
                  onClick={handleSave}
                  className="p-1.5 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors"
                  aria-label={isSaved ? "Unsave event" : "Save event"}
                >
                  <Heart 
                    className={`w-3.5 h-3.5 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-white'}`} 
                  />
                </button>
                
                <button 
                  onClick={handleShare}
                  className="p-1.5 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors"
                  aria-label="Share event"
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Date badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <FuturisticDateBadge date={event.date} />
            </div>

            {/* Trending badge - only show for popular events */}
            {event.isHighlighted && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-medium px-2 py-0.5 rounded-lg shadow-md backdrop-blur-sm z-10">
                <TrendingUp className="w-3 h-3" />
                <span>Trending</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {event.title}
            </h3>
            
            <AnimatePresence>
              {(isHovered || event.isLarge) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {event.subtitle}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
            
            {/* Ticket availability section */}
            {event.totalTickets > 0 && (
              <div className="mt-auto pt-3">
                {/* Progress bar */}
                <div className="mb-1.5">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">
                      <span className={`font-medium ${getAvailabilityColor()}`}>
                        {event.availableTickets}
                      </span> / {event.totalTickets} vé
                    </span>
                    <span className={`font-medium ${getAvailabilityColor()}`}>
                      {availability}%
                    </span>
                  </div>
                  
                  {/* Custom progress bar */}
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${availability}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                      className={`h-full ${
                        availability <= 20
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : availability <= 50
                          ? "bg-gradient-to-r from-orange-500 to-amber-500"
                          : "bg-gradient-to-r from-emerald-500 to-green-500"
                      }`}
                    />
                  </div>
                </div>
                
                {/* Low ticket warning */}
                {availability <= 20 && (
                  <div className="flex gap-1.5 items-center text-red-500 dark:text-red-400 text-xs font-medium mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Sắp hết vé, nhanh tay đặt ngay!</span>
                  </div>
                )}
              </div>
            )}

            {/* View details button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10 
              }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <div className="w-full px-3 py-1.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5">
                Xem Chi Tiết
                <ArrowRightCircle className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>
        </div>
      </Link>

      {/* Effect for highlighted events */}
      {event.isHighlighted && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500/30 to-rose-500/30 blur-sm -z-10"></div>
      )}
    </motion.div>
  );
});
FuturisticEventCard.displayName = "FuturisticEventCard";

// HeroEventCard - Futuristic spotlight event component
const HeroEventCard = memo(({ event }) => {
  const eventDate = formatDate(event.date);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Handle mouse move effect
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2
    });
  };

  return (
    <motion.div 
      ref={containerRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group shadow-xl"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight effect follower */}
      <div 
        className="pointer-events-none absolute -inset-px bg-gradient-to-r from-orange-600/20 to-rose-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl rounded-2xl"
        style={{ 
          backgroundPosition: `${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%`,
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` 
        }}
      ></div>

      {/* Image with parallax effect */}
      <div className="absolute inset-0">
        <motion.img 
          src={event.image} 
          alt={event.title}
          style={{ 
            scale: 1.1,
            x: mousePosition.x * -10,
            y: mousePosition.y * -10
          }}
          transition={{ type: "spring", stiffness: 100, damping: 30, mass: 0.5 }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="px-8 py-6 max-w-2xl"
        >
          <motion.div variants={slideUp} className="mb-4">
            <FuturisticCategoryBadge category={event.category} />
          </motion.div>

          <motion.h2 
            variants={slideUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight"
          >
            {event.title}
          </motion.h2>

          <motion.p 
            variants={slideUp}
            className="text-white/90 mb-6 text-base md:text-lg line-clamp-2"
          >
            {event.subtitle}
          </motion.p>

          <motion.div 
            variants={slideUp}
            className="flex flex-wrap gap-3 mb-6"
          >
            {/* Date/time */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
              <Calendar className="w-4 h-4 text-orange-400" />
              <span className="text-white text-sm">{eventDate.full}</span>
            </div>

            {/* Location */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span className="text-white text-sm truncate max-w-[200px]">
                {event.location}
              </span>
            </div>

            {/* Tickets */}
            {event.availableTickets > 0 && (
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                <Ticket className="w-4 h-4 text-orange-400" />
                <span className="text-white text-sm">
                  {event.availableTickets} vé còn trống
                </span>
              </div>
            )}
          </motion.div>

          <motion.div variants={slideUp}>
            <Link 
              to={event.link}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg font-medium transition-colors shadow-md group/btn"
            >
              Xem Chi Tiết
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Hover effect border */}
      <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
    </motion.div>
  );
});
HeroEventCard.displayName = "HeroEventCard";

// FeaturedEventStrip - Compact event card for secondary featured events
const FeaturedEventStrip = memo(({ event, index }) => {
  const eventDate = formatDate(event.date);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sliderVariants}
      whileHover="hover"
      className="relative h-[180px] rounded-xl overflow-hidden shadow-md group"
    >
      <Link to={event.link}>
        <div className="absolute inset-0">
          {/* Background image */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/30 group-hover:via-black/50 transition-colors"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-4">
          <div className="flex items-center justify-between mb-2">
            <FuturisticCategoryBadge category={event.category} />
            
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
              <Calendar className="w-3 h-3 text-orange-400" />
              <span className="text-white/90 text-xs">{eventDate.shortFormat}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <Users className="w-3 h-3 flex-shrink-0" />
              <span>{event.availableTickets} chỗ</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-orange-300 text-xs font-medium transition-opacity duration-300">
              Xem Chi Tiết
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
FeaturedEventStrip.displayName = "FeaturedEventStrip";

// SectionHeading - Futuristic section heading
const SectionHeading = memo(() => {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: true, amount: 0.5 });
  
  return (
    <motion.div
      ref={headingRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerChildren}
      className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16"
    >
      <div>
        {/* Badge */}
        <motion.div 
          variants={slideUp}
          className="flex items-center gap-2 mb-3"
        >
          <div className="relative flex">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <motion.div 
              variants={pulseAnimation} 
              animate="animate"
              className="absolute -inset-1.5 rounded-full bg-orange-500/20 -z-10"
            ></motion.div>
          </div>
          
          <span className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text font-semibold tracking-wide uppercase text-sm">
            Trending Events
          </span>
        </motion.div>
        
        {/* Main heading */}
        <motion.h2
          variants={slideUp}
          className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
        >
          Khám Phá Sự Kiện 
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            {" "}Nổi Bật
          </span>
        </motion.h2>
      </div>

      {/* "View all" button */}
      <motion.div variants={slideUp}>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium transition-colors group"
        >
          Khám phá tất cả
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  );
});
SectionHeading.displayName = "SectionHeading";

// ====== MAIN COMPONENT ======
const FuturisticEvents = () => {
  // Primary Events for showcase
  const primaryEvents = [
    {
      id: "critical-thinking-2025",
      title: 'TALKSHOW "BẬT" TƯ DUY - "TUNG" PHẢN BIỆN',
      subtitle:
        'Sự kiện có 1-0-2 giúp bạn tránh bị "dắt mũi" và trở thành người có tư duy sắc bén!',
      date: "2025-04-13T08:30:00.000Z",
      location: "SIHUB, 273 Điện Biên Phủ, Quận 3, TP. HCM",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b8?q=80&w=1470&auto=format&fit=crop",
      link: "/critical-thinking-event",
      category: "Talkshow",
      availableTickets: 200,
      totalTickets: 200,
      isHighlighted: true,
    },
    {
      id: "miss-universe-2025",
      title: "MISS UNIVERSE VIETNAM 2025",
      subtitle:
        "BUILDING YOUR UNIVERSE - Dare to dream, dare to lead. Gặp gỡ đương kim Miss Universe 2024 và học hỏi bí quyết xây dựng thương hiệu cá nhân.",
      date: "2025-05-15T19:00:00.000Z",
      location: "Nhà thi đấu Phú Thọ, Quận 11, TP.HCM",
      image:
        "https://images.unsplash.com/photo-1674574124649-778f9afc0e9c?q=80&w=1470&auto=format&fit=crop",
      link: "/miss-universe-event",
      category: "Beauty Pageant",
      availableTickets: 500,
      totalTickets: 1000,
      isHighlighted: true,
    },
    {
      id: "mentee-gathering-2025",
      title: "MENTEE GATHERING 2025",
      subtitle:
        "Gặp gỡ và kết nối với các mentee từ các mùa trước của UEH Mentoring",
      date: "2025-04-13T07:30:00.000Z",
      location:
        "Công viên Tao Đàn, Trương Định, Phường Bến Thành, Quận 1, TP.HCM",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
      link: "/mentee-gathering",
      category: "Gathering",
      availableTickets: 150,
      totalTickets: 200,
      isHighlighted: true,
    },
  ];

  // Regular trending events
  const trendingEvents = [
    {
      id: "le-hoi-ao-dai-2024",
      title: "Lễ Hội Áo Dài TP.HCM 2025",
      subtitle: "Nét văn hóa truyền thống được tôn vinh qua trang phục áo dài",
      date: "2025-04-28T09:00:00.000Z",
      location: "Phố đi bộ Nguyễn Huệ, TP.HCM",
      price: "150.000",
      image:
        "https://images.unsplash.com/photo-1561121692-bc2450c5a86a?q=80&w=800&auto=format&fit=crop",
      link: "/events/le-hoi-ao-dai",
      category: "Văn Hóa",
      availableTickets: 150,
      totalTickets: 1000,
      isLarge: true,
    },
    {
      id: "dem-nhac-trinh-cong-son",
      title: "Đêm Nhạc Trịnh Công Sơn",
      subtitle:
        "Đắm chìm trong những giai điệu bất hủ của nhạc sĩ Trịnh Công Sơn",
      date: "2025-05-15T19:30:00.000Z",
      location: "Nhà Hát Hòa Bình, TP.HCM",
      price: "350.000",
      image:
        "https://images.unsplash.com/photo-1577398977702-77f1af5a9a36?q=80&w=800&auto=format&fit=crop",
      link: "/events/dem-nhac-trinh",
      category: "Âm Nhạc",
      availableTickets: 350,
      totalTickets: 1000,
    },
    {
      id: "lien-hoan-am-thuc",
      title: "Liên Hoan Ẩm Thực Việt Nam",
      subtitle: "Khám phá hương vị ẩm thực đa dạng và phong phú của Việt Nam",
      date: "2025-06-01T10:00:00.000Z",
      location: "Công viên 23/9, TP.HCM",
      price: "100.000",
      image:
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop",
      link: "/events/lien-hoan-am-thuc",
      category: "Ẩm Thực",
      availableTickets: 500,
      totalTickets: 1000,
    },
    {
      id: "hoi-cho-lang-nghe",
      title: "Hội Chợ Làng Nghề Truyền Thống",
      subtitle:
        "Giới thiệu và quảng bá các sản phẩm làng nghề truyền thống của Việt Nam",
      date: "2025-06-20T08:00:00.000Z",
      location: "Bảo tàng Dân tộc học, Hà Nội",
      price: "80.000",
      image:
        "https://images.unsplash.com/photo-1559828135-b26e7d8121c9?q=80&w=800&auto=format&fit=crop",
      link: "/events/hoi-cho-lang-nghe",
      category: "Hội Chợ",
      availableTickets: 400,
      totalTickets: 1000,
    },
    {
      id: "le-hoi-trung-thu",
      title: "Lễ Hội Trung Thu",
      subtitle:
        "Lễ hội truyền thống với nhiều hoạt động vui chơi và giải trí cho trẻ em",
      date: "2025-09-15T18:00:00.000Z",
      location: "Phố Cổ Hà Nội",
      price: null,
      image:
        "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=800&auto=format&fit=crop",
      link: "/events/le-hoi-trung-thu",
      category: "Lễ Hội",
      availableTickets: 0,
      totalTickets: 0,
      isHighlighted: true,
    },
    {
      id: "workshop-ux-design",
      title: "Workshop UX Design for Beginners",
      subtitle: "Học cách thiết kế trải nghiệm người dùng từ các chuyên gia hàng đầu",
      date: "2025-07-20T09:00:00.000Z",
      location: "Dreamplex Coworking Space, TP.HCM",
      price: "450.000",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop",
      link: "/events/workshop-ux-design",
      category: "Workshop",
      availableTickets: 50,
      totalTickets: 100,
    },
  ];

  // Container scroll effect for parallaxx
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"] 
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  
  return (
    <section 
      ref={containerRef}
      className="relative py-16 lg:py-24 overflow-hidden"
    >
      {/* Futuristic background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-orange-500/5 to-transparent"
        ></div>
        
        {/* Animated circles */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-orange-500/10 to-pink-500/10 blur-3xl"
        ></motion.div>
        
        <motion.div 
          style={{ y: y2, opacity }}
          className="absolute -bottom-[100px] -left-[100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl"
        ></motion.div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iLjAyIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTYwIDBoLTFWNjBIMFY1OWg1OVYxSDYweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-30"></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Heading */}
        <SectionHeading />

        {/* Hero section with featured events */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-20">
          {/* Main hero event */}
          <div className="md:col-span-8">
            <HeroEventCard event={primaryEvents[0]} />
          </div>

          {/* Side featured events */}
          <div className="md:col-span-4 space-y-6">
            {primaryEvents.slice(1).map((event, index) => (
              <FeaturedEventStrip 
                key={event.id} 
                event={event}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Grid of events */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
          {trendingEvents.map((event, index) => (
            <FuturisticEventCard
              key={event.id}
              event={event}
              index={index}
              className={event.isLarge ? "sm:col-span-2 lg:col-span-1" : ""}
            />
          ))}
        </div>

        {/* "View all events" button - with futuristic styling */}
        <div className="mt-16 text-center">
          <Link to="/events">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="relative inline-block group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-80 transition duration-300"></div>
              <div className="relative px-8 py-4 bg-white dark:bg-gray-800 rounded-lg leading-none flex items-center gap-2 group-hover:bg-opacity-90 transition duration-300">
                <span className="text-gray-800 dark:text-white font-medium">Khám phá tất cả sự kiện</span>
                <ArrowRight className="w-5 h-5 text-orange-500 dark:text-orange-400 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FuturisticEvents;
