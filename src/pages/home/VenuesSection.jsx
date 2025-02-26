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
      EXPLORE VENUES
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

// Event Badge component
const EventBadge = memo(({ count }) => (
  <div
    className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 
    bg-orange-500 text-white rounded-full text-sm font-medium shadow-lg"
  >
    <Calendar className="w-3.5 h-3.5" />
    <span>{count} Events</span>
  </div>
));

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
              <span>Featured Venue</span>
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
                <span>Capacity: {capacity}</span>
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
                View Events
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

// Main component
const VenuesSection = () => {
  const [filter, setFilter] = useState("");

  // Enhanced venue data
  const venues = [
    {
      name: "Madison Square Garden",
      location: "New York, USA",
      capacity: "20,000",
      image:
        "https://cdn.getyourguide.com/img/tour/a7237530a51c73e9c3cbffb53e681009ed5bb0eeb508a05def92b1be03ff4e3f.jpg/145.jpg",
      eventsCount: 18,
      rating: 4.8,
      featured: true,
    },
    {
      name: "O2 Arena",
      location: "London, UK",
      capacity: "18,000",
      image:
        "https://cdn-ilclnep.nitrocdn.com/TxWSlpwrDODMVOywnTPWFGitmqiOLnnV/assets/images/optimized/kotobuki-international.com/wp-content/uploads/2022/10/02-ARENA-LONDON_proyecto_system_10.jpg",
      eventsCount: 12,
      rating: 4.7,
    },
    {
      name: "Staples Center",
      location: "Los Angeles, USA",
      capacity: "19,000",
      image:
        "https://thanhnien.mediacdn.vn/Uploaded/minhtan/2021_11_18/fexueslwyaioa8p-7026.jpg",
      eventsCount: 15,
      rating: 4.6,
    },
    {
      name: "Wembley Stadium",
      location: "London, UK",
      capacity: "90,000",
      image:
        "https://bookings.wembleytours.com/stadiumtours/images/WEMBLEY_INTERIOR.png",
      eventsCount: 8,
      rating: 4.9,
    },
    {
      name: "Toyota Center",
      location: "Houston, USA",
      capacity: "18,300",
      image:
        "https://www.getzippin.com/hubfs/Checking%20In%20Blog%20Photos/Toyota%20Center%2C%20HTX.jpeg",
      eventsCount: 10,
      rating: 4.5,
    },
  ];

  // Filter venues based on search input
  const filteredVenues = filter
    ? venues.filter(
        (venue) =>
          venue.name.toLowerCase().includes(filter.toLowerCase()) ||
          venue.location.toLowerCase().includes(filter.toLowerCase()),
      )
    : venues;

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-900/5 dark:to-transparent -z-10" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-orange-50/30 dark:bg-orange-900/5 rounded-tl-full -z-10" />

      <div className="container mx-auto px-6">
        {/* Section title */}
        <SectionTitle
          title="Popular Venues"
          subtitle="Explore the most iconic event spaces and find upcoming shows"
        />

        {/* Search filter */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-md mx-auto mb-12"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search venues by name or location..."
              value={filter}
              onChange={handleSearchChange}
              className="w-full py-3 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-700
                focus:outline-none focus:ring-2 focus:ring-orange-500/40
                text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Venues grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredVenues.map((venue, index) => (
              <VenueCard key={venue.name} {...venue} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results message */}
        {filteredVenues.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400">
              No venues found matching your search criteria.
            </p>
            <button
              onClick={() => setFilter("")}
              className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* View all venues button */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 
              text-white rounded-lg font-medium inline-flex items-center gap-2
              transition-colors shadow-md hover:shadow-lg"
          >
            View All Venues
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default VenuesSection;
