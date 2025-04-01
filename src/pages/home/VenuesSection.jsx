import React, { memo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Calendar,
  Star,
  ChevronRight,
  Search,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Optimized Section Title component
const SectionTitle = memo(({ title, subtitle }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="text-center mb-16"
  >
    <motion.div
      variants={itemVariants}
      className="inline-block px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 
        text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4"
    >
      ĐỊA ĐIỂM
    </motion.div>

    <motion.h2
      variants={itemVariants}
      className="text-4xl font-bold mb-4 text-gray-900 dark:text-white"
    >
      {title}
    </motion.h2>

    <motion.p
      variants={itemVariants}
      className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
    >
      {subtitle}
    </motion.p>
  </motion.div>
));

SectionTitle.displayName = "SectionTitle";

// Event Badge component
const EventBadge = memo(({ count }) => (
  <div
    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 
    bg-orange-500 text-white rounded-full text-sm font-medium shadow-lg"
  >
    <Calendar className="w-3.5 h-3.5" />
    <span>{count} Sự kiện</span>
  </div>
));

EventBadge.displayName = "EventBadge";

// Rating component
const Rating = memo(({ rating }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-orange-400 fill-orange-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />,
    );
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-1 text-white/90 text-sm">{rating}/5</span>
    </div>
  );
});

Rating.displayName = "Rating";

// Enhanced Venue Card
const VenueCard = memo(
  ({
    name,
    location,
    capacity,
    image,
    eventsCount,
    rating,
    featured,
    index,
  }) => {
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -10 }}
        className={`group relative rounded-xl overflow-hidden shadow-md ${
          featured ? "md:col-span-2 lg:col-span-2" : ""
        }`}
      >
        {/* Main image */}
        <div className={`${featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10 
          group-hover:from-black/40 group-hover:to-black/90 transition-colors duration-300"
          />
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
          {/* Events badge */}
          {eventsCount && <EventBadge count={eventsCount} />}

          {/* Featured tag */}
          {featured && (
            <div
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 
            bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
            >
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Địa điểm nổi bật</span>
            </div>
          )}

          {/* Main content */}
          <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-300 transition-colors">
              {name}
            </h3>

            {/* Rating */}
            {rating && (
              <div className="mb-4">
                <Rating rating={rating} />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Users className="w-4 h-4 text-orange-400" />
                <span>Sức chứa: {capacity}</span>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-5">
              <motion.button
                whileHover={{ x: 5 }}
                className="px-4 py-2 text-white bg-orange-500/20 hover:bg-orange-500/30 
                rounded-full backdrop-blur-sm flex items-center gap-2 text-sm font-medium
                transition-colors duration-300 group-hover:bg-orange-500"
              >
                Xem sự kiện
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

VenueCard.displayName = "VenueCard";

// Main component
const VenuesSection = () => {
  const [filter, setFilter] = useState("");

  // Enhanced venue data with Vietnamese venues
  const venues = [
    {
      name: "Nhà hát Thành phố Hồ Chí Minh",
      location: "Quận 1, TP.HCM",
      capacity: "1,800 người",
      image:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      eventsCount: "45",
      rating: 4.8,
      featured: true,
    },
    {
      name: "Trung tâm Hội nghị Quốc gia",
      location: "Nam Từ Liêm, Hà Nội",
      capacity: "3,800 người",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      eventsCount: "38",
      rating: 4.7,
    },
    {
      name: "Cung Văn hóa Lao động",
      location: "Quận 1, TP.HCM",
      capacity: "2,500 người",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
      eventsCount: "32",
      rating: 4.6,
    },
    {
      name: "Trung tâm Triển lãm Giảng Võ",
      location: "Đống Đa, Hà Nội",
      capacity: "1,500 người",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      eventsCount: "28",
      rating: 4.5,
    },
    {
      name: "Nhà văn hóa Thanh niên",
      location: "Quận 1, TP.HCM",
      capacity: "1,200 người",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
      eventsCount: "25",
      rating: 4.4,
    },
    {
      name: "Cung Thiếu nhi Hà Nội",
      location: "Ba Đình, Hà Nội",
      capacity: "800 người",
      image:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      eventsCount: "20",
      rating: 4.3,
    },
  ];

  // Filter venues based on search input
  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(filter.toLowerCase()) ||
      venue.location.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/5 rounded-full translate-y-1/2 translate-x-1/4 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle
          title="Khám Phá Địa Điểm Tổ Chức"
          subtitle="Tìm địa điểm hoàn hảo cho sự kiện của bạn"
        />

        {/* Search bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700 focus:border-orange-500 
                focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
            />
          </div>
        </motion.div>

        {/* Venues grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredVenues.map((venue, index) => (
              <VenueCard key={venue.name} {...venue} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default VenuesSection;
