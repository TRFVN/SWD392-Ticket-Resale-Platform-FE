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
    sports: "bg-blue-500",
    music: "bg-purple-500",
    arts: "bg-pink-500",
    other: "bg-orange-500",
  };

  const bgColor = colorMap[category.toLowerCase()] || colorMap.other;

  return (
    <span
      className={`${bgColor} text-white text-xs font-medium px-2.5 py-1 rounded-md`}
    >
      {category}
    </span>
  );
});

// Event Card Actions Component
const CardActions = memo(({ isSaved, onSave, onShare }) => {
  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSave}
        className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        aria-label={isSaved ? "Remove from saved" : "Save event"}
      >
        <Heart
          className={`w-4 h-4 ${
            isSaved ? "fill-red-500 text-red-500" : "text-white"
          }`}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onShare}
        className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors"
        aria-label="Share event"
      >
        <Share2 className="w-4 h-4 text-white" />
      </motion.button>
    </div>
  );
});

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
                      {attendance}% Booked
                    </span>
                    {attendance > 75 && (
                      <span className="text-orange-500 font-medium">
                        Selling Fast
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
                        Starting from
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${price}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-orange-500">
                      Coming Soon
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#f97316" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-1 px-4 py-2 bg-gray-900 dark:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Details
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
            Featured Events
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
        >
          Trending this Month
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <button className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
          Popular
        </button>
        <button className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
          Nearby
        </button>
        <button className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors text-sm font-medium">
          Upcoming
        </button>
      </motion.div>
    </div>
  );
});

// Main FeaturedEvents Component
const FeaturedEvents = () => {
  const events = [
    {
      id: 1,
      title: "World Cup Finals 2024",
      date: "Dec 15, 2024",
      location: "Qatar",
      category: "Sports",
      image:
        "https://cdnuploads.aa.com.tr/uploads/Contents/2022/12/15/thumbs_b_c_0b4284b0e7eec848abbd00da0cf6689a.jpg?v=201200",
      attendance: 85,
    },
    {
      id: 2,
      title: "EDM Festival 2024",
      date: "Dec 20",
      location: "Miami",
      price: 79,
      category: "Music",
      image: "https://3kshop.vn/wp-content/uploads/2020/08/nhac-edm.jpg",
      attendance: 60,
    },
    {
      id: 3,
      title: "NBA All-Star Game",
      date: "Jan 15",
      location: "Los Angeles",
      price: 129,
      category: "Sports",
      image:
        "https://www.usatoday.com/gcdn/-mm-/6edafaf7998a6f8ce9d21ad9f051d92c7369c7dd/c=115-0-1885-1000/local/-/media/2015/12/03/USATODAY/USATODAY/635847352594650898-adidas-NBA-All-Star-Full-H.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp",
      attendance: 45,
    },
    {
      id: 4,
      title: "Broadway Shows Week",
      date: "Dec 25",
      location: "New York",
      price: 89,
      category: "Arts",
      image:
        "https://www.hollywoodreporter.com/wp-content/uploads/2023/07/newyorknewyork.jpg?w=1296&h=730&crop=1",
      attendance: 30,
    },
    {
      id: 5,
      title: "Tech Innovation Summit",
      date: "Jan 10, 2025",
      location: "San Francisco",
      price: 199,
      category: "Other",
      image:
        "https://imageio.forbes.com/specials-images/imageserve/647fa6ca4ade3d3e030e5a2d/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds",
      attendance: 70,
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Modern background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-orange-200/20 to-pink-200/20 dark:from-orange-900/10 dark:to-pink-900/10 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-t from-blue-200/20 to-purple-200/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader />

        {/* Events grid - modern layout */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {/* First event is large (spans 2 rows) */}
          <EventCard {...events[0]} isLarge={true} />

          {/* Other events */}
          {events.slice(1).map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </motion.div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium shadow-md"
          >
            Explore All Events
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(FeaturedEvents);
