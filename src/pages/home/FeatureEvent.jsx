import React, { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Share2,
  Heart,
} from "lucide-react";

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 500 },
  },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", damping: 30, stiffness: 400 },
  },
};

// Category Badge Component
const CategoryBadge = memo(({ category }) => {
  const colorMap = {
    "Âm Nhạc": "bg-purple-500",
    "Hội Chợ": "bg-pink-500",
    "Văn Hóa": "bg-blue-500",
    "Ẩm Thực": "bg-green-500",
    "Lễ Hội": "bg-orange-500",
    "Thể Thao": "bg-yellow-500",
  };

  const bgColor = colorMap[category] || "bg-orange-500";

  return (
    <span
      className={`${bgColor} text-white text-xs font-medium px-2.5 py-1 rounded-md`}
    >
      {category}
    </span>
  );
});
CategoryBadge.displayName = "CategoryBadge";

// Event Card Actions Component
const CardActions = memo(({ isSaved, onSave, onShare }) => {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSave}
        className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        aria-label={isSaved ? "Bỏ lưu" : "Lưu sự kiện"}
      >
        <Heart
          className={`w-4 h-4 ${
            isSaved ? "fill-orange-500 text-orange-500" : "text-white"
          }`}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onShare}
        className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        aria-label="Chia sẻ sự kiện"
      >
        <Share2 className="w-4 h-4 text-white" />
      </motion.button>
    </div>
  );
});
CardActions.displayName = "CardActions";

// Modern Event Card Component
const EventCard = memo(
  ({
    id,
    title,
    date,
    location,
    price,
    image,
    category,
    isLarge = false,
    attendance = 0,
  }) => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = (e) => {
      e.stopPropagation();
      setIsSaved(!isSaved);
    };

    const handleShare = (e) => {
      e.stopPropagation();
      // Share logic
    };

    return (
      <motion.div
        variants={isLarge ? scaleUp : fadeInUp}
        className={`group relative rounded-2xl overflow-hidden ${
          isLarge ? "row-span-2" : ""
        }`}
      >
        {/* Card Inner Container */}
        <div className="relative flex flex-col h-full">
          {/* Image Container */}
          <div
            className={`relative overflow-hidden ${isLarge ? "h-80" : "h-52"}`}
          >
            <motion.img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out"
              whileHover={{ scale: 1.05 }}
              loading="lazy"
            />

            {/* Top overlay for category & actions */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
              <CategoryBadge category={category} />
              <CardActions
                isSaved={isSaved}
                onSave={handleSave}
                onShare={handleShare}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* Content */}
          <div className="flex-1 p-5 bg-white dark:bg-gray-900">
            <div className="flex flex-col h-full">
              {/* Date and Location */}
              <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h3>

              {/* Attendance Indicator for larger cards */}
              {isLarge && attendance > 0 && (
                <div className="mt-2 mb-4">
                  <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                      style={{ width: `${Math.min(attendance, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {attendance}% Đã Đặt
                    </span>
                    {attendance > 75 && (
                      <span className="text-orange-500 font-medium">
                        Sắp Hết Vé
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Empty space to push price and action to bottom */}
              <div className="flex-grow"></div>

              {/* Price and action button */}
              <div className="flex items-center justify-between mt-3">
                <div>
                  {price ? (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Từ
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {price}đ
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-orange-500">
                      Sắp Ra Mắt
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#f97316" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 dark:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Chi Tiết
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);
EventCard.displayName = "EventCard";

// Featured Section Header
const SectionHeader = memo(() => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10">
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
          <span className="text-orange-500 dark:text-orange-400 font-medium uppercase tracking-wider text-sm">
            Sự Kiện Nổi Bật
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
        >
          Khám Phá Các Sự Kiện <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
            Đặc Sắc Nhất
          </span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          className="flex items-center gap-2 text-gray-700 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors group"
          aria-label="Xem tất cả sự kiện"
        >
          <span className="font-medium">Xem Tất Cả</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
});
SectionHeader.displayName = "SectionHeader";

// Main Featured Events Component
const FeaturedEvents = () => {
  // Sample featured event data
  const featuredEvents = [
    {
      id: 1,
      title: "Lễ Hội Áo Dài TP.HCM 2024",
      date: "28 Th4 - 05 Th5, 2024",
      location: "Phố đi bộ Nguyễn Huệ, TP.HCM",
      price: "150.000",
      image:
        "https://images.unsplash.com/photo-1561121692-bc2450c5a86a?q=80&w=800&auto=format&fit=crop",
      category: "Văn Hóa",
      attendance: 85,
      isLarge: true,
    },
    {
      id: 2,
      title: "Đêm Nhạc Trịnh Công Sơn",
      date: "15 Th5, 2024",
      location: "Nhà Hát Hòa Bình, TP.HCM",
      price: "350.000",
      image:
        "https://images.unsplash.com/photo-1577398977702-77f1af5a9a36?q=80&w=800&auto=format&fit=crop",
      category: "Âm Nhạc",
      attendance: 65,
    },
    {
      id: 3,
      title: "Liên Hoan Ẩm Thực Việt Nam",
      date: "01-03 Th6, 2024",
      location: "Công viên 23/9, TP.HCM",
      price: "100.000",
      image:
        "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?q=80&w=800&auto=format&fit=crop",
      category: "Ẩm Thực",
      attendance: 50,
    },
    {
      id: 4,
      title: "Hội Chợ Làng Nghề Truyền Thống",
      date: "20-25 Th6, 2024",
      location: "Bảo tàng Dân tộc học, Hà Nội",
      price: "80.000",
      image:
        "https://images.unsplash.com/photo-1559828135-b26e7d8121c9?q=80&w=800&auto=format&fit=crop",
      category: "Hội Chợ",
      attendance: 40,
    },
    {
      id: 5,
      title: "Lễ Hội Trung Thu",
      date: "15 Th9, 2024",
      location: "Phố Cổ Hà Nội",
      price: null,
      image:
        "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?q=80&w=800&auto=format&fit=crop",
      category: "Lễ Hội",
      attendance: 0,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-6">
        <SectionHeader />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto"
        >
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
              className={
                event.isLarge ? "md:col-span-2 lg:col-span-1 row-span-2" : ""
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
