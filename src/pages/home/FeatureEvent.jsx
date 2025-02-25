import React, { memo } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Star } from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Optimized EventCard component
const EventCard = memo(
  ({ title, date, location, price, image, isFeatured = false }) => {
    return (
      <motion.div
        variants={itemVariants}
        className={`relative rounded-xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-500`}
      >
        <div className={`${isFeatured ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
          <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-gray-900/10 z-10 transition-colors duration-500" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 flex flex-col justify-end z-20">
          {isFeatured && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <Star className="w-3.5 h-3.5 fill-white" />
              <span>Featured</span>
            </div>
          )}

          <div className="space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center gap-2 text-white/90">
              <Calendar className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
              <span className="text-sm">{date}</span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
              {title}
            </h3>

            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
              <span className="text-sm">{location}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              {price ? (
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                  From ${price}
                </span>
              ) : (
                <span className="px-4 py-1.5 bg-orange-500/20 backdrop-blur-sm rounded-full text-orange-300 text-sm">
                  Coming Soon
                </span>
              )}

              <motion.div
                className="w-8 h-8 rounded-full bg-orange-500/0 flex items-center justify-center
                group-hover:bg-orange-500 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  },
);

// Main component
const FeaturedEvents = () => {
  const events = [
    {
      title: "World Cup Finals 2024",
      date: "Dec 15, 2024",
      location: "Qatar",
      image:
        "https://cdnuploads.aa.com.tr/uploads/Contents/2022/12/15/thumbs_b_c_0b4284b0e7eec848abbd00da0cf6689a.jpg?v=201200",
      isFeatured: true,
    },
    {
      title: "EDM Festival 2024",
      date: "Dec 20",
      location: "Miami",
      price: 79,
      image: "https://3kshop.vn/wp-content/uploads/2020/08/nhac-edm.jpg",
    },
    {
      title: "NBA All-Star Game",
      date: "Jan 15",
      location: "Los Angeles",
      price: 129,
      image:
        "https://www.usatoday.com/gcdn/-mm-/6edafaf7998a6f8ce9d21ad9f051d92c7369c7dd/c=115-0-1885-1000/local/-/media/2015/12/03/USATODAY/USATODAY/635847352594650898-adidas-NBA-All-Star-Full-H.jpg?width=660&height=373&fit=crop&format=pjpg&auto=webp",
    },
    {
      title: "Broadway Shows",
      date: "Dec 25",
      location: "New York",
      price: 89,
      image:
        "https://www.hollywoodreporter.com/wp-content/uploads/2023/07/newyorknewyork.jpg?w=1296&h=730&crop=1",
    },
  ];

  return (
    <section className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-orange-50 dark:bg-orange-950/10 rounded-bl-3xl -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-4"
          >
            <span className="w-12 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></span>
            <span className="text-orange-500 font-semibold tracking-wide">
              TRENDING NOW
            </span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            >
              Most Popular Events
            </motion.h2>

            <motion.button
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold group"
            >
              View All Events
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Featured Event */}
          <EventCard {...events[0]} />

          {/* Other Events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {events.slice(1).map((event, index) => (
              <EventCard key={`event-${index}`} {...event} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
